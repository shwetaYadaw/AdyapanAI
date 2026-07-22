from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS, Chroma
from langchain.chains import RetrievalQA
from langchain.schema import Document
from ..core.config import get_settings
from .llm_service import get_llm
from typing import List, Optional
import hashlib
import os
import httpx
import tempfile

settings = get_settings()

def get_embeddings():
    return OpenAIEmbeddings(
        api_key=settings.OPENAI_API_KEY,
        model=settings.EMBEDDING_MODEL,
    )


async def load_pdf_and_create_index(pdf_url: str) -> FAISS:
    """Download PDF, chunk it, create FAISS index."""
    # Cache key based on URL
    cache_key = hashlib.md5(pdf_url.encode()).hexdigest()
    index_path = os.path.join(settings.FAISS_INDEX_DIR, cache_key)

    embeddings = get_embeddings()

    # Return cached index if available
    if os.path.exists(index_path):
        return FAISS.load_local(index_path, embeddings, allow_dangerous_deserialization=True)

    # Download PDF
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.get(pdf_url)
        response.raise_for_status()

    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as f:
        f.write(response.content)
        temp_path = f.name

    try:
        loader = PyPDFLoader(temp_path)
        documents = loader.load()
    finally:
        os.unlink(temp_path)

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_documents(documents)

    index = FAISS.from_documents(chunks, embeddings)
    os.makedirs(settings.FAISS_INDEX_DIR, exist_ok=True)
    index.save_local(index_path)

    return index


async def answer_pdf_question(pdf_url: str, question: str) -> str:
    """RAG-based QA over a PDF document."""
    index = await load_pdf_and_create_index(pdf_url)
    retriever = index.as_retriever(search_kwargs={"k": 4})

    llm = get_llm(temperature=0.3)
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
    )

    result = await qa_chain.ainvoke({"query": question})
    return result.get("result", "I couldn't find an answer in the document.")
