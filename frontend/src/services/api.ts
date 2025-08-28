const API_BASE_URL = 'http://localhost:3000';

class ApiService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(username: string, email: string, password: string, sec_password?: string) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, sec_password }),
    });
  }

  // User endpoints
  async getMe() {
    return this.request('/users/me');
  }

  async updateMe(data: any) {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Books endpoints
  async getBooks(search?: string) {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.request(`/books${query}`);
  }

  async getBook(id: number) {
    return this.request(`/books/${id}`);
  }

  async createBook(data: any) {
    return this.request('/books', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBook(id: number, data: any) {
    return this.request(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBook(id: number) {
    return this.request(`/books/${id}`, {
      method: 'DELETE',
    });
  }

  // Tags endpoints
  async getTags() {
    return this.request('/tags');
  }

  async createTag(data: any) {
    return this.request('/tags', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTag(id: number, data: any) {
    return this.request(`/tags/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteTag(id: number) {
    return this.request(`/tags/${id}`, {
      method: 'DELETE',
    });
  }

  // Entities endpoints
  async getEntities() {
    return this.request('/entities');
  }

  async getEntity(id: number) {
    return this.request(`/entities/${id}`);
  }

  async createEntity(data: any) {
    return this.request('/entities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEntity(id: number, data: any) {
    return this.request(`/entities/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteEntity(id: number) {
    return this.request(`/entities/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
