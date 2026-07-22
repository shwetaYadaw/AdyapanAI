from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from ...core.security import verify_api_key
from ...services.llm_service import generate_structured_output

router = APIRouter()


class TranslateRequest(BaseModel):
    text: str
    targetLanguage: str
    sourceLanguage: Optional[str] = "auto"


@router.post("/translate")
async def translate(
    request: TranslateRequest,
    _: str = Depends(verify_api_key),
):
    prompt = f"""Translate the following text to {request.targetLanguage}.
Return only the translated text, nothing else.

Text:
{request.text[:3000]}"""
    translated = await generate_structured_output(prompt, temperature=0.1)
    return {
        "translatedText": translated,
        "sourceLanguage": request.sourceLanguage,
        "targetLanguage": request.targetLanguage,
    }
