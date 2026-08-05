import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/v1';

export interface AptitudeOption {
  id?: string;
  optionKey: string; // A, B, C, D
  text: string;
  isCorrect: boolean;
  order?: number;
}

export interface AptitudeQuestion {
  id?: string;
  statement: string;
  difficulty: 'easy' | 'medium' | 'hard';
  options: AptitudeOption[];
  explanation?: string;
  xpReward?: number;
  companies?: string;
  timeLimit?: number;
  isActive?: boolean;
  createdAt?: string;
}

export interface AptitudeChapter {
  id?: string;
  name: string;
  description?: string;
  order?: number;
  questions?: AptitudeQuestion[];
  isActive?: boolean;
  createdAt?: string;
}

export interface AptitudeTopic {
  id?: string;
  name: string;
  description?: string;
  icon?: string;
  order?: number;
  chapters?: AptitudeChapter[];
  isActive?: boolean;
  createdAt?: string;
}

class AptitudeAdminService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/admin/aptitude`,
      withCredentials: true,
    });

    // Add auth token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // ============================================================================
  // TOPIC MANAGEMENT
  // ============================================================================

  /**
   * Get all topics
   */
  async getTopics(page = 1, limit = 20): Promise<{ topics: AptitudeTopic[]; pagination: any }> {
    const { data } = await this.api.get('/topics', { params: { page, limit } });
    return {
      topics: data.data || [],
      pagination: data.pagination || { total: 0, page, limit },
    };
  }

  /**
   * Get specific topic with chapters
   */
  async getTopic(topicId: string): Promise<AptitudeTopic> {
    const { data } = await this.api.get(`/topics/${topicId}`);
    return data.data;
  }

  /**
   * Create new topic
   */
  async createTopic(topic: { name: string; description?: string; icon?: string; order?: number }): Promise<AptitudeTopic> {
    const { data } = await this.api.post('/topics', topic);
    return data.data;
  }

  /**
   * Update topic
   */
  async updateTopic(topicId: string, updates: Partial<AptitudeTopic>): Promise<AptitudeTopic> {
    const { data } = await this.api.put(`/topics/${topicId}`, updates);
    return data.data;
  }

  /**
   * Delete topic (cascades to chapters and questions)
   */
  async deleteTopic(topicId: string): Promise<void> {
    await this.api.delete(`/topics/${topicId}`);
  }

  // ============================================================================
  // CHAPTER MANAGEMENT
  // ============================================================================

  /**
   * Get chapters in a topic
   */
  async getChapters(
    topicId: string,
    page = 1,
    limit = 20
  ): Promise<{ chapters: AptitudeChapter[]; pagination: any }> {
    const { data } = await this.api.get(`/topics/${topicId}/chapters`, { params: { page, limit } });
    return {
      chapters: data.data || [],
      pagination: data.pagination || { total: 0, page, limit },
    };
  }

  /**
   * Get specific chapter with questions
   */
  async getChapter(topicId: string, chapterId: string): Promise<AptitudeChapter> {
    const { data } = await this.api.get(`/topics/${topicId}/chapters/${chapterId}`);
    return data.data;
  }

  /**
   * Create chapter in topic
   */
  async createChapter(
    topicId: string,
    chapter: { name: string; description?: string; order?: number }
  ): Promise<AptitudeChapter> {
    const { data } = await this.api.post(`/topics/${topicId}/chapters`, chapter);
    return data.data;
  }

  /**
   * Update chapter
   */
  async updateChapter(
    topicId: string,
    chapterId: string,
    updates: Partial<AptitudeChapter>
  ): Promise<AptitudeChapter> {
    const { data } = await this.api.put(`/topics/${topicId}/chapters/${chapterId}`, updates);
    return data.data;
  }

  /**
   * Delete chapter
   */
  async deleteChapter(topicId: string, chapterId: string): Promise<void> {
    await this.api.delete(`/topics/${topicId}/chapters/${chapterId}`);
  }

  // ============================================================================
  // QUESTION MANAGEMENT
  // ============================================================================

  /**
   * Get questions in chapter
   */
  async getQuestions(
    topicId: string,
    chapterId: string,
    page = 1,
    limit = 20
  ): Promise<{ questions: AptitudeQuestion[]; pagination: any }> {
    const { data } = await this.api.get(`/topics/${topicId}/chapters/${chapterId}/questions`, {
      params: { page, limit },
    });
    return {
      questions: data.data || [],
      pagination: data.pagination || { total: 0, page, limit },
    };
  }

  /**
   * Get specific question
   */
  async getQuestion(topicId: string, chapterId: string, questionId: string): Promise<AptitudeQuestion> {
    const { data } = await this.api.get(`/topics/${topicId}/chapters/${chapterId}/questions/${questionId}`);
    return data.data;
  }

  /**
   * Create question with MCQ options
   */
  async createQuestion(
    topicId: string,
    chapterId: string,
    question: AptitudeQuestion
  ): Promise<AptitudeQuestion> {
    const { data } = await this.api.post(`/topics/${topicId}/chapters/${chapterId}/questions`, question);
    return data.data;
  }

  /**
   * Update question
   */
  async updateQuestion(
    topicId: string,
    chapterId: string,
    questionId: string,
    updates: Partial<AptitudeQuestion>
  ): Promise<AptitudeQuestion> {
    const { data } = await this.api.put(
      `/topics/${topicId}/chapters/${chapterId}/questions/${questionId}`,
      updates
    );
    return data.data;
  }

  /**
   * Delete question
   */
  async deleteQuestion(topicId: string, chapterId: string, questionId: string): Promise<void> {
    await this.api.delete(`/topics/${topicId}/chapters/${chapterId}/questions/${questionId}`);
  }

  // ============================================================================
  // STATISTICS
  // ============================================================================

  /**
   * Get aptitude statistics
   */
  async getStats(): Promise<any> {
    const { data } = await this.api.get('/stats');
    return data.data;
  }
}

export const aptitudeAdminService = new AptitudeAdminService();
