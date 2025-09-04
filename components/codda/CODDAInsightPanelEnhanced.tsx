'use client';

import React, { useState, useEffect } from 'react';
import { 
  Brain,
  FileText,
  Shield,
  MessageSquare,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  BookOpen,
  Zap,
  TrendingUp,
  Users,
  Clock,
  Target,
  Award,
  Lightbulb,
  FileSearch,
  Scale,
  Heart,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Database,
  Filter,
  Download,
  Upload,
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
  Building,
  Flag,
  Star,
  Info,
  HelpCircle,
  Settings,
  RefreshCw,
  Eye,
  Edit,
  Copy,
  Share2,
  Bookmark,
  Tag,
  Link,
  Globe,
  Wifi,
  WifiOff
} from 'lucide-react';
import { CODCase, ChatMessage, CODDASuggestion } from '@/types/codda';
import { getDemoClausesByCategory, enhancedClauseTemplates } from '@/lib/codda/demo-data';
import Tooltip from './ui/Tooltip';
import Modal from './ui/Modal';

interface CODDAInsightPanelEnhancedProps {
  currentCase: CODCase;
  activeTab: 'insights' | 'evidence' | 'bias' | 'chat';
  onTabChange: (tab: 'insights' | 'evidence' | 'bias' | 'chat') => void;
}

