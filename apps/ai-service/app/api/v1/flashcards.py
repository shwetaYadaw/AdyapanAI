from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from ...core.security import verify_api_key
from ...services.llm_service import generate_structured_output
from ...prompts.tutor import get_flashcard_prompt
import json, re

router = APIRouter()


class FlashcardsRequest(BaseModel):
    topic: str
    count: int = Field(default=20, ge=5, le=50)


@router.post("/flashcards")
async def generate_flashcards(
    request: FlashcardsRequest,
    _: str = Depends(verify_api_key),
):
    prompt = get_flashcard_prompt(request.topic, request.count)
    raw = await generate_structured_output(prompt, temperature=0.5)
    try:
        text = re.sub(r"```(?:json)?\s*", "", raw).strip().rstrip("```").strip()
        return json.loads(text)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to generate flashcards.")
