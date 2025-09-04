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
import { Line, Bar, Radar, Scatter, Doughnut, PolarArea } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Brain, Heart, Shield, AlertTriangle, TrendingUp, TrendingDown,
  Zap, Target, Gauge, ThermometerSun, Microscope, TestTube, Beaker,
  FileSearch, AlertCircle, Info, ChevronRight, Eye, Sparkles,
  BarChart3, Stethoscope, Pill, HeartHandshake, FlaskRound,
  Clock, Calendar, CheckCircle, XCircle, AlertOctagon, Droplet,
  Wind, Dna, Syringe, Thermometer, HeartPulse, HelpCircle,
  ChevronDown, ChevronUp, ExternalLink, BookOpen, GraduationCap,
  Lightbulb, Clipboard, FileText, Award, ShieldCheck, BrainCircuit,
  Fingerprint, Workflow, GitBranch, Share2, Download, ArrowRight
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

interface DiagnosticsAdvancedProps {
  veteran: any;
  assessment: any;
}

// ACR/EULAR Criteria Definitions
const CRITERIA_DEFINITIONS = {
  SLE_2019: {
    name: 'SLE (2019 EULAR/ACR)',
    entry: 'ANA ≥1:80',
    threshold: 10,
    source: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6827566/',
    domains: [
      { name: 'Constitutional', items: ['Fever'], points: 2 },
      { name: 'Hematologic', items: ['Leukopenia', 'Thrombocytopenia', 'Autoimmune hemolysis'], points: 4 },
      { name: 'Neuropsychiatric', items: ['Delirium', 'Psychosis', 'Seizure'], points: 5 },
      { name: 'Mucocutaneous', items: ['Non-scarring alopecia', 'Oral ulcers', 'Subacute/acute cutaneous lupus'], points: 6 },
      { name: 'Serosal', items: ['Pleural/pericardial effusion', 'Acute pericarditis'], points: 5 },
      { name: 'Musculoskeletal', items: ['Joint involvement'], points: 6 },
      { name: 'Renal', items: ['Proteinuria >0.5g/24h', 'Renal biopsy Class II/V', 'Renal biopsy Class III/IV'], points: 10 }
    ]
  },
  RA_2010: {
    name: 'RA (2010 ACR/EULAR)',
    entry: 'Clinical synovitis',
    threshold: 6,
    source: 'https://www.rheumatology.org/Practice-Quality/Clinical-Support/Clinical-Practice-Guidelines/Rheumatoid-Arthritis',
    domains: [
      { name: 'Joint involvement', items: ['1 large joint', '2-10 large joints', '1-3 small joints', '4-10 small joints', '>10 joints'], points: 5 },
      { name: 'Serology', items: ['Low-positive RF or ACPA', 'High-positive RF or ACPA'], points: 3 },
      { name: 'Acute-phase reactants', items: ['Abnormal CRP or ESR'], points: 1 },
      { name: 'Duration', items: ['≥6 weeks'], points: 1 }
    ]
  },
  GOUT_2015: {
    name: 'Gout (2015 ACR/EULAR)',
    entry: 'MSU crystals OR monoarticular arthritis',
    threshold: 8,
    source: 'https://ard.bmj.com/content/74/10/1789',
    domains: [
      { name: 'Clinical', items: ['Pattern of joint involvement', 'Characteristics of episodes', 'Clinical evidence of tophus'], points: 4 },
      { name: 'Laboratory', items: ['Serum urate >6mg/dL', 'MSU negative'], points: 3 },
      { name: 'Imaging', items: ['Imaging evidence of urate deposition', 'Imaging evidence of gout damage'], points: 4 }
    ]
  }
};

// Enhanced Lab Reference Ranges
const LAB_REFERENCE_RANGES = {
  inflammatory: {
    ESR: { normal: '0-20 mm/hr', critical: '>100', unit: 'mm/hr', description: 'Erythrocyte Sedimentation Rate - non-specific inflammation marker' },
    CRP: { normal: '<3.0 mg/L', critical: '>100', unit: 'mg/L', description: 'C-Reactive Protein - acute phase reactant' },
    IL6: { normal: '<7.0 pg/mL', critical: '>50', unit: 'pg/mL', description: 'Interleukin-6 - pro-inflammatory cytokine' },
    TNFa: { normal: '<8.1 pg/mL', critical: '>40', unit: 'pg/mL', description: 'Tumor Necrosis Factor alpha' },
    Ferritin: { normal: '12-300 ng/mL', critical: '>1000', unit: 'ng/mL', description: 'Acute phase reactant, iron storage' }
  },
  autoimmune: {
    ANA: { normal: '<1:80', critical: '≥1:640', unit: 'titer', description: 'Anti-Nuclear Antibody - SLE screening' },
    'Anti-dsDNA': { normal: 'Negative', critical: '>200 IU/mL', unit: 'IU/mL', description: 'Specific for SLE, correlates with disease activity' },
    RF: { normal: '<14 IU/mL', critical: '>60', unit: 'IU/mL', description: 'Rheumatoid Factor - present in 70-80% of RA' },
    'Anti-CCP': { normal: '<20 U/mL', critical: '>60', unit: 'U/mL', description: 'Anti-Cyclic Citrullinated Peptide - specific for RA' },
    'Anti-SSA/Ro': { normal: 'Negative', critical: 'Positive', unit: '', description: 'Associated with Sjögren\'s, lupus, neonatal lupus' },
    'Anti-SSB/La': { normal: 'Negative', critical: 'Positive', unit: '', description: 'Specific for Sjögren\'s syndrome' },
    'Anti-Scl-70': { normal: 'Negative', critical: 'Positive', unit: '', description: 'Associated with diffuse systemic sclerosis' }
  },
  metabolic: {
    Glucose: { normal: '70-100 mg/dL', critical: '<40 or >400', unit: 'mg/dL', description: 'Fasting blood glucose' },
    HbA1c: { normal: '<5.7%', critical: '>9.0', unit: '%', description: 'Glycated hemoglobin - 3-month glucose average' },
    'Uric Acid': { normal: '3.5-7.2 mg/dL', critical: '>10', unit: 'mg/dL', description: 'Elevated in gout' },
    Creatinine: { normal: '0.6-1.2 mg/dL', critical: '>4.0', unit: 'mg/dL', description: 'Kidney function marker' },
    eGFR: { normal: '>60 mL/min', critical: '<15', unit: 'mL/min/1.73m²', description: 'Estimated glomerular filtration rate' }
  },
  hematologic: {
    WBC: { normal: '4.5-11.0 K/μL', critical: '<2.0 or >30.0', unit: 'K/μL', description: 'White blood cell count' },
    Hemoglobin: { normal: '12-16 g/dL', critical: '<7.0', unit: 'g/dL', description: 'Oxygen-carrying capacity' },
    Platelets: { normal: '150-400 K/μL', critical: '<50 or >1000', unit: 'K/μL', description: 'Clotting cells' },
    Neutrophils: { normal: '1.5-8.0 K/μL', critical: '<0.5', unit: 'K/μL', description: 'Primary infection-fighting cells' },
    Lymphocytes: { normal: '1.0-4.0 K/μL', critical: '<0.5', unit: 'K/μL', description: 'Adaptive immune cells' }
  },
  hepatic: {
    ALT: { normal: '10-40 U/L', critical: '>500', unit: 'U/L', description: 'Alanine aminotransferase - liver enzyme' },
    AST: { normal: '10-40 U/L', critical: '>500', unit: 'U/L', description: 'Aspartate aminotransferase' },
    'Alk Phos': { normal: '40-120 U/L', critical: '>500', unit: 'U/L', description: 'Alkaline phosphatase' },
    Bilirubin: { normal: '0.1-1.2 mg/dL', critical: '>5.0', unit: 'mg/dL', description: 'Bile pigment' },
    Albumin: { normal: '3.5-5.0 g/dL', critical: '<2.5', unit: 'g/dL', description: 'Protein synthesized by liver' }
  },
  cardiac: {
    Troponin: { normal: '<0.04 ng/mL', critical: '>0.4', unit: 'ng/mL', description: 'Cardiac injury marker' },
    'BNP': { normal: '<100 pg/mL', critical: '>900', unit: 'pg/mL', description: 'B-type natriuretic peptide - heart failure marker' },
    'CK-MB': { normal: '0-6.3 ng/mL', critical: '>25', unit: 'ng/mL', description: 'Cardiac muscle damage' },
    'D-Dimer': { normal: '<500 ng/mL', critical: '>2000', unit: 'ng/mL', description: 'Thrombosis/PE marker' }
  }
};

