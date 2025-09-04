import { CODCase, ServicePeriod, EvidenceItem, RulePath, ClauseTemplate, ClausePack } from '@/types/codda';

// Mock Service Periods
export const mockServicePeriods: ServicePeriod[] = [
  {
    id: 'sp-1',
    branch: 'ARMY',
    start: '2010-06-01',
    end: '2014-03-15',
    charOfDischarge: 'OTH',
    notes: 'Other Than Honorable discharge due to pattern of misconduct including AWOL and insubordination'
  },
  {
    id: 'sp-2',
    branch: 'NAVY',
    start: '2015-01-10',
    end: '2017-08-22',
    charOfDischarge: 'HON',
    notes: 'Honorable discharge, completed full term of service'
  }
];

// Mock Evidence Items
export const mockEvidenceItems: EvidenceItem[] = [
  {
    id: 'ev-1',
    kind: 'SeparationPacket',
    title: 'DD Form 214 - Certificate of Release or Discharge from Active Duty',
    date: '2014-03-15',
    source: 'eFolder',
    reliability: 'high',
    summary: 'Official discharge document showing OTH characterization due to pattern of misconduct',
    tags: ['discharge', 'official', 'misconduct']
  },
  {
    id: 'ev-2',
    kind: 'ChargeSheet',
    title: 'Article 15 Proceedings - AWOL Charges',
    date: '2013-11-20',
    source: 'HENRY',
    reliability: 'high',
    summary: 'Non-judicial punishment for 15-day AWOL period in November 2013',
    tags: ['awol', 'article15', 'misconduct']
  },
  {
    id: 'ev-3',
    kind: 'STR',
    title: 'Service Treatment Records - Mental Health Evaluation',
    date: '2014-01-10',
    source: 'eFolder',
    reliability: 'medium',
    summary: 'Psychiatric evaluation conducted prior to separation, no diagnosis of mental illness',
    tags: ['mental-health', 'evaluation', 'psychiatric']
  },
  {
    id: 'ev-gap-1',
    kind: 'Lay',
    title: 'Command Statement - Missing',
    source: 'External',
    reliability: 'high',
    summary: 'Statement from commanding officer regarding veteran\'s conduct',
    tags: ['command', 'statement'],
    isGap: true
  }
];

// Mock Rule Paths
export const mockRulePaths: RulePath[] = [
  {
    id: 'rp-1',
    label: '3.12(d) - Pattern of Misconduct',
    branches: ['3.12(d)(1)', '3.12(d)(2)'],
    requiresInsanityCheck: true,
    requiresCompellingCircumstances: true,
    description: 'Discharge under dishonorable conditions due to pattern of misconduct'
  },
  {
    id: 'rp-2',
    label: '3.354 - Insanity Exception',
    branches: ['3.354(a)', '3.354(b)'],
    requiresInsanityCheck: true,
    description: 'Exception for insanity during service period'
  },
  {
    id: 'rp-3',
    label: '3.360 - Healthcare Eligibility',
    branches: ['3.360(a)', '3.360(c)'],
    description: 'Healthcare eligibility determination despite character of discharge bar'
  }
];

