'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Brain,
  Eye,
  Edit,
  RefreshCw,
  Download,
  Settings,
  Info,
  Lightbulb,
  Search,
  Filter,
  Flag,
  Award,
  Star,
  Clock,
  Activity,
  Gauge,
  LineChart,
  Hash,
  Type,
  FileText,
  MessageSquare,
  Book,
  Scale,
  Gavel,
  Users,
  Heart,
  Smile,
  Frown,
  Meh,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { CODCase } from '@/types/codda';
import Tooltip from './ui/Tooltip';
import Modal from './ui/Modal';

interface BiasGuardAdvancedProps {
  currentCase: CODCase;
  documentContent: string;
  onContentUpdate?: (updatedContent: string) => void;
}

interface BiasAnalysisDetailed {
  overallScore: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  objectivityScore: number;
  professionalismScore: number;
  clarityScore: number;
  consistencyScore: number;
  issues: BiasIssueDetailed[];
  suggestions: BiasSuggestion[];
  flaggedPhrases: FlaggedPhrase[];
  sectionAnalysis: SectionAnalysis[];
  complianceChecks: ComplianceCheck[];
  improvementAreas: ImprovementArea[];
}

interface BiasIssueDetailed {
  id: string;
  section: string;
  text: string;
  type: 'subjective' | 'adversarial' | 'conclusory' | 'emotional' | 'informal';
  severity: 'low' | 'medium' | 'high' | 'critical';
  suggestion: string;
  position: { start: number; end: number };
  confidence: number;
}

interface BiasSuggestion {
  id: string;
  category: 'language' | 'structure' | 'evidence' | 'legal';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  implementation: string;
}

interface FlaggedPhrase {
  phrase: string;
  replacement: string;
  context: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  occurrences: number;
}

interface SectionAnalysis {
  section: string;
  score: number;
  wordCount: number;
  issues: number;
  completeness: number;
  recommendations: string[];
}

interface ComplianceCheck {
  rule: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
  requirement: string;
}

interface ImprovementArea {
  area: string;
  currentScore: number;
  targetScore: number;
  actions: string[];
  priority: 'low' | 'medium' | 'high';
}

