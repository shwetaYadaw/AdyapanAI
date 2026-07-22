from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from ...core.security import verify_api_key
from ...services.llm_service import generate_structured_output
from ...prompts.tutor import get_notes_prompt

router = APIRouter()


class NotesRequest(BaseModel):
    content: str
    lectureId: Optional[str] = None
    format: Optional[str] = "structured"


@router.post("/notes")
async def generate_notes(
    request: NotesRequest,
    _: str = Depends(verify_api_key),
):
    prompt = get_notes_prompt(request.content, request.format or "structured")
    notes = await generate_structured_output(prompt, temperature=0.4)
    return {"notes": notes, "format": request.format}
