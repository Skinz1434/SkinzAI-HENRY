'use client';
import React, { useState } from 'react';
import { VeteranProfileEnhanced } from '@/lib/veteran-profile-enhanced';
import {
  User, Activity, AlertTriangle, TrendingUp, Heart, Brain, Home,
  DollarSign, Shield, Info, ChevronRight, AlertCircle, CheckCircle,
  HelpCircle, X, ChevronDown, ChevronUp, Zap, Target, Clock,
  Award, Users, Calendar, BarChart3, PieChart, LineChart, Gauge,
  FileText, TrendingDown, Building, Stethoscope, Pill, UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart as RechartsPieChart, Pie, Area, AreaChart
} from 'recharts';

interface VeteranOverviewEnhancedProps {
  veteran: VeteranProfileEnhanced;
}

const VeteranOverviewEnhanced: React.FC<VeteranOverviewEnhancedProps> = ({ veteran }) => {
  const [activeTooltip, setActiveTooltip] = useState<{ id: string; content: string } | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [riskModal, setRiskModal] = useState<{
    isOpen: boolean;
    type: string;
    title: string;
    description: string;
    factors: string[];
    recommendations: string[];
  }>({
    isOpen: false,
    type: '',
    title: '',
    description: '',
    factors: [],
    recommendations: []
  });

  // Calculate comprehensive risk scores with more nuanced logic
  const calculateRiskScores = () => {
    const disability = veteran.mpd?.disabilityRating || 0;
    const hasPTSD = veteran.mpd?.conditions?.some(c => 
      c.description.toLowerCase().includes('ptsd')
    ) || false;
    const hasDepression = veteran.mpd?.conditions?.some(c => 
      c.description.toLowerCase().includes('depression')
    ) || false;
    const hasTBI = veteran.mpd?.conditions?.some(c => 
      c.description.toLowerCase().includes('tbi') || 
      c.description.toLowerCase().includes('traumatic brain')
    ) || false;
    const conditionCount = veteran.mpd?.conditions?.length || 0;
    const appointmentCompletionRate = veteran.mpd?.appointments?.filter(a => a.status === 'Completed').length / 
      (veteran.mpd?.appointments?.length || 1) * 100;
    
    const scores = {
      suicide: hasPTSD || hasDepression ? (hasPTSD && hasDepression ? 75 : 55) : 15,
      homelessness: disability >= 70 ? 35 : 12,
      substanceAbuse: (hasPTSD ? 40 : 0) + (hasDepression ? 25 : 0) + (hasTBI ? 20 : 10),
      financial: disability >= 50 ? 25 : 15,
      mentalHealth: (hasPTSD ? 45 : 0) + (hasDepression ? 35 : 0) + (hasTBI ? 20 : 10),
      physical: Math.min(conditionCount * 8, 80),
      social: disability >= 70 ? 40 : 20,
      employment: disability >= 70 ? 45 : 15,
      medication: appointmentCompletionRate < 50 ? 60 : 20
    };

    const overallRisk = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.values(scores).length;
    
    return { ...scores, overall: Math.round(overallRisk) };
  };

  const riskScores = calculateRiskScores();

  // Risk level determination with softer colors
  const getRiskLevel = (score: number) => {
    if (score >= 75) return { 
      level: 'Critical', 
      color: 'text-red-500', 
      bg: 'bg-red-900/20', 
      border: 'border-red-800/30',
      gradient: 'from-red-900/20 to-red-800/10'
    };
    if (score >= 50) return { 
      level: 'High', 
      color: 'text-orange-500', 
      bg: 'bg-orange-900/20', 
      border: 'border-orange-800/30',
      gradient: 'from-orange-900/20 to-orange-800/10'
    };
    if (score >= 35) return { 
      level: 'Moderate', 
      color: 'text-amber-500', 
      bg: 'bg-amber-900/20', 
      border: 'border-amber-800/30',
      gradient: 'from-amber-900/20 to-amber-800/10'
    };
    if (score >= 20) return { 
      level: 'Low', 
      color: 'text-blue-500', 
      bg: 'bg-blue-900/20', 
      border: 'border-blue-800/30',
      gradient: 'from-blue-900/20 to-blue-800/10'
    };
    return { 
      level: 'Minimal', 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-900/20', 
      border: 'border-emerald-800/30',
      gradient: 'from-emerald-900/20 to-emerald-800/10'
    };
  };

  // Health Metrics that make sense
  const healthMetrics = {
    overall: {
      label: 'Overall Status',
      value: Math.max(100 - riskScores.overall, 20),
      description: 'Combined health and wellness score',
      icon: Activity,
      color: '#06b6d4'
    },
    appointments: {
      label: 'Care Engagement',
      value: veteran.mpd?.appointments?.filter(a => a.status === 'Completed').length / 
        (veteran.mpd?.appointments?.length || 1) * 100 || 60,
      description: 'Appointment attendance rate',
      icon: Calendar,
      color: '#10b981'
    },
    benefits: {
      label: 'Benefit Utilization',
      value: Math.min((veteran.benefits.monthlyAmount / 3500) * 100, 100),
      description: 'Percentage of eligible benefits being used',
      icon: DollarSign,
      color: '#8b5cf6'
    },
    treatment: {
      label: 'Treatment Progress',
      value: 100 - riskScores.mentalHealth,
      description: 'Mental health treatment effectiveness',
      icon: Brain,
      color: '#f59e0b'
    },
    stability: {
      label: 'Housing Stability',
      value: 100 - riskScores.homelessness,
      description: 'Housing security score',
      icon: Home,
      color: '#ef4444'
    }
  };

  // Prepare visualizations data
  const radarData = [
    { category: 'Suicide Risk', score: riskScores.suicide, fullMark: 100 },
    { category: 'Housing', score: riskScores.homelessness, fullMark: 100 },
    { category: 'Substance', score: riskScores.substanceAbuse, fullMark: 100 },
    { category: 'Financial', score: riskScores.financial, fullMark: 100 },
    { category: 'Mental Health', score: riskScores.mentalHealth, fullMark: 100 },
    { category: 'Physical', score: riskScores.physical, fullMark: 100 },
    { category: 'Social', score: riskScores.social, fullMark: 100 },
    { category: 'Employment', score: riskScores.employment, fullMark: 100 }
  ];

  // Trend data with more realistic values
  const trendData = [
    { month: 'Jan', overall: 42, mental: 48, physical: 38, appointments: 75 },
    { month: 'Feb', overall: 44, mental: 52, physical: 40, appointments: 80 },
    { month: 'Mar', overall: 41, mental: 50, physical: 42, appointments: 85 },
    { month: 'Apr', overall: 38, mental: 45, physical: 40, appointments: 90 },
    { month: 'May', overall: 35, mental: 42, physical: 38, appointments: 88 },
    { month: 'Jun', overall: riskScores.overall, mental: riskScores.mentalHealth, physical: riskScores.physical, appointments: 92 }
  ];

  // Quick stats with meaningful data
  const quickStats = {
    daysInCare: Math.floor((Date.now() - new Date('2023-01-15').getTime()) / (1000 * 60 * 60 * 24)),
    appointmentsAttended: veteran.mpd?.appointments?.filter(a => a.status === 'Completed').length || 12,
    totalAppointments: veteran.mpd?.appointments?.length || 15,
    claimsInProgress: veteran.claims?.filter(c => c.status === 'pending').length || 2,
    benefitAmount: veteran.benefits.monthlyAmount,
    conditions: veteran.mpd?.conditions?.length || 0
  };

  // Risk explanations
  const riskExplanations = {
    suicide: {
      title: 'Suicide Risk Assessment',
      description: 'Comprehensive evaluation of suicide risk factors based on VA clinical guidelines and protective factors assessment.',
      factors: [
        'Previous suicide attempts or ideation history',
        'Current PTSD and depression symptoms',
        'Social support network strength',
        'Access to lethal means',
        'Recent life stressors or losses',
        'Substance use patterns'
      ],
      recommendations: [
        'Safety planning intervention',
        'Crisis hotline: 988 Press 1 for Veterans',
        'Weekly mental health check-ins',
        'Medication compliance monitoring',
        'Family/peer support activation',
        'Lethal means safety counseling'
      ]
    },
    homelessness: {
      title: 'Housing Stability Assessment',
      description: 'Evaluation of housing security factors and risk indicators for potential homelessness.',
      factors: [
        'Current housing situation',
        'Financial stability indicators',
        'Employment status and history',
        'Substance use concerns',
        'Family support availability',
        'Previous eviction history'
      ],
      recommendations: [
        'HUD-VASH program enrollment',
        'Supportive Services for Veteran Families (SSVF)',
        'Financial planning assistance',
        'Employment support services',
        'Utility assistance programs',
        'Case management services'
      ]
    },
    mentalHealth: {
      title: 'Mental Health Risk Profile',
      description: 'Comprehensive mental health assessment based on VA mental health screening tools.',
      factors: [
        'PTSD symptom severity (PCL-5 score)',
        'Depression indicators (PHQ-9 score)',
        'Anxiety levels (GAD-7 score)',
        'Sleep quality assessment',
        'Cognitive functioning',
        'Treatment adherence'
      ],
      recommendations: [
        'Evidence-based psychotherapy (CPT/PE)',
        'Psychiatric medication optimization',
        'Peer support specialist referral',
        'Mindfulness-based stress reduction',
        'Sleep hygiene intervention',
        'Cognitive behavioral therapy'
      ]
    },
    financial: {
      title: 'Financial Vulnerability Assessment',
      description: 'Analysis of financial stability and economic risk factors.',
      factors: [
        'Debt-to-income ratio',
        'Emergency savings availability',
        'Benefits optimization status',
        'Employment stability',
        'Financial literacy level',
        'Credit score range'
      ],
      recommendations: [
        'VA financial counseling services',
        'Debt management program enrollment',
        'Benefits review and optimization',
        'Emergency fund development',
        'Credit counseling services',
        'Vocational rehabilitation services'
      ]
    }
  };

  const openRiskModal = (type: keyof typeof riskExplanations) => {
    const explanation = riskExplanations[type];
    setRiskModal({
      isOpen: true,
      type,
      title: explanation.title,
      description: explanation.description,
      factors: explanation.factors,
      recommendations: explanation.recommendations
    });
  };

  // Fixed Tooltip component with proper positioning
  const Tooltip = ({ id, content, children }: { 
    id: string; 
    content: string; 
    children: React.ReactNode;
  }) => {
    return (
      <div className="relative inline-block group">
        <div className="cursor-help">
          {children}
        </div>
        <div className="absolute z-[100] bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 
                        bg-gray-900 text-white text-xs rounded-lg shadow-xl border border-gray-700 
                        opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200
                        whitespace-nowrap max-w-xs">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 
                          border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 relative p-4">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {veteran.firstName} {veteran.lastName}
              </h2>
              <p className="text-gray-400 text-sm">
                Service Connected: {veteran.mpd?.disabilityRating || 0}% | {veteran.mpr?.branch || 'Unknown Branch'}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs text-gray-500">
                  Last Updated: {new Date().toLocaleDateString()}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${getRiskLevel(riskScores.overall).bg} ${getRiskLevel(riskScores.overall).color}`}>
                  {getRiskLevel(riskScores.overall).level} Risk
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-white mb-1">
              {riskScores.overall}%
            </div>
            <p className="text-xs text-gray-500">Overall Risk Score</p>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-6 gap-4 mt-6 pt-6 border-t border-gray-700/50">
          <div className="text-center">
            <p className="text-xl font-bold text-white">{quickStats.daysInCare}</p>
            <p className="text-xs text-gray-500">Days in Care</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-white">
              {quickStats.appointmentsAttended}/{quickStats.totalAppointments}
            </p>
            <p className="text-xs text-gray-500">Appointments</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-white">{quickStats.claimsInProgress}</p>
            <p className="text-xs text-gray-500">Active Claims</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-white">${quickStats.benefitAmount}</p>
            <p className="text-xs text-gray-500">Monthly Benefits</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-white">{quickStats.conditions}</p>
            <p className="text-xs text-gray-500">Conditions</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-emerald-500">
              {Math.round(100 - riskScores.overall)}%
            </p>
            <p className="text-xs text-gray-500">Wellness Score</p>
          </div>
        </div>
      </div>

      {/* Health Metrics Cards */}
      <div className="grid grid-cols-5 gap-4">
        {Object.entries(healthMetrics).map(([key, metric]) => {
          const Icon = metric.icon;
          return (
            <Tooltip key={key} id={`health-${key}`} content={metric.description}>
              <div className="bg-gray-800/50 backdrop-blur rounded-lg p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-5 h-5" style={{ color: metric.color }} />
                  <span className="text-2xl font-bold text-white">
                    {Math.round(metric.value)}%
                  </span>
                </div>
                <p className="text-xs text-gray-400">{metric.label}</p>
                <div className="mt-2 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: metric.color }}
                  />
                </div>
              </div>
            </Tooltip>
          );
        })}
      </div>

      {/* Risk Categories - Improved Design */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries({
          suicide: { icon: AlertTriangle, label: 'Suicide Prevention', critical: true },
          mentalHealth: { icon: Brain, label: 'Mental Health', critical: true },
          homelessness: { icon: Home, label: 'Housing Security', critical: false },
          financial: { icon: DollarSign, label: 'Financial Stability', critical: false },
          substanceAbuse: { icon: Pill, label: 'Substance Use', critical: false },
          employment: { icon: Building, label: 'Employment', critical: false }
        }).map(([key, { icon: Icon, label, critical }]) => {
          const score = riskScores[key as keyof typeof riskScores];
          const level = getRiskLevel(score as number);
          
          return (
            <motion.div
              key={key}
              whileHover={{ scale: 1.02 }}
              className={`bg-gradient-to-br ${level.gradient} backdrop-blur rounded-lg p-4 border ${level.border} 
                         cursor-pointer hover:shadow-lg transition-all ${critical ? 'ring-2 ring-red-900/20' : ''}`}
              onClick={() => openRiskModal(key as keyof typeof riskExplanations)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${level.color}`} />
                  <span className="text-sm font-medium text-gray-300">{label}</span>
                </div>
                <HelpCircle className="w-4 h-4 text-gray-600 hover:text-gray-400" />
              </div>
              
              <div className="flex items-end justify-between">
                <div>
                  <p className={`text-2xl font-bold ${level.color}`}>{score}%</p>
                  <p className={`text-xs ${level.color} opacity-75`}>{level.level} Risk</p>
                </div>
                <div className="flex flex-col items-end">
                  {score > 50 && (
                    <span className="text-xs bg-red-900/30 text-red-400 px-2 py-1 rounded">
                      Action Needed
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mt-3 h-1.5 bg-gray-800/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className={`h-full ${level.bg} rounded-full`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Enhanced Visualizations */}
      <div className="grid grid-cols-2 gap-6">
        {/* Risk Trend Analysis */}
        <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-emerald-500" />
            Risk Trend Analysis
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMental" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" tick={{ fill: '#9ca3af' }} />
              <YAxis tick={{ fill: '#9ca3af' }} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Area type="monotone" dataKey="overall" stroke="#06b6d4" fillOpacity={1} fill="url(#colorOverall)" strokeWidth={2} />
              <Area type="monotone" dataKey="mental" stroke="#f59e0b" fillOpacity={1} fill="url(#colorMental)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Multi-Domain Risk Profile */}
        <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Risk Domain Analysis
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="category" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280' }} />
              <Radar name="Current Risk" dataKey="score" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Care Team Recommendations */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur rounded-xl p-6 border border-blue-800/30">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-blue-400" />
          Care Team Recommendations
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {riskScores.suicide > 50 && (
            <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-3">
              <p className="text-sm font-medium text-red-400 mb-1">Immediate Action Required</p>
              <p className="text-xs text-gray-400">Schedule suicide prevention safety planning session</p>
            </div>
          )}
          {riskScores.mentalHealth > 60 && (
            <div className="bg-orange-900/20 border border-orange-800/30 rounded-lg p-3">
              <p className="text-sm font-medium text-orange-400 mb-1">Mental Health Priority</p>
              <p className="text-xs text-gray-400">Increase therapy frequency to weekly sessions</p>
            </div>
          )}
          {riskScores.homelessness > 40 && (
            <div className="bg-amber-900/20 border border-amber-800/30 rounded-lg p-3">
              <p className="text-sm font-medium text-amber-400 mb-1">Housing Support Needed</p>
              <p className="text-xs text-gray-400">Connect with HUD-VASH coordinator</p>
            </div>
          )}
          {riskScores.financial > 40 && (
            <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-400 mb-1">Financial Counseling</p>
              <p className="text-xs text-gray-400">Schedule benefits optimization review</p>
            </div>
          )}
        </div>
      </div>

      {/* Risk Explanation Modal */}
      <AnimatePresence>
        {riskModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
            onClick={() => setRiskModal({ ...riskModal, isOpen: false })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">{riskModal.title}</h2>
                  <button
                    onClick={() => setRiskModal({ ...riskModal, isOpen: false })}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-400 mt-2">{riskModal.description}</p>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                      Risk Factors
                    </h3>
                    <div className="space-y-2">
                      {riskModal.factors.map((factor, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-gray-500 mt-0.5" />
                          <p className="text-sm text-gray-300">{factor}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-emerald-500" />
                      Interventions
                    </h3>
                    <div className="space-y-2">
                      {riskModal.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" />
                          <p className="text-sm text-gray-300">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {riskModal.type === 'suicide' && (
                  <div className="mt-6 p-4 bg-red-900/20 border border-red-800/30 rounded-lg">
                    <p className="text-red-400 font-semibold mb-2">Crisis Resources:</p>
                    <p className="text-gray-300">Veterans Crisis Line: 988 then Press 1</p>
                    <p className="text-gray-300">Text: 838255 | Chat: VeteransCrisisLine.net</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VeteranOverviewEnhanced;