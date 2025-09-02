'use client';

import React, { useState } from 'react';
import { VeteranProfileEnhanced } from '@/lib/veteran-profile-enhanced';
import { 
  Activity, TrendingUp, AlertTriangle, Brain, Target, Users, 
  Award, Calendar, Clock, DollarSign, FileText, Heart, 
  Home, Shield, Star, Zap, ChevronRight, ChevronDown, 
  ChevronUp, Info, HelpCircle, AlertCircle, CheckCircle,
  X, Eye, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon,
  Gauge, Globe, MapPin, Flame, Wind, Droplet, Skull,
  AlertTriangle as RadioActive, Factory, Bomb, AlertCircle as ChemicalFlask, Zap as Radiation,
  ThermometerSun, Pill, Syringe, Stethoscope, HeartHandshake
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer, 
  Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, 
  RadialBarChart, RadialBar, Treemap, Sankey, 
  ComposedChart, ReferenceLine, ReferenceArea, Brush,
  FunnelChart, Funnel, LabelList, ScatterChart, Scatter
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

interface AnalyticsInsightsUltraEnhancedProps {
  veteran: VeteranProfileEnhanced;
}

interface ModalState {
  isOpen: boolean;
  type: string;
  title: string;
  content: any;
}

export default function AnalyticsInsightsUltraEnhanced({ veteran }: AnalyticsInsightsUltraEnhancedProps) {
  const [activeTab, setActiveTab] = useState<'tera' | 'predictive' | 'engagement' | 'comparative'>('tera');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['tera-overview']));
  const [modal, setModal] = useState<ModalState>({ isOpen: false, type: '', title: '', content: null });
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Enhanced TERA Analysis Data
  const teraAnalysis = {
    exposures: [
      {
        type: 'Agent Orange',
        icon: Skull,
        severity: 'High',
        locations: ['Vietnam', 'DMZ Korea', 'Thailand'],
        dateRange: '1968-1970',
        duration: '24 months',
        intensity: 85,
        color: '#FF6B6B',
        conditions: 15,
        riskScore: 92
      },
      {
        type: 'Burn Pits',
        icon: Flame,
        severity: 'Critical',
        locations: ['Iraq', 'Afghanistan'],
        dateRange: '2003-2005',
        duration: '18 months',
        intensity: 95,
        color: '#FF9F40',
        conditions: 23,
        riskScore: 88
      },
      {
        type: 'Radiation',
        icon: Zap,
        severity: 'Moderate',
        locations: ['Enewetak Atoll'],
        dateRange: '1977-1978',
        duration: '6 months',
        intensity: 60,
        color: '#00F0FF',
        conditions: 8,
        riskScore: 65
      },
      {
        type: 'Gulf War Illness',
        icon: Skull,
        severity: 'High',
        locations: ['Kuwait', 'Saudi Arabia'],
        dateRange: '1990-1991',
        duration: '8 months',
        intensity: 75,
        color: '#95E1D3',
        conditions: 12,
        riskScore: 78
      }
    ],
    presumptiveConditions: {
      confirmed: [
        { name: 'Type 2 Diabetes', exposure: 'Agent Orange', diagnosed: '2015', rating: 20 },
        { name: 'Ischemic Heart Disease', exposure: 'Agent Orange', diagnosed: '2018', rating: 60 },
        { name: 'Chronic Bronchitis', exposure: 'Burn Pits', diagnosed: '2020', rating: 30 },
        { name: 'Sinusitis', exposure: 'Burn Pits', diagnosed: '2019', rating: 10 }
      ],
      potential: [
        { name: 'Parkinson\'s Disease', exposure: 'Agent Orange', probability: 35, yearsToOnset: 5 },
        { name: 'Bladder Cancer', exposure: 'Agent Orange', probability: 28, yearsToOnset: 7 },
        { name: 'Constrictive Bronchiolitis', exposure: 'Burn Pits', probability: 42, yearsToOnset: 3 },
        { name: 'Lung Cancer', exposure: 'Multiple', probability: 38, yearsToOnset: 8 }
      ]
    },
    healthProjection: {
      current: 65,
      oneYear: 62,
      threeYear: 58,
      fiveYear: 53,
      tenYear: 45
    }
  };

  // Predictive Analytics Data
  const predictiveInsights = {
    riskPredictions: [
      { category: 'Mental Health Crisis', probability: 72, timeframe: '3 months', trend: 'increasing' },
      { category: 'Hospitalization', probability: 45, timeframe: '6 months', trend: 'stable' },
      { category: 'Benefits Increase', probability: 85, timeframe: '12 months', trend: 'increasing' },
      { category: 'Housing Instability', probability: 28, timeframe: '6 months', trend: 'decreasing' },
      { category: 'Employment Loss', probability: 35, timeframe: '9 months', trend: 'stable' }
    ],
    outcomeProjections: {
      bestCase: { health: 75, financial: 85, social: 80, overall: 80 },
      expected: { health: 60, financial: 70, social: 65, overall: 65 },
      worstCase: { health: 40, financial: 50, social: 45, overall: 45 }
    },
    interventionImpact: [
      { intervention: 'Mental Health Treatment', impact: 25, cost: 5000, timeToEffect: '3 months' },
      { intervention: 'Vocational Rehabilitation', impact: 20, cost: 8000, timeToEffect: '6 months' },
      { intervention: 'Housing Support', impact: 15, cost: 12000, timeToEffect: '1 month' },
      { intervention: 'Peer Support Groups', impact: 18, cost: 500, timeToEffect: '2 weeks' }
    ]
  };

  // Engagement Metrics
  const engagementMetrics = {
    overall: 73,
    categories: [
      { name: 'Healthcare', score: 85, visits: 24, missed: 3 },
      { name: 'Benefits', score: 92, utilized: 8, available: 12 },
      { name: 'Mental Health', score: 68, sessions: 18, scheduled: 24 },
      { name: 'Social Programs', score: 45, participated: 5, offered: 15 },
      { name: 'Education', score: 78, completed: 3, enrolled: 4 }
    ],
    timeline: [
      { month: 'Jan', engagement: 65, appointments: 8, programs: 3 },
      { month: 'Feb', engagement: 68, appointments: 6, programs: 4 },
      { month: 'Mar', engagement: 72, appointments: 9, programs: 4 },
      { month: 'Apr', engagement: 70, appointments: 7, programs: 5 },
      { month: 'May', engagement: 75, appointments: 10, programs: 6 },
      { month: 'Jun', engagement: 73, appointments: 8, programs: 5 }
    ]
  };

  // Comparative Analysis
  const comparativeData = {
    peerComparison: [
      { metric: 'Health Score', veteran: 65, peerAvg: 72, nationalAvg: 75 },
      { metric: 'Benefit Utilization', veteran: 78, peerAvg: 65, nationalAvg: 60 },
      { metric: 'Treatment Adherence', veteran: 82, peerAvg: 70, nationalAvg: 68 },
      { metric: 'Social Engagement', veteran: 45, peerAvg: 55, nationalAvg: 58 },
      { metric: 'Financial Stability', veteran: 70, peerAvg: 68, nationalAvg: 65 }
    ],
    cohortAnalysis: {
      branch: { army: 68, navy: 72, marines: 65, airForce: 74, veteran: 65 },
      era: { vietnam: 62, gulf: 68, oif: 70, oef: 72, veteran: 65 },
      disability: { '0-30': 78, '40-60': 70, '70-90': 65, '100': 60, veteran: 65 }
    }
  };

  // Custom Tooltip Component
  const CustomTooltip = ({ content, children }: { content: string; children: React.ReactNode }) => (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setTooltipContent(content)}
        onMouseLeave={() => setTooltipContent(null)}
        className="cursor-help"
      >
        {children}
      </div>
      <AnimatePresence>
        {tooltipContent === content && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap max-w-xs"
          >
            <div className="text-xs">{content}</div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
              <div className="border-4 border-transparent border-t-gray-900"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const openModal = (type: string, title: string, content: any) => {
    setModal({ isOpen: true, type, title, content });
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-br from-skinz-bg-secondary to-skinz-bg-tertiary backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Advanced Analytics & Insights</h3>
              <p className="text-skinz-text-secondary text-sm">
                Comprehensive analysis for {veteran.firstName} {veteran.lastName}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-skinz-accent/20 text-skinz-accent rounded-lg hover:bg-skinz-accent/30 transition-colors text-sm">
              Export Report
            </button>
            <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm">
              Share Insights
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto">
          {[
            { id: 'tera', label: 'TERA Analysis', icon: Activity },
            { id: 'predictive', label: 'Predictive Insights', icon: Brain },
            { id: 'engagement', label: 'Engagement Metrics', icon: Users },
            { id: 'comparative', label: 'Comparative Analysis', icon: BarChart3 }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-skinz-accent text-white'
                    : 'bg-skinz-bg-tertiary/50 text-skinz-text-secondary hover:bg-skinz-bg-tertiary'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TERA Analysis Tab */}
      {activeTab === 'tera' && (
        <div className="space-y-6">
          {/* Exposure Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border"
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-yellow-400" />
                Toxic Exposure Risk Assessment
              </h4>
              <CustomTooltip content="Comprehensive analysis of military toxic exposures and health impacts">
                <HelpCircle className="w-4 h-4 text-skinz-text-secondary" />
              </CustomTooltip>
            </div>

            {/* Exposure Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {teraAnalysis.exposures.map((exposure, idx) => {
                const Icon = exposure.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50 cursor-pointer"
                    onClick={() => openModal('exposure', exposure.type, exposure)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center`}
                           style={{ backgroundColor: `${exposure.color}20` }}>
                        <Icon className="w-5 h-5" style={{ color: exposure.color }} />
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        exposure.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                        exposure.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {exposure.severity}
                      </span>
                    </div>
                    <p className="text-white font-medium text-sm mb-1">{exposure.type}</p>
                    <p className="text-skinz-text-secondary text-xs mb-2">{exposure.dateRange}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-skinz-text-secondary text-xs">{exposure.conditions} conditions</span>
                      <div className="flex items-center gap-1">
                        <div className="w-16 h-2 bg-skinz-bg-primary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${exposure.riskScore}%` }}
                            transition={{ duration: 1, delay: idx * 0.1 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: exposure.color }}
                          />
                        </div>
                        <span className="text-xs text-white">{exposure.riskScore}%</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Exposure Timeline */}
            <div className="bg-skinz-bg-tertiary/30 rounded-lg p-4">
              <h5 className="text-white font-medium mb-4">Exposure Timeline</h5>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { year: '1968', intensity: 40 },
                    { year: '1970', intensity: 85 },
                    { year: '1977', intensity: 60 },
                    { year: '1978', intensity: 55 },
                    { year: '1990', intensity: 75 },
                    { year: '1991', intensity: 70 },
                    { year: '2003', intensity: 90 },
                    { year: '2005', intensity: 95 },
                    { year: '2024', intensity: 45 }
                  ]}>
                    <defs>
                      <linearGradient id="exposureGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="year" stroke="#666" />
                    <YAxis stroke="#666" />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1a1d23', border: '1px solid #333' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="intensity"
                      stroke="#FF6B6B"
                      fillOpacity={1}
                      fill="url(#exposureGradient)"
                    />
                    <ReferenceLine y={70} stroke="#FF9F40" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Presumptive Conditions Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border"
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-white">Presumptive Conditions Analysis</h4>
              <button
                onClick={() => toggleSection('conditions')}
                className="text-skinz-text-secondary hover:text-white transition-colors"
              >
                {expandedSections.has('conditions') ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>

            <AnimatePresence>
              {expandedSections.has('conditions') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Confirmed Conditions */}
                    <div>
                      <h5 className="text-white font-medium mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Confirmed Service-Connected
                      </h5>
                      <div className="space-y-2">
                        {teraAnalysis.presumptiveConditions.confirmed.map((condition, idx) => (
                          <div key={idx} className="bg-skinz-bg-tertiary/50 rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-white font-medium text-sm">{condition.name}</p>
                                <p className="text-skinz-text-secondary text-xs">
                                  {condition.exposure} • Diagnosed {condition.diagnosed}
                                </p>
                              </div>
                              <span className="text-skinz-accent font-bold">{condition.rating}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Potential Conditions */}
                    <div>
                      <h5 className="text-white font-medium mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                        Potential Future Conditions
                      </h5>
                      <div className="space-y-2">
                        {teraAnalysis.presumptiveConditions.potential.map((condition, idx) => (
                          <div key={idx} className="bg-skinz-bg-tertiary/50 rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-white font-medium text-sm">{condition.name}</p>
                                <p className="text-skinz-text-secondary text-xs">
                                  {condition.exposure} • Est. {condition.yearsToOnset} years
                                </p>
                              </div>
                              <div className="text-right">
                                <span className={`text-sm font-bold ${
                                  condition.probability > 40 ? 'text-red-400' :
                                  condition.probability > 30 ? 'text-yellow-400' :
                                  'text-green-400'
                                }`}>
                                  {condition.probability}%
                                </span>
                                <p className="text-skinz-text-secondary text-xs">probability</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Health Projection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border"
          >
            <h4 className="text-lg font-semibold text-white mb-4">Long-term Health Projection</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { time: 'Current', health: teraAnalysis.healthProjection.current },
                  { time: '1 Year', health: teraAnalysis.healthProjection.oneYear },
                  { time: '3 Years', health: teraAnalysis.healthProjection.threeYear },
                  { time: '5 Years', health: teraAnalysis.healthProjection.fiveYear },
                  { time: '10 Years', health: teraAnalysis.healthProjection.tenYear }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="time" stroke="#666" />
                  <YAxis stroke="#666" domain={[0, 100]} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1a1d23', border: '1px solid #333' }}
                  />
                  <ReferenceLine y={50} stroke="#FF6B6B" strokeDasharray="5 5" label="Critical" />
                  <ReferenceLine y={70} stroke="#FFD93D" strokeDasharray="5 5" label="Fair" />
                  <Line 
                    type="monotone" 
                    dataKey="health" 
                    stroke="#00F0FF" 
                    strokeWidth={3}
                    dot={{ fill: '#00F0FF', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      )}

      {/* Predictive Insights Tab */}
      {activeTab === 'predictive' && (
        <div className="space-y-6">
          {/* Risk Predictions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border"
          >
            <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              AI-Powered Risk Predictions
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {predictiveInsights.riskPredictions.map((prediction, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-white font-medium">{prediction.category}</p>
                    <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                      prediction.trend === 'increasing' ? 'bg-red-500/20 text-red-400' :
                      prediction.trend === 'decreasing' ? 'bg-green-500/20 text-green-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      <TrendingUp className={`w-3 h-3 ${
                        prediction.trend === 'decreasing' ? 'rotate-180' : ''
                      }`} />
                      {prediction.trend}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className={`text-2xl font-bold ${
                        prediction.probability > 60 ? 'text-red-400' :
                        prediction.probability > 40 ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {prediction.probability}%
                      </p>
                      <p className="text-skinz-text-secondary text-xs">probability</p>
                    </div>
                    <div className="text-right">
                      <p className="text-skinz-text-secondary text-xs">Timeframe</p>
                      <p className="text-white text-sm">{prediction.timeframe}</p>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-skinz-bg-primary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${prediction.probability}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className={`h-full rounded-full ${
                        prediction.probability > 60 ? 'bg-red-400' :
                        prediction.probability > 40 ? 'bg-yellow-400' :
                        'bg-green-400'
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Outcome Projections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border"
          >
            <h4 className="text-lg font-semibold text-white mb-6">Outcome Scenario Analysis</h4>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={[
                  { category: 'Health', best: 75, expected: 60, worst: 40 },
                  { category: 'Financial', best: 85, expected: 70, worst: 50 },
                  { category: 'Social', best: 80, expected: 65, worst: 45 },
                  { category: 'Mental', best: 70, expected: 55, worst: 35 },
                  { category: 'Physical', best: 65, expected: 50, worst: 30 },
                  { category: 'Overall', best: 80, expected: 65, worst: 45 }
                ]}>
                  <PolarGrid stroke="#333" />
                  <PolarAngleAxis dataKey="category" stroke="#666" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#666" />
                  <Radar name="Best Case" dataKey="best" stroke="#4ECDC4" fill="#4ECDC4" fillOpacity={0.3} />
                  <Radar name="Expected" dataKey="expected" stroke="#00F0FF" fill="#00F0FF" fillOpacity={0.3} />
                  <Radar name="Worst Case" dataKey="worst" stroke="#FF6B6B" fill="#FF6B6B" fillOpacity={0.3} />
                  <Legend />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1a1d23', border: '1px solid #333' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Intervention Impact Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border"
          >
            <h4 className="text-lg font-semibold text-white mb-6">Intervention Impact Analysis</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predictiveInsights.interventionImpact.map((intervention, idx) => (
                <div key={idx} className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-white font-medium">{intervention.intervention}</p>
                      <p className="text-skinz-text-secondary text-sm">
                        Time to effect: {intervention.timeToEffect}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold text-lg">+{intervention.impact}%</p>
                      <p className="text-skinz-text-secondary text-xs">improvement</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-skinz-text-secondary text-sm">
                      Cost: ${intervention.cost.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-skinz-text-secondary">ROI:</span>
                      <span className="text-skinz-accent font-bold">
                        {((intervention.impact / intervention.cost) * 1000).toFixed(1)}x
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-skinz-border/50">
                    <button className="w-full px-3 py-1 bg-skinz-accent/20 text-skinz-accent rounded hover:bg-skinz-accent/30 transition-colors text-sm">
                      Recommend Intervention
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Engagement Metrics Tab */}
      {activeTab === 'engagement' && (
        <div className="space-y-6">
          {/* Overall Engagement Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border"
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-white">Engagement Score</h4>
              <CustomTooltip content="Measures veteran's active participation in care and services">
                <Info className="w-4 h-4 text-skinz-text-secondary" />
              </CustomTooltip>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Score */}
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="70%"
                      outerRadius="100%"
                      data={[{ value: engagementMetrics.overall, fill: '#00F0FF' }]}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <RadialBar dataKey="value" cornerRadius={10} fill="#00F0FF" />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {engagementMetrics.overall}%
                    </span>
                    <span className="text-skinz-text-secondary text-xs">Overall</span>
                  </div>
                </div>
              </div>

              {/* Category Scores */}
              <div className="md:col-span-2 space-y-3">
                {engagementMetrics.categories.map((category, idx) => (
                  <div key={idx} className="bg-skinz-bg-tertiary/50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-white text-sm">{category.name}</p>
                      <span className={`text-sm font-bold ${
                        category.score > 80 ? 'text-green-400' :
                        category.score > 60 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {category.score}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-skinz-bg-primary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${category.score}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className={`h-full rounded-full ${
                          category.score > 80 ? 'bg-green-400' :
                          category.score > 60 ? 'bg-yellow-400' :
                          'bg-red-400'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Engagement Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border"
          >
            <h4 className="text-lg font-semibold text-white mb-6">Engagement Trends</h4>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={engagementMetrics.timeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis yAxisId="left" stroke="#666" />
                  <YAxis yAxisId="right" orientation="right" stroke="#666" />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1a1d23', border: '1px solid #333' }}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="engagement"
                    stroke="#00F0FF"
                    fill="#00F0FF"
                    fillOpacity={0.3}
                    name="Engagement %"
                  />
                  <Bar yAxisId="right" dataKey="appointments" fill="#4ECDC4" name="Appointments" />
                  <Bar yAxisId="right" dataKey="programs" fill="#FF6B6B" name="Programs" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      )}

      {/* Comparative Analysis Tab */}
      {activeTab === 'comparative' && (
        <div className="space-y-6">
          {/* Peer Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border"
          >
            <h4 className="text-lg font-semibold text-white mb-6">Veteran-Centric Comparative Analysis</h4>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparativeData.peerComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="metric" stroke="#666" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#666" />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1a1d23', border: '1px solid #333' }}
                  />
                  <Legend />
                  <Bar dataKey="veteran" fill="#00F0FF" name="This Veteran" />
                  <Bar dataKey="peerAvg" fill="#4ECDC4" name="Peer Average" />
                  <Bar dataKey="nationalAvg" fill="#95E1D3" name="National Average" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Cohort Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border"
          >
            <h4 className="text-lg font-semibold text-white mb-6">Cohort Performance Analysis</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* By Branch */}
              <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
                <p className="text-white font-medium mb-3">By Service Branch</p>
                <div className="space-y-2">
                  {Object.entries(comparativeData.cohortAnalysis.branch).map(([branch, score]) => (
                    <div key={branch} className="flex justify-between items-center">
                      <span className={`text-sm ${branch === 'veteran' ? 'text-skinz-accent font-bold' : 'text-skinz-text-secondary'}`}>
                        {branch === 'veteran' ? 'You' : branch.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-skinz-bg-primary rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${branch === 'veteran' ? 'bg-skinz-accent' : 'bg-skinz-primary'}`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <span className="text-white text-sm">{score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* By Era */}
              <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
                <p className="text-white font-medium mb-3">By Service Era</p>
                <div className="space-y-2">
                  {Object.entries(comparativeData.cohortAnalysis.era).map(([era, score]) => (
                    <div key={era} className="flex justify-between items-center">
                      <span className={`text-sm ${era === 'veteran' ? 'text-skinz-accent font-bold' : 'text-skinz-text-secondary'}`}>
                        {era === 'veteran' ? 'You' : era.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-skinz-bg-primary rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${era === 'veteran' ? 'bg-skinz-accent' : 'bg-blue-400'}`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <span className="text-white text-sm">{score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* By Disability */}
              <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
                <p className="text-white font-medium mb-3">By Disability Rating</p>
                <div className="space-y-2">
                  {Object.entries(comparativeData.cohortAnalysis.disability).map(([rating, score]) => (
                    <div key={rating} className="flex justify-between items-center">
                      <span className={`text-sm ${rating === 'veteran' ? 'text-skinz-accent font-bold' : 'text-skinz-text-secondary'}`}>
                        {rating === 'veteran' ? 'You' : `${rating}%`}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-skinz-bg-primary rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${rating === 'veteran' ? 'bg-skinz-accent' : 'bg-green-400'}`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <span className="text-white text-sm">{score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setModal({ ...modal, isOpen: false })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-skinz-bg-secondary rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto border border-skinz-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">{modal.title}</h3>
                <button
                  onClick={() => setModal({ ...modal, isOpen: false })}
                  className="text-skinz-text-secondary hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {modal.type === 'exposure' && modal.content && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-white font-semibold mb-3">Exposure Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-skinz-text-secondary">Type:</span>
                          <span className="text-white">{modal.content.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-skinz-text-secondary">Severity:</span>
                          <span className={`font-medium ${
                            modal.content.severity === 'Critical' ? 'text-red-400' :
                            modal.content.severity === 'High' ? 'text-orange-400' :
                            'text-yellow-400'
                          }`}>{modal.content.severity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-skinz-text-secondary">Duration:</span>
                          <span className="text-white">{modal.content.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-skinz-text-secondary">Intensity:</span>
                          <span className="text-white">{modal.content.intensity}%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-semibold mb-3">Locations</h4>
                      <div className="space-y-1">
                        {modal.content.locations.map((location: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-skinz-accent" />
                            <span className="text-white">{location}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-3">Health Impact Assessment</h4>
                    <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-skinz-text-secondary">Risk Score:</span>
                        <span className="text-2xl font-bold text-red-400">{modal.content.riskScore}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-skinz-text-secondary">Associated Conditions:</span>
                        <span className="text-white font-medium">{modal.content.conditions}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2 bg-skinz-accent text-white rounded-lg hover:bg-skinz-accent/80 transition-colors">
                      File Claim
                    </button>
                    <button className="flex-1 px-4 py-2 bg-skinz-bg-tertiary text-white rounded-lg hover:bg-skinz-bg-tertiary/80 transition-colors">
                      Request Exam
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}