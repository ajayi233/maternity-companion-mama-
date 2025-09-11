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
        throw new Error('Token expired');
      }
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    
    return data.data || data;
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
      token: string;
    }>(response);

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
      token: string;
    }>(response);

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
      method: 'POST',
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

  async checkPhoneExists(phone: string) {
    const response = await fetch(`${API_BASE_URL}/auth/check-phone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });

    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();