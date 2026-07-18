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

export const adminApi = {
  async getAuditLogs(params?: { page?: number; limit?: number }): Promise<any> {
    const q = new URLSearchParams();
    if (params?.page) q.append('page', params.page.toString());
    if (params?.limit) q.append('limit', params.limit.toString());
    const res = await fetch(`${API_URL}/admin/audit-log${q.toString() ? '?' + q : ''}`, {
      method: 'GET', headers: defaultHeaders, credentials: 'include',
    });
    return handleResponse(res);
  },

  async getStats(): Promise<any> {
    const res = await fetch(`${API_URL}/admin/stats`, {
      method: 'GET', headers: defaultHeaders, credentials: 'include',
    });
    return handleResponse(res);
  },

  async getUsers(params?: { page?: number; limit?: number }): Promise<any> {
    const q = new URLSearchParams();
    if (params?.page) q.append('page', params.page.toString());
    if (params?.limit) q.append('limit', params.limit.toString());
    const res = await fetch(`${API_URL}/admin/users${q.toString() ? '?' + q : ''}`, {
      method: 'GET', headers: defaultHeaders, credentials: 'include',
    });
    return handleResponse(res);
  },

  async createJob(data: any): Promise<any> {
    const res = await fetch(`${API_URL}/admin/jobs`, {
      method: 'POST', headers: defaultHeaders, credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateJob(id: string, data: any): Promise<any> {
    const res = await fetch(`${API_URL}/admin/jobs/${id}`, {
      method: 'PUT', headers: defaultHeaders, credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteJob(id: string): Promise<any> {
    const res = await fetch(`${API_URL}/admin/jobs/${id}`, {
      method: 'DELETE', headers: defaultHeaders, credentials: 'include',
    });
    return handleResponse(res);
  },

  async getJobApplications(jobId: string): Promise<any> {
    const res = await fetch(`${API_URL}/admin/jobs/${jobId}/applications`, {
      method: 'GET', headers: defaultHeaders, credentials: 'include',
    });
    return handleResponse(res);
  },

  async updateApplicationStatus(id: string, status: string): Promise<any> {
    const res = await fetch(`${API_URL}/admin/applications/${id}/status`, {
      method: 'PATCH', headers: defaultHeaders, credentials: 'include',
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },
};
