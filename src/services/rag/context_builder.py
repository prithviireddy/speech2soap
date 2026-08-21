"""
context_builder.py

Formats retrieved ChromaDB chunks into a structured LLM prompt context.
Groups chunks by document_type with clear section headers for readability.
Deduplicates by source_id to avoid repeating the same record.
"""

from collections import defaultdict

# Order and labels for section headers in the context
_TYPE_LABELS = {
    "consultation_report":    "Consultation Reports",
    "consultation_transcript": "Consultation Transcripts",
    "consultation_meta":      "Consultation Notes",
    "medication":             "Medications",
    "followup":               "Follow-up Records",
}

_MIN_RELEVANCE = 0.30  # drop very low-relevance chunks


def build_context(chunks: list[dict]) -> str:
    """
    Build a structured context string from retrieved chunks.

    Args:
        chunks: List of result dicts from vector_store.query_patient().

    Returns:
        A formatted string to inject into the LLM prompt as context.
    """
    # Filter low-relevance chunks
    chunks = [c for c in chunks if c.get("relevance", 0) >= _MIN_RELEVANCE]

    if not chunks:
        return "No relevant patient records were found for this query."

    # Group by document_type
    by_type: dict[str, list[dict]] = defaultdict(list)
    seen_source_ids: set[str] = set()

    for chunk in sorted(chunks, key=lambda c: c["relevance"], reverse=True):
        source_id = chunk["metadata"].get("source_id", chunk["id"])
        # Allow multiple chunks per source_id (different sections of same report)
        by_type[chunk["metadata"].get("document_type", "other")].append(chunk)

    parts: list[str] = []

    for doc_type, type_chunks in by_type.items():
        label = _TYPE_LABELS.get(doc_type, doc_type.replace("_", " ").title())
        parts.append(f"=== {label} ===")

        for chunk in type_chunks:
            meta = chunk["metadata"]
            title = meta.get("title", "")
            relevance = chunk.get("relevance", 0)
            text = chunk["text"]

            parts.append(f"[{title}] (relevance: {relevance:.0%})\n{text}")

        parts.append("")  # blank line between sections

    return "\n".join(parts).strip()


def extract_source_citations(chunks: list[dict]) -> list[dict]:
    """
    Extract unique source citations from retrieved chunks for the API response.
    Deduplicates by source_id, keeping the highest-relevance occurrence.

    Returns:
        List of citation dicts for inclusion in RagAnswer.sources.
    """
    chunks = [c for c in chunks if c.get("relevance", 0) >= _MIN_RELEVANCE]

    # Deduplicate: keep best-relevance chunk per (source_id, section)
    # We deduplicate at the source level (not section level) for clean UI
    seen: dict[str, dict] = {}
    for chunk in sorted(chunks, key=lambda c: c["relevance"], reverse=True):
        meta = chunk["metadata"]
        source_id = meta.get("source_id", chunk["id"])
        if source_id not in seen:
            seen[source_id] = chunk

    citations = []
    for source_id, chunk in seen.items():
        meta = chunk["metadata"]
        # Short excerpt — first 150 chars of the chunk text
        text = chunk["text"]
        excerpt = text[:150].strip()
        if len(text) > 150:
            excerpt += "…"

        citations.append({
            "type":      meta.get("document_type", "unknown"),
            "id":        source_id,
            "title":     meta.get("title", ""),
            "excerpt":   excerpt,
            "relevance": chunk.get("relevance", 0),
            "url":       meta.get("url") or None,
        })

    # Sort by relevance descending
    citations.sort(key=lambda c: c["relevance"], reverse=True)
    return citations
