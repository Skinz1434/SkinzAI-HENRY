// Comprehensive VA Forms Database
// This file contains an extensive collection of VA forms, templates, and documents

export interface VAForm {
  id: string;
  formNumber: string;
  title: string;
  category: string;
  subcategory?: string;
  description: string;
  url: string;
  lastUpdated: string;
  pages?: number;
  relatedForms?: string[];
  requiredFor?: string[];
  keywords: string[];
  instructions?: string;
  processingTime?: string;
}

export interface LetterTemplate {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  purpose: string;
  content: string;
  variables: string[];
  requiredAttachments?: string[];
  relatedForms?: string[];
  sampleScenarios?: string[];
  regulatory?: string;
  lastUsed?: Date;
  useCount?: number;
}

// Comprehensive VA Forms Database
export const vaFormsDatabase: VAForm[] = [
  // === DISABILITY COMPENSATION FORMS ===
  {
    id: 'form-21-526ez',
    formNumber: 'VA Form 21-526EZ',
    title: 'Application for Disability Compensation and Related Compensation Benefits',
    category: 'Disability Compensation',
    description: 'Main form for filing disability compensation claims, including PTSD, TBI, and physical conditions',
    url: 'https://www.va.gov/find-forms/about-form-21-526ez/',
    lastUpdated: '2024-01',
    pages: 12,
    relatedForms: ['21-4142', '21-4142a', '21-0781', '21-0781a'],
    requiredFor: ['Initial disability claims', 'Increased rating claims'],
    keywords: ['disability', 'compensation', 'rating', 'service-connected'],
    processingTime: '125 days average',
    instructions: 'Complete all sections. Include all claimed conditions and provide detailed symptom descriptions.'
  },
  {
    id: 'form-21-0995',
    formNumber: 'VA Form 21-0995',
    title: 'Decision Review Request: Supplemental Claim',
    category: 'Appeals & Reviews',
    subcategory: 'Decision Reviews',
    description: 'Form to file a supplemental claim with new and relevant evidence',
    url: 'https://www.va.gov/find-forms/about-form-21-0995/',
    lastUpdated: '2024-01',
    pages: 4,
    relatedForms: ['20-0996', '10182'],
    requiredFor: ['Supplemental claims', 'New evidence submission'],
    keywords: ['appeal', 'supplemental', 'review', 'evidence'],
    processingTime: '125 days average'
  },
  {
    id: 'form-20-0996',
    formNumber: 'VA Form 20-0996',
    title: 'Decision Review Request: Higher-Level Review',
    category: 'Appeals & Reviews',
    subcategory: 'Decision Reviews',
    description: 'Request a higher-level review of a VA decision',
    url: 'https://www.va.gov/find-forms/about-form-20-0996/',
    lastUpdated: '2024-01',
    pages: 4,
    relatedForms: ['21-0995', '10182'],
    requiredFor: ['Higher-level reviews', 'Senior reviewer assessment'],
    keywords: ['appeal', 'higher-level', 'review', 'decision'],
    processingTime: '125 days average'
  },
  {
    id: 'form-10182',
    formNumber: 'VA Form 10182',
    title: 'Decision Review Request: Board Appeal (Notice of Disagreement)',
    category: 'Appeals & Reviews',
    subcategory: 'Board Appeals',
    description: 'Appeal to the Board of Veterans Appeals',
    url: 'https://www.va.gov/find-forms/about-form-10182/',
    lastUpdated: '2024-01',
    pages: 5,
    relatedForms: ['21-0995', '20-0996'],
    requiredFor: ['Board appeals', 'BVA review'],
    keywords: ['board', 'appeal', 'BVA', 'disagreement'],
    processingTime: '365+ days average'
  },

  // === MEDICAL & HEALTH FORMS ===
  {
    id: 'form-21-4142',
    formNumber: 'VA Form 21-4142',
    title: 'Authorization to Disclose Information to VA',
    category: 'Medical Records',
    subcategory: 'Release Forms',
    description: 'Authorize release of medical records from private providers to VA',
    url: 'https://www.va.gov/find-forms/about-form-21-4142/',
    lastUpdated: '2024-01',
    pages: 2,
    relatedForms: ['21-4142a', '21-526EZ'],
    requiredFor: ['Private medical records', 'Treatment records'],
    keywords: ['medical', 'records', 'release', 'authorization', 'HIPAA'],
    instructions: 'List all healthcare providers and specific date ranges'
  },
  {
    id: 'form-21-4142a',
    formNumber: 'VA Form 21-4142a',
    title: 'General Release for Medical Provider Information',
    category: 'Medical Records',
    subcategory: 'Release Forms',
    description: 'General release form for medical provider information',
    url: 'https://www.va.gov/find-forms/about-form-21-4142a/',
    lastUpdated: '2024-01',
    pages: 1,
    relatedForms: ['21-4142', '21-526EZ'],
    requiredFor: ['Provider information', 'Medical facilities list'],
    keywords: ['medical', 'provider', 'release', 'information']
  },
  {
    id: 'form-10-10ez',
    formNumber: 'VA Form 10-10EZ',
    title: 'Application for Health Benefits',
    category: 'Healthcare',
    subcategory: 'Enrollment',
    description: 'Enroll in VA healthcare system',
    url: 'https://www.va.gov/find-forms/about-form-10-10ez/',
    lastUpdated: '2024-01',
    pages: 6,
    relatedForms: ['10-10EZR', '10-10CG'],
    requiredFor: ['Healthcare enrollment', 'VA medical benefits'],
    keywords: ['healthcare', 'enrollment', 'medical', 'benefits'],
    processingTime: '5-7 business days'
  },
  {
    id: 'form-10-10ezr',
    formNumber: 'VA Form 10-10EZR',
    title: 'Health Benefits Update Form',
    category: 'Healthcare',
    subcategory: 'Updates',
    description: 'Update VA healthcare information including income and insurance',
    url: 'https://www.va.gov/find-forms/about-form-10-10ezr/',
    lastUpdated: '2024-01',
    pages: 4,
    relatedForms: ['10-10EZ'],
    requiredFor: ['Annual updates', 'Insurance changes'],
    keywords: ['healthcare', 'update', 'insurance', 'income']
  },

  // === PTSD & MENTAL HEALTH FORMS ===
  {
    id: 'form-21-0781',
    formNumber: 'VA Form 21-0781',
    title: 'Statement in Support of Claim for PTSD',
    category: 'Mental Health',
    subcategory: 'PTSD',
    description: 'Provide detailed information about PTSD stressor events',
    url: 'https://www.va.gov/find-forms/about-form-21-0781/',
    lastUpdated: '2024-01',
    pages: 4,
    relatedForms: ['21-0781a', '21-526EZ'],
    requiredFor: ['PTSD claims', 'Combat stressors'],
    keywords: ['PTSD', 'stressor', 'combat', 'trauma', 'mental health'],
    instructions: 'Provide detailed descriptions of traumatic events with dates and locations'
  },
  {
    id: 'form-21-0781a',
    formNumber: 'VA Form 21-0781a',
    title: 'Statement in Support of Claim for PTSD Secondary to Personal Assault',
    category: 'Mental Health',
    subcategory: 'PTSD',
    description: 'Support PTSD claims related to personal assault including MST',
    url: 'https://www.va.gov/find-forms/about-form-21-0781a/',
    lastUpdated: '2024-01',
    pages: 4,
    relatedForms: ['21-0781', '21-526EZ'],
    requiredFor: ['MST claims', 'Personal assault PTSD'],
    keywords: ['MST', 'assault', 'PTSD', 'trauma', 'harassment']
  },

  // === PENSION & FINANCIAL FORMS ===
  {
    id: 'form-21-527ez',
    formNumber: 'VA Form 21-527EZ',
    title: 'Application for Pension',
    category: 'Pension',
    description: 'Apply for VA pension benefits for wartime veterans',
    url: 'https://www.va.gov/find-forms/about-form-21-527ez/',
    lastUpdated: '2024-01',
    pages: 8,
    relatedForms: ['21-22', '21-2680'],
    requiredFor: ['Pension benefits', 'Non-service connected pension'],
    keywords: ['pension', 'income', 'wartime', 'benefits'],
    processingTime: '90-120 days'
  },
  {
    id: 'form-21-2680',
    formNumber: 'VA Form 21-2680',
    title: 'Examination for Housebound Status or Permanent Need for Aid and Attendance',
    category: 'Pension',
    subcategory: 'Special Monthly Compensation',
    description: 'Medical evaluation for Aid and Attendance or Housebound benefits',
    url: 'https://www.va.gov/find-forms/about-form-21-2680/',
    lastUpdated: '2024-01',
    pages: 4,
    relatedForms: ['21-527EZ', '21-534EZ'],
    requiredFor: ['Aid and Attendance', 'Housebound benefits'],
    keywords: ['aid', 'attendance', 'housebound', 'caregiver']
  },
  {
    id: 'form-sf-1199a',
    formNumber: 'SF 1199A',
    title: 'Direct Deposit Sign-Up Form',
    category: 'Financial',
    subcategory: 'Direct Deposit',
    description: 'Set up or change direct deposit for VA benefits',
    url: 'https://www.va.gov/find-forms/about-form-sf-1199a/',
    lastUpdated: '2024-01',
    pages: 1,
    relatedForms: ['VA-24'],
    requiredFor: ['Direct deposit setup', 'Bank account changes'],
    keywords: ['direct deposit', 'bank', 'payment', 'EFT']
  },

  // === DEPENDENCY & SURVIVOR FORMS ===
  {
    id: 'form-21-686c',
    formNumber: 'VA Form 21-686c',
    title: 'Declaration of Status of Dependents',
    category: 'Dependents',
    description: 'Add or remove dependents for VA benefits',
    url: 'https://www.va.gov/find-forms/about-form-21-686c/',
    lastUpdated: '2024-01',
    pages: 12,
    relatedForms: ['21-674', '21-0538'],
    requiredFor: ['Adding dependents', 'Removing dependents', 'Marriage', 'Divorce', 'Birth'],
    keywords: ['dependent', 'spouse', 'child', 'marriage', 'divorce'],
    processingTime: '30-60 days'
  },
  {
    id: 'form-21-674',
    formNumber: 'VA Form 21-674',
    title: 'Request for School Attendance',
    category: 'Dependents',
    subcategory: 'Education',
    description: 'Verify school attendance for children 18-23',
    url: 'https://www.va.gov/find-forms/about-form-21-674/',
    lastUpdated: '2024-01',
    pages: 3,
    relatedForms: ['21-686c'],
    requiredFor: ['School-age dependent benefits'],
    keywords: ['school', 'attendance', 'dependent', 'child', 'education']
  },
  {
    id: 'form-21-534ez',
    formNumber: 'VA Form 21-534EZ',
    title: 'Application for DIC, Survivors Pension, and/or Accrued Benefits',
    category: 'Survivor Benefits',
    description: 'Apply for survivor benefits including DIC and death pension',
    url: 'https://www.va.gov/find-forms/about-form-21-534ez/',
    lastUpdated: '2024-01',
    pages: 10,
    relatedForms: ['21-22', '21-2680'],
    requiredFor: ['DIC benefits', 'Survivor pension', 'Accrued benefits'],
    keywords: ['DIC', 'survivor', 'death', 'pension', 'widow', 'dependent'],
    processingTime: '120-150 days'
  },

  // === EDUCATION FORMS ===
  {
    id: 'form-22-1990',
    formNumber: 'VA Form 22-1990',
    title: 'Application for VA Education Benefits',
    category: 'Education',
    subcategory: 'GI Bill',
    description: 'Apply for Post-9/11 GI Bill and other education benefits',
    url: 'https://www.va.gov/find-forms/about-form-22-1990/',
    lastUpdated: '2024-01',
    pages: 8,
    relatedForms: ['22-1995', '22-1990E', '22-5490'],
    requiredFor: ['GI Bill benefits', 'Education assistance'],
    keywords: ['education', 'GI Bill', 'college', 'training'],
    processingTime: '30 days'
  },
  {
    id: 'form-22-1995',
    formNumber: 'VA Form 22-1995',
    title: 'Request for Change of Program or Place of Training',
    category: 'Education',
    subcategory: 'Changes',
    description: 'Change school or training program for GI Bill benefits',
    url: 'https://www.va.gov/find-forms/about-form-22-1995/',
    lastUpdated: '2024-01',
    pages: 4,
    relatedForms: ['22-1990'],
    requiredFor: ['School transfer', 'Program change'],
    keywords: ['education', 'transfer', 'school', 'change']
  },
  {
    id: 'form-22-5490',
    formNumber: 'VA Form 22-5490',
    title: 'Application for Survivors and Dependents Educational Assistance',
    category: 'Education',
    subcategory: 'DEA',
    description: 'Apply for Chapter 35 DEA benefits',
    url: 'https://www.va.gov/find-forms/about-form-22-5490/',
    lastUpdated: '2024-01',
    pages: 6,
    relatedForms: ['22-1990', '22-5495'],
    requiredFor: ['DEA benefits', 'Dependent education'],
    keywords: ['DEA', 'Chapter 35', 'dependent', 'education', 'survivor']
  },

  // === HOUSING & ADAPTATION FORMS ===
  {
    id: 'form-26-4555',
    formNumber: 'VA Form 26-4555',
    title: 'Application for Specially Adapted Housing or Special Home Adaptation Grant',
    category: 'Housing',
    subcategory: 'Adaptation Grants',
    description: 'Apply for home modification grants for disabled veterans',
    url: 'https://www.va.gov/find-forms/about-form-26-4555/',
    lastUpdated: '2024-01',
    pages: 4,
    relatedForms: ['26-1880', '10-0103'],
    requiredFor: ['SAH grant', 'SHA grant', 'Home modifications'],
    keywords: ['housing', 'adaptation', 'disability', 'modification', 'grant'],
    processingTime: '45-60 days'
  },
  {
    id: 'form-26-1880',
    formNumber: 'VA Form 26-1880',
    title: 'Request for Certificate of Eligibility',
    category: 'Housing',
    subcategory: 'Home Loans',
    description: 'Obtain COE for VA home loan benefits',
    url: 'https://www.va.gov/find-forms/about-form-26-1880/',
    lastUpdated: '2024-01',
    pages: 2,
    relatedForms: ['26-4555'],
    requiredFor: ['VA home loan', 'COE'],
    keywords: ['home loan', 'COE', 'certificate', 'eligibility', 'mortgage']
  },

  // === REPRESENTATION FORMS ===
  {
    id: 'form-21-22',
    formNumber: 'VA Form 21-22',
    title: 'Appointment of Veterans Service Organization as Representative',
    category: 'Representation',
    description: 'Appoint VSO as your representative for VA claims',
    url: 'https://www.va.gov/find-forms/about-form-21-22/',
    lastUpdated: '2024-01',
    pages: 2,
    relatedForms: ['21-22a', '21-0845'],
    requiredFor: ['VSO representation', 'Power of attorney'],
    keywords: ['VSO', 'representative', 'POA', 'attorney']
  },
  {
    id: 'form-21-22a',
    formNumber: 'VA Form 21-22a',
    title: 'Appointment of Individual as Representative',
    category: 'Representation',
    description: 'Appoint an individual as your representative',
    url: 'https://www.va.gov/find-forms/about-form-21-22a/',
    lastUpdated: '2024-01',
    pages: 3,
    relatedForms: ['21-22'],
    requiredFor: ['Individual representation', 'Attorney representation'],
    keywords: ['representative', 'attorney', 'individual', 'POA']
  },

  // === STATEMENT & EVIDENCE FORMS ===
  {
    id: 'form-21-4138',
    formNumber: 'VA Form 21-4138',
    title: 'Statement in Support of Claim',
    category: 'Evidence',
    description: 'Provide written statement to support VA claim',
    url: 'https://www.va.gov/find-forms/about-form-21-4138/',
    lastUpdated: '2024-01',
    pages: 2,
    relatedForms: ['21-10210'],
    requiredFor: ['Lay statements', 'Buddy statements', 'Additional evidence'],
    keywords: ['statement', 'evidence', 'lay', 'buddy', 'support']
  },
  {
    id: 'form-21-10210',
    formNumber: 'VA Form 21-10210',
    title: 'Lay/Witness Statement',
    category: 'Evidence',
    description: 'Formal lay or witness statement for claims',
    url: 'https://www.va.gov/find-forms/about-form-21-10210/',
    lastUpdated: '2024-01',
    pages: 3,
    relatedForms: ['21-4138'],
    requiredFor: ['Witness statements', 'Lay evidence'],
    keywords: ['witness', 'lay', 'statement', 'testimony']
  },

  // === BURIAL & MEMORIAL FORMS ===
  {
    id: 'form-21-530ez',
    formNumber: 'VA Form 21-530EZ',
    title: 'Application for Burial Benefits',
    category: 'Burial',
    description: 'Apply for burial allowance and plot allowance',
    url: 'https://www.va.gov/find-forms/about-form-21-530ez/',
    lastUpdated: '2024-01',
    pages: 6,
    relatedForms: ['40-1330', '40-10007'],
    requiredFor: ['Burial benefits', 'Plot allowance', 'Transportation reimbursement'],
    keywords: ['burial', 'funeral', 'death', 'cemetery', 'allowance'],
    processingTime: '30-60 days'
  },
  {
    id: 'form-40-1330',
    formNumber: 'VA Form 40-1330',
    title: 'Application for Standard Government Headstone or Marker',
    category: 'Burial',
    subcategory: 'Memorial',
    description: 'Request headstone or marker for veteran grave',
    url: 'https://www.va.gov/find-forms/about-form-40-1330/',
    lastUpdated: '2024-01',
    pages: 4,
    relatedForms: ['21-530EZ', '40-10007'],
    requiredFor: ['Headstone', 'Grave marker', 'Memorial'],
    keywords: ['headstone', 'marker', 'grave', 'cemetery', 'memorial']
  },
  {
    id: 'form-40-10007',
    formNumber: 'VA Form 40-10007',
    title: 'Application for Pre-Need Determination of Eligibility for Burial',
    category: 'Burial',
    subcategory: 'Pre-Need',
    description: 'Pre-determine eligibility for burial in VA national cemetery',
    url: 'https://www.va.gov/find-forms/about-form-40-10007/',
    lastUpdated: '2024-01',
    pages: 4,
    relatedForms: ['21-530EZ', '40-1330'],
    requiredFor: ['Pre-need eligibility', 'Cemetery planning'],
    keywords: ['pre-need', 'burial', 'cemetery', 'eligibility', 'planning']
  },

  // === VOCATIONAL REHABILITATION FORMS ===
  {
    id: 'form-28-1900',
    formNumber: 'VA Form 28-1900',
    title: 'Disabled Veterans Application for Vocational Rehabilitation',
    category: 'Vocational Rehabilitation',
    description: 'Apply for Chapter 31 VR&E benefits',
    url: 'https://www.va.gov/find-forms/about-form-28-1900/',
    lastUpdated: '2024-01',
    pages: 2,
    relatedForms: ['28-8832'],
    requiredFor: ['VR&E benefits', 'Chapter 31', 'Job training'],
    keywords: ['vocational', 'rehabilitation', 'VR&E', 'Chapter 31', 'employment'],
    processingTime: '30-45 days'
  },
  {
    id: 'form-28-8832',
    formNumber: 'VA Form 28-8832',
    title: 'Application for Counseling',
    category: 'Vocational Rehabilitation',
    subcategory: 'Counseling',
    description: 'Request educational and vocational counseling',
    url: 'https://www.va.gov/find-forms/about-form-28-8832/',
    lastUpdated: '2024-01',
    pages: 2,
    relatedForms: ['28-1900'],
    requiredFor: ['Career counseling', 'Educational planning'],
    keywords: ['counseling', 'career', 'education', 'planning']
  },

  // === FIDUCIARY FORMS ===
  {
    id: 'form-21-0845',
    formNumber: 'VA Form 21-0845',
    title: 'Authorization to Disclose Personal Information to a Third Party',
    category: 'Privacy',
    description: 'Authorize VA to release information to third party',
    url: 'https://www.va.gov/find-forms/about-form-21-0845/',
    lastUpdated: '2024-01',
    pages: 1,
    relatedForms: ['21-22', '21-4142'],
    requiredFor: ['Information release', 'Third party authorization'],
    keywords: ['privacy', 'release', 'authorization', 'third party']
  },
  {
    id: 'form-21-4140',
    formNumber: 'VA Form 21-4140',
    title: 'Application for Increase in DIC for Child',
    category: 'Survivor Benefits',
    subcategory: 'DIC',
    description: 'Request increased DIC for helpless child',
    url: 'https://www.va.gov/find-forms/about-form-21-4140/',
    lastUpdated: '2024-01',
    pages: 2,
    relatedForms: ['21-534EZ', '21-686c'],
    requiredFor: ['Helpless child DIC', 'Increased benefits'],
    keywords: ['DIC', 'helpless', 'child', 'increase', 'survivor']
  },

  // === SPECIAL COMPENSATION FORMS ===
  {
    id: 'form-21-8940',
    formNumber: 'VA Form 21-8940',
    title: 'Unemployment Compensation',
    category: 'Financial',
    subcategory: 'Unemployment',
    description: 'Apply for Individual Unemployability',
    url: 'https://www.va.gov/find-forms/about-form-21-8940/',
    lastUpdated: '2024-01',
    pages: 4,
    relatedForms: ['21-4192'],
    requiredFor: ['TDIU', 'Unemployability', '100% compensation'],
    keywords: ['unemployability', 'TDIU', 'IU', 'compensation'],
    processingTime: '120-180 days'
  },
  {
    id: 'form-21-4192',
    formNumber: 'VA Form 21-4192',
    title: 'Request for Employment Information',
    category: 'Financial',
    subcategory: 'Employment',
    description: 'Employer verification for unemployability claims',
    url: 'https://www.va.gov/find-forms/about-form-21-4192/',
    lastUpdated: '2024-01',
    pages: 2,
    relatedForms: ['21-8940'],
    requiredFor: ['Employment verification', 'TDIU support'],
    keywords: ['employment', 'verification', 'employer', 'TDIU']
  }
];

