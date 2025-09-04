'use client';

import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area, BarChart, Bar, Cell, PieChart, Pie,
  ComposedChart, ReferenceLine, Brush, ScatterChart, Scatter,
  Treemap, FunnelChart, Funnel, LabelList, RadialBarChart, RadialBar
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Sparkles, TrendingUp, AlertTriangle, Shield, Target,
  Zap, Activity, Heart, Clock, Calendar, ChevronRight,
  Eye, Lightbulb, Network, Layers, BarChart3, LineChart as LineChartIcon,
  AlertCircle, CheckCircle, Info, ArrowUpRight, ArrowDownRight,
  Gauge, ThermometerSun, Wind, Droplet, Sun, Cloud
} from 'lucide-react';

interface AIInsightsEnhancedProps {
  veteran: any;
  insights: any;
}

export const AIInsightsEnhanced: React.FC<AIInsightsEnhancedProps> = ({ veteran, insights }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'health' | 'benefits' | 'social'>('all');
  const [timeframe, setTimeframe] = useState<'30' | '60' | '90' | '180'>('90');
  const [showComparisons, setShowComparisons] = useState(true);

  // Generate comprehensive AI analytics
  const predictiveAnalytics = generatePredictiveAnalytics(veteran, timeframe);
  const patternRecognition = generatePatternRecognition(veteran);
  const interventionSimulation = generateInterventionSimulation(veteran);
  const outcomeProjections = generateOutcomeProjections(veteran);
  const peerComparison = generatePeerComparison(veteran);

  return (
    <div className="space-y-6">
      {/* AI Analytics Dashboard */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            AI-Powered Predictive Analytics
          </h3>
          <div className="flex items-center gap-2">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg text-sm border border-gray-300 dark:border-gray-600"
            >
              <option value="30">30 Days</option>
              <option value="60">60 Days</option>
              <option value="90">90 Days</option>
              <option value="180">6 Months</option>
            </select>
            <button
              onClick={() => setShowComparisons(!showComparisons)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                showComparisons 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <Layers className="w-4 h-4 inline mr-1" />
              Comparisons
            </button>
          </div>
        </div>

        {/* Multi-Domain Risk Projection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              Multi-Domain Risk Projection
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="90%" data={predictiveAnalytics.domains}>
                <RadialBar
                  label={{ position: 'insideStart', fill: '#fff', fontSize: 11 }}
                  background
                  dataKey="risk"
                >
                  {predictiveAnalytics.domains.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RadialBar>
                <Legend 
                  iconSize={10} 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  wrapperStyle={{ fontSize: '12px' }}
                />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" />
              Outcome Probability Distribution
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={outcomeProjections.timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} />
                <YAxis stroke="#9CA3AF" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="bestCase"
                  stackId="1"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.3}
                  name="Best Case"
                />
                <Area
                  type="monotone"
                  dataKey="expected"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.5}
                  name="Expected"
                />
                <Area
                  type="monotone"
                  dataKey="worstCase"
                  stackId="1"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.3}
                  name="Worst Case"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pattern Recognition Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Network className="w-4 h-4 text-purple-500" />
            Advanced Pattern Recognition
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {patternRecognition.patterns.map((pattern, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-4 rounded-lg border ${
                  pattern.severity === 'critical' ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20' :
                  pattern.severity === 'warning' ? 'border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/20' :
                  'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <pattern.icon className="w-5 h-5 text-gray-600" />
                    <h5 className="font-semibold text-gray-900 dark:text-white">
                      {pattern.name}
                    </h5>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    pattern.confidence >= 80 ? 'bg-green-100 text-green-700' :
                    pattern.confidence >= 60 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {pattern.confidence}% match
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {pattern.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Prevalence</span>
                    <span className="font-medium">{pattern.prevalence}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pattern.prevalence}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className={`h-full ${
                        pattern.severity === 'critical' ? 'bg-red-500' :
                        pattern.severity === 'warning' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}
                    />
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>Action:</strong> {pattern.recommendedAction}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Intervention Simulation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Intervention Impact Simulation
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Projected Impact by Intervention Type
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={interventionSimulation.interventions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} angle={-45} textAnchor="end" />
                <YAxis yAxisId="left" stroke="#9CA3AF" fontSize={11} />
                <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="impact" fill="#3B82F6" name="Health Impact %" />
                <Bar yAxisId="left" dataKey="qol" fill="#10B981" name="QoL Improvement %" />
                <Line yAxisId="right" type="monotone" dataKey="costBenefit" stroke="#F59E0B" name="Cost-Benefit Ratio" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Cumulative Benefit Timeline
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={interventionSimulation.timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="week" stroke="#9CA3AF" fontSize={11} />
                <YAxis stroke="#9CA3AF" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="physical" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="mental" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="social" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                <ReferenceLine y={50} stroke="#EF4444" strokeDasharray="5 5" label="Target" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Peer Comparison Analysis */}
      {showComparisons && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            Cohort Comparison Analysis
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={peerComparison.metrics}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="metric" stroke="#9CA3AF" fontSize={11} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9CA3AF" fontSize={10} />
                  <Radar name="This Veteran" dataKey="veteran" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                  <Radar name="Peer Average" dataKey="peers" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                  <Radar name="National Average" dataKey="national" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Key Insights</h4>
                <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                  {peerComparison.insights.map((insight, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-medium text-green-900 dark:text-green-200 mb-2">Strengths</h4>
                <div className="space-y-1">
                  {peerComparison.strengths.map((strength, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-green-700 dark:text-green-300">{strength.area}</span>
                      <span className="font-medium text-green-800 dark:text-green-200">+{strength.delta}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions
function generatePredictiveAnalytics(veteran: any, timeframe: string) {
  const days = parseInt(timeframe);
  const baseRisk = veteran.disabilityRating / 100;
  
  return {
    domains: [
      { name: 'Physical Health', risk: Math.min(95, baseRisk * 80 + Math.random() * 20), color: '#EF4444' },
      { name: 'Mental Health', risk: Math.min(95, baseRisk * 70 + Math.random() * 25), color: '#F59E0B' },
      { name: 'Social Function', risk: Math.min(95, baseRisk * 60 + Math.random() * 30), color: '#3B82F6' },
      { name: 'Financial Stability', risk: Math.min(95, baseRisk * 50 + Math.random() * 25), color: '#10B981' },
      { name: 'Healthcare Utilization', risk: Math.min(95, baseRisk * 75 + Math.random() * 20), color: '#8B5CF6' }
    ]
  };
}

function generatePatternRecognition(veteran: any) {
  const patterns = [
    {
      name: 'Deterioration Pattern',
      description: 'Progressive functional decline matching similar cohort',
      confidence: 85,
      prevalence: 72,
      severity: veteran.disabilityRating >= 70 ? 'critical' : 'warning',
      recommendedAction: 'Initiate early intervention protocol',
      icon: TrendingUp
    },
    {
      name: 'Treatment Response',
      description: 'Positive response indicators to current regimen',
      confidence: 78,
      prevalence: 65,
      severity: 'normal',
      recommendedAction: 'Continue current treatment plan',
      icon: Heart
    },
    {
      name: 'Risk Cascade',
      description: 'Multiple interconnected risk factors identified',
      confidence: veteran.combatService ? 82 : 60,
      prevalence: veteran.combatService ? 80 : 55,
      severity: veteran.combatService ? 'warning' : 'normal',
      recommendedAction: 'Comprehensive risk mitigation strategy',
      icon: AlertTriangle
    }
  ];
  
  return { patterns };
}

function generateInterventionSimulation(veteran: any) {
  return {
    interventions: [
      { name: 'Physical Therapy', impact: 65, qol: 72, costBenefit: 3.2 },
      { name: 'Mental Health Counseling', impact: 78, qol: 85, costBenefit: 4.5 },
      { name: 'Medication Optimization', impact: 55, qol: 60, costBenefit: 2.8 },
      { name: 'Peer Support Groups', impact: 70, qol: 80, costBenefit: 5.2 },
      { name: 'Vocational Rehab', impact: 60, qol: 75, costBenefit: 3.8 }
    ],
    timeline: Array.from({ length: 12 }, (_, i) => ({
      week: `W${i + 1}`,
      physical: Math.min(80, 20 + i * 5 + Math.random() * 10),
      mental: Math.min(75, 15 + i * 4.5 + Math.random() * 8),
      social: Math.min(70, 10 + i * 4 + Math.random() * 12)
    }))
  };
}

function generateOutcomeProjections(veteran: any) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  return {
    timeline: months.map((month, i) => ({
      month,
      bestCase: 30 + i * 8 + Math.random() * 5,
      expected: 25 + i * 5 + Math.random() * 10,
      worstCase: 20 + i * 2 + Math.random() * 5
    }))
  };
}

function generatePeerComparison(veteran: any) {
  return {
    metrics: [
      { metric: 'Treatment Adherence', veteran: 82, peers: 68, national: 65 },
      { metric: 'Health Outcomes', veteran: 75, peers: 70, national: 72 },
      { metric: 'Quality of Life', veteran: 68, peers: 72, national: 75 },
      { metric: 'Resource Utilization', veteran: 85, peers: 78, national: 80 },
      { metric: 'Recovery Rate', veteran: 70, peers: 65, national: 68 },
      { metric: 'Engagement Score', veteran: 78, peers: 72, national: 70 }
    ],
    insights: [
      'Above average treatment adherence compared to peer cohort',
      'Resource utilization 8% higher than national average',
      'Quality of life metrics show improvement opportunity'
    ],
    strengths: [
      { area: 'Adherence', delta: 14 },
      { area: 'Engagement', delta: 8 },
      { area: 'Recovery', delta: 5 }
    ]
  };
}

const Users = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);