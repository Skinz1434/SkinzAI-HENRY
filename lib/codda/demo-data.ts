import { CODCase, ServicePeriod, EvidenceItem, RulePath, ClauseTemplate } from '@/types/codda';

// Extensive demo service periods covering various scenarios
export const demoServicePeriods: ServicePeriod[] = [
  // Army OTH discharge - Pattern of misconduct
  {
    id: 'sp-demo-1',
    branch: 'ARMY',
    start: '2010-06-01',
    end: '2014-03-15',
    charOfDischarge: 'OTH',
    notes: 'Other Than Honorable discharge due to pattern of misconduct including multiple AWOL incidents, insubordination, and failure to follow lawful orders'
  },
  // Navy Honorable discharge - Full service
  {
    id: 'sp-demo-2',
    branch: 'NAVY',
    start: '2015-01-10',
    end: '2019-01-09',
    charOfDischarge: 'HON',
    notes: 'Honorable discharge after completing full 4-year enlistment with exemplary service record'
  },
  // Marines BCD - Court martial conviction
  {
    id: 'sp-demo-3',
    branch: 'MARINES',
    start: '2016-09-12',
    end: '2018-11-30',
    charOfDischarge: 'BCD',
    notes: 'Bad Conduct Discharge following general court-martial conviction for assault and drug-related offenses'
  },
  // Air Force General discharge - Medical separation
  {
    id: 'sp-demo-4',
    branch: 'AIR_FORCE',
    start: '2017-03-20',
    end: '2020-08-15',
    charOfDischarge: 'GEN',
    notes: 'General discharge under honorable conditions due to medical unfitness for duty - PTSD and anxiety disorders'
  },
  // Coast Guard Dismissal - Officer misconduct
  {
    id: 'sp-demo-5',
    branch: 'COAST_GUARD',
    start: '2012-05-01',
    end: '2015-12-22',
    charOfDischarge: 'DISMISSAL',
    notes: 'Dismissal of commissioned officer following court-martial for financial misconduct and abuse of authority'
  }
];

