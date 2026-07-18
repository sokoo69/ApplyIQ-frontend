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

export interface MatchScorePayload {
  jobId: string;
  priority?: 'balanced' | 'prioritize_salary' | 'prioritize_skills';
}

export interface MatchFeedbackPayload {
  jobId: string;
  signal: 'applied' | 'rejected' | 'not_interested' | 'saved';
  matchScoreAtTime: number;
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

  async getMatchScore(data: MatchScorePayload): Promise<any> {
    const res = await fetch(`${API_URL}/ai/match`, {
      method: 'POST',
      headers: defaultHeaders,
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async recordMatchFeedback(data: MatchFeedbackPayload): Promise<any> {
    const res = await fetch(`${API_URL}/ai/match/feedback`, {
      method: 'POST',
      headers: defaultHeaders,
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
};
