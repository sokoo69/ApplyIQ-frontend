export interface CreateApplicationPayload {
  job?: string;
  title?: string;
  shortDescription?: string;
  fullDescription?: string;
  priority?: 'Low' | 'Medium' | 'High';
  deadline?: string;
  imageUrl?: string;
}

export interface Application {
  _id: string;
  user: string;
  job?: string; // Reference to Job if it exists
  
  // Custom fields for manually tracked applications based on requirements
  title?: string;
  shortDescription?: string;
  fullDescription?: string;
  priority?: 'Low' | 'Medium' | 'High';
  deadline?: string;
  imageUrl?: string;
  
  // Standard Application fields from backend model
  status: 'Saved' | 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  notes?: string;
  appliedAt?: string;
  statusHistory?: Array<{
    status: string;
    changedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
