from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from ...core.security import verify_api_key
from ...services.llm_service import generate_structured_output
from ...prompts.tutor import get_tutor_prompt

router = APIRouter()


class TutorRequest(BaseModel):
    topic: str
    level: str = "beginner"
    courseId: Optional[str] = None
    format: Optional[str] = "explanation"


@router.post("/tutor")
async def tutor(
    request: TutorRequest,
    _: str = Depends(verify_api_key),
):
    prompt = get_tutor_prompt(request.topic, request.level, request.format or "explanation")
    explanation = await generate_structured_output(prompt, temperature=0.6)
    return {"explanation": explanation, "topic": request.topic, "level": request.level}