// Comprehensive Letter Templates Database
export const letterTemplatesDatabase: LetterTemplate[] = [
  // === C&P EXAMINATION TEMPLATES ===
  {
    id: 'cp-exam-notice',
    name: 'C&P Examination Notification - Standard',
    category: 'Examinations',
    subcategory: 'C&P Exams',
    description: 'Standard notification for Compensation and Pension examination',
    purpose: 'Notify veteran of scheduled C&P examination',
    content: `Dear {{veteranName}},

This letter is to notify you that a Compensation and Pension (C&P) examination has been scheduled for your disability compensation claim.

EXAMINATION DETAILS:
Date: {{examDate}}
Time: {{examTime}}
Location: {{examLocation}}
Provider: {{examProvider}}
Type of Examination: {{examType}}

WHAT TO BRING:
• Government-issued photo ID
• List of current medications with dosages
• Names and addresses of all doctors treating you for the claimed condition(s)
• Any recent medical records not already submitted to VA
• Glasses or hearing aids if you use them

IMPORTANT INFORMATION:
• Please arrive 15 minutes early to complete any necessary paperwork
• The examination typically takes {{examDuration}}
• This examination is at no cost to you
• Transportation reimbursement may be available - ask at check-in

CONDITIONS TO BE EXAMINED:
{{conditionsList}}

WHAT HAPPENS DURING THE EXAM:
The examiner will review your medical history, ask about your symptoms, and may perform a physical examination. Be prepared to discuss:
• How your condition(s) began
• Current symptoms and their severity
• How symptoms affect your daily life and work
• Any treatment you've received

FAILURE TO APPEAR:
If you cannot attend this examination, please contact us immediately at {{contactNumber}}. Failure to attend without good cause may result in:
• Denial of your claim
• Reduction or termination of current benefits
• Decision based solely on evidence already in your file

REASONABLE ACCOMMODATIONS:
If you need special accommodations (wheelchair access, sign language interpreter, etc.), please contact us at least 5 days before your appointment.

QUESTIONS?
Contact: {{processorName}}
Phone: {{contactNumber}}
Email: {{contactEmail}}

We appreciate your service to our nation.

Sincerely,

{{processorName}}
{{processorTitle}}
Veterans Benefits Administration
Department of Veterans Affairs`,
    variables: [
      'veteranName', 'examDate', 'examTime', 'examLocation', 'examProvider',
      'examType', 'examDuration', 'conditionsList', 'contactNumber',
      'contactEmail', 'processorName', 'processorTitle'
    ],
    requiredAttachments: ['Examination location map', 'Travel reimbursement form'],
    relatedForms: ['21-526EZ', '21-4142'],
    regulatory: '38 CFR 3.326',
    sampleScenarios: ['Initial claim exam', 'Increase evaluation', 'Review examination']
  },
  {
    id: 'cp-exam-reschedule',
    name: 'C&P Examination Reschedule Request',
    category: 'Examinations',
    subcategory: 'C&P Exams',
    description: 'Notification of rescheduled C&P examination',
    purpose: 'Inform veteran of rescheduled examination with explanation',
    content: `Dear {{veteranName}},

Your Compensation and Pension (C&P) examination originally scheduled for {{originalDate}} has been rescheduled.

NEW EXAMINATION DETAILS:
Date: {{newExamDate}}
Time: {{newExamTime}}
Location: {{examLocation}}
Provider: {{examProvider}}

REASON FOR RESCHEDULE:
{{rescheduleReason}}

This is your {{attemptNumber}} scheduled examination for this claim. Please note that VA regulations allow for a limited number of reschedules before a decision must be made based on available evidence.

{{additionalInstructions}}

If you cannot attend this rescheduled examination, you must contact us immediately at {{contactNumber}} and provide good cause for missing the appointment.

Sincerely,
{{processorName}}`,
    variables: [
      'veteranName', 'originalDate', 'newExamDate', 'newExamTime',
      'examLocation', 'examProvider', 'rescheduleReason', 'attemptNumber',
      'additionalInstructions', 'contactNumber', 'processorName'
    ],
    relatedForms: ['21-526EZ']
  },

  // === EVIDENCE REQUEST TEMPLATES ===
  {
    id: 'evidence-request-standard',
    name: 'Request for Additional Evidence - Standard',
    category: 'Evidence',
    subcategory: 'Evidence Requests',
    description: 'Standard request for additional evidence to support claim',
    purpose: 'Request specific evidence needed to decide claim',
    content: `Dear {{veteranName}},

We are processing your claim for disability compensation received on {{claimDate}}. To continue processing your claim, we need additional evidence.

CLAIM DETAILS:
Claim Number: {{claimNumber}}
Conditions Claimed: {{conditionsList}}
Current Status: Pending Evidence

EVIDENCE NEEDED:
{{evidenceList}}

DEADLINE: {{dueDate}} ({{daysRemaining}} days from the date of this letter)

HOW TO SUBMIT EVIDENCE:
1. Online: Upload at www.va.gov (fastest method)
2. Mail: {{mailingAddress}}
3. Fax: {{faxNumber}}
4. In Person: {{regionalOffice}}

WHAT HAPPENS NEXT:
• If we receive the evidence by the deadline, we'll continue processing your claim
• If we don't receive the evidence, we'll make a decision based on evidence already in your file
• You may request an extension if you need more time

NEED HELP GETTING EVIDENCE?
We can help obtain evidence from:
• Federal agencies (military records, Social Security records)
• VA medical centers
• Private doctors (with your authorization using VA Form 21-4142)

Contact us at {{contactNumber}} if you need assistance.

Sincerely,
{{processorName}}
Veterans Service Representative`,
    variables: [
      'veteranName', 'claimDate', 'claimNumber', 'conditionsList',
      'evidenceList', 'dueDate', 'daysRemaining', 'mailingAddress',
      'faxNumber', 'regionalOffice', 'contactNumber', 'processorName'
    ],
    requiredAttachments: ['VA Form 21-4142', 'Evidence submission instructions'],
    relatedForms: ['21-4142', '21-4138'],
    regulatory: '38 CFR 3.159'
  },
  {
    id: 'evidence-insufficient',
    name: 'Insufficient Evidence Notification',
    category: 'Evidence',
    subcategory: 'Evidence Issues',
    description: 'Notify veteran that submitted evidence is insufficient',
    purpose: 'Explain why evidence is insufficient and what is needed',
    content: `Dear {{veteranName}},

Thank you for submitting evidence for your claim dated {{claimDate}}. After review, we've determined that additional information is needed.

EVIDENCE RECEIVED:
{{receivedEvidence}}

WHY THIS IS INSUFFICIENT:
{{insufficiencyReason}}

WHAT WE NEED:
{{specificRequirements}}

EXAMPLES OF ACCEPTABLE EVIDENCE:
{{evidenceExamples}}

DEADLINE: {{newDeadline}}

Remember, the evidence must:
• Be relevant to your claimed condition(s)
• Cover the time period in question
• Come from qualified sources
• Include specific details about symptoms and treatment

{{additionalGuidance}}

Questions? Contact: {{contactInfo}}

Sincerely,
{{processorName}}`,
    variables: [
      'veteranName', 'claimDate', 'receivedEvidence', 'insufficiencyReason',
      'specificRequirements', 'evidenceExamples', 'newDeadline',
      'additionalGuidance', 'contactInfo', 'processorName'
    ],
    relatedForms: ['21-4138', '21-4142']
  },

  // === DECISION NOTIFICATIONS ===
  {
    id: 'rating-decision-grant',
    name: 'Rating Decision - Full Grant',
    category: 'Decisions',
    subcategory: 'Grants',
    description: 'Notification of favorable rating decision',
    purpose: 'Inform veteran of granted benefits with details',
    content: `Dear {{veteranName}},

We are pleased to inform you that your claim for disability compensation has been GRANTED.

DECISION SUMMARY:
{{decisionSummary}}

SERVICE-CONNECTED CONDITIONS:
{{conditionsTable}}

COMBINED RATING: {{combinedRating}}%
EFFECTIVE DATE: {{effectiveDate}}

MONTHLY COMPENSATION:
Basic Rate: \${{basicRate}}
Additional for Dependents: \${{dependentRate}}
Total Monthly Payment: \${{totalMonthly}}

PAYMENT INFORMATION:
• First payment expected: {{firstPaymentDate}}
• Retroactive amount: \${{retroAmount}}
• Payment method: {{paymentMethod}}

ADDITIONAL BENEFITS YOU MAY BE ELIGIBLE FOR:
{{additionalBenefitsList}}

IMPORTANT DOCUMENTS ENCLOSED:
• Rating Decision Letter
• VA Form 20-0995 (Supplemental Claim)
• VA Form 20-0996 (Higher-Level Review)
• VA Form 10182 (Board Appeal)

YOUR RIGHT TO APPEAL:
While we hope you're satisfied with this decision, you have one year to:
• File a Supplemental Claim with new evidence
• Request a Higher-Level Review
• Appeal to the Board of Veterans' Appeals

NEXT STEPS:
{{nextSteps}}

Questions? Contact your VSO or call us at {{contactNumber}}.

Thank you for your service.

Sincerely,
{{processorName}}
Rating Veterans Service Representative`,
    variables: [
      'veteranName', 'decisionSummary', 'conditionsTable', 'combinedRating',
      'effectiveDate', 'basicRate', 'dependentRate', 'totalMonthly',
      'firstPaymentDate', 'retroAmount', 'paymentMethod', 'additionalBenefitsList',
      'nextSteps', 'contactNumber', 'processorName'
    ],
    requiredAttachments: ['Rating decision', 'Code sheet', 'Appeals forms'],
    relatedForms: ['20-0995', '20-0996', '10182'],
    regulatory: '38 CFR 3.103, 38 CFR 19.24'
  },
  {
    id: 'rating-decision-denial',
    name: 'Rating Decision - Denial',
    category: 'Decisions',
    subcategory: 'Denials',
    description: 'Notification of denied claim with explanation',
    purpose: 'Inform veteran of denial with reasons and appeal rights',
    content: `Dear {{veteranName}},

We have completed our review of your claim for disability compensation received on {{claimDate}}.

DECISION: Your claim has been DENIED for the following condition(s):
{{deniedConditions}}

REASONS FOR DENIAL:
{{denialReasons}}

EVIDENCE CONSIDERED:
{{evidenceList}}

WHAT THIS MEANS:
• The condition(s) listed above are not service-connected
• You will not receive compensation for these conditions at this time
• This decision does not affect any current benefits you may be receiving

YOUR APPEAL RIGHTS:
You have ONE YEAR from the date of this letter to do one of the following:

1. FILE A SUPPLEMENTAL CLAIM (VA Form 20-0995)
   - Submit new and relevant evidence
   - No limit on number of supplemental claims
   - Average processing time: 125 days

2. REQUEST A HIGHER-LEVEL REVIEW (VA Form 20-0996)
   - Senior reviewer will examine your case
   - No new evidence allowed
   - Optional informal conference
   - Average processing time: 125 days

3. APPEAL TO THE BOARD (VA Form 10182)
   - Direct Review (no hearing)
   - Evidence submission (submit new evidence)
   - Hearing (testify before a judge)
   - Average wait time: 12-24 months

WHAT MIGHT HELP YOUR CLAIM:
{{suggestions}}

FREE HELP AVAILABLE:
• Veterans Service Organizations (VSO)
• VA Regional Office: {{regionalOffice}}
• Phone: {{contactNumber}}

We understand this may be disappointing. Please carefully review the enclosed rating decision for detailed explanations.

Sincerely,
{{processorName}}
Rating Veterans Service Representative`,
    variables: [
      'veteranName', 'claimDate', 'deniedConditions', 'denialReasons',
      'evidenceList', 'suggestions', 'regionalOffice', 'contactNumber',
      'processorName'
    ],
    requiredAttachments: ['Rating decision', 'Appeals forms', 'VSO contact list'],
    relatedForms: ['20-0995', '20-0996', '10182'],
    regulatory: '38 CFR 3.103'
  },

  // === DEVELOPMENT LETTERS ===
  {
    id: 'development-letter-5103',
    name: 'VCAA 5103 Notice Letter',
    category: 'Development',
    subcategory: 'VCAA',
    description: 'Veterans Claims Assistance Act notification',
    purpose: 'Fulfill VCAA duty to notify requirements',
    content: `Dear {{veteranName}},

This letter is to notify you of your rights and our responsibilities under the Veterans Claims Assistance Act (VCAA) regarding your claim received on {{claimDate}}.

WHAT WE NEED FROM YOU:
{{evidenceNeeded}}

HOW WE CAN HELP:
We will help you obtain:
• Service treatment records
• VA medical records
• Private medical records (with your authorization)
• Social Security records
• Service personnel records

WHAT MAKES A CLAIM SUCCESSFUL:
To establish service connection, we need evidence showing:
1. A current disability
2. An in-service event, injury, or illness
3. A link between your current disability and service

DISABILITY RATINGS:
If service connection is granted, we assign ratings from 0% to 100% based on severity. Higher ratings mean higher compensation.

EFFECTIVE DATES:
Generally, the effective date is when we received your claim or when entitlement arose, whichever is later.

YOUR DEADLINE: {{deadline}}

{{additionalInstructions}}

Contact: {{contactInfo}}

Sincerely,
{{processorName}}`,
    variables: [
      'veteranName', 'claimDate', 'evidenceNeeded', 'deadline',
      'additionalInstructions', 'contactInfo', 'processorName'
    ],
    regulatory: '38 USC 5103',
    relatedForms: ['21-526EZ', '21-4142']
  },

  // === NOTICE LETTERS ===
  {
    id: 'intent-to-reduce',
    name: 'Notice of Intent to Reduce Benefits',
    category: 'Notices',
    subcategory: 'Reductions',
    description: 'Formal notice of proposed benefit reduction',
    purpose: 'Notify veteran of proposed reduction with due process rights',
    content: `Dear {{veteranName}},

This is an official notice that we propose to reduce your disability compensation.

CURRENT RATING: {{currentRating}}% for {{condition}}
PROPOSED RATING: {{proposedRating}}%
REASON FOR PROPOSED REDUCTION: {{reductionReason}}

EVIDENCE CONSIDERED:
{{evidenceConsidered}}

YOUR RIGHTS:
You have 60 DAYS from the date of this letter to:
1. Submit evidence showing why your rating should not be reduced
2. Request a predetermination hearing

You have 30 DAYS to request that your benefits continue at the current rate during this review.

WHAT YOU CAN SUBMIT:
• Medical evidence showing continued severity
• Statements from doctors
• Personal statements describing symptoms
• Buddy statements from family/friends

IF NO RESPONSE IS RECEIVED:
We will proceed with the reduction effective {{effectiveDate}}.

HEARING INFORMATION:
To request a hearing, call {{hearingNumber}} or write to {{hearingAddress}}.

This is a serious matter requiring your immediate attention.

Contact: {{contactInfo}}

Sincerely,
{{processorName}}`,
    variables: [
      'veteranName', 'currentRating', 'condition', 'proposedRating',
      'reductionReason', 'evidenceConsidered', 'effectiveDate',
      'hearingNumber', 'hearingAddress', 'contactInfo', 'processorName'
    ],
    regulatory: '38 CFR 3.105(e)',
    requiredAttachments: ['Hearing request form', 'Evidence submission guide']
  },

  // === SPECIAL CIRCUMSTANCES ===
  {
    id: 'homeless-outreach',
    name: 'Homeless Veteran Outreach Letter',
    category: 'Special Programs',
    subcategory: 'Homeless Services',
    description: 'Outreach to veterans experiencing homelessness',
    purpose: 'Connect homeless veterans with services',
    content: `Dear {{veteranName}},

We want to ensure you're aware of services available to you as a veteran experiencing housing instability.

IMMEDIATE ASSISTANCE AVAILABLE:
• Emergency housing: Call {{crisisLine}} (24/7)
• VA Community Living Centers
• Grant and Per Diem Program housing
• HUD-VASH vouchers for permanent housing

HEALTHCARE:
• Walk-in care at any VA medical center
• Mental health services
• Substance abuse treatment
• No copays if you're experiencing homelessness

BENEFITS ASSISTANCE:
• Expedited claims processing
• Help applying for benefits
• Representative payee services if needed
• Assistance getting vital documents

EMPLOYMENT SERVICES:
• Homeless Veteran Reintegration Program
• Compensated Work Therapy
• Job training and placement

LOCAL RESOURCES:
{{localResources}}

STAND DOWN EVENT:
{{standDownInfo}}

You don't have to face this alone. Please reach out:
National Call Center for Homeless Veterans: 1-877-4AID-VET (1-877-424-3838)

{{additionalInfo}}

With respect and support,
{{processorName}}
Homeless Veteran Outreach Coordinator`,
    variables: [
      'veteranName', 'crisisLine', 'localResources', 'standDownInfo',
      'additionalInfo', 'processorName'
    ],
    sampleScenarios: ['Initial outreach', 'Service connection', 'Follow-up']
  },

  // === FIDUCIARY LETTERS ===
  {
    id: 'fiduciary-appointment',
    name: 'Fiduciary Appointment Notification',
    category: 'Fiduciary',
    description: 'Notification of fiduciary appointment',
    purpose: 'Inform veteran of fiduciary appointment and rights',
    content: `Dear {{veteranName}},

The Department of Veterans Affairs has determined that appointment of a fiduciary is necessary to manage your VA benefits.

FIDUCIARY INFORMATION:
Name: {{fiduciaryName}}
Type: {{fiduciaryType}}
Contact: {{fiduciaryContact}}

REASON FOR APPOINTMENT:
{{appointmentReason}}

YOUR RIGHTS:
• Appeal this decision within one year
• Request a different fiduciary
• Provide input on how benefits are used
• Receive accountings of benefit use
• Request removal of fiduciary if circumstances change

FIDUCIARY RESPONSIBILITIES:
• Manage VA benefits in your best interest
• Pay for your immediate needs first
• Provide annual accountings to VA
• Cannot charge fees without VA approval

{{additionalInformation}}

Questions? Contact: {{contactInfo}}

Sincerely,
{{processorName}}
Fiduciary Hub`,
    variables: [
      'veteranName', 'fiduciaryName', 'fiduciaryType', 'fiduciaryContact',
      'appointmentReason', 'additionalInformation', 'contactInfo', 'processorName'
    ],
    regulatory: '38 CFR 13.100',
    relatedForms: ['21-0845']
  }
];

