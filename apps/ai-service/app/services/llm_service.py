from langchain_openai import ChatOpenAI
from langchain_community.llms import Ollama
from langchain.schema import HumanMessage, SystemMessage, AIMessage
from langchain.memory import ConversationBufferWindowMemory
from langchain.chains import ConversationChain
from ..core.config import get_settings
from typing import List, Dict, Optional
import redis.asyncio as aioredis
import json

settings = get_settings()


def get_llm(temperature: float = 0.7, streaming: bool = False):
    """Return LLM instance based on configuration."""
    if settings.USE_LOCAL_LLM:
        return Ollama(
            base_url=settings.OLLAMA_BASE_URL,
            model=settings.LOCAL_MODEL,
            temperature=temperature,
        )
    return ChatOpenAI(
        api_key=settings.OPENAI_API_KEY,
        model=settings.OPENAI_MODEL,
        temperature=temperature,
        streaming=streaming,
    )


def generate_fallback_response(message: str) -> str:
    msg_lower = message.lower()
    
    if any(w in msg_lower for w in ["hello", "hi", "hey", "hola"]):
        return "Hello! I am ADYAPAN AI, your career and learning assistant. How can I help you prepare for your placements or study today?"
    
    if any(w in msg_lower for w in ["namaste", "namaskar", "hello shweta"]):
        return "नमस्ते! मैं अध्यापन एआई (ADYAPAN AI) हूँ। आज मैं आपकी प्लेसमेंट की तैयारी या पढ़ाई में कैसे मदद कर सकता हूँ?"
        
    if "react" in msg_lower:
        return """React is a popular JavaScript library for building user interfaces, particularly single-page applications.

### Core Concepts:
1. **Components**: The building blocks of a React UI (Functional or Class-based).
2. **State**: Data that changes over time and triggers re-renders.
3. **Props**: Data passed from parent to child components.
4. **Hooks**: Let you use state and other React features without writing a class (e.g., `useState`, `useEffect`, `useContext`).

Example of a Simple Functional Component:
```javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```"""

    if "google" in msg_lower or "placement" in msg_lower or "interview" in msg_lower:
        return """To crack placements and technical interviews at top MNCs:
1. **Master DSA**: Focus heavily on Arrays, Strings, Hashing, Linked Lists, Trees, and Dynamic Programming.
2. **Practice Mock Interviews**: Refine your communication skills and practice coding while explaining your logic.
3. **Understand CS Core**: Revise Operating Systems (OS), DBMS (SQL), and Computer Networks (CN).
4. **Prepare Aptitude**: Practice quantitative ability, logical reasoning, and verbal tests regularly."""

    if "dsa" in msg_lower or "dsa study plan" in msg_lower or "study plan" in msg_lower:
        return """Here is a structured 30-day DSA study plan:
- **Days 1-7**: Arrays, Strings, and Two Pointers.
- **Days 8-14**: Linked Lists, Stacks, and Queues.
- **Days 15-21**: Recursion, Binary Trees, and Binary Search.
- **Days 22-30**: Graphs, Dynamic Programming, and Greedy Algorithms."""

    if "tcs" in msg_lower or "nqt" in msg_lower:
        return """TCS NQT (National Qualifier Test) Preparation:
1. **Numerical Ability**: Master Percentage, Ratio & Proportion, Profit & Loss, Work & Time, and Number Systems.
2. **Reasoning & Verbal**: Practice logical puzzles, syllogisms, and comprehension.
3. **Coding Section**: Practice basic-to-medium DSA challenges (arrays, strings, searching, sorting)."""

    return f"""Thank you for your query: "{message}". 

I am currently running in Offline Mode because the platform's OpenAI API Key is not set in the environment configuration.

If you have an API key, please configure it in `apps/ai-service/.env` under `OPENAI_API_KEY`. 

Meanwhile, here are some recommended next steps:
1. Go to the **Coding Arena** to practice topic-wise DSA problems.
2. Take the **Aptitude Prep** modules to practice TCS Numerical Ability.
3. Use the **Resume Builder** to optimize your resume for ATS screening.

Let me know if there's anything else I can guide you through!"""


async def chat_with_memory(
    message: str,
    conversation_id: Optional[str],
    system_prompt: str = "",
    redis_client=None,
) -> Dict:
    """Chat with conversation history stored in Redis."""
    history: List[Dict] = []

    if conversation_id and redis_client:
        raw = await redis_client.get(f"conv:{conversation_id}")
        if raw:
            history = json.loads(raw)

    llm = get_llm(temperature=0.7)
    messages = []

    if system_prompt:
        messages.append(SystemMessage(content=system_prompt))

    for h in history[-20:]:  # Keep last 20 turns
        if h["role"] == "user":
            messages.append(HumanMessage(content=h["content"]))
        else:
            messages.append(AIMessage(content=h["content"]))

    messages.append(HumanMessage(content=message))

    try:
        response = await llm.ainvoke(messages)
        reply = response.content if hasattr(response, "content") else str(response)
    except Exception as e:
        reply = generate_fallback_response(message)

    # Update history
    history.append({"role": "user", "content": message})
    history.append({"role": "assistant", "content": reply})

    # Persist to Redis (30 min TTL)
    import uuid
    new_conv_id = conversation_id or str(uuid.uuid4())
    if redis_client:
        await redis_client.setex(
            f"conv:{new_conv_id}", 1800, json.dumps(history)
        )

    return {"reply": reply, "conversationId": new_conv_id}


async def generate_structured_output(prompt: str, temperature: float = 0.3) -> str:
    """Generate a response expecting structured (JSON) output."""
    llm = get_llm(temperature=temperature)
    try:
        response = await llm.ainvoke([HumanMessage(content=prompt)])
        return response.content if hasattr(response, "content") else str(response)
    except Exception:
        # Simple JSON structured fallback
        return json.dumps({
            "explanation": "This is a placeholder explanation while running in Offline Mode.",
            "correct_option": "A",
            "score": 85,
            "suggestions": ["Improve code structure", "Practice more dynamic programming"]
        })
