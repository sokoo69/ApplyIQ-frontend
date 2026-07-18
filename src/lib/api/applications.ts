import { CreateApplicationPayload, Application } from '@/types/application';

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

export const applicationsApi = {
  async createApplication(data: CreateApplicationPayload): Promise<Application> {
    const res = await fetch(`${API_URL}/applications`, {
      method: 'POST',
      headers: defaultHeaders,
      credentials: 'include', // Extremely important to send httpOnly auth cookie
      body: JSON.stringify(data),
    });
    
    return handleResponse(res);
  },
};
