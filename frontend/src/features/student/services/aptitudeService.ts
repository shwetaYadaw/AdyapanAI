import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/v1';

export interface AptitudeOption {
  id: string;
  optionKey: string; // A, B, C, D
  text: string;
  order: number;
}

export interface AptitudeQuestion {
  id: string;
  statement: string;
  difficulty: string;
  options: AptitudeOption[];
  explanation?: string;
  xpReward: number;
  timeLimit: number;
}

export interface AptitudeChapter {
  id: string;
  name: string;
  description?: string;
  order: number;
  questions?: AptitudeQuestion[];
}

export interface AptitudeTopic {
  id: string;
  name: string;
  description?: string;
  order: number;
  chapters: { id: string; name: string; order: number }[];
}

class AptitudeService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/aptitude`,
      withCredentials: true,
    });

    // Add auth token for authenticated endpoints
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // ============================================================================
  // BROWSE TOPICS & CHAPTERS
  // ============================================================================

  /**
   * Get all topics
   */
  async getTopics(): Promise<AptitudeTopic[]> {
    const { data } = await this.api.get('/topics');
    return data.data || [];
  }

  /**
   * Get specific topic with chapters
   */
  async getTopic(topicId: string): Promise<AptitudeTopic> {
    const { data } = await this.api.get(`/topics/${topicId}`);
    return data.data;
  }

  /**
   * Get chapters in topic
   */
  async getChapters(topicId: string): Promise<AptitudeChapter[]> {
    const topic = await this.getTopic(topicId);
    return topic.chapters || [];
  }

  /**
   * Get chapter with all questions
   */
  async getChapter(topicId: string, chapterId: string): Promise<AptitudeChapter> {
    const { data } = await this.api.get(`/topics/${topicId}/chapters/${chapterId}`);
    return data.data;
  }

  /**
   * Get single question
   */
  async getQuestion(questionId: string): Promise<AptitudeQuestion> {
    const { data } = await this.api.get(`/questions/${questionId}`);
    return data.data;
  }

  // ============================================================================
  // STUDENT SUBMISSIONS
  // ============================================================================

  /**
   * Submit answer to question
   */
  async submitAnswer(
    questionId: string,
    selectedOption: string,
    timeSpent: number
  ): Promise<{
    submission: any;
    isCorrect: boolean;
    xpGained: number;
    correctOption: string;
    explanation?: string;
  }> {
    const { data } = await this.api.post(`/questions/${questionId}/submit`, {
      selectedOption,
      timeSpent,
    });
    return data.data;
  }

  /**
   * Get all submissions for current user
   */
  async getSubmissions(page = 1, limit = 20): Promise<{ submissions: any[]; pagination: any }> {
    const { data } = await this.api.get('/submissions', { params: { page, limit } });
    return {
      submissions: data.data || [],
      pagination: data.pagination || { total: 0, page, limit },
    };
  }

  // ============================================================================
  // PROGRESS & ANALYTICS
  // ============================================================================

  /**
   * Get overall progress
   */
  async getProgress(): Promise<{
    overall: {
      totalAttempted: number;
      totalCorrect: number;
      accuracy: number;
      totalXP: number;
    };
    topicwise: Record<string, { attempted: number; correct: number; accuracy: number }>;
    recentSubmissions: any[];
  }> {
    const { data } = await this.api.get('/progress');
    return data.data;
  }

  /**
   * Get progress for specific topic
   */
  async getTopicProgress(topicId: string): Promise<{
    topic: string;
    overall: {
      totalAttempted: number;
      totalCorrect: number;
      accuracy: number;
      totalXP: number;
    };
    chapterwise: Record<string, { attempted: number; correct: number; accuracy: number }>;
  }> {
    const { data } = await this.api.get(`/progress/${topicId}`);
    return data.data;
  }
}

export const aptitudeService = new AptitudeService();
