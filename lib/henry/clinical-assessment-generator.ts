import { Veteran } from '../../types';

export interface ClinicalAssessment {
  patientId: string;
  assessmentDate: Date;
  chiefComplaint: string;
  specialty: 'rheumatology' | 'cardiology' | 'neurology' | 'psychiatry' | 'pulmonology' | 'general';
  primarySymptoms: string[];
  systemsReview: {
    musculoskeletal?: {
      pattern: 'monoarticular' | 'oligoarticular' | 'polyarticular';
      distribution: 'symmetric' | 'asymmetric';
      joints: string[];
      duration: string;
    };
    cardiovascular?: {
      symptoms: string[];
      riskFactors: string[];
    };
    neurological?: {
      symptoms: string[];
      deficits: string[];
    };
    psychiatric?: {
      symptoms: string[];
      triggers: string[];
    };
  };
  inflammatoryMarkers: {
    esr: number | null;
    crp: number | null;
    rf: number | null;
    antiCCP: number | null;
    ana: string | null;
  };
  differentialDiagnosis: DiagnosisHypothesis[];
  clinicalDecisionSupport: ClinicalRecommendation[];
  serviceConnection: ServiceConnectionAnalysis;
  jointInvolvement?: {
    pattern: string;
    distribution: string;
    duration: string;
    joints: string[];
  };
}

export interface DiagnosisHypothesis {
  condition: string;
  icd10: string;
  probability: number;
  supportingEvidence: string[];
  conflictingEvidence: string[];
  diagnosticCriteria: {
    met: string[];
    notMet: string[];
    pending: string[];
  };
  recommendedTests: string[];
}

export interface ClinicalRecommendation {
  category: 'diagnostic' | 'therapeutic' | 'monitoring' | 'referral';
  priority: 'immediate' | 'urgent' | 'routine';
  recommendation: string;
  rationale: string;
  evidenceLevel: 'A' | 'B' | 'C' | 'expert';
  references?: string[];
}

export interface ServiceConnectionAnalysis {
  conditions: Array<{
    condition: string;
    connectionLikelihood: 'high' | 'moderate' | 'low' | 'unlikely';
    militaryExposures: string[];
    evidenceBasis: string[];
    dbqRecommendations: string[];
  }>;
}

const CHIEF_COMPLAINTS = [
  'Joint pain and morning stiffness lasting over 30 minutes',
  'Bilateral knee pain with activity limitation',
  'Lower back pain radiating to legs',
  'Chronic fatigue and joint swelling',
  'Progressive joint deformity and functional limitation',
  'Muscle weakness and elevated inflammatory markers',
  'Recurring joint inflammation with systemic symptoms',
  'Post-traumatic arthritis following service injury'
];

const JOINT_PATTERNS = [
  { joints: ['hands', 'wrists'], pattern: 'polyarticular', distribution: 'symmetric' },
  { joints: ['knees'], pattern: 'oligoarticular', distribution: 'asymmetric' },
  { joints: ['spine', 'sacroiliac'], pattern: 'axial', distribution: 'symmetric' },
  { joints: ['shoulder', 'hip', 'knee'], pattern: 'oligoarticular', distribution: 'asymmetric' },
  { joints: ['MCP', 'PIP', 'wrists'], pattern: 'polyarticular', distribution: 'symmetric' }
];

const SYMPTOMS_BY_RATING = {
  low: ['mild pain', 'occasional stiffness', 'minimal swelling'],
  medium: ['moderate pain', 'morning stiffness', 'visible swelling', 'fatigue'],
  high: ['severe pain', 'prolonged stiffness', 'joint deformity', 'systemic symptoms', 'functional limitation']
};

