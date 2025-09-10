const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    let data: ApiResponse<T>;
    
    try {
      data = await response.json();
    } catch (error) {
      throw new Error('Invalid response from server');
    }
    
    if (!response.ok) {
      if (response.status === 401 && (data.message?.includes('expired') || data.message?.includes('Token expired'))) {
        try {
          await this.refreshToken();
          throw new Error('TOKEN_EXPIRED');
        } catch (refreshError) {
          this.clearTokens();
          window.location.href = '/';
          throw new Error('Session expired. Please login again.');
        }
      }
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    
    return data.data || data;
  }

  async refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      this.clearTokens();
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      const data = await this.handleResponse<{ accessToken: string; refreshToken: string }>(response);
      
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('mama_user');
  }

  async register(userData: {
    name: string;
    phone: string;
    password: string;
    dueDate?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const data = await this.handleResponse<{
      user: any;
      accessToken: string;
      refreshToken: string;
    }>(response);

    if (data.accessToken && data.refreshToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('mama_user', JSON.stringify(data.user));
    }

    return data;
  }

  async login(credentials: { phone: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    const data = await this.handleResponse<{
      user: any;
      accessToken: string;
      refreshToken: string;
    }>(response);

    if (data.accessToken && data.refreshToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('mama_user', JSON.stringify(data.user));
    }

    return data;
  }

  async forgotPassword(phone: string) {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });

    return this.handleResponse(response);
  }

  async resetPassword(resetToken: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resetToken, password })
    });

    return this.handleResponse(response);
  }

  async logout() {
    const refreshToken = localStorage.getItem('refreshToken');
    
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ refreshToken })
      });
    } finally {
      this.clearTokens();
    }
  }

  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: this.getAuthHeaders()
    });

    return this.handleResponse<{ user: any }>(response);
  }
}

export const apiService = new ApiService();