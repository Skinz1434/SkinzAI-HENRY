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
  Clock, Calendar, CheckCircle, XCircle, AlertOctagon, Droplet,
  Wind, Dna, Syringe, Thermometer, HeartPulse
} from 'lucide-react';

interface DiagnosticsEnhancedProps {
  veteran: any;
  assessment: any;
}

// Enhanced custom tooltip with detailed information
const EnhancedTooltip = ({ active, payload, label, coordinate }: any) => {
  if (active && payload && payload[0]) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-sm text-white p-3 rounded-lg border border-gray-700 shadow-2xl">
        <p className="text-sm font-bold mb-2 text-blue-400">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-3 mb-1">
            <span className="text-xs flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="text-xs font-semibold">
              {typeof entry.value === 'number' ? 
                entry.value.toFixed(1) : entry.value}
              {entry.unit || ''}
            </span>
          </div>
        ))}
        {payload[0].payload.trend && (
          <div className="mt-2 pt-2 border-t border-gray-600">
            <p className="text-xs text-gray-300">
              Trend: <span className={payload[0].payload.trend === 'improving' ? 'text-green-400' : 'text-red-400'}>
                {payload[0].payload.trend === 'improving' ? '↑' : '↓'} {payload[0].payload.trend}
              </span>
            </p>
          </div>
        )}
        {payload[0].payload.reference && (
          <div className="text-xs text-gray-400 mt-1">
            Normal: {payload[0].payload.reference}
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const DiagnosticsEnhanced: React.FC<DiagnosticsEnhancedProps> = ({ veteran, assessment }) => {
  const [selectedBiomarker, setSelectedBiomarker] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '1y' | 'all'>('6m');
  const [showPredictions, setShowPredictions] = useState(true);
  const [selectedLabCategory, setSelectedLabCategory] = useState<'inflammatory' | 'metabolic' | 'cardiac' | 'hepatic' | 'renal' | 'hematology'>('inflammatory');

  // Generate comprehensive biomarker data with proper structure
  const biomarkerData = useMemo(() => {
    const severity = veteran?.disabilityRating >= 70 ? 'high' : veteran?.disabilityRating >= 40 ? 'medium' : 'low';
    const baseMultiplier = severity === 'high' ? 1.8 : severity === 'medium' ? 1.3 : 1.0;
    
    return {
      inflammatory: {
        esr: { value: Math.floor(20 * baseMultiplier), unit: 'mm/hr', reference: '0-20', trend: severity === 'high' ? 'worsening' : 'stable' },
        crp: { value: (3 * baseMultiplier).toFixed(1), unit: 'mg/L', reference: '<3.0', trend: severity === 'high' ? 'worsening' : 'improving' },
        il6: { value: (2.5 * baseMultiplier).toFixed(1), unit: 'pg/mL', reference: '<7.0', trend: 'stable' },
        tnfAlpha: { value: (8 * baseMultiplier).toFixed(1), unit: 'pg/mL', reference: '<8.1', trend: 'stable' },
        fibrinogen: { value: Math.floor(300 * baseMultiplier), unit: 'mg/dL', reference: '200-400', trend: 'stable' },
        ferritin: { value: Math.floor(150 * baseMultiplier), unit: 'ng/mL', reference: '30-400', trend: severity === 'high' ? 'worsening' : 'stable' }
      },
      metabolic: {
        glucose: { value: Math.floor(95 + (20 * (baseMultiplier - 1))), unit: 'mg/dL', reference: '70-100', trend: 'stable' },
        hba1c: { value: (5.4 + (0.8 * (baseMultiplier - 1))).toFixed(1), unit: '%', reference: '<5.7', trend: 'improving' },
        insulin: { value: Math.floor(12 * baseMultiplier), unit: 'μU/mL', reference: '2.6-24.9', trend: 'stable' },
        cholesterolTotal: { value: Math.floor(180 + (20 * baseMultiplier)), unit: 'mg/dL', reference: '<200', trend: 'stable' },
        ldl: { value: Math.floor(110 + (20 * baseMultiplier)), unit: 'mg/dL', reference: '<100', trend: 'worsening' },
        hdl: { value: Math.floor(55 - (5 * (baseMultiplier - 1))), unit: 'mg/dL', reference: '>40', trend: 'improving' },
        triglycerides: { value: Math.floor(140 * baseMultiplier), unit: 'mg/dL', reference: '<150', trend: 'stable' }
      },
      cardiac: {
        troponin: { value: (0.01 * baseMultiplier).toFixed(3), unit: 'ng/mL', reference: '<0.04', trend: 'stable' },
        bnp: { value: Math.floor(45 * baseMultiplier), unit: 'pg/mL', reference: '<100', trend: 'stable' },
        ckMb: { value: Math.floor(3.5 * baseMultiplier), unit: 'ng/mL', reference: '0-6.3', trend: 'stable' },
        homocysteine: { value: (9 * baseMultiplier).toFixed(1), unit: 'μmol/L', reference: '5-15', trend: 'stable' }
      },
      hepatic: {
        ast: { value: Math.floor(25 * baseMultiplier), unit: 'U/L', reference: '10-40', trend: 'stable' },
        alt: { value: Math.floor(30 * baseMultiplier), unit: 'U/L', reference: '10-40', trend: 'stable' },
        alp: { value: Math.floor(70 * baseMultiplier), unit: 'U/L', reference: '44-147', trend: 'stable' },
        bilirubin: { value: (0.8 * baseMultiplier).toFixed(1), unit: 'mg/dL', reference: '0.1-1.2', trend: 'stable' },
        albumin: { value: (4.2 - (0.3 * (baseMultiplier - 1))).toFixed(1), unit: 'g/dL', reference: '3.4-5.4', trend: 'stable' },
        ggt: { value: Math.floor(35 * baseMultiplier), unit: 'U/L', reference: '9-48', trend: 'stable' }
      },
      renal: {
        creatinine: { value: (0.9 * baseMultiplier).toFixed(1), unit: 'mg/dL', reference: '0.7-1.3', trend: 'stable' },
        bun: { value: Math.floor(15 * baseMultiplier), unit: 'mg/dL', reference: '7-20', trend: 'stable' },
        egfr: { value: Math.floor(90 / baseMultiplier), unit: 'mL/min', reference: '>60', trend: severity === 'high' ? 'worsening' : 'stable' },
        uricAcid: { value: (5.5 * baseMultiplier).toFixed(1), unit: 'mg/dL', reference: '3.5-7.2', trend: 'stable' },
        microalbumin: { value: Math.floor(15 * baseMultiplier), unit: 'mg/g', reference: '<30', trend: 'stable' }
      },
      hematology: {
        wbc: { value: (7.5 * baseMultiplier).toFixed(1), unit: 'K/μL', reference: '4.5-11', trend: 'stable' },
        rbc: { value: (4.8 - (0.2 * (baseMultiplier - 1))).toFixed(1), unit: 'M/μL', reference: '4.5-5.9', trend: 'stable' },
        hemoglobin: { value: (14.5 - (0.5 * (baseMultiplier - 1))).toFixed(1), unit: 'g/dL', reference: '13.5-17.5', trend: 'stable' },
        hematocrit: { value: (42 - (2 * (baseMultiplier - 1))).toFixed(1), unit: '%', reference: '41-53', trend: 'stable' },
        platelets: { value: Math.floor(250 * baseMultiplier), unit: 'K/μL', reference: '150-400', trend: 'stable' },
        neutrophils: { value: Math.floor(60 * baseMultiplier), unit: '%', reference: '45-70', trend: 'stable' }
      }
    };
  }, [veteran]);

  // Generate diagnostic pathways with more coherent data
  const diagnosticPathways = useMemo(() => {
    const pathways = [];
    const disabilityRating = veteran?.disabilityRating || 0;
    
    if (disabilityRating >= 70) {
      pathways.push({
        id: '1',
        diagnosis: 'Inflammatory Polyarthropathy',
        icd10: 'M06.9',
        confidence: 88,
        evidence: [
          'ESR elevated at ' + biomarkerData.inflammatory.esr.value + ' mm/hr',
          'CRP elevated at ' + biomarkerData.inflammatory.crp.value + ' mg/L',
          'Morning stiffness >60 minutes',
          'Symmetric joint involvement pattern',
          'Positive RF/Anti-CCP markers'
        ],
        nextSteps: [
          'Urgent Rheumatology referral',
          'Complete autoimmune panel',
          'Joint ultrasound imaging',
          'Initiate DMARD therapy',
          'Occupational therapy eval'
        ],
        riskScore: 85
      });
    }
    
    if (veteran?.combatService) {
      pathways.push({
        id: '2',
        diagnosis: 'PTSD with Somatic Symptoms',
        icd10: 'F43.10',
        confidence: 76,
        evidence: [
          'Combat exposure documented',
          'Hyperarousal symptoms present',
          'Sleep efficiency <60%',
          'Elevated cortisol levels',
          'Autonomic dysregulation'
        ],
        nextSteps: [
          'Mental health consultation',
          'Trauma-focused CBT',
          'Sleep study referral',
          'Medication optimization',
          'Mindfulness therapy'
        ],
        riskScore: 72
      });
    }
    
    if (parseFloat(biomarkerData.metabolic.hba1c.value) > 5.7) {
      pathways.push({
        id: '3',
        diagnosis: 'Prediabetes/Metabolic Syndrome',
        icd10: 'E88.81',
        confidence: 71,
        evidence: [
          'HbA1c ' + biomarkerData.metabolic.hba1c.value + '%',
          'Fasting glucose ' + biomarkerData.metabolic.glucose.value + ' mg/dL',
          'BMI >30 documented',
          'Central adiposity present',
          'Dyslipidemia confirmed'
        ],
        nextSteps: [
          'Endocrinology referral',
          'Lifestyle intervention program',
          'Continuous glucose monitoring',
          'Metformin consideration',
          'Dietitian consultation'
        ],
        riskScore: 68
      });
    }

    if (disabilityRating >= 50) {
      pathways.push({
        id: '4',
        diagnosis: 'Chronic Pain Syndrome',
        icd10: 'G89.4',
        confidence: 82,
        evidence: [
          'Pain score 7/10 persistent',
          'Multiple pain locations',
          'Functional impairment documented',
          'Central sensitization markers',
          'Opioid resistance pattern'
        ],
        nextSteps: [
          'Pain management referral',
          'Multimodal therapy plan',
          'Nerve block evaluation',
          'Physical therapy intensive',
          'Psychological support'
        ],
        riskScore: 78
      });
    }
    
    return pathways;
  }, [veteran, biomarkerData]);

  // Generate lab trends data with realistic progression
  const labTrends = useMemo(() => {
    const months = timeRange === '3m' ? 3 : timeRange === '6m' ? 6 : timeRange === '1y' ? 12 : 24;
    const data = [];
    const disabilityRating = veteran?.disabilityRating || 0;
    const baseInflammation = 30 + (disabilityRating / 2);
    const baseMetabolic = 60 + (disabilityRating / 3);
    
    for (let i = 0; i < months; i++) {
      const monthProgress = i / months;
      data.push({
        month: `Month ${i + 1}`,
        inflammation: Math.floor(baseInflammation + Math.sin(i * 0.5) * 10 + Math.random() * 5),
        metabolic: Math.floor(baseMetabolic - (monthProgress * 5) + Math.random() * 3),
        cardiac: Math.floor(70 - (monthProgress * 3) + Math.random() * 4),
        predicted: Math.floor(baseInflammation + (monthProgress * 10) - (showPredictions ? 15 : 0)),
        interventions: i % 3 === 0 ? 1 : 0,
        trend: i > months / 2 ? 'improving' : 'stable',
        reference: '30-50 optimal'
      });
    }
    
    return data;
  }, [veteran, timeRange, showPredictions]);

  // Generate correlation matrix data
  const correlationMatrix = useMemo(() => {
    const disabilityRating = veteran?.disabilityRating || 0;
    const combatMultiplier = veteran?.combatService ? 0.85 : 1;
    
    return {
      systemHealth: [
        { 
          system: 'Musculoskeletal', 
          current: Math.max(20, 100 - disabilityRating), 
          predicted: Math.max(15, 95 - disabilityRating),
          optimal: 95,
          risk: disabilityRating >= 70 ? 'high' : 'medium'
        },
        { 
          system: 'Cardiovascular', 
          current: Math.floor(85 - (disabilityRating * 0.3) * combatMultiplier), 
          predicted: Math.floor(80 - (disabilityRating * 0.3) * combatMultiplier),
          optimal: 90,
          risk: disabilityRating >= 50 ? 'medium' : 'low'
        },
        { 
          system: 'Neurological', 
          current: Math.floor(88 - (disabilityRating * 0.2) * combatMultiplier), 
          predicted: Math.floor(85 - (disabilityRating * 0.2) * combatMultiplier),
          optimal: 95,
          risk: veteran?.combatService ? 'medium' : 'low'
        },
        { 
          system: 'Metabolic', 
          current: Math.floor(75 - (disabilityRating * 0.25)), 
          predicted: Math.floor(72 - (disabilityRating * 0.25)),
          optimal: 85,
          risk: disabilityRating >= 40 ? 'medium' : 'low'
        },
        { 
          system: 'Immune', 
          current: Math.floor(70 - (disabilityRating * 0.2)), 
          predicted: Math.floor(68 - (disabilityRating * 0.2)),
          optimal: 90,
          risk: 'medium'
        },
        { 
          system: 'Respiratory', 
          current: Math.floor(92 - (disabilityRating * 0.15)), 
          predicted: Math.floor(90 - (disabilityRating * 0.15)),
          optimal: 95,
          risk: 'low'
        }
      ]
    };
  }, [veteran]);

  // Generate clinical scores with detailed metrics
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
        icon: Heart,
        description: '10-year fracture risk',
        interpretation: severity === 'critical' ? 'High risk - intervention needed' : 'Moderate risk - monitor closely'
      },
      {
        name: 'PHQ-9',
        value: severity === 'critical' ? '15' : severity === 'warning' ? '10' : '5',
        percentage: severity === 'critical' ? 65 : severity === 'warning' ? 45 : 20,
        status: severity === 'critical' ? 'warning' : 'normal',
        icon: Brain,
        description: 'Depression screening',
        interpretation: severity === 'critical' ? 'Moderate depression' : 'Mild symptoms'
      },
      {
        name: 'GAD-7',
        value: severity === 'critical' ? '12' : severity === 'warning' ? '8' : '3',
        percentage: severity === 'critical' ? 60 : severity === 'warning' ? 40 : 15,
        status: severity === 'critical' ? 'warning' : 'normal',
        icon: AlertCircle,
        description: 'Anxiety assessment',
        interpretation: severity === 'critical' ? 'Moderate anxiety' : 'Mild anxiety'
      },
      {
        name: 'Pain Scale',
        value: severity === 'critical' ? '7/10' : severity === 'warning' ? '5/10' : '3/10',
        percentage: severity === 'critical' ? 70 : severity === 'warning' ? 50 : 30,
        status: severity,
        icon: Gauge,
        description: 'Current pain level',
        interpretation: severity === 'critical' ? 'Severe - impacts daily function' : 'Moderate - manageable'
      }
    ];
  }, [veteran]);

  // Generate coherent risk stratification data
  const riskStratification = useMemo(() => {
    const disabilityRating = veteran?.disabilityRating || 0;
    const combatService = veteran?.combatService || false;
    const age = veteran?.age || 45;
    
    const conditions = [
      {
        condition: 'Cardiovascular Event',
        likelihood: Math.min(95, 30 + (disabilityRating * 0.4) + (age > 50 ? 15 : 0)),
        impact: 85,
        riskLevel: disabilityRating >= 70 || age > 60 ? 'critical' : 'high',
        timeframe: '5 years',
        modifiable: true,
        interventions: ['Statin therapy', 'BP management', 'Lifestyle changes']
      },
      {
        condition: 'Type 2 Diabetes',
        likelihood: Math.min(90, 25 + (disabilityRating * 0.35) + (parseFloat(biomarkerData.metabolic.hba1c.value) > 5.7 ? 20 : 0)),
        impact: 70,
        riskLevel: parseFloat(biomarkerData.metabolic.hba1c.value) > 6.0 ? 'high' : 'medium',
        timeframe: '3 years',
        modifiable: true,
        interventions: ['Weight loss', 'Metformin', 'Diet modification']
      },
      {
        condition: 'Mental Health Crisis',
        likelihood: combatService ? Math.min(85, 50 + (disabilityRating * 0.3)) : 35,
        impact: 90,
        riskLevel: combatService && disabilityRating >= 50 ? 'critical' : 'medium',
        timeframe: '1 year',
        modifiable: true,
        interventions: ['Therapy', 'Medication', 'Support groups']
      },
      {
        condition: 'Functional Decline',
        likelihood: Math.min(90, disabilityRating * 0.9),
        impact: 75,
        riskLevel: disabilityRating >= 70 ? 'high' : 'medium',
        timeframe: '2 years',
        modifiable: true,
        interventions: ['PT/OT', 'Assistive devices', 'Home modifications']
      },
      {
        condition: 'Chronic Pain Progression',
        likelihood: Math.min(95, 40 + (disabilityRating * 0.5)),
        impact: 65,
        riskLevel: disabilityRating >= 50 ? 'high' : 'medium',
        timeframe: '1 year',
        modifiable: true,
        interventions: ['Multimodal therapy', 'Injections', 'Alternative therapies']
      },
      {
        condition: 'Kidney Disease',
        likelihood: Math.min(70, 20 + (disabilityRating * 0.25) + (parseFloat(biomarkerData.renal.creatinine.value) > 1.2 ? 15 : 0)),
        impact: 80,
        riskLevel: biomarkerData.renal.egfr.value < 60 ? 'high' : 'low',
        timeframe: '5 years',
        modifiable: true,
        interventions: ['ACE inhibitors', 'Protein restriction', 'BP control']
      }
    ];

    const recommendations = [
      {
        action: 'Comprehensive Cardiovascular Risk Reduction',
        rationale: 'Multiple CV risk factors identified, ASCVD risk >20%',
        urgency: disabilityRating >= 70 ? 'immediate' : 'urgent',
        expectedOutcome: '30-40% risk reduction with aggressive management',
        icon: Heart,
        metrics: ['LDL <70', 'BP <130/80', 'HbA1c <7%']
      },
      {
        action: 'Integrated Mental Health Care',
        rationale: 'Combat exposure + chronic pain creating compound risk',
        urgency: combatService && disabilityRating >= 50 ? 'urgent' : 'routine',
        expectedOutcome: '50% improvement in QOL scores within 6 months',
        icon: Brain,
        metrics: ['PHQ-9 <10', 'GAD-7 <10', 'Sleep quality improved']
      },
      {
        action: 'Multimodal Pain Management',
        rationale: 'Current pain levels impacting function and mental health',
        urgency: disabilityRating >= 50 ? 'urgent' : 'routine',
        expectedOutcome: '2-point reduction in pain scale, improved function',
        icon: Pill,
        metrics: ['Pain <5/10', 'Function improved 30%', 'Opioid reduction']
      },
      {
        action: 'Preventive Metabolic Intervention',
        rationale: 'Prediabetic range with multiple metabolic risk factors',
        urgency: parseFloat(biomarkerData.metabolic.hba1c.value) > 5.7 ? 'urgent' : 'routine',
        expectedOutcome: 'Prevent diabetes progression, 5% weight loss',
        icon: Activity,
        metrics: ['HbA1c <5.7%', 'Weight -5%', 'Lipids normalized']
      }
    ];

    return { conditions, recommendations };
  }, [veteran, biomarkerData]);

  // Lab category selector component
  const LabCategorySelector = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      {(['inflammatory', 'metabolic', 'cardiac', 'hepatic', 'renal', 'hematology'] as const).map(category => (
        <button
          key={category}
          onClick={() => setSelectedLabCategory(category)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selectedLabCategory === category
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  );

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

        {/* Key Diagnostic Metrics with Enhanced Tooltips */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {clinicalScores.map((score, idx) => (
            <motion.div
              key={score.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <score.icon className="w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors" />
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
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {score.description}
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
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {score.interpretation}
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
                  name="Current Health"
                  dataKey="current"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                />
                {showPredictions && (
                  <Radar
                    name="6-Month Projection"
                    dataKey="predicted"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.3}
                  />
                )}
                <Radar
                  name="Optimal"
                  dataKey="optimal"
                  stroke="#10B981"
                  fill="none"
                  strokeDasharray="5 5"
                />
                <Legend />
                <Tooltip content={<EnhancedTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" />
              Biomarker Trends & Interventions
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={labTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} />
                <YAxis yAxisId="left" stroke="#9CA3AF" fontSize={11} label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" fontSize={11} />
                <Tooltip content={<EnhancedTooltip />} />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="inflammation"
                  fill="#EF4444"
                  stroke="#EF4444"
                  fillOpacity={0.3}
                  name="Inflammation"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="metabolic"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Metabolic"
                  dot={{ r: 4 }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="cardiac"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Cardiac"
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
                <ReferenceLine y={50} stroke="#10B981" strokeDasharray="5 5" label="Target Range" />
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {diagnosticPathways.map((pathway, idx) => (
            <motion.div
              key={pathway.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`border rounded-lg p-4 cursor-pointer hover:shadow-xl transition-all ${
                pathway.confidence >= 80 ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-700' :
                pathway.confidence >= 60 ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 dark:border-yellow-700' :
                'border-gray-300 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900 dark:to-slate-900 dark:border-gray-600'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {pathway.diagnosis}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">ICD-10: {pathway.icd10}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    {pathway.confidence}%
                  </div>
                  <div className="text-xs text-gray-500">Confidence</div>
                  <div className={`text-xs mt-1 px-2 py-1 rounded-full ${
                    pathway.riskScore >= 80 ? 'bg-red-100 text-red-700' :
                    pathway.riskScore >= 60 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    Risk: {pathway.riskScore}%
                  </div>
                </div>
              </div>

              {/* Evidence Indicators */}
              <div className="space-y-1 mb-3">
                {pathway.evidence.map((evidence, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400">{evidence}</span>
                  </div>
                ))}
              </div>

              {/* Recommended Actions */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recommended Actions:
                </div>
                <div className="flex flex-wrap gap-1">
                  {pathway.nextSteps.map((step, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-lg">
                      {step}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enhanced Risk Stratification Matrix */}
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
              <Tooltip content={({ active, payload }) => {
                if (active && payload && payload[0]) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-gray-900/95 backdrop-blur-sm text-white p-3 rounded-lg border border-gray-700 shadow-2xl">
                      <p className="font-bold text-blue-400">{data.condition}</p>
                      <p className="text-xs mt-1">Likelihood: {data.likelihood.toFixed(1)}%</p>
                      <p className="text-xs">Impact: {data.impact}</p>
                      <p className="text-xs">Risk Level: <span className={
                        data.riskLevel === 'critical' ? 'text-red-400' :
                        data.riskLevel === 'high' ? 'text-yellow-400' :
                        'text-green-400'
                      }>{data.riskLevel}</span></p>
                      <p className="text-xs">Timeframe: {data.timeframe}</p>
                      {data.modifiable && (
                        <p className="text-xs text-green-400 mt-1">✓ Modifiable risk</p>
                      )}
                    </div>
                  );
                }
                return null;
              }} />
              <Scatter name="Health Conditions" data={riskStratification.conditions} fill="#8884d8">
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
              <ReferenceLine x={50} stroke="#9CA3AF" strokeDasharray="3 3" />
              <ReferenceLine y={50} stroke="#9CA3AF" strokeDasharray="3 3" />
            </ScatterChart>
          </ResponsiveContainer>
          
          {/* Risk Legend */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-gray-600 dark:text-gray-400">Critical Risk (Immediate action)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span className="text-gray-600 dark:text-gray-400">High Risk (Urgent)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-gray-600 dark:text-gray-400">Medium Risk (Monitor)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-gray-600 dark:text-gray-400">Low Risk (Preventive)</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-blue-500" />
            Clinical Decision Support
          </h3>
          <div className="space-y-3">
            {riskStratification.recommendations.map((rec, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-4 rounded-lg border ${
                  rec.urgency === 'immediate' ? 'border-red-300 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 dark:border-red-700' :
                  rec.urgency === 'urgent' ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 dark:border-yellow-700' :
                  'border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900 dark:to-slate-900 dark:border-gray-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <rec.icon className="w-6 h-6 text-gray-600 dark:text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {rec.action}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {rec.rationale}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {rec.metrics.map((metric, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded">
                          {metric}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        rec.urgency === 'immediate' ? 'bg-red-100 text-red-700' :
                        rec.urgency === 'urgent' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {rec.urgency.toUpperCase()}
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

      {/* Enhanced Laboratory Results with Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TestTube className="w-5 h-5 text-green-500" />
          Comprehensive Laboratory Results
        </h3>
        
        <LabCategorySelector />
        
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.entries(biomarkerData[selectedLabCategory]).map(([key, data]) => {
            const isAbnormal = selectedLabCategory === 'inflammatory' && 
              (key === 'esr' || key === 'crp') && 
              veteran?.disabilityRating >= 70;
            
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-gradient-to-br ${
                  isAbnormal 
                    ? 'from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-700'
                    : 'from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 border-gray-200 dark:border-gray-700'
                } rounded-lg p-4 border hover:shadow-lg transition-all cursor-pointer group`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  {data.trend && (
                    <span className={`text-xs ${
                      data.trend === 'improving' ? 'text-green-500' :
                      data.trend === 'worsening' ? 'text-red-500' :
                      'text-gray-500'
                    }`}>
                      {data.trend === 'improving' ? '↑' :
                       data.trend === 'worsening' ? '↓' : '→'}
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data.value}
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    {data.unit}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Ref: {data.reference}
                </div>
                {isAbnormal && (
                  <div className="mt-2 text-xs text-red-600 dark:text-red-400 font-medium">
                    ⚠ Above normal
                  </div>
                )}
                <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                  <div 
                    className={`h-full transition-all ${
                      isAbnormal ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ width: isAbnormal ? '80%' : '40%' }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Lab Summary Statistics */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Object.values(biomarkerData[selectedLabCategory]).filter(d => d.trend === 'improving' || d.trend === 'stable').length}
              </div>
              <div className="text-xs text-gray-500">Normal/Stable</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {Object.values(biomarkerData[selectedLabCategory]).filter(d => d.trend === 'worsening').length}
              </div>
              <div className="text-xs text-gray-500">Needs Monitoring</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {Object.keys(biomarkerData[selectedLabCategory]).length}
              </div>
              <div className="text-xs text-gray-500">Total Tests</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};