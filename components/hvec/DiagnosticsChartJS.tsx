'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  TooltipItem
} from 'chart.js';
import { Line, Bar, Radar, Scatter, Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Brain, Heart, Shield, AlertTriangle, TrendingUp, TrendingDown,
  Zap, Target, Gauge, ThermometerSun, Microscope, TestTube, Beaker,
  FileSearch, AlertCircle, Info, ChevronRight, Eye, Sparkles,
  BarChart3, PieChart as PieIcon, Stethoscope, Pill, HeartHandshake,
  Clock, Calendar, CheckCircle, XCircle, AlertOctagon, Droplet,
  Wind, Dna, Syringe, Thermometer, HeartPulse
} from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels
);

interface DiagnosticsChartJSProps {
  veteran: any;
  assessment: any;
}

export const DiagnosticsChartJS: React.FC<DiagnosticsChartJSProps> = ({ veteran, assessment }) => {
  const [selectedBiomarker, setSelectedBiomarker] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '1y' | 'all'>('6m');
  const [showPredictions, setShowPredictions] = useState(true);
  const [selectedLabCategory, setSelectedLabCategory] = useState<'inflammatory' | 'metabolic' | 'cardiac' | 'hepatic' | 'renal' | 'hematology'>('inflammatory');

  // Early return if no veteran data
  if (!veteran) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500 dark:text-gray-400">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>No veteran data available</p>
        </div>
      </div>
    );
  }

  // Generate comprehensive biomarker data with proper structure
  const biomarkerData = useMemo(() => {
    const severity = veteran?.disabilityRating >= 70 ? 'high' : 
                    veteran?.disabilityRating >= 40 ? 'medium' : 'low';
    const baseMultiplier = severity === 'high' ? 1.8 : severity === 'medium' ? 1.3 : 1.0;
    
    return {
      inflammatory: {
        esr: { value: Math.floor(20 * baseMultiplier), unit: 'mm/hr', reference: '0-20', trend: severity === 'high' ? 'worsening' : 'stable' },
        crp: { value: (3 * baseMultiplier).toFixed(1), unit: 'mg/L', reference: '<3.0', trend: severity === 'high' ? 'worsening' : 'improving' },
        il6: { value: (2.5 * baseMultiplier).toFixed(1), unit: 'pg/mL', reference: '<7.0', trend: 'stable' },
        tnfAlpha: { value: (8 * baseMultiplier).toFixed(1), unit: 'pg/mL', reference: '<8.1', trend: 'stable' },
        fibrinogen: { value: Math.floor(300 * baseMultiplier), unit: 'mg/dL', reference: '200-400', trend: 'stable' }
      },
      metabolic: {
        glucose: { value: Math.floor(95 + (20 * (baseMultiplier - 1))), unit: 'mg/dL', reference: '70-100', trend: 'stable' },
        hba1c: { value: (5.4 + (0.8 * (baseMultiplier - 1))).toFixed(1), unit: '%', reference: '<5.7', trend: 'improving' },
        cholesterolTotal: { value: Math.floor(180 + (20 * baseMultiplier)), unit: 'mg/dL', reference: '<200', trend: 'stable' },
        ldl: { value: Math.floor(110 + (20 * baseMultiplier)), unit: 'mg/dL', reference: '<100', trend: 'worsening' },
        hdl: { value: Math.floor(55 - (5 * (baseMultiplier - 1))), unit: 'mg/dL', reference: '>40', trend: 'improving' }
      }
    };
  }, [veteran]);

  // Generate lab trends data
  const labTrends = useMemo(() => {
    if (!veteran) return { labels: [], datasets: [] };
    
    const months = timeRange === '3m' ? 3 : timeRange === '6m' ? 6 : timeRange === '1y' ? 12 : 24;
    const labels = Array.from({ length: months }, (_, i) => `Month ${i + 1}`);
    const disabilityRating = veteran?.disabilityRating || 0;
    const baseInflammation = 30 + (disabilityRating / 2);
    const baseMetabolic = 60 + (disabilityRating / 3);
    
    const inflammation = labels.map((_, i) => 
      Math.floor(baseInflammation + Math.sin(i * 0.5) * 10 + Math.random() * 5)
    );
    const metabolic = labels.map((_, i) => 
      Math.floor(baseMetabolic - (i / months * 5) + Math.random() * 3)
    );
    const cardiac = labels.map((_, i) => 
      Math.floor(70 - (i / months * 3) + Math.random() * 4)
    );
    const predicted = labels.map((_, i) => 
      showPredictions ? Math.floor(baseInflammation + (i / months * 10) - 15) : null
    );
    
    return {
      labels,
      datasets: [
        {
          label: 'Inflammation',
          data: inflammation,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Metabolic',
          data: metabolic,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Cardiac',
          data: cardiac,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        },
        ...(showPredictions ? [{
          label: 'Predicted',
          data: predicted,
          borderColor: 'rgb(168, 85, 247)',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          borderDash: [5, 5],
          tension: 0.4,
          fill: false
        }] : [])
      ]
    };
  }, [veteran, timeRange, showPredictions]);

  // Generate system health radar data
  const systemHealthData = useMemo(() => {
    if (!veteran) return { labels: [], datasets: [] };
    
    const disabilityRating = veteran?.disabilityRating || 0;
    const combatMultiplier = veteran?.combatService ? 0.85 : 1;
    
    return {
      labels: ['Musculoskeletal', 'Cardiovascular', 'Neurological', 'Metabolic', 'Immune', 'Respiratory'],
      datasets: [
        {
          label: 'Current Health',
          data: [
            Math.max(20, 100 - disabilityRating),
            Math.floor(85 - (disabilityRating * 0.3) * combatMultiplier),
            Math.floor(88 - (disabilityRating * 0.2) * combatMultiplier),
            Math.floor(75 - (disabilityRating * 0.25)),
            Math.floor(70 - (disabilityRating * 0.2)),
            Math.floor(92 - (disabilityRating * 0.15))
          ],
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: 'rgb(59, 130, 246)',
          pointBackgroundColor: 'rgb(59, 130, 246)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(59, 130, 246)'
        },
        {
          label: 'Predicted (6 months)',
          data: [
            Math.max(15, 95 - disabilityRating),
            Math.floor(80 - (disabilityRating * 0.3) * combatMultiplier),
            Math.floor(85 - (disabilityRating * 0.2) * combatMultiplier),
            Math.floor(72 - (disabilityRating * 0.25)),
            Math.floor(68 - (disabilityRating * 0.2)),
            Math.floor(90 - (disabilityRating * 0.15))
          ],
          backgroundColor: 'rgba(168, 85, 247, 0.2)',
          borderColor: 'rgb(168, 85, 247)',
          pointBackgroundColor: 'rgb(168, 85, 247)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(168, 85, 247)',
          borderDash: [5, 5]
        },
        {
          label: 'Optimal',
          data: [95, 90, 95, 85, 90, 95],
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderColor: 'rgb(16, 185, 129)',
          pointBackgroundColor: 'rgb(16, 185, 129)',
          borderDash: [2, 2],
          pointRadius: 2
        }
      ]
    };
  }, [veteran]);

  // Generate risk stratification scatter data
  const riskScatterData = useMemo(() => {
    if (!veteran || !biomarkerData) return { datasets: [] };
    
    const disabilityRating = veteran?.disabilityRating || 0;
    const combatService = veteran?.combatService || false;
    const age = veteran?.age || 45;
    
    const conditions = [
      {
        x: Math.min(95, 30 + (disabilityRating * 0.4) + (age > 50 ? 15 : 0)),
        y: 85,
        label: 'Cardiovascular Event'
      },
      {
        x: Math.min(90, 25 + (disabilityRating * 0.35)),
        y: 70,
        label: 'Type 2 Diabetes'
      },
      {
        x: combatService ? Math.min(85, 50 + (disabilityRating * 0.3)) : 35,
        y: 90,
        label: 'Mental Health Crisis'
      },
      {
        x: Math.min(90, disabilityRating * 0.9),
        y: 75,
        label: 'Functional Decline'
      },
      {
        x: Math.min(95, 40 + (disabilityRating * 0.5)),
        y: 65,
        label: 'Chronic Pain'
      }
    ];
    
    return {
      datasets: [{
        label: 'Risk Conditions',
        data: conditions,
        backgroundColor: conditions.map(c => 
          c.y >= 80 ? 'rgba(239, 68, 68, 0.7)' : 
          c.y >= 70 ? 'rgba(245, 158, 11, 0.7)' :
          'rgba(59, 130, 246, 0.7)'
        ),
        pointRadius: 8,
        pointHoverRadius: 10
      }]
    };
  }, [veteran, biomarkerData]);

  // Chart options
  const lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#9CA3AF',
          font: { size: 11 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#F3F4F6',
        bodyColor: '#D1D5DB',
        borderColor: '#374151',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        mode: 'index' as const,
        intersect: false
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(55, 65, 81, 0.3)' },
        ticks: { color: '#9CA3AF', font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(55, 65, 81, 0.3)' },
        ticks: { color: '#9CA3AF', font: { size: 10 } },
        min: 0,
        max: 100
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

  const radarChartOptions: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#9CA3AF',
          font: { size: 11 }
        }
      }
    },
    scales: {
      r: {
        angleLines: { color: 'rgba(55, 65, 81, 0.3)' },
        grid: { color: 'rgba(55, 65, 81, 0.3)' },
        pointLabels: { color: '#9CA3AF', font: { size: 10 } },
        ticks: { color: '#9CA3AF', backdropColor: 'transparent', font: { size: 9 } },
        min: 0,
        max: 100
      }
    }
  };

  const scatterChartOptions: ChartOptions<'scatter'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const point = context.raw;
            return `${point.label}: Likelihood ${point.x}%, Impact ${point.y}`;
          }
        }
      },
      datalabels: {
        display: true,
        align: 'top' as const,
        color: '#9CA3AF',
        font: { size: 9, weight: 'bold' as const },
        formatter: (value: any) => value.label
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Likelihood (%)', color: '#9CA3AF' },
        grid: { color: 'rgba(55, 65, 81, 0.3)' },
        ticks: { color: '#9CA3AF' },
        min: 0,
        max: 100
      },
      y: {
        title: { display: true, text: 'Impact Score', color: '#9CA3AF' },
        grid: { color: 'rgba(55, 65, 81, 0.3)' },
        ticks: { color: '#9CA3AF' },
        min: 0,
        max: 100
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Microscope className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Advanced Diagnostics Dashboard
          </h2>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {(['3m', '6m', '1y', 'all'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                timeRange === range
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {range === 'all' ? 'All Time' : range.toUpperCase()}
            </button>
          ))}
          
          <button
            onClick={() => setShowPredictions(!showPredictions)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              showPredictions
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            {showPredictions ? 'Hide' : 'Show'} Predictions
          </button>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health Radar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-500" />
            System-Wide Health Analysis
          </h3>
          <div style={{ height: '300px' }}>
            <Radar data={systemHealthData} options={radarChartOptions} />
          </div>
        </div>

        {/* Biomarker Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-500" />
            Biomarker Trends & Predictions
          </h3>
          <div style={{ height: '300px' }}>
            <Line data={labTrends} options={lineChartOptions} />
          </div>
        </div>

        {/* Risk Stratification Matrix */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-red-500" />
            Risk Stratification Matrix
          </h3>
          <div style={{ height: '300px' }}>
            <Scatter data={riskScatterData} options={scatterChartOptions} />
          </div>
        </div>

        {/* Lab Results Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TestTube className="w-4 h-4 text-blue-500" />
            Current Lab Values
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400">Inflammatory Markers</h4>
                {Object.entries(biomarkerData.inflammatory).slice(0, 3).map(([key, data]) => (
                  <div key={key} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{key.toUpperCase()}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${
                        parseFloat(data.value.toString()) > parseFloat(data.reference.replace(/[<>]/g, '').split('-')[0])
                          ? 'text-red-500' : 'text-green-500'
                      }`}>
                        {data.value} {data.unit}
                      </span>
                      {data.trend === 'worsening' ? (
                        <TrendingUp className="w-3 h-3 text-red-500" />
                      ) : data.trend === 'improving' ? (
                        <TrendingDown className="w-3 h-3 text-green-500" />
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400">Metabolic Panel</h4>
                {Object.entries(biomarkerData.metabolic).slice(0, 3).map(([key, data]) => (
                  <div key={key} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{key.toUpperCase()}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${
                        key === 'hdl' 
                          ? parseFloat(data.value.toString()) < 40 ? 'text-red-500' : 'text-green-500'
                          : parseFloat(data.value.toString()) > parseFloat(data.reference.replace(/[<>]/g, '').split('-')[0])
                            ? 'text-red-500' : 'text-green-500'
                      }`}>
                        {data.value} {data.unit}
                      </span>
                      {data.trend === 'worsening' ? (
                        <TrendingUp className="w-3 h-3 text-red-500" />
                      ) : data.trend === 'improving' ? (
                        <TrendingDown className="w-3 h-3 text-green-500" />
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Assessment Summary */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Clinical Risk Assessment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Overall Risk</span>
              <span className={`text-2xl font-bold ${
                veteran?.disabilityRating >= 70 ? 'text-red-500' :
                veteran?.disabilityRating >= 40 ? 'text-yellow-500' :
                'text-green-500'
              }`}>
                {veteran?.disabilityRating >= 70 ? 'HIGH' :
                 veteran?.disabilityRating >= 40 ? 'MEDIUM' : 'LOW'}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  veteran?.disabilityRating >= 70 ? 'bg-red-500' :
                  veteran?.disabilityRating >= 40 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${veteran?.disabilityRating || 0}%` }}
              />
            </div>
          </div>
          
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Cascade Risk</span>
              <span className="text-2xl font-bold text-purple-500">
                {veteran?.combatService ? 'ELEVATED' : 'MODERATE'}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {veteran?.combatService ? '3-5 interconnected conditions likely' : '1-2 conditions expected'}
            </p>
          </div>
          
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Intervention Window</span>
              <span className="text-2xl font-bold text-blue-500">
                30-60 DAYS
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Critical period for preventive care
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};