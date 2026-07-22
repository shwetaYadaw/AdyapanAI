def get_tutor_prompt(topic: str, level: str, format: str = "explanation") -> str:
    format_instructions = {
        "explanation": "Provide a clear, structured explanation with key concepts and simple language.",
        "example": "Explain with 2-3 practical, real-world code examples. Comment every line.",
        "summary": "Give a concise summary in bullet points, covering all key aspects.",
        "analogy": "Use a simple everyday analogy to explain this concept.",
    }

    level_context = {
        "beginner": "Assume no prior knowledge. Use simple vocabulary. Avoid jargon.",
        "intermediate": "Assume basic familiarity. Go deeper into concepts and internals.",
        "advanced": "Assume strong foundation. Cover edge cases, performance, and best practices.",
    }

    return f"""You are ADYAPAN's expert AI tutor. You help students learn technical and non-technical concepts.

Topic: {topic}
Student Level: {level}
Instruction: {format_instructions.get(format, format_instructions["explanation"])}
Context: {level_context.get(level, level_context["beginner"])}

Provide a well-structured, engaging response. Use markdown formatting.
Include practical examples where relevant. Keep it concise but complete."""


def get_quiz_prompt(topic: str, count: int, difficulty: str, quiz_type: str) -> str:
    return f"""Generate exactly {count} {quiz_type} questions about "{topic}".
Difficulty: {difficulty}

Return ONLY valid JSON in this exact format:
{{
  "questions": [
    {{
      "question": "question text",
      "options": ["option A", "option B", "option C", "option D"],
      "correctAnswer": 0,
      "explanation": "Why this is correct"
    }}
  ]
}}

Rules:
- correctAnswer is the 0-indexed position of the correct option
- All 4 options must be plausible
- Explanations must be educational
- Do NOT wrap in markdown code blocks"""


def get_flashcard_prompt(topic: str, count: int) -> str:
    return f"""Generate exactly {count} flashcards for studying "{topic}".

Return ONLY valid JSON:
{{
  "flashcards": [
    {{
      "front": "Question or term",
      "back": "Answer or definition",
      "hint": "Optional memory hint"
    }}
  ]
}}"""


def get_mindmap_prompt(topic: str, depth: int = 2) -> str:
    return f"""Create a mind map structure for "{topic}" with depth {depth}.

Return ONLY valid JSON:
{{
  "id": "root",
  "label": "{topic}",
  "children": [
    {{
      "id": "node1",
      "label": "Main concept 1",
      "children": [
        {{ "id": "node1-1", "label": "Sub-concept 1.1", "children": [] }}
      ]
    }}
  ]
}}

Include 4-6 main branches with 2-4 sub-nodes each."""


def get_notes_prompt(content: str, format: str = "structured") -> str:
    formats = {
        "bullet": "Format as bullet points organized by topic.",
        "paragraph": "Format as well-structured paragraphs.",
        "structured": "Use headers (##), sub-headers (###), bullet points, and highlights (**bold**).",
    }
    return f"""You are a study notes expert. Create comprehensive study notes from the following content.

{formats.get(format, formats["structured"])}

Focus on:
- Key concepts and definitions
- Important formulas or algorithms
- Examples
- Summary points

Content:
{content[:4000]}"""
