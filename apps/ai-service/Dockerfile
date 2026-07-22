FROM python:3.11-slim AS base

WORKDIR /app

# Install system deps for Tesseract and audio
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libsndfile1 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Install Python deps
COPY apps/ai-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY apps/ai-service/app ./app

# Create data directories
RUN mkdir -p ./data/chroma ./data/faiss

# Non-root user
RUN useradd -m -u 1001 aiuser
USER aiuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
