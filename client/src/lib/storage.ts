import { initialJobs, JobApplication } from "./mock-data";

const STORAGE_KEY = "job_tracker_data";

export const storage = {
  getJobs: (): JobApplication[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Initialize with mock data if empty
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialJobs));
      return initialJobs;
    }
    return JSON.parse(stored);
  },

  saveJobs: (jobs: JobApplication[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  },

  addJob: (job: JobApplication) => {
    const jobs = storage.getJobs();
    const newJobs = [job, ...jobs];
    storage.saveJobs(newJobs);
    return newJobs;
  },

  updateJob: (id: string, field: keyof JobApplication, value: any) => {
    const jobs = storage.getJobs();
    const newJobs = jobs.map((job) =>
      job.id === id ? { ...job, [field]: value } : job
    );
    storage.saveJobs(newJobs);
    return newJobs;
  },

  deleteJobs: (ids: string[]) => {
    const jobs = storage.getJobs();
    const newJobs = jobs.filter((job) => !ids.includes(job.id));
    storage.saveJobs(newJobs);
    return newJobs;
  }
};
