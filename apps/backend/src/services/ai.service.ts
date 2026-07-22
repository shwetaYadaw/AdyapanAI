import axios, { AxiosError } from 'axios';
import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler.middleware';
import { logger } from '../utils/logger';

const aiClient = axios.create({
  baseURL: env.AI_SERVICE_URL,
  timeout: 30000,
  headers: { 'X-API-Key': env.AI_SERVICE_API_KEY },
});

async function callAI<T>(endpoint: string, data: unknown): Promise<T> {
  try {
    const response = await aiClient.post<T>(endpoint, data);
    return response.data;
  } catch (err) {
    const axiosErr = err as AxiosError;
    logger.error(`AI service error [${endpoint}]:`, axiosErr.message);
    if (axiosErr.response?.status === 503) {
      throw new AppError('AI service is temporarily unavailable', 503);
    }
    throw new AppError('AI feature failed. Please try again.', 500);
  }
}

export class AIService {
  chat(data: { message: string; conversationId?: string; context?: string }) {
    return callAI('/api/v1/chat', data);
  }

  tutor(data: { topic: string; level: string; courseId?: string; format?: string }) {
    return callAI('/api/v1/tutor', data);
  }

  pdfChat(data: { pdfUrl: string; question: string; conversationId?: string }) {
    return callAI('/api/v1/pdf-chat', data);
  }

  generateNotes(data: { lectureId?: string; content: string; format?: string }) {
    return callAI('/api/v1/notes', data);
  }

  generateQuiz(data: { topic: string; count: number; difficulty: string; type: string }) {
    return callAI('/api/v1/quiz', data);
  }

  generateFlashcards(data: { topic: string; count: number }) {
    return callAI('/api/v1/flashcards', data);
  }

  generateMindMap(data: { topic: string; depth?: number }) {
    return callAI('/api/v1/mindmap', data);
  }

  careerRecommendation(data: { skills: string[]; interests: string[]; experience?: string }) {
    return callAI('/api/v1/career', data);
  }

  skillGapAnalysis(data: { targetRole: string; currentSkills: string[] }) {
    return callAI('/api/v1/skill-gap', data);
  }

  studyPlan(data: { goal: string; availableHoursPerDay: number; targetDate: string }) {
    return callAI('/api/v1/study-plan', data);
  }

  summarizeLecture(data: { transcript: string; format?: string }) {
    return callAI('/api/v1/summarize', data);
  }

  analyzeResume(data: { resumeText: string; targetRole?: string }) {
    return callAI('/api/v1/resume/analyze', data);
  }

  generateCoverLetter(data: { resumeText: string; jobDescription: string; companyName: string }) {
    return callAI('/api/v1/resume/cover-letter', data);
  }

  linkedinSuggestions(data: { profileText: string; targetRole: string }) {
    return callAI('/api/v1/resume/linkedin', data);
  }

  startMockInterview(data: { role: string; company?: string; level: string; type: string }) {
    return callAI('/api/v1/interview/start', data);
  }

  submitInterviewAnswer(data: { sessionId: string; questionId: string; answer: string }) {
    return callAI('/api/v1/interview/answer', data);
  }

  ocr(data: { imageUrl: string; language?: string }) {
    return callAI('/api/v1/ocr', data);
  }

  translate(data: { text: string; targetLanguage: string; sourceLanguage?: string }) {
    return callAI('/api/v1/translate', data);
  }

  speechToText(data: { audioUrl: string }) {
    return callAI('/api/v1/speech-to-text', data);
  }

  textToSpeech(data: { text: string; voice?: string; language?: string }) {
    return callAI('/api/v1/text-to-speech', data);
  }

  evaluateAssignment(data: { studentAnswer: string; rubric: string; maxMarks: number }) {
    return callAI('/api/v1/assignment/evaluate', data);
  }
}
