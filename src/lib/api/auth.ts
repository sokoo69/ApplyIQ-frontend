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
  async register(data: { email: string; password: string; name: string }) {
    const res = await fetch(`${API_URL}/auth/sign-up/email`, {
      method: 'POST',
      headers: defaultHeaders,
      credentials: 'include', // Must include cookies for Better Auth CSRF protection
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        name: data.name,
      }),
    });
    return handleResponse(res);
  },

  async login(data: { email: string; password: string }) {
    const res = await fetch(`${API_URL}/auth/sign-in/email`, {
      method: 'POST',
      headers: defaultHeaders,
      credentials: 'include', // Must include cookies for Better Auth session cookie
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });
    return handleResponse(res);
  },

  async demoLogin() {
    const res = await fetch(`${API_URL}/auth/demo-login`, {
      method: 'POST',
      headers: defaultHeaders,
      credentials: 'include',
    });
    return handleResponse(res);
  },

  async logout() {
    const res = await fetch(`${API_URL}/auth/sign-out`, {
      method: 'POST',
      headers: defaultHeaders,
      credentials: 'include',
    });
    return handleResponse(res);
  },

  async getCurrentUser() {
    const res = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: defaultHeaders,
      credentials: 'include', // Sends the better-auth.session_token cookie
    });
    return handleResponse(res);
  },
};
