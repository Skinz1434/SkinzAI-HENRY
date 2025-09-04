'use client';

import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area, BarChart, Bar, Cell, PieChart, Pie,
  ComposedChart, ReferenceLine, Brush, ScatterChart, Scatter
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface InflammatoryTrendProps {
  data: Array<{
    date: string;
    esr: number;
    crp: number;
    rf?: number;
  }>;
}

export const InflammatoryTrendChart: React.FC<InflammatoryTrendProps> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Inflammatory Markers Trend</h4>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
          <YAxis stroke="#9CA3AF" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px'
            }}
            labelStyle={{ color: '#F3F4F6' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Line
            type="monotone"
            dataKey="esr"
            stroke="#EF4444"
            strokeWidth={2}
            dot={{ fill: '#EF4444', r: 4 }}
            name="ESR (mm/hr)"
          />
          <Line
            type="monotone"
            dataKey="crp"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={{ fill: '#F59E0B', r: 4 }}
            name="CRP (mg/L)"
          />
          {data[0].rf !== undefined && (
            <Line
              type="monotone"
              dataKey="rf"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ fill: '#8B5CF6', r: 4 }}
              name="RF (IU/mL)"
            />
          )}
          <ReferenceLine y={20} stroke="#10B981" strokeDasharray="5 5" label="Normal ESR" />
          <ReferenceLine y={3} stroke="#10B981" strokeDasharray="5 5" label="Normal CRP" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

interface JointAssessmentRadarProps {
  data: Array<{
    joint: string;
    pain: number;
    swelling: number;
    stiffness: number;
    function: number;
  }>;
}

export const JointAssessmentRadar: React.FC<JointAssessmentRadarProps> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Joint Assessment Profile</h4>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis dataKey="joint" stroke="#9CA3AF" fontSize={12} />
          <PolarRadiusAxis angle={90} domain={[0, 10]} stroke="#9CA3AF" fontSize={10} />
          <Radar
            name="Pain"
            dataKey="pain"
            stroke="#EF4444"
            fill="#EF4444"
            fillOpacity={0.3}
          />
          <Radar
            name="Swelling"
            dataKey="swelling"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.3}
          />
          <Radar
            name="Stiffness"
            dataKey="stiffness"
            stroke="#F59E0B"
            fill="#F59E0B"
            fillOpacity={0.3}
          />
          <Radar
            name="Function"
            dataKey="function"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.3}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface DiseaseActivityScoreProps {
  score: number;
  trend: 'up' | 'down' | 'stable';
  components: {
    tjc: number; // Tender Joint Count
    sjc: number; // Swollen Joint Count
    vas: number; // Visual Analog Scale
    esr: number; // ESR
  };
}

export const DiseaseActivityGauge: React.FC<DiseaseActivityScoreProps> = ({ score, trend, components }) => {
  const getColorForScore = (score: number) => {
    if (score < 2.6) return '#10B981'; // Remission
    if (score < 3.2) return '#84CC16'; // Low
    if (score < 5.1) return '#F59E0B'; // Moderate
    return '#EF4444'; // High
  };

  const getActivityLevel = (score: number) => {
    if (score < 2.6) return 'Remission';
    if (score < 3.2) return 'Low Activity';
    if (score < 5.1) return 'Moderate Activity';
    return 'High Activity';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900 dark:text-white">DAS28 Score</h4>
        <div className="flex items-center gap-1">
          {trend === 'up' && <TrendingUp className="w-4 h-4 text-red-500" />}
          {trend === 'down' && <TrendingDown className="w-4 h-4 text-green-500" />}
          {trend === 'stable' && <Minus className="w-4 h-4 text-gray-500" />}
        </div>
      </div>
      
      <div className="text-center mb-4">
        <div className="text-4xl font-bold" style={{ color: getColorForScore(score) }}>
          {score.toFixed(2)}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {getActivityLevel(score)}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Tender Joints</span>
          <span className="font-medium">{components.tjc}/28</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Swollen Joints</span>
          <span className="font-medium">{components.sjc}/28</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Patient Global</span>
          <span className="font-medium">{components.vas}/100</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">ESR</span>
          <span className="font-medium">{components.esr} mm/hr</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full flex">
            <div className="bg-green-500" style={{ width: '23%' }}></div>
            <div className="bg-lime-500" style={{ width: '7%' }}></div>
            <div className="bg-yellow-500" style={{ width: '40%' }}></div>
            <div className="bg-red-500" style={{ width: '30%' }}></div>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>0</span>
          <span>2.6</span>
          <span>3.2</span>
          <span>5.1</span>
          <span>10</span>
        </div>
      </div>
    </div>
  );
};

interface MedicationAdherenceProps {
  data: Array<{
    medication: string;
    prescribed: number;
    taken: number;
    adherence: number;
  }>;
}

export const MedicationAdherenceChart: React.FC<MedicationAdherenceProps> = ({ data }) => {
  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Medication Adherence</h4>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="medication" stroke="#9CA3AF" fontSize={10} angle={-45} textAnchor="end" />
          <YAxis stroke="#9CA3AF" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px'
            }}
          />
          <Bar dataKey="adherence" name="Adherence %">
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.adherence >= 80 ? '#10B981' : entry.adherence >= 60 ? '#F59E0B' : '#EF4444'} 
              />
            ))}
          </Bar>
          <ReferenceLine y={80} stroke="#10B981" strokeDasharray="5 5" label="Target" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface FunctionalAssessmentProps {
  data: Array<{
    activity: string;
    baseline: number;
    current: number;
    target: number;
  }>;
}

export const FunctionalAssessmentChart: React.FC<FunctionalAssessmentProps> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Functional Assessment (HAQ-DI)</h4>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="activity" stroke="#9CA3AF" fontSize={10} angle={-45} textAnchor="end" />
          <YAxis stroke="#9CA3AF" fontSize={12} domain={[0, 3]} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Bar dataKey="baseline" fill="#94A3B8" name="Baseline" />
          <Bar dataKey="current" fill="#3B82F6" name="Current" />
          <Line type="monotone" dataKey="target" stroke="#10B981" strokeWidth={2} name="Target" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

interface ComorbidityNetworkProps {
  conditions: Array<{
    name: string;
    severity: number;
    connections: string[];
  }>;
}

export const ComorbidityNetwork: React.FC<ComorbidityNetworkProps> = ({ conditions }) => {
  const data = conditions.map(c => ({
    name: c.name,
    value: c.severity,
    connections: c.connections.length
  }));

  const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Comorbidity Network</h4>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {conditions.map((condition, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
            />
            <span className="text-gray-600 dark:text-gray-400">{condition.name}</span>
            <span className="text-xs text-gray-500">({condition.connections.length} links)</span>
          </div>
        ))}
      </div>
    </div>
  );
};