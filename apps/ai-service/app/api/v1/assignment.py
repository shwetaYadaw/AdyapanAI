from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from ...core.security import verify_api_key
from ...services.llm_service import generate_structured_output
import json, re

router = APIRouter()


class AssignmentEvalRequest(BaseModel):
    studentAnswer: str
    rubric: str
    maxMarks: int = 10
    subject: str = ""


@router.post("/assignment/evaluate")
async def evaluate_assignment(
    request: AssignmentEvalRequest,
    _: str = Depends(verify_api_key),
):
    prompt = f"""You are an expert evaluator. Evaluate this student's answer based on the rubric.

Subject: {request.subject}
Max Marks: {request.maxMarks}
Rubric / Expected Answer: {request.rubric}

Student's Answer:
{request.studentAnswer[:2000]}

Return ONLY valid JSON:
{{
  "marksAwarded": 7,
  "percentage": 70,
  "grade": "B",
  "strengths": ["Good explanation of concept X", "Used relevant examples"],
  "improvements": ["Missing Y aspect", "Could elaborate on Z"],
  "detailedFeedback": "Your answer demonstrates understanding of... However...",
  "modelAnswer": "A complete answer would include..."
}}"""
    raw = await generate_structured_output(prompt, temperature=0.3)
    try:
        text = re.sub(r"```(?:json)?\s*", "", raw).strip().rstrip("```").strip()
        return json.loads(text)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to evaluate assignment.")
