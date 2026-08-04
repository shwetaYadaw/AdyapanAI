import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/v1';

interface TcsQuestion {
  id?: string;
  title: string;
  slug?: string;
  difficulty: string;
  statement: string;
  constraints: string;
  inputFormat: string;
  outputFormat: string;
  timeLimit?: number;
  memoryLimit?: number;
  referenceSolution: string;
  topics?: string;
  companies?: string;
  testCases?: any[];
}

interface TcsQuestionResponse {
  questions: TcsQuestion[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

class TcsNqtAdminService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/admin/tcs-nqt`,
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

  /**
   * Create a new TCS NQT question
   */
  async createQuestion(question: TcsQuestion): Promise<TcsQuestion> {
    const { data } = await this.api.post('/', question);
    return data.data;
  }

  /**
   * Get all TCS NQT questions with filters
   */
  async getQuestions(filters?: any): Promise<TcsQuestionResponse> {
    const { data } = await this.api.get('/', { params: filters });
    return {
      questions: data.data ?? [],
      pagination: data.pagination ?? { total: 0, page: 1, limit: 20, pages: 0 },
    };
  }

  /**
   * Get a single TCS NQT question
   */
  async getQuestion(id: string): Promise<TcsQuestion> {
    const { data } = await this.api.get(`/${id}`);
    return data.data;
  }

  /**
   * Update a TCS NQT question
   */
  async updateQuestion(id: string, question: Partial<TcsQuestion>): Promise<TcsQuestion> {
    const { data } = await this.api.put(`/${id}`, question);
    return data.data;
  }

  /**
   * Delete a TCS NQT question
   */
  async deleteQuestion(id: string): Promise<void> {
    await this.api.delete(`/${id}`);
  }

  /**
   * Import TCS NQT questions from JSON
   */
  async importQuestions(questions: TcsQuestion[]): Promise<any> {
    const { data } = await this.api.post('/bulk/import', { questions });
    return data.data;
  }

  /**
   * Get TCS NQT analytics
   */
  async getAnalytics(): Promise<any> {
    const { data } = await this.api.get('/analytics/overview');
    return data.data;
  }
}

export const tcsNqtAdminService = new TcsNqtAdminService();
