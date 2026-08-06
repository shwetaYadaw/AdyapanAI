import axios, { AxiosInstance } from 'axios';
import { TcsQuestion } from '../types/tcsNqt';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/v1';

export type { TcsQuestion };

class TcsNqtAdminService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/admin/tcs-nqt`,
      withCredentials: true,
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async createQuestion(question: TcsQuestion): Promise<TcsQuestion> {
    const { data } = await this.api.post('/', question);
    return data.data;
  }

  async getQuestions(filters?: any): Promise<{ questions: TcsQuestion[]; pagination: any }> {
    const { data } = await this.api.get('/', { params: filters });
    return {
      questions: data.data ?? [],
      pagination: data.pagination ?? { total: 0, page: 1, limit: 20, pages: 0 },
    };
  }

  async getQuestion(id: string): Promise<TcsQuestion> {
    const { data } = await this.api.get(`/${id}`);
    return data.data;
  }

  async updateQuestion(id: string, question: Partial<TcsQuestion>): Promise<TcsQuestion> {
    const { data } = await this.api.put(`/${id}`, question);
    return data.data;
  }

  async deleteQuestion(id: string): Promise<void> {
    await this.api.delete(`/${id}`);
  }

  async importQuestions(questions: TcsQuestion[]): Promise<any> {
    const { data } = await this.api.post('/bulk/import', { questions });
    return data.data;
  }

  async getAnalytics(): Promise<any> {
    const { data } = await this.api.get('/analytics/overview');
    return data.data;
  }
}

export const tcsNqtAdminService = new TcsNqtAdminService();
