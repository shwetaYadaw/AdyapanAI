from fastapi import APIRouter
from . import chat, tutor, quiz, flashcards, mindmap, notes, career, resume, interview, summarize, ocr, translate, speech, assignment, puzzle

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(chat.router,        tags=["Chat"])
api_router.include_router(tutor.router,       tags=["Tutor"])
api_router.include_router(quiz.router,        tags=["Quiz"])
api_router.include_router(flashcards.router,  tags=["Flashcards"])
api_router.include_router(mindmap.router,     tags=["Mind Map"])
api_router.include_router(notes.router,       tags=["Notes"])
api_router.include_router(career.router,      tags=["Career"])
api_router.include_router(resume.router,      tags=["Resume"])
api_router.include_router(interview.router,   tags=["Interview"])
api_router.include_router(summarize.router,   tags=["Summarize"])
api_router.include_router(ocr.router,         tags=["OCR"])
api_router.include_router(translate.router,   tags=["Translate"])
api_router.include_router(speech.router,      tags=["Speech"])
api_router.include_router(assignment.router,  tags=["Assignment"])
api_router.include_router(puzzle.router,      tags=["Puzzle"])
