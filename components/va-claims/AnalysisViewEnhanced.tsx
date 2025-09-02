'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Brain, AlertTriangle, CheckCircle, Info, TrendingUp, TrendingDown,
  Activity, Shield, FileText, Award, Clock, Target, Sparkles,
  ChevronRight, HelpCircle, Zap, BarChart3, PieChart, Heart,
  GitBranch, Layers, Database, Eye, ArrowUp, ArrowDown, Star,
  AlertCircle, Gauge, Flame, Trophy, Lock, Unlock, ChevronDown, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, BarChart, Bar, Cell, Area, AreaChart, ComposedChart,
  PieChart as RechartsPieChart, Pie, Sector, Treemap, Sankey,
  RadialBarChart, RadialBar, Legend, FunnelChart, Funnel, LabelList
} from 'recharts';

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
    symptoms?: string[];
    treatments?: string[];
    medications?: string[];
    timeline?: Array<{ date: string; event: string; severity: number }>;
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
    details?: string;
  }>;
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    action: string;
    impact: string;
    timeframe: string;
    steps?: string[];
    resources?: string[];
  }>;
  presumptiveConditions: Array<{
    condition: string;
    eligible: boolean;
    reason: string;
    confidence: number;
  }>;
  missingEvidence: Array<{
    type: string;
    importance: number;
    suggestion: string;
    impact?: string;
  }>;
  riskFactors: Array<{
    factor: string;
    severity: 'high' | 'medium' | 'low';
    mitigation: string;
    trend?: 'increasing' | 'stable' | 'decreasing';
  }>;
}

interface AnalysisViewEnhancedProps {
  analysisData: AnalysisData;
  veteranData: any;
}

// Custom styled tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-lg p-3 shadow-xl">
        <p className="text-white font-semibold text-sm">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-gray-300 text-xs mt-1">
            {entry.name}: <span className="text-blue-400 font-bold">{entry.value}%</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom active shape for pie charts
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  
  return (
    <g>
      <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="#fff" className="text-lg font-bold">
        {payload.name}
      </text>
      <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="#9CA3AF" className="text-sm">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 14}
        fill={fill}
      />
    </g>
  );
};

