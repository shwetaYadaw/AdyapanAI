from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from ...core.security import verify_api_key
from ...services.llm_service import generate_structured_output
from ...prompts.career import get_interview_start_prompt, get_interview_feedback_prompt
import json, re

router = APIRouter()


def parse_json(raw: str) -> dict:
    text = re.sub(r"```(?:json)?\s*", "", raw).strip().rstrip("```").strip()
    return json.loads(text)


class InterviewStartRequest(BaseModel):
    role: str
    company: Optional[str] = None
    level: str = "junior"
    type: str = "technical"


class InterviewAnswerRequest(BaseModel):
    sessionId: str
    questionId: str
    answer: str
    question: Optional[str] = None
    role: Optional[str] = None


@router.post("/interview/start")
async def start_interview(
    request: InterviewStartRequest,
    _: str = Depends(verify_api_key),
):
    prompt = get_interview_start_prompt(
        request.role, request.company or "a leading company",
        request.level, request.type
    )
    raw = await generate_structured_output(prompt, temperature=0.6)
    try:
        return parse_json(raw)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to start interview session.")


@router.post("/interview/answer")
async def evaluate_answer(
    request: InterviewAnswerRequest,
    _: str = Depends(verify_api_key),
):
    prompt = get_interview_feedback_prompt(
        request.question or "Tell me about yourself",
        request.answer,
        request.role or "Software Engineer",
    )
    raw = await generate_structured_output(prompt, temperature=0.4)
    try:
        return parse_json(raw)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to evaluate answer.")
