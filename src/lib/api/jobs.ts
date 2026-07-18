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

export const jobsApi = {
  async getJobs(params?: { category?: string; location?: string; search?: string; sort?: string; page?: number; limit?: number }) {
    const url = new URL(`${API_URL}/jobs`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, String(value));
      });
    }
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: defaultHeaders,
    });
    return handleResponse(res);
  },

  async getJobById(id: string) {
    const res = await fetch(`${API_URL}/jobs/${id}`, {
      method: 'GET',
      headers: defaultHeaders,
    });
    return handleResponse(res);
  },

  async createJob(data: any) {
    const res = await fetch(`${API_URL}/jobs`, {
      method: 'POST',
      headers: defaultHeaders,
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateJob(id: string, data: any) {
    const res = await fetch(`${API_URL}/jobs/${id}`, {
      method: 'PATCH',
      headers: defaultHeaders,
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteJob(id: string) {
    const res = await fetch(`${API_URL}/jobs/${id}`, {
      method: 'DELETE',
      headers: defaultHeaders,
      credentials: 'include',
    });
    return handleResponse(res);
  },
};
