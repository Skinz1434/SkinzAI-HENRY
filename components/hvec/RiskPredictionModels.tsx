'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RadialBarChart, RadialBar, ResponsiveContainer, Legend, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Area, AreaChart,
  ScatterChart, Scatter, Cell, ReferenceLine, ReferenceArea
} from 'recharts';
import { 
  Brain, Heart, Shield, AlertTriangle, TrendingUp, 
  Activity, Target, Zap, AlertCircle
} from 'lucide-react';

interface RiskPrediction {
  category: string;
  current: number;
  predicted30: number;
  predicted60: number;
  predicted90: number;
  factors: string[];
  interventions: string[];
  confidence: number;
}

interface RiskPredictionDashboardProps {
  predictions: RiskPrediction[];
  veteranId: string;
}

export const RiskPredictionDashboard: React.FC<RiskPredictionDashboardProps> = ({ predictions }) => {
  const getCriticalityColor = (risk: number) => {
    if (risk < 30) return '#10B981';
    if (risk < 50) return '#F59E0B';
    if (risk < 70) return '#EF4444';
    return '#991B1B';
  };

  const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'mental health': return Brain;
      case 'cardiovascular': return Heart;
      case 'musculoskeletal': return Activity;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {predictions.map((prediction, index) => {
        const Icon = getIcon(prediction.category);
        const timelineData = [
          { time: 'Current', risk: prediction.current },
          { time: '30 Days', risk: prediction.predicted30 },
          { time: '60 Days', risk: prediction.predicted60 },
          { time: '90 Days', risk: prediction.predicted90 }
        ];

        return (
          <motion.div
            key={prediction.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${
                  prediction.current > 70 ? 'from-red-500 to-red-600' :
                  prediction.current > 50 ? 'from-orange-500 to-orange-600' :
                  prediction.current > 30 ? 'from-yellow-500 to-yellow-600' :
                  'from-green-500 to-green-600'
                }`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {prediction.category} Risk
                  </h4>
                  <p className="text-xs text-gray-500">
                    Confidence: {prediction.confidence}%
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold" style={{ color: getCriticalityColor(prediction.current) }}>
                  {prediction.current}%
                </div>
                <div className="text-xs text-gray-500">Current Risk</div>
              </div>
            </div>

            {/* Risk Timeline Chart */}
            <div className="mb-4">
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                  <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} />
                  <YAxis stroke="#9CA3AF" fontSize={10} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="risk"
                    stroke={getCriticalityColor(prediction.current)}
                    fill={getCriticalityColor(prediction.current)}
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <ReferenceLine y={50} stroke="#EF4444" strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Risk Factors */}
            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contributing Factors
              </h5>
              <div className="flex flex-wrap gap-2">
                {prediction.factors.slice(0, 3).map((factor, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-600 dark:text-gray-400"
                  >
                    {factor}
                  </span>
                ))}
                {prediction.factors.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-600 dark:text-gray-400">
                    +{prediction.factors.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Recommended Interventions */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recommended Interventions
              </h5>
              <div className="space-y-1">
                {prediction.interventions.slice(0, 2).map((intervention, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-400">{intervention}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

interface CascadeRiskAnalysisProps {
  primaryCondition: string;
  cascadeRisks: Array<{
    condition: string;
    probability: number;
    timeframe: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    preventable: boolean;
  }>;
}

export const CascadeRiskAnalysis: React.FC<CascadeRiskAnalysisProps> = ({ 
  primaryCondition, 
  cascadeRisks 
}) => {
  const sortedRisks = [...cascadeRisks].sort((a, b) => b.probability - a.probability);

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-6 border border-red-200 dark:border-red-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          Cascade Risk Analysis
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Primary: {primaryCondition}
        </div>
      </div>

      <div className="space-y-3">
        {sortedRisks.map((risk, index) => (
          <motion.div
            key={risk.condition}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {risk.condition}
                  </h4>
                  {risk.preventable && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs rounded-full">
                      Preventable
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Timeframe: {risk.timeframe}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${
                  risk.severity === 'critical' ? 'text-red-600' :
                  risk.severity === 'high' ? 'text-orange-600' :
                  risk.severity === 'medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {risk.probability}%
                </div>
                <div className="text-xs text-gray-500 capitalize">{risk.severity} Risk</div>
              </div>
            </div>

            {/* Risk Bar */}
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${risk.probability}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`h-full ${
                  risk.severity === 'critical' ? 'bg-red-500' :
                  risk.severity === 'high' ? 'bg-orange-500' :
                  risk.severity === 'medium' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Clinical Alert:</strong> Multiple cascade risks detected. Immediate intervention recommended to prevent condition progression.
          </div>
        </div>
      </div>
    </div>
  );
};

interface PredictiveHealthScoreProps {
  currentScore: number;
  projections: {
    optimistic: { month: string; score: number }[];
    realistic: { month: string; score: number }[];
    pessimistic: { month: string; score: number }[];
  };
}

export const PredictiveHealthScore: React.FC<PredictiveHealthScoreProps> = ({ 
  currentScore, 
  projections 
}) => {
  // Combine all projections for the chart
  const chartData = projections.realistic.map((item, index) => ({
    month: item.month,
    optimistic: projections.optimistic[index].score,
    realistic: item.score,
    pessimistic: projections.pessimistic[index].score
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-500" />
          Predictive Health Score
        </h3>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">
            {currentScore}
          </div>
          <div className="text-xs text-gray-500">Current Score</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
          <XAxis dataKey="month" stroke="#9CA3AF" fontSize={10} />
          <YAxis stroke="#9CA3AF" fontSize={10} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Legend />
          
          {/* Optimistic projection */}
          <Line
            type="monotone"
            dataKey="optimistic"
            stroke="#10B981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Best Case"
          />
          
          {/* Realistic projection */}
          <Line
            type="monotone"
            dataKey="realistic"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ fill: '#3B82F6', r: 4 }}
            name="Expected"
          />
          
          {/* Pessimistic projection */}
          <Line
            type="monotone"
            dataKey="pessimistic"
            stroke="#EF4444"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Worst Case"
          />
          
          <ReferenceLine y={currentScore} stroke="#8B5CF6" strokeDasharray="10 5" label="Current" />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Best Case (6mo)</div>
          <div className="text-lg font-bold text-green-600">
            {projections.optimistic[projections.optimistic.length - 1].score}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Expected (6mo)</div>
          <div className="text-lg font-bold text-blue-600">
            {projections.realistic[projections.realistic.length - 1].score}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Worst Case (6mo)</div>
          <div className="text-lg font-bold text-red-600">
            {projections.pessimistic[projections.pessimistic.length - 1].score}
          </div>
        </div>
      </div>
    </div>
  );
};