// Helper function to search forms
export function searchVAForms(query: string): VAForm[] {
  const searchTerm = query.toLowerCase();
  return vaFormsDatabase.filter(form =>
    form.formNumber.toLowerCase().includes(searchTerm) ||
    form.title.toLowerCase().includes(searchTerm) ||
    form.description.toLowerCase().includes(searchTerm) ||
    form.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
    form.category.toLowerCase().includes(searchTerm)
  );
}

// Helper function to get forms by category
export function getFormsByCategory(category: string): VAForm[] {
  return vaFormsDatabase.filter(form => form.category === category);
}

// Helper function to search templates
export function searchLetterTemplates(query: string): LetterTemplate[] {
  const searchTerm = query.toLowerCase();
  return letterTemplatesDatabase.filter(template =>
    template.name.toLowerCase().includes(searchTerm) ||
    template.description.toLowerCase().includes(searchTerm) ||
    template.purpose.toLowerCase().includes(searchTerm) ||
    template.category.toLowerCase().includes(searchTerm)
  );
}

// Helper function to get templates by category
export function getTemplatesByCategory(category: string): LetterTemplate[] {
  return letterTemplatesDatabase.filter(template => template.category === category);
}

// Get all unique categories
export function getFormCategories(): string[] {
  return [...new Set(vaFormsDatabase.map(form => form.category))];
}

export function getTemplateCategories(): string[] {
  return [...new Set(letterTemplatesDatabase.map(template => template.category))];
}