'use client';

import React, { useState, useEffect } from 'react';
import { 
  Brain, AlertTriangle, CheckCircle, Info, TrendingUp, 
  Activity, Shield, FileText, Award, Clock, Target,
  ChevronRight, HelpCircle, Zap, BarChart3, PieChart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from 'recharts';

interface AnalysisData {
  overallScore: number;
  confidence: number;
  conditions: Array<{
    name: string;
    icd10: string;
    currentRating: number;
    predictedRating: number;
    evidenceStrength: number;
    nexusPresent: boolean;
    serviceConnected: boolean;
    secondaryTo?: string;
  }>;
  evidenceAnalysis: {
    medical: number;
    service: number;
    nexus: number;
    continuity: number;
    supporting: number;
  };
  timeline: Array<{
    date: string;
    event: string;
    type: 'service' | 'medical' | 'claim' | 'treatment';
    importance: 'high' | 'medium' | 'low';
  }>;
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    action: string;
    impact: string;
    timeframe: string;
  }>;
  presumptiveConditions: Array<{
    condition: string;
    eligible: boolean;
    reason: string;
  }>;
  missingEvidence: Array<{
    type: string;
    importance: number;
    suggestion: string;
  }>;
  riskFactors: Array<{
    factor: string;
    severity: 'high' | 'medium' | 'low';
    mitigation: string;
  }>;
}

interface AnalysisViewProps {
  analysisData: AnalysisData;
  veteranData: any;
}

