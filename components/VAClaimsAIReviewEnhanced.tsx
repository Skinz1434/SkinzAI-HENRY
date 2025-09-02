'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  // Navigation & UI
  ArrowLeft, Home, Settings, HelpCircle, X, ChevronRight, ChevronDown, ChevronUp,
  Menu, MoreVertical, ExternalLink, Copy, Share2, Maximize2, Minimize2,
  
  // File & Document
  FileText, Upload, Download, File, FileSearch, FileCheck, FilePlus,
  Paperclip, Folder, FolderOpen, Archive, Save,
  
  // Analysis & AI
  Brain, Cpu, Zap, TrendingUp, TrendingDown, BarChart3, Activity,
  Target, Crosshair, Search, Filter, Layers, Database,
  
  // Status & Alerts
  CheckCircle, AlertTriangle, AlertCircle, Info, Clock, Loader2,
  Shield, Lock, Unlock, Award, Flag, Star,
  
  // Actions
  Play, Pause, RefreshCw, Send, Edit, Trash2, Eye, EyeOff,
  Plus, Minus, Copy as CopyIcon, Bookmark, Tag,
  
  // Communication
  MessageSquare, Mail, Phone, Video, Mic, Volume2,
  
  // Medical & VA Specific
  Heart, Stethoscope, Pill, Syringe, Building, Users,
  Calendar, MapPin, Navigation, Compass,
  
  // Charts & Visualizations
  PieChart, LineChart, BarChart, GitBranch, Network
} from 'lucide-react';

import {
  LineChart as RechartsLineChart, Line, 
  AreaChart, Area,
  BarChart as RechartsBarChart, Bar,
  PieChart as RechartsPieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter,
  Treemap,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart
} from 'recharts';

// Import config
// Import new components
import DocumentsView from './va-claims/DocumentsView';
import AnalysisViewEnhanced from './va-claims/AnalysisViewEnhanced';
import ExportView from './va-claims/ExportView';
import VeteranSelector from './va-claims/VeteranSelector';
import TimelineViewEnhanced from './va-claims/TimelineViewEnhanced';
import RecommendationsViewEnhanced from './va-claims/RecommendationsViewEnhanced';
import { useHENRYIntegration } from '@/hooks/useHENRYIntegration';
import { veteranDataService, VeteranProfile } from '@/lib/henry/veteran-data-service';

interface Document {
  id: string;
  filename: string;
  type: string;
  pages: number;
  text?: string;
  uploadedAt: string;
  processedAt?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  confidence: number;
  extractedData?: any;
  annotations?: any[];
}

interface Evidence {
  id: string;
  documentId: string;
  page: number;
  text: string;
  type: string;
  relevance: 'direct' | 'supporting' | 'contradictory' | 'neutral';
  condition: string;
  confidence: number;
  highlights: Array<{ start: number; end: number; color: string }>;
  date?: string;
  provider?: string;
  icdCodes?: string[];
}

interface Condition {
  name: string;
  icd10Codes: string[];
  evidenceItems: Evidence[];
  strength: number;
  hasNexus: boolean;
  hasInServiceEvent: boolean;
  hasContinuity: boolean;
  timeline: Array<{ date: string; event: string; type: string }>;
  rating?: number;
  secondaryConditions?: string[];
}

interface ClaimAnalysis {
  claimId: string;
  claimNumber: string;
  veteranInfo: any;
  status: 'pending' | 'processing' | 'review' | 'completed';
  conditions: Condition[];
  evidenceStrength: number;
  missingEvidence: string[];
  recommendations: string[];
  dbqsNeeded: string[];
  presumptiveConditions: string[];
  confidenceScore: number;
  processingTime: number;
  timeline: any[];
  riskFactors: any[];
}

