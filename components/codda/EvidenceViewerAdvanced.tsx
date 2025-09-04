'use client';

import React, { useState } from 'react';
import { 
  FileText,
  Eye,
  Download,
  Edit,
  Share2,
  Star,
  StarOff,
  Calendar,
  User,
  Building,
  Tag,
  AlertTriangle,
  CheckCircle,
  Info,
  ExternalLink,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  BarChart3,
  PieChart,
  TrendingUp,
  Clock,
  MapPin,
  Phone,
  Mail,
  FileImage,
  Archive,
  Bookmark,
  Flag,
  MessageSquare,
  Paperclip,
  Zap,
  Shield,
  Target,
  Award,
  Activity,
  Database,
  Link,
  Copy,
  Trash2,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  X,
  Plus
} from 'lucide-react';
import { EvidenceItem, CODCase } from '@/types/codda';
import Tooltip from './ui/Tooltip';
import Modal from './ui/Modal';

interface EvidenceViewerAdvancedProps {
  currentCase: CODCase;
  isOpen: boolean;
  onClose: () => void;
}

interface EvidenceAnalysis {
  reliabilityScore: number;
  relevanceScore: number;
  completenessScore: number;
  credibilityFactors: string[];
  potentialIssues: string[];
  recommendations: string[];
}

