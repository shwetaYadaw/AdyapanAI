from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from ...core.security import verify_api_key
from ...services.rag_service import answer_pdf_question

router = APIRouter()


class PDFChatRequest(BaseModel):
    pdfUrl: str
    question: str
    conversationId: Optional[str] = None


@router.post("/pdf-chat")
async def pdf_chat(
    request: PDFChatRequest,
    _: str = Depends(verify_api_key),
):
    try:
        answer = await answer_pdf_question(request.pdfUrl, request.question)
        return {
            "answer": answer,
            "conversationId": request.conversationId or "",
            "source": "pdf",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF chat failed: {str(e)}")