// Comprehensive evidence items for various case types
export const demoEvidenceItems: EvidenceItem[] = [
  // Official discharge documents
  {
    id: 'ev-demo-1',
    kind: 'SeparationPacket',
    title: 'DD Form 214 - Certificate of Release or Discharge from Active Duty',
    date: '2014-03-15',
    source: 'eFolder',
    reliability: 'high',
    summary: 'Official discharge document showing OTH characterization. Narrative reason: Pattern of Misconduct. Separation code: JKQ.',
    tags: ['discharge', 'official', 'misconduct', 'separation']
  },
  {
    id: 'ev-demo-2',
    kind: 'SeparationPacket',
    title: 'DA Form 4187 - Personnel Action Request',
    date: '2014-02-28',
    source: 'eFolder',
    reliability: 'high',
    summary: 'Administrative separation request initiated by unit commander citing pattern of misconduct and failure to meet Army standards.',
    tags: ['administrative', 'separation', 'commander']
  },
  
  // Court martial and disciplinary records
  {
    id: 'ev-demo-3',
    kind: 'CourtMartial',
    title: 'General Court-Martial Record of Trial',
    date: '2018-09-15',
    source: 'eFolder',
    reliability: 'high',
    summary: 'Complete record of general court-martial proceedings. Charges: Article 86 (AWOL), Article 92 (Failure to obey order), Article 134 (Drug use). Sentence: Reduction in rank, forfeiture of pay, confinement, BCD.',
    tags: ['court-martial', 'conviction', 'drugs', 'awol']
  },
  {
    id: 'ev-demo-4',
    kind: 'ChargeSheet',
    title: 'Article 15 Proceedings - Multiple Incidents',
    date: '2013-11-20',
    source: 'HENRY',
    reliability: 'high',
    summary: 'Non-judicial punishment proceedings for: (1) 15-day AWOL Nov 2013, (2) Insubordination to NCO, (3) Failure to report for duty formation. Punishment: Reduction in rank, extra duty, restriction.',
    tags: ['article15', 'awol', 'insubordination', 'njp']
  },
  
  // Medical and mental health records
  {
    id: 'ev-demo-5',
    kind: 'STR',
    title: 'Service Treatment Records - Mental Health Evaluation',
    date: '2014-01-10',
    source: 'eFolder',
    reliability: 'high',
    summary: 'Comprehensive psychiatric evaluation conducted prior to separation. Diagnosis: Adjustment Disorder with Mixed Anxiety and Depressed Mood. No evidence of psychosis or severe mental illness during relevant time period.',
    tags: ['mental-health', 'psychiatric', 'evaluation', 'adjustment-disorder']
  },
  {
    id: 'ev-demo-6',
    kind: 'STR',
    title: 'Combat Stress Control Team Assessment',
    date: '2013-08-05',
    source: 'eFolder',
    reliability: 'medium',
    summary: 'Assessment following deployment to Afghanistan. Veteran reported sleep disturbances, hypervigilance, and difficulty with authority figures. Recommended for follow-up mental health treatment.',
    tags: ['combat', 'stress', 'deployment', 'afghanistan', 'ptsd']
  },
  {
    id: 'ev-demo-7',
    kind: 'Treatment',
    title: 'VA Mental Health Treatment Records',
    date: '2015-06-12',
    source: 'External',
    reliability: 'high',
    summary: 'Post-discharge VA mental health treatment records. Diagnosis: PTSD, Major Depressive Disorder. Treatment includes therapy and medication management. Veteran reports service-connected trauma.',
    tags: ['va-treatment', 'ptsd', 'depression', 'post-discharge']
  },
  
  // Personnel and performance records
  {
    id: 'ev-demo-8',
    kind: 'SPR',
    title: 'Service Personnel Records - Performance Evaluations',
    date: '2010-2013',
    source: 'eFolder',
    reliability: 'high',
    summary: 'Complete personnel file including NCOERs and counseling statements. Shows declining performance from 2012 onwards. Early evaluations (2010-2011) show "Excellent" ratings. Later evaluations show "Needs Improvement" in multiple areas.',
    tags: ['performance', 'ncoer', 'counseling', 'decline']
  },
  {
    id: 'ev-demo-9',
    kind: 'Other',
    title: 'Unit Deployment Records',
    date: '2012-2013',
    source: 'HENRY',
    reliability: 'high',
    summary: 'Documentation of deployment to FOB Shank, Afghanistan (12 months). Unit experienced multiple casualties including IED attacks and small arms fire. Veteran\'s unit lost 3 soldiers during deployment.',
    tags: ['deployment', 'combat', 'casualties', 'afghanistan']
  },
  
  // Command and witness statements
  {
    id: 'ev-demo-10',
    kind: 'Lay',
    title: 'Commanding Officer Statement',
    date: '2014-02-15',
    source: 'eFolder',
    reliability: 'high',
    summary: 'Statement from LTC Johnson regarding veteran\'s service. Notes significant change in behavior post-deployment. Initially exemplary soldier who became increasingly unreliable and defiant. Recommends consideration of combat-related stressors.',
    tags: ['command', 'statement', 'behavior-change', 'combat-stress']
  },
  {
    id: 'ev-demo-11',
    kind: 'Lay',
    title: 'Battle Buddy Witness Statement',
    date: '2014-03-01',
    source: 'Upload',
    reliability: 'medium',
    summary: 'Statement from SGT Martinez (battle buddy during deployment). Describes veteran\'s personality change after IED incident. Reports nightmares, alcohol use, and withdrawal from unit activities. States veteran was "never the same" after losing close friends in combat.',
    tags: ['witness', 'battle-buddy', 'ied', 'personality-change', 'alcohol']
  },
  
  // Evidence gaps that need to be filled
  {
    id: 'ev-gap-demo-1',
    kind: 'STR',
    title: 'Pre-Deployment Medical Examination',
    source: 'External',
    reliability: 'high',
    summary: 'Complete pre-deployment medical and psychological screening records needed to establish baseline mental health status',
    tags: ['pre-deployment', 'medical', 'psychological', 'baseline'],
    isGap: true
  },
  {
    id: 'ev-gap-demo-2',
    kind: 'Other',
    title: 'Unit After Action Reports (AAR)',
    source: 'External',
    reliability: 'high',
    summary: 'Unit after-action reports from specific combat engagements mentioned in witness statements',
    tags: ['aar', 'combat', 'engagement'],
    isGap: true
  },
  {
    id: 'ev-gap-demo-3',
    kind: 'Lay',
    title: 'Family Member Statements',
    source: 'External',
    reliability: 'medium',
    summary: 'Statements from family members regarding veteran\'s behavior changes and mental health symptoms',
    tags: ['family', 'behavior', 'symptoms'],
    isGap: true
  }
];

