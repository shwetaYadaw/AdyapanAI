from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from ...core.security import verify_api_key
from ...services.llm_service import generate_structured_output

router = APIRouter()

SUMMARIZE_FORMATS = {
    "brief": "Provide a brief 3-5 sentence summary capturing the key points.",
    "detailed": "Provide a detailed summary with all important concepts, examples, and takeaways.",
    "bullets": "Summarize in concise bullet points organized by topic.",
}


class SummarizeRequest(BaseModel):
    transcript: str
    lectureId: Optional[str] = None
    format: Optional[str] = "bullets"


@router.post("/summarize")
async def summarize_lecture(
    request: SummarizeRequest,
    _: str = Depends(verify_api_key),
):
    fmt = SUMMARIZE_FORMATS.get(request.format or "bullets", SUMMARIZE_FORMATS["bullets"])
    prompt = f"""Summarize this lecture transcript for a student.
{fmt}

Transcript:
{request.transcript[:5000]}"""
    summary = await generate_structured_output(prompt, temperature=0.3)
    return {"summary": summary, "format": request.format}
