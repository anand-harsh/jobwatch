export type JobStatus = 
  | "Applied" 
  | "Shortlisted" 
  | "Interview Scheduled" 
  | "Technical Interview" 
  | "Offer Received" 
  | "Rejected" 
  | "Withdrawn";

export type JobCategory = "Big Tech" | "Startup" | "Mid-Tier" | "Other";

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  dateApplied: string;
  status: JobStatus;
  notes: string;
  category: JobCategory;
  createdAt?: Date;
  updatedAt?: Date;
}