export default function EvidenceViewerAdvanced({ 
  currentCase, 
  isOpen, 
  onClose 
}: EvidenceViewerAdvancedProps) {
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'timeline'>('list');
  const [sortBy, setSortBy] = useState<'date' | 'reliability' | 'relevance' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterBy, setFilterBy] = useState<'all' | 'high' | 'medium' | 'low' | 'gaps'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Enhanced evidence analysis
  const analyzeEvidence = (evidence: EvidenceItem): EvidenceAnalysis => {
    const reliabilityScore = evidence.reliability === 'high' ? 95 : 
                           evidence.reliability === 'medium' ? 70 : 45;
    
    const relevanceScore = evidence.tags?.includes('discharge') ? 95 :
                          evidence.tags?.includes('misconduct') ? 90 :
                          evidence.tags?.includes('mental-health') ? 85 :
                          evidence.tags?.includes('combat') ? 80 : 60;
    
    const completenessScore = evidence.summary && evidence.date && evidence.source ? 90 : 
                             evidence.summary && evidence.source ? 70 : 50;

    return {
      reliabilityScore,
      relevanceScore,
      completenessScore,
      credibilityFactors: [
        evidence.source === 'eFolder' ? 'Official VA source' : '',
        evidence.date ? 'Contemporaneous documentation' : '',
        evidence.reliability === 'high' ? 'High reliability rating' : '',
        evidence.tags?.includes('official') ? 'Official document type' : ''
      ].filter(Boolean),
      potentialIssues: [
        evidence.isGap ? 'Missing evidence item' : '',
        !evidence.date ? 'No date specified' : '',
        evidence.reliability === 'low' ? 'Low reliability concerns' : '',
        evidence.source === 'External' ? 'External source verification needed' : ''
      ].filter(Boolean),
      recommendations: [
        evidence.isGap ? 'Request from appropriate source immediately' : '',
        evidence.reliability === 'medium' ? 'Consider corroborating evidence' : '',
        evidence.tags?.includes('mental-health') ? 'Review with medical expert' : '',
        !evidence.summary ? 'Add detailed summary for better analysis' : ''
      ].filter(Boolean)
    };
  };

  // Filter and sort evidence
  const filteredEvidence = currentCase.evidence
    .filter(item => {
      if (filterBy === 'gaps') return item.isGap;
      if (filterBy !== 'all') return item.reliability === filterBy;
      return true;
    })
    .filter(item => 
      searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(item => 
      selectedTags.length === 0 ||
      selectedTags.some(tag => item.tags?.includes(tag))
    )
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date || '1900-01-01').getTime() - new Date(b.date || '1900-01-01').getTime();
          break;
        case 'reliability':
          const reliabilityOrder = { high: 3, medium: 2, low: 1 };
          comparison = reliabilityOrder[a.reliability] - reliabilityOrder[b.reliability];
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  // Get all unique tags
  const allTags = Array.from(new Set(
    currentCase.evidence.flatMap(item => item.tags || [])
  ));

  const getFileIcon = (kind: string) => {
    switch (kind) {
      case 'STR': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'SPR': return <FileText className="w-5 h-5 text-green-500" />;
      case 'ChargeSheet': return <FileText className="w-5 h-5 text-red-500" />;
      case 'CourtMartial': return <FileText className="w-5 h-5 text-purple-500" />;
      case 'SeparationPacket': return <Archive className="w-5 h-5 text-amber-500" />;
      case 'Lay': return <MessageSquare className="w-5 h-5 text-cyan-500" />;
      case 'Treatment': return <FileText className="w-5 h-5 text-pink-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getReliabilityColor = (reliability: string) => {
    switch (reliability) {
      case 'high': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-amber-400 bg-amber-500/20';
      case 'low': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const renderEvidenceCard = (evidence: EvidenceItem) => {
    const analysis = analyzeEvidence(evidence);
    
    return (
      <div
        key={evidence.id}
        className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
          evidence.isGap 
            ? 'border-red-500/50 bg-red-500/5' 
            : 'border-white/10 bg-slate-800/30 hover:border-cyan-500/50 hover:bg-slate-700/30'
        }`}
        onClick={() => setSelectedEvidence(evidence)}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {getFileIcon(evidence.kind)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-white text-sm leading-tight truncate">
                {evidence.title}
              </h3>
              <div className="flex items-center gap-1 ml-2">
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${getReliabilityColor(evidence.reliability)}`}>
                  {evidence.reliability}
                </span>
              </div>
            </div>
            
            <p className="text-gray-400 text-xs mb-2 line-clamp-2">
              {evidence.summary || 'No summary available'}
            </p>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {evidence.date || 'No date'}
                </span>
                <span className="flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  {evidence.source}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                {evidence.isGap && (
                  <span className="text-red-400 font-medium">Missing</span>
                )}
                <button className="text-cyan-400 hover:text-cyan-300">
                  <Eye className="w-3 h-3" />
                </button>
              </div>
            </div>
            
            {/* Tags */}
            {evidence.tags && evidence.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {evidence.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-1.5 py-0.5 bg-slate-700 text-gray-300 text-xs rounded">
                    {tag}
                  </span>
                ))}
                {evidence.tags.length > 3 && (
                  <span className="px-1.5 py-0.5 bg-slate-600 text-gray-400 text-xs rounded">
                    +{evidence.tags.length - 3}
                  </span>
                )}
              </div>
            )}
            
            {/* Quality indicators */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <div className="w-12 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${analysis.reliabilityScore}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">Quality</span>
              </div>
              
              <div className="flex items-center gap-1">
                <div className="w-12 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${analysis.relevanceScore}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">Relevance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTimelineView = () => {
    const sortedByDate = [...filteredEvidence].sort((a, b) => 
      new Date(a.date || '1900-01-01').getTime() - new Date(b.date || '1900-01-01').getTime()
    );

    return (
      <div className="space-y-4">
        {sortedByDate.map((evidence, index) => (
          <div key={evidence.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${
                evidence.isGap ? 'bg-red-500' :
                evidence.reliability === 'high' ? 'bg-green-500' :
                evidence.reliability === 'medium' ? 'bg-amber-500' :
                'bg-gray-500'
              }`} />
              {index < sortedByDate.length - 1 && (
                <div className="w-0.5 h-16 bg-slate-700 mt-2" />
              )}
            </div>
            
            <div className="flex-1 pb-8">
              <div className="bg-slate-800/30 rounded-lg p-4 border border-white/10">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-white text-sm">{evidence.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {evidence.date ? new Date(evidence.date).toLocaleDateString() : 'Date unknown'} • {evidence.source}
                    </p>
                  </div>
                  {getFileIcon(evidence.kind)}
                </div>
                
                <p className="text-gray-300 text-sm mb-3">
                  {evidence.summary || 'No summary available'}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs rounded-full ${getReliabilityColor(evidence.reliability)}`}>
                    {evidence.reliability} reliability
                  </span>
                  
                  <button
                    onClick={() => setSelectedEvidence(evidence)}
                    className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1"
                  >
                    View Details <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Evidence Analysis Center"
      size="full"
    >
      <div className="flex h-[80vh] gap-6">
        {/* Left Panel - Evidence List */}
        <div className="w-1/2 flex flex-col">
          {/* Controls */}
          <div className="mb-4 space-y-3">
            {/* Search and filters */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search evidence items..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">All Evidence</option>
                <option value="high">High Reliability</option>
                <option value="medium">Medium Reliability</option>
                <option value="low">Low Reliability</option>
                <option value="gaps">Evidence Gaps</option>
              </select>
            </div>

            {/* View and sort controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">View:</span>
                <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-white'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-white'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('timeline')}
                    className={`p-2 transition-colors ${viewMode === 'timeline' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-white'}`}
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-800 border border-white/10 rounded px-2 py-1 text-sm text-gray-200"
                >
                  <option value="date">Date</option>
                  <option value="reliability">Reliability</option>
                  <option value="title">Title</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-1 text-gray-400 hover:text-white rounded transition-colors"
                >
                  {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Tag filters */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {allTags.slice(0, 8).map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTags(prev => 
                        prev.includes(tag) 
                          ? prev.filter(t => t !== tag)
                          : [...prev, tag]
                      );
                    }}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
                {allTags.length > 8 && (
                  <span className="px-2 py-1 text-xs bg-slate-700 text-gray-400 rounded">
                    +{allTags.length - 8} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Evidence List */}
          <div className="flex-1 overflow-y-auto">
            {viewMode === 'timeline' ? (
              renderTimelineView()
            ) : (
              <div className={`space-y-3 ${viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : ''}`}>
                {filteredEvidence.map(evidence => renderEvidenceCard(evidence))}
              </div>
            )}
            
            {filteredEvidence.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 mb-2">No evidence items found</p>
                <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Evidence Details */}
        <div className="w-1/2 border-l border-white/10 pl-6">
          {selectedEvidence ? (
            <div className="space-y-6">
              {/* Evidence Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getFileIcon(selectedEvidence.kind)}
                    <h2 className="text-lg font-semibold text-white">{selectedEvidence.title}</h2>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {selectedEvidence.date || 'No date'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Database className="w-4 h-4" />
                      {selectedEvidence.source}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getReliabilityColor(selectedEvidence.reliability)}`}>
                      {selectedEvidence.reliability} reliability
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Tooltip content="Download evidence">
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </Tooltip>
                  <Tooltip content="Share evidence">
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </Tooltip>
                </div>
              </div>

              {/* Evidence Analysis */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  Evidence Analysis
                </h3>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[
                    { label: 'Reliability', score: analyzeEvidence(selectedEvidence).reliabilityScore, color: 'green' },
                    { label: 'Relevance', score: analyzeEvidence(selectedEvidence).relevanceScore, color: 'blue' },
                    { label: 'Completeness', score: analyzeEvidence(selectedEvidence).completenessScore, color: 'purple' }
                  ].map(metric => (
                    <div key={metric.label} className="text-center">
                      <div className="relative w-16 h-16 mx-auto mb-2">
                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="rgb(51 65 85)"
                            strokeWidth="2"
                          />
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={metric.color === 'green' ? 'rgb(34 197 94)' : 
                                   metric.color === 'blue' ? 'rgb(59 130 246)' : 'rgb(168 85 247)'}
                            strokeWidth="2"
                            strokeDasharray={`${metric.score}, 100`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">{metric.score}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400">{metric.label}</p>
                    </div>
                  ))}
                </div>
                
                {/* Detailed analysis */}
                <div className="space-y-3">
                  {analyzeEvidence(selectedEvidence).credibilityFactors.length > 0 && (
                    <div>
                      <h4 className="font-medium text-green-400 text-sm mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Credibility Factors
                      </h4>
                      <ul className="space-y-1">
                        {analyzeEvidence(selectedEvidence).credibilityFactors.map((factor, idx) => (
                          <li key={idx} className="text-xs text-gray-300 flex items-center gap-2">
                            <div className="w-1 h-1 bg-green-400 rounded-full" />
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {analyzeEvidence(selectedEvidence).potentialIssues.length > 0 && (
                    <div>
                      <h4 className="font-medium text-amber-400 text-sm mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Potential Issues
                      </h4>
                      <ul className="space-y-1">
                        {analyzeEvidence(selectedEvidence).potentialIssues.map((issue, idx) => (
                          <li key={idx} className="text-xs text-gray-300 flex items-center gap-2">
                            <div className="w-1 h-1 bg-amber-400 rounded-full" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {analyzeEvidence(selectedEvidence).recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium text-blue-400 text-sm mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Recommendations
                      </h4>
                      <ul className="space-y-1">
                        {analyzeEvidence(selectedEvidence).recommendations.map((rec, idx) => (
                          <li key={idx} className="text-xs text-gray-300 flex items-center gap-2">
                            <div className="w-1 h-1 bg-blue-400 rounded-full" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Evidence Content */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  Evidence Summary
                </h3>
                
                <div className="prose prose-sm prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed">
                    {selectedEvidence.summary || 'No detailed summary available for this evidence item.'}
                  </p>
                </div>
                
                {selectedEvidence.url && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm">
                      <ExternalLink className="w-4 h-4" />
                      View Original Document
                    </button>
                  </div>
                )}
              </div>

              {/* Tags and metadata */}
              <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-cyan-400" />
                  Metadata & Tags
                </h3>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Evidence Type:</span>
                      <span className="text-gray-200 ml-2 font-medium">{selectedEvidence.kind}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Source:</span>
                      <span className="text-gray-200 ml-2 font-medium">{selectedEvidence.source}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Date:</span>
                      <span className="text-gray-200 ml-2 font-medium">{selectedEvidence.date || 'Unknown'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Reliability:</span>
                      <span className={`ml-2 font-medium capitalize ${
                        selectedEvidence.reliability === 'high' ? 'text-green-400' :
                        selectedEvidence.reliability === 'medium' ? 'text-amber-400' :
                        'text-red-400'
                      }`}>
                        {selectedEvidence.reliability}
                      </span>
                    </div>
                  </div>
                  
                  {selectedEvidence.tags && selectedEvidence.tags.length > 0 && (
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Tags:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedEvidence.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-slate-700 text-gray-300 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors">
                  <Edit className="w-4 h-4" />
                  Edit Evidence
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
                  <Link className="w-4 h-4" />
                  Link to Section
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-300 mb-2">Select Evidence Item</h3>
                <p className="text-gray-500">Choose an evidence item from the list to view detailed analysis and metadata</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-4 gap-4 pt-6 border-t border-white/10">
        <div className="bg-slate-800/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white mb-1">{currentCase.evidence.length}</div>
          <div className="text-xs text-gray-400">Total Evidence</div>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">
            {currentCase.evidence.filter(e => e.reliability === 'high').length}
          </div>
          <div className="text-xs text-gray-400">High Reliability</div>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-400 mb-1">
            {currentCase.evidence.filter(e => e.isGap).length}
          </div>
          <div className="text-xs text-gray-400">Evidence Gaps</div>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-cyan-400 mb-1">
            {Math.round(currentCase.evidence.filter(e => !e.isGap).length / Math.max(1, currentCase.evidence.length) * 100)}%
          </div>
          <div className="text-xs text-gray-400">Completeness</div>
        </div>
      </div>
    </Modal>
  );
}
