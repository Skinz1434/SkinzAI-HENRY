import { ClaimDetail, ClaimContention, ClaimEvidence, ClaimDocument, ClaimTimeline } from './claims-types';

export function generateDetailedClaim(basicClaim: any): ClaimDetail {
  const filingDate = new Date(basicClaim.filingDate);
  const currentDate = new Date();
  const daysSinceFiling = Math.floor((currentDate.getTime() - filingDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Determine phase based on days since filing
  const phase = Math.min(8, Math.floor(daysSinceFiling / 30) + 1) as any;
  
  // Generate contentions
  const contentions: ClaimContention[] = [
    {
      id: `cont-1`,
      claimId: basicClaim.claimNumber,
      condition: 'Post Traumatic Stress Disorder (PTSD)',
      currentRating: 30,
      requestedRating: 70,
      status: phase >= 7 ? 'Granted' : 'Pending',
      diagnostic_code: '9411',
      presumptive: false,
      bilateral: false,
      effective_date: phase >= 7 ? filingDate : undefined
    },
    {
      id: `cont-2`,
      claimId: basicClaim.claimNumber,
      condition: 'Bilateral Knee Strain',
      currentRating: 10,
      requestedRating: 20,
      status: phase >= 7 ? 'Granted' : 'Pending',
      diagnostic_code: '5260',
      bilateral: true,
      presumptive: false,
      effective_date: phase >= 7 ? filingDate : undefined
    },
    {
      id: `cont-3`,
      claimId: basicClaim.claimNumber,
      condition: 'Tinnitus',
      currentRating: 0,
      requestedRating: 10,
      status: phase >= 7 ? 'Granted' : 'Pending',
      diagnostic_code: '6260',
      presumptive: true,
      bilateral: false,
      effective_date: phase >= 7 ? filingDate : undefined
    },
    {
      id: `cont-4`,
      claimId: basicClaim.claimNumber,
      condition: 'Lower Back Pain (Lumbar Strain)',
      currentRating: 20,
      requestedRating: 40,
      status: phase >= 7 ? 'Deferred' : 'Pending',
      diagnostic_code: '5237',
      presumptive: false,
      bilateral: false
    }
  ];

  // Generate evidence
  const evidence: ClaimEvidence[] = [
    {
      id: 'ev-1',
      claimId: basicClaim.claimNumber,
      type: 'STR',
      source: 'National Personnel Records Center',
      date_range: { 
        start: new Date(2005, 0, 1), 
        end: new Date(2010, 11, 31) 
      },
      status: 'Received',
      description: 'Complete service treatment records from active duty'
    },
    {
      id: 'ev-2',
      claimId: basicClaim.claimNumber,
      type: 'VA Medical',
      source: 'VA Medical Center - Los Angeles',
      date_range: { 
        start: new Date(2020, 0, 1), 
        end: currentDate 
      },
      status: 'Received',
      description: 'VA treatment records for PTSD and knee conditions'
    },
    {
      id: 'ev-3',
      claimId: basicClaim.claimNumber,
      type: 'Private Medical',
      source: 'Dr. Smith - Orthopedic Specialist',
      date_range: { 
        start: new Date(2021, 6, 1), 
        end: new Date(2023, 6, 1) 
      },
      status: 'Submitted',
      description: 'Private orthopedic treatment records and MRI results'
    },
    {
      id: 'ev-4',
      claimId: basicClaim.claimNumber,
      type: 'Lay Statement',
      source: 'Spouse Statement',
      date_range: { 
        start: new Date(2023, 0, 1), 
        end: new Date(2023, 0, 1) 
      },
      status: 'Submitted',
      description: 'Spouse statement regarding PTSD symptoms and impact on daily life'
    },
    {
      id: 'ev-5',
      claimId: basicClaim.claimNumber,
      type: 'Employment',
      source: 'Former Employer - ABC Corp',
      date_range: { 
        start: new Date(2015, 0, 1), 
        end: new Date(2022, 11, 31) 
      },
      status: phase >= 3 ? 'Received' : 'Requested',
      description: 'Employment records showing missed work due to medical appointments'
    }
  ];

  // Generate documents
  const documents: ClaimDocument[] = [
    {
      id: 'doc-1',
      claimId: basicClaim.claimNumber,
      type: 'VA Form',
      name: 'VA Form 21-526EZ - Application for Disability Compensation',
      uploadDate: filingDate,
      size: '2.4MB',
      status: 'Accepted',
      reviewer: 'System',
      reviewDate: filingDate
    },
    {
      id: 'doc-2',
      claimId: basicClaim.claimNumber,
      type: 'Medical Evidence',
      name: 'PTSD_DBQ_DrJohnson.pdf',
      uploadDate: new Date(filingDate.getTime() + 7 * 24 * 60 * 60 * 1000),
      size: '856KB',
      status: 'Accepted',
      reviewer: 'Claims Processor',
      reviewDate: new Date(filingDate.getTime() + 10 * 24 * 60 * 60 * 1000),
      notes: 'DBQ completed by treating psychiatrist'
    },
    {
      id: 'doc-3',
      claimId: basicClaim.claimNumber,
      type: 'Nexus Letter',
      name: 'Nexus_Letter_Knee_Condition.pdf',
      uploadDate: new Date(filingDate.getTime() + 14 * 24 * 60 * 60 * 1000),
      size: '1.2MB',
      status: 'Reviewed',
      reviewer: 'Medical Reviewer',
      reviewDate: new Date(filingDate.getTime() + 20 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'doc-4',
      claimId: basicClaim.claimNumber,
      type: 'Service Records',
      name: 'DD214_Certificate_of_Release.pdf',
      uploadDate: filingDate,
      size: '445KB',
      status: 'Accepted',
      reviewer: 'System',
      reviewDate: filingDate
    },
    {
      id: 'doc-5',
      claimId: basicClaim.claimNumber,
      type: 'Buddy Statement',
      name: 'Buddy_Statement_Combat_Incident.pdf',
      uploadDate: new Date(filingDate.getTime() + 30 * 24 * 60 * 60 * 1000),
      size: '234KB',
      status: phase >= 4 ? 'Accepted' : 'Pending Review',
      notes: 'Statement from squad member confirming combat incident'
    }
  ];

  // Generate timeline
  const timeline: ClaimTimeline[] = [
    {
      id: 't-1',
      claimId: basicClaim.claimNumber,
      date: filingDate,
      event: 'Claim Filed',
      description: 'Initial claim for increase submitted via eBenefits',
      status: 'completed',
      actor: 'Veteran',
      icon: 'filing'
    },
    {
      id: 't-2',
      claimId: basicClaim.claimNumber,
      date: new Date(filingDate.getTime() + 3 * 24 * 60 * 60 * 1000),
      event: 'Claim Acknowledged',
      description: 'VA acknowledged receipt of claim',
      status: 'completed',
      actor: 'VA System',
      icon: 'review'
    },
    {
      id: 't-3',
      claimId: basicClaim.claimNumber,
      date: new Date(filingDate.getTime() + 7 * 24 * 60 * 60 * 1000),
      event: 'Initial Review Complete',
      description: 'Claim moved to evidence gathering phase',
      status: phase >= 2 ? 'completed' : 'upcoming',
      actor: 'Claims Processor',
      icon: 'review'
    },
    {
      id: 't-4',
      claimId: basicClaim.claimNumber,
      date: new Date(filingDate.getTime() + 21 * 24 * 60 * 60 * 1000),
      event: 'Evidence Requested',
      description: 'VA requested additional medical evidence',
      status: phase >= 3 ? 'completed' : 'upcoming',
      actor: 'Evidence Intake Center',
      icon: 'evidence'
    },
    {
      id: 't-5',
      claimId: basicClaim.claimNumber,
      date: new Date(filingDate.getTime() + 45 * 24 * 60 * 60 * 1000),
      event: 'C&P Exam Scheduled',
      description: 'Compensation & Pension examination scheduled',
      status: phase >= 4 ? 'completed' : 'upcoming',
      actor: 'VHA Scheduler',
      icon: 'evidence'
    },
    {
      id: 't-6',
      claimId: basicClaim.claimNumber,
      date: new Date(filingDate.getTime() + 60 * 24 * 60 * 60 * 1000),
      event: 'C&P Exam Completed',
      description: 'All required examinations completed',
      status: phase >= 5 ? 'completed' : 'upcoming',
      actor: 'VA Medical Center',
      icon: 'evidence'
    },
    {
      id: 't-7',
      claimId: basicClaim.claimNumber,
      date: new Date(filingDate.getTime() + 90 * 24 * 60 * 60 * 1000),
      event: 'Ready for Decision',
      description: 'All evidence gathered, claim ready for rating decision',
      status: phase >= 6 ? 'completed' : 'upcoming',
      actor: 'Rating Specialist',
      icon: 'decision'
    },
    {
      id: 't-8',
      claimId: basicClaim.claimNumber,
      date: new Date(filingDate.getTime() + 120 * 24 * 60 * 60 * 1000),
      event: phase >= 8 ? 'Decision Made' : 'Pending Decision',
      description: phase >= 8 ? 'Rating decision completed and mailed' : 'Awaiting final rating decision',
      status: phase >= 8 ? 'completed' : phase >= 7 ? 'current' : 'upcoming',
      actor: 'Rating Board',
      icon: 'decision'
    }
  ];

  // Generate exams
  const exams = [
    {
      id: 'exam-1',
      type: 'C&P' as const,
      specialty: 'Mental Health',
      scheduledDate: new Date(filingDate.getTime() + 45 * 24 * 60 * 60 * 1000),
      completedDate: phase >= 5 ? new Date(filingDate.getTime() + 45 * 24 * 60 * 60 * 1000) : undefined,
      location: 'VA Medical Center - Los Angeles',
      status: phase >= 5 ? 'Completed' as const : 'Scheduled' as const,
      provider: 'Dr. Sarah Johnson, Psychiatrist'
    },
    {
      id: 'exam-2',
      type: 'C&P' as const,
      specialty: 'Orthopedic',
      scheduledDate: new Date(filingDate.getTime() + 50 * 24 * 60 * 60 * 1000),
      completedDate: phase >= 5 ? new Date(filingDate.getTime() + 50 * 24 * 60 * 60 * 1000) : undefined,
      location: 'VA Medical Center - Los Angeles',
      status: phase >= 5 ? 'Completed' as const : 'Scheduled' as const,
      provider: 'Dr. Michael Chen, Orthopedist'
    },
    {
      id: 'exam-3',
      type: 'ACE' as const,
      specialty: 'Audiology',
      scheduledDate: new Date(filingDate.getTime() + 30 * 24 * 60 * 60 * 1000),
      completedDate: phase >= 4 ? new Date(filingDate.getTime() + 30 * 24 * 60 * 60 * 1000) : undefined,
      location: 'Records Review Only',
      status: phase >= 4 ? 'Completed' as const : 'Scheduled' as const,
      provider: 'Dr. Lisa Park, Audiologist'
    }
  ];

  // Generate letters
  const letters = [
    {
      id: 'letter-1',
      date: new Date(filingDate.getTime() + 5 * 24 * 60 * 60 * 1000),
      type: 'Development Letter',
      subject: 'We need more information for your claim',
      status: 'Sent' as const
    },
    {
      id: 'letter-2',
      date: new Date(filingDate.getTime() + 40 * 24 * 60 * 60 * 1000),
      type: 'C&P Exam Notification',
      subject: 'Your VA examination has been scheduled',
      status: 'Sent' as const
    }
  ];

  const statuses = [
    'Open', 'Initial Review', 'Evidence Gathering', 'Review of Evidence', 
    'Preparation for Decision', 'Pending Decision Approval', 'Complete'
  ];

  return {
    id: basicClaim.claimNumber,
    claimNumber: basicClaim.claimNumber,
    type: basicClaim.type || 'Compensation',
    status: phase >= 8 ? 'Complete' : statuses[Math.min(phase - 1, 6)] as any,
    phase,
    filingDate,
    lastUpdated: new Date(basicClaim.lastActionDate),
    estimatedCompletion: phase >= 8 ? undefined : basicClaim.estimatedCompletion,
    suspenseDate: phase >= 3 && phase < 6 ? new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000) : undefined,
    regionalOffice: 'Los Angeles Regional Office',
    POA: 'Disabled American Veterans (DAV)',
    contentions,
    evidence,
    documents,
    timeline,
    decisionDate: phase >= 8 ? new Date(filingDate.getTime() + 120 * 24 * 60 * 60 * 1000) : undefined,
    decisionType: phase >= 8 ? 'Partial Grant' : undefined,
    effectiveDate: phase >= 8 ? filingDate : undefined,
    retroactiveAmount: phase >= 8 ? 12543 : undefined,
    monthlyIncrease: phase >= 8 ? 487 : undefined,
    newCombinedRating: phase >= 8 ? (basicClaim.rating || 70) : undefined,
    appealable: phase >= 8,
    appealDeadline: phase >= 8 ? new Date(filingDate.getTime() + 485 * 24 * 60 * 60 * 1000) : undefined,
    hasAppeal: false,
    letters,
    exams
  };
}