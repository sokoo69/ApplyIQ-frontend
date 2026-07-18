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

export const usersApi = {
  async updateProfile(data: { name?: string; resumeText?: string }): Promise<any> {
    const res = await fetch(`${API_URL}/users/me`, {
      method: 'PATCH',
      headers: defaultHeaders,
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async uploadResumePdf(file: File): Promise<{ text: string }> {
    const formData = new FormData();
    formData.append('resume', file);

    const res = await fetch(`${API_URL}/users/me/resume-upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    return handleResponse(res);
  }
};
