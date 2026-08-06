import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/v1';

export type AptitudeSection = 'Verbal Ability' | 'Numerical Ability' | 'Logical Reasoning';
export type QuestionType = 'MCQ' | 'TrueFalse' | 'DiagramBased' | 'Numerical' | 'Coding';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface AptitudeOption {
  id?: string;
  optionKey: string; // A, B, C, D
  text: string;
  isCorrect: boolean;
  order?: number;
}

export interface AptitudeQuestion {
  id?: string;
  chapterId?: string;
  chapter?: { id: string; name: string };
  statement: string;
  difficulty: Difficulty;
  correctOption?: string;
  options: AptitudeOption[];
  explanation?: string;
  stepSolution?: string;
  formula?: string;
  hints?: string;
  questionType?: QuestionType;
  imageUrl?: string;
  tags?: string;
  xpReward?: number;
  companies?: string;
  timeLimit?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AptitudeChapter {
  id?: string;
  name: string;
  description?: string;
  order?: number;
  topicId?: string;
  questions?: AptitudeQuestion[];
  isActive?: boolean;
  createdAt?: string;
}

export interface AptitudeTopic {
  id?: string;
  name: string;
  section: AptitudeSection;
  description?: string;
  icon?: string;
  order?: number;
  chapters?: AptitudeChapter[];
  questionCount?: number;
  isActive?: boolean;
  createdAt?: string;
}

export interface TopicStats {
  topicId: string;
  topicName: string;
  section: string;
  totalChapters: number;
  totalQuestions: number;
  byDifficulty: Record<string, number>;
  lastUpdated: string | null;
}

export interface ImportResult {
  created: number;
  skipped: number;
  errors: string[];
}

class AptitudeAdminService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/admin/aptitude`,
      withCredentials: true,
    });
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }

  // ── Topics ──────────────────────────────────────────────────────────────────

  async getTopics(params?: { page?: number; limit?: number; section?: string }) {
    const { data } = await this.api.get('/topics', { params: { limit: 200, ...params } });
    return { topics: (data.data || []) as AptitudeTopic[], pagination: data.pagination };
  }

  async getTopic(topicId: string): Promise<AptitudeTopic> {
    const { data } = await this.api.get(`/topics/${topicId}`);
    return data.data;
  }

  async createTopic(topic: { name: string; section: AptitudeSection; description?: string; icon?: string; order?: number }): Promise<AptitudeTopic> {
    const { data } = await this.api.post('/topics', topic);
    return data.data;
  }

  async updateTopic(topicId: string, updates: Partial<AptitudeTopic>): Promise<AptitudeTopic> {
    const { data } = await this.api.put(`/topics/${topicId}`, updates);
    return data.data;
  }

  async deleteTopic(topicId: string): Promise<void> {
    await this.api.delete(`/topics/${topicId}`);
  }

  async getTopicStats(topicId: string): Promise<TopicStats> {
    const { data } = await this.api.get(`/topics/${topicId}/stats`);
    return data.data;
  }

  // ── Chapters ─────────────────────────────────────────────────────────────────

  async getChapters(topicId: string) {
    const { data } = await this.api.get(`/topics/${topicId}/chapters`, { params: { limit: 100 } });
    return { chapters: (data.data || []) as AptitudeChapter[], pagination: data.pagination };
  }

  async createChapter(topicId: string, chapter: { name: string; description?: string; order?: number }): Promise<AptitudeChapter> {
    const { data } = await this.api.post(`/topics/${topicId}/chapters`, chapter);
    return data.data;
  }

  async updateChapter(topicId: string, chapterId: string, updates: Partial<AptitudeChapter>): Promise<AptitudeChapter> {
    const { data } = await this.api.put(`/topics/${topicId}/chapters/${chapterId}`, updates);
    return data.data;
  }

  async deleteChapter(topicId: string, chapterId: string): Promise<void> {
    await this.api.delete(`/topics/${topicId}/chapters/${chapterId}`);
  }

  // ── Questions (flat — topic-level) ──────────────────────────────────────────

  async getTopicQuestions(topicId: string, params?: { page?: number; limit?: number; search?: string; difficulty?: string; type?: string }) {
    const { data } = await this.api.get(`/topics/${topicId}/questions`, { params: { limit: 20, ...params } });
    return { questions: (data.data || []) as AptitudeQuestion[], pagination: data.pagination };
  }

  async createTopicQuestion(topicId: string, question: Omit<AptitudeQuestion, 'id'>): Promise<AptitudeQuestion> {
    const { data } = await this.api.post(`/topics/${topicId}/questions`, question);
    return data.data;
  }

  // ── Questions (chapter-nested) ────────────────────────────────────────────

  async getQuestions(topicId: string, chapterId: string, params?: { page?: number; limit?: number; search?: string; difficulty?: string }) {
    const { data } = await this.api.get(`/topics/${topicId}/chapters/${chapterId}/questions`, { params });
    return { questions: (data.data || []) as AptitudeQuestion[], pagination: data.pagination };
  }

  async getQuestion(topicId: string, chapterId: string, questionId: string): Promise<AptitudeQuestion> {
    const { data } = await this.api.get(`/topics/${topicId}/chapters/${chapterId}/questions/${questionId}`);
    return data.data;
  }

  async createQuestion(topicId: string, chapterId: string, question: Omit<AptitudeQuestion, 'id'>): Promise<AptitudeQuestion> {
    const { data } = await this.api.post(`/topics/${topicId}/chapters/${chapterId}/questions`, question);
    return data.data;
  }

  async updateQuestion(topicId: string, chapterId: string, questionId: string, updates: Partial<AptitudeQuestion>): Promise<AptitudeQuestion> {
    const { data } = await this.api.put(`/topics/${topicId}/chapters/${chapterId}/questions/${questionId}`, updates);
    return data.data;
  }

  async deleteQuestion(topicId: string, chapterId: string, questionId: string): Promise<void> {
    await this.api.delete(`/topics/${topicId}/chapters/${chapterId}/questions/${questionId}`);
  }

  async duplicateQuestion(topicId: string, chapterId: string, questionId: string): Promise<AptitudeQuestion> {
    const { data } = await this.api.post(`/topics/${topicId}/chapters/${chapterId}/questions/${questionId}/duplicate`);
    return data.data;
  }

  // ── Bulk Operations ──────────────────────────────────────────────────────────

  async bulkDeleteQuestions(topicId: string, questionIds: string[]): Promise<{ deleted: number }> {
    const { data } = await this.api.post(`/topics/${topicId}/bulk-delete-questions`, { questionIds });
    return data.data;
  }

  async importQuestions(topicId: string, questions: any[], chapterId?: string): Promise<ImportResult> {
    const { data } = await this.api.post(`/topics/${topicId}/import-questions`, { questions, chapterId });
    return data.data;
  }

  async exportQuestions(topicId: string, format: 'json' | 'csv' = 'json'): Promise<void> {
    const response = await this.api.get(`/topics/${topicId}/export-questions`, {
      params: { format },
      responseType: format === 'csv' ? 'blob' : 'json',
    });
    const blob = format === 'csv'
      ? new Blob([response.data], { type: 'text/csv' })
      : new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `questions.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Seed ─────────────────────────────────────────────────────────────────────

  async seedDefaultTopics(safe = true): Promise<{ created: number; skipped?: number; total: number }> {
    const endpoint = safe ? '/seed/safe' : '/seed';
    const { data } = await axios.post(
      `${API_BASE_URL}/admin/aptitude/seed${safe ? '/safe' : ''}`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
    );
    return data.data;
  }

  // ── Global Stats ─────────────────────────────────────────────────────────────

  async getStats() {
    const { data } = await this.api.get('/stats');
    return data.data;
  }
}

export const aptitudeAdminService = new AptitudeAdminService();