// Mock Clause Templates
export const mockClauseTemplates: ClauseTemplate[] = [
  {
    id: 'ct-1',
    category: 'issue',
    title: 'Standard Issue Statement',
    template: 'Character of discharge for the service period from {start} to {end}.',
    parameters: [
      { name: 'start', type: 'date', required: true },
      { name: 'end', type: 'date', required: true }
    ],
    tone: 'neutral',
    tags: ['standard', 'issue']
  },
  {
    id: 'ct-2',
    category: 'evidence',
    title: 'Evidence Lead-in',
    template: 'The evidence considered includes: {evidenceList}.',
    parameters: [
      { name: 'evidenceList', type: 'string', required: true }
    ],
    tone: 'neutral',
    tags: ['evidence', 'introduction']
  },
  {
    id: 'ct-3',
    category: 'insanity',
    title: 'Insanity Not at Issue',
    template: 'Insanity is **not** raised by the record or argument.',
    parameters: [],
    tone: 'neutral',
    tags: ['insanity', 'negative']
  },
  {
    id: 'ct-4',
    category: 'insanity',
    title: 'Insanity Considered and Applies',
    template: 'The record reflects symptoms/diagnosis suggesting insanity at the time of the offense(s); the criteria are met because {rationale}.',
    parameters: [
      { name: 'rationale', type: 'string', required: true }
    ],
    tone: 'clinical',
    tags: ['insanity', 'positive']
  },
  {
    id: 'ct-5',
    category: 'compelling',
    title: 'Compelling Circumstances',
    template: 'Compelling circumstances were considered, including {factors}. {conclusion}.',
    parameters: [
      { name: 'factors', type: 'string', required: true },
      { name: 'conclusion', type: 'string', required: true }
    ],
    tone: 'neutral',
    tags: ['compelling', 'circumstances']
  },
  {
    id: 'ct-6',
    category: 'bar',
    title: 'Bar Met - General',
    template: 'The discharge constitutes a bar to benefits under {regulation} based on {facts}.',
    parameters: [
      { name: 'regulation', type: 'string', required: true },
      { name: 'facts', type: 'string', required: true }
    ],
    tone: 'neutral',
    tags: ['bar', 'benefits']
  },
  {
    id: 'ct-7',
    category: 'healthcare',
    title: 'Healthcare Eligibility Analysis',
    template: 'Although a bar applies, eligibility for health care under chapter 17 is considered; {analysis}.',
    parameters: [
      { name: 'analysis', type: 'string', required: true }
    ],
    tone: 'neutral',
    tags: ['healthcare', 'chapter17']
  },
  {
    id: 'ct-8',
    category: 'decision',
    title: 'Decision Statement',
    template: 'For the period {start}–{end}, the service is {characterization} for VA purposes.',
    parameters: [
      { name: 'start', type: 'date', required: true },
      { name: 'end', type: 'date', required: true },
      { name: 'characterization', type: 'select', required: true, options: ['honorable', 'dishonorable', 'under dishonorable conditions'] }
    ],
    tone: 'neutral',
    tags: ['decision', 'final']
  },
  {
    id: 'ct-9',
    category: 'favorable',
    title: 'Favorable Findings',
    template: 'The following favorable findings are made and are binding: {findings}.',
    parameters: [
      { name: 'findings', type: 'string', required: true }
    ],
    tone: 'neutral',
    tags: ['favorable', 'binding']
  }
];

// Mock Clause Packs
export const mockClausePacks: ClausePack[] = [
  {
    id: 'cp-core',
    name: 'Core Templates',
    description: 'Essential clause templates for all COD determinations',
    clauses: mockClauseTemplates.filter(ct => ['issue', 'evidence', 'decision'].includes(ct.category)),
    isDefault: true
  },
  {
    id: 'cp-mental-health',
    name: 'Mental Health Pack',
    description: 'Templates for insanity and mental health considerations',
    clauses: mockClauseTemplates.filter(ct => ct.category === 'insanity'),
    isDefault: false
  },
  {
    id: 'cp-misconduct',
    name: 'Misconduct Pack',
    description: 'Templates for misconduct-related discharges',
    clauses: mockClauseTemplates.filter(ct => ['bar', 'compelling'].includes(ct.category)),
    isDefault: false
  }
];