// Comprehensive demo cases covering various scenarios
export const demoCODCases: CODCase[] = [
  // Case 1: Complex OTH with PTSD considerations
  {
    id: 'COD-DEMO-001',
    fileNumber: '123456789',
    claimant: 'John David Martinez',
    station: 'St. Petersburg Regional Office',
    service: [demoServicePeriods[0]],
    evidence: demoEvidenceItems.slice(0, 8),
    rulePath: {
      id: 'rp-complex-1',
      label: '3.12(d) with 3.354 Insanity Exception Analysis',
      branches: ['3.12(d)(1)', '3.354(a)', '3.360(a)'],
      requiresInsanityCheck: true,
      requiresCompellingCircumstances: true,
      description: 'Pattern of misconduct discharge with consideration of combat-related mental health conditions'
    },
    finding: {
      insanityConsidered: true,
      insanityApplies: false,
      rationaleInsanity: 'While veteran was diagnosed with Adjustment Disorder, the condition did not rise to the level of insanity as defined in 38 CFR 3.354. Veteran retained capacity to distinguish right from wrong and to adhere to the right during the relevant time period.',
      compellingCircumstancesConsidered: true,
      compellingRationale: 'Compelling circumstances include combat deployment with multiple traumatic exposures and loss of battle buddies. However, the pattern of misconduct continued over an extended period and included multiple types of violations.',
      barMet: true,
      healthcareOnlyConsidered: true,
      healthcareOnlyRationale: 'Veteran is eligible for healthcare benefits under 38 CFR 3.360 based on combat service in Afghanistan and subsequent mental health treatment needs.'
    },
    decision: {
      issue: 'Character of discharge for the service period from June 1, 2010 to March 15, 2014.',
      evidenceIds: ['ev-demo-1', 'ev-demo-4', 'ev-demo-5', 'ev-demo-10'],
      regs: ['38 CFR 3.12(d)', '38 CFR 3.354', '38 CFR 3.360'],
      decisionText: 'The discharge constitutes a bar to benefits under 38 CFR 3.12(d) based on pattern of misconduct. However, healthcare eligibility is granted under 38 CFR 3.360.',
      reasonsBases: `The evidence establishes a pattern of misconduct including multiple AWOL incidents, insubordination, and failure to follow lawful orders. While the veteran experienced combat-related stress, the misconduct continued over an extended period and demonstrated a willful disregard for military discipline rather than behavior solely attributable to mental health conditions.

Insanity Exception Analysis: The veteran was diagnosed with Adjustment Disorder with Mixed Anxiety and Depressed Mood. However, this condition does not meet the criteria for insanity under 38 CFR 3.354. The evidence shows the veteran retained the capacity to distinguish right from wrong and could adhere to the right during the relevant time period.

Compelling Circumstances: The veteran's combat service in Afghanistan, exposure to traumatic events, and loss of battle buddies constitute compelling circumstances that were considered. However, the pattern of misconduct was extensive and continued despite counseling and corrective action.

Healthcare Eligibility: The veteran served in a combat zone and has service-connected mental health conditions requiring ongoing treatment. Healthcare eligibility under Chapter 17 is appropriate.`,
      favorableFindings: [
        'Veteran served honorably during first two years of enlistment with excellent performance ratings',
        'Veteran deployed to combat zone in Afghanistan for 12 months',
        'Veteran\'s unit experienced significant casualties during deployment',
        'Veteran sought mental health treatment and was diagnosed with service-related conditions'
      ]
    },
    ipr: {
      required: false, // Healthcare only, not full benefits bar
      status: 'cleared',
      completionChecklist: [
        { id: 'ipr-demo-1', label: 'Healthcare eligibility determination completed', completed: true, required: true },
        { id: 'ipr-demo-2', label: 'Combat veteran status verified', completed: true, required: true },
        { id: 'ipr-demo-3', label: 'Mental health treatment needs assessed', completed: true, required: true }
      ]
    },
    qa: {
      completeness: 92,
      lintFlags: [],
      templateFidelity: true,
      regCompleteness: true,
      toneLint: [],
      evidenceTraceability: true,
      iprEnforcement: true,
      biasScore: 8
    },
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    status: 'review',
    assignedTo: 'RVSR-Sarah-Johnson',
    dueDate: '2024-01-25T17:00:00Z'
  },

  // Case 2: Simple honorable discharge - No bar
  {
    id: 'COD-DEMO-002',
    fileNumber: '987654321',
    claimant: 'Maria Elena Rodriguez',
    station: 'Atlanta Regional Office',
    service: [demoServicePeriods[1]],
    evidence: [demoEvidenceItems[7]],
    finding: {
      insanityConsidered: false,
      compellingCircumstancesConsidered: false,
      barMet: false
    },
    decision: {
      issue: 'Character of discharge for the service period from January 10, 2015 to January 9, 2019.',
      evidenceIds: ['ev-demo-8'],
      regs: ['38 CFR 3.12(a)'],
      decisionText: 'The honorable discharge does not constitute a bar to benefits.',
      reasonsBases: 'The veteran received an honorable discharge after completing a full 4-year enlistment with exemplary service. No misconduct or disqualifying factors are present.',
      favorableFindings: [
        'Veteran completed full enlistment period',
        'Consistently high performance evaluations',
        'No disciplinary actions on record',
        'Commendations for outstanding service'
      ]
    },
    ipr: {
      required: false,
      status: 'cleared'
    },
    qa: {
      completeness: 100,
      lintFlags: [],
      templateFidelity: true,
      regCompleteness: true,
      toneLint: [],
      evidenceTraceability: true,
      iprEnforcement: true,
      biasScore: 2
    },
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
    status: 'completed',
    assignedTo: 'VSR-Mike-Chen'
  },

  // Case 3: BCD with full benefits bar requiring IPR
  {
    id: 'COD-DEMO-003',
    fileNumber: '456789123',
    claimant: 'Robert James Thompson',
    station: 'Phoenix Regional Office',
    service: [demoServicePeriods[2]],
    evidence: demoEvidenceItems.slice(2, 4),
    rulePath: {
      id: 'rp-bcd-1',
      label: '3.12(c) - Dishonorable Conditions Bar',
      branches: ['3.12(c)', '3.360(c)'],
      requiresInsanityCheck: true,
      requiresCompellingCircumstances: false,
      description: 'Bad Conduct Discharge constituting full bar to benefits'
    },
    finding: {
      insanityConsidered: true,
      insanityApplies: false,
      rationaleInsanity: 'No evidence of mental illness or incapacity during the time of offenses. Court-martial proceedings indicate veteran was competent to stand trial.',
      compellingCircumstancesConsidered: false,
      barMet: true,
      healthcareOnlyConsidered: true,
      healthcareOnlyRationale: 'No healthcare eligibility under current regulations due to nature of offenses and discharge characterization.'
    },
    decision: {
      issue: 'Character of discharge for the service period from September 12, 2016 to November 30, 2018.',
      evidenceIds: ['ev-demo-3'],
      regs: ['38 CFR 3.12(c)'],
      decisionText: 'The Bad Conduct Discharge constitutes a complete bar to all VA benefits under 38 CFR 3.12(c).',
      reasonsBases: 'The veteran received a Bad Conduct Discharge following general court-martial conviction for serious offenses including assault and drug-related violations. The discharge was under dishonorable conditions and bars all VA benefits including healthcare.',
      favorableFindings: []
    },
    ipr: {
      required: true,
      status: 'pending',
      draftDocId: 'draft-cod-demo-003',
      suspenseDate: '2024-01-26T17:00:00Z',
      completionChecklist: [
        { id: 'ipr-bcd-1', label: 'Attach draft decision document', completed: true, required: true },
        { id: 'ipr-bcd-2', label: 'Complete VA Form 21-0961', completed: false, required: true },
        { id: 'ipr-bcd-3', label: 'Apply Special Issue designation', completed: false, required: true },
        { id: 'ipr-bcd-4', label: 'Create tracked item with suspense date', completed: false, required: true },
        { id: 'ipr-bcd-5', label: 'Add internal routing notes', completed: false, required: true }
      ]
    },
    qa: {
      completeness: 85,
      lintFlags: [
        {
          id: 'lint-bcd-1',
          type: 'warning',
          section: 'IPR',
          message: 'IPR processing incomplete',
          suggestion: 'Complete all IPR checklist items before finalizing decision'
        }
      ],
      templateFidelity: true,
      regCompleteness: true,
      toneLint: [],
      evidenceTraceability: true,
      iprEnforcement: false,
      biasScore: 5
    },
    createdAt: '2024-01-17T11:20:00Z',
    updatedAt: '2024-01-19T13:15:00Z',
    status: 'draft',
    assignedTo: 'VSR-Lisa-Park',
    dueDate: '2024-01-26T17:00:00Z'
  },

  // Case 4: General discharge with medical considerations
  {
    id: 'COD-DEMO-004',
    fileNumber: '789123456',
    claimant: 'Jennifer Anne Wilson',
    station: 'Denver Regional Office',
    service: [demoServicePeriods[3]],
    evidence: [demoEvidenceItems[5], demoEvidenceItems[6]],
    rulePath: {
      id: 'rp-medical-1',
      label: '3.12(d) with Medical Separation Analysis',
      branches: ['3.12(d)', '3.354(b)', '3.360(a)'],
      requiresInsanityCheck: true,
      requiresCompellingCircumstances: true,
      description: 'General discharge with underlying mental health conditions'
    },
    finding: {
      insanityConsidered: true,
      insanityApplies: true,
      rationaleInsanity: 'Medical evidence establishes that veteran suffered from severe PTSD and Major Depressive Disorder that substantially impaired judgment and capacity for self-control during relevant time period.',
      compellingCircumstancesConsidered: true,
      compellingRationale: 'Combat-related PTSD and documented mental health treatment constitute compelling circumstances warranting favorable consideration.',
      barMet: false,
      healthcareOnlyConsidered: false
    },
    decision: {
      issue: 'Character of discharge for the service period from March 20, 2017 to August 15, 2020.',
      evidenceIds: ['ev-demo-6', 'ev-demo-7'],
      regs: ['38 CFR 3.12(d)', '38 CFR 3.354'],
      decisionText: 'The general discharge does not constitute a bar to benefits based on insanity exception under 38 CFR 3.354.',
      reasonsBases: 'While the veteran received a general discharge, the evidence establishes that underlying mental health conditions substantially contributed to any service deficiencies. The insanity exception applies, and no bar to benefits exists.',
      favorableFindings: [
        'Veteran diagnosed with service-connected PTSD and Major Depressive Disorder',
        'Mental health conditions directly related to military service',
        'Veteran actively sought and engaged in treatment',
        'Medical separation was appropriate given condition severity'
      ]
    },
    ipr: {
      required: false,
      status: 'cleared'
    },
    qa: {
      completeness: 95,
      lintFlags: [],
      templateFidelity: true,
      regCompleteness: true,
      toneLint: [],
      evidenceTraceability: true,
      iprEnforcement: true,
      biasScore: 3
    },
    createdAt: '2024-01-18T08:45:00Z',
    updatedAt: '2024-01-19T15:20:00Z',
    status: 'completed',
    assignedTo: 'RVSR-Dr-Rodriguez'
  },

  // Case 5: Officer dismissal - Complex case requiring extensive analysis
  {
    id: 'COD-DEMO-005',
    fileNumber: '321654987',
    claimant: 'Lieutenant Colonel Michael Stevens',
    station: 'Seattle Regional Office',
    service: [demoServicePeriods[4]],
    evidence: demoEvidenceItems.slice(0, 3),
    rulePath: {
      id: 'rp-officer-1',
      label: '3.12(c) - Officer Dismissal Analysis',
      branches: ['3.12(c)', '3.360(c)'],
      requiresInsanityCheck: true,
      requiresCompellingCircumstances: false,
      description: 'Officer dismissal equivalent to dishonorable discharge'
    },
    finding: {
      insanityConsidered: true,
      insanityApplies: false,
      rationaleInsanity: 'No evidence of mental illness or incapacity. Financial misconduct and abuse of authority were deliberate actions inconsistent with officer responsibilities.',
      compellingCircumstancesConsidered: false,
      barMet: true,
      healthcareOnlyConsidered: true,
      healthcareOnlyRationale: 'No healthcare eligibility due to nature of misconduct and officer status.'
    },
    decision: {
      issue: 'Character of discharge for the service period from May 1, 2012 to December 22, 2015.',
      evidenceIds: ['ev-demo-1', 'ev-demo-2'],
      regs: ['38 CFR 3.12(c)'],
      decisionText: 'The dismissal constitutes a complete bar to all VA benefits under 38 CFR 3.12(c).',
      reasonsBases: 'Officer dismissal following court-martial for financial misconduct and abuse of authority. The dismissal is equivalent to a dishonorable discharge and bars all benefits.',
      favorableFindings: []
    },
    ipr: {
      required: true,
      status: 'submitted',
      draftDocId: 'draft-cod-demo-005',
      form210961Id: 'form-21-0961-005',
      specialIssueApplied: true,
      trackedItemId: 'track-005-ipr',
      suspenseDate: '2024-01-30T17:00:00Z',
      completionChecklist: [
        { id: 'ipr-officer-1', label: 'Draft decision attached', completed: true, required: true },
        { id: 'ipr-officer-2', label: 'VA Form 21-0961 completed', completed: true, required: true },
        { id: 'ipr-officer-3', label: 'Special Issue applied', completed: true, required: true },
        { id: 'ipr-officer-4', label: 'Tracked item created', completed: true, required: true },
        { id: 'ipr-officer-5', label: 'Suspense date set (+4 business days)', completed: true, required: true }
      ]
    },
    qa: {
      completeness: 100,
      lintFlags: [],
      templateFidelity: true,
      regCompleteness: true,
      toneLint: [],
      evidenceTraceability: true,
      iprEnforcement: true,
      biasScore: 1
    },
    createdAt: '2024-01-12T14:10:00Z',
    updatedAt: '2024-01-20T09:30:00Z',
    status: 'review',
    assignedTo: 'DRO-James-Wilson'
  }
];

