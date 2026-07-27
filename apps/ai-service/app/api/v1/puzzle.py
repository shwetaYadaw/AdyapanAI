from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
from ...core.security import verify_api_key
from ...services.llm_service import generate_structured_output
import json
import re

router = APIRouter()


class PuzzleOption(BaseModel):
    id: str
    description: Optional[str] = None
    imageUrl: Optional[str] = None


class PuzzleRequest(BaseModel):
    puzzleType: str = Field(..., description="Type: pattern, sequence, logic, shape, odd-one-out")
    question: str
    options: List[PuzzleOption]
    context: Optional[str] = None
    difficulty: Optional[str] = "medium"


class PuzzleAnalysis(BaseModel):
    correctAnswer: str
    confidence: float = Field(..., ge=0, le=1)
    reasoning: str
    stepByStep: List[str]
    explanation: str


def extract_json(text: str) -> dict:
    """Extract JSON from LLM response, handling markdown code blocks."""
    text = re.sub(r"```(?:json)?\s*", "", text).strip().rstrip("```").strip()
    return json.loads(text)


@router.post("/puzzle/solve", response_model=PuzzleAnalysis)
async def solve_puzzle(
    request: PuzzleRequest,
    _: str = Depends(verify_api_key),
):
    """
    Solve pattern recognition and logic puzzles.
    
    Supported puzzle types:
    - pattern: Find pattern in sequences
    - sequence: Determine next in sequence
    - logic: Logic-based reasoning problems
    - shape: Shape and geometric puzzles
    - odd-one-out: Identify the odd element
    """
    
    options_text = "\n".join(
        [f"{opt.id}: {opt.description or opt.imageUrl}" for opt in request.options]
    )
    
    prompt = f"""You are an expert puzzle solver. Analyze this {request.puzzleType} puzzle and provide the answer.

Question: {request.question}

Options:
{options_text}

{f"Context: {request.context}" if request.context else ""}

Difficulty: {request.difficulty}

Provide your response in this JSON format:
{{
    "correctAnswer": "the letter/id of the correct option",
    "confidence": 0.95,
    "reasoning": "Brief explanation of why this is the answer",
    "stepByStep": ["step 1", "step 2", "step 3"],
    "explanation": "Detailed explanation of the puzzle logic and solution"
}}

Think through this carefully and provide your analysis."""

    raw = await generate_structured_output(prompt, temperature=0.3)
    
    try:
        data = extract_json(raw)
        return PuzzleAnalysis(**data)
    except (json.JSONDecodeError, ValueError) as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to analyze puzzle: {str(e)}"
        )


@router.post("/puzzle/analyze")
async def analyze_puzzle_difficulty(
    request: PuzzleRequest,
    _: str = Depends(verify_api_key),
):
    """Analyze puzzle difficulty and provide educational insights."""
    
    options_text = "\n".join(
        [f"{opt.id}: {opt.description or opt.imageUrl}" for opt in request.options]
    )
    
    prompt = f"""Analyze this puzzle for educational purposes:

Puzzle Type: {request.puzzleType}
Question: {request.question}

Options:
{options_text}

Provide analysis in JSON format:
{{
    "estimatedDifficulty": "easy/medium/hard",
    "conceptsTested": ["concept1", "concept2"],
    "learningOutcomes": ["outcome1", "outcome2"],
    "hints": ["hint1", "hint2"],
    "commonMistakes": ["mistake1", "mistake2"]
}}"""

    raw = await generate_structured_output(prompt, temperature=0.4)
    
    try:
        data = extract_json(raw)
        return data
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to analyze puzzle")


@router.post("/puzzle/batch")
async def solve_batch_puzzles(
    puzzles: List[PuzzleRequest],
    _: str = Depends(verify_api_key),
):
    """Solve multiple puzzles in batch."""
    
    if len(puzzles) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 puzzles per batch")
    
    results = []
    for puzzle in puzzles:
        try:
            result = await solve_puzzle(puzzle, _)
            results.append({
                "puzzle": puzzle.question,
                "result": result
            })
        except Exception as e:
            results.append({
                "puzzle": puzzle.question,
                "error": str(e)
            })
    
    return {"results": results, "totalSolved": len([r for r in results if "result" in r])}
