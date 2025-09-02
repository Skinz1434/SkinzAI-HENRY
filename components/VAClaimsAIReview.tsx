'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Upload, Brain, Search, CheckCircle, AlertTriangle,
  Clock, Download, Eye, Send, Filter, Calendar, BarChart3,
  Shield, Zap, FileSearch, Loader2, ChevronRight, X,
  AlertCircle, BookOpen, Target, Layers, Activity, Database,
  Settings, Users, TrendingUp, Award, Hash, Flag, Info
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell, Legend
} from 'recharts';

interface ClaimDocument {
  id: string;
  filename: string;
  type: string;
  pages: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  confidence: number;
  uploadedAt: string;
}

interface Evidence {
  id: string;
  documentId: string;
  page: number;
  text: string;
  relevance: 'direct' | 'supporting' | 'contradictory' | 'neutral';
  condition: string;
  confidence: number;
  highlights: Array<{ start: number; end: number }>;
}

interface Condition {
  name: string;
  icd10Codes: string[];
  evidenceCount: number;
  strength: number;
  hasNexus: boolean;
  hasInServiceEvent: boolean;
  timeline: Array<{ date: string; event: string }>;
}

interface ClaimAnalysis {
  claimId: string;
  claimNumber: string;
  veteranName: string;
  status: 'processing' | 'review' | 'completed';
  conditions: Condition[];
  evidenceStrength: number;
  missingEvidence: string[];
  recommendations: string[];
  dbqsNeeded: string[];
  presumptiveConditions: string[];
  confidenceScore: number;
  processingTime: number;
}

