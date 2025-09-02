'use client';

import React, { useState } from 'react';
import { 
  Target, Zap, Clock, Calendar, CheckCircle, Circle,
  ArrowRight, Download, Send, Printer, BookOpen, Phone,
  Mail, FileText, AlertTriangle, TrendingUp, Award,
  ChevronRight, Star, Flag, Sparkles, Rocket, Shield,
  Brain, Heart, Activity, Gauge, ChevronDown, Copy,
  ExternalLink, Play, CheckSquare, Square
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Recommendation {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'evidence' | 'medical' | 'administrative' | 'strategic';
  action: string;
  impact: string;
  timeframe: string;
  effort: 'low' | 'medium' | 'high';
  cost: 'free' | 'low' | 'medium' | 'high';
  successRate: number;
  steps?: string[];
  resources?: Array<{
    name: string;
    type: 'document' | 'website' | 'phone' | 'email';
    link?: string;
  }>;
  dependencies?: string[];
  estimatedCompletion?: string;
  potentialIncrease?: number;
}

interface RecommendationsViewEnhancedProps {
  recommendations: Recommendation[];
  veteranData?: any;
  onActionClick?: (action: string) => void;
}

export default function RecommendationsViewEnhanced({ 
  recommendations, 
  veteranData,
  onActionClick 
}: RecommendationsViewEnhancedProps) {
  const [expandedRec, setExpandedRec] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, Set<number>>>({});
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'timeline' | 'matrix'>('cards');

  // Enhanced recommendations with full details
  const enhancedRecommendations: Recommendation[] = recommendations.map((rec, idx) => ({
    ...rec,
    id: `rec-${idx}`,
    category: rec.category || 'strategic',
    effort: rec.effort || 'medium',
    cost: rec.cost || 'low',
    successRate: rec.successRate || 75 + Math.random() * 25,
    potentialIncrease: rec.potentialIncrease || Math.floor(Math.random() * 30 + 10),
    estimatedCompletion: rec.estimatedCompletion || '2-4 weeks',
    steps: rec.steps || [
      'Gather required documentation',
      'Schedule appointment with provider',
      'Submit forms to VA',
      'Follow up on status'
    ],
    resources: rec.resources || [
      { name: 'VA Form 21-526EZ', type: 'document', link: '#' },
      { name: 'VA Benefits Hotline', type: 'phone', link: 'tel:1-800-827-1000' },
      { name: 'Submit Online', type: 'website', link: 'https://va.gov' }
    ]
  }));

  // Filter recommendations
  const filteredRecommendations = enhancedRecommendations.filter(rec => {
    if (filterPriority !== 'all' && rec.priority !== filterPriority) return false;
    if (filterCategory !== 'all' && rec.category !== filterCategory) return false;
    return true;
  });

  // Group by priority for timeline view
  const groupedByPriority = filteredRecommendations.reduce((acc, rec) => {
    if (!acc[rec.priority]) acc[rec.priority] = [];
    acc[rec.priority].push(rec);
    return acc;
  }, {} as Record<string, Recommendation[]>);

  const getPriorityStyle = (priority: string) => {
    const styles = {
      critical: { 
        bg: 'from-red-600 to-red-700', 
        border: 'border-red-500', 
        text: 'text-red-400',
        icon: Zap,
        label: 'CRITICAL - Immediate Action Required'
      },
      high: { 
        bg: 'from-orange-600 to-orange-700', 
        border: 'border-orange-500', 
        text: 'text-orange-400',
        icon: Flag,
        label: 'HIGH - Priority Action'
      },
      medium: { 
        bg: 'from-yellow-600 to-yellow-700', 
        border: 'border-yellow-500', 
        text: 'text-yellow-400',
        icon: Target,
        label: 'MEDIUM - Recommended Action'
      },
      low: { 
        bg: 'from-green-600 to-green-700', 
        border: 'border-green-500', 
        text: 'text-green-400',
        icon: CheckCircle,
        label: 'LOW - Optional Enhancement'
      }
    };
    return styles[priority as keyof typeof styles] || styles.medium;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      evidence: FileText,
      medical: Heart,
      administrative: Shield,
      strategic: Brain
    };
    return icons[category as keyof typeof icons] || Target;
  };

  const toggleStep = (recId: string, stepIdx: number) => {
    setCompletedSteps(prev => {
      const steps = new Set(prev[recId] || []);
      if (steps.has(stepIdx)) {
        steps.delete(stepIdx);
      } else {
        steps.add(stepIdx);
      }
      return { ...prev, [recId]: steps };
    });
  };

  const getCompletionPercentage = (recId: string, totalSteps: number) => {
    const completed = completedSteps[recId]?.size || 0;
    return Math.round((completed / totalSteps) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 blur-3xl" />
        <div className="relative bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Personalized Action Plan
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                AI-generated recommendations to maximize your claim success
              </p>
            </div>
            
            {/* View Mode Selector */}
            <div className="flex gap-1 bg-gray-800/50 p-1 rounded-xl">
              {[
                { id: 'cards', icon: Square, label: 'Cards' },
                { id: 'timeline', icon: Clock, label: 'Timeline' },
                { id: 'matrix', icon: Activity, label: 'Matrix' }
              ].map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id as any)}
                    className={`px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${
                      viewMode === mode.id
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {mode.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="evidence">Evidence</option>
              <option value="medical">Medical</option>
              <option value="administrative">Administrative</option>
              <option value="strategic">Strategic</option>
            </select>

            <div className="flex-1"></div>

            {/* Quick Actions */}
            <button className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Plan
            </button>
            <button className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-1">
                <Rocket className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-400">Total Actions</span>
              </div>
              <p className="text-xl font-bold text-white">{filteredRecommendations.length}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-400">Potential Increase</span>
              </div>
              <p className="text-xl font-bold text-green-400">
                +{Math.max(...filteredRecommendations.map(r => r.potentialIncrease || 0))}%
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-1">
                <Gauge className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-400">Avg Success Rate</span>
              </div>
              <p className="text-xl font-bold text-purple-400">
                {Math.round(filteredRecommendations.reduce((sum, r) => sum + r.successRate, 0) / filteredRecommendations.length)}%
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-gray-400">Est. Timeline</span>
              </div>
              <p className="text-xl font-bold text-orange-400">3-6 mo</p>
            </div>
          </div>
        </div>
      </div>

      {/* View Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'cards' && (
          <motion.div
            key="cards"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {filteredRecommendations.map((rec, idx) => {
              const priorityStyle = getPriorityStyle(rec.priority);
              const CategoryIcon = getCategoryIcon(rec.category);
              const PriorityIcon = priorityStyle.icon;
              const isExpanded = expandedRec === rec.id;
              const completionPercentage = getCompletionPercentage(rec.id, rec.steps?.length || 0);

              return (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative"
                >
                  {/* Priority Indicator */}
                  <div className={`absolute -left-1 top-0 bottom-0 w-1 bg-gradient-to-b ${priorityStyle.bg} rounded-full`} />
                  
                  <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden ml-2">
                    <div 
                      className="p-6 cursor-pointer"
                      onClick={() => setExpandedRec(isExpanded ? null : rec.id)}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${priorityStyle.bg} shadow-lg`}>
                            <PriorityIcon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-white">{rec.action}</h3>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${priorityStyle.text} bg-gray-800/50 border ${priorityStyle.border}`}>
                                {rec.priority.toUpperCase()}
                              </span>
                              <span className="px-2 py-1 bg-gray-800/50 text-gray-400 rounded text-xs flex items-center gap-1">
                                <CategoryIcon className="w-3 h-3" />
                                {rec.category}
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm mb-3">{rec.impact}</p>
                            
                            {/* Quick Stats */}
                            <div className="flex items-center gap-4 text-xs">
                              <span className="flex items-center gap-1 text-gray-400">
                                <Clock className="w-3 h-3" />
                                {rec.timeframe}
                              </span>
                              <span className="flex items-center gap-1 text-gray-400">
                                <Activity className="w-3 h-3" />
                                {rec.effort} effort
                              </span>
                              <span className="flex items-center gap-1 text-gray-400">
                                <Star className="w-3 h-3" />
                                {rec.successRate}% success
                              </span>
                              {rec.potentialIncrease && (
                                <span className="flex items-center gap-1 text-green-400">
                                  <TrendingUp className="w-3 h-3" />
                                  +{rec.potentialIncrease}% potential
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {completionPercentage > 0 && (
                            <div className="text-right">
                              <p className="text-xs text-gray-400 mb-1">Progress</p>
                              <div className="flex items-center gap-2">
                                <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                                  <motion.div 
                                    className="h-full bg-gradient-to-r from-blue-600 to-blue-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${completionPercentage}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-400">{completionPercentage}%</span>
                              </div>
                            </div>
                          )}
                          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`} />
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-gray-700/50"
                        >
                          <div className="p-6 space-y-4">
                            {/* Action Steps */}
                            {rec.steps && rec.steps.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-400 mb-3">Action Steps</h4>
                                <div className="space-y-2">
                                  {rec.steps.map((step, stepIdx) => {
                                    const isCompleted = completedSteps[rec.id]?.has(stepIdx);
                                    return (
                                      <div
                                        key={stepIdx}
                                        className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800/70 transition-colors"
                                        onClick={() => toggleStep(rec.id, stepIdx)}
                                      >
                                        <button className="mt-0.5">
                                          {isCompleted ? (
                                            <CheckSquare className="w-5 h-5 text-green-400" />
                                          ) : (
                                            <Square className="w-5 h-5 text-gray-400" />
                                          )}
                                        </button>
                                        <div className="flex-1">
                                          <p className={`text-sm ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                                            {step}
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Resources */}
                            {rec.resources && rec.resources.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-400 mb-3">Resources</h4>
                                <div className="grid grid-cols-2 gap-2">
                                  {rec.resources.map((resource, rIdx) => {
                                    const icons = {
                                      document: FileText,
                                      website: ExternalLink,
                                      phone: Phone,
                                      email: Mail
                                    };
                                    const Icon = icons[resource.type];
                                    
                                    return (
                                      <a
                                        key={rIdx}
                                        href={resource.link || '#'}
                                        className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
                                      >
                                        <Icon className="w-4 h-4 text-blue-400" />
                                        <span className="text-sm text-gray-300">{resource.name}</span>
                                      </a>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Dependencies */}
                            {rec.dependencies && rec.dependencies.length > 0 && (
                              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                  <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-semibold text-orange-400 mb-1">Prerequisites</p>
                                    <ul className="text-xs text-gray-300 space-y-1">
                                      {rec.dependencies.map((dep, dIdx) => (
                                        <li key={dIdx}>• {dep}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                              <button
                                onClick={() => onActionClick?.(rec.action)}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2"
                              >
                                <Play className="w-4 h-4" />
                                Start This Action
                              </button>
                              <button className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Schedule
                              </button>
                              <button className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors flex items-center gap-2">
                                <Copy className="w-4 h-4" />
                                Copy
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {viewMode === 'timeline' && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-xl"
          >
            <h3 className="text-xl font-bold text-white mb-6">Action Timeline</h3>
            {['critical', 'high', 'medium', 'low'].map((priority) => {
              const recs = groupedByPriority[priority];
              if (!recs || recs.length === 0) return null;
              
              const priorityStyle = getPriorityStyle(priority);
              const PriorityIcon = priorityStyle.icon;
              
              return (
                <div key={priority} className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${priorityStyle.bg}`}>
                      <PriorityIcon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className={`font-semibold ${priorityStyle.text}`}>
                      {priorityStyle.label}
                    </h4>
                  </div>
                  
                  <div className="ml-8 space-y-3">
                    {recs.map((rec, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-white font-medium">{rec.action}</p>
                          <p className="text-gray-400 text-sm">{rec.timeframe}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {viewMode === 'matrix' && (
          <motion.div
            key="matrix"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-xl"
          >
            <h3 className="text-xl font-bold text-white mb-6">Impact vs Effort Matrix</h3>
            <div className="relative h-96 bg-gray-800/30 rounded-xl">
              {/* Axis Labels */}
              <div className="absolute left-1/2 bottom-2 transform -translate-x-1/2 text-xs text-gray-400">
                Effort →
              </div>
              <div className="absolute left-2 top-1/2 transform -rotate-90 text-xs text-gray-400">
                Impact →
              </div>
              
              {/* Quadrant Labels */}
              <div className="absolute top-4 left-4 text-xs text-gray-500">Quick Wins</div>
              <div className="absolute top-4 right-4 text-xs text-gray-500">Major Projects</div>
              <div className="absolute bottom-4 left-4 text-xs text-gray-500">Fill Ins</div>
              <div className="absolute bottom-4 right-4 text-xs text-gray-500">Thankless Tasks</div>
              
              {/* Grid Lines */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-700"></div>
              <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-700"></div>
              
              {/* Plot Recommendations */}
              {filteredRecommendations.map((rec, idx) => {
                const x = rec.effort === 'low' ? 25 : rec.effort === 'medium' ? 50 : 75;
                const y = 100 - (rec.potentialIncrease || 50);
                const priorityStyle = getPriorityStyle(rec.priority);
                
                return (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`absolute w-3 h-3 rounded-full bg-gradient-to-br ${priorityStyle.bg} cursor-pointer hover:scale-150 transition-transform`}
                    style={{ 
                      left: `${x}%`, 
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    title={rec.action}
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}