export default function BiasGuardAdvanced({ 
  currentCase, 
  documentContent,
  onContentUpdate 
}: BiasGuardAdvancedProps) {
  const [analysisResults, setAnalysisResults] = useState<BiasAnalysisDetailed | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<BiasIssueDetailed | null>(null);
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const [autoAnalyze, setAutoAnalyze] = useState(true);
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);

  // Run comprehensive bias analysis
  const runBiasAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate comprehensive analysis
    setTimeout(() => {
      const mockAnalysis: BiasAnalysisDetailed = {
        overallScore: Math.floor(Math.random() * 20) + 75, // 75-95
        sentiment: 'neutral',
        objectivityScore: Math.floor(Math.random() * 15) + 80,
        professionalismScore: Math.floor(Math.random() * 10) + 85,
        clarityScore: Math.floor(Math.random() * 20) + 70,
        consistencyScore: Math.floor(Math.random() * 15) + 80,
        
        issues: [
          {
            id: 'issue-1',
            section: 'REASONS & BASES',
            text: 'clearly demonstrates',
            type: 'conclusory',
            severity: 'medium',
            suggestion: 'Replace with "the evidence indicates" for more objective language',
            position: { start: 245, end: 262 },
            confidence: 85
          },
          {
            id: 'issue-2', 
            section: 'ANALYSIS',
            text: 'obviously',
            type: 'subjective',
            severity: 'high',
            suggestion: 'Use "the record reflects" instead of conclusory language',
            position: { start: 156, end: 165 },
            confidence: 92
          },
          {
            id: 'issue-3',
            section: 'DECISION',
            text: 'without question',
            type: 'conclusory',
            severity: 'critical',
            suggestion: 'Replace with "based on the preponderance of evidence"',
            position: { start: 89, end: 104 },
            confidence: 98
          }
        ],
        
        suggestions: [
          {
            id: 'sug-1',
            category: 'language',
            title: 'Use More Neutral Language',
            description: 'Replace conclusory phrases with evidence-based statements',
            impact: 'high',
            implementation: 'Review flagged phrases and apply suggested replacements'
          },
          {
            id: 'sug-2',
            category: 'structure',
            title: 'Improve Evidence Citations',
            description: 'Add specific citations to support each finding',
            impact: 'medium',
            implementation: 'Link each conclusion to specific evidence items'
          },
          {
            id: 'sug-3',
            category: 'legal',
            title: 'Strengthen Regulatory Analysis',
            description: 'Include more detailed regulation citations and explanations',
            impact: 'high',
            implementation: 'Add specific CFR subsection references'
          }
        ],
        
        flaggedPhrases: [
          { phrase: 'clearly shows', replacement: 'the evidence indicates', context: 'Evidence analysis', severity: 'medium', occurrences: 2 },
          { phrase: 'obviously', replacement: 'the record reflects', context: 'Factual statements', severity: 'high', occurrences: 1 },
          { phrase: 'without question', replacement: 'based on the evidence', context: 'Conclusions', severity: 'critical', occurrences: 1 },
          { phrase: 'definitely proves', replacement: 'supports the finding that', context: 'Legal conclusions', severity: 'high', occurrences: 1 }
        ],
        
        sectionAnalysis: [
          { section: 'ISSUE', score: 95, wordCount: 25, issues: 0, completeness: 100, recommendations: ['Section complete and compliant'] },
          { section: 'EVIDENCE', score: 78, wordCount: 156, issues: 1, completeness: 85, recommendations: ['Add more specific evidence citations'] },
          { section: 'LAWS/REGS', score: 88, wordCount: 89, issues: 0, completeness: 90, recommendations: ['Consider adding subsection references'] },
          { section: 'ANALYSIS', score: 65, wordCount: 234, issues: 3, completeness: 75, recommendations: ['Remove conclusory language', 'Add evidence support'] },
          { section: 'DECISION', score: 82, wordCount: 67, issues: 1, completeness: 95, recommendations: ['Strengthen legal basis statement'] },
          { section: 'FAVORABLE', score: 90, wordCount: 45, issues: 0, completeness: 80, recommendations: ['Complete section'] }
        ],
        
        complianceChecks: [
          { rule: 'Insanity Consideration', status: 'pass', description: 'Insanity properly addressed', requirement: '38 CFR 3.354' },
          { rule: 'Healthcare Eligibility', status: 'pass', description: 'Healthcare eligibility analyzed', requirement: '38 CFR 3.360' },
          { rule: 'Evidence Traceability', status: 'warning', description: 'Some findings lack specific evidence citations', requirement: 'M21-1 procedures' },
          { rule: 'Neutral Language', status: 'fail', description: 'Conclusory language detected', requirement: 'Writing standards' },
          { rule: 'Template Compliance', status: 'pass', description: 'All required sections present', requirement: 'Template requirements' }
        ],
        
        improvementAreas: [
          {
            area: 'Objective Language',
            currentScore: 65,
            targetScore: 90,
            actions: ['Remove conclusory phrases', 'Add evidence-based language', 'Use neutral descriptors'],
            priority: 'high'
          },
          {
            area: 'Evidence Citations',
            currentScore: 78,
            targetScore: 95,
            actions: ['Add specific document references', 'Include page numbers', 'Link findings to evidence'],
            priority: 'medium'
          },
          {
            area: 'Regulatory Analysis',
            currentScore: 82,
            targetScore: 95,
            actions: ['Add CFR subsection references', 'Include regulatory explanations', 'Cite relevant precedents'],
            priority: 'medium'
          }
        ]
      };
      
      setAnalysisResults(mockAnalysis);
      setAnalysisHistory(prev => [...prev.slice(-4), {
        timestamp: new Date(),
        score: mockAnalysis.overallScore,
        issues: mockAnalysis.issues.length
      }]);
      setIsAnalyzing(false);
    }, 2500);
  };

  // Auto-analyze when content changes
  useEffect(() => {
    if (autoAnalyze && documentContent) {
      const timeoutId = setTimeout(runBiasAnalysis, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [documentContent, autoAnalyze]);

  const applySuggestion = (issue: BiasIssueDetailed) => {
    if (onContentUpdate && documentContent) {
      const updatedContent = documentContent.replace(issue.text, issue.suggestion);
      onContentUpdate(updatedContent);
      
      // Remove the issue from analysis
      if (analysisResults) {
        setAnalysisResults({
          ...analysisResults,
          issues: analysisResults.issues.filter(i => i.id !== issue.id)
        });
      }
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-amber-400 bg-amber-500/20';
      case 'low': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Analysis Header */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            Advanced Bias Analysis
          </h3>
          
          <div className="flex items-center gap-2">
            <Tooltip content="Auto-analyze on content changes">
              <button
                onClick={() => setAutoAnalyze(!autoAnalyze)}
                className={`p-2 rounded transition-colors ${
                  autoAnalyze ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Zap className="w-4 h-4" />
              </button>
            </Tooltip>
            
            <button
              onClick={runBiasAnalysis}
              disabled={isAnalyzing}
              className="px-3 py-2 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
              {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
            </button>
          </div>
        </div>
        
        {analysisResults && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Overall Score', value: analysisResults.overallScore, icon: Gauge },
              { label: 'Objectivity', value: analysisResults.objectivityScore, icon: Scale },
              { label: 'Professionalism', value: analysisResults.professionalismScore, icon: Award },
              { label: 'Clarity', value: analysisResults.clarityScore, icon: Eye }
            ].map(metric => (
              <div key={metric.label} className="bg-slate-700/30 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <metric.icon className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-gray-400">{metric.label}</span>
                </div>
                <div className={`text-xl font-bold ${getScoreColor(metric.value)}`}>
                  {metric.value}
                </div>
                <div className="w-full h-1 bg-slate-700 rounded-full mt-2 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      metric.value >= 90 ? 'bg-green-500' :
                      metric.value >= 80 ? 'bg-blue-500' :
                      metric.value >= 70 ? 'bg-amber-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Issues Detection */}
      {analysisResults && analysisResults.issues.length > 0 && (
        <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Detected Issues ({analysisResults.issues.length})
            </h3>
            
            <button
              onClick={() => setShowDetailedReport(true)}
              className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1"
            >
              View Report <FileText className="w-3 h-3" />
            </button>
          </div>
          
          <div className="space-y-3">
            {analysisResults.issues.slice(0, 3).map(issue => (
              <div key={issue.id} className="bg-slate-700/30 rounded-lg p-3 border border-white/5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getSeverityColor(issue.severity)}`}>
                        {issue.severity}
                      </span>
                      <span className="text-xs text-gray-400">{issue.section}</span>
                      <span className="text-xs text-gray-500">{issue.confidence}% confidence</span>
                    </div>
                    <p className="text-sm text-gray-300">
                      <span className="bg-red-500/20 text-red-300 px-1 rounded">"{issue.text}"</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{issue.suggestion}</p>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Tooltip content="Apply suggestion">
                      <button
                        onClick={() => applySuggestion(issue)}
                        className="p-1 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    </Tooltip>
                    
                    <Tooltip content="View details">
                      <button
                        onClick={() => setSelectedIssue(issue)}
                        className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))}
            
            {analysisResults.issues.length > 3 && (
              <button
                onClick={() => setShowDetailedReport(true)}
                className="w-full text-center text-cyan-400 hover:text-cyan-300 text-sm py-2"
              >
                View all {analysisResults.issues.length} issues
              </button>
            )}
          </div>
        </div>
      )}

      {/* Flagged Phrases */}
      {analysisResults && analysisResults.flaggedPhrases.length > 0 && (
        <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Flag className="w-5 h-5 text-red-400" />
            Flagged Phrases
          </h3>
          
          <div className="space-y-2">
            {analysisResults.flaggedPhrases.map((phrase, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-700/30 rounded border border-white/5">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-red-300 font-mono text-sm">"{phrase.phrase}"</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-green-300 font-mono text-sm">"{phrase.replacement}"</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{phrase.context}</span>
                    <span>•</span>
                    <span>{phrase.occurrences} occurrence{phrase.occurrences !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    if (onContentUpdate && documentContent) {
                      const updatedContent = documentContent.replace(
                        new RegExp(phrase.phrase, 'gi'),
                        phrase.replacement
                      );
                      onContentUpdate(updatedContent);
                    }
                  }}
                  className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-xs hover:bg-green-500/30 transition-colors"
                >
                  Replace All
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section Analysis */}
      {analysisResults && (
        <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Section Analysis
          </h3>
          
          <div className="space-y-3">
            {analysisResults.sectionAnalysis.map(section => (
              <div key={section.section} className="bg-slate-700/30 rounded-lg p-3 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-200">{section.section}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${getScoreColor(section.score)}`}>
                      {section.score}/100
                    </span>
                    <div className="w-16 h-2 bg-slate-600 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          section.score >= 90 ? 'bg-green-500' :
                          section.score >= 80 ? 'bg-blue-500' :
                          section.score >= 70 ? 'bg-amber-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${section.score}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-xs text-gray-400 mb-2">
                  <span>{section.wordCount} words</span>
                  <span>{section.issues} issue{section.issues !== 1 ? 's' : ''}</span>
                  <span>{section.completeness}% complete</span>
                </div>
                
                {section.recommendations.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-blue-400 mb-1">Recommendations:</p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      {section.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <div className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improvement Roadmap */}
      {analysisResults && analysisResults.improvementAreas.length > 0 && (
        <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Improvement Roadmap
          </h3>
          
          <div className="space-y-4">
            {analysisResults.improvementAreas.map(area => (
              <div key={area.area} className="bg-slate-700/30 rounded-lg p-4 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-200">{area.area}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    area.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                    area.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {area.priority} priority
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span>Current: {area.currentScore}</span>
                      <span>Target: {area.targetScore}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-600 rounded-full overflow-hidden">
                      <div className="relative h-full">
                        <div 
                          className="h-full bg-red-500 transition-all duration-500"
                          style={{ width: `${area.currentScore}%` }}
                        />
                        <div 
                          className="absolute top-0 h-full w-1 bg-green-400"
                          style={{ left: `${area.targetScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-300">
                    +{area.targetScore - area.currentScore}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-gray-400 mb-2">Action Items:</p>
                  <ul className="space-y-1">
                    {area.actions.map((action, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                        <CheckCircle className="w-3 h-3 text-gray-500" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis History */}
      {analysisHistory.length > 0 && (
        <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            Analysis History
          </h3>
          
          <div className="space-y-2">
            {analysisHistory.slice(-5).map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">
                    {entry.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${getScoreColor(entry.score)}`}>
                    Score: {entry.score}
                  </span>
                  <span className="text-sm text-gray-400">
                    {entry.issues} issue{entry.issues !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 p-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
            <Edit className="w-4 h-4" />
            Fix All Issues
          </button>
          
          <button className="flex items-center justify-center gap-2 p-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          
          <button className="flex items-center justify-center gap-2 p-3 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors">
            <Brain className="w-4 h-4" />
            AI Suggestions
          </button>
          
          <button className="flex items-center justify-center gap-2 p-3 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors">
            <Settings className="w-4 h-4" />
            Configure Rules
          </button>
        </div>
      </div>

      {/* Detailed Report Modal */}
      <Modal
        isOpen={showDetailedReport}
        onClose={() => setShowDetailedReport(false)}
        title="Comprehensive Bias Analysis Report"
        size="xl"
      >
        {analysisResults && (
          <div className="space-y-6">
            {/* Executive Summary */}
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-3">Executive Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-300 mb-2">
                    Overall bias score of <span className={`font-bold ${getScoreColor(analysisResults.overallScore)}`}>
                      {analysisResults.overallScore}/100
                    </span> indicates {
                      analysisResults.overallScore >= 90 ? 'excellent' :
                      analysisResults.overallScore >= 80 ? 'good' :
                      analysisResults.overallScore >= 70 ? 'fair' : 'poor'
                    } objectivity.
                  </p>
                  <p className="text-sm text-gray-400">
                    Document sentiment: <span className="capitalize text-gray-300">{analysisResults.sentiment}</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-300 mb-2">
                    {analysisResults.issues.length} issues detected across {analysisResults.sectionAnalysis.length} sections.
                  </p>
                  <p className="text-sm text-gray-400">
                    Priority: {analysisResults.issues.filter(i => i.severity === 'critical' || i.severity === 'high').length} high-priority fixes needed.
                  </p>
                </div>
              </div>
            </div>

            {/* All Issues */}
            <div>
              <h3 className="font-semibold text-white mb-3">All Detected Issues</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {analysisResults.issues.map(issue => (
                  <div key={issue.id} className="p-3 bg-slate-700/30 rounded border border-white/5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 text-xs rounded ${getSeverityColor(issue.severity)}`}>
                            {issue.severity}
                          </span>
                          <span className="text-xs text-gray-400">{issue.section}</span>
                        </div>
                        <p className="text-sm text-gray-300">"{issue.text}"</p>
                        <p className="text-xs text-gray-400 mt-1">{issue.suggestion}</p>
                      </div>
                      <button
                        onClick={() => applySuggestion(issue)}
                        className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs hover:bg-green-500/30"
                      >
                        Fix
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Issue Detail Modal */}
      <Modal
        isOpen={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
        title="Issue Details"
        size="lg"
      >
        {selectedIssue && (
          <div className="space-y-4">
            <div className="bg-slate-700/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1 text-sm rounded-full ${getSeverityColor(selectedIssue.severity)}`}>
                  {selectedIssue.severity} severity
                </span>
                <span className="text-sm text-gray-400">{selectedIssue.confidence}% confidence</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Flagged Text:</p>
                  <p className="text-lg text-red-300 font-mono bg-red-500/10 p-2 rounded">
                    "{selectedIssue.text}"
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-1">Suggested Replacement:</p>
                  <p className="text-lg text-green-300 font-mono bg-green-500/10 p-2 rounded">
                    "{selectedIssue.suggestion}"
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-1">Issue Type:</p>
                  <p className="text-gray-300 capitalize">{selectedIssue.type}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-1">Section:</p>
                  <p className="text-gray-300">{selectedIssue.section}</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => applySuggestion(selectedIssue)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Apply Suggestion
              </button>
              <button
                onClick={() => setSelectedIssue(null)}
                className="px-4 py-2 bg-slate-600 text-gray-300 rounded-lg hover:bg-slate-500 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