export default function AnalysisViewEnhanced({ analysisData, veteranData }: AnalysisViewEnhancedProps) {
  const [selectedCondition, setSelectedCondition] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'conditions' | 'evidence' | 'timeline' | 'recommendations'>('overview');
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [activePieIndex, setActivePieIndex] = useState(0);
  const [expandedCondition, setExpandedCondition] = useState<number | null>(null);

  // Enhanced color schemes
  const colors = {
    gradient: ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'],
    evidence: {
      medical: '#3B82F6',
      service: '#10B981',
      nexus: '#8B5CF6',
      continuity: '#F59E0B',
      supporting: '#EC4899'
    },
    severity: {
      high: '#EF4444',
      medium: '#F59E0B',
      low: '#10B981'
    }
  };

  // Data for enhanced visualizations
  const evidenceChartData = Object.entries(analysisData.evidenceAnalysis).map(([key, value]) => ({
    category: key.charAt(0).toUpperCase() + key.slice(1),
    score: value,
    fullMark: 100,
    color: colors.evidence[key as keyof typeof colors.evidence]
  }));

  const conditionProgressData = analysisData.conditions.map(condition => ({
    name: condition.name,
    current: condition.currentRating,
    predicted: condition.predictedRating,
    evidence: condition.evidenceStrength,
    potential: Math.min(100, condition.predictedRating + 20)
  }));

  const riskTrendData = analysisData.riskFactors.map((risk, idx) => ({
    name: risk.factor.substring(0, 20),
    value: risk.severity === 'high' ? 90 : risk.severity === 'medium' ? 60 : 30,
    trend: Math.random() * 20 - 10,
    color: colors.severity[risk.severity]
  }));

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-600 to-green-500';
    if (score >= 60) return 'from-yellow-600 to-yellow-500';
    if (score >= 40) return 'from-orange-600 to-orange-500';
    return 'from-red-600 to-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Analysis Header with Glass Morphism */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl" />
        <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                Comprehensive Claims Analysis
              </h2>
              <p className="text-gray-400">
                AI-powered evaluation of {veteranData?.name || 'Veteran'}'s disability claim
              </p>
            </div>
            <div className="text-right">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50" />
                <div className="relative bg-gray-800/80 backdrop-blur rounded-full p-6 border border-gray-700">
                  <div className="text-4xl font-bold text-white">
                    {analysisData.overallScore}%
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Overall Strength</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Quick Stats with Icons and Animations */}
          <div className="grid grid-cols-5 gap-4">
            {[
              { icon: Brain, label: 'AI Confidence', value: `${analysisData.confidence}%`, color: 'from-blue-600 to-blue-500' },
              { icon: FileText, label: 'Conditions', value: analysisData.conditions.length, color: 'from-purple-600 to-purple-500' },
              { icon: Shield, label: 'Connected', value: analysisData.conditions.filter(c => c.serviceConnected).length, color: 'from-green-600 to-green-500' },
              { icon: Award, label: 'Max Rating', value: `${Math.max(...analysisData.conditions.map(c => c.predictedRating))}%`, color: 'from-orange-600 to-orange-500' },
              { icon: Gauge, label: 'Evidence', value: `${Math.round(Object.values(analysisData.evidenceAnalysis).reduce((a, b) => a + b, 0) / 5)}%`, color: 'from-pink-600 to-pink-500' }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r opacity-20 group-hover:opacity-30 transition-opacity rounded-xl blur-xl" 
                    style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
                  />
                  <div className="relative bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700/50 hover:border-gray-600 transition-all">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-xs text-gray-400">{stat.label}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Enhanced Navigation Tabs with Gradient Border */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-1 border border-gray-700/50 shadow-xl">
        <div className="flex gap-1">
          {['overview', 'conditions', 'evidence', 'timeline', 'recommendations'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`relative flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {tab === 'overview' && <BarChart3 className="w-4 h-4" />}
                {tab === 'conditions' && <Heart className="w-4 h-4" />}
                {tab === 'evidence' && <FileText className="w-4 h-4" />}
                {tab === 'timeline' && <Clock className="w-4 h-4" />}
                {tab === 'recommendations' && <Target className="w-4 h-4" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Evidence Strength Radar with Enhanced Design */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Layers className="w-6 h-6 text-blue-400" />
                  Multi-Dimensional Evidence Analysis
                </h3>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold">
                    Advanced Analytics
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                {/* Radar Chart */}
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={evidenceChartData}>
                      <defs>
                        <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.3} />
                        </linearGradient>
                      </defs>
                      <PolarGrid stroke="#374151" strokeDasharray="3 3" />
                      <PolarAngleAxis dataKey="category" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6B7280', fontSize: 10 }} />
                      <Radar name="Evidence" dataKey="score" stroke="#3B82F6" fill="url(#radarGradient)" strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Radial Bar Chart */}
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={evidenceChartData}>
                      <RadialBar dataKey="score" cornerRadius={10} fill="#8B5CF6" background={{ fill: '#1F2937' }}>
                        <LabelList dataKey="category" position="insideStart" fill="#fff" fontSize={10} />
                      </RadialBar>
                      <Tooltip content={<CustomTooltip />} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Evidence Breakdown Cards */}
              <div className="grid grid-cols-5 gap-3 mt-6">
                {Object.entries(analysisData.evidenceAnalysis).map(([key, value]) => (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400 capitalize">{key}</span>
                      <span className={`text-lg font-bold ${getScoreColor(value)}`}>
                        {value}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full bg-gradient-to-r ${getScoreGradient(value)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Risk Analysis with Trend Indicators */}
            <div className="grid grid-cols-2 gap-6">
              {/* Risk Factors */}
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                  Risk Assessment Matrix
                </h3>
                <div className="space-y-3">
                  {analysisData.riskFactors.map((risk, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800/20 to-transparent blur-xl" />
                      <div className="relative bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              risk.severity === 'high' ? 'bg-red-500/20' :
                              risk.severity === 'medium' ? 'bg-yellow-500/20' :
                              'bg-green-500/20'
                            }`}>
                              <Flame className={`w-4 h-4 ${
                                risk.severity === 'high' ? 'text-red-400' :
                                risk.severity === 'medium' ? 'text-yellow-400' :
                                'text-green-400'
                              }`} />
                            </div>
                            <div>
                              <span className="text-white font-medium">{risk.factor}</span>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  risk.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                                  risk.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-green-500/20 text-green-400'
                                }`}>
                                  {risk.severity.toUpperCase()}
                                </span>
                                {risk.trend && (
                                  <span className="flex items-center gap-1 text-xs text-gray-400">
                                    {risk.trend === 'increasing' ? <TrendingUp className="w-3 h-3 text-red-400" /> :
                                     risk.trend === 'decreasing' ? <TrendingDown className="w-3 h-3 text-green-400" /> :
                                     <Activity className="w-3 h-3 text-yellow-400" />}
                                    {risk.trend}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm">{risk.mitigation}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Presumptive Conditions with Confidence Meters */}
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-green-400" />
                  Presumptive Eligibility Analysis
                </h3>
                <div className="space-y-3">
                  {analysisData.presumptiveConditions.map((condition, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{condition.condition}</span>
                          {condition.eligible ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-gray-500" />
                          )}
                        </div>
                        <span className={`text-sm font-semibold ${
                          condition.confidence >= 80 ? 'text-green-400' :
                          condition.confidence >= 60 ? 'text-yellow-400' :
                          'text-orange-400'
                        }`}>
                          {condition.confidence}% Match
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{condition.reason}</p>
                      <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full bg-gradient-to-r ${
                            condition.eligible ? 'from-green-600 to-green-500' : 'from-gray-600 to-gray-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${condition.confidence}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Missing Evidence Alert with Impact Scores */}
            {analysisData.missingEvidence.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-orange-900/20 to-red-900/20 backdrop-blur-xl rounded-2xl p-6 border border-orange-700/50 shadow-xl"
              >
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-orange-400 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-orange-400 mb-2">Critical Evidence Gaps Detected</h3>
                    <p className="text-gray-400 text-sm">Address these items to strengthen your claim</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {analysisData.missingEvidence.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              item.importance >= 80 ? 'bg-red-500/20 text-red-400' :
                              item.importance >= 60 ? 'bg-orange-500/20 text-orange-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {item.importance >= 80 ? 'CRITICAL' :
                               item.importance >= 60 ? 'IMPORTANT' : 'HELPFUL'}
                            </span>
                            <span className="text-white font-medium">{item.type}</span>
                          </div>
                          <p className="text-gray-400 text-sm">{item.suggestion}</p>
                          {item.impact && (
                            <p className="text-blue-400 text-xs mt-2 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {item.impact}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-orange-400">
                            {item.importance}%
                          </div>
                          <p className="text-xs text-gray-500">Impact</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
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
            {/* Conditions Overview Chart */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-xl mb-6">
              <h3 className="text-xl font-bold text-white mb-4">Conditions Rating Comparison</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={conditionProgressData}>
                    <defs>
                      <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.2} />
                      </linearGradient>
                      <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#10B981" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="current" fill="url(#currentGradient)" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="predicted" fill="url(#predictedGradient)" radius={[8, 8, 0, 0]} />
                    <Line type="monotone" dataKey="evidence" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B', r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Enhanced Conditions Cards */}
            {analysisData.conditions.map((condition, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 blur-xl" />
                <div
                  className="relative bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden cursor-pointer hover:border-gray-600 transition-all"
                  onClick={() => setExpandedCondition(expandedCondition === idx ? null : idx)}
                >
                  {/* Condition Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${
                          condition.evidenceStrength > 70 ? 'from-green-600 to-green-700' : 
                          condition.evidenceStrength > 50 ? 'from-yellow-600 to-yellow-700' :
                          'from-orange-600 to-orange-700'
                        }`}>
                          <Heart className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{condition.name}</h3>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-400">ICD-10: {condition.icd10}</span>
                            {condition.secondaryTo && (
                              <span className="text-sm text-blue-400 flex items-center gap-1">
                                <GitBranch className="w-3 h-3" />
                                Secondary to {condition.secondaryTo}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {condition.serviceConnected && (
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            Service Connected
                          </span>
                        )}
                        {condition.nexusPresent && (
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-semibold flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Nexus Present
                          </span>
                        )}
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                          expandedCondition === idx ? 'rotate-180' : ''
                        }`} />
                      </div>
                    </div>

                    {/* Rating Comparison */}
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="bg-gray-800/50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-1">Current Rating</p>
                        <p className="text-2xl font-bold text-white">{condition.currentRating}%</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-1">Predicted Rating</p>
                        <div className="flex items-center gap-1">
                          <p className={`text-2xl font-bold ${getScoreColor(condition.predictedRating)}`}>
                            {condition.predictedRating}%
                          </p>
                          {condition.predictedRating > condition.currentRating && (
                            <ArrowUp className="w-4 h-4 text-green-400" />
                          )}
                        </div>
                      </div>
                      <div className="bg-gray-800/50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-1">Evidence Strength</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-700/50 rounded-full h-2">
                            <motion.div 
                              className={`h-2 rounded-full bg-gradient-to-r ${getScoreGradient(condition.evidenceStrength)}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${condition.evidenceStrength}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                          <span className={`text-sm font-semibold ${getScoreColor(condition.evidenceStrength)}`}>
                            {condition.evidenceStrength}%
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-800/50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-1">Potential Increase</p>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-5 h-5 text-green-400" />
                          <p className="text-xl font-bold text-green-400">
                            +{Math.max(0, condition.predictedRating - condition.currentRating)}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Evidence Indicators */}
                    <div className="flex items-center gap-4">
                      {[
                        { label: 'Nexus Letter', present: condition.nexusPresent },
                        { label: 'Service Connected', present: condition.serviceConnected },
                        { label: 'Evidence Strength', present: condition.evidenceStrength > 60 },
                        { label: 'Current Treatment', present: (condition.treatments?.length ?? 0) > 0 }
                      ].map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center gap-2">
                          {item.present ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <X className="w-4 h-4 text-red-400" />
                          )}
                          <span className="text-sm text-gray-300">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedCondition === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-700/50"
                      >
                        <div className="p-6 space-y-4">
                          {/* Symptoms */}
                          {condition.symptoms && condition.symptoms.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-400 mb-2">Documented Symptoms</h4>
                              <div className="flex flex-wrap gap-2">
                                {condition.symptoms.map((symptom, sIdx) => (
                                  <span key={sIdx} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm">
                                    {symptom}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Treatments */}
                          {condition.treatments && condition.treatments.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-400 mb-2">Current Treatments</h4>
                              <div className="flex flex-wrap gap-2">
                                {condition.treatments.map((treatment, tIdx) => (
                                  <span key={tIdx} className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm">
                                    {treatment}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Medications */}
                          {condition.medications && condition.medications.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-400 mb-2">Prescribed Medications</h4>
                              <div className="flex flex-wrap gap-2">
                                {condition.medications.map((med, mIdx) => (
                                  <span key={mIdx} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm">
                                    {med}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Condition Timeline */}
                          {condition.timeline && condition.timeline.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-400 mb-2">Condition Timeline</h4>
                              <div className="h-32">
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={condition.timeline}>
                                    <defs>
                                      <linearGradient id={`timeline-${idx}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.1} />
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="date" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                                    <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="severity" stroke="#8B5CF6" fill={`url(#timeline-${idx})`} />
                                  </AreaChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          )}

                          {/* Secondary To Condition */}
                          {condition.secondaryTo && (
                            <div className="bg-purple-900/20 border border-purple-700/30 rounded-xl p-4">
                              <p className="text-sm text-purple-400 mb-2 font-semibold">
                                Secondary To:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm flex items-center gap-1">
                                  <GitBranch className="w-3 h-3" />
                                  {condition.secondaryTo}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Evidence Tab */}
        {activeTab === 'evidence' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Evidence Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisData.conditions.map((condition: any, idx: number) => (
                  <div key={idx} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                    <h4 className="text-white font-semibold mb-2">{condition.name}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Evidence Strength</span>
                        <span className="text-blue-400">{condition.evidenceStrength}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Documents</span>
                        <span className="text-green-400">{condition.evidenceItems?.length || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Nexus Present</span>
                        <span className={condition.nexusPresent ? 'text-green-400' : 'text-red-400'}>
                          {condition.nexusPresent ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                Service & Medical Timeline
              </h3>
              <div className="space-y-3">
                {analysisData.timeline?.slice(0, 10).map((event: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
                    <div className="flex-1 bg-gray-900/50 rounded-lg p-3 border border-gray-700/50">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-white font-medium">{event.event}</span>
                        <span className="text-xs text-gray-400">{event.date}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        event.type === 'service' ? 'bg-blue-900/50 text-blue-400' :
                        event.type === 'medical' ? 'bg-green-900/50 text-green-400' :
                        'bg-purple-900/50 text-purple-400'
                      }`}>
                        {event.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                Key Recommendations
              </h3>
              <div className="space-y-3">
                {analysisData.recommendations?.map((rec: any, idx: number) => (
                  <div key={idx} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        idx === 0 ? 'bg-red-900/50' : 
                        idx < 3 ? 'bg-yellow-900/50' : 
                        'bg-blue-900/50'
                      }`}>
                        <Zap className={`w-4 h-4 ${
                          idx === 0 ? 'text-red-400' : 
                          idx < 3 ? 'text-yellow-400' : 
                          'text-blue-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-white mb-1">{typeof rec === 'string' ? rec : rec.action}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span className={`px-2 py-0.5 rounded ${
                            idx === 0 ? 'bg-red-900/30 text-red-400' : 
                            idx < 3 ? 'bg-yellow-900/30 text-yellow-400' : 
                            'bg-blue-900/30 text-blue-400'
                          }`}>
                            {idx === 0 ? 'Critical' : idx < 3 ? 'High Priority' : 'Medium Priority'}
                          </span>
                          {rec.timeframe && <span>• {rec.timeframe}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {analysisData.missingEvidence?.length > 0 && (
                  <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-800/30 rounded-lg">
                    <h4 className="text-yellow-400 font-medium mb-2">Missing Evidence</h4>
                    <ul className="space-y-1">
                      {analysisData.missingEvidence.map((item: any, idx: number) => (
                        <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                          <AlertTriangle className="w-3 h-3 text-yellow-400 mt-0.5" />
                          {typeof item === 'string' ? item : item.suggestion || item.type}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}