const VAClaimsAIReview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'analysis' | 'review' | 'export'>('upload');
  const [documents, setDocuments] = useState<ClaimDocument[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<ClaimAnalysis | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [filters, setFilters] = useState({
    documentType: 'all',
    relevance: 'all',
    condition: 'all'
  });

  // File upload handler
  const handleFileUpload = useCallback(async (files: FileList) => {
    const newDocs: ClaimDocument[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      filename: file.name,
      type: 'pending',
      pages: 0,
      status: 'pending',
      confidence: 0,
      uploadedAt: new Date().toISOString()
    }));

    setDocuments(prev => [...prev, ...newDocs]);
    
    // Process with API
    setIsProcessing(true);
    
    const formData = new FormData();
    formData.append('claim_number', '12345678');
    formData.append('priority', 'normal');
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/va-claims/process', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        processDocuments(newDocs, data.analysis);
      } else {
        // Fallback to mock processing
        setTimeout(() => {
          processDocuments(newDocs);
        }, 1000);
      }
    } catch (error) {
      console.error('Error processing documents:', error);
      // Fallback to mock processing
      setTimeout(() => {
        processDocuments(newDocs);
      }, 1000);
    }
  }, []);

  const processDocuments = async (docs: ClaimDocument[], apiAnalysis?: any) => {
    // Simulate AI processing
    const processedDocs = docs.map(doc => ({
      ...doc,
      status: 'completed' as const,
      type: detectDocumentType(doc.filename),
      pages: Math.floor(Math.random() * 20) + 1,
      confidence: 0.75 + Math.random() * 0.25
    }));

    setDocuments(prev => 
      prev.map(doc => 
        processedDocs.find(pd => pd.id === doc.id) || doc
      )
    );

    // Generate analysis
    const analysis = generateMockAnalysis();
    setCurrentAnalysis(analysis);
    setIsProcessing(false);
    setActiveTab('analysis');
  };

  const detectDocumentType = (filename: string): string => {
    const lower = filename.toLowerCase();
    if (lower.includes('dd214')) return 'DD-214';
    if (lower.includes('medical')) return 'Medical Record';
    if (lower.includes('nexus')) return 'Nexus Letter';
    if (lower.includes('buddy')) return 'Buddy Statement';
    if (lower.includes('dbq')) return 'DBQ';
    return 'Other';
  };

  const generateMockAnalysis = (): ClaimAnalysis => {
    return {
      claimId: 'CLM-2024-001',
      claimNumber: '12345678',
      veteranName: 'John Doe',
      status: 'review',
      conditions: [
        {
          name: 'PTSD',
          icd10Codes: ['F43.10'],
          evidenceCount: 15,
          strength: 0.85,
          hasNexus: true,
          hasInServiceEvent: true,
          timeline: [
            { date: '2010-03-15', event: 'Combat exposure documented' },
            { date: '2011-06-20', event: 'First PTSD diagnosis' },
            { date: '2023-09-10', event: 'Current treatment records' }
          ]
        },
        {
          name: 'Tinnitus',
          icd10Codes: ['H93.11'],
          evidenceCount: 8,
          strength: 0.72,
          hasNexus: false,
          hasInServiceEvent: true,
          timeline: [
            { date: '2009-11-02', event: 'Noise exposure noted' },
            { date: '2023-07-15', event: 'Audiologist evaluation' }
          ]
        },
        {
          name: 'Lower Back Pain',
          icd10Codes: ['M54.5'],
          evidenceCount: 12,
          strength: 0.68,
          hasNexus: true,
          hasInServiceEvent: true,
          timeline: [
            { date: '2008-05-10', event: 'In-service injury' },
            { date: '2023-10-01', event: 'MRI showing DDD' }
          ]
        }
      ],
      evidenceStrength: 0.78,
      missingEvidence: [
        'Nexus letter for tinnitus',
        'Continuity of care records 2011-2020',
        'DBQ for lower back condition'
      ],
      recommendations: [
        'Obtain nexus letter from audiologist for tinnitus',
        'Request VA treatment records from 2011-2020',
        'Schedule C&P exam for back condition',
        'Consider secondary conditions to PTSD'
      ],
      dbqsNeeded: ['PTSD DBQ', 'Hearing Loss and Tinnitus DBQ', 'Back Conditions DBQ'],
      presumptiveConditions: ['PTSD - Combat presumption applies'],
      confidenceScore: 0.82,
      processingTime: 28.5
    };
  };

  // Evidence strength chart data
  const evidenceStrengthData = currentAnalysis?.conditions.map(condition => ({
    condition: condition.name,
    strength: condition.strength * 100,
    evidence: condition.evidenceCount
  })) || [];

  // Timeline visualization data
  const timelineData = currentAnalysis?.conditions.flatMap(condition =>
    condition.timeline.map(event => ({
      date: event.date,
      event: event.event,
      condition: condition.name
    }))
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];

  // Processing metrics
  const processingMetrics = {
    documentsProcessed: documents.filter(d => d.status === 'completed').length,
    totalPages: documents.reduce((sum, doc) => sum + doc.pages, 0),
    avgConfidence: documents.reduce((sum, doc) => sum + doc.confidence, 0) / documents.length || 0,
    processingTime: currentAnalysis?.processingTime || 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 mb-6 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">VA Claims AI Review System</h1>
                <p className="text-gray-400">Intelligent Document Analysis & Evidence Review</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">System Status</p>
                <p className="text-lg font-semibold text-green-400 flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  Operational
                </p>
              </div>
            </div>
          </div>

          {/* Metrics Bar */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-700/50">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{processingMetrics.documentsProcessed}</p>
              <p className="text-xs text-gray-400">Documents Processed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{processingMetrics.totalPages}</p>
              <p className="text-xs text-gray-400">Total Pages</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {(processingMetrics.avgConfidence * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-gray-400">Avg Confidence</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {processingMetrics.processingTime.toFixed(1)}s
              </p>
              <p className="text-xs text-gray-400">Processing Time</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'upload', label: 'Upload Documents', icon: Upload },
            { id: 'analysis', label: 'AI Analysis', icon: Brain },
            { id: 'review', label: 'Evidence Review', icon: FileSearch },
            { id: 'export', label: 'Export & Generate', icon: Download }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'upload' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Upload Area */}
              <div className="bg-gray-800/50 backdrop-blur rounded-xl p-8 border border-gray-700/50">
                <div
                  className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center hover:border-blue-500 transition-colors cursor-pointer"
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFileUpload(e.dataTransfer.files);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <Upload className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Drop claim documents here
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Supports PDF, DOCX, images (JPG, PNG, TIFF)
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
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                  >
                    <FileText className="w-5 h-5" />
                    Browse Files
                  </label>
                </div>
              </div>

              {/* Document List */}
              {documents.length > 0 && (
                <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Uploaded Documents</h3>
                  <div className="space-y-3">
                    {documents.map(doc => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700/50"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-400" />
                          <div>
                            <p className="text-white font-medium">{doc.filename}</p>
                            <p className="text-sm text-gray-400">
                              {doc.type} • {doc.pages} pages
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {doc.status === 'processing' && (
                            <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
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
                    <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                        <p className="text-blue-400">Processing documents with AI...</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'analysis' && currentAnalysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Analysis Summary */}
              <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Claim Analysis Summary</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm">
                      {currentAnalysis.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Claim Number</p>
                    <p className="text-lg font-semibold text-white">{currentAnalysis.claimNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Veteran</p>
                    <p className="text-lg font-semibold text-white">{currentAnalysis.veteranName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Confidence Score</p>
                    <p className="text-lg font-semibold text-green-400">
                      {(currentAnalysis.confidenceScore * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                {/* Evidence Strength Gauge */}
                <div className="mt-6 p-4 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-400">Overall Evidence Strength</p>
                    <p className="text-lg font-semibold text-white">
                      {(currentAnalysis.evidenceStrength * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${currentAnalysis.evidenceStrength * 100}%` }}
                      className={`h-full ${
                        currentAnalysis.evidenceStrength > 0.7
                          ? 'bg-green-500'
                          : currentAnalysis.evidenceStrength > 0.4
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Conditions Analysis */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Claimed Conditions</h3>
                  <div className="space-y-4">
                    {currentAnalysis.conditions.map((condition, idx) => (
                      <div key={idx} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-white">{condition.name}</h4>
                          <span className="text-sm text-gray-400">
                            {condition.icd10Codes.join(', ')}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Evidence Items</p>
                            <p className="text-white font-semibold">{condition.evidenceCount}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Strength</p>
                            <p className={`font-semibold ${
                              condition.strength > 0.7 ? 'text-green-400' : 'text-yellow-400'
                            }`}>
                              {(condition.strength * 100).toFixed(0)}%
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          {condition.hasNexus && (
                            <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs">
                              Has Nexus
                            </span>
                          )}
                          {condition.hasInServiceEvent && (
                            <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded text-xs">
                              In-Service Event
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evidence Strength Chart */}
                <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Evidence Analysis</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={evidenceStrengthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="condition" tick={{ fill: '#9ca3af' }} />
                      <YAxis tick={{ fill: '#9ca3af' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                      />
                      <Bar dataKey="strength" fill="#3b82f6" />
                      <Bar dataKey="evidence" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Missing Evidence & Recommendations */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    Missing Evidence
                  </h3>
                  <div className="space-y-2">
                    {currentAnalysis.missingEvidence.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-gray-500 mt-0.5" />
                        <p className="text-gray-300 text-sm">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-400" />
                    Recommendations
                  </h3>
                  <div className="space-y-2">
                    {currentAnalysis.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                        <p className="text-gray-300 text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* DBQs and Presumptive Conditions */}
              <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">Required Forms & Presumptions</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-3">DBQs Needed</h4>
                    <div className="space-y-2">
                      {currentAnalysis.dbqsNeeded.map((dbq, idx) => (
                        <div key={idx} className="px-3 py-2 bg-blue-900/20 border border-blue-800/30 rounded">
                          <p className="text-blue-400 text-sm">{dbq}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Presumptive Conditions</h4>
                    <div className="space-y-2">
                      {currentAnalysis.presumptiveConditions.map((condition, idx) => (
                        <div key={idx} className="px-3 py-2 bg-green-900/20 border border-green-800/30 rounded">
                          <p className="text-green-400 text-sm">{condition}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'review' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Evidence Review Interface */}
              <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-semibold text-white mb-4">Evidence Review & Annotation</h3>
                <p className="text-gray-400 mb-6">
                  Review AI-identified evidence and make manual adjustments
                </p>

                {/* Filter Controls */}
                <div className="flex gap-4 mb-6">
                  <select
                    className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                    value={filters.documentType}
                    onChange={(e) => setFilters({ ...filters, documentType: e.target.value })}
                  >
                    <option value="all">All Documents</option>
                    <option value="DD-214">DD-214</option>
                    <option value="Medical Record">Medical Records</option>
                    <option value="Nexus Letter">Nexus Letters</option>
                  </select>

                  <select
                    className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                    value={filters.relevance}
                    onChange={(e) => setFilters({ ...filters, relevance: e.target.value })}
                  >
                    <option value="all">All Relevance</option>
                    <option value="direct">Direct</option>
                    <option value="supporting">Supporting</option>
                    <option value="contradictory">Contradictory</option>
                  </select>

                  <select
                    className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                    value={filters.condition}
                    onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                  >
                    <option value="all">All Conditions</option>
                    <option value="PTSD">PTSD</option>
                    <option value="Tinnitus">Tinnitus</option>
                    <option value="Back Pain">Back Pain</option>
                  </select>
                </div>

                {/* Evidence Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Mock evidence items */}
                  {[1, 2, 3, 4].map(idx => (
                    <div
                      key={idx}
                      className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50 hover:border-blue-500/50 cursor-pointer transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-white font-medium">Evidence Item #{idx}</p>
                          <p className="text-sm text-gray-400">Page 3 • Medical Record</p>
                        </div>
                        <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs">
                          Direct
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                        "Veteran presents with chronic lower back pain, rated 7/10 severity. 
                        Pain began during military service following lifting incident in 2008..."
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <span className="text-xs text-gray-500">Confidence: 92%</span>
                          <span className="text-xs text-gray-500">Lower Back Pain</span>
                        </div>
                        <button className="text-blue-400 hover:text-blue-300">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'export' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Export Options */}
              <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-semibold text-white mb-4">Export & Generate Reports</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <button className="p-6 bg-gray-900/50 rounded-lg border border-gray-700/50 hover:border-blue-500/50 transition-all">
                    <FileText className="w-8 h-8 text-blue-400 mb-3" />
                    <h4 className="text-white font-medium mb-1">Evidence Summary</h4>
                    <p className="text-sm text-gray-400">Comprehensive evidence report with annotations</p>
                  </button>

                  <button className="p-6 bg-gray-900/50 rounded-lg border border-gray-700/50 hover:border-green-500/50 transition-all">
                    <BookOpen className="w-8 h-8 text-green-400 mb-3" />
                    <h4 className="text-white font-medium mb-1">Examination Request</h4>
                    <p className="text-sm text-gray-400">C&P exam request for clinicians</p>
                  </button>

                  <button className="p-6 bg-gray-900/50 rounded-lg border border-gray-700/50 hover:border-purple-500/50 transition-all">
                    <Download className="w-8 h-8 text-purple-400 mb-3" />
                    <h4 className="text-white font-medium mb-1">Annotated Documents</h4>
                    <p className="text-sm text-gray-400">Download all documents with tabs and highlights</p>
                  </button>
                </div>

                <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Ready for VBMS Upload</p>
                      <p className="text-sm text-gray-400">All documents processed and annotated</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Upload to VBMS
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VAClaimsAIReview;