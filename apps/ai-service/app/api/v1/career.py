from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from ...core.security import verify_api_key
from ...services.llm_service import generate_structured_output
from ...prompts.career import get_career_recommendation_prompt, get_skill_gap_prompt, get_study_plan_prompt
import json, re

router = APIRouter()


def parse_json(raw: str) -> dict:
    text = re.sub(r"```(?:json)?\s*", "", raw).strip().rstrip("```").strip()
    return json.loads(text)


class CareerRequest(BaseModel):
    skills: List[str] = []
    interests: List[str] = []
    experience: Optional[str] = None


class SkillGapRequest(BaseModel):
    targetRole: str
    currentSkills: List[str] = []


class StudyPlanRequest(BaseModel):
    goal: str
    availableHoursPerDay: float = 2.0
    targetDate: str
    currentLevel: Optional[str] = None


@router.post("/career")
async def career_recommendation(
    request: CareerRequest,
    _: str = Depends(verify_api_key),
):
    prompt = get_career_recommendation_prompt(request.skills, request.interests, request.experience or "")
    raw = await generate_structured_output(prompt, temperature=0.5)
    try:
        return parse_json(raw)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to generate career recommendations.")


@router.post("/skill-gap")
async def skill_gap_analysis(
    request: SkillGapRequest,
    _: str = Depends(verify_api_key),
):
    prompt = get_skill_gap_prompt(request.targetRole, request.currentSkills)
    raw = await generate_structured_output(prompt, temperature=0.3)
    try:
        return parse_json(raw)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to analyze skill gap.")


@router.post("/study-plan")
async def study_plan(
    request: StudyPlanRequest,
    _: str = Depends(verify_api_key),
):
    prompt = get_study_plan_prompt(
        request.goal,
        request.availableHoursPerDay,
        request.targetDate,
        request.currentLevel or "Beginner",
    )
    raw = await generate_structured_output(prompt, temperature=0.4)
    try:
        return parse_json(raw)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to generate study plan.")
