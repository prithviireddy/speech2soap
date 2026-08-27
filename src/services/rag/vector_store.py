"""
vector_store.py

ChromaDB wrapper for patient-scoped clinical document storage and retrieval.

Collections:
    patient_{patient_id} — one collection per patient, contains all their
                            indexed clinical documents (reports, transcripts,
                            medications, followups, consultation meta).

ChromaDB persists to disk at data/chroma_db/ (project root).
"""

from pathlib import Path
import chromadb
from chromadb.config import Settings

from src.services.rag.embedder import embed_texts, embed_query

#  Persist path 

_BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent  # project root
_CHROMA_PATH = _BASE_DIR / "data" / "chroma_db"
_CHROMA_PATH.mkdir(parents=True, exist_ok=True)

#  Client (module-level singleton) 

_chroma_client: chromadb.ClientAPI | None = None


def _get_client() -> chromadb.ClientAPI:
    global _chroma_client
    if _chroma_client is None:
        _chroma_client = chromadb.PersistentClient(
            path=str(_CHROMA_PATH),
            settings=Settings(anonymized_telemetry=False),
        )
    return _chroma_client


def _collection_name(patient_id: str) -> str:
    # ChromaDB collection names must be 3-63 chars, alphanumeric + hyphens/underscores
    return f"patient_{str(patient_id).replace('-', '_')}"


#  Public API 

def patient_collection_exists(patient_id: str) -> bool:
    """Check whether a ChromaDB collection for this patient already exists."""
    client = _get_client()
    name = _collection_name(patient_id)
    existing = [c.name for c in client.list_collections()]
    return name in existing


def delete_patient_collection(patient_id: str) -> None:
    """Delete and recreate the patient collection (used for reindex)."""
    client = _get_client()
    name = _collection_name(patient_id)
    try:
        client.delete_collection(name)
    except Exception:
        pass  # collection may not exist yet


def upsert_patient_documents(patient_id: str, documents: list[dict]) -> int:
    """
    Embed and upsert documents into the patient's ChromaDB collection.
    Uses ChromaDB's built-in upsert for idempotency.

    Args:
        patient_id: The patient UUID string.
        documents:  List of {"id", "text", "metadata"} dicts from document_builder.

    Returns:
        Number of documents upserted.
    """
    if not documents:
        return 0

    client = _get_client()
    collection = client.get_or_create_collection(
        name=_collection_name(patient_id),
        metadata={"hnsw:space": "cosine"},
    )

    ids       = [d["id"]       for d in documents]
    texts     = [d["text"]     for d in documents]
    metadatas = [d["metadata"] for d in documents]

    # Sanitize metadata — ChromaDB requires all values to be str, int, float, or bool
    clean_metadatas = []
    for m in metadatas:
        clean = {}
        for k, v in m.items():
            if v is None:
                clean[k] = ""
            elif isinstance(v, (str, int, float, bool)):
                clean[k] = v
            else:
                clean[k] = str(v)
        clean_metadatas.append(clean)

    embeddings = embed_texts(texts)

    collection.upsert(
        ids=ids,
        documents=texts,
        embeddings=embeddings,
        metadatas=clean_metadatas,
    )

    return len(documents)


def query_patient(
    patient_id: str,
    query_text: str,
    n_results: int = 6,
) -> list[dict]:
    """
    Retrieve the most relevant documents for a query, scoped to one patient.

    Returns:
        List of result dicts:
        {
            "id":        str,
            "text":      str,
            "metadata":  dict,
            "distance":  float,   # lower = more similar (cosine distance)
            "relevance": float,   # 1 - distance, higher = more relevant
        }
    """
    client = _get_client()
    name = _collection_name(patient_id)

    try:
        collection = client.get_collection(name)
    except Exception:
        return []  # collection doesn't exist yet

    query_embedding = embed_query(query_text)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(n_results, collection.count()),
        where={"patient_id": str(patient_id)},
        include=["documents", "metadatas", "distances"],
    )

    if not results["ids"] or not results["ids"][0]:
        return []

    output = []
    for i, doc_id in enumerate(results["ids"][0]):
        distance = results["distances"][0][i]
        output.append({
            "id":        doc_id,
            "text":      results["documents"][0][i],
            "metadata":  results["metadatas"][0][i],
            "distance":  distance,
            "relevance": round(max(0.0, 1.0 - distance), 4),
        })

    return output
