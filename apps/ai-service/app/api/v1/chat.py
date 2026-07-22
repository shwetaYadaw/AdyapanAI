from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
import redis.asyncio as aioredis
from ...core.config import get_settings
from ...core.security import verify_api_key
from ...services.llm_service import chat_with_memory

router = APIRouter()
settings = get_settings()

SYSTEM_PROMPT = """You are ADYAPAN AI, a helpful career development and learning assistant.
You help students with:
- Learning concepts in technology and business
- Career guidance and placement preparation
- Resume and interview tips
- Study plans and skill development
Be concise, practical, and encouraging. Use examples when helpful."""


class ChatRequest(BaseModel):
    message: str
    conversationId: Optional[str] = None
    context: Optional[str] = None


@router.post("/chat")
async def chat(
    request: ChatRequest,
    _: str = Depends(verify_api_key),
):
    try:
        redis_client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        system = SYSTEM_PROMPT
        if request.context:
            system += f"\n\nCurrent context: {request.context}"

        result = await chat_with_memory(
            message=request.message,
            conversation_id=request.conversationId,
            system_prompt=system,
            redis_client=redis_client,
        )
        await redis_client.aclose()
        return result
    except Exception as e:
        return {"reply": "I'm having trouble connecting right now. Please try again.", "conversationId": request.conversationId or ""}