// Tooltip component for enhanced information
const InfoTooltip: React.FC<{ content: string; title?: string }> = ({ content, title }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>
      {show && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl">
          {title && <div className="font-semibold mb-1">{title}</div>}
          <div>{content}</div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
            <div className="border-8 border-transparent border-t-gray-900" />
          </div>
        </div>
      )}
    </div>
  );
};

export const DiagnosticsAdvanced: React.FC<DiagnosticsAdvancedProps> = ({ veteran, assessment }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'labs' | 'criteria' | 'trends' | 'differential'>('overview');
  const [selectedLabCategory, setSelectedLabCategory] = useState<keyof typeof LAB_REFERENCE_RANGES>('inflammatory');
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '1y' | 'all'>('6m');
  const [showPredictions, setShowPredictions] = useState(true);
  const [expandedCriteria, setExpandedCriteria] = useState<string | null>(null);

  // Generate comprehensive lab data based on veteran profile
  const generateLabData = useMemo(() => {
    if (!veteran) return null;
    
    const severity = veteran.disabilityRating >= 70 ? 'high' : 
                    veteran.disabilityRating >= 40 ? 'medium' : 'low';
    const combatMultiplier = veteran.combatService ? 1.2 : 1.0;
    const ageMultiplier = veteran.age > 65 ? 1.15 : veteran.age > 50 ? 1.1 : 1.0;
    const baseMultiplier = (severity === 'high' ? 1.8 : severity === 'medium' ? 1.3 : 1.0) * combatMultiplier * ageMultiplier;
    
    return {
      inflammatory: {
        ESR: { 
          value: Math.floor(20 * baseMultiplier).toString(), 
          trend: severity === 'high' ? 'worsening' : 'stable',
          percentile: Math.min(95, 50 + (baseMultiplier - 1) * 100),
          history: Array.from({ length: 6 }, (_, i) => ({
            month: i + 1,
            value: Math.floor(20 * baseMultiplier + Math.sin(i) * 5)
          }))
        },
        CRP: { 
          value: (3 * baseMultiplier).toFixed(1),
          trend: severity === 'high' ? 'worsening' : 'improving',
          percentile: Math.min(90, 45 + (baseMultiplier - 1) * 80),
          history: Array.from({ length: 6 }, (_, i) => ({
            month: i + 1,
            value: (3 * baseMultiplier - i * 0.2).toFixed(1)
          }))
        },
        IL6: { 
          value: (2.5 * baseMultiplier).toFixed(1),
          trend: 'stable',
          percentile: Math.min(85, 40 + (baseMultiplier - 1) * 70),
          history: Array.from({ length: 6 }, (_, i) => ({
            month: i + 1,
            value: (2.5 * baseMultiplier + Math.random() * 0.5).toFixed(1)
          }))
        },
        TNFa: { 
          value: (8 * baseMultiplier).toFixed(1),
          trend: 'stable',
          percentile: Math.min(88, 50 + (baseMultiplier - 1) * 60),
          history: Array.from({ length: 6 }, (_, i) => ({
            month: i + 1,
            value: (8 * baseMultiplier + Math.random() * 1).toFixed(1)
          }))
        },
        Ferritin: { 
          value: Math.floor(150 * baseMultiplier).toString(),
          trend: 'stable',
          percentile: Math.min(75, 40 + (baseMultiplier - 1) * 50),
          history: Array.from({ length: 6 }, (_, i) => ({
            month: i + 1,
            value: Math.floor(150 * baseMultiplier + Math.random() * 20)
          }))
        }
      },
      autoimmune: {
        ANA: { 
          value: severity === 'high' ? '1:320' : severity === 'medium' ? '1:160' : '1:80',
          trend: 'stable',
          percentile: severity === 'high' ? 90 : severity === 'medium' ? 70 : 50,
          positive: severity !== 'low'
        },
        'Anti-dsDNA': { 
          value: (severity === 'high' ? 85 : severity === 'medium' ? 35 : 10).toString(),
          trend: severity === 'high' ? 'worsening' : 'stable',
          percentile: severity === 'high' ? 85 : severity === 'medium' ? 60 : 30,
          positive: severity === 'high'
        },
        RF: { 
          value: Math.floor(14 * baseMultiplier).toString(),
          trend: 'stable',
          percentile: Math.min(80, 45 + (baseMultiplier - 1) * 60),
          positive: baseMultiplier > 1.5
        },
        'Anti-CCP': { 
          value: Math.floor(20 * baseMultiplier).toString(),
          trend: 'stable',
          percentile: Math.min(85, 50 + (baseMultiplier - 1) * 65),
          positive: baseMultiplier > 1.4
        },
        'Anti-SSA/Ro': { 
          value: severity === 'high' ? 'Positive (45 U/mL)' : 'Negative',
          trend: 'stable',
          percentile: severity === 'high' ? 80 : 20,
          positive: severity === 'high'
        },
        'Anti-SSB/La': { 
          value: 'Negative',
          trend: 'stable',
          percentile: 15,
          positive: false
        },
        'Anti-Scl-70': { 
          value: 'Negative',
          trend: 'stable',
          percentile: 10,
          positive: false
        }
      },
      hematologic: {
        WBC: { value: (4.5 + (3 * (baseMultiplier - 1))).toFixed(1), trend: 'stable', percentile: 50, positive: false },
        Hemoglobin: { value: (14.2 - (2 * (baseMultiplier - 1))).toFixed(1), trend: 'stable', percentile: 55, positive: false },
        Platelets: { value: Math.floor(250 - (30 * (baseMultiplier - 1))).toString(), trend: 'stable', percentile: 50, positive: false },
        Neutrophils: { value: (5.0 + (baseMultiplier - 1)).toFixed(1), trend: 'stable', percentile: 50, positive: false },
        Lymphocytes: { value: (2.5 - (0.5 * (baseMultiplier - 1))).toFixed(1), trend: 'stable', percentile: 50, positive: false }
      },
      hepatic: {
        ALT: { value: Math.floor(25 * baseMultiplier).toString(), trend: 'stable', percentile: 45, positive: false },
        AST: { value: Math.floor(28 * baseMultiplier).toString(), trend: 'stable', percentile: 50, positive: false },
        'Alk Phos': { value: Math.floor(75 * baseMultiplier).toString(), trend: 'stable', percentile: 50, positive: false },
        Bilirubin: { value: (0.8 + (0.4 * (baseMultiplier - 1))).toFixed(1), trend: 'stable', percentile: 45, positive: false },
        Albumin: { value: (4.2 - (0.5 * (baseMultiplier - 1))).toFixed(1), trend: 'stable', percentile: 55, positive: false }
      },
      cardiac: {
        Troponin: { value: (0.01 + (0.02 * (baseMultiplier - 1))).toFixed(2), trend: 'stable', percentile: 30, positive: false },
        BNP: { value: Math.floor(45 * baseMultiplier).toString(), trend: 'stable', percentile: 40, positive: false },
        'CK-MB': { value: (2.1 + (baseMultiplier - 1)).toFixed(1), trend: 'stable', percentile: 35, positive: false },
        'D-Dimer': { value: Math.floor(250 * baseMultiplier).toString(), trend: 'stable', percentile: 45, positive: false }
      },
      metabolic: {
        Glucose: { 
          value: Math.floor(95 + (20 * (baseMultiplier - 1))).toString(),
          trend: 'stable',
          percentile: Math.min(70, 45 + (baseMultiplier - 1) * 40),
          history: Array.from({ length: 6 }, (_, i) => ({
            month: i + 1,
            value: Math.floor(95 + (20 * (baseMultiplier - 1)) + Math.random() * 10)
          }))
        },
        HbA1c: { 
          value: (5.4 + (0.8 * (baseMultiplier - 1))).toFixed(1),
          trend: 'improving',
          percentile: Math.min(65, 40 + (baseMultiplier - 1) * 35),
          history: Array.from({ length: 6 }, (_, i) => ({
            month: i + 1,
            value: (5.4 + (0.8 * (baseMultiplier - 1)) - i * 0.05).toFixed(1)
          }))
        },
        'Uric Acid': { 
          value: (5.5 + (2 * (baseMultiplier - 1))).toFixed(1),
          trend: 'stable',
          percentile: Math.min(75, 50 + (baseMultiplier - 1) * 45),
          history: Array.from({ length: 6 }, (_, i) => ({
            month: i + 1,
            value: (5.5 + (2 * (baseMultiplier - 1)) + Math.random() * 0.5).toFixed(1)
          }))
        },
        Creatinine: { 
          value: (0.9 + (0.3 * (baseMultiplier - 1))).toFixed(1),
          trend: 'stable',
          percentile: Math.min(60, 40 + (baseMultiplier - 1) * 30),
          history: Array.from({ length: 6 }, (_, i) => ({
            month: i + 1,
            value: (0.9 + (0.3 * (baseMultiplier - 1))).toFixed(1)
          }))
        },
        eGFR: { 
          value: Math.floor(90 - (15 * (baseMultiplier - 1))).toString(),
          trend: baseMultiplier > 1.5 ? 'worsening' : 'stable',
          percentile: Math.max(30, 60 - (baseMultiplier - 1) * 40),
          history: Array.from({ length: 6 }, (_, i) => ({
            month: i + 1,
            value: Math.floor(90 - (15 * (baseMultiplier - 1)) - i)
          }))
        }
      }
    };
  }, [veteran]);

  // Calculate ACR/EULAR criteria scores
  const calculateCriteriaScores = useMemo(() => {
    if (!veteran || !generateLabData) return {};
    
    const labData = generateLabData;
    if (!labData) return {};
    const scores: Record<string, any> = {};
    
    // SLE 2019 EULAR/ACR
    scores.SLE_2019 = {
      entry: labData.autoimmune.ANA.positive,
      score: 0,
      met: [],
      missing: [],
      details: []
    };
    
    if (labData.autoimmune.ANA.positive) {
      // Constitutional
      if (veteran.disabilityRating > 50) {
        scores.SLE_2019.score += 2;
        scores.SLE_2019.met.push('Fever (assumed from high disability)');
      }
      
      // Hematologic
      if (parseInt(labData.inflammatory.ESR.value) > 50) {
        scores.SLE_2019.score += 4;
        scores.SLE_2019.met.push('Hematologic involvement');
      }
      
      // Immunologic
      if (labData.autoimmune['Anti-dsDNA'].positive) {
        scores.SLE_2019.score += 6;
        scores.SLE_2019.met.push('Anti-dsDNA positive');
      }
      
      scores.SLE_2019.classification = scores.SLE_2019.score >= 10 ? 'Classifies as SLE' : 'Does not classify';
      scores.SLE_2019.confidence = Math.min(95, 50 + scores.SLE_2019.score * 4);
    }
    
    // RA 2010 ACR/EULAR
    scores.RA_2010 = {
      entry: true, // Assuming clinical synovitis for demo
      score: 0,
      met: [],
      missing: [],
      details: []
    };
    
    // Joint involvement (simulated)
    if (veteran.disabilityRating >= 70) {
      scores.RA_2010.score += 5;
      scores.RA_2010.met.push('>10 joints involved');
    } else if (veteran.disabilityRating >= 40) {
      scores.RA_2010.score += 3;
      scores.RA_2010.met.push('4-10 small joints');
    } else {
      scores.RA_2010.score += 1;
      scores.RA_2010.met.push('1-3 small joints');
    }
    
    // Serology
    if (labData.autoimmune.RF.positive || labData.autoimmune['Anti-CCP'].positive) {
      scores.RA_2010.score += 3;
      scores.RA_2010.met.push('High-positive RF or ACPA');
    }
    
    // Acute phase reactants
    if (parseFloat(labData.inflammatory.CRP.value) > 3 || parseInt(labData.inflammatory.ESR.value) > 20) {
      scores.RA_2010.score += 1;
      scores.RA_2010.met.push('Abnormal CRP or ESR');
    }
    
    // Duration (assumed for veterans)
    scores.RA_2010.score += 1;
    scores.RA_2010.met.push('Duration ≥6 weeks');
    
    scores.RA_2010.classification = scores.RA_2010.score >= 6 ? 'Classifies as RA' : 'Does not classify';
    scores.RA_2010.confidence = Math.min(95, 40 + scores.RA_2010.score * 8);
    
    // Gout 2015 ACR/EULAR
    scores.GOUT_2015 = {
      entry: true,
      score: 0,
      met: [],
      missing: ['MSU crystal analysis'],
      details: []
    };
    
    // Serum urate
    const uricAcid = parseFloat(labData.metabolic['Uric Acid'].value);
    if (uricAcid > 6) {
      scores.GOUT_2015.score += Math.min(3, Math.floor((uricAcid - 6) * 2));
      scores.GOUT_2015.met.push(`Serum urate ${uricAcid} mg/dL`);
    }
    
    // Pattern (simulated)
    if (veteran.combatService) {
      scores.GOUT_2015.score += 2;
      scores.GOUT_2015.met.push('Typical pattern of joint involvement');
    }
    
    scores.GOUT_2015.classification = scores.GOUT_2015.score >= 8 ? 'Classifies as Gout' : 'Does not classify';
    scores.GOUT_2015.confidence = Math.min(95, 30 + scores.GOUT_2015.score * 7);
    
    return scores;
  }, [veteran, generateLabData]);

  // Generate differential diagnosis ranking
  const differentialDiagnosis = useMemo(() => {
    const scores = calculateCriteriaScores;
    const differentials = [];
    
    for (const [key, criteria] of Object.entries(scores)) {
      if (!criteria.entry) continue;
      
      differentials.push({
        disease: CRITERIA_DEFINITIONS[key as keyof typeof CRITERIA_DEFINITIONS]?.name || key,
        score: criteria.score,
        threshold: CRITERIA_DEFINITIONS[key as keyof typeof CRITERIA_DEFINITIONS]?.threshold || 0,
        classification: criteria.classification,
        confidence: criteria.confidence || 0,
        met: criteria.met || [],
        missing: criteria.missing || []
      });
    }
    
    return differentials.sort((a, b) => b.confidence - a.confidence);
  }, [calculateCriteriaScores]);

  // Chart configurations with improved colors and spacing
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'start' as const,
        labels: {
          color: '#6B7280',
          font: { 
            size: 11,
            family: 'Inter, system-ui, sans-serif'
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#F3F4F6',
        bodyColor: '#D1D5DB',
        borderColor: '#374151',
        borderWidth: 1,
        padding: 12,
        bodySpacing: 4,
        titleSpacing: 2,
        displayColors: true,
        boxPadding: 4,
        cornerRadius: 8,
        titleFont: {
          size: 12,
          weight: 'bold' as const
        },
        bodyFont: {
          size: 11
        },
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(1);
            }
            return label;
          }
        }
      },
      datalabels: {
        display: false // Disable by default to avoid clutter
      }
    },
    scales: {
      x: {
        grid: { 
          color: 'rgba(156, 163, 175, 0.1)',
          drawBorder: false
        },
        ticks: { 
          color: '#6B7280',
          font: { size: 10 }
        }
      },
      y: {
        grid: { 
          color: 'rgba(156, 163, 175, 0.1)',
          drawBorder: false
        },
        ticks: { 
          color: '#6B7280',
          font: { size: 10 }
        }
      }
    }
  };

  // Render lab value with visual indicators
  const renderLabValue = (key: string, data: any, reference: any) => {
    const isAbnormal = () => {
      if (typeof data.value === 'number') {
        const refRange = reference.normal.match(/[\d.]+/g);
        if (refRange) {
          const [min, max] = refRange.map(Number);
          return data.value < min || data.value > (max || min);
        }
      }
      return data.positive === true;
    };
    
    const isCritical = () => {
      if (!reference.critical) return false;
      if (typeof data.value === 'number') {
        const criticalValues = reference.critical.match(/[\d.]+/g);
        if (criticalValues) {
          if (reference.critical.includes('<')) {
            return data.value < Number(criticalValues[0]);
          }
          if (reference.critical.includes('>')) {
            return data.value > Number(criticalValues[0]);
          }
        }
      }
      return false;
    };
    
    const abnormal = isAbnormal();
    const critical = isCritical();
    
    return (
      <div className={`p-3 rounded-lg border transition-all ${
        critical ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700' :
        abnormal ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700' :
        'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
      }`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">{key}</span>
            <InfoTooltip content={reference.description} />
          </div>
          {data.trend && (
            <div className="flex items-center gap-1">
              {data.trend === 'worsening' ? (
                <TrendingUp className="w-3.5 h-3.5 text-red-500" />
              ) : data.trend === 'improving' ? (
                <TrendingDown className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Activity className="w-3.5 h-3.5 text-gray-400" />
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400">{data.trend}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-baseline justify-between mb-2">
          <span className={`text-lg font-bold ${
            critical ? 'text-red-600 dark:text-red-400' :
            abnormal ? 'text-yellow-600 dark:text-yellow-400' :
            'text-green-600 dark:text-green-400'
          }`}>
            {data.value} {reference.unit}
          </span>
          {critical && (
            <span className="text-xs font-semibold text-red-600 dark:text-red-400 animate-pulse">
              CRITICAL
            </span>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">Reference:</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{reference.normal}</span>
          </div>
          
          {data.percentile !== undefined && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500 dark:text-gray-400">Percentile:</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">{data.percentile}th</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full transition-all ${
                    data.percentile >= 90 ? 'bg-red-500' :
                    data.percentile >= 75 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${data.percentile}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!veteran) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No veteran data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Navigation */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Advanced Diagnostics & Clinical Decision Support</h2>
            <p className="text-blue-100">ACR/EULAR Classification Criteria • Evidence-Based Medicine • Predictive Analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: Stethoscope },
            { id: 'labs', label: 'Laboratory', icon: TestTube },
            { id: 'criteria', label: 'ACR/EULAR', icon: Clipboard },
            { id: 'trends', label: 'Trends', icon: TrendingUp },
            { id: 'differential', label: 'Differential Dx', icon: Brain }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* System Health Score */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                System Health Assessment
              </h3>
              <div className="space-y-4">
                {/* Overall Score */}
                <div className="text-center py-4">
                  <div className="relative inline-flex items-center justify-center w-32 h-32">
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={351.86}
                        strokeDashoffset={351.86 * (1 - (100 - veteran.disabilityRating) / 100)}
                        className="text-blue-600 transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        {100 - veteran.disabilityRating}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Health Score</div>
                    </div>
                  </div>
                </div>
                
                {/* System Breakdown */}
                <div className="space-y-2">
                  {[
                    { system: 'Musculoskeletal', score: Math.max(20, 100 - veteran.disabilityRating), icon: Dna },
                    { system: 'Cardiovascular', score: Math.max(30, 85 - veteran.disabilityRating * 0.5), icon: Heart },
                    { system: 'Neurological', score: Math.max(25, 88 - veteran.disabilityRating * 0.4), icon: Brain },
                    { system: 'Immune', score: Math.max(35, 75 - veteran.disabilityRating * 0.3), icon: Shield }
                  ].map(sys => (
                    <div key={sys.system} className="flex items-center gap-3">
                      <sys.icon className="w-4 h-4 text-gray-400" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">{sys.system}</span>
                          <span className="font-medium text-gray-900 dark:text-white">{sys.score}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              sys.score >= 80 ? 'bg-green-500' :
                              sys.score >= 60 ? 'bg-yellow-500' :
                              sys.score >= 40 ? 'bg-orange-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${sys.score}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Risk Stratification */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Clinical Risk Stratification
              </h3>
              <div className="space-y-4">
                {[
                  { 
                    condition: 'Cardiovascular Event',
                    risk: Math.min(90, 30 + veteran.disabilityRating * 0.6),
                    timeframe: '5 years',
                    modifiable: ['Blood pressure', 'Lipids', 'Exercise']
                  },
                  {
                    condition: 'Autoimmune Flare',
                    risk: Math.min(85, 25 + veteran.disabilityRating * 0.5),
                    timeframe: '6 months',
                    modifiable: ['Medication adherence', 'Stress', 'Sleep']
                  },
                  {
                    condition: 'Functional Decline',
                    risk: Math.min(95, veteran.disabilityRating * 0.9),
                    timeframe: '1 year',
                    modifiable: ['Physical therapy', 'Assistive devices', 'Pain management']
                  }
                ].map(risk => (
                  <div key={risk.condition} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">{risk.condition}</span>
                      <span className={`text-sm font-bold ${
                        risk.risk >= 70 ? 'text-red-500' :
                        risk.risk >= 40 ? 'text-yellow-500' :
                        'text-green-500'
                      }`}>
                        {risk.risk}% risk
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Within {risk.timeframe}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {risk.modifiable.map(factor => (
                        <span key={factor} className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'labs' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Lab Category Selector */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
              <div className="flex flex-wrap gap-2">
                {Object.keys(LAB_REFERENCE_RANGES).map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedLabCategory(category as any)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedLabCategory === category
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Lab Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(LAB_REFERENCE_RANGES[selectedLabCategory]).map(([key, reference]) => {
                const labCategory = generateLabData ? (generateLabData as any)[selectedLabCategory] : null;
                const data = labCategory?.[key] || { value: 'Not tested', trend: null };
                return (
                  <div key={key}>
                    {renderLabValue(key, data, reference)}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'criteria' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {Object.entries(calculateCriteriaScores).map(([key, criteria]) => {
              const definition = CRITERIA_DEFINITIONS[key as keyof typeof CRITERIA_DEFINITIONS];
              if (!definition) return null;
              
              return (
                <div key={key} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <div 
                    className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setExpandedCriteria(expandedCriteria === key ? null : key)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          criteria.classification?.includes('Classifies') 
                            ? 'bg-red-100 dark:bg-red-900/30' 
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          <Clipboard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {definition.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Score: {criteria.score}/{definition.threshold} • {criteria.classification}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {criteria.confidence}%
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Confidence</div>
                        </div>
                        {expandedCriteria === key ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {expandedCriteria === key && (
                    <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="mt-4 space-y-4">
                        {/* Entry Criterion */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Entry Criterion:</span>
                          <span className={`text-sm px-2 py-1 rounded ${
                            criteria.entry ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                            {definition.entry} - {criteria.entry ? 'Met' : 'Not Met'}
                          </span>
                        </div>
                        
                        {/* Met Criteria */}
                        {criteria.met.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Met Criteria:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {criteria.met.map((item: string, idx: number) => (
                                <span key={idx} className="text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded">
                                  <CheckCircle className="w-3 h-3 inline mr-1" />
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Missing Items */}
                        {criteria.missing.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Missing/Recommended Tests:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {criteria.missing.map((item: string, idx: number) => (
                                <span key={idx} className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 rounded">
                                  <AlertCircle className="w-3 h-3 inline mr-1" />
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Source Link */}
                        <div className="flex items-center gap-2">
                          <a
                            href={definition.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View Full Criteria
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}

        {activeTab === 'trends' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Time Range Selector */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  Clinical Trends & Predictive Analytics
                </h3>
                <div className="flex gap-2">
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
                </div>
              </div>
            </div>

            {/* Primary Biomarker Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-red-500" />
                  Inflammatory Markers Trend
                </h4>
                <div style={{ height: '250px' }}>
                  <Line
                    data={{
                      labels: Array.from({ length: timeRange === '3m' ? 3 : timeRange === '6m' ? 6 : timeRange === '1y' ? 12 : 24 }, 
                        (_, i) => {
                          const date = new Date();
                          date.setMonth(date.getMonth() - (timeRange === '3m' ? 3 : timeRange === '6m' ? 6 : timeRange === '1y' ? 12 : 24) + i);
                          return date.toLocaleDateString('en-US', { month: 'short' });
                        }
                      ),
                      datasets: [
                        {
                          label: 'CRP (mg/L)',
                          data: generateLabData?.inflammatory?.CRP?.history?.map(h => parseFloat(h.value)) || [],
                          borderColor: 'rgb(239, 68, 68)',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          tension: 0.4,
                          yAxisID: 'y'
                        },
                        {
                          label: 'ESR (mm/hr)',
                          data: generateLabData?.inflammatory?.ESR?.history?.map(h => h.value) || [],
                          borderColor: 'rgb(245, 158, 11)',
                          backgroundColor: 'rgba(245, 158, 11, 0.1)',
                          tension: 0.4,
                          yAxisID: 'y1'
                        },
                        {
                          label: 'IL-6 (pg/mL)',
                          data: generateLabData?.inflammatory?.IL6?.history?.map(h => parseFloat(h.value)) || [],
                          borderColor: 'rgb(168, 85, 247)',
                          backgroundColor: 'rgba(168, 85, 247, 0.1)',
                          tension: 0.4,
                          yAxisID: 'y'
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      interaction: {
                        mode: 'index' as const,
                        intersect: false
                      },
                      plugins: {
                        legend: {
                          position: 'top' as const,
                          labels: { font: { size: 10 } }
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              const label = context.dataset.label || '';
                              const value = context.parsed.y;
                              const trend = value > (context.dataset.data[Math.max(0, context.dataIndex - 1)] as number) ? '↑' : '↓';
                              return `${label}: ${value} ${trend}`;
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          type: 'linear' as const,
                          display: true,
                          position: 'left' as const,
                          title: { display: true, text: 'CRP & IL-6', font: { size: 10 } },
                          grid: { drawOnChartArea: false }
                        },
                        y1: {
                          type: 'linear' as const,
                          display: true,
                          position: 'right' as const,
                          title: { display: true, text: 'ESR', font: { size: 10 } },
                          grid: { drawOnChartArea: true, color: 'rgba(156, 163, 175, 0.1)' }
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-blue-500" />
                  Metabolic & Renal Function
                </h4>
                <div style={{ height: '250px' }}>
                  <Line
                    data={{
                      labels: Array.from({ length: timeRange === '3m' ? 3 : timeRange === '6m' ? 6 : timeRange === '1y' ? 12 : 24 }, 
                        (_, i) => {
                          const date = new Date();
                          date.setMonth(date.getMonth() - (timeRange === '3m' ? 3 : timeRange === '6m' ? 6 : timeRange === '1y' ? 12 : 24) + i);
                          return date.toLocaleDateString('en-US', { month: 'short' });
                        }
                      ),
                      datasets: [
                        {
                          label: 'Glucose (mg/dL)',
                          data: generateLabData?.metabolic?.Glucose?.history?.map(h => h.value) || [],
                          borderColor: 'rgb(59, 130, 246)',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          tension: 0.4,
                          yAxisID: 'y'
                        },
                        {
                          label: 'eGFR (mL/min)',
                          data: generateLabData?.metabolic?.eGFR?.history?.map(h => h.value) || [],
                          borderColor: 'rgb(16, 185, 129)',
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          tension: 0.4,
                          yAxisID: 'y1'
                        },
                        {
                          label: 'Creatinine (mg/dL)',
                          data: generateLabData?.metabolic?.Creatinine?.history?.map(h => parseFloat(h.value)) || [],
                          borderColor: 'rgb(251, 146, 60)',
                          backgroundColor: 'rgba(251, 146, 60, 0.1)',
                          tension: 0.4,
                          yAxisID: 'y2',
                          hidden: true
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                          labels: { font: { size: 10 } }
                        }
                      },
                      scales: {
                        y: {
                          type: 'linear' as const,
                          display: true,
                          position: 'left' as const,
                          title: { display: true, text: 'Glucose', font: { size: 10 } }
                        },
                        y1: {
                          type: 'linear' as const,
                          display: true,
                          position: 'right' as const,
                          title: { display: true, text: 'eGFR', font: { size: 10 } },
                          grid: { drawOnChartArea: false }
                        },
                        y2: {
                          type: 'linear' as const,
                          display: false
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Disease Activity Score Trends */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-purple-500" />
                Disease Activity & Functional Assessment Scores
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                {/* DAS28 Score */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">DAS28-CRP</span>
                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {(3.2 + (veteran?.disabilityRating || 0) * 0.02).toFixed(1)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {parseFloat((3.2 + (veteran?.disabilityRating || 0) * 0.02).toFixed(1)) > 5.1 ? 'High Activity' :
                     parseFloat((3.2 + (veteran?.disabilityRating || 0) * 0.02).toFixed(1)) > 3.2 ? 'Moderate Activity' :
                     parseFloat((3.2 + (veteran?.disabilityRating || 0) * 0.02).toFixed(1)) > 2.6 ? 'Low Activity' : 'Remission'}
                  </div>
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                      style={{ width: `${Math.min(100, ((3.2 + (veteran?.disabilityRating || 0) * 0.02) / 10) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* CDAI Score */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">CDAI</span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {Math.floor(150 + (veteran?.disabilityRating || 0) * 2)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {Math.floor(150 + (veteran?.disabilityRating || 0) * 2) > 300 ? 'High Activity' :
                     Math.floor(150 + (veteran?.disabilityRating || 0) * 2) > 150 ? 'Moderate Activity' :
                     Math.floor(150 + (veteran?.disabilityRating || 0) * 2) > 75 ? 'Low Activity' : 'Remission'}
                  </div>
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                      style={{ width: `${Math.min(100, (Math.floor(150 + (veteran?.disabilityRating || 0) * 2) / 500) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* HAQ-DI Score */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">HAQ-DI</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      {(0.5 + (veteran?.disabilityRating || 0) * 0.015).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {parseFloat((0.5 + (veteran?.disabilityRating || 0) * 0.015).toFixed(2)) > 2 ? 'Severe Disability' :
                     parseFloat((0.5 + (veteran?.disabilityRating || 0) * 0.015).toFixed(2)) > 1 ? 'Moderate Disability' :
                     'Mild Disability'}
                  </div>
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                      style={{ width: `${Math.min(100, ((0.5 + (veteran?.disabilityRating || 0) * 0.015) / 3) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Historical Score Trends Chart */}
              <div style={{ height: '300px' }}>
                <Line
                  data={{
                    labels: Array.from({ length: 12 }, (_, i) => {
                      const date = new Date();
                      date.setMonth(date.getMonth() - 12 + i);
                      return date.toLocaleDateString('en-US', { month: 'short' });
                    }),
                    datasets: [
                      {
                        label: 'DAS28-CRP',
                        data: Array.from({ length: 12 }, (_, i) => 
                          (3.2 + (veteran?.disabilityRating || 0) * 0.02 + Math.sin(i * 0.5) * 0.5).toFixed(1)
                        ),
                        borderColor: 'rgb(168, 85, 247)',
                        backgroundColor: 'rgba(168, 85, 247, 0.1)',
                        tension: 0.4,
                        yAxisID: 'y'
                      },
                      {
                        label: 'CDAI (÷100)',
                        data: Array.from({ length: 12 }, (_, i) => 
                          ((150 + (veteran?.disabilityRating || 0) * 2 + Math.cos(i * 0.3) * 30) / 100).toFixed(1)
                        ),
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        yAxisID: 'y'
                      },
                      {
                        label: 'HAQ-DI (×10)',
                        data: Array.from({ length: 12 }, (_, i) => 
                          ((0.5 + (veteran?.disabilityRating || 0) * 0.015 - i * 0.01) * 10).toFixed(1)
                        ),
                        borderColor: 'rgb(16, 185, 129)',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        yAxisID: 'y'
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                        labels: { font: { size: 11 } }
                      }
                    },
                    scales: {
                      y: {
                        type: 'linear' as const,
                        display: true,
                        position: 'left' as const,
                        title: { display: true, text: 'Score Value', font: { size: 10 } }
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Predictive Risk Trajectories */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 shadow-lg">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-orange-500" />
                Predictive Risk Trajectories (6-Month Projection)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {[
                  { 
                    label: 'CV Event Risk',
                    current: 15 + (veteran?.disabilityRating || 0) * 0.3,
                    projected: 18 + (veteran?.disabilityRating || 0) * 0.35,
                    color: 'red'
                  },
                  {
                    label: 'Flare Risk',
                    current: 25 + (veteran?.disabilityRating || 0) * 0.4,
                    projected: 30 + (veteran?.disabilityRating || 0) * 0.45,
                    color: 'orange'
                  },
                  {
                    label: 'Hospitalization',
                    current: 10 + (veteran?.disabilityRating || 0) * 0.2,
                    projected: 12 + (veteran?.disabilityRating || 0) * 0.25,
                    color: 'purple'
                  },
                  {
                    label: 'Functional Decline',
                    current: 20 + (veteran?.disabilityRating || 0) * 0.5,
                    projected: 28 + (veteran?.disabilityRating || 0) * 0.6,
                    color: 'blue'
                  }
                ].map(risk => (
                  <div key={risk.label} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur rounded-lg p-3">
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">{risk.label}</div>
                    <div className="flex items-end justify-between mb-2">
                      <div>
                        <div className="text-xs text-gray-500">Current</div>
                        <div className={`text-lg font-bold text-${risk.color}-600 dark:text-${risk.color}-400`}>
                          {risk.current.toFixed(0)}%
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">6mo</div>
                        <div className={`text-lg font-bold text-${risk.color}-700 dark:text-${risk.color}-300`}>
                          {risk.projected.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      {risk.projected > risk.current ? (
                        <>
                          <TrendingUp className="w-3 h-3 text-red-500" />
                          <span className="text-red-600 dark:text-red-400">
                            +{(risk.projected - risk.current).toFixed(0)}%
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-3 h-3 text-green-500" />
                          <span className="text-green-600 dark:text-green-400">
                            {(risk.projected - risk.current).toFixed(0)}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'differential' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Enhanced Differential Diagnosis with Workup Plans */}
            <div className="space-y-6">
              {/* Differential Diagnosis Overview */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  Comprehensive Differential Diagnosis & Clinical Workup
                </h3>
                <div className="space-y-4">
                  {differentialDiagnosis.map((dx, idx) => (
                    <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                      <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                              idx === 0 ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/30 shadow-lg' :
                              idx === 1 ? 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-blue-500/30 shadow-lg' :
                              idx === 2 ? 'bg-gradient-to-br from-green-500 to-emerald-500 shadow-green-500/30 shadow-lg' :
                              'bg-gray-400'
                            }`}>
                              {idx + 1}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                                {dx.disease}
                              </h4>
                              <div className="flex items-center gap-3">
                                <span className={`text-sm px-3 py-1.5 rounded-full font-medium ${
                                  dx.classification.includes('Classifies') 
                                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                }`}>
                                  {dx.classification}
                                </span>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {dx.confidence}%
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">Confidence</div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Quick Metrics */}
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-gray-600 dark:text-gray-400">
                                  {dx.met.length} criteria met
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <AlertCircle className="w-4 h-4 text-yellow-500" />
                                <span className="text-gray-600 dark:text-gray-400">
                                  {dx.missing.length} tests pending
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Target className="w-4 h-4 text-blue-500" />
                                <span className="text-gray-600 dark:text-gray-400">
                                  Score: {dx.score}/{dx.threshold}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Detailed Workup Plan */}
                      <div className="p-4 space-y-4">
                        {/* Met Criteria */}
                        {dx.met.length > 0 && (
                          <div>
                            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              Positive Findings
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {dx.met.map((item: string, i: number) => (
                                <div key={i} className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="w-3 h-3 text-green-500 mt-0.5" />
                                  <span className="text-gray-600 dark:text-gray-400">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Recommended Workup */}
                        <div>
                          <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                            <Microscope className="w-4 h-4 text-blue-500" />
                            Recommended Diagnostic Workup
                          </h5>
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {/* Laboratory Tests */}
                              <div>
                                <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-2">Laboratory Tests</div>
                                <div className="space-y-1">
                                  {dx.missing.map((test: string, i: number) => (
                                    <div key={i} className="flex items-center gap-2 text-xs">
                                      <TestTube className="w-3 h-3 text-blue-500" />
                                      <span className="text-gray-700 dark:text-gray-300">{test}</span>
                                    </div>
                                  ))}
                                  {idx === 0 && ['Anti-Sm', 'Anti-RNP', 'Complement C3/C4', 'Urinalysis'].map(test => (
                                    <div key={test} className="flex items-center gap-2 text-xs">
                                      <TestTube className="w-3 h-3 text-blue-500" />
                                      <span className="text-gray-700 dark:text-gray-300">{test}</span>
                                    </div>
                                  ))}
                                  {idx === 1 && ['Anti-CCP Ab', 'RF Titer', 'Hand X-rays', 'Joint US'].map(test => (
                                    <div key={test} className="flex items-center gap-2 text-xs">
                                      <TestTube className="w-3 h-3 text-blue-500" />
                                      <span className="text-gray-700 dark:text-gray-300">{test}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Imaging Studies */}
                              <div>
                                <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-2">Imaging Studies</div>
                                <div className="space-y-1">
                                  {idx === 0 && ['Chest X-ray', 'Echo if pericarditis suspected'].map(test => (
                                    <div key={test} className="flex items-center gap-2 text-xs">
                                      <FileSearch className="w-3 h-3 text-purple-500" />
                                      <span className="text-gray-700 dark:text-gray-300">{test}</span>
                                    </div>
                                  ))}
                                  {idx === 1 && ['Bilateral hand/feet X-rays', 'MRI for early erosions'].map(test => (
                                    <div key={test} className="flex items-center gap-2 text-xs">
                                      <FileSearch className="w-3 h-3 text-purple-500" />
                                      <span className="text-gray-700 dark:text-gray-300">{test}</span>
                                    </div>
                                  ))}
                                  {idx === 2 && ['Joint X-ray/US', 'Dual-energy CT if available'].map(test => (
                                    <div key={test} className="flex items-center gap-2 text-xs">
                                      <FileSearch className="w-3 h-3 text-purple-500" />
                                      <span className="text-gray-700 dark:text-gray-300">{test}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Treatment Considerations */}
                        <div>
                          <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                            <Pill className="w-4 h-4 text-green-500" />
                            Initial Treatment Considerations
                          </h5>
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                              <div>
                                <div className="font-medium text-green-700 dark:text-green-300 mb-1">First-Line</div>
                                <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                                  {idx === 0 && ['Hydroxychloroquine', 'Low-dose prednisone', 'NSAIDs for arthralgia'].map(med => (
                                    <li key={med}>• {med}</li>
                                  ))}
                                  {idx === 1 && ['Methotrexate', 'Hydroxychloroquine', 'Short-term steroids'].map(med => (
                                    <li key={med}>• {med}</li>
                                  ))}
                                  {idx === 2 && ['Colchicine', 'NSAIDs', 'Allopurinol (after flare)'].map(med => (
                                    <li key={med}>• {med}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <div className="font-medium text-green-700 dark:text-green-300 mb-1">Monitoring</div>
                                <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                                  {idx === 0 && ['CBC q3 months', 'CMP q3 months', 'Urinalysis monthly'].map(mon => (
                                    <li key={mon}>• {mon}</li>
                                  ))}
                                  {idx === 1 && ['LFTs monthly', 'CBC monthly', 'ESR/CRP q3 months'].map(mon => (
                                    <li key={mon}>• {mon}</li>
                                  ))}
                                  {idx === 2 && ['Uric acid q3 months', 'CMP q6 months', 'Joint exam q visit'].map(mon => (
                                    <li key={mon}>• {mon}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Clinical Pearls */}
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                            <div className="flex-1">
                              <div className="text-xs font-medium text-yellow-700 dark:text-yellow-300 mb-1">Clinical Pearl</div>
                              <p className="text-xs text-gray-700 dark:text-gray-300">
                                {idx === 0 && "Consider SLE in young women with multi-system involvement. ANA is sensitive but not specific. Look for low complements and anti-dsDNA for disease activity."}
                                {idx === 1 && "Early aggressive treatment prevents joint damage. Morning stiffness >1hr is characteristic. Anti-CCP is highly specific and predicts erosive disease."}
                                {idx === 2 && "Acute flares contraindicate urate-lowering therapy. Target uric acid <6 mg/dL. Consider CPPD if atypical presentation."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Diagnostic Decision Tree */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 shadow-lg">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-purple-500" />
                  Diagnostic Decision Algorithm
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Initial Screening</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        CBC, CMP, ESR, CRP, ANA, RF, Anti-CCP, Uric acid
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Targeted Testing</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Based on initial results: ENA panel, dsDNA, complement, HLA-B27, joint aspiration
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Confirm Diagnosis</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Apply classification criteria, consider imaging, tissue biopsy if indicated
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};