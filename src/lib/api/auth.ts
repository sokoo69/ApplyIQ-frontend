const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

async function handleResponse(response: Response) {
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Ignore if response is not JSON
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

export const authApi = {
  async register(data: any) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: defaultHeaders,
      credentials: 'omit', // Standard register doesn't need credentials in, but backend sets cookie out
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async login(data: any) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: defaultHeaders,
      credentials: 'omit',
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async demoLogin() {
    const res = await fetch(`${API_URL}/auth/demo-login`, {
      method: 'POST',
      headers: defaultHeaders,
      credentials: 'omit',
    });
    return handleResponse(res);
  },

  async logout() {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: defaultHeaders,
      credentials: 'include', // Important to send cookie to clear it
    });
    return handleResponse(res);
  },

  async getCurrentUser() {
    const res = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: defaultHeaders,
      credentials: 'include', // Extremely important: sends the httpOnly cookie
    });
    return handleResponse(res);
  },
};
