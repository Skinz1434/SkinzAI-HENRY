'use client';

import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area, BarChart, Bar, Cell, PieChart, Pie,
  ComposedChart, ReferenceLine, ScatterChart, Scatter
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Brain, Heart, Shield, AlertTriangle, TrendingUp, TrendingDown,
  Zap, Target, Gauge, ThermometerSun, Microscope, TestTube, Beaker,
  FileSearch, AlertCircle, Info, ChevronRight, Eye, Sparkles,
  BarChart3, PieChart as PieIcon, Stethoscope, Pill, HeartHandshake,
  Clock, Calendar, CheckCircle, XCircle, AlertOctagon
} from 'lucide-react';

interface DiagnosticsEnhancedProps {
  veteran: any;
  assessment: any;
}

export const DiagnosticsEnhanced: React.FC<DiagnosticsEnhancedProps> = ({ veteran, assessment }) => {
  const [selectedBiomarker, setSelectedBiomarker] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '1y' | 'all'>('6m');
  const [showPredictions, setShowPredictions] = useState(true);

  // Generate comprehensive biomarker data with proper structure
  const biomarkerData = useMemo(() => {
    const severity = veteran?.disabilityRating >= 70 ? 'high' : 'medium';
    return {
      inflammatory: {
        esr: severity === 'high' ? 45 : 25,
        crp: severity === 'high' ? 12 : 5,
        il6: severity === 'high' ? 8.5 : 3.2,
        tnfAlpha: severity === 'high' ? 15 : 7
      },
      metabolic: {
        glucose: 95 + Math.random() * 30,
        hba1c: 5.5 + Math.random() * 2,
        lipidPanel: {
          ldl: 100 + Math.random() * 50,
          hdl: 40 + Math.random() * 20,
          triglycerides: 150 + Math.random() * 100
        }
      },
      organ: {
        liver: { ast: 25, alt: 30, bilirubin: 0.8 },
        kidney: { creatinine: 0.9, bun: 18, egfr: 90 }
      }
    };
  }, [veteran]);

  // Generate diagnostic pathways
  const diagnosticPathways = useMemo(() => {
    const pathways = [];
    
    if (veteran?.disabilityRating >= 70) {
      pathways.push({
        id: '1',
        diagnosis: 'Inflammatory Arthritis',
        icd10: 'M06.9',
        confidence: 85,
        evidence: ['Elevated ESR/CRP', 'Morning stiffness > 1hr', 'Symmetric joint involvement'],
        nextSteps: ['Rheumatology referral', 'Anti-CCP testing', 'Joint imaging']
      });
    }
    
    if (veteran?.combatService) {
      pathways.push({
        id: '2',
        diagnosis: 'PTSD with Physical Manifestations',
        icd10: 'F43.10',
        confidence: 72,
        evidence: ['Combat exposure', 'Sleep disturbance', 'Hypervigilance markers'],
        nextSteps: ['Mental health eval', 'Sleep study', 'Stress biomarkers']
      });
    }
    
    pathways.push({
      id: '3',
      diagnosis: 'Metabolic Syndrome',
      icd10: 'E88.81',
      confidence: 65,
      evidence: ['BMI > 30', 'Elevated glucose', 'Dyslipidemia'],
      nextSteps: ['Nutrition consult', 'Exercise program', 'Metformin consideration']
    });
    
    return pathways;
  }, [veteran]);

  // Generate lab trends data
  const labTrends = useMemo(() => {
    const months = timeRange === '3m' ? 3 : timeRange === '6m' ? 6 : timeRange === '1y' ? 12 : 24;
    const data = [];
    
    for (let i = 0; i < months; i++) {
      data.push({
        month: `M${i + 1}`,
        inflammation: Math.floor(30 + Math.random() * 40 + ((veteran?.disabilityRating || 0) / 2)),
        metabolic: Math.floor(60 + Math.random() * 20),
        predicted: Math.floor(35 + Math.random() * 30 + (i * 2)),
        interventions: Math.floor(Math.random() * 3)
      });
    }
    
    return data;
  }, [veteran, timeRange]);

  // Generate correlation matrix data
  const correlationMatrix = useMemo(() => {
    const disabilityRating = veteran?.disabilityRating || 0;
    return {
      systemHealth: [
        { system: 'Musculoskeletal', current: Math.max(0, 100 - disabilityRating), predicted: Math.max(0, 100 - disabilityRating - 10) },
        { system: 'Cardiovascular', current: Math.floor(75 + Math.random() * 15), predicted: Math.floor(70 + Math.random() * 15) },
        { system: 'Neurological', current: Math.floor(80 + Math.random() * 10), predicted: Math.floor(75 + Math.random() * 10) },
        { system: 'Metabolic', current: Math.floor(70 + Math.random() * 20), predicted: Math.floor(65 + Math.random() * 20) },
        { system: 'Immune', current: Math.floor(65 + Math.random() * 25), predicted: Math.floor(60 + Math.random() * 25) },
        { system: 'Respiratory', current: Math.floor(85 + Math.random() * 10), predicted: Math.floor(80 + Math.random() * 10) }
      ]
    };
  }, [veteran]);

  // Generate clinical scores
  const clinicalScores = useMemo(() => {
    const disabilityRating = veteran?.disabilityRating || 0;
    const severity = disabilityRating >= 70 ? 'critical' : 
                    disabilityRating >= 40 ? 'warning' : 'normal';
    
    return [
      {
        name: 'FRAX Score',
        value: severity === 'critical' ? '18%' : severity === 'warning' ? '12%' : '7%',
        percentage: severity === 'critical' ? 75 : severity === 'warning' ? 50 : 25,
        status: severity === 'critical' ? 'critical' : severity === 'warning' ? 'warning' : 'normal',
        icon: Heart
      },
      {
        name: 'PHQ-9',
        value: severity === 'critical' ? '15' : severity === 'warning' ? '10' : '5',
        percentage: severity === 'critical' ? 65 : severity === 'warning' ? 45 : 20,
        status: severity === 'critical' ? 'warning' : 'normal',
        icon: Brain
      },
      {
        name: 'GAD-7',
        value: severity === 'critical' ? '12' : severity === 'warning' ? '8' : '3',
        percentage: severity === 'critical' ? 60 : severity === 'warning' ? 40 : 15,
        status: severity === 'critical' ? 'warning' : severity === 'warning' ? 'normal' : 'normal',
        icon: AlertCircle
      },
      {
        name: 'Pain Scale',
        value: severity === 'critical' ? '7/10' : severity === 'warning' ? '5/10' : '3/10',
        percentage: severity === 'critical' ? 70 : severity === 'warning' ? 50 : 30,
        status: severity,
        icon: Gauge
      }
    ];
  }, [veteran]);

  // Generate risk stratification data
  const riskStratification = useMemo(() => {
    const disabilityRating = veteran?.disabilityRating || 0;
    const combatService = veteran?.combatService || false;
    
    const conditions = [
      {
        condition: 'Cardiovascular Disease',
        likelihood: Math.min(100, 45 + disabilityRating / 2),
        impact: 80,
        riskLevel: disabilityRating >= 70 ? 'critical' : 'high'
      },
      {
        condition: 'Diabetes Progression',
        likelihood: Math.min(100, 35 + disabilityRating / 3),
        impact: 60,
        riskLevel: disabilityRating >= 50 ? 'high' : 'medium'
      },
      {
        condition: 'Mental Health Crisis',
        likelihood: combatService ? 65 : 30,
        impact: 90,
        riskLevel: combatService ? 'critical' : 'medium'
      },
      {
        condition: 'Mobility Decline',
        likelihood: Math.min(100, disabilityRating),
        impact: 70,
        riskLevel: disabilityRating >= 70 ? 'high' : 'medium'
      },
      {
        condition: 'Chronic Pain Syndrome',
        likelihood: Math.min(100, 50 + disabilityRating / 2),
        impact: 65,
        riskLevel: disabilityRating >= 50 ? 'high' : 'medium'
      }
    ];

    const recommendations = [
      {
        action: 'Initiate Preventive Cardiology Protocol',
        rationale: 'Multiple cardiovascular risk factors identified',
        urgency: disabilityRating >= 70 ? 'immediate' : 'urgent',
        expectedOutcome: '30% reduction in CV event risk',
        icon: Heart
      },
      {
        action: 'Mental Health Integration',
        rationale: 'Combat exposure with physical comorbidities',
        urgency: combatService ? 'urgent' : 'routine',
        expectedOutcome: 'Improved quality of life scores',
        icon: Brain
      },
      {
        action: 'Pain Management Optimization',
        rationale: 'High pain scores affecting function',
        urgency: disabilityRating >= 50 ? 'urgent' : 'routine',
        expectedOutcome: 'Reduced opioid dependence risk',
        icon: Pill
      }
    ];

    return { conditions, recommendations };
  }, [veteran]);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload[0]) {
      return (
        <div className="bg-gray-900 text-white p-2 rounded-lg border border-gray-700">
          <p className="text-sm font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Diagnostic Overview Dashboard */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Microscope className="w-5 h-5 text-blue-500" />
            Comprehensive Diagnostic Analysis
          </h3>
          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg text-sm border border-gray-300 dark:border-gray-600"
            >
              <option value="3m">3 Months</option>
              <option value="6m">6 Months</option>
              <option value="1y">1 Year</option>
              <option value="all">All Time</option>
            </select>
            <button
              onClick={() => setShowPredictions(!showPredictions)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                showPredictions 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <Sparkles className="w-4 h-4 inline mr-1" />
              AI Predictions
            </button>
          </div>
        </div>

        {/* Key Diagnostic Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {clinicalScores.map((score, idx) => (
            <motion.div
              key={score.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <score.icon className="w-5 h-5 text-gray-500" />
                <span className={`text-xs px-2 py-1 rounded-full ${
                  score.status === 'critical' ? 'bg-red-100 text-red-700' :
                  score.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {score.status}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {score.value}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {score.name}
              </div>
              <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${
                    score.status === 'critical' ? 'bg-red-500' :
                    score.status === 'warning' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${score.percentage}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Multi-System Correlation Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-500" />
              System-Wide Health Radar
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={correlationMatrix.systemHealth}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="system" stroke="#9CA3AF" fontSize={11} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9CA3AF" fontSize={10} />
                <Radar
                  name="Current"
                  dataKey="current"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                />
                {showPredictions && (
                  <Radar
                    name="Predicted (6mo)"
                    dataKey="predicted"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.3}
                  />
                )}
                <Legend />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" />
              Biomarker Trends & Predictions
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={labTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} />
                <YAxis yAxisId="left" stroke="#9CA3AF" fontSize={11} />
                <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="inflammation"
                  fill="#EF4444"
                  stroke="#EF4444"
                  fillOpacity={0.3}
                  name="Inflammation Index"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="metabolic"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Metabolic Score"
                />
                {showPredictions && (
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="predicted"
                    stroke="#8B5CF6"
                    strokeDasharray="5 5"
                    name="AI Prediction"
                  />
                )}
                <Bar
                  yAxisId="right"
                  dataKey="interventions"
                  fill="#F59E0B"
                  name="Interventions"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Advanced Diagnostic Pathways */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          AI-Powered Diagnostic Pathways
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {diagnosticPathways.map((pathway, idx) => (
            <motion.div
              key={pathway.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all ${
                pathway.confidence >= 80 ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20' :
                pathway.confidence >= 60 ? 'border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/20' :
                'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-900'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {pathway.diagnosis}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">ICD-10: {pathway.icd10}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {pathway.confidence}%
                  </div>
                  <div className="text-xs text-gray-500">Confidence</div>
                </div>
              </div>

              {/* Evidence Indicators */}
              <div className="space-y-2 mb-3">
                {pathway.evidence.slice(0, 3).map((evidence, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">{evidence}</span>
                  </div>
                ))}
              </div>

              {/* Recommended Actions */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Next Steps:
                </div>
                <div className="flex flex-wrap gap-1">
                  {pathway.nextSteps.map((step, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded">
                      {step}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Risk Stratification Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-500" />
            Risk Stratification Analysis
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="likelihood" 
                type="number" 
                domain={[0, 100]} 
                stroke="#9CA3AF" 
                fontSize={11}
                label={{ value: 'Likelihood (%)', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                dataKey="impact" 
                type="number" 
                domain={[0, 100]} 
                stroke="#9CA3AF" 
                fontSize={11}
                label={{ value: 'Impact Score', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter name="Conditions" data={riskStratification.conditions} fill="#8884d8">
                {riskStratification.conditions.map((entry: any, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={
                      entry.riskLevel === 'critical' ? '#EF4444' :
                      entry.riskLevel === 'high' ? '#F59E0B' :
                      entry.riskLevel === 'medium' ? '#3B82F6' :
                      '#10B981'
                    }
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-blue-500" />
            Clinical Decision Support Matrix
          </h3>
          <div className="space-y-3">
            {riskStratification.recommendations.map((rec, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-3 rounded-lg border ${
                  rec.urgency === 'immediate' ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20' :
                  rec.urgency === 'urgent' ? 'border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/20' :
                  'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-900'
                }`}
              >
                <div className="flex items-start gap-3">
                  <rec.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      {rec.action}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {rec.rationale}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        rec.urgency === 'immediate' ? 'bg-red-100 text-red-700' :
                        rec.urgency === 'urgent' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {rec.urgency}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Expected: {rec.expectedOutcome}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Laboratory Results Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TestTube className="w-5 h-5 text-green-500" />
          Laboratory Results Summary
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">ESR</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {biomarkerData.inflammatory.esr}
            </div>
            <div className="text-xs text-gray-400">mm/hr (0-20)</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">CRP</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {biomarkerData.inflammatory.crp}
            </div>
            <div className="text-xs text-gray-400">mg/L (&lt;3.0)</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Glucose</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {Math.floor(biomarkerData.metabolic.glucose)}
            </div>
            <div className="text-xs text-gray-400">mg/dL (70-100)</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">HbA1c</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {biomarkerData.metabolic.hba1c.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-400">(&lt;5.7%)</div>
          </div>
        </div>
      </div>
    </div>
  );
};