// Enhanced clause templates with more comprehensive options
export const enhancedClauseTemplates: ClauseTemplate[] = [
  // Issue statements for different scenarios
  {
    id: 'ct-issue-standard',
    category: 'issue',
    title: 'Standard Issue Statement',
    template: 'Character of discharge for the service period from {startDate} to {endDate}.',
    parameters: [
      { name: 'startDate', type: 'date', required: true },
      { name: 'endDate', type: 'date', required: true }
    ],
    tone: 'neutral',
    tags: ['standard', 'issue', 'basic']
  },
  {
    id: 'ct-issue-multiple',
    category: 'issue',
    title: 'Multiple Service Periods',
    template: 'Character of discharge for service periods: {servicePeriods}. Each period will be evaluated separately for VA benefit eligibility.',
    parameters: [
      { name: 'servicePeriods', type: 'string', required: true }
    ],
    tone: 'neutral',
    tags: ['multiple', 'issue', 'periods']
  },
  
  // Evidence statements
  {
    id: 'ct-evidence-comprehensive',
    category: 'evidence',
    title: 'Comprehensive Evidence Review',
    template: 'The evidence considered includes: {evidenceList}. Additional evidence was requested but not received: {missingEvidence}.',
    parameters: [
      { name: 'evidenceList', type: 'string', required: true },
      { name: 'missingEvidence', type: 'string', required: false }
    ],
    tone: 'neutral',
    tags: ['evidence', 'comprehensive', 'gaps']
  },
  {
    id: 'ct-evidence-combat',
    category: 'evidence',
    title: 'Combat Service Evidence',
    template: 'The record establishes combat service in {location} from {startDate} to {endDate}. Evidence includes deployment orders, unit records, and combat-related documentation.',
    parameters: [
      { name: 'location', type: 'string', required: true },
      { name: 'startDate', type: 'date', required: true },
      { name: 'endDate', type: 'date', required: true }
    ],
    tone: 'neutral',
    tags: ['evidence', 'combat', 'deployment']
  },
  
  // Insanity analysis - detailed options
  {
    id: 'ct-insanity-detailed-negative',
    category: 'insanity',
    title: 'Detailed Insanity Analysis - Not Established',
    template: 'Insanity during service was carefully considered. While the veteran was diagnosed with {diagnosis}, this condition does not meet the legal standard for insanity under 38 CFR 3.354. The evidence shows the veteran retained the capacity to distinguish right from wrong and to adhere to the right during the time of the misconduct. Specifically: {analysis}.',
    parameters: [
      { name: 'diagnosis', type: 'string', required: true },
      { name: 'analysis', type: 'string', required: true }
    ],
    tone: 'clinical',
    tags: ['insanity', 'detailed', 'negative', 'mental-health']
  },
  {
    id: 'ct-insanity-established',
    category: 'insanity',
    title: 'Insanity Exception Applies',
    template: 'The evidence establishes that the veteran suffered from {condition} which constituted insanity under 38 CFR 3.354. The medical evidence demonstrates: {medicalFindings}. This condition substantially impaired the veteran\'s capacity for rational judgment and self-control during the relevant time period.',
    parameters: [
      { name: 'condition', type: 'string', required: true },
      { name: 'medicalFindings', type: 'string', required: true }
    ],
    tone: 'clinical',
    tags: ['insanity', 'positive', 'exception', 'medical']
  },
  
  // Compelling circumstances - various scenarios
  {
    id: 'ct-compelling-combat',
    category: 'compelling',
    title: 'Combat-Related Compelling Circumstances',
    template: 'Compelling circumstances include the veteran\'s combat service in {location}, exposure to traumatic events including {traumaticEvents}, and the development of service-connected mental health conditions. These factors were given due consideration in evaluating the character of discharge.',
    parameters: [
      { name: 'location', type: 'string', required: true },
      { name: 'traumaticEvents', type: 'string', required: true }
    ],
    tone: 'neutral',
    tags: ['compelling', 'combat', 'trauma', 'mental-health']
  },
  {
    id: 'ct-compelling-personal',
    category: 'compelling',
    title: 'Personal/Family Compelling Circumstances',
    template: 'Compelling personal circumstances were considered, including {circumstances}. While these factors provide context for the veteran\'s situation, {conclusion}.',
    parameters: [
      { name: 'circumstances', type: 'string', required: true },
      { name: 'conclusion', type: 'string', required: true }
    ],
    tone: 'neutral',
    tags: ['compelling', 'personal', 'family']
  },
  
  // Bar determinations
  {
    id: 'ct-bar-pattern-misconduct',
    category: 'bar',
    title: 'Pattern of Misconduct Bar',
    template: 'The discharge constitutes a bar to benefits under 38 CFR 3.12(d) based on a pattern of misconduct. The evidence establishes multiple incidents of {misconductTypes} occurring over {timeFrame}. This pattern demonstrates a willful and persistent disregard for military discipline.',
    parameters: [
      { name: 'misconductTypes', type: 'string', required: true },
      { name: 'timeFrame', type: 'string', required: true }
    ],
    tone: 'neutral',
    tags: ['bar', 'misconduct', 'pattern', '3.12d']
  },
  {
    id: 'ct-bar-dishonorable',
    category: 'bar',
    title: 'Dishonorable Conditions Bar',
    template: 'The {dischargeType} constitutes a complete bar to all VA benefits under 38 CFR 3.12(c). This discharge was under dishonorable conditions based on {basis}.',
    parameters: [
      { name: 'dischargeType', type: 'select', required: true, options: ['Bad Conduct Discharge', 'Dishonorable Discharge', 'Dismissal'] },
      { name: 'basis', type: 'string', required: true }
    ],
    tone: 'neutral',
    tags: ['bar', 'dishonorable', '3.12c', 'complete']
  },
  
  // Healthcare eligibility analysis
  {
    id: 'ct-healthcare-combat',
    category: 'healthcare',
    title: 'Combat Veteran Healthcare Eligibility',
    template: 'Although a bar to compensation and pension benefits applies, the veteran is eligible for healthcare benefits under 38 CFR 3.360. The veteran served in combat operations in {location} and meets the criteria for enhanced healthcare eligibility.',
    parameters: [
      { name: 'location', type: 'string', required: true }
    ],
    tone: 'neutral',
    tags: ['healthcare', 'combat', '3.360', 'eligibility']
  },
  {
    id: 'ct-healthcare-denied',
    category: 'healthcare',
    title: 'Healthcare Eligibility Denied',
    template: 'Healthcare eligibility under Chapter 17 is not established. The nature of the misconduct and discharge characterization preclude healthcare benefits under current regulations.',
    parameters: [],
    tone: 'neutral',
    tags: ['healthcare', 'denied', 'ineligible']
  },
  
  // Decision statements
  {
    id: 'ct-decision-favorable',
    category: 'decision',
    title: 'Favorable Decision',
    template: 'For the period {startDate} to {endDate}, the service is characterized as {characterization} for VA purposes. The veteran is eligible for all applicable VA benefits.',
    parameters: [
      { name: 'startDate', type: 'date', required: true },
      { name: 'endDate', type: 'date', required: true },
      { name: 'characterization', type: 'select', required: true, options: ['honorable', 'under honorable conditions'] }
    ],
    tone: 'neutral',
    tags: ['decision', 'favorable', 'benefits']
  },
  {
    id: 'ct-decision-bar-healthcare',
    category: 'decision',
    title: 'Bar with Healthcare Exception',
    template: 'For the period {startDate} to {endDate}, the service constitutes a bar to compensation and pension benefits but not to healthcare benefits. The veteran is eligible for healthcare under Chapter 17.',
    parameters: [
      { name: 'startDate', type: 'date', required: true },
      { name: 'endDate', type: 'date', required: true }
    ],
    tone: 'neutral',
    tags: ['decision', 'bar', 'healthcare', 'partial']
  },
  {
    id: 'ct-decision-complete-bar',
    category: 'decision',
    title: 'Complete Benefits Bar',
    template: 'For the period {startDate} to {endDate}, the service constitutes a complete bar to all VA benefits under 38 CFR 3.12(c). No benefits are payable based on this period of service.',
    parameters: [
      { name: 'startDate', type: 'date', required: true },
      { name: 'endDate', type: 'date', required: true }
    ],
    tone: 'neutral',
    tags: ['decision', 'complete-bar', 'no-benefits']
  }
];

// Export utility functions
export const getDemoCaseById = (id: string): CODCase | undefined => {
  return demoCODCases.find(c => c.id === id);
};

export const getDemoEvidenceByCase = (caseId: string): EvidenceItem[] => {
  const caseData = getDemoCaseById(caseId);
  return caseData ? caseData.evidence : [];
};

export const getDemoClausesByCategory = (category: string): ClauseTemplate[] => {
  return enhancedClauseTemplates.filter(ct => ct.category === category);
};