// Mock COD Cases
export const mockCODCases: CODCase[] = [
  {
    id: 'COD-2024-001',
    fileNumber: '123456789',
    claimant: 'John Doe',
    station: 'St. Petersburg',
    service: [mockServicePeriods[0]],
    evidence: mockEvidenceItems.slice(0, 3),
    rulePath: mockRulePaths[0],
    finding: {
      insanityConsidered: true,
      insanityApplies: false,
      rationaleInsanity: 'No evidence of mental illness during relevant time period',
      compellingCircumstancesConsidered: true,
      compellingRationale: 'No compelling circumstances identified',
      barMet: true,
      healthcareOnlyConsidered: true,
      healthcareOnlyRationale: 'Veteran eligible for healthcare under 38 CFR 3.360'
    },
    decision: {
      issue: 'Character of discharge for the service period from June 1, 2010 to March 15, 2014.',
      evidenceIds: ['ev-1', 'ev-2', 'ev-3'],
      regs: ['38 CFR 3.12(d)', '38 CFR 3.354', '38 CFR 3.360'],
      decisionText: 'The discharge constitutes a bar to benefits based on pattern of misconduct.',
      reasonsBases: 'The evidence shows a pattern of misconduct including AWOL and insubordination. Insanity was considered but not established. Healthcare eligibility under Chapter 17 is granted.',
      favorableFindings: ['Veteran served honorably during initial 2 years of service']
    },
    ipr: {
      required: true,
      status: 'pending',
      completionChecklist: [
        { id: 'ipr-1', label: 'Attach draft decision', completed: false, required: true },
        { id: 'ipr-2', label: 'Complete VA Form 21-0961', completed: false, required: true },
        { id: 'ipr-3', label: 'Apply Special Issue', completed: false, required: true },
        { id: 'ipr-4', label: 'Create tracked item', completed: false, required: true },
        { id: 'ipr-5', label: 'Set suspense date (+4 business days)', completed: false, required: true }
      ]
    },
    qa: {
      completeness: 75,
      lintFlags: [
        {
          id: 'lint-1',
          type: 'warning',
          section: 'EVIDENCE',
          message: 'Missing command statement evidence',
          suggestion: 'Request command statement from veteran\'s unit'
        }
      ],
      templateFidelity: true,
      regCompleteness: true,
      toneLint: [],
      evidenceTraceability: true,
      iprEnforcement: false,
      biasScore: 15
    },
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:45:00Z',
    status: 'draft',
    assignedTo: 'VSR-12345',
    dueDate: '2024-01-22T17:00:00Z'
  },
  {
    id: 'COD-2024-002',
    fileNumber: '987654321',
    claimant: 'Jane Smith',
    station: 'Atlanta',
    service: [mockServicePeriods[1]],
    evidence: [mockEvidenceItems[0]],
    finding: {
      insanityConsidered: false,
      compellingCircumstancesConsidered: false
    },
    decision: {
      issue: '',
      evidenceIds: [],
      regs: [],
      decisionText: '',
      reasonsBases: ''
    },
    ipr: {
      required: false,
      status: 'pending'
    },
    qa: {
      completeness: 25,
      lintFlags: [],
      templateFidelity: false,
      regCompleteness: false,
      toneLint: [],
      evidenceTraceability: false,
      iprEnforcement: false,
      biasScore: 0
    },
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-16T09:15:00Z',
    status: 'draft'
  }
];

// Utility Functions
export const getCaseById = (id: string): CODCase | undefined => {
  return mockCODCases.find(c => c.id === id);
};

export const getClausesByCategory = (category: string): ClauseTemplate[] => {
  return mockClauseTemplates.filter(ct => ct.category === category);
};

export const getRulePathSuggestions = (serviceFacts: string[]): RulePath[] => {
  // Simple rule path suggestion logic based on service facts
  const suggestions: RulePath[] = [];
  
  if (serviceFacts.some(fact => fact.includes('misconduct') || fact.includes('AWOL'))) {
    suggestions.push(mockRulePaths[0]); // 3.12(d)
  }
  
  if (serviceFacts.some(fact => fact.includes('mental') || fact.includes('insanity'))) {
    suggestions.push(mockRulePaths[1]); // 3.354
  }
  
  suggestions.push(mockRulePaths[2]); // Always consider healthcare eligibility
  
  return suggestions;
};

export const runEvidenceGapScan = (caseId: string): EvidenceItem[] => {
  // Mock evidence gap detection
  return mockEvidenceItems.filter(item => item.isGap);
};

export const generateBiasAnalysis = (content: string) => {
  // Mock bias analysis
  const biasWords = ['clearly', 'obviously', 'definitely', 'without question', 'undoubtedly'];
  const issues = biasWords.filter(word => content.toLowerCase().includes(word));
  
  return {
    overallScore: Math.max(0, 100 - (issues.length * 20)),
    issues: issues.map(word => ({
      section: 'REASONS & BASES',
      text: word,
      type: 'conclusory' as const,
      severity: 'medium' as const,
      suggestion: `Replace "${word}" with more neutral language`
    })),
    suggestions: [
      'Use objective language',
      'Avoid conclusory statements',
      'Support assertions with evidence'
    ]
  };
};