export function generateClinicalAssessment(veteran: Veteran): ClinicalAssessment {
  const rating = veteran.disabilityRating || 0;
  const severity = rating >= 70 ? 'high' : rating >= 40 ? 'medium' : 'low';
  const jointPattern = JOINT_PATTERNS[Math.floor(Math.random() * JOINT_PATTERNS.length)];
  
  // Generate realistic inflammatory markers based on severity
  const generateMarkers = () => {
    if (severity === 'high') {
      return {
        esr: Math.floor(Math.random() * 40) + 30, // 30-70
        crp: Math.floor(Math.random() * 20) + 10, // 10-30
        rf: Math.random() > 0.3 ? Math.floor(Math.random() * 100) + 50 : null,
        antiCCP: Math.random() > 0.4 ? Math.floor(Math.random() * 200) + 100 : null,
        ana: Math.random() > 0.5 ? '1:160' : null
      };
    } else if (severity === 'medium') {
      return {
        esr: Math.floor(Math.random() * 30) + 15, // 15-45
        crp: Math.floor(Math.random() * 15) + 5, // 5-20
        rf: Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 20 : null,
        antiCCP: Math.random() > 0.6 ? Math.floor(Math.random() * 100) + 50 : null,
        ana: Math.random() > 0.7 ? '1:80' : null
      };
    } else {
      return {
        esr: Math.floor(Math.random() * 20) + 5, // 5-25
        crp: Math.floor(Math.random() * 10), // 0-10
        rf: Math.random() > 0.7 ? Math.floor(Math.random() * 30) : null,
        antiCCP: Math.random() > 0.8 ? Math.floor(Math.random() * 50) : null,
        ana: null
      };
    }
  };

  // Generate differential diagnosis based on veteran's conditions
  const generateDifferentialDiagnosis = (): DiagnosisHypothesis[] => {
    const conditions = veteran.claims?.map(c => c.description || c.type) || [];
    const diagnoses: DiagnosisHypothesis[] = [];

    if (conditions.some(c => c.toLowerCase().includes('joint') || c.toLowerCase().includes('arthritis'))) {
      diagnoses.push({
        condition: 'Rheumatoid Arthritis',
        icd10: 'M06.9',
        probability: severity === 'high' ? 0.75 : 0.45,
        supportingEvidence: [
          'Morning stiffness > 30 minutes',
          'Symmetric joint involvement',
          'Elevated inflammatory markers'
        ],
        conflictingEvidence: severity === 'low' ? ['Negative RF and anti-CCP'] : [],
        diagnosticCriteria: {
          met: ['Joint involvement', 'Symptom duration > 6 weeks'],
          notMet: severity === 'low' ? ['Serology'] : [],
          pending: ['Imaging studies']
        },
        recommendedTests: ['Hand/feet X-rays', 'Ultrasound of affected joints', 'Complete metabolic panel']
      });
    }

    if (veteran.combatService) {
      diagnoses.push({
        condition: 'Post-Traumatic Arthritis',
        icd10: 'M19.17',
        probability: 0.65,
        supportingEvidence: [
          'History of combat-related trauma',
          'Progressive joint degeneration',
          'Service connection established'
        ],
        conflictingEvidence: [],
        diagnosticCriteria: {
          met: ['Trauma history', 'Radiographic changes'],
          notMet: [],
          pending: ['MRI for soft tissue evaluation']
        },
        recommendedTests: ['Weight-bearing X-rays', 'MRI of affected joints']
      });
    }

    diagnoses.push({
      condition: 'Osteoarthritis',
      icd10: 'M19.90',
      probability: rating >= 50 ? 0.55 : 0.35,
      supportingEvidence: [
        'Age-appropriate degenerative changes',
        'Mechanical symptoms',
        'Crepitus on examination'
      ],
      conflictingEvidence: ['Elevated inflammatory markers'],
      diagnosticCriteria: {
        met: ['Clinical symptoms', 'Age > 50'],
        notMet: [],
        pending: ['Radiographic confirmation']
      },
      recommendedTests: ['Standing AP and lateral X-rays']
    });

    return diagnoses;
  };

  // Generate clinical recommendations
  const generateRecommendations = (): ClinicalRecommendation[] => {
    const recs: ClinicalRecommendation[] = [];

    if (severity === 'high') {
      recs.push({
        category: 'therapeutic',
        priority: 'immediate',
        recommendation: 'Initiate DMARD therapy',
        rationale: 'High disease activity with evidence of joint damage',
        evidenceLevel: 'A',
        references: ['ACR 2021 Guideline for RA Treatment']
      });
    }

    recs.push({
      category: 'diagnostic',
      priority: severity === 'high' ? 'urgent' : 'routine',
      recommendation: 'Complete rheumatologic panel including ANA with reflex',
      rationale: 'Establish baseline and screen for connective tissue disease',
      evidenceLevel: 'B'
    });

    if (veteran.combatService) {
      recs.push({
        category: 'referral',
        priority: 'routine',
        recommendation: 'VA Compensation & Pension examination',
        rationale: 'Document service connection for musculoskeletal conditions',
        evidenceLevel: 'expert'
      });
    }

    recs.push({
      category: 'monitoring',
      priority: 'routine',
      recommendation: 'Quarterly disease activity assessment using validated tools',
      rationale: 'Track treatment response and adjust therapy',
      evidenceLevel: 'A'
    });

    return recs;
  };

  // Generate service connection analysis
  const generateServiceConnection = (): ServiceConnectionAnalysis => {
    const conditions = [];

    if (veteran.claims?.some(c => c.description?.toLowerCase().includes('arthritis'))) {
      conditions.push({
        condition: 'Inflammatory Arthritis',
        connectionLikelihood: (veteran.combatService ? 'high' : 'moderate') as 'high' | 'moderate' | 'low' | 'unlikely',
        militaryExposures: [
          'Repetitive trauma from military duties',
          'Environmental exposures in deployment',
          'Physical training injuries'
        ],
        evidenceBasis: [
          'Service treatment records',
          'Deployment history',
          'Current symptom continuity'
        ],
        dbqRecommendations: [
          'Complete Joint Conditions DBQ',
          'Document range of motion limitations',
          'Include flare frequency and severity'
        ]
      });
    }

    return { conditions };
  };

  return {
    patientId: veteran.id,
    assessmentDate: new Date(),
    chiefComplaint: CHIEF_COMPLAINTS[Math.floor(Math.random() * CHIEF_COMPLAINTS.length)],
    specialty: 'rheumatology',
    primarySymptoms: SYMPTOMS_BY_RATING[severity],
    systemsReview: {
      musculoskeletal: {
        pattern: jointPattern.pattern as any,
        distribution: jointPattern.distribution as 'symmetric' | 'asymmetric',
        joints: jointPattern.joints,
        duration: severity === 'high' ? '> 6 months' : '3-6 months'
      }
    },
    inflammatoryMarkers: generateMarkers(),
    differentialDiagnosis: generateDifferentialDiagnosis(),
    clinicalDecisionSupport: generateRecommendations(),
    serviceConnection: generateServiceConnection(),
    jointInvolvement: {
      pattern: jointPattern.pattern,
      distribution: jointPattern.distribution,
      duration: severity === 'high' ? '> 6 months' : '3-6 months',
      joints: jointPattern.joints
    }
  };
}