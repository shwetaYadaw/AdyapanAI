from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
import httpx
import tempfile
import os
from ...core.security import verify_api_key

router = APIRouter()


class OCRRequest(BaseModel):
    imageUrl: str
    language: Optional[str] = "eng"


@router.post("/ocr")
async def extract_text(
    request: OCRRequest,
    _: str = Depends(verify_api_key),
):
    try:
        import pytesseract
        from PIL import Image
        import io

        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.get(request.imageUrl)
            response.raise_for_status()

        image = Image.open(io.BytesIO(response.content))
        text = pytesseract.image_to_string(image, lang=request.language or "eng")
        return {"text": text.strip(), "wordCount": len(text.split())}
    except ImportError:
        raise HTTPException(status_code=501, detail="OCR dependencies not installed.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR failed: {str(e)}")
