import Cookies from 'js-cookie';
import { Book, LibraryBook, User, UserStats, AuthTokens } from '../types';
import { API_CONFIG, ENDPOINTS } from '../config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

class ApiService {
  private getAuthHeader() {
    const token = Cookies.get('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}`);
    }
    return response.json();
  }

  // Auth endpoints
  async register(username: string, email: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH.REGISTER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    return this.handleResponse(response);
  }

  async login(username: string, password: string): Promise<AuthTokens> {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const tokens = await this.handleResponse(response);
    
    // Stocker les tokens dans les cookies
    Cookies.set('access_token', tokens.access, { expires: 1 });
    Cookies.set('refresh_token', tokens.refresh, { expires: 7 });
    
    return tokens;
  }

  async logout(): Promise<void> {
    const refreshToken = Cookies.get('refresh_token');
    
    if (refreshToken) {
      try {
        await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH.LOGOUT}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...this.getAuthHeader(),
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
  }

  async verifyToken(): Promise<boolean> {
    const token = Cookies.get('access_token');
    if (!token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH.VERIFY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  async refreshToken(): Promise<string | null> {
    const refreshToken = Cookies.get('refresh_token');
    if (!refreshToken) return null;

    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH.REFRESH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        Cookies.set('access_token', data.access, { expires: 1 });
        return data.access;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
    }

    return null;
  }

  // Book endpoints
  async lookupBook(isbn: string): Promise<Book> {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.BOOKS.LOOKUP}?isbn=${isbn}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
    });

    return this.handleResponse(response);
  }

  // Library endpoints
  async getLibrary(): Promise<LibraryBook[]> {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.LIBRARY.LIST}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
    });

    return this.handleResponse(response);
  }

  async addBooks(books: { isbn: string; status: string }[]): Promise<{ added: any[]; errors: any[] }> {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.LIBRARY.ADD}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify({ books }),
    });

    return this.handleResponse(response);
  }

  async removeBooks(isbns: string[]): Promise<{ removed: string[]; errors: any[] }> {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.LIBRARY.REMOVE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify({ isbns }),
    });

    return this.handleResponse(response);
  }

  async updateBookStatus(isbn: string, status: string): Promise<{ isbn: string; new_status: string }> {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.LIBRARY.UPDATE_STATUS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify({ isbn, status }),
    });

    return this.handleResponse(response);
  }

  // User endpoints
  async getUserStats(): Promise<UserStats> {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.USER.STATS}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
    });

    return this.handleResponse(response);
  }

  async updateProfile(updates: Partial<{ username: string; email: string }>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.USER.UPDATE}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(updates),
    });

    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();