export default function AnalysisView({ analysisData, veteranData }: AnalysisViewProps) {
  const [selectedCondition, setSelectedCondition] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'conditions' | 'evidence' | 'timeline' | 'recommendations'>('overview');
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const evidenceChartData = Object.entries(analysisData.evidenceAnalysis).map(([key, value]) => ({
    category: key.charAt(0).toUpperCase() + key.slice(1),
    score: value,
    fullMark: 100
  }));

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Analysis Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Comprehensive Claims Analysis</h2>
            <p className="text-blue-100">
              AI-powered evaluation of {veteranData?.name || 'Veteran'}'s disability claim
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-white">
              {analysisData.overallScore}%
            </div>
            <p className="text-blue-100 text-sm">Overall Strength</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-white" />
              <div>
                <p className="text-white font-semibold">{analysisData.confidence}%</p>
                <p className="text-blue-100 text-xs">AI Confidence</p>
              </div>
            </div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-white" />
              <div>
                <p className="text-white font-semibold">{analysisData.conditions.length}</p>
                <p className="text-blue-100 text-xs">Conditions</p>
              </div>
            </div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-white" />
              <div>
                <p className="text-white font-semibold">
                  {analysisData.conditions.filter(c => c.serviceConnected).length}
                </p>
                <p className="text-blue-100 text-xs">Service Connected</p>
              </div>
            </div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-white" />
              <div>
                <p className="text-white font-semibold">
                  {Math.max(...analysisData.conditions.map(c => c.predictedRating))}%
                </p>
                <p className="text-blue-100 text-xs">Max Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 rounded-xl p-1">
        <div className="flex gap-1">
          {['overview', 'conditions', 'evidence', 'timeline', 'recommendations'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Evidence Strength Radar Chart */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-400" />
                Evidence Strength Analysis
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={evidenceChartData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="category" tick={{ fill: '#9CA3AF' }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9CA3AF' }} />
                    <Radar name="Evidence Strength" dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
                Risk Factors & Mitigation
              </h3>
              <div className="space-y-3">
                {analysisData.riskFactors.map((risk, idx) => (
                  <div key={idx} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          risk.severity === 'high' ? 'bg-red-500 text-white' :
                          risk.severity === 'medium' ? 'bg-yellow-500 text-black' :
                          'bg-green-500 text-white'
                        }`}>
                          {risk.severity.toUpperCase()}
                        </span>
                        <span className="text-white font-medium">{risk.factor}</span>
                      </div>
                      <button
                        onMouseEnter={() => setShowTooltip(`risk-${idx}`)}
                        onMouseLeave={() => setShowTooltip(null)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-400 text-sm">{risk.mitigation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Presumptive Conditions */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-green-400" />
                Presumptive Conditions Check
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {analysisData.presumptiveConditions.map((condition, idx) => (
                  <div key={idx} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{condition.condition}</span>
                      {condition.eligible ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{condition.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'conditions' && (
          <motion.div
            key="conditions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {analysisData.conditions.map((condition, idx) => (
              <div
                key={idx}
                className="bg-gray-800 rounded-xl p-6 cursor-pointer hover:bg-gray-750 transition-colors"
                onClick={() => setSelectedCondition(condition)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{condition.name}</h3>
                    <p className="text-gray-400 text-sm">ICD-10: {condition.icd10}</p>
                    {condition.secondaryTo && (
                      <p className="text-blue-400 text-sm mt-1">Secondary to: {condition.secondaryTo}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    {condition.serviceConnected && (
                      <span className="px-3 py-1 bg-green-500 bg-opacity-20 text-green-400 rounded-lg text-sm font-semibold">
                        Service Connected
                      </span>
                    )}
                    {condition.nexusPresent && (
                      <span className="px-3 py-1 bg-blue-500 bg-opacity-20 text-blue-400 rounded-lg text-sm font-semibold">
                        Nexus Present
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Current Rating</p>
                    <p className="text-2xl font-bold text-white">{condition.currentRating}%</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Predicted Rating</p>
                    <p className={`text-2xl font-bold ${getScoreColor(condition.predictedRating)}`}>
                      {condition.predictedRating}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Evidence Strength</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getScoreBgColor(condition.evidenceStrength)}`}
                          style={{ width: `${condition.evidenceStrength}%` }}
                        />
                      </div>
                      <span className={`text-sm font-semibold ${getScoreColor(condition.evidenceStrength)}`}>
                        {condition.evidenceStrength}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end mt-4">
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'evidence' && (
          <motion.div
            key="evidence"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Evidence Categories */}
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(analysisData.evidenceAnalysis).map(([category, score]) => (
                <div key={category} className="bg-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white capitalize">{category} Evidence</h3>
                    <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}%</span>
                  </div>
                  <div className="bg-gray-700 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all ${getScoreBgColor(score)}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <p className="text-gray-400 text-sm mt-3">
                    {score >= 80 ? 'Strong evidence present' :
                     score >= 60 ? 'Moderate evidence, could be strengthened' :
                     score >= 40 ? 'Weak evidence, needs improvement' :
                     'Critical evidence missing'}
                  </p>
                </div>
              ))}
            </div>

            {/* Missing Evidence */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-orange-400" />
                Missing Evidence
              </h3>
              <div className="space-y-3">
                {analysisData.missingEvidence.map((item, idx) => (
                  <div key={idx} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            item.importance >= 80 ? 'bg-red-500 text-white' :
                            item.importance >= 60 ? 'bg-orange-500 text-white' :
                            'bg-yellow-500 text-black'
                          }`}>
                            {item.importance >= 80 ? 'CRITICAL' :
                             item.importance >= 60 ? 'IMPORTANT' : 'HELPFUL'}
                          </span>
                          <span className="text-white font-medium">{item.type}</span>
                        </div>
                        <p className="text-gray-400 text-sm">{item.suggestion}</p>
                      </div>
                      <Target className="w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'timeline' && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-800 rounded-xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-400" />
              Medical & Service Timeline
            </h3>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-600"></div>
              <div className="space-y-4">
                {analysisData.timeline.map((event, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div className={`w-4 h-4 rounded-full mt-1.5 z-10 ${
                      event.type === 'service' ? 'bg-green-500' :
                      event.type === 'medical' ? 'bg-blue-500' :
                      event.type === 'claim' ? 'bg-purple-500' :
                      'bg-yellow-500'
                    }`}></div>
                    <div className="flex-1 bg-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-white font-medium">{event.event}</p>
                          <p className="text-gray-400 text-sm">{event.date}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          event.importance === 'high' ? 'bg-red-500 bg-opacity-20 text-red-400' :
                          event.importance === 'medium' ? 'bg-yellow-500 bg-opacity-20 text-yellow-400' :
                          'bg-gray-500 bg-opacity-20 text-gray-400'
                        }`}>
                          {event.importance.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'recommendations' && (
          <motion.div
            key="recommendations"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {['high', 'medium', 'low'].map((priority) => {
              const recs = analysisData.recommendations.filter(r => r.priority === priority);
              if (recs.length === 0) return null;
              
              return (
                <div key={priority} className="bg-gray-800 rounded-xl p-6">
                  <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                    priority === 'high' ? 'text-red-400' :
                    priority === 'medium' ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    <Zap className="w-5 h-5" />
                    {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority Actions
                  </h3>
                  <div className="space-y-3">
                    {recs.map((rec, idx) => (
                      <div key={idx} className="bg-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-white font-medium">{rec.action}</h4>
                          <span className="text-xs text-gray-400">{rec.timeframe}</span>
                        </div>
                        <p className="text-gray-400 text-sm">{rec.impact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Condition Detail Modal */}
      <AnimatePresence>
        {selectedCondition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCondition(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedCondition.name}</h2>
                    <p className="text-gray-400">ICD-10: {selectedCondition.icd10}</p>
                  </div>
                  <button
                    onClick={() => setSelectedCondition(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">Current Rating</p>
                      <p className="text-2xl font-bold text-white">{selectedCondition.currentRating}%</p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">Predicted Rating</p>
                      <p className={`text-2xl font-bold ${getScoreColor(selectedCondition.predictedRating)}`}>
                        {selectedCondition.predictedRating}%
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold text-white mb-3">Evidence Analysis</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Service Connection</span>
                        <span className={`font-semibold ${selectedCondition.serviceConnected ? 'text-green-400' : 'text-red-400'}`}>
                          {selectedCondition.serviceConnected ? 'Established' : 'Not Established'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Nexus Letter</span>
                        <span className={`font-semibold ${selectedCondition.nexusPresent ? 'text-green-400' : 'text-orange-400'}`}>
                          {selectedCondition.nexusPresent ? 'Present' : 'Missing'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Evidence Strength</span>
                        <span className={`font-semibold ${getScoreColor(selectedCondition.evidenceStrength)}`}>
                          {selectedCondition.evidenceStrength}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedCondition.secondaryTo && (
                    <div className="bg-blue-500 bg-opacity-20 border border-blue-500 rounded-lg p-4">
                      <p className="text-blue-400">
                        <Info className="inline w-4 h-4 mr-1" />
                        This condition is secondary to: <span className="font-semibold">{selectedCondition.secondaryTo}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}