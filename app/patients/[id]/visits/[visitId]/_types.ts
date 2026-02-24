export interface VisitAttachment {
  _id: string;
  filename: string;
  url: string;
  uploadedAt: string;
}

export interface Visit {
  _id: string;
  date: string;
  reason: string;
  diagnosis?: string;
  procedure?: string;
  doctor?: string;
  nextSteps?: string;
  visitAttachments?: VisitAttachment[];
  createdAt: string;
}
