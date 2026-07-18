const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const defaultHeaders = { 'Content-Type': 'application/json' };

async function handleResponse(response: Response) {
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch { /* ignore */ }
    throw new Error(errorMessage);
  }
  return response.json();
}

export const dashboardApi = {
  async getSummary() {
    const res = await fetch(`${API_URL}/dashboard/summary`, { method: 'GET', headers: defaultHeaders, credentials: 'include' });
    return handleResponse(res);
  },
  async getSkillGaps() {
    const res = await fetch(`${API_URL}/dashboard/skill-gaps`, { method: 'GET', headers: defaultHeaders, credentials: 'include' });
    return handleResponse(res);
  },
  async getAIUsage() {
    const res = await fetch(`${API_URL}/dashboard/ai-usage`, { method: 'GET', headers: defaultHeaders, credentials: 'include' });
    return handleResponse(res);
  },
  async getUpcomingDeadlines() {
    const res = await fetch(`${API_URL}/dashboard/upcoming-deadlines`, { method: 'GET', headers: defaultHeaders, credentials: 'include' });
    return handleResponse(res);
  },
};
