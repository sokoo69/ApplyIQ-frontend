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

export interface GenerateCoverLetterPayload {
  applicationId: string;
  tone: 'Professional' | 'Friendly' | 'Confident';
  length: 'Short' | 'Medium' | 'Long';
}

export const aiApi = {
  async generateCoverLetter(data: GenerateCoverLetterPayload): Promise<any> {
    const res = await fetch(`${API_URL}/ai/cover-letter`, {
      method: 'POST',
      headers: defaultHeaders,
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
};
