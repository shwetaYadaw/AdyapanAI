from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from ...core.security import verify_api_key
from ...services.llm_service import generate_structured_output
from ...prompts.tutor import get_quiz_prompt
import json
import re

router = APIRouter()


class QuizRequest(BaseModel):
    topic: str
    count: int = Field(default=10, ge=3, le=30)
    difficulty: str = "medium"
    type: str = "mcq"
    courseId: str = None


def extract_json(text: str) -> dict:
    """Extract JSON from LLM response, handling markdown code blocks."""
    text = re.sub(r"```(?:json)?\s*", "", text).strip().rstrip("```").strip()
    return json.loads(text)


@router.post("/quiz")
async def generate_quiz(
    request: QuizRequest,
    _: str = Depends(verify_api_key),
):
    prompt = get_quiz_prompt(request.topic, request.count, request.difficulty, request.type)
    raw = await generate_structured_output(prompt, temperature=0.4)
    try:
        data = extract_json(raw)
        return data
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to generate valid quiz. Please try again.")
