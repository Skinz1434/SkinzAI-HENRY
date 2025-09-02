export interface ClaimDocument {
  id: string;
  claimId: string;
  type: 'Medical Evidence' | 'Service Records' | 'Nexus Letter' | 'Buddy Statement' | 'VA Form' | 'Supporting Document';
  name: string;
  uploadDate: Date;
  size: string;
  status: 'Pending Review' | 'Reviewed' | 'Accepted' | 'Additional Info Needed';
  reviewer?: string;
  reviewDate?: Date;
  notes?: string;
}

export interface ClaimTimeline {
  id: string;
  claimId: string;
  date: Date;
  event: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  actor: string;
  icon?: 'filing' | 'review' | 'evidence' | 'decision' | 'appeal' | 'payment';
}

export interface ClaimContention {
  id: string;
  claimId: string;
  condition: string;
  currentRating: number;
  requestedRating: number;
  status: 'Granted' | 'Denied' | 'Deferred' | 'Pending';
  effective_date?: Date;
  diagnostic_code?: string;
  bilateral?: boolean;
  presumptive?: boolean;
}

export interface ClaimEvidence {
  id: string;
  claimId: string;
  type: 'STR' | 'Private Medical' | 'VA Medical' | 'Lay Statement' | 'Employment' | 'Other';
  source: string;
  date_range: { start: Date; end: Date };
  status: 'Submitted' | 'Requested' | 'Received' | 'Missing';
  description: string;
}

export interface ClaimDetail {
  // Basic Info
  id: string;
  claimNumber: string;
  type: 'Compensation' | 'Pension' | 'Survivor' | 'Education' | 'Insurance' | 'Burial';
  
  // Status
  status: 'Open' | 'Initial Review' | 'Evidence Gathering' | 'Review of Evidence' | 'Preparation for Decision' | 'Pending Decision Approval' | 'Complete';
  phase: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  
  // Dates
  filingDate: Date;
  lastUpdated: Date;
  estimatedCompletion?: Date;
  suspenseDate?: Date;
  
  // Details
  regionalOffice: string;
  POA: string; // Power of Attorney
  
  // Contentions
  contentions: ClaimContention[];
  
  // Evidence
  evidence: ClaimEvidence[];
  documents: ClaimDocument[];
  
  // Timeline
  timeline: ClaimTimeline[];
  
  // Decisions
  decisionDate?: Date;
  decisionType?: 'Full Grant' | 'Partial Grant' | 'Denial';
  effectiveDate?: Date;
  retroactiveAmount?: number;
  monthlyIncrease?: number;
  newCombinedRating?: number;
  
  // Appeals
  appealable: boolean;
  appealDeadline?: Date;
  hasAppeal?: boolean;
  
  // Communications
  letters: Array<{
    id: string;
    date: Date;
    type: string;
    subject: string;
    status: 'Sent' | 'Pending';
  }>;
  
  // Exam Requests
  exams: Array<{
    id: string;
    type: 'C&P' | 'ACE' | 'DBQ';
    specialty: string;
    scheduledDate?: Date;
    completedDate?: Date;
    location: string;
    status: 'Scheduled' | 'Completed' | 'No-Show' | 'Cancelled';
    provider: string;
  }>;
}