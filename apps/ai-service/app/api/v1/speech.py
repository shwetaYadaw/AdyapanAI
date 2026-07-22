from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Optional
import httpx
import tempfile
import os
from ...core.security import verify_api_key

router = APIRouter()


class STTRequest(BaseModel):
    audioUrl: str


class TTSRequest(BaseModel):
    text: str
    voice: Optional[str] = "default"
    language: Optional[str] = "en"


@router.post("/speech-to-text")
async def speech_to_text(
    request: STTRequest,
    _: str = Depends(verify_api_key),
):
    try:
        import whisper
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.get(request.audioUrl)
            resp.raise_for_status()

        with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as f:
            f.write(resp.content)
            tmp_path = f.name

        try:
            model = whisper.load_model("base")
            result = model.transcribe(tmp_path)
            return {"text": result["text"], "language": result.get("language", "en")}
        finally:
            os.unlink(tmp_path)
    except ImportError:
        raise HTTPException(status_code=501, detail="Whisper not installed.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"STT failed: {str(e)}")


@router.post("/text-to-speech")
async def text_to_speech(
    request: TTSRequest,
    _: str = Depends(verify_api_key),
):
    try:
        from gtts import gTTS
        import io

        tts = gTTS(text=request.text[:2000], lang=request.language or "en", slow=False)
        buffer = io.BytesIO()
        tts.write_to_fp(buffer)
        buffer.seek(0)

        return Response(
            content=buffer.read(),
            media_type="audio/mpeg",
            headers={"Content-Disposition": "inline; filename=speech.mp3"},
        )
    except ImportError:
        raise HTTPException(status_code=501, detail="gTTS not installed.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS failed: {str(e)}")
