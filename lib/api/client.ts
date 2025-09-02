import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '@/types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Handle token refresh or redirect to login
          await this.refreshToken();
        }
        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private async refreshToken(): Promise<void> {
    // Implement token refresh logic
    // This would typically call a refresh endpoint
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }
}

export const api = new ApiClient();

// Specific API endpoints
export const veteransApi = {
  list: (params?: any) => api.get('/api/v1/veterans', { params }),
  get: (id: string) => api.get(`/api/v1/veterans/${id}`),
  create: (data: any) => api.post('/api/v1/veterans', data),
  update: (id: string, data: any) => api.put(`/api/v1/veterans/${id}`, data),
  delete: (id: string) => api.delete(`/api/v1/veterans/${id}`)
};

export const vetProfileApi = {
  sync: (data: any) => api.post('/api/v1/vet-profile/sync', data),
  status: () => api.get('/api/v1/vet-profile/status'),
  accuracy: () => api.get('/api/v1/vet-profile/accuracy'),
  mpdSync: (data: any) => api.post('/api/v1/mpd/sync', data)
};

export const claimsApi = {
  list: (params?: any) => api.get('/api/v1/claims', { params }),
  get: (id: string) => api.get(`/api/v1/claims/${id}`),
  create: (data: any) => api.post('/api/v1/claims', data),
  update: (id: string, data: any) => api.put(`/api/v1/claims/${id}`, data),
  process: (id: string) => api.post(`/api/v1/claims/${id}/process`)
};

export const documentsApi = {
  upload: (formData: FormData) => 
    api.post('/api/v1/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  generatePdf: (data: any) => api.post('/api/v1/documents/generate-pdf', data),
  download: (id: string) => api.get(`/api/v1/documents/${id}/download`, {
    responseType: 'blob'
  })
};

export const metricsApi = {
  dashboard: () => api.get('/api/v1/metrics/dashboard'),
  realtime: () => api.get('/api/v1/metrics/realtime'),
  export: (params: any) => api.post('/api/v1/metrics/export', params, {
    responseType: 'blob'
  })
};

export const authApi = {
  login: (credentials: any) => api.post('/api/v1/auth/login', credentials),
  register: (data: any) => api.post('/api/v1/auth/register', data),
  logout: () => api.post('/api/v1/auth/logout'),
  refresh: () => api.post('/api/v1/auth/refresh'),
  profile: () => api.get('/api/v1/auth/profile')
};