const VAClaimsAIReviewEnhanced: React.FC = () => {
  const router = useRouter();
  const [activeView, setActiveView] = useState<'workflow' | 'analysis' | 'documents' | 'timeline' | 'recommendations' | 'export'>('workflow');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [analysis, setAnalysis] = useState<ClaimAnalysis | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [workflowStep, setWorkflowStep] = useState(1);
  
  // Veteran data management
  const [selectedVeteran, setSelectedVeteran] = useState<VeteranProfile | null>(null);
  const [allVeterans, setAllVeterans] = useState<VeteranProfile[]>([]);
  const { veteranData, isLoading: henryLoading, error: henryError, fetchVeteranData, generateAnalysis } = useHENRYIntegration();
  const [analysisData, setAnalysisData] = useState<any>(null);
  
  // Demo mode
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [demoStep, setDemoStep] = useState(0);

  // Load all veterans on mount
  useEffect(() => {
    const veterans = veteranDataService.getAllVeterans();
    setAllVeterans(veterans);
    
    // If no veteran is selected, optionally select the first one for demo purposes
    if (!selectedVeteran && veterans.length > 0) {
      // Don't auto-select to allow user choice
      // setSelectedVeteran(veterans[0]);
    }
  }, []);

  // Load selected veteran data
  useEffect(() => {
    if (selectedVeteran) {
      fetchVeteranData(selectedVeteran.id);
      veteranDataService.setCurrentVeteran(selectedVeteran.id);
      
      // Also load the veteran's documents
      if (selectedVeteran.documents && selectedVeteran.documents.length > 0) {
        const veteranDocs: Document[] = selectedVeteran.documents.map(doc => ({
          id: doc.id,
          filename: doc.filename,
          type: doc.type,
          pages: doc.pages,
          uploadedAt: doc.uploadDate,
          status: 'completed',
          confidence: 0.85 + Math.random() * 0.15,
          processedAt: new Date().toISOString(),
          extractedData: {
            tags: doc.tags,
            relevantTo: doc.relevantTo
          }
        }));
        setDocuments(veteranDocs);
      }
    }
  }, [selectedVeteran, fetchVeteranData]);

  // Generate analysis when veteran data is loaded
  useEffect(() => {
    if (veteranData) {
      if (!analysisData) {
        const generatedAnalysis = generateAnalysis(veteranData);
        setAnalysisData(generatedAnalysis);
      }
      // Always ensure analysis state is set for timeline and recommendations
      if (!analysis) {
        setAnalysis(generateComprehensiveAnalysis());
      }
    }
  }, [veteranData, analysisData, analysis, generateAnalysis]);

  // Workflow steps configuration
  const workflowSteps = [
    {
      id: 1,
      title: 'Document Upload',
      description: 'Upload claim documents for analysis',
      icon: Upload,
      status: documents.length > 0 ? 'completed' : 'active'
    },
    {
      id: 2,
      title: 'AI Processing',
      description: 'Analyzing documents with AI',
      icon: Brain,
      status: analysis ? 'completed' : documents.length > 0 ? 'active' : 'pending'
    },
    {
      id: 3,
      title: 'Evidence Review',
      description: 'Review and validate findings',
      icon: FileSearch,
      status: analysis ? 'active' : 'pending'
    },
    {
      id: 4,
      title: 'Generate Reports',
      description: 'Export analysis and recommendations',
      icon: Download,
      status: 'pending'
    }
  ];

  // Handle file upload with enhanced processing
  const handleFileUpload = useCallback(async (files: FileList) => {
    if (!selectedVeteran && !veteranData) {
      alert('Please select a veteran first before uploading documents.');
      return;
    }

    const newDocs: Document[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      filename: file.name,
      type: detectDocumentType(file.name),
      pages: 0,
      uploadedAt: new Date().toISOString(),
      status: 'pending',
      confidence: 0
    }));

    setDocuments(prev => [...prev, ...newDocs]);
    setIsProcessing(true);
    
    // Get current veteran data
    const currentVeteran = veteranData || selectedVeteran;
    
    // Process with API - always fall back to demo processing since API might not exist
    setTimeout(() => {
      const processedDocs = newDocs.map(doc => ({
        ...doc,
        status: 'completed' as const,
        pages: Math.floor(Math.random() * 20) + 1,
        confidence: 0.75 + Math.random() * 0.25,
        processedAt: new Date().toISOString()
      }));

      setDocuments(prev => 
        prev.map(doc => 
          processedDocs.find(pd => pd.id === doc.id) || doc
        )
      );

      // Generate analysis based on current veteran
      const newAnalysis = generateComprehensiveAnalysis();
      setAnalysis(newAnalysis);
      
      // Also generate VIS analysis data if we have veteran data
      if (currentVeteran) {
        const newAnalysisData = generateAnalysis(currentVeteran);
        setAnalysisData(newAnalysisData);
      }
      
      setIsProcessing(false);
      setWorkflowStep(3);
    }, 2000 + Math.random() * 2000); // Simulate varying processing time
  }, [veteranData, selectedVeteran, generateAnalysis]);

  const detectDocumentType = (filename: string): string => {
    const lower = filename.toLowerCase();
    if (lower.includes('dd214') || lower.includes('dd-214')) return 'DD-214';
    if (lower.includes('medical')) return 'Medical Record';
    if (lower.includes('nexus')) return 'Nexus Letter';
    if (lower.includes('buddy')) return 'Buddy Statement';
    if (lower.includes('dbq')) return 'DBQ';
    if (lower.includes('str')) return 'Service Treatment Record';
    if (lower.includes('rating')) return 'Rating Decision';
    return 'Other';
  };

  const processDocuments = (docs: Document[], apiAnalysis?: any) => {
    const processedDocs = docs.map(doc => ({
      ...doc,
      status: 'completed' as const,
      pages: Math.floor(Math.random() * 20) + 1,
      confidence: 0.75 + Math.random() * 0.25,
      processedAt: new Date().toISOString()
    }));

    setDocuments(prev => 
      prev.map(doc => 
        processedDocs.find(pd => pd.id === doc.id) || doc
      )
    );

    setAnalysis(apiAnalysis || generateComprehensiveAnalysis());
    setIsProcessing(false);
    setWorkflowStep(3);
  };

  const generateComprehensiveAnalysis = (): ClaimAnalysis => {
    return {
      claimId: `CLM-${Date.now()}`,
      claimNumber: veteranData?.ssn || '12345678',
      veteranInfo: veteranData,
      status: 'review',
      conditions: [
        {
          name: 'PTSD',
          icd10Codes: ['F43.10'],
          evidenceItems: generateMockEvidence('PTSD', 15),
          strength: 0.85,
          hasNexus: true,
          hasInServiceEvent: true,
          hasContinuity: true,
          timeline: [
            { date: '2009-03-15', event: 'IED explosion - Combat patrol', type: 'service' },
            { date: '2009-03-20', event: 'First mental health visit', type: 'treatment' },
            { date: '2011-06-15', event: 'PTSD diagnosis by Dr. Smith', type: 'diagnosis' },
            { date: '2023-09-10', event: 'Current treatment with Dr. Johnson', type: 'treatment' }
          ],
          rating: 70,
          secondaryConditions: ['Sleep Apnea', 'Depression']
        },
        {
          name: 'Tinnitus',
          icd10Codes: ['H93.11'],
          evidenceItems: generateMockEvidence('Tinnitus', 8),
          strength: 0.72,
          hasNexus: false,
          hasInServiceEvent: true,
          hasContinuity: true,
          timeline: [
            { date: '2009-11-02', event: 'Noise exposure - Artillery training', type: 'service' },
            { date: '2012-03-15', event: 'First complaint of ringing in ears', type: 'complaint' },
            { date: '2023-07-20', event: 'Audiologist evaluation', type: 'diagnosis' }
          ],
          rating: 10
        },
        {
          name: 'Lumbar Strain',
          icd10Codes: ['M54.5', 'M51.36'],
          evidenceItems: generateMockEvidence('Back', 12),
          strength: 0.68,
          hasNexus: true,
          hasInServiceEvent: true,
          hasContinuity: false,
          timeline: [
            { date: '2010-05-10', event: 'Lifting injury during deployment', type: 'service' },
            { date: '2010-05-15', event: 'X-ray showing disc issues', type: 'imaging' },
            { date: '2023-10-01', event: 'MRI showing DDD L4-L5', type: 'imaging' }
          ],
          rating: 20,
          secondaryConditions: ['Radiculopathy']
        }
      ],
      evidenceStrength: 0.78,
      missingEvidence: [
        'Nexus letter for tinnitus from audiologist',
        'Continuity of care records for back condition (2012-2020)',
        'Updated DBQ for PTSD symptoms',
        'Sleep study for secondary sleep apnea claim'
      ],
      recommendations: [
        {
          priority: 'high',
          action: 'Obtain nexus letter from audiologist linking tinnitus to military noise exposure',
          timeline: 'Within 30 days',
          impact: 'Critical for service connection'
        },
        {
          priority: 'high',
          action: 'Request VA treatment records from 2012-2020 to establish continuity',
          timeline: 'Within 2 weeks',
          impact: 'Strengthens chronicity argument'
        },
        {
          priority: 'medium',
          action: 'Schedule updated PTSD DBQ to capture current symptom severity',
          timeline: 'Within 60 days',
          impact: 'May support rating increase'
        },
        {
          priority: 'medium',
          action: 'File secondary claim for sleep apnea with sleep study',
          timeline: 'Within 90 days',
          impact: 'Additional 50% rating possible'
        }
      ].map(r => r.action),
      dbqsNeeded: ['PTSD DBQ', 'Hearing Loss and Tinnitus DBQ', 'Back Conditions DBQ', 'Sleep Apnea DBQ'],
      presumptiveConditions: ['PTSD - Combat presumption applies per 38 CFR 3.304(f)(2)'],
      confidenceScore: 0.82,
      processingTime: 28.5,
      timeline: generateComprehensiveTimeline(),
      riskFactors: [
        { factor: 'Missing nexus for tinnitus', impact: 'high', mitigation: 'Obtain medical opinion' },
        { factor: 'Gap in treatment records', impact: 'medium', mitigation: 'Personal statement explaining gap' }
      ]
    };
  };

  const generateMockEvidence = (condition: string, count: number): Evidence[] => {
    const evidenceTypes = ['Medical Record', 'Service Record', 'Nexus Letter', 'DBQ', 'Buddy Statement'];
    const relevanceTypes: Array<'direct' | 'supporting' | 'contradictory' | 'neutral'> = 
      ['direct', 'supporting', 'supporting', 'neutral'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: `ev-${condition}-${i}`,
      documentId: `doc-${Math.floor(Math.random() * 5)}`,
      page: Math.floor(Math.random() * 20) + 1,
      text: generateEvidenceText(condition, i),
      type: evidenceTypes[Math.floor(Math.random() * evidenceTypes.length)],
      relevance: relevanceTypes[Math.floor(Math.random() * relevanceTypes.length)],
      condition,
      confidence: 0.6 + Math.random() * 0.4,
      highlights: [
        { start: 10, end: 50, color: 'yellow' },
        { start: 100, end: 150, color: 'green' }
      ],
      date: new Date(2010 + Math.floor(Math.random() * 13), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      provider: `Dr. ${['Smith', 'Johnson', 'Williams', 'Brown'][Math.floor(Math.random() * 4)]}`,
      icdCodes: condition === 'PTSD' ? ['F43.10'] : condition === 'Tinnitus' ? ['H93.11'] : ['M54.5']
    }));
  };

  const generateEvidenceText = (condition: string, index: number): string => {
    const templates: Record<string, string[]> = {
      'PTSD': [
        'Patient presents with symptoms consistent with PTSD including nightmares, hypervigilance, and avoidance behaviors.',
        'Veteran reports intrusive thoughts related to combat experiences in Iraq. Prescribed Sertraline 50mg daily.',
        'PCL-5 score of 58 indicates severe PTSD symptoms. Recommend continued therapy and medication management.'
      ],
      'Tinnitus': [
        'Patient complains of constant bilateral tinnitus, rated 7/10 severity. Onset during military service.',
        'Audiometric testing reveals mild hearing loss with associated tinnitus. Likely noise-induced.',
        'Subjective tinnitus present, impacting sleep and concentration. Recommending sound therapy.'
      ],
      'Back': [
        'MRI reveals degenerative disc disease at L4-L5 with mild canal stenosis. Chronic pain reported.',
        'Range of motion limited to 45 degrees forward flexion. Pain rated 6/10 with radiation to left leg.',
        'Patient reports injury during military service while lifting equipment. Ongoing physical therapy.'
      ]
    };
    
    const conditionKey = condition.includes('Back') ? 'Back' : (condition in templates ? condition : 'PTSD');
    const texts = templates[conditionKey];
    return texts[index % texts.length];
  };

  const generateComprehensiveTimeline = () => {
    return [
      { date: '2008-01-15', event: 'Entered Active Duty', type: 'service', category: 'milestone' },
      { date: '2009-02-01', event: 'Deployed to Iraq', type: 'service', category: 'deployment' },
      { date: '2009-03-15', event: 'IED Explosion - Purple Heart', type: 'service', category: 'trauma' },
      { date: '2009-03-20', event: 'Initial Mental Health Evaluation', type: 'medical', category: 'treatment' },
      { date: '2010-05-10', event: 'Back Injury - Lifting Incident', type: 'service', category: 'injury' },
      { date: '2010-11-15', event: 'Redeployed to Afghanistan', type: 'service', category: 'deployment' },
      { date: '2011-06-15', event: 'PTSD Diagnosis', type: 'medical', category: 'diagnosis' },
      { date: '2012-01-14', event: 'Honorable Discharge', type: 'service', category: 'milestone' },
      { date: '2012-03-01', event: 'Initial VA Claim Filed', type: 'claim', category: 'administrative' },
      { date: '2012-08-15', event: 'C&P Exam - PTSD', type: 'medical', category: 'examination' },
      { date: '2012-11-01', event: 'Rating Decision - 50%', type: 'claim', category: 'decision' },
      { date: '2023-06-15', event: 'Claim for Increase Filed', type: 'claim', category: 'administrative' },
      { date: '2023-10-20', event: 'Current Analysis', type: 'current', category: 'milestone' }
    ];
  };

  // Help content
  const helpContent = {
    workflow: 'Follow the step-by-step workflow to process your VA claim documents. Each step builds on the previous one.',
    upload: 'Upload all relevant documents including DD-214, medical records, nexus letters, and buddy statements.',
    analysis: 'Our AI analyzes your documents to identify conditions, evidence strength, and missing documentation.',
    review: 'Review the AI findings, make corrections, and add additional context as needed.',
    export: 'Generate reports for your VSO, attorney, or VA submission.'
  };

  // Render help modal
  const renderHelpModal = () => (
    <AnimatePresence>
      {showHelp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowHelp(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">VA Claims AI Help Guide</h2>
                <button
                  onClick={() => setShowHelp(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Getting Started</h3>
                  <p className="text-gray-300 mb-4">
                    The VA Claims AI system helps you analyze and prepare your disability claim with intelligent document processing.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(helpContent).map(([key, content]) => (
                      <div key={key} className="p-4 bg-gray-900/50 rounded-lg">
                        <h4 className="text-white font-medium mb-2 capitalize">{key}</h4>
                        <p className="text-sm text-gray-400">{content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                      <span className="text-gray-300">Automatic document classification and OCR</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                      <span className="text-gray-300">Evidence strength scoring and gap analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                      <span className="text-gray-300">Presumptive condition detection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                      <span className="text-gray-300">DBQ and nexus letter recommendations</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Tips for Success</h3>
                  <div className="p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                    <ul className="space-y-2 text-sm text-blue-300">
                      <li>• Upload all available documentation for best results</li>
                      <li>• Include both military and civilian medical records</li>
                      <li>• Buddy statements can strengthen your claim</li>
                      <li>• Review all AI findings before submission</li>
                      <li>• Use the timeline view to identify gaps</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Enhanced Header with Navigation */}
      <header className="bg-gray-900/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard-full"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Back to Dashboard</span>
              </Link>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">VA Claims AI Analysis</h1>
                  <p className="text-xs text-gray-400">Intelligent Document Review System</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {selectedVeteran && (
                <div className="px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-300">
                    <span className="text-gray-500">Selected:</span> {selectedVeteran.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedVeteran.branch} • {selectedVeteran.disabilityRating}% Rating
                  </p>
                </div>
              )}
              
              <button
                onClick={() => setShowHelp(true)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>

              <Link
                href="/"
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Home className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Veteran Selector */}
        <div className="mb-6">
          <VeteranSelector
            selectedVeteran={selectedVeteran}
            onSelectVeteran={setSelectedVeteran}
            veterans={allVeterans.map(v => ({
              ...v,
              documentsCount: v.documents.length,
              pendingActions: v.pendingClaims.length + v.flags.filter(f => f.type === 'urgent' || f.type === 'followup').length
            }))}
          />
        </div>

        {/* Workflow Progress Bar */}
        <div className="mb-6">
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Analysis Workflow</h2>
              <span className="text-sm text-gray-400">
                Step {workflowStep} of {workflowSteps.length}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = step.id === workflowStep;
                const isCompleted = step.id < workflowStep;
                
                return (
                  <React.Fragment key={step.id}>
                    <div
                      className={`flex flex-col items-center cursor-pointer ${
                        isActive ? 'scale-105' : ''
                      }`}
                      onClick={() => setWorkflowStep(step.id)}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                          isCompleted
                            ? 'bg-green-600 text-white'
                            : isActive
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white ring-2 ring-blue-500/30'
                            : 'bg-gray-700 text-gray-400'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <Icon className="w-6 h-6" />
                        )}
                      </div>
                      <p className={`text-xs font-medium ${
                        isActive ? 'text-white' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-500 text-center mt-1">
                        {step.description}
                      </p>
                    </div>
                    
                    {index < workflowSteps.length - 1 && (
                      <div className={`flex-1 h-0.5 ${
                        isCompleted ? 'bg-green-600' : 'bg-gray-700'
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'workflow', label: 'Workflow', icon: GitBranch },
            { id: 'analysis', label: 'Analysis', icon: Brain },
            { id: 'documents', label: 'Documents', icon: FileText },
            { id: 'timeline', label: 'Timeline', icon: Clock },
            { id: 'recommendations', label: 'Actions', icon: Target },
            { id: 'export', label: 'Export', icon: Download }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeView === tab.id
                    ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white border border-gray-500'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeView === 'workflow' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {(workflowStep === 1 || workflowStep === 2) && (
                <div className="space-y-6">
                  {/* Upload Area */}
                  <div className="bg-gray-800/50 backdrop-blur rounded-xl p-8 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">Upload Claim Documents</h3>
                      <button
                        onClick={() => {
                          if (selectedVeteran) {
                            // Load documents from veteran's e-folder
                            const veteranDocs: Document[] = selectedVeteran.documents.map(doc => ({
                              id: doc.id,
                              filename: doc.filename,
                              type: doc.type,
                              pages: doc.pages,
                              uploadedAt: doc.uploadDate,
                              status: 'completed',
                              confidence: 0.85 + Math.random() * 0.15,
                              processedAt: new Date().toISOString(),
                              extractedData: {
                                tags: doc.tags,
                                relevantTo: doc.relevantTo
                              }
                            }));
                            setDocuments(veteranDocs);
                            
                            // Generate comprehensive analysis
                            const newAnalysis = generateComprehensiveAnalysis();
                            setAnalysis(newAnalysis);
                            
                            // Also generate VIS analysis data
                            const newAnalysisData = generateAnalysis(selectedVeteran);
                            setAnalysisData(newAnalysisData);
                            
                            // Move to next step
                            setWorkflowStep(3);
                          }
                        }}
                        className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm ${
                          selectedVeteran 
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800' 
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                        disabled={!selectedVeteran}
                      >
                        <Folder className="w-4 h-4" />
                        {selectedVeteran ? `Load ${selectedVeteran.documents.length} E-Folder Documents` : 'Select a Veteran First'}
                      </button>
                    </div>
                    
                    <div
                      className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center hover:border-purple-500 transition-colors cursor-pointer"
                      onDrop={(e) => {
                        e.preventDefault();
                        handleFileUpload(e.dataTransfer.files);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <Upload className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Drop files here or click to browse
                      </h3>
                      <p className="text-gray-400 mb-4">
                        Supports: PDF, DOCX, JPG, PNG, TIFF
                      </p>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.docx,.jpg,.jpeg,.png,.tiff"
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 cursor-pointer"
                      >
                        <FileText className="w-5 h-5" />
                        Select Files
                      </label>
                    </div>

                    {/* Document Types Guide */}
                    <div className="mt-6 grid grid-cols-3 gap-4">
                      {[
                        { type: 'DD-214', desc: 'Service verification', icon: Award },
                        { type: 'Medical Records', desc: 'Treatment history', icon: Heart },
                        { type: 'Nexus Letters', desc: 'Service connection', icon: FileText },
                        { type: 'Buddy Statements', desc: 'Witness accounts', icon: Users },
                        { type: 'DBQs', desc: 'Disability questionnaires', icon: FileCheck },
                        { type: 'Service Records', desc: 'Military documentation', icon: Shield }
                      ].map(item => {
                        const Icon = item.icon;
                        return (
                          <div key={item.type} className="p-3 bg-gray-900/50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className="w-4 h-4 text-purple-400" />
                              <p className="text-sm font-medium text-white">{item.type}</p>
                            </div>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Uploaded Documents List */}
                  {documents.length > 0 && (
                    <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Uploaded Documents</h3>
                        <span className="text-sm text-gray-400">{documents.length} files</span>
                      </div>
                      
                      <div className="space-y-3">
                        {documents.map(doc => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700/50"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-purple-400" />
                              <div>
                                <p className="text-white font-medium">{doc.filename}</p>
                                <p className="text-sm text-gray-400">
                                  {doc.type} • {doc.pages} pages
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              {doc.status === 'processing' && (
                                <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                              )}
                              {doc.status === 'completed' && (
                                <div className="flex items-center gap-2">
                                  <div className="text-right">
                                    <p className="text-sm text-gray-400">Confidence</p>
                                    <p className="text-lg font-semibold text-green-400">
                                      {(doc.confidence * 100).toFixed(0)}%
                                    </p>
                                  </div>
                                  <CheckCircle className="w-5 h-5 text-green-400" />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {isProcessing && (
                        <div className="mt-6 p-4 bg-purple-900/20 border border-purple-800/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                            <div>
                              <p className="text-purple-400 font-medium">Processing documents with AI...</p>
                              <p className="text-xs text-purple-400/70">This may take a few moments</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {!isProcessing && documents.length > 0 && (
                        <button
                          onClick={() => {
                            setIsProcessing(true);
                            setTimeout(() => {
                              const currentVeteran = veteranData || selectedVeteran;
                              
                              // Update document statuses
                              const processedDocs = documents.map(doc => ({
                                ...doc,
                                status: 'completed' as const,
                                confidence: Math.max(doc.confidence, 0.75 + Math.random() * 0.25),
                                processedAt: doc.processedAt || new Date().toISOString()
                              }));
                              
                              setDocuments(processedDocs);
                              
                              // Generate analysis
                              const newAnalysis = generateComprehensiveAnalysis();
                              setAnalysis(newAnalysis);
                              
                              if (currentVeteran) {
                                const newAnalysisData = generateAnalysis(currentVeteran);
                                setAnalysisData(newAnalysisData);
                              }
                              
                              setIsProcessing(false);
                              setWorkflowStep(3);
                            }, 2000);
                          }}
                          className="mt-6 w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2"
                        >
                          <Brain className="w-5 h-5" />
                          Start AI Analysis
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {workflowStep === 3 && analysis && (
                <div className="space-y-6">
                  {/* Analysis Summary Dashboard */}
                  <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-white">Analysis Summary</h3>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm">
                          Analysis Complete
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div className="p-4 bg-gray-900/50 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Claim Confidence</p>
                        <p className="text-2xl font-bold text-white">
                          {(analysis.confidenceScore * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div className="p-4 bg-gray-900/50 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Evidence Strength</p>
                        <p className="text-2xl font-bold text-white">
                          {(analysis.evidenceStrength * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div className="p-4 bg-gray-900/50 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Conditions</p>
                        <p className="text-2xl font-bold text-white">
                          {analysis.conditions.length}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-900/50 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Est. Rating</p>
                        <p className="text-2xl font-bold text-white">
                          {analysis.conditions.reduce((sum, c) => sum + (c.rating || 0), 0)}%
                        </p>
                      </div>
                    </div>

                    {/* Conditions Analysis */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white">Identified Conditions</h4>
                      {analysis.conditions.map((condition, idx) => (
                        <div key={idx} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                condition.strength > 0.7 ? 'bg-green-600' : 'bg-yellow-600'
                              }`}>
                                <Heart className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h5 className="font-medium text-white">{condition.name}</h5>
                                <p className="text-sm text-gray-400">
                                  ICD-10: {condition.icd10Codes.join(', ')}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-400">Evidence Strength</p>
                              <p className="text-lg font-semibold text-white">
                                {(condition.strength * 100).toFixed(0)}%
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              {condition.hasNexus ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <X className="w-4 h-4 text-red-400" />
                              )}
                              <span className="text-sm text-gray-300">Nexus Letter</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {condition.hasInServiceEvent ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <X className="w-4 h-4 text-red-400" />
                              )}
                              <span className="text-sm text-gray-300">In-Service Event</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {condition.hasContinuity ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <X className="w-4 h-4 text-red-400" />
                              )}
                              <span className="text-sm text-gray-300">Continuity</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-purple-400" />
                              <span className="text-sm text-gray-300">
                                Est. {condition.rating}% Rating
                              </span>
                            </div>
                          </div>

                          {condition.secondaryConditions && condition.secondaryConditions.length > 0 && (
                            <div className="mt-3 p-3 bg-purple-900/20 border border-purple-800/30 rounded">
                              <p className="text-sm text-purple-400 mb-1">Potential Secondary Conditions:</p>
                              <p className="text-sm text-gray-300">
                                {condition.secondaryConditions.join(', ')}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Missing Evidence Alert */}
                    {analysis.missingEvidence.length > 0 && (
                      <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-800/30 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                          <div>
                            <p className="text-yellow-400 font-medium mb-2">Missing Evidence Detected</p>
                            <ul className="space-y-1">
                              {analysis.missingEvidence.map((item, idx) => (
                                <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                                  <span className="text-yellow-400">•</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {analysis.recommendations.length > 0 && (
                      <div className="mt-6 p-4 bg-green-900/20 border border-green-800/30 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Target className="w-5 h-5 text-green-400 mt-0.5" />
                          <div>
                            <p className="text-green-400 font-medium mb-2">Recommended Actions</p>
                            <ul className="space-y-1">
                              {analysis.recommendations.map((rec, idx) => (
                                <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeView === 'timeline' && (selectedVeteran || veteranData) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <TimelineViewEnhanced
                timeline={
                  (analysis?.timeline || analysisData?.timeline || []).length > 0 
                    ? (analysis?.timeline || analysisData?.timeline || []).map((event: any) => ({
                        ...event,
                        details: `${event.event} - This event had significant impact on the veteran's condition`,
                        location: event.type === 'service' ? 'Military Base' : 'VA Medical Center',
                        provider: event.type === 'medical' ? 'Dr. Smith' : undefined,
                        documents: ['Related Document 1', 'Related Document 2'],
                        impact: Math.floor(Math.random() * 40 + 60),
                        related: ['Previous Treatment', 'Follow-up Required']
                      }))
                    : generateComprehensiveTimeline().map((event: any) => ({
                        ...event,
                        details: `${event.event} - This event had significant impact on the veteran's condition`,
                        location: event.type === 'service' ? 'Military Base' : 'VA Medical Center',
                        provider: event.type === 'medical' ? 'Dr. Smith' : undefined,
                        documents: ['Related Document 1', 'Related Document 2'],
                        impact: Math.floor(Math.random() * 40 + 60),
                        related: ['Previous Treatment', 'Follow-up Required']
                      }))
                }
                veteranData={veteranData}
              />
            </motion.div>
          )}

          {/* Documents View */}
          {activeView === 'documents' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DocumentsView
                documents={documents.map(doc => ({
                  ...doc,
                  id: doc.id,
                  name: doc.filename,
                  type: doc.type,
                  category: doc.type,
                  uploadDate: doc.uploadedAt,
                  size: `${Math.floor(Math.random() * 5 + 1)}MB`,
                  pages: doc.pages || Math.floor(Math.random() * 20 + 1),
                  status: doc.status === 'completed' ? 'processed' as const : doc.status,
                  confidence: doc.confidence * 100,
                  extractedData: doc.extractedData,
                  relevanceScore: Math.floor(doc.confidence * 100),
                  flags: doc.status === 'error' ? ['Review Required'] : undefined
                }))}
                onViewDocument={(doc) => setSelectedDocument(doc as any)}
                onDeleteDocument={(id) => setDocuments(prev => prev.filter(d => d.id !== id))}
              />
            </motion.div>
          )}

          {/* Analysis View */}
          {activeView === 'analysis' && (selectedVeteran || veteranData) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AnalysisViewEnhanced
                analysisData={(() => {
                  const data = analysisData || (veteranData ? generateAnalysis(veteranData) : selectedVeteran ? generateAnalysis(selectedVeteran) : null);
                  if (!data) return null;
                  return {
                    ...data,
                    conditions: data.conditions.map((c: any) => ({
                    ...c,
                    symptoms: ['Nightmares', 'Hypervigilance', 'Avoidance', 'Flashbacks'],
                    treatments: ['Cognitive Behavioral Therapy', 'EMDR', 'Group Therapy'],
                    medications: ['Sertraline 100mg', 'Prazosin 5mg'],
                    timeline: [
                      { date: '2020-01', event: 'Initial Diagnosis', severity: 60 },
                      { date: '2021-06', event: 'Treatment Started', severity: 70 },
                      { date: '2022-12', event: 'Improvement Noted', severity: 50 },
                      { date: '2024-01', event: 'Current Status', severity: 45 }
                    ]
                  })),
                  presumptiveConditions: data.presumptiveConditions.map((p: any) => ({
                    ...p,
                    confidence: 75 + Math.random() * 25
                  })),
                  missingEvidence: data.missingEvidence.map((m: any) => ({
                    ...m,
                    impact: 'Could increase rating by 10-20%'
                  })),
                  riskFactors: data.riskFactors.map((r: any) => ({
                    ...r,
                    trend: Math.random() > 0.5 ? 'increasing' : Math.random() > 0.5 ? 'decreasing' : 'stable'
                  }))
                  };
                })()}
                veteranData={veteranData || selectedVeteran}
              />
            </motion.div>
          )}

          {/* Recommendations View */}
          {activeView === 'recommendations' && (selectedVeteran || veteranData) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <RecommendationsViewEnhanced
                recommendations={[
                  ...(analysis?.recommendations || analysisData?.recommendations || ((veteranData || selectedVeteran) ? generateAnalysis(veteranData! || selectedVeteran!)?.recommendations : []) || []).map((rec: any, idx: number) => ({
                    id: `rec-${idx}`,
                    priority: (rec.priority || (idx === 0 ? 'critical' : idx < 3 ? 'high' : idx < 5 ? 'medium' : 'low')) as 'critical' | 'high' | 'medium' | 'low',
                    category: 'strategic' as 'evidence' | 'medical' | 'administrative' | 'strategic',
                    action: typeof rec === 'string' ? rec : rec.action,
                    impact: rec.impact || 'Significant improvement to claim strength',
                    timeframe: rec.timeframe || (idx === 0 ? 'Immediate' : idx < 3 ? '1-2 weeks' : '2-4 weeks'),
                    effort: (idx === 0 ? 'low' : idx < 3 ? 'medium' : 'high') as 'low' | 'medium' | 'high',
                    cost: 'low' as 'free' | 'low' | 'medium' | 'high',
                    successRate: 85 + Math.random() * 15,
                    steps: [
                      'Review current documentation',
                      'Contact appropriate provider',
                      'Submit required forms',
                      'Follow up with VA'
                    ],
                    resources: [
                      { name: 'VA Form Library', type: 'website', link: 'https://va.gov/forms' },
                      { name: 'Benefits Hotline', type: 'phone', link: 'tel:1-800-827-1000' }
                    ],
                    potentialIncrease: 10 + Math.floor(Math.random() * 20)
                  })),
                  ...(analysis?.missingEvidence || analysisData?.missingEvidence || ((veteranData || selectedVeteran) ? generateAnalysis(veteranData! || selectedVeteran!)?.missingEvidence : []) || []).map((missing: string, idx: number) => ({
                    id: `missing-${idx}`,
                    priority: 'high' as 'critical' | 'high' | 'medium' | 'low',
                    category: 'evidence' as 'evidence' | 'medical' | 'administrative' | 'strategic',
                    action: `Obtain ${missing}`,
                    impact: 'Critical for establishing service connection',
                    timeframe: '2-4 weeks',
                    effort: 'medium' as 'low' | 'medium' | 'high',
                    cost: 'low' as 'free' | 'low' | 'medium' | 'high',
                    successRate: 90,
                    potentialIncrease: 15
                  }))
                ]}
                veteranData={veteranData || selectedVeteran}
                onActionClick={(action) => console.log('Starting action:', action)}
              />
            </motion.div>
          )}

          {/* Export View */}
          {activeView === 'export' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ExportView
                analysisData={analysisData || (selectedVeteran ? generateAnalysis(selectedVeteran) : null)}
                veteranData={veteranData || selectedVeteran}
                documents={documents}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Help Modal */}
      {renderHelpModal()}
    </div>
  );
};

export default VAClaimsAIReviewEnhanced;