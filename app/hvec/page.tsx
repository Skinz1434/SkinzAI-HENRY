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
  RefreshCw
} from 'lucide-react';
import { veteranDataService, VeteranProfile } from '../../lib/henry/veteran-data-service';
import { generateVeteranDetails } from '../../lib/henry/veteran-details';
import { generateVeteranProfileEnhanced, VeteranProfileEnhanced } from '../../lib/henry/veteran-profile-enhanced';

// Rheumatology-specific interfaces
interface RheumatologyAssessment {
  patientId: string;
  assessmentDate: Date;
  chiefComplaint: string;
  jointInvolvement: {
    pattern: 'monoarticular' | 'oligoarticular' | 'polyarticular';
    distribution: 'symmetric' | 'asymmetric';
    joints: string[];
    duration: string;
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

// Common rheumatologic conditions with ICD-10 codes
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

export default function HVECRheumatologyDashboard() {
  const [selectedVeteran, setSelectedVeteran] = useState<VeteranProfile | null>(null);
  const [veteranDetails, setVeteranDetails] = useState<VeteranProfileEnhanced | null>(null);
  const [activeTab, setActiveTab] = useState<'assessment' | 'history' | 'diagnostics' | 'documentation'>('assessment');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentAssessment, setCurrentAssessment] = useState<RheumatologyAssessment | null>(null);

  // Get all veterans from the service
  const veterans = veteranDataService.getAllVeterans();
  
  // Filter veterans based on search
  const filteredVeterans = useMemo(() => {
    if (!searchQuery) return veterans;
    const query = searchQuery.toLowerCase();
    return veterans.filter(v => 
      v.name.toLowerCase().includes(query) ||
      v.conditions?.some(c => c.name.toLowerCase().includes(query))
    );
  }, [veterans, searchQuery]);

  // Load veteran details when selected
  useEffect(() => {
    if (selectedVeteran) {
      setLoading(true);
      // Generate enhanced profile with additional details
      const details = generateVeteranDetails(selectedVeteran);
      const enhanced = generateVeteranProfileEnhanced(details);
      setVeteranDetails(enhanced);
      
      // Generate rheumatology-specific assessment
      generateRheumatologyAssessment(selectedVeteran);
      setLoading(false);
    }
  }, [selectedVeteran]);

  // Generate rheumatology assessment based on veteran data
  const generateRheumatologyAssessment = (veteran: VeteranProfile) => {
    const assessment: RheumatologyAssessment = {
      patientId: veteran.id,
      assessmentDate: new Date(),
      chiefComplaint: extractChiefComplaint(veteran),
      jointInvolvement: analyzeJointInvolvement(veteran),
      inflammatoryMarkers: generateInflammatoryMarkers(veteran),
      differentialDiagnosis: generateDifferentialDiagnosis(veteran),
      clinicalDecisionSupport: generateClinicalRecommendations(veteran),
      serviceConnection: analyzeServiceConnection(veteran)
    };
    setCurrentAssessment(assessment);
  };

  // Helper functions for assessment generation
  const extractChiefComplaint = (veteran: VeteranProfile): string => {
    const musculoskeletalConditions = veteran.conditions?.filter(c => 
      c.name.toLowerCase().includes('joint') || 
      c.name.toLowerCase().includes('arthritis') ||
      c.name.toLowerCase().includes('pain')
    );
    return musculoskeletalConditions?.length > 0 
      ? musculoskeletalConditions[0].name 
      : 'Joint pain and stiffness';
  };

  const analyzeJointInvolvement = (veteran: VeteranProfile) => {
    // Simulate joint involvement analysis based on conditions
    const hasMultipleJointConditions = veteran.conditions?.filter(c => 
      c.name.toLowerCase().includes('joint')
    ).length > 2;
    
    return {
      pattern: hasMultipleJointConditions ? 'polyarticular' as const : 'oligoarticular' as const,
      distribution: 'symmetric' as const,
      joints: ['knees', 'hands', 'shoulders'],
      duration: 'chronic (>6 months)'
    };
  };

  const generateInflammatoryMarkers = (veteran: VeteranProfile) => {
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

  const generateDifferentialDiagnosis = (veteran: VeteranProfile): DiagnosisHypothesis[] => {
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
    if (veteran.conditions?.some(c => c.name.toLowerCase().includes('multiple'))) {
      diagnoses.push({
        condition: 'Rheumatoid Arthritis',
        icd10: RHEUMATOLOGY_CONDITIONS['Rheumatoid Arthritis'].icd10,
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

  const generateClinicalRecommendations = (veteran: VeteranProfile): ClinicalRecommendation[] => {
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

  const analyzeServiceConnection = (veteran: VeteranProfile): ServiceConnectionAnalysis => {
    const analysis: ServiceConnectionAnalysis = {
      conditions: []
    };

    // Analyze each condition for service connection
    veteran.conditions?.forEach(condition => {
      const exposures = veteran.deployments?.flatMap(d => d.exposures) || [];
      analysis.conditions.push({
        condition: condition.name,
        connectionLikelihood: condition.serviceConnected ? 'high' : 'moderate',
        militaryExposures: exposures,
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
                  HVEC Rheumatology Clinical Decision Support
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  HENRY Vector Enhancement Component - Physician Portal
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
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Patient List */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredVeterans.map(veteran => (
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
                      {veteran.conditions?.length || 0} conditions
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {selectedVeteran ? (
              <>
                {/* Patient Header */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedVeteran.name}
                      </h2>
                      <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <div>DOB: {selectedVeteran.dob} • {selectedVeteran.gender}</div>
                        <div>{selectedVeteran.branch} • {selectedVeteran.rank} • {selectedVeteran.serviceYears}</div>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {selectedVeteran.disabilityRating}% SC
                          </span>
                          {selectedVeteran.combatService && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                              Combat Veteran
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Last Visit</div>
                      <div className="font-medium text-gray-900 dark:text-white">2 weeks ago</div>
                    </div>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
                  <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex -mb-px">
                      {[
                        { id: 'assessment', label: 'Clinical Assessment', icon: Stethoscope },
                        { id: 'history', label: 'Medical History', icon: Clock },
                        { id: 'diagnostics', label: 'Diagnostics & Labs', icon: BarChart3 },
                        { id: 'documentation', label: 'Documentation', icon: FileText }
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

                        {/* Joint Involvement */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Joint Involvement Analysis
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pattern</div>
                              <div className="font-medium text-gray-900 dark:text-white capitalize">
                                {currentAssessment.jointInvolvement.pattern}
                              </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Distribution</div>
                              <div className="font-medium text-gray-900 dark:text-white capitalize">
                                {currentAssessment.jointInvolvement.distribution}
                              </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Duration</div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {currentAssessment.jointInvolvement.duration}
                              </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Affected Joints</div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {currentAssessment.jointInvolvement.joints.join(', ')}
                              </div>
                            </div>
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
                            Service-Connected Conditions
                          </h3>
                          <div className="space-y-2">
                            {selectedVeteran.conditions?.map((condition, idx) => (
                              <div key={idx} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="font-medium text-gray-900 dark:text-white">
                                      {condition.name}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                      Code: {condition.diagnosticCode} • Effective: {condition.effectiveDate}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold text-lg text-blue-600 dark:text-blue-400">
                                      {condition.rating}%
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      {condition.status}
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
                                {selectedVeteran.medications?.map((med, idx) => (
                                  <tr key={idx}>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                      {med.name}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                      {med.dosage}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                      {med.prescriber}
                                    </td>
                                    <td className="px-4 py-3">
                                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                        med.activeRx
                                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                          : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                                      }`}>
                                        {med.activeRx ? 'Active' : 'Inactive'}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'diagnostics' && currentAssessment && (
                      <div className="space-y-6">
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
                        {/* Clinical Note Generator */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Clinical Documentation Assistant
                          </h3>
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
                                a {selectedVeteran.disabilityRating}% service-connected disability presenting with {currentAssessment?.jointInvolvement.pattern} joint 
                                involvement in a {currentAssessment?.jointInvolvement.distribution} distribution. Symptoms have been {currentAssessment?.jointInvolvement.duration}.
                              </p>
                              <p className="text-gray-700 dark:text-gray-300">
                                <strong>Military History:</strong> Served {selectedVeteran.serviceYears} with {selectedVeteran.combatService ? 'combat' : 'non-combat'} service. 
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