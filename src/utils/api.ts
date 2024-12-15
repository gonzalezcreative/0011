import { API_CONFIG } from '../config/api';

interface ApiError extends Error {
  status?: number;
  code?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = new Error('API request failed');
      error.status = response.status;
      
      try {
        const errorData = await response.json();
        error.message = errorData.error || error.message;
        error.code = errorData.code;
      } catch {
        error.message = response.statusText;
      }
      
      throw error;
    }

    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to the server. Please ensure the server is running and try again.');
      }
      throw error;
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}${API_CONFIG.endpoints.health}`);
      const data = await response.json();
      return data.status === 'ok';
    } catch {
      return false;
    }
  }
}

export const apiClient = new ApiClient(API_CONFIG.baseUrl);