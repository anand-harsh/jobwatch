import { JobApplication } from "./mock-data";

const API_BASE = "/api";

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Network error" }));
    throw new Error(error.message || `HTTP error ${response.status}`);
  }
  
  return response.json();
}

export const jobApi = {
  getJobs: async (): Promise<JobApplication[]> => {
    return fetchWithAuth(`${API_BASE}/jobs`);
  },

  addJob: async (job: Omit<JobApplication, "id">): Promise<JobApplication> => {
    return fetchWithAuth(`${API_BASE}/jobs`, {
      method: "POST",
      body: JSON.stringify(job),
    });
  },

  updateJob: async (id: string, updates: Partial<JobApplication>): Promise<JobApplication> => {
    return fetchWithAuth(`${API_BASE}/jobs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  deleteJobs: async (ids: string[]): Promise<{ deletedCount: number }> => {
    return fetchWithAuth(`${API_BASE}/jobs`, {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    });
  },
};