export default function CODDAInsightPanelEnhanced({ 
  currentCase, 
  activeTab, 
  onTabChange 
}: CODDAInsightPanelEnhancedProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isQBitOnline, setIsQBitOnline] = useState(true);
  const [showRegulationModal, setShowRegulationModal] = useState(false);
  const [selectedRegulation, setSelectedRegulation] = useState('');
  const [evidenceFilter, setEvidenceFilter] = useState('all');
  const [biasAnalysisResults, setBiasAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Enhanced regulation database
  const regulations = [
    {
      id: '38-cfr-3.12',
      title: '38 CFR 3.12 - Character of discharge',
      summary: 'Establishes criteria for determining character of discharge and its effect on benefit eligibility',
      sections: ['3.12(a) - Honorable', '3.12(b) - General', '3.12(c) - Dishonorable conditions', '3.12(d) - Misconduct'],
      relevance: 'high',
      lastUpdated: '2023-10-15'
    },
    {
      id: '38-cfr-3.354',
      title: '38 CFR 3.354 - Insanity',
      summary: 'Defines insanity exception to character of discharge bars',
      sections: ['3.354(a) - Definition', '3.354(b) - Evidence requirements'],
      relevance: currentCase.finding.insanityConsidered ? 'high' : 'medium',
      lastUpdated: '2023-08-20'
    },
    {
      id: '38-cfr-3.360',
      title: '38 CFR 3.360 - Eligibility for health care',
      summary: 'Healthcare eligibility despite character of discharge bars',
      sections: ['3.360(a) - Combat veterans', '3.360(c) - Other provisions'],
      relevance: 'high',
      lastUpdated: '2023-11-02'
    }
  ];

  // Evidence analysis
  const evidenceStats = {
    total: currentCase.evidence.length,
    byReliability: {
      high: currentCase.evidence.filter(e => e.reliability === 'high').length,
      medium: currentCase.evidence.filter(e => e.reliability === 'medium').length,
      low: currentCase.evidence.filter(e => e.reliability === 'low').length
    },
    bySource: {
      eFolder: currentCase.evidence.filter(e => e.source === 'eFolder').length,
      HENRY: currentCase.evidence.filter(e => e.source === 'HENRY').length,
      Upload: currentCase.evidence.filter(e => e.source === 'Upload').length,
      External: currentCase.evidence.filter(e => e.source === 'External').length
    },
    gaps: currentCase.evidence.filter(e => e.isGap).length
  };

  // Initialize with welcome message
  useEffect(() => {
    if (chatMessages.length === 0) {
      setChatMessages([{
        id: 'welcome',
        role: 'assistant',
        content: `Hello! I'm QBit, your CODDA assistant. I'm here to help with ${currentCase.id} for ${currentCase.claimant}. I can assist with regulation analysis, evidence review, and decision drafting. What would you like to work on?`,
        timestamp: new Date().toISOString(),
        suggestions: [
          {
            type: 'action',
            title: 'Analyze Evidence Gaps',
            content: 'Review missing evidence and suggest retrieval strategies'
          },
          {
            type: 'rule',
            title: 'Review Applicable Regulations',
            content: 'Examine 38 CFR sections relevant to this case'
          },
          {
            type: 'clause',
            title: 'Draft Decision Language',
            content: 'Generate appropriate clauses for this determination'
          }
        ]
      }]);
    }
  }, [currentCase, chatMessages.length]);

  const handleSendMessage = () => {
    if (!currentMessage.trim() || !isQBitOnline) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString(),
      context: {
        caseId: currentCase.id,
        section: 'general'
      }
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');
    
    // Generate contextual AI response based on message content
    setTimeout(() => {
      let responseContent = '';
      let suggestions: CODDASuggestion[] = [];
      
      const message = currentMessage.toLowerCase();
      
      if (message.includes('evidence') || message.includes('gap')) {
        responseContent = `I've analyzed the evidence for ${currentCase.id}. Currently, you have ${evidenceStats.total} evidence items with ${evidenceStats.gaps} identified gaps. The evidence shows ${evidenceStats.byReliability.high} high-reliability items from sources including eFolder and service records. Key missing items include command statements and complete medical records.`;
        suggestions = [
          { type: 'action', title: 'Generate Evidence Request', content: 'Create formal requests for missing evidence' },
          { type: 'evidence', title: 'Review Evidence Quality', content: 'Assess reliability ratings for existing items' }
        ];
      } else if (message.includes('regulation') || message.includes('law') || message.includes('cfr')) {
        responseContent = `For this case, the primary regulations are 38 CFR 3.12 (character of discharge), 3.354 (insanity exception), and 3.360 (healthcare eligibility). Based on the ${currentCase.service[0]?.charOfDischarge} discharge characterization, I recommend focusing on the misconduct provisions under 3.12(d) and considering compelling circumstances.`;
        suggestions = [
          { type: 'rule', title: 'View 38 CFR 3.12(d)', content: 'Open detailed regulation text' },
          { type: 'clause', title: 'Insert Regulation Citation', content: 'Add proper legal citations to document' }
        ];
      } else if (message.includes('insanity') || message.includes('mental') || message.includes('psychiatric')) {
        responseContent = `Regarding the insanity analysis for ${currentCase.claimant}, I see that insanity ${currentCase.finding.insanityConsidered ? 'has been' : 'needs to be'} considered. The standard under 38 CFR 3.354 requires evidence that the veteran was unable to distinguish right from wrong or adhere to the right due to mental illness during the time of misconduct.`;
        suggestions = [
          { type: 'clause', title: 'Insert Insanity Analysis', content: 'Add structured insanity consideration section' },
          { type: 'evidence', title: 'Review Mental Health Records', content: 'Examine psychiatric evaluations and treatment notes' }
        ];
      } else if (message.includes('draft') || message.includes('write') || message.includes('decision')) {
        responseContent = `I can help draft the decision for ${currentCase.id}. Based on the current evidence and ${currentCase.qa.completeness}% completion, I recommend starting with the issue statement, then building the evidence section, and proceeding through the analysis. Would you like me to suggest specific language for any section?`;
        suggestions = [
          { type: 'clause', title: 'Draft Issue Statement', content: 'Generate standard issue language' },
          { type: 'clause', title: 'Draft Evidence Section', content: 'Summarize considered evidence' },
          { type: 'clause', title: 'Draft Decision Statement', content: 'Create outcome determination' }
        ];
      } else {
        responseContent = `I understand you're working on ${currentCase.id}. I can help with evidence analysis, regulation interpretation, decision drafting, or quality review. The case is currently ${currentCase.qa.completeness}% complete with ${currentCase.qa.lintFlags.length} quality issues to address.`;
        suggestions = [
          { type: 'action', title: 'Quality Review', content: 'Check document for completeness and compliance' },
          { type: 'action', title: 'Evidence Gap Scan', content: 'Identify missing documentation' }
        ];
      }
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date().toISOString(),
        context: {
          caseId: currentCase.id
        },
        suggestions
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const runBiasAnalysis = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const mockAnalysis = {
        overallScore: Math.max(0, 100 - (Math.random() * 30)),
        issues: [
          {
            section: 'REASONS & BASES',
            text: 'clearly demonstrates',
            type: 'conclusory' as const,
            severity: 'medium' as const,
            suggestion: 'Replace with "the evidence shows" for more neutral tone'
          }
        ],
        suggestions: [
          'Use objective language throughout the decision',
          'Avoid conclusory statements without evidence support',
          'Consider alternative interpretations of evidence'
        ]
      };
      
      setBiasAnalysisResults(mockAnalysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const tabs = [
    { id: 'insights', label: 'Insights', icon: Brain, badge: '3' },
    { id: 'evidence', label: 'Evidence', icon: FileText, badge: evidenceStats.total.toString() },
    { id: 'bias', label: 'Bias Guard', icon: Shield, badge: currentCase.qa.lintFlags.length > 0 ? '!' : '✓' },
    { id: 'chat', label: 'QBit', icon: MessageSquare, badge: isQBitOnline ? '●' : '○' }
  ];

  return (
    <div className="w-96 border-l border-white/10 bg-slate-900/50 backdrop-blur-sm flex flex-col h-full">
      {/* Tab Headers */}
      <div className="border-b border-white/10 bg-slate-800/50">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm transition-colors relative ${
                activeTab === tab.id 
                  ? 'bg-slate-700 text-cyan-400 border-b-2 border-cyan-400 font-medium' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.badge && (
                <span className={`absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center font-bold ${
                  tab.badge === '!' ? 'bg-red-500 text-white' :
                  tab.badge === '●' ? 'bg-green-500 text-white' :
                  tab.badge === '○' ? 'bg-gray-400 text-white' :
                  tab.badge === '✓' ? 'bg-green-500 text-white' :
                  'bg-blue-500 text-white'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'insights' && (
          <div className="p-4 space-y-4">
            {/* Regulation Insights */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Applicable Regulations</h3>
              </div>
              <div className="space-y-3">
                {regulations.map(reg => (
                  <div key={reg.id} className="bg-white rounded p-3 border border-blue-100">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{reg.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{reg.summary}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        reg.relevance === 'high' ? 'bg-red-100 text-red-700' :
                        reg.relevance === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {reg.relevance}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{reg.sections.length} sections</span>
                      <button
                        onClick={() => {
                          setSelectedRegulation(reg.id);
                          setShowRegulationModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center gap-1"
                      >
                        View Details <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Case Analysis */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-900">Case Analysis</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-white rounded p-3 border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800">Service Characterization</span>
                    <span className="text-sm text-green-600">{currentCase.service[0]?.charOfDischarge}</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {currentCase.service[0]?.branch} service from {new Date(currentCase.service[0]?.start).getFullYear()} to {new Date(currentCase.service[0]?.end).getFullYear()}
                  </p>
                </div>
                
                <div className="bg-white rounded p-3 border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800">Key Considerations</span>
                  </div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      Insanity {currentCase.finding.insanityConsidered ? 'considered' : 'pending review'}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      Compelling circumstances {currentCase.finding.compellingCircumstancesConsidered ? 'evaluated' : 'pending'}
                    </li>
                    <li className="flex items-center gap-2">
                      {currentCase.ipr.required ? <AlertTriangle className="w-3 h-3 text-amber-500" /> : <CheckCircle className="w-3 h-3 text-green-500" />}
                      IPR {currentCase.ipr.required ? 'required' : 'not required'}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800">Quick Actions</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-2 bg-white rounded border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm">
                  <FileSearch className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                  Evidence Scan
                </button>
                <button className="p-2 bg-white rounded border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors text-sm">
                  <Scale className="w-4 h-4 mx-auto mb-1 text-green-600" />
                  Rule Analysis
                </button>
                <button className="p-2 bg-white rounded border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors text-sm">
                  <Edit className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                  Draft Helper
                </button>
                <button className="p-2 bg-white rounded border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-colors text-sm">
                  <CheckCircle className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                  QA Check
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'evidence' && (
          <div className="p-4 space-y-4">
            {/* Evidence Overview */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Evidence Overview
                </h3>
                <select
                  value={evidenceFilter}
                  onChange={(e) => setEvidenceFilter(e.target.value)}
                  className="text-xs border border-blue-300 rounded px-2 py-1 bg-white"
                >
                  <option value="all">All Evidence</option>
                  <option value="high">High Reliability</option>
                  <option value="gaps">Evidence Gaps</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white rounded p-2 border border-blue-100 text-center">
                  <div className="text-lg font-bold text-blue-600">{evidenceStats.total}</div>
                  <div className="text-xs text-gray-600">Total Items</div>
                </div>
                <div className="bg-white rounded p-2 border border-blue-100 text-center">
                  <div className="text-lg font-bold text-red-600">{evidenceStats.gaps}</div>
                  <div className="text-xs text-gray-600">Evidence Gaps</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-700 mb-2">By Reliability:</div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>High: {evidenceStats.byReliability.high}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span>Medium: {evidenceStats.byReliability.medium}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Low: {evidenceStats.byReliability.low}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Evidence Items */}
            <div className="space-y-3">
              {currentCase.evidence
                .filter(item => {
                  if (evidenceFilter === 'high') return item.reliability === 'high';
                  if (evidenceFilter === 'gaps') return item.isGap;
                  return true;
                })
                .map(item => (
                  <div key={item.id} className={`rounded-lg p-3 border ${
                    item.isGap ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{item.summary}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.reliability === 'high' ? 'bg-green-100 text-green-700' :
                          item.reliability === 'medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {item.reliability}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{item.source} • {item.date || 'No date'}</span>
                      <div className="flex items-center gap-2">
                        {item.isGap && (
                          <span className="text-red-600 font-medium">Missing</span>
                        )}
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>

            {/* Evidence Actions */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-3">Evidence Actions</h4>
              <div className="space-y-2">
                              <button 
                onClick={() => {
                  // Trigger advanced evidence viewer
                  const event = new CustomEvent('openEvidenceViewer');
                  window.dispatchEvent(event);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                <Search className="w-4 h-4" />
                Advanced Evidence Viewer
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm">
                <Download className="w-4 h-4" />
                Request Missing Evidence
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm">
                <Upload className="w-4 h-4" />
                Upload New Evidence
              </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'bias' && (
          <div className="p-4 space-y-4">
            {/* Bias Analysis Header */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-green-900 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Bias Analysis
                </h3>
                <button
                  onClick={runBiasAnalysis}
                  disabled={isAnalyzing}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
                </button>
              </div>
              
              {biasAnalysisResults ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Overall Score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 transition-all duration-500"
                          style={{ width: `${biasAnalysisResults.overallScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-green-600">
                        {Math.round(biasAnalysisResults.overallScore)}/100
                      </span>
                    </div>
                  </div>
                  
                  {biasAnalysisResults.issues.length > 0 && (
                    <div className="bg-white rounded p-3 border border-green-100">
                      <h4 className="font-medium text-gray-800 text-sm mb-2">Issues Found</h4>
                      {biasAnalysisResults.issues.map((issue: any, idx: number) => (
                        <div key={idx} className="mb-2 last:mb-0">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm text-gray-800">
                                <span className="font-medium">{issue.section}:</span> "{issue.text}"
                              </p>
                              <p className="text-xs text-gray-600 mt-1">{issue.suggestion}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click "Run Analysis" to check for potential bias in your document
                  </p>
                </div>
              )}
            </div>

            {/* Writing Guidelines */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Writing Guidelines
              </h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  Use neutral, objective language throughout
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  Avoid conclusory statements without evidence
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  Consider all evidence fairly and objectively
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  Address counter-evidence and alternative interpretations
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  Use precise regulatory language and citations
                </li>
              </ul>
            </div>

            {/* Common Issues */}
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Common Issues to Avoid
              </h4>
              <div className="space-y-2 text-sm">
                {[
                  { phrase: '"clearly shows"', suggestion: '"the evidence indicates"' },
                  { phrase: '"obviously"', suggestion: '"the record reflects"' },
                  { phrase: '"without question"', suggestion: '"based on the evidence"' },
                  { phrase: '"definitely"', suggestion: '"the findings support"' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white rounded p-2 border border-amber-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-red-600 font-medium">Avoid: {item.phrase}</span>
                      <span className="text-green-600">Use: {item.suggestion}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-800">QBit Assistant</span>
                  <div className={`w-2 h-2 rounded-full ${isQBitOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
                <div className="flex items-center gap-1">
                  <Tooltip content="QBit is online and ready to help">
                    {isQBitOnline ? <Wifi className="w-4 h-4 text-green-600" /> : <WifiOff className="w-4 h-4 text-red-600" />}
                  </Tooltip>
                  <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                AI assistant specialized in character of discharge determinations
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {chatMessages.map(message => (
                <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                  <div className={`max-w-[85%] rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <div className="text-sm leading-relaxed">{message.content}</div>
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="text-xs opacity-75 font-medium">Suggested actions:</div>
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            className="block w-full text-left text-xs p-2 bg-white/10 rounded hover:bg-white/20 transition-colors"
                            onClick={() => {
                              // Handle suggestion click
                              setCurrentMessage(suggestion.title);
                            }}
                          >
                            <div className="font-medium">{suggestion.title}</div>
                            <div className="opacity-75">{suggestion.content}</div>
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="text-xs opacity-50 mt-2">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Input */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={isQBitOnline ? "Ask QBit about regulations, evidence, or decision drafting..." : "QBit is offline"}
                  disabled={!isQBitOnline}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || !isQBitOnline}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
              
              {/* Quick suggestions */}
              <div className="mt-2 flex flex-wrap gap-1">
                {[
                  'Evidence gaps?',
                  'Applicable regulations?',
                  'Draft decision language?',
                  'Insanity analysis?'
                ].map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => setCurrentMessage(suggestion)}
                    className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Regulation Modal */}
      <Modal
        isOpen={showRegulationModal}
        onClose={() => setShowRegulationModal(false)}
        title="Regulation Details"
        size="lg"
      >
        {selectedRegulation && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                {regulations.find(r => r.id === selectedRegulation)?.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {regulations.find(r => r.id === selectedRegulation)?.summary}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Sections:</h4>
              <ul className="space-y-1">
                {regulations.find(r => r.id === selectedRegulation)?.sections.map(section => (
                  <li key={section} className="text-sm text-gray-700 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {section}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This regulation has high relevance to your current case. 
                Consider incorporating specific citations in your decision document.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
