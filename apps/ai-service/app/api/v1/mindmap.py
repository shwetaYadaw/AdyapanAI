from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from ...core.security import verify_api_key
from ...services.llm_service import generate_structured_output
from ...prompts.tutor import get_mindmap_prompt
import json, re

router = APIRouter()


class MindMapRequest(BaseModel):
    topic: str
    depth: Optional[int] = 2


@router.post("/mindmap")
async def generate_mindmap(
    request: MindMapRequest,
    _: str = Depends(verify_api_key),
):
    prompt = get_mindmap_prompt(request.topic, request.depth or 2)
    raw = await generate_structured_output(prompt, temperature=0.4)
    try:
        text = re.sub(r"```(?:json)?\s*", "", raw).strip().rstrip("```").strip()
        return json.loads(text)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to generate mind map.")
