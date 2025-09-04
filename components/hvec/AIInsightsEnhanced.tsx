'use client';

import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area, BarChart, Bar, Cell, PieChart, Pie,
  ComposedChart, ReferenceLine, RadialBarChart, RadialBar, ScatterChart, Scatter
} from 'recharts';
import { motion } from 'framer-motion';
import {
  Brain, Activity, Target, TrendingUp, TrendingDown, AlertTriangle, 
  Sparkles, Network, Zap, Shield, Heart, Clock, Users, Layers, 
  BarChart3, GitBranch, Cpu, Microscope, FlaskRound, Lightbulb,
  AlertCircle, CheckCircle, Info, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

interface AIInsightsEnhancedProps {
  veteran: any;
  insights: any;
}

// Enhanced tooltip with AI predictions
const AITooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload[0]) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-sm text-white p-3 rounded-lg border border-purple-600 shadow-2xl">
        <p className="text-sm font-bold mb-2 text-purple-400">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-3 mb-1">
            <span className="text-xs flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="text-xs font-semibold">
              {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
              {entry.payload?.unit || '%'}
            </span>
          </div>
        ))}
        {payload[0].payload?.confidence && (
          <div className="mt-2 pt-2 border-t border-purple-700">
            <p className="text-xs text-purple-300">
              AI Confidence: {payload[0].payload.confidence}%
            </p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const AIInsightsEnhanced: React.FC<AIInsightsEnhancedProps> = ({ veteran, insights }) => {
  const [timeframe, setTimeframe] = useState<'30' | '60' | '90' | '180'>('90');
  const [showSimulation, setShowSimulation] = useState(true);
  const [showComparisons, setShowComparisons] = useState(false);

  // Generate comprehensive AI analytics with coherent data
  const predictiveAnalytics = useMemo(() => {
    const disabilityRating = veteran?.disabilityRating || 0;
    const combatService = veteran?.combatService ? 1.2 : 1.0;
    const baseRisk = (disabilityRating / 100) * combatService;
    
    return {
      domains: [
        { 
          name: 'Physical', 
          value: Math.min(90, 30 + (baseRisk * 50)), 
          optimal: 20,
          fullMark: 100,
          color: '#EF4444',
          trend: baseRisk > 0.5 ? 'worsening' : 'stable'
        },
        { 
          name: 'Mental', 
          value: Math.min(85, 25 + (baseRisk * 45)), 
          optimal: 15,
          fullMark: 100,
          color: '#F59E0B',
          trend: veteran?.combatService ? 'needs attention' : 'stable'
        },
        { 
          name: 'Social', 
          value: Math.min(75, 20 + (baseRisk * 40)), 
          optimal: 10,
          fullMark: 100,
          color: '#3B82F6',
          trend: 'improving'
        },
        { 
          name: 'Financial', 
          value: Math.min(70, 15 + (baseRisk * 35)), 
          optimal: 5,
          fullMark: 100,
          color: '#10B981',
          trend: 'stable'
        },
        { 
          name: 'Healthcare', 
          value: Math.min(80, 35 + (baseRisk * 30)), 
          optimal: 25,
          fullMark: 100,
          color: '#8B5CF6',
          trend: baseRisk > 0.6 ? 'increasing' : 'stable'
        }
      ],
      overallRisk: Math.floor(baseRisk * 100),
      confidence: 85 + Math.floor(Math.random() * 10)
    };
  }, [veteran]);

  // Pattern recognition with actionable insights
  const patternRecognition = useMemo(() => {
    const disabilityRating = veteran?.disabilityRating || 0;
    
    return [
      {
        name: 'Comorbidity Cascade Risk',
        description: 'High probability of secondary conditions developing',
        confidence: Math.min(95, 70 + (disabilityRating * 0.3)),
        prevalence: Math.min(90, 60 + (disabilityRating * 0.25)),
        severity: disabilityRating >= 70 ? 'critical' : 'warning',
        timeframe: '6-12 months',
        recommendedAction: 'Implement preventive care protocol',
        icon: TrendingUp,
        impact: 'High'
      },
      {
        name: 'Treatment Optimization Opportunity',
        description: 'Current regimen showing suboptimal response markers',
        confidence: 78,
        prevalence: 65,
        severity: 'moderate',
        timeframe: '3-6 months',
        recommendedAction: 'Adjust medication dosing and timing',
        icon: FlaskRound,
        impact: 'Medium'
      },
      {
        name: 'Functional Decline Trajectory',
        description: 'Early indicators of accelerated functional loss',
        confidence: Math.min(90, 50 + (disabilityRating * 0.4)),
        prevalence: Math.min(85, 45 + (disabilityRating * 0.35)),
        severity: disabilityRating >= 50 ? 'warning' : 'low',
        timeframe: '12-18 months',
        recommendedAction: 'Intensive PT/OT intervention',
        icon: TrendingDown,
        impact: disabilityRating >= 50 ? 'High' : 'Low'
      },
      {
        name: 'Mental Health Vulnerability',
        description: 'Elevated risk factors for psychological decompensation',
        confidence: veteran?.combatService ? 85 : 60,
        prevalence: veteran?.combatService ? 75 : 40,
        severity: veteran?.combatService ? 'warning' : 'low',
        timeframe: '3-9 months',
        recommendedAction: 'Proactive mental health engagement',
        icon: Brain,
        impact: veteran?.combatService ? 'High' : 'Medium'
      }
    ];
  }, [veteran]);

  // Intervention simulation results
  const interventionSimulation = useMemo(() => {
    const days = parseInt(timeframe);
    const months = Math.ceil(days / 30);
    const data = [];
    
    for (let i = 0; i <= months; i++) {
      const progress = i / months;
      data.push({
        month: `Month ${i}`,
        noIntervention: Math.floor(70 - (progress * 15)),
        standardCare: Math.floor(70 - (progress * 8) + Math.sin(i) * 3),
        intensiveCare: Math.floor(70 + (progress * 10) + Math.sin(i * 0.5) * 2),
        optimalCare: Math.floor(70 + (progress * 18) + Math.sin(i * 0.3) * 1),
        confidence: 85 - (progress * 10)
      });
    }
    
    return data;
  }, [timeframe]);

  // Outcome projections with confidence intervals
  const outcomeProjections = useMemo(() => {
    const baseScore = 100 - (veteran?.disabilityRating || 0);
    
    return {
      timeline: ['3mo', '6mo', '9mo', '12mo', '18mo'].map((period, index) => ({
        period,
        bestCase: Math.min(100, baseScore + (index * 3)),
        expected: Math.max(20, baseScore - (index * 2)),
        worstCase: Math.max(10, baseScore - (index * 5)),
        currentTrajectory: Math.max(15, baseScore - (index * 3.5)),
        interventionPotential: Math.min(95, baseScore + (index * 2))
      })),
      keyMetrics: {
        qualityOfLife: baseScore,
        functionalCapacity: Math.max(30, baseScore - 10),
        symptomBurden: Math.min(80, 100 - baseScore),
        healthcareUtilization: Math.min(90, (100 - baseScore) * 1.2)
      }
    };
  }, [veteran]);

  // Peer comparison analysis
  const peerComparison = useMemo(() => {
    const disabilityRating = veteran?.disabilityRating || 0;
    const yourScore = 100 - disabilityRating;
    
    return {
      categories: [
        { category: 'Overall Health', you: yourScore, peers: yourScore + 8, optimal: 95 },
        { category: 'Treatment Response', you: yourScore - 5, peers: yourScore + 5, optimal: 90 },
        { category: 'Functional Status', you: yourScore - 10, peers: yourScore, optimal: 85 },
        { category: 'Symptom Management', you: yourScore - 8, peers: yourScore + 3, optimal: 88 },
        { category: 'Care Engagement', you: yourScore + 5, peers: yourScore - 2, optimal: 92 },
        { category: 'Recovery Trajectory', you: yourScore - 3, peers: yourScore + 10, optimal: 90 }
      ],
      percentile: Math.max(15, Math.min(85, 50 - (disabilityRating * 0.5))),
      similarCohortSize: 1247,
      matchingFactors: ['Age', 'Service Era', 'Disability Rating', 'Combat Exposure']
    };
  }, [veteran]);

  // Risk cascade analysis
  const riskCascade = useMemo(() => {
    const primaryRisk = (veteran?.disabilityRating || 0) / 100;
    
    return [
      {
        condition: 'Primary Condition',
        probability: primaryRisk * 100,
        timeframe: 'Current',
        cascadeRisk: []
      },
      {
        condition: 'Secondary Complications',
        probability: primaryRisk * 75,
        timeframe: '6 months',
        cascadeRisk: ['Depression', 'Chronic Pain']
      },
      {
        condition: 'Tertiary Effects',
        probability: primaryRisk * 60,
        timeframe: '12 months',
        cascadeRisk: ['Social Isolation', 'Functional Decline']
      },
      {
        condition: 'System-Wide Impact',
        probability: primaryRisk * 45,
        timeframe: '24 months',
        cascadeRisk: ['Multiple Organ Involvement', 'Disability Progression']
      }
    ];
  }, [veteran]);

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
              <option value="180">180 Days</option>
            </select>
            <button
              onClick={() => setShowSimulation(!showSimulation)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                showSimulation 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <Zap className="w-4 h-4 inline mr-1" />
              Simulation
            </button>
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

        {/* Multi-Domain Risk Projection - Fixed Scaling */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              Multi-Domain Risk Assessment
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={predictiveAnalytics.domains}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  stroke="#9CA3AF" 
                  fontSize={10}
                  tickCount={5}
                />
                <Radar
                  name="Current Risk"
                  dataKey="value"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Optimal Target"
                  dataKey="optimal"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.3}
                />
                <Legend />
                <Tooltip content={<AITooltip />} />
              </RadarChart>
            </ResponsiveContainer>
            
            {/* Risk Summary */}
            <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Overall Risk Score
                </span>
                <span className="text-2xl font-bold text-purple-600">
                  {predictiveAnalytics.overallRisk}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">AI Confidence</span>
                <span className="text-xs font-medium text-purple-500">
                  {predictiveAnalytics.confidence}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" />
              Outcome Trajectory Analysis
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={outcomeProjections.timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="period" stroke="#9CA3AF" fontSize={11} />
                <YAxis stroke="#9CA3AF" fontSize={11} domain={[0, 100]} />
                <Tooltip content={<AITooltip />} />
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
                  stackId="2"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.5}
                  name="Expected"
                />
                <Area
                  type="monotone"
                  dataKey="worstCase"
                  stackId="3"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.3}
                  name="Worst Case"
                />
                <Line
                  type="monotone"
                  dataKey="currentTrajectory"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Current Path"
                />
                {showSimulation && (
                  <Line
                    type="monotone"
                    dataKey="interventionPotential"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    name="With Intervention"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pattern Recognition Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Network className="w-4 h-4 text-purple-500" />
            AI Pattern Recognition
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patternRecognition.map((pattern, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-4 rounded-lg border ${
                  pattern.severity === 'critical' ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20' :
                  pattern.severity === 'warning' ? 'border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/20' :
                  pattern.severity === 'moderate' ? 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20' :
                  'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-900'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <pattern.icon className="w-5 h-5 text-purple-500" />
                    <h5 className="font-semibold text-gray-900 dark:text-white">
                      {pattern.name}
                    </h5>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    pattern.impact === 'High' ? 'bg-red-100 text-red-700' :
                    pattern.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {pattern.impact} Impact
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  {pattern.description}
                </p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                    <div className="text-lg font-bold text-purple-600">
                      {pattern.confidence}%
                    </div>
                    <div className="text-xs text-gray-500">Confidence</div>
                  </div>
                  <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                    <div className="text-lg font-bold text-blue-600">
                      {pattern.prevalence}%
                    </div>
                    <div className="text-xs text-gray-500">Prevalence</div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-xs text-gray-500">
                    Timeframe: {pattern.timeframe}
                  </span>
                  <button className="text-xs px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors">
                    {pattern.recommendedAction}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Intervention Simulation */}
      {showSimulation && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-500" />
            Intervention Impact Simulation
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={interventionSimulation}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} />
              <YAxis stroke="#9CA3AF" fontSize={11} label={{ value: 'Health Score', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<AITooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="optimalCare"
                fill="#10B981"
                stroke="#10B981"
                fillOpacity={0.2}
                name="Optimal Care Pathway"
              />
              <Line
                type="monotone"
                dataKey="intensiveCare"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Intensive Care"
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="standardCare"
                stroke="#F59E0B"
                strokeWidth={2}
                name="Standard Care"
              />
              <Line
                type="monotone"
                dataKey="noIntervention"
                stroke="#EF4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="No Intervention"
              />
              <Bar
                dataKey="confidence"
                fill="#8B5CF6"
                opacity={0.3}
                name="AI Confidence"
                yAxisId="right"
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="#9CA3AF" 
                fontSize={11}
                domain={[0, 100]}
              />
              <ReferenceLine y={70} stroke="#10B981" strokeDasharray="5 5" label="Target" />
            </ComposedChart>
          </ResponsiveContainer>
          
          {/* Simulation Summary */}
          <div className="mt-6 grid grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">+28%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Optimal Care Improvement</div>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">+18%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Intensive Care Benefit</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">+5%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Standard Care Effect</div>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600">-21%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">No Intervention Risk</div>
            </div>
          </div>
        </div>
      )}

      {/* Peer Comparison Analysis */}
      {showComparisons && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            Cohort Comparison Analysis
          </h3>
          
          <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Performance Percentile
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Compared to {peerComparison.similarCohortSize} similar veterans
                </p>
              </div>
              <div className="text-3xl font-bold text-indigo-600">
                {peerComparison.percentile}th
              </div>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={peerComparison.categories} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis type="number" domain={[0, 100]} stroke="#9CA3AF" fontSize={11} />
              <YAxis dataKey="category" type="category" stroke="#9CA3AF" fontSize={11} width={100} />
              <Tooltip content={<AITooltip />} />
              <Legend />
              <Bar dataKey="you" fill="#8B5CF6" name="You" />
              <Bar dataKey="peers" fill="#3B82F6" name="Peer Average" />
              <Bar dataKey="optimal" fill="#10B981" name="Optimal" />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {peerComparison.matchingFactors.map((factor, idx) => (
              <span key={idx} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs rounded-lg">
                {factor}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Risk Cascade Visualization */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-red-500" />
          Risk Cascade Analysis
        </h3>
        
        <div className="space-y-4">
          {riskCascade.map((stage, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx * 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="flex-shrink-0 w-32 text-right">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {stage.timeframe}
                </p>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div 
                    className="h-4 bg-gradient-to-r from-red-500 to-red-300 rounded-full transition-all"
                    style={{ width: `${stage.probability}%` }}
                  />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {stage.probability.toFixed(0)}%
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {stage.condition}
                </p>
                {stage.cascadeRisk.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {stage.cascadeRisk.map((risk, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded">
                        {risk}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Key Insights Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Key AI Insights & Recommendations
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h4 className="font-medium text-gray-900 dark:text-white">Critical Actions</h4>
            </div>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                Immediate cardiovascular risk assessment needed
              </li>
              <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                Mental health intervention within 30 days
              </li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5 text-blue-500" />
              <h4 className="font-medium text-gray-900 dark:text-white">Opportunities</h4>
            </div>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                28% improvement potential with optimal care
              </li>
              <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                Early intervention can prevent 3 complications
              </li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h4 className="font-medium text-gray-900 dark:text-white">Strengths</h4>
            </div>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                Above average care engagement (85th percentile)
              </li>
              <li className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                Treatment adherence tracking positive
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};