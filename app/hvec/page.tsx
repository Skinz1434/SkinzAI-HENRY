'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  User, 
  AlertTriangle, 
  AlertCircle,
  FileText, 
  Calendar, 
  TrendingUp, 
  Search,
  ChevronRight,
  BarChart3,
  Target,
  Clock,
  Database,
  Shield,
  Brain,
  Stethoscope,
  ClipboardCheck,
  LineChart,
  Info,
  Download,
  CheckCircle,
  Filter,
  RefreshCw,
  Heart,
  Microscope,
  Pill,
  ThermometerSun,
  Zap,
  BookOpen,
  Link2,
  MessageSquare,
  Share2,
  Printer,
  Mail,
  Sparkles,
  TrendingDown,
  AlertOctagon,
  Award,
  Beaker,
  BrainCircuit,
  HeartPulse,
  Layers,
  Network,
  Workflow,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  TestTube,
  ArrowRight,
  PlayCircle,
  PauseCircle,
  CheckSquare,
  XCircle,
  Copy,
  CheckCheck,
  Settings,
  HelpCircle,
  Lightbulb,
  GitBranch,
  ArrowUpRight,
  ArrowDownRight,
  Gauge
} from 'lucide-react';
import { mockFetchVeterans } from '../../lib/henry/mock-data';
import { Veteran } from '../../types';
import { generateVeteranDetails } from '../../lib/henry/veteran-details';
import { generateVeteranProfileEnhanced, VeteranProfileEnhanced } from '../../lib/henry/veteran-profile-enhanced';

// Clinical Assessment interfaces - works across all specialties
interface ClinicalAssessment {
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
}

interface DiagnosisHypothesis {
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

interface ClinicalRecommendation {
  category: 'diagnostic' | 'therapeutic' | 'monitoring' | 'referral';
  priority: 'immediate' | 'urgent' | 'routine';
  recommendation: string;
  rationale: string;
  evidenceLevel: 'A' | 'B' | 'C' | 'expert';
  references?: string[];
}

interface ServiceConnectionAnalysis {
  conditions: Array<{
    condition: string;
    connectionLikelihood: 'high' | 'moderate' | 'low' | 'unlikely';
    militaryExposures: string[];
    evidenceBasis: string[];
    dbqRecommendations: string[];
  }>;
}

// Common medical conditions with ICD-10 codes across specialties
const MEDICAL_CONDITIONS = {
  // Rheumatology
  'Rheumatoid Arthritis': { icd10: 'M06.9', criteria: 'ACR/EULAR 2010', specialty: 'rheumatology' },
  'Psoriatic Arthritis': { icd10: 'L40.5', criteria: 'CASPAR', specialty: 'rheumatology' },
  'Ankylosing Spondylitis': { icd10: 'M45.9', criteria: 'ASAS', specialty: 'rheumatology' },
  'Systemic Lupus Erythematosus': { icd10: 'M32.9', criteria: 'SLICC/ACR', specialty: 'rheumatology' },
  'Gout': { icd10: 'M10.9', criteria: 'ACR/EULAR 2015', specialty: 'rheumatology' },
  'Osteoarthritis': { icd10: 'M19.9', criteria: 'ACR', specialty: 'rheumatology' },
  'Fibromyalgia': { icd10: 'M79.7', criteria: 'ACR 2016', specialty: 'rheumatology' },
  'Polymyalgia Rheumatica': { icd10: 'M35.3', criteria: 'ACR/EULAR 2012', specialty: 'rheumatology' },
  // Cardiology
  'Coronary Artery Disease': { icd10: 'I25.1', criteria: 'ACC/AHA', specialty: 'cardiology' },
  'Heart Failure': { icd10: 'I50.9', criteria: 'NYHA/ACC', specialty: 'cardiology' },
  'Atrial Fibrillation': { icd10: 'I48.91', criteria: 'AHA/ACC/HRS', specialty: 'cardiology' },
  // Neurology
  'Traumatic Brain Injury': { icd10: 'S06.9', criteria: 'DoD/VA', specialty: 'neurology' },
  'Migraine': { icd10: 'G43.909', criteria: 'ICHD-3', specialty: 'neurology' },
  'Peripheral Neuropathy': { icd10: 'G62.9', criteria: 'AAN', specialty: 'neurology' },
  // Psychiatry
  'PTSD': { icd10: 'F43.10', criteria: 'DSM-5', specialty: 'psychiatry' },
  'Major Depression': { icd10: 'F32.9', criteria: 'DSM-5', specialty: 'psychiatry' },
  'Anxiety Disorder': { icd10: 'F41.9', criteria: 'DSM-5', specialty: 'psychiatry' },
  // Pulmonology
  'COPD': { icd10: 'J44.9', criteria: 'GOLD', specialty: 'pulmonology' },
  'Sleep Apnea': { icd10: 'G47.33', criteria: 'AASM', specialty: 'pulmonology' },
  'Asthma': { icd10: 'J45.909', criteria: 'GINA', specialty: 'pulmonology' }
};

const RHEUMATOLOGY_CONDITIONS = {
  'Rheumatoid Arthritis': { icd10: 'M06.9', criteria: 'ACR/EULAR 2010' },
  'Psoriatic Arthritis': { icd10: 'L40.5', criteria: 'CASPAR' },
  'Ankylosing Spondylitis': { icd10: 'M45.9', criteria: 'ASAS' },
  'Systemic Lupus Erythematosus': { icd10: 'M32.9', criteria: 'SLICC/ACR' },
  'Gout': { icd10: 'M10.9', criteria: 'ACR/EULAR 2015' },
  'Osteoarthritis': { icd10: 'M19.9', criteria: 'ACR' },
  'Fibromyalgia': { icd10: 'M79.7', criteria: 'ACR 2016' },
  'Polymyalgia Rheumatica': { icd10: 'M35.3', criteria: 'ACR/EULAR 2012' }
};

// Add chart component for visual analytics
const MiniChart = ({ data, color = 'blue', height = 60 }: { data: number[], color?: string, height?: number }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  return (
    <div className="relative" style={{ height: `${height}px` }}>
      <svg className="w-full h-full">
        <polyline
          fill="none"
          stroke={`currentColor`}
          strokeWidth="2"
          className={`text-${color}-500`}
          points={data.map((value, index) => 
            `${(index / (data.length - 1)) * 100},${height - ((value - min) / range) * height}`
          ).join(' ')}
        />
        {data.map((value, index) => (
          <circle
            key={index}
            cx={`${(index / (data.length - 1)) * 100}%`}
            cy={height - ((value - min) / range) * height}
            r="3"
            className={`fill-${color}-500`}
          />
        ))}
      </svg>
    </div>
  );
};

// Risk indicator component
const RiskIndicator = ({ level, label }: { level: 'low' | 'medium' | 'high' | 'critical', label: string }) => {
  const colors = {
    low: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    high: 'bg-orange-100 text-orange-800 border-orange-300',
    critical: 'bg-red-100 text-red-800 border-red-300'
  };
  
  const icons = {
    low: <TrendingDown className="w-4 h-4" />,
    medium: <TrendingUp className="w-4 h-4" />,
    high: <AlertTriangle className="w-4 h-4" />,
    critical: <AlertOctagon className="w-4 h-4" />
  };
  
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${colors[level]}`}>
      {icons[level]}
      <span className="text-sm font-medium">{label}</span>
      <span className="text-xs uppercase">{level}</span>
    </div>
  );
};

export default function HVECClinicalIntelligence() {
  const [selectedVeteran, setSelectedVeteran] = useState<Veteran | null>(null);
  const [veteranDetails, setVeteranDetails] = useState<VeteranProfileEnhanced | null>(null);
  const [activeTab, setActiveTab] = useState<'assessment' | 'history' | 'diagnostics' | 'documentation' | 'insights' | 'collaboration'>('assessment');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentAssessment, setCurrentAssessment] = useState<ClinicalAssessment | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [veterans, setVeterans] = useState<Veteran[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Load veterans data on mount
  useEffect(() => {
    const loadVeterans = async () => {
      setDataLoading(true);
      try {
        const result = await mockFetchVeterans(1, 500); // Load all 500 veterans
        setVeterans(result.data);
      } catch (error) {
        console.error('Failed to load veterans:', error);
      } finally {
        setDataLoading(false);
      }
    };
    loadVeterans();
  }, []);
  
  // Filter veterans based on search
  const filteredVeterans = useMemo(() => {
    if (!searchQuery) return veterans;
    const query = searchQuery.toLowerCase();
    return veterans.filter(v => 
      v.name.toLowerCase().includes(query) ||
      v.firstName?.toLowerCase().includes(query) ||
      v.lastName?.toLowerCase().includes(query) ||
      v.edipi?.includes(query) ||
      v.claims?.some(c => c.description?.toLowerCase().includes(query))
    );
  }, [veterans, searchQuery]);

  // Convert Veteran to format expected by other functions
  const convertVeteranFormat = (veteran: Veteran): any => {
    return {
      ...veteran,
      dob: veteran.dateOfBirth ? new Date(veteran.dateOfBirth).toLocaleDateString() : '',
      conditions: veteran.claims?.map(claim => ({
        name: claim.description || claim.type,
        rating: claim.rating || 0,
        serviceConnected: true,
        effectiveDate: claim.filingDate ? new Date(claim.filingDate).toLocaleDateString() : '',
        diagnosticCode: '',
        status: claim.status === 'APPROVED' ? 'active' : 'pending'
      })) || [],
      deployments: [],
      pendingClaims: veteran.claims?.filter(c => c.status === 'PENDING') || [],
      medications: [],
      appointments: [],
      surgeries: [],
      allergies: [],
      documents: [],
      flags: [],
      notes: []
    };
  };

  // Load veteran details when selected
  useEffect(() => {
    if (selectedVeteran) {
      setLoading(true);
      try {
        // Convert and generate enhanced profile
        const convertedVeteran = convertVeteranFormat(selectedVeteran);
        const details = generateVeteranDetails(convertedVeteran);
        const enhanced = generateVeteranProfileEnhanced(details);
        setVeteranDetails(enhanced);
        
        // Generate comprehensive clinical assessment
        generateClinicalAssessment(selectedVeteran);
        setLoading(false);
      } catch (error) {
        console.error('Error processing veteran:', error);
        setLoading(false);
      }
    }
  }, [selectedVeteran]);

  // Generate comprehensive clinical assessment based on veteran data
  const generateClinicalAssessment = (veteran: Veteran) => {
    // Determine primary specialty based on conditions
    const primarySpecialty = determinePrimarySpecialty(veteran);
    
    const assessment: ClinicalAssessment = {
      patientId: veteran.id,
      assessmentDate: new Date(),
      chiefComplaint: extractChiefComplaint(veteran),
      specialty: primarySpecialty,
      primarySymptoms: extractPrimarySymptoms(veteran),
      systemsReview: generateSystemsReview(veteran, primarySpecialty),
      inflammatoryMarkers: generateInflammatoryMarkers(veteran),
      differentialDiagnosis: generateDifferentialDiagnosis(veteran),
      clinicalDecisionSupport: generateClinicalRecommendations(veteran),
      serviceConnection: analyzeServiceConnection(veteran)
    };
    setCurrentAssessment(assessment);
  };

  // Helper functions for assessment generation
  // Helper function to determine primary specialty based on conditions
  const determinePrimarySpecialty = (veteran: Veteran): 'rheumatology' | 'cardiology' | 'neurology' | 'psychiatry' | 'pulmonology' | 'general' => {
    if (!veteran.claims || veteran.claims.length === 0) return 'general';
    
    // Count conditions by specialty
    const specialtyCounts: Record<string, number> = {};
    veteran.claims.forEach(claim => {
      const medCondition = Object.entries(MEDICAL_CONDITIONS).find(([name]) => 
        claim.description?.toLowerCase().includes(name.toLowerCase())
      );
      if (medCondition) {
        const specialty = medCondition[1].specialty;
        specialtyCounts[specialty] = (specialtyCounts[specialty] || 0) + 1;
      }
    });
    
    // Return most common specialty
    const sortedSpecialties = Object.entries(specialtyCounts).sort((a, b) => b[1] - a[1]);
    return (sortedSpecialties[0]?.[0] as any) || 'general';
  };
  
  // Extract primary symptoms from veteran data
  const extractPrimarySymptoms = (veteran: Veteran): string[] => {
    const symptoms: string[] = [];
    
    // Extract from claims
    if (veteran.claims) {
      veteran.claims.forEach(c => {
        if (c.description?.toLowerCase().includes('pain')) symptoms.push('Pain');
        if (c.description?.toLowerCase().includes('anxiety')) symptoms.push('Anxiety');
        if (c.description?.toLowerCase().includes('depression')) symptoms.push('Depression');
        if (c.description?.toLowerCase().includes('ptsd')) symptoms.push('PTSD symptoms');
        if (c.description?.toLowerCase().includes('tbi')) symptoms.push('Cognitive difficulties');
        if (c.description?.toLowerCase().includes('joint')) symptoms.push('Joint problems');
      });
    }
    
    return [...new Set(symptoms)]; // Remove duplicates
  };
  
  // Generate comprehensive systems review
  const generateSystemsReview = (veteran: Veteran, specialty: string) => {
    const review: any = {};
    
    // Add musculoskeletal review if relevant
    if (specialty === 'rheumatology' || veteran.claims?.some(c => 
      c.description?.toLowerCase().includes('joint') || c.description?.toLowerCase().includes('arthritis')
    )) {
      review.musculoskeletal = analyzeJointInvolvement(veteran);
    }
    
    // Add cardiovascular review if relevant
    if (specialty === 'cardiology' || veteran.claims?.some(c => 
      c.description?.toLowerCase().includes('heart') || c.description?.toLowerCase().includes('hypertension')
    )) {
      review.cardiovascular = {
        symptoms: ['chest pain', 'dyspnea', 'palpitations'],
        riskFactors: veteran.combatService ? ['combat stress', 'environmental exposures'] : ['standard']
      };
    }
    
    // Add neurological review if relevant
    if (specialty === 'neurology' || veteran.claims?.some(c => 
      c.description?.toLowerCase().includes('tbi') || c.description?.toLowerCase().includes('headache')
    )) {
      review.neurological = {
        symptoms: ['headaches', 'dizziness', 'memory issues'],
        deficits: []
      };
    }
    
    // Add psychiatric review if relevant
    if (specialty === 'psychiatry' || veteran.claims?.some(c => 
      c.description?.toLowerCase().includes('ptsd') || c.description?.toLowerCase().includes('depression')
    )) {
      review.psychiatric = {
        symptoms: ['mood changes', 'sleep disturbance', 'hypervigilance'],
        triggers: veteran.combatService ? ['combat-related'] : ['civilian']
      };
    }
    
    return review;
  };
  
  const extractChiefComplaint = (veteran: Veteran): string => {
    const musculoskeletalConditions = veteran.claims?.filter(c => 
      c.description?.toLowerCase().includes('joint') || 
      c.description?.toLowerCase().includes('arthritis') ||
      c.description?.toLowerCase().includes('pain')
    );
    return musculoskeletalConditions?.length > 0 
      ? musculoskeletalConditions[0].description 
      : 'Joint pain and stiffness';
  };

  const analyzeJointInvolvement = (veteran: Veteran): any => {
    // Simulate joint involvement analysis based on claims
    const hasMultipleJointConditions = veteran.claims?.filter(c => 
      c.description?.toLowerCase().includes('joint')
    ).length > 2;
    
    return {
      pattern: hasMultipleJointConditions ? 'polyarticular' as const : 'oligoarticular' as const,
      distribution: 'symmetric' as const,
      joints: ['knees', 'hands', 'shoulders'],
      duration: 'chronic (>6 months)'
    };
  };

  const generateInflammatoryMarkers = (veteran: Veteran) => {
    // Generate realistic inflammatory markers based on disability rating
    const severity = veteran.disabilityRating / 100;
    return {
      esr: Math.round(20 + severity * 40),
      crp: parseFloat((0.5 + severity * 4).toFixed(1)),
      rf: severity > 0.5 ? Math.round(20 + Math.random() * 100) : null,
      antiCCP: severity > 0.6 ? Math.round(50 + Math.random() * 150) : null,
      ana: severity > 0.4 ? '1:160 homogeneous' : 'negative'
    };
  };

  const generateDifferentialDiagnosis = (veteran: Veteran): DiagnosisHypothesis[] => {
    const diagnoses: DiagnosisHypothesis[] = [];
    
    // Generate differential based on conditions and service history
    if (veteran.combatService) {
      diagnoses.push({
        condition: 'Post-traumatic Arthritis',
        icd10: 'M12.5',
        probability: 0.75,
        supportingEvidence: [
          'Combat service history',
          'Multiple joint involvement',
          'Progressive symptoms'
        ],
        conflictingEvidence: [],
        diagnosticCriteria: {
          met: ['Joint pain', 'History of trauma', 'Radiographic changes'],
          notMet: [],
          pending: ['MRI findings']
        },
        recommendedTests: ['Joint X-rays', 'MRI of affected joints']
      });
    }

    // Add rheumatoid arthritis if multiple joints affected
    if (veteran.claims?.some(c => c.description?.toLowerCase().includes('multiple'))) {
      diagnoses.push({
        condition: 'Rheumatoid Arthritis',
        icd10: MEDICAL_CONDITIONS['Rheumatoid Arthritis'].icd10,
        probability: 0.65,
        supportingEvidence: [
          'Polyarticular involvement',
          'Symmetric distribution',
          'Morning stiffness'
        ],
        conflictingEvidence: ['RF negative (if applicable)'],
        diagnosticCriteria: {
          met: ['≥6 weeks symptoms', 'Joint swelling'],
          notMet: [],
          pending: ['Anti-CCP antibody', 'Hand X-rays']
        },
        recommendedTests: ['RF', 'Anti-CCP', 'ESR', 'CRP', 'Hand/feet X-rays']
      });
    }

    return diagnoses;
  };

  const generateClinicalRecommendations = (veteran: Veteran): ClinicalRecommendation[] => {
    const recommendations: ClinicalRecommendation[] = [];

    // Diagnostic recommendations
    recommendations.push({
      category: 'diagnostic',
      priority: 'urgent',
      recommendation: 'Complete rheumatologic panel including RF, anti-CCP, ANA, ESR, CRP',
      rationale: 'Baseline inflammatory markers needed for diagnosis and monitoring',
      evidenceLevel: 'A',
      references: ['ACR Guidelines 2021']
    });

    // Therapeutic recommendations based on severity
    if (veteran.disabilityRating > 50) {
      recommendations.push({
        category: 'therapeutic',
        priority: 'urgent',
        recommendation: 'Initiate DMARD therapy if inflammatory arthritis confirmed',
        rationale: 'Early DMARD therapy improves long-term outcomes',
        evidenceLevel: 'A',
        references: ['ACR RA Guidelines 2021', 'EULAR Recommendations 2022']
      });
    }

    // Monitoring recommendations
    recommendations.push({
      category: 'monitoring',
      priority: 'routine',
      recommendation: 'Establish baseline functional assessment (HAQ-DI)',
      rationale: 'Track disease activity and treatment response',
      evidenceLevel: 'B'
    });

    return recommendations;
  };

  const analyzeServiceConnection = (veteran: Veteran): ServiceConnectionAnalysis => {
    const analysis: ServiceConnectionAnalysis = {
      conditions: []
    };

    // Analyze each claim for service connection
    veteran.claims?.forEach(claim => {
      const militaryExposures: string[] = []; // Will be populated from deployment history when available
      analysis.conditions.push({
        condition: claim.description || claim.type,
        connectionLikelihood: claim.status === 'APPROVED' ? 'high' : 'moderate',
        militaryExposures: militaryExposures,
        evidenceBasis: [
          'In-service medical records',
          'Deployment history',
          'Current symptomatology'
        ],
        dbqRecommendations: [
          'Complete DBQ for joints',
          'Include range of motion measurements',
          'Document functional limitations'
        ]
      });
    });

    return analysis;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Professional Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Shield className="w-8 h-8 text-blue-600" />
                <Brain className="w-7 h-7 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  HVEC Clinical Intelligence System
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Multi-Specialty Clinical Decision Support - Powered by HENRY Protocol
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                <RefreshCw className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Patient Selection Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Patient Selection
              </h2>
              
              {/* Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Specialty Filter */}
              <div className="mb-4">
                <select 
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Specialties</option>
                  <option value="rheumatology">Rheumatology</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="neurology">Neurology</option>
                  <option value="psychiatry">Psychiatry</option>
                  <option value="pulmonology">Pulmonology</option>
                  <option value="general">General Medicine</option>
                </select>
              </div>

              {/* Patient List */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {dataLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
                    <span className="ml-2 text-gray-500">Loading veterans...</span>
                  </div>
                ) : filteredVeterans.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No veterans found
                  </div>
                ) : (
                  filteredVeterans.map(veteran => (
                  <button
                    key={veteran.id}
                    onClick={() => setSelectedVeteran(veteran)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedVeteran?.id === veteran.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-500'
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {veteran.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {veteran.branch} • {veteran.disabilityRating}%
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {veteran.claims?.length || 0} claims
                    </div>
                  </button>
                )))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {selectedVeteran ? (
              <>
                {/* Enhanced Patient Header with Visual Analytics */}
                <div className="bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {selectedVeteran.name}
                        </h2>
                        {veteranDetails && (
                          <RiskIndicator 
                            level={veteranDetails.analytics?.riskScores?.healthRisk || 'low'} 
                            label="Health Risk"
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            DOB: {selectedVeteran.dateOfBirth ? new Date(selectedVeteran.dateOfBirth).toLocaleDateString() : 'N/A'}
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            {selectedVeteran.branch} • {selectedVeteran.rank || 'N/A'}
                          </div>
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            Service: {selectedVeteran.serviceStartDate ? new Date(selectedVeteran.serviceStartDate).getFullYear() : 'N/A'}-{selectedVeteran.serviceEndDate ? new Date(selectedVeteran.serviceEndDate).getFullYear() : 'Present'}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <div className="flex items-center gap-2">
                            <HeartPulse className="w-4 h-4 text-red-500" />
                            Vitals: <span className="font-medium text-green-600">Stable</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Pill className="w-4 h-4 text-blue-500" />
                            Medications: <span className="font-medium">{veteranDetails?.mpd?.medications?.length || 0} Active</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Beaker className="w-4 h-4 text-purple-500" />
                            Labs: <span className="font-medium text-yellow-600">Review Needed</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          <Gauge className="w-3 h-3" />
                          {selectedVeteran.disabilityRating}% SC
                        </span>
                        {selectedVeteran.combatService && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            <Zap className="w-3 h-3" />
                            Combat Veteran
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <CheckCheck className="w-3 h-3" />
                          {selectedVeteran.claims?.filter(c => c.status === 'APPROVED').length || 0} Approved Claims
                        </span>
                      </div>
                    </div>
                    <div className="ml-6">
                      {/* Quick Stats Card */}
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="text-center mb-3">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Health Score</div>
                          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                            {veteranDetails?.analytics?.trends?.healthScores?.[veteranDetails.analytics.trends.healthScores.length - 1]?.score || 85}
                          </div>
                        </div>
                        <div className="w-32">
                          <MiniChart 
                            data={veteranDetails?.analytics?.trends?.healthScores?.map(s => s.score) || [75, 78, 82, 80, 85, 88]} 
                            color="green"
                            height={40}
                          />
                        </div>
                        <div className="mt-3 text-center">
                          <div className="text-xs text-gray-500 dark:text-gray-400">Last Visit</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">2 weeks ago</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
                  <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex -mb-px overflow-x-auto">
                      {[
                        { id: 'assessment', label: 'Clinical Assessment', icon: Stethoscope },
                        { id: 'history', label: 'Medical History', icon: Clock },
                        { id: 'diagnostics', label: 'Diagnostics & Labs', icon: BarChart3 },
                        { id: 'insights', label: 'AI Insights', icon: Sparkles },
                        { id: 'documentation', label: 'Documentation', icon: FileText },
                        { id: 'collaboration', label: 'Collaborate', icon: MessageSquare }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${
                            activeTab === tab.id
                              ? 'text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                              : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                          }`}
                        >
                          <tab.icon className="w-4 h-4" />
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="p-6">
                    {activeTab === 'assessment' && currentAssessment && (
                      <div className="space-y-6">
                        {/* Chief Complaint */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Chief Complaint
                          </h3>
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <p className="text-gray-700 dark:text-gray-300">
                              {currentAssessment.chiefComplaint}
                            </p>
                          </div>
                        </div>

                        {/* Specialty-Specific Assessment */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            {currentAssessment.specialty === 'rheumatology' ? 'Joint Involvement Analysis' :
                             currentAssessment.specialty === 'cardiology' ? 'Cardiovascular Assessment' :
                             currentAssessment.specialty === 'neurology' ? 'Neurological Evaluation' :
                             currentAssessment.specialty === 'psychiatry' ? 'Mental Health Assessment' :
                             'Systems Review'}
                          </h3>
                          
                          {/* Show specialty-specific data */}
                          {currentAssessment.systemsReview.musculoskeletal && (
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pattern</div>
                                <div className="font-medium text-gray-900 dark:text-white capitalize">
                                  {currentAssessment.systemsReview.musculoskeletal.pattern}
                                </div>
                              </div>
                              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Distribution</div>
                                <div className="font-medium text-gray-900 dark:text-white capitalize">
                                  {currentAssessment.systemsReview.musculoskeletal.distribution}
                                </div>
                              </div>
                              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Duration</div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {currentAssessment.systemsReview.musculoskeletal.duration}
                                </div>
                              </div>
                              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Affected Joints</div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {currentAssessment.systemsReview.musculoskeletal.joints.join(', ')}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Primary Symptoms for all specialties */}
                          {currentAssessment.primarySymptoms.length > 0 && (
                            <div className="mt-4">
                              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Primary Symptoms</div>
                              <div className="flex flex-wrap gap-2">
                                {currentAssessment.primarySymptoms.map((symptom, i) => (
                                  <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    {symptom}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Specialty Badge */}
                          <div className="mt-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                              {currentAssessment.specialty.toUpperCase()} FOCUS
                            </span>
                          </div>
                        </div>

                        {/* Differential Diagnosis */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Differential Diagnosis
                          </h3>
                          <div className="space-y-3">
                            {currentAssessment.differentialDiagnosis.map((diagnosis, idx) => (
                              <div key={idx} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                      {diagnosis.condition}
                                    </h4>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      ICD-10: {diagnosis.icd10}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Probability</div>
                                    <div className="font-semibold text-lg text-blue-600 dark:text-blue-400">
                                      {(diagnosis.probability * 100).toFixed(0)}%
                                    </div>
                                  </div>
                                </div>

                                {/* Evidence */}
                                <div className="grid grid-cols-2 gap-4 mb-3">
                                  <div>
                                    <div className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">
                                      Supporting Evidence
                                    </div>
                                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                      {diagnosis.supportingEvidence.map((evidence, i) => (
                                        <li key={i} className="flex items-start gap-1">
                                          <span className="text-green-500 mt-1">•</span>
                                          {evidence}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  {diagnosis.conflictingEvidence.length > 0 && (
                                    <div>
                                      <div className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">
                                        Conflicting Evidence
                                      </div>
                                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                        {diagnosis.conflictingEvidence.map((evidence, i) => (
                                          <li key={i} className="flex items-start gap-1">
                                            <span className="text-red-500 mt-1">•</span>
                                            {evidence}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>

                                {/* Recommended Tests */}
                                <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Recommended Tests
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {diagnosis.recommendedTests.map((test, i) => (
                                      <span key={i} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                        {test}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Clinical Recommendations */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Clinical Decision Support
                          </h3>
                          <div className="space-y-3">
                            {currentAssessment.clinicalDecisionSupport.map((rec, idx) => (
                              <div key={idx} className={`border rounded-lg p-4 ${
                                rec.priority === 'immediate' 
                                  ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20'
                                  : rec.priority === 'urgent'
                                  ? 'border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/20'
                                  : 'border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700'
                              }`}>
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                      rec.priority === 'immediate'
                                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                        : rec.priority === 'urgent'
                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                                    }`}>
                                      {rec.priority}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {rec.category}
                                    </span>
                                  </div>
                                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                    Evidence Level: {rec.evidenceLevel}
                                  </span>
                                </div>
                                <div className="font-medium text-gray-900 dark:text-white mb-1">
                                  {rec.recommendation}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                  <span className="font-medium">Rationale:</span> {rec.rationale}
                                </div>
                                {rec.references && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    References: {rec.references.join(', ')}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Service Connection Analysis */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            VA Service Connection Analysis
                          </h3>
                          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                            {currentAssessment.serviceConnection.conditions.map((sc, idx) => (
                              <div key={idx} className="mb-4 last:mb-0">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium text-gray-900 dark:text-white">
                                    {sc.condition}
                                  </h4>
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    sc.connectionLikelihood === 'high'
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                      : sc.connectionLikelihood === 'moderate'
                                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                                  }`}>
                                    {sc.connectionLikelihood} likelihood
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                                  <div>
                                    <span className="font-medium">Military Exposures:</span>{' '}
                                    {sc.militaryExposures.join(', ') || 'None documented'}
                                  </div>
                                  <div>
                                    <span className="font-medium">DBQ Recommendations:</span>
                                    <ul className="mt-1 ml-4">
                                      {sc.dbqRecommendations.map((rec, i) => (
                                        <li key={i} className="list-disc">{rec}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'history' && (
                      <div className="space-y-6">
                        {/* Conditions */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Claims & Conditions
                          </h3>
                          <div className="space-y-2">
                            {selectedVeteran.claims?.map((claim, idx) => (
                              <div key={idx} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="font-medium text-gray-900 dark:text-white">
                                      {claim.description}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                      Type: {claim.type} • Filed: {claim.filingDate ? new Date(claim.filingDate).toLocaleDateString() : 'N/A'}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold text-lg text-blue-600 dark:text-blue-400">
                                      {claim.rating || 0}%
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      {claim.status}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Medications */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Current Medications
                          </h3>
                          <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                            <table className="w-full">
                              <thead className="bg-gray-50 dark:bg-gray-600">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                    Medication
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                    Dosage
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                    Prescriber
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                                    Status
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                {(() => {
                                  const meds = veteranDetails?.mpd?.medications;
                                  if (meds && meds.length > 0) {
                                    return meds.map((med, idx) => (
                                  <tr key={idx}>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                      {med.name}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                      {med.dosage} - {med.frequency}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                      {med.prescribedBy}
                                    </td>
                                    <td className="px-4 py-3">
                                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                        med.status === 'Active'
                                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                          : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                                      }`}>
                                        {med.status}
                                      </span>
                                    </td>
                                  </tr>
                                ));
                                  } else {
                                    return (
                                      <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
                                          No medications recorded
                                        </td>
                                      </tr>
                                    );
                                  }
                                })()}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'diagnostics' && currentAssessment && (
                      <div className="space-y-6">
                        {/* Interactive Diagnostic Workflow */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 mb-6">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Workflow className="w-5 h-5" />
                            Interactive Diagnostic Workflow
                          </h3>
                          <div className="space-y-4">
                            {/* Step 1: Initial Assessment */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-blue-500">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                  <h4 className="font-medium text-gray-900 dark:text-white">Step 1: Initial Clinical Assessment</h4>
                                </div>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Completed</span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Review chief complaint, HPI, and military service history
                              </p>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                                  <span className="text-gray-500">Primary Symptom:</span>
                                  <span className="ml-2 font-medium">{currentAssessment.chiefComplaint}</span>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                                  <span className="text-gray-500">Duration:</span>
                                  <span className="ml-2 font-medium">6 months</span>
                                </div>
                              </div>
                            </div>

                            {/* Step 2: Laboratory Orders */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-yellow-500">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <PlayCircle className="w-5 h-5 text-yellow-500 animate-pulse" />
                                  <h4 className="font-medium text-gray-900 dark:text-white">Step 2: Laboratory Workup</h4>
                                </div>
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">In Progress</span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                Order appropriate laboratory tests based on clinical presentation
                              </p>
                              <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm">
                                  <input type="checkbox" checked className="rounded text-blue-600" readOnly />
                                  <span>CBC with differential</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                  <input type="checkbox" checked className="rounded text-blue-600" readOnly />
                                  <span>ESR, CRP</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                  <input type="checkbox" checked className="rounded text-blue-600" readOnly />
                                  <span>RF, Anti-CCP antibodies</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                  <input type="checkbox" className="rounded text-blue-600" />
                                  <span>ANA with reflex panel</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                  <input type="checkbox" className="rounded text-blue-600" />
                                  <span>HLA-B27 (if indicated)</span>
                                </label>
                              </div>
                              <button className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm">
                                Order Selected Tests
                              </button>
                            </div>

                            {/* Step 3: Imaging Studies */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-gray-400">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <PauseCircle className="w-5 h-5 text-gray-400" />
                                  <h4 className="font-medium text-gray-900 dark:text-white">Step 3: Imaging Studies</h4>
                                </div>
                                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Pending</span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Order imaging based on laboratory results and clinical findings
                              </p>
                              <div className="opacity-50 space-y-2">
                                <label className="flex items-center gap-2 text-sm">
                                  <input type="checkbox" disabled className="rounded text-gray-400" />
                                  <span>X-ray affected joints</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                  <input type="checkbox" disabled className="rounded text-gray-400" />
                                  <span>MRI if early inflammatory arthritis suspected</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                  <input type="checkbox" disabled className="rounded text-gray-400" />
                                  <span>Ultrasound for synovitis</span>
                                </label>
                              </div>
                            </div>

                            {/* Step 4: Diagnosis & Treatment */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-gray-400">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-5 h-5 text-gray-400" />
                                  <h4 className="font-medium text-gray-900 dark:text-white">Step 4: Diagnosis & Treatment Plan</h4>
                                </div>
                                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Not Started</span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Formulate diagnosis and initiate evidence-based treatment
                              </p>
                            </div>
                          </div>
                          
                          {/* Workflow Actions */}
                          <div className="mt-4 flex gap-3">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                              <PlayCircle className="w-4 h-4" />
                              Continue Workflow
                            </button>
                            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors">
                              Save Progress
                            </button>
                            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors">
                              Export Workflow
                            </button>
                          </div>
                        </div>

                        {/* Inflammatory Markers */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Laboratory Results - Inflammatory Markers
                          </h3>
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">ESR</div>
                              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {currentAssessment.inflammatoryMarkers.esr || '--'}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">mm/hr (0-20)</div>
                            </div>
                            <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">CRP</div>
                              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {currentAssessment.inflammatoryMarkers.crp || '--'}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">mg/L (&lt;3.0)</div>
                            </div>
                            <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">RF</div>
                              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {currentAssessment.inflammatoryMarkers.rf || 'Negative'}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">IU/mL (&lt;14)</div>
                            </div>
                            <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Anti-CCP</div>
                              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                {currentAssessment.inflammatoryMarkers.antiCCP || 'Pending'}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">U/mL (&lt;20)</div>
                            </div>
                            <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">ANA</div>
                              <div className="text-xl font-bold text-gray-900 dark:text-white">
                                {currentAssessment.inflammatoryMarkers.ana || 'Negative'}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">Titer</div>
                            </div>
                          </div>
                        </div>

                        {/* Diagnostic Criteria Checklist */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Classification Criteria Assessment
                          </h3>
                          <div className="space-y-4">
                            {Object.entries(RHEUMATOLOGY_CONDITIONS).slice(0, 3).map(([condition, info]) => (
                              <div key={condition} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-medium text-gray-900 dark:text-white">
                                    {condition} ({info.criteria})
                                  </h4>
                                  <ClipboardCheck className="w-5 h-5 text-gray-400" />
                                </div>
                                <div className="space-y-2">
                                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                    <input type="checkbox" className="rounded text-blue-600" />
                                    Morning stiffness &gt;30 minutes
                                  </label>
                                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                    <input type="checkbox" className="rounded text-blue-600" />
                                    Symmetric joint involvement
                                  </label>
                                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                    <input type="checkbox" className="rounded text-blue-600" />
                                    Positive serology (RF or anti-CCP)
                                  </label>
                                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                    <input type="checkbox" className="rounded text-blue-600" />
                                    Elevated acute phase reactants
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'documentation' && (
                      <div className="space-y-6">
                        {/* Documentation Template Selector */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              Clinical Documentation Templates
                            </h3>
                            <select className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm border border-gray-300 dark:border-gray-600">
                              <option value="consult">Consultation Note</option>
                              <option value="progress">Progress Note</option>
                              <option value="c&p">C&P Examination</option>
                              <option value="dbq">VA DBQ</option>
                              <option value="nexus">Nexus Letter</option>
                              <option value="discharge">Discharge Summary</option>
                            </select>
                          </div>
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-4">
                            <div className="flex items-start gap-3">
                              <Info className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                                AI-generated documentation based on assessment data. Review and edit before finalizing.
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                              Rheumatology Consultation Note
                            </h4>
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              <p className="text-gray-700 dark:text-gray-300">
                                <strong>Chief Complaint:</strong> {currentAssessment?.chiefComplaint}
                              </p>
                              <p className="text-gray-700 dark:text-gray-300">
                                <strong>History of Present Illness:</strong> {selectedVeteran.name} is a {selectedVeteran.branch} veteran with 
                                a {selectedVeteran.disabilityRating}% service-connected disability presenting with {currentAssessment?.chiefComplaint}. 
                                Current specialty focus: {currentAssessment?.specialty}. Primary symptoms include: {currentAssessment?.primarySymptoms.join(', ')}.
                              </p>
                              <p className="text-gray-700 dark:text-gray-300">
                                <strong>Military History:</strong> Served from {selectedVeteran.serviceStartDate ? new Date(selectedVeteran.serviceStartDate).getFullYear() : 'N/A'} to {selectedVeteran.serviceEndDate ? new Date(selectedVeteran.serviceEndDate).getFullYear() : 'Present'} with {selectedVeteran.combatService ? 'combat' : 'non-combat'} service. 
                                Deployment history includes potential exposure to {selectedVeteran.deployments?.flatMap(d => d.exposures).join(', ') || 'standard military environments'}.
                              </p>
                              <p className="text-gray-700 dark:text-gray-300">
                                <strong>Assessment and Plan:</strong> Based on clinical presentation and laboratory findings, the differential diagnosis 
                                includes {currentAssessment?.differentialDiagnosis.map(d => d.condition).join(', ')}. Recommend proceeding with 
                                diagnostic workup including {currentAssessment?.differentialDiagnosis[0]?.recommendedTests.join(', ')}.
                              </p>
                              <p className="text-gray-700 dark:text-gray-300">
                                <strong>Service Connection Opinion:</strong> Based on review of service treatment records and current clinical findings, 
                                there is {currentAssessment?.serviceConnection.conditions[0]?.connectionLikelihood} likelihood of service connection 
                                for the veteran's rheumatologic conditions.
                              </p>
                            </div>
                            <div className="mt-4 flex gap-3">
                              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Save to EHR
                              </button>
                              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors">
                                Export as PDF
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Medical Reference Links */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Medical Guidelines & References
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                              <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
                                <ExternalLink className="w-4 h-4" />
                                ACR Guidelines
                              </h4>
                              <div className="space-y-2">
                                <a href="#" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                  • Rheumatoid Arthritis Management 2021
                                </a>
                                <a href="#" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                  • Lupus Nephritis Guidelines
                                </a>
                                <a href="#" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                  • Vasculitis Treatment Protocol
                                </a>
                                <a href="#" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                  • Osteoarthritis Clinical Practice
                                </a>
                              </div>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                              <h4 className="font-medium text-green-900 dark:text-green-200 mb-3 flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                VA Clinical Resources
                              </h4>
                              <div className="space-y-2">
                                <a href="#" className="block text-sm text-green-600 dark:text-green-400 hover:underline">
                                  • VA/DoD Clinical Practice Guidelines
                                </a>
                                <a href="#" className="block text-sm text-green-600 dark:text-green-400 hover:underline">
                                  • VASRD Rating Schedule
                                </a>
                                <a href="#" className="block text-sm text-green-600 dark:text-green-400 hover:underline">
                                  • M21-1 Adjudication Manual
                                </a>
                                <a href="#" className="block text-sm text-green-600 dark:text-green-400 hover:underline">
                                  • BVA Decision Database
                                </a>
                              </div>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4">
                              <h4 className="font-medium text-purple-900 dark:text-purple-200 mb-3 flex items-center gap-2">
                                <TestTube className="w-4 h-4" />
                                Diagnostic Tools
                              </h4>
                              <div className="space-y-2">
                                <a href="#" className="block text-sm text-purple-600 dark:text-purple-400 hover:underline">
                                  • DAS28 Calculator
                                </a>
                                <a href="#" className="block text-sm text-purple-600 dark:text-purple-400 hover:underline">
                                  • SLEDAI-2K Score
                                </a>
                                <a href="#" className="block text-sm text-purple-600 dark:text-purple-400 hover:underline">
                                  • ACR/EULAR Criteria
                                </a>
                                <a href="#" className="block text-sm text-purple-600 dark:text-purple-400 hover:underline">
                                  • HAQ-DI Assessment
                                </a>
                              </div>
                            </div>
                            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-4">
                              <h4 className="font-medium text-orange-900 dark:text-orange-200 mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Medical Literature
                              </h4>
                              <div className="space-y-2">
                                <a href="#" className="block text-sm text-orange-600 dark:text-orange-400 hover:underline">
                                  • PubMed Central
                                </a>
                                <a href="#" className="block text-sm text-orange-600 dark:text-orange-400 hover:underline">
                                  • UpToDate
                                </a>
                                <a href="#" className="block text-sm text-orange-600 dark:text-orange-400 hover:underline">
                                  • Cochrane Reviews
                                </a>
                                <a href="#" className="block text-sm text-orange-600 dark:text-orange-400 hover:underline">
                                  • NEJM Journal Watch
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* DBQ Assistant */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            VA DBQ Completion Assistant
                          </h3>
                          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                              Joint Conditions DBQ Checklist
                            </h4>
                            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Diagnosis confirmed with ICD-10 code
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Range of motion measurements documented
                              </div>
                              <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-yellow-500" />
                                Functional impact assessment pending
                              </div>
                              <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-yellow-500" />
                                Flare-up frequency and severity to be documented
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* AI Insights Tab */}
                    {activeTab === 'insights' && (
                      <div className="space-y-6">
                        {/* AI-Powered Analysis */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                              <BrainCircuit className="w-5 h-5 text-purple-600" />
                              AI-Powered Clinical Analysis
                            </h3>
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors">
                              <RefreshCw className="w-4 h-4" />
                              Regenerate Insights
                            </button>
                          </div>
                          
                          {/* Predictive Analytics Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">Disease Progression</span>
                                <TrendingUp className="w-4 h-4 text-blue-600" />
                              </div>
                              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">85%</div>
                              <div className="text-xs text-blue-600 dark:text-blue-400">Likely stable in 6 months</div>
                              <div className="mt-2">
                                <MiniChart data={[70, 75, 73, 78, 82, 85]} color="blue" height={30} />
                              </div>
                            </div>
                            
                            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-green-700 dark:text-green-300 font-medium">Treatment Response</span>
                                <Heart className="w-4 h-4 text-green-600" />
                              </div>
                              <div className="text-2xl font-bold text-green-900 dark:text-green-100">92%</div>
                              <div className="text-xs text-green-600 dark:text-green-400">Positive medication response</div>
                              <div className="mt-2">
                                <MiniChart data={[60, 68, 75, 82, 88, 92]} color="green" height={30} />
                              </div>
                            </div>
                            
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">Risk Score</span>
                                <Shield className="w-4 h-4 text-purple-600" />
                              </div>
                              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">Low</div>
                              <div className="text-xs text-purple-600 dark:text-purple-400">2.3 composite score</div>
                              <div className="mt-2">
                                <MiniChart data={[4.5, 3.8, 3.2, 2.8, 2.5, 2.3]} color="purple" height={30} />
                              </div>
                            </div>
                          </div>
                          
                          {/* Pattern Recognition */}
                          <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6">
                            <div className="flex items-start gap-3">
                              <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">Pattern Recognition Alert</h4>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                  Patient's symptom constellation matches 87% with early-stage inflammatory arthritis pattern observed in 
                                  234 similar veterans. Consider anti-CCP antibody testing and baseline hand/feet X-rays.
                                </p>
                                <div className="mt-2 flex gap-2">
                                  <button className="text-xs text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100 underline">
                                    View Similar Cases
                                  </button>
                                  <span className="text-yellow-400">•</span>
                                  <button className="text-xs text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100 underline">
                                    Review Evidence
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* AI Recommendations */}
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-purple-500" />
                              AI-Generated Recommendations
                            </h4>
                            <div className="space-y-3">
                              <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded">
                                  <Microscope className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm text-gray-900 dark:text-white">Order Genetic Marker Panel</div>
                                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                    HLA-B27 testing recommended based on symptom pattern and family history
                                  </div>
                                </div>
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded">
                                  High Priority
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Collaboration Tab */}
                    {activeTab === 'collaboration' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Network className="w-5 h-5 text-indigo-600" />
                            Clinical Collaboration Network
                          </h3>
                          
                          {/* Quick Actions */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <button className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
                              <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                                <Share2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                              </div>
                              <div className="text-left">
                                <div className="font-medium text-sm text-gray-900 dark:text-white">Share Case</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Request second opinion</div>
                              </div>
                            </button>
                            
                            <button className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 transition-colors">
                              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
                              </div>
                              <div className="text-left">
                                <div className="font-medium text-sm text-gray-900 dark:text-white">Consult Specialist</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Connect with experts</div>
                              </div>
                            </button>
                            
                            <button className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="text-left">
                                <div className="font-medium text-sm text-gray-900 dark:text-white">Send to Provider</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Email summary</div>
                              </div>
                            </button>
                          </div>
                          
                          {/* Export Options */}
                          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                            <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-3">Export & Share Options</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <button className="flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <Download className="w-4 h-4" />
                                <span className="text-sm">PDF Report</span>
                              </button>
                              <button className="flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <Printer className="w-4 h-4" />
                                <span className="text-sm">Print</span>
                              </button>
                              <button className="flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <Copy className="w-4 h-4" />
                                <span className="text-sm">Copy Link</span>
                              </button>
                              <button className="flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm">Email</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
                <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Select a Patient to Begin
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Choose a patient from the list to access their rheumatology assessment and clinical decision support tools.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}