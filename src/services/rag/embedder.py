"""
embedder.py

Wraps gemini-embedding-2 for document and query embedding.

Key fix: embed_content treats a list of strings as a single multi-part
document (multi-turn), NOT as separate documents. Each text must be
embedded individually to get one vector per document.
"""

import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

EMBEDDING_MODEL = "gemini-embedding-2"


def embed_texts(texts: list[str]) -> list[list[float]]:
    """
    Embed a list of texts using gemini-embedding-2.

    Each text is embedded individually — passing a list to embed_content
    returns only 1 vector (treats the list as a multi-part single document).

    Args:
        texts: List of strings to embed.

    Returns:
        List of embedding vectors, one per input text. Each is list[float].
    """
    if not texts:
        return []

    embeddings: list[list[float]] = []

    for text in texts:
        result = _client.models.embed_content(
            model=EMBEDDING_MODEL,
            contents=text,
            config=types.EmbedContentConfig(
                task_type="RETRIEVAL_DOCUMENT",
            ),
        )
        embeddings.append(result.embeddings[0].values)

    return embeddings


def embed_query(query: str) -> list[float]:
    """
    Embed a single query string.
    Uses RETRIEVAL_QUERY task type, optimised for search-time retrieval.

    Args:
        query: The question or search text.

    Returns:
        Embedding vector as list of floats.
    """
    result = _client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=query,
        config=types.EmbedContentConfig(
            task_type="RETRIEVAL_QUERY",
        ),
    )
    return result.embeddings[0].values
