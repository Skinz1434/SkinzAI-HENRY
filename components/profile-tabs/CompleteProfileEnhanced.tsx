'use client';

import React, { useState, useMemo } from 'react';
import { VeteranProfileEnhanced } from '@/lib/veteran-profile-enhanced';
import { 
  User, Calendar, MapPin, Phone, Mail, Hash, Shield, Award, 
  Activity, Heart, Pill, FileText, DollarSign, Home, School,
  Clock, AlertCircle, CheckCircle, TrendingUp, Target, Layers,
  ChevronRight, ChevronDown, Info, Star, Flag, Medal, Zap,
  Building, CreditCard, Users, Briefcase, Globe, History,
  Brain, Eye, Ear, Stethoscope, Thermometer, Weight, Ruler,
  AlertTriangle
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area, ScatterChart, Scatter, Treemap,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend,
  ResponsiveContainer, ComposedChart, RadialBarChart, RadialBar
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

interface CompleteProfileEnhancedProps {
  veteran: VeteranProfileEnhanced;
}

// Comprehensive data analyzer for MPD
const analyzeMPDData = (veteran: VeteranProfileEnhanced) => {
  const mpd = veteran.mpd;
  const mpr = veteran.mpr;
  
  // Extract all possible insights from MPD
  const insights = {
    // Health Metrics
    healthScore: calculateHealthScore(mpd),
    conditionSeverity: categorizeConditions(mpd?.conditions || []),
    medicationComplexity: analyzeMedications(mpd?.medications || []),
    appointmentAdherence: calculateAppointmentAdherence(mpd?.appointments || []),
    labTrends: analyzeLabTrends(mpd?.labResults || []),
    
    // Service Metrics
    combatExposure: analyzeDeployments(mpr?.deployments || []),
    serviceImpact: calculateServiceImpact(mpr),
    specialtyQualifications: mpr?.specialties?.length || 0,
    educationLevel: analyzeEducation(mpr?.education),
    
    // Disability & Compensation
    disabilityProgression: trackDisabilityProgression(mpd),
    compensationOptimization: suggestCompensationImprovements(mpd, veteran.benefits),
    secondaryConditions: identifySecondaryConditions(mpd?.conditions || []),
    
    // Risk Assessments
    riskFactors: identifyRiskFactors(mpd, mpr),
    futureHealthProjections: projectFutureHealth(mpd),
    mentalHealthIndicators: assessMentalHealth(mpd),
    
    // Treatment Effectiveness
    treatmentOutcomes: evaluateTreatmentEffectiveness(mpd),
    medicationEffectiveness: assessMedicationEffectiveness(mpd),
    providerNetwork: analyzeProviderNetwork(mpd?.appointments || [])
  };
  
  return insights;
};

// Helper functions for analysis
const calculateHealthScore = (mpd: any) => {
  if (!mpd) return 50;
  let score = 100;
  
  // Deduct for conditions
  const conditionCount = mpd.conditions?.length || 0;
  score -= conditionCount * 5;
  
  // Deduct for severity
  mpd.conditions?.forEach((condition: any) => {
    if (condition.status === 'Chronic') score -= 10;
    if (condition.rating > 50) score -= 5;
  });
  
  // Deduct for medications
  const medCount = mpd.medications?.filter((m: any) => m.status === 'Active').length || 0;
  score -= medCount * 2;
  
  // Deduct for abnormal labs
  const abnormalLabs = mpd.labResults?.filter((l: any) => l.status !== 'Normal').length || 0;
  score -= abnormalLabs * 3;
  
  return Math.max(0, Math.min(100, score));
};

const categorizeConditions = (conditions: any[]) => {
  const categories: Record<string, any[]> = {
    musculoskeletal: [],
    mental: [],
    neurological: [],
    cardiovascular: [],
    respiratory: [],
    digestive: [],
    endocrine: [],
    other: []
  };
  
  conditions.forEach(condition => {
    const desc = condition.description.toLowerCase();
    if (desc.includes('joint') || desc.includes('back') || desc.includes('knee') || desc.includes('spine')) {
      categories.musculoskeletal.push(condition);
    } else if (desc.includes('ptsd') || desc.includes('depression') || desc.includes('anxiety')) {
      categories.mental.push(condition);
    } else if (desc.includes('tbi') || desc.includes('migraine') || desc.includes('neuropathy')) {
      categories.neurological.push(condition);
    } else if (desc.includes('heart') || desc.includes('hypertension') || desc.includes('vascular')) {
      categories.cardiovascular.push(condition);
    } else if (desc.includes('asthma') || desc.includes('copd') || desc.includes('lung')) {
      categories.respiratory.push(condition);
    } else if (desc.includes('ibs') || desc.includes('gerd') || desc.includes('stomach')) {
      categories.digestive.push(condition);
    } else if (desc.includes('diabetes') || desc.includes('thyroid')) {
      categories.endocrine.push(condition);
    } else {
      categories.other.push(condition);
    }
  });
  
  return categories;
};

const analyzeMedications = (medications: any[]) => {
  const active = medications.filter(m => m.status === 'Active');
  return {
    total: active.length,
    complexity: active.length > 10 ? 'High' : active.length > 5 ? 'Moderate' : 'Low',
    interactions: checkPotentialInteractions(active),
    categories: categorizeMedications(active)
  };
};

const checkPotentialInteractions = (medications: any[]) => {
  // Simplified interaction check
  const interactions = [];
  const medNames = medications.map(m => m.name.toLowerCase());
  
  if (medNames.some(n => n.includes('warfarin')) && medNames.some(n => n.includes('aspirin'))) {
    interactions.push('Blood thinner interaction risk');
  }
  if (medNames.some(n => n.includes('ssri')) && medNames.some(n => n.includes('tramadol'))) {
    interactions.push('Serotonin syndrome risk');
  }
  
  return interactions;
};

const categorizeMedications = (medications: any[]) => {
  const categories: any = {};
  medications.forEach(med => {
    const name = med.name.toLowerCase();
    let category = 'Other';
    
    if (name.includes('metformin') || name.includes('insulin')) category = 'Diabetes';
    else if (name.includes('atorvastatin') || name.includes('simvastatin')) category = 'Cholesterol';
    else if (name.includes('lisinopril') || name.includes('metoprolol')) category = 'Blood Pressure';
    else if (name.includes('sertraline') || name.includes('fluoxetine')) category = 'Mental Health';
    else if (name.includes('ibuprofen') || name.includes('naproxen')) category = 'Pain/Inflammation';
    else if (name.includes('omeprazole') || name.includes('ranitidine')) category = 'Digestive';
    
    if (!categories[category]) categories[category] = [];
    categories[category].push(med);
  });
  
  return categories;
};

const calculateAppointmentAdherence = (appointments: any[]) => {
  const completed = appointments.filter(a => a.status === 'Completed').length;
  const total = appointments.length;
  const adherenceRate = total > 0 ? (completed / total) * 100 : 0;
  
  return {
    rate: adherenceRate,
    completed,
    total,
    noShows: appointments.filter(a => a.status === 'No-Show').length,
    upcoming: appointments.filter(a => new Date(a.date) > new Date()).length
  };
};

const analyzeLabTrends = (labResults: any[]) => {
  const trends: any = {};
  
  labResults.forEach(lab => {
    if (!trends[lab.type]) {
      trends[lab.type] = [];
    }
    trends[lab.type].push({
      date: lab.date,
      value: parseFloat(lab.result) || 0,
      status: lab.status
    });
  });
  
  // Sort by date and identify trends
  Object.keys(trends).forEach(key => {
    trends[key].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Calculate trend direction
    if (trends[key].length >= 2) {
      const recent = trends[key].slice(-3);
      const values = recent.map((r: any) => r.value);
      const increasing = values.every((v: number, i: number) => i === 0 || v >= values[i-1]);
      const decreasing = values.every((v: number, i: number) => i === 0 || v <= values[i-1]);
      
      trends[key].trend = increasing ? 'increasing' : decreasing ? 'decreasing' : 'stable';
    }
  });
  
  return trends;
};

const analyzeDeployments = (deployments: any[]) => {
  const combatZones = ['iraq', 'afghanistan', 'syria', 'vietnam', 'korea'];
  const combatDeployments = deployments.filter(d => 
    combatZones.some(zone => d.location.toLowerCase().includes(zone))
  );
  
  return {
    total: deployments.length,
    combat: combatDeployments.length,
    totalDays: deployments.reduce((acc, d) => {
      const days = Math.ceil((new Date(d.endDate).getTime() - new Date(d.startDate).getTime()) / (1000 * 60 * 60 * 24));
      return acc + days;
    }, 0),
    locations: [...new Set(deployments.map(d => d.location))],
    operations: [...new Set(deployments.map(d => d.operation))]
  };
};

const calculateServiceImpact = (mpr: any) => {
  if (!mpr) return { score: 0, factors: [] };
  
  const factors = [];
  let score = 0;
  
  if (mpr.totalServiceYears > 20) {
    score += 30;
    factors.push('20+ years of service');
  } else if (mpr.totalServiceYears > 10) {
    score += 20;
    factors.push('10+ years of service');
  } else if (mpr.totalServiceYears > 5) {
    score += 10;
    factors.push('5+ years of service');
  }
  
  if (mpr.deployments?.length > 3) {
    score += 20;
    factors.push('Multiple deployments');
  }
  
  if (mpr.specialties?.length > 2) {
    score += 10;
    factors.push('Multiple specialties');
  }
  
  return { score: Math.min(100, score), factors };
};

const analyzeEducation = (education: any) => {
  if (!education) return 'Unknown';
  
  const civilian = education.civilianEducation?.toLowerCase() || '';
  if (civilian.includes('doctorate') || civilian.includes('phd')) return 'Doctorate';
  if (civilian.includes('master')) return 'Masters';
  if (civilian.includes('bachelor')) return 'Bachelors';
  if (civilian.includes('associate')) return 'Associates';
  if (civilian.includes('high school')) return 'High School';
  
  return 'High School';
};

const trackDisabilityProgression = (mpd: any) => {
  // Simulate progression data
  const currentRating = mpd?.disabilityRating || 0;
  const progression = [
    { year: 2020, rating: Math.max(0, currentRating - 30) },
    { year: 2021, rating: Math.max(0, currentRating - 20) },
    { year: 2022, rating: Math.max(0, currentRating - 10) },
    { year: 2023, rating: currentRating },
    { year: 2024, rating: Math.min(100, currentRating + 10) } // Projected
  ];
  
  return progression;
};

const suggestCompensationImprovements = (mpd: any, benefits: any) => {
  const suggestions = [];
  
  if (mpd?.disabilityRating < 100 && mpd?.disabilityRating >= 70) {
    suggestions.push({
      type: 'TDIU',
      description: 'Consider applying for Total Disability Individual Unemployability',
      impact: 'Could increase compensation to 100% rate'
    });
  }
  
  if (mpd?.conditions?.some((c: any) => c.description.toLowerCase().includes('ptsd'))) {
    suggestions.push({
      type: 'Secondary Conditions',
      description: 'File for secondary conditions related to PTSD (sleep apnea, GERD, etc.)',
      impact: 'Could increase overall rating by 10-30%'
    });
  }
  
  if (!benefits?.dependents || benefits.dependents === 0) {
    suggestions.push({
      type: 'Dependent Benefits',
      description: 'Add eligible dependents to increase compensation',
      impact: 'Additional $100-300/month per dependent'
    });
  }
  
  return suggestions;
};

const identifySecondaryConditions = (conditions: any[]) => {
  const secondaryMap: any = {
    'ptsd': ['Sleep Apnea', 'GERD', 'IBS', 'Hypertension', 'Migraines'],
    'tbi': ['Migraines', 'Depression', 'Tinnitus', 'Vision Problems'],
    'diabetes': ['Peripheral Neuropathy', 'Retinopathy', 'Kidney Disease'],
    'back': ['Radiculopathy', 'Depression', 'Sleep Problems']
  };
  
  const potentialSecondary: Set<string> = new Set();
  
  conditions.forEach(condition => {
    const desc = condition.description.toLowerCase();
    Object.keys(secondaryMap).forEach(key => {
      if (desc.includes(key)) {
        secondaryMap[key].forEach((secondary: string) => potentialSecondary.add(secondary));
      }
    });
  });
  
  return Array.from(potentialSecondary);
};

const identifyRiskFactors = (mpd: any, mpr: any) => {
  const risks = [];
  
  // Mental health risks
  if (mpd?.conditions?.some((c: any) => c.description.toLowerCase().includes('ptsd') || 
      c.description.toLowerCase().includes('depression'))) {
    risks.push({ type: 'Mental Health', level: 'High', description: 'Active mental health conditions' });
  }
  
  // Medication risks
  const medCount = mpd?.medications?.filter((m: any) => m.status === 'Active').length || 0;
  if (medCount > 10) {
    risks.push({ type: 'Polypharmacy', level: 'High', description: 'Taking 10+ medications' });
  }
  
  // Chronic condition risks
  const chronicCount = mpd?.conditions?.filter((c: any) => c.status === 'Chronic').length || 0;
  if (chronicCount > 3) {
    risks.push({ type: 'Multiple Chronic Conditions', level: 'Moderate', description: `${chronicCount} chronic conditions` });
  }
  
  return risks;
};

const projectFutureHealth = (mpd: any) => {
  // Simplified projection based on current conditions
  const currentScore = calculateHealthScore(mpd);
  const projections = [];
  
  for (let i = 1; i <= 5; i++) {
    projections.push({
      year: new Date().getFullYear() + i,
      optimistic: Math.min(100, currentScore + (i * 2)),
      realistic: Math.max(0, currentScore - (i * 1)),
      pessimistic: Math.max(0, currentScore - (i * 3))
    });
  }
  
  return projections;
};

const assessMentalHealth = (mpd: any) => {
  const indicators: { diagnosed: string[], risk: string[], protective: string[] } = {
    diagnosed: [],
    risk: [],
    protective: []
  };
  
  mpd?.conditions?.forEach((condition: any) => {
    const desc = condition.description.toLowerCase();
    if (desc.includes('ptsd') || desc.includes('depression') || desc.includes('anxiety')) {
      indicators.diagnosed.push(condition.description);
    }
  });
  
  mpd?.medications?.forEach((med: any) => {
    const name = med.name.toLowerCase();
    if (name.includes('sertraline') || name.includes('fluoxetine') || name.includes('venlafaxine')) {
      indicators.protective.push('On antidepressant therapy');
    }
  });
  
  if (mpd?.appointments?.some((a: any) => a.type.toLowerCase().includes('mental health'))) {
    indicators.protective.push('Regular mental health appointments');
  }
  
  return indicators;
};

const evaluateTreatmentEffectiveness = (mpd: any) => {
  // Analyze treatment patterns and outcomes
  const effectiveness = {
    overall: 'Moderate',
    byCondition: {} as any,
    recommendations: []
  };
  
  mpd?.conditions?.forEach((condition: any) => {
    const treatments = mpd?.appointments?.filter((a: any) => 
      a.notes?.toLowerCase().includes(condition.description.toLowerCase())
    );
    
    effectiveness.byCondition[condition.description] = {
      appointmentCount: treatments?.length || 0,
      status: condition.status,
      rating: condition.rating,
      effectiveness: condition.status === 'Resolved' ? 'High' : 
                    condition.status === 'Active' ? 'Moderate' : 'Low'
    };
  });
  
  return effectiveness;
};

const assessMedicationEffectiveness = (mpd: any) => {
  const assessment = {
    adherence: 'Unknown',
    effectiveness: {} as any,
    concerns: []
  };
  
  mpd?.medications?.forEach((med: any) => {
    assessment.effectiveness[med.name] = {
      duration: Math.ceil((new Date().getTime() - new Date(med.prescribedDate).getTime()) / (1000 * 60 * 60 * 24 * 30)),
      status: med.status,
      prescriber: med.prescribedBy
    };
  });
  
  return assessment;
};

const analyzeProviderNetwork = (appointments: any[]) => {
  const providers: any = {};
  
  appointments.forEach(apt => {
    if (!providers[apt.provider]) {
      providers[apt.provider] = {
        name: apt.provider,
        facility: apt.facility,
        appointments: 0,
        types: new Set()
      };
    }
    providers[apt.provider].appointments++;
    providers[apt.provider].types.add(apt.type);
  });
  
  return Object.values(providers).map((p: any) => ({
    ...p,
    types: Array.from(p.types)
  }));
};

export default function CompleteProfileEnhanced({ veteran }: CompleteProfileEnhancedProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));
  const insights = useMemo(() => analyzeMPDData(veteran), [veteran]);
  
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Prepare visualization data
  const conditionDistribution = Object.entries(insights.conditionSeverity).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: (value as any[]).length,
    conditions: value
  })).filter(item => item.value > 0);

  const medicationCategories = Object.entries(insights.medicationComplexity.categories).map(([key, value]) => ({
    name: key,
    count: (value as any[]).length
  }));

  const disabilityTrend = insights.disabilityProgression;
  
  const healthProjections = insights.futureHealthProjections;

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Key Metrics */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Complete Veteran Profile Analysis</h2>
            <p className="text-blue-100">Comprehensive MPD Data Insights</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold">{insights.healthScore}</p>
              <p className="text-sm text-blue-100">Health Score</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{veteran.mpd?.disabilityRating || 0}%</p>
              <p className="text-sm text-blue-100">Disability Rating</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{veteran.mpd?.conditions?.length || 0}</p>
              <p className="text-sm text-blue-100">Conditions</p>
            </div>
          </div>
        </div>
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-sm text-blue-100">Service Years</p>
            <p className="text-xl font-semibold">{veteran.mpr?.totalServiceYears || 0}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-sm text-blue-100">Deployments</p>
            <p className="text-xl font-semibold">{veteran.mpr?.deployments?.length || 0}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-sm text-blue-100">Active Meds</p>
            <p className="text-xl font-semibold">{insights.medicationComplexity.total}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-sm text-blue-100">Appointment Adherence</p>
            <p className="text-xl font-semibold">{insights.appointmentAdherence.rate.toFixed(0)}%</p>
          </div>
        </div>
      </div>

      {/* Medical Condition Analysis */}
      <div className="bg-gray-800 rounded-xl p-6">
        <button
          onClick={() => toggleSection('conditions')}
          className="w-full flex items-center justify-between mb-4 text-left"
        >
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-red-400" />
            <h3 className="text-xl font-semibold text-white">Medical Conditions Analysis</h3>
          </div>
          {expandedSections.has('conditions') ? <ChevronDown /> : <ChevronRight />}
        </button>
        
        <AnimatePresence>
          {expandedSections.has('conditions') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4"
            >
              {/* Condition Categories Chart */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3">Condition Distribution</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={conditionDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {conditionDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'][index % 5]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3">Disability Rating Progression</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={disabilityTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="year" tick={{ fill: '#9ca3af' }} />
                      <YAxis tick={{ fill: '#9ca3af' }} />
                      <RechartsTooltip />
                      <Line type="monotone" dataKey="rating" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Detailed Conditions List */}
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(insights.conditionSeverity).map(([category, conditions]) => {
                  const condList = conditions as any[];
                  if (condList.length === 0) return null;
                  
                  return (
                    <div key={category} className="bg-gray-700/50 rounded-lg p-3">
                      <h5 className="text-white font-medium mb-2 capitalize">{category} Conditions ({condList.length})</h5>
                      <div className="space-y-1">
                        {condList.map((condition, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-gray-300">{condition.description}</span>
                            <div className="flex gap-2">
                              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                                {condition.rating}%
                              </span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                condition.status === 'Active' ? 'bg-yellow-500/20 text-yellow-400' :
                                condition.status === 'Chronic' ? 'bg-red-500/20 text-red-400' :
                                'bg-green-500/20 text-green-400'
                              }`}>
                                {condition.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Secondary Conditions */}
              {insights.secondaryConditions.length > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-medium mb-2">Potential Secondary Conditions</h4>
                  <p className="text-gray-300 text-sm mb-3">Based on your primary conditions, you may be eligible for:</p>
                  <div className="flex flex-wrap gap-2">
                    {insights.secondaryConditions.map((condition, idx) => (
                      <span key={idx} className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded text-sm">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Medication Analysis */}
      <div className="bg-gray-800 rounded-xl p-6">
        <button
          onClick={() => toggleSection('medications')}
          className="w-full flex items-center justify-between mb-4 text-left"
        >
          <div className="flex items-center gap-3">
            <Pill className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-semibold text-white">Medication Profile</h3>
            <span className={`px-2 py-1 rounded text-xs ${
              insights.medicationComplexity.complexity === 'High' ? 'bg-red-500/20 text-red-400' :
              insights.medicationComplexity.complexity === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-green-500/20 text-green-400'
            }`}>
              {insights.medicationComplexity.complexity} Complexity
            </span>
          </div>
          {expandedSections.has('medications') ? <ChevronDown /> : <ChevronRight />}
        </button>
        
        <AnimatePresence>
          {expandedSections.has('medications') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4"
            >
              {/* Medication Categories */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3">Medication Categories</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={medicationCategories}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
                      <YAxis tick={{ fill: '#9ca3af' }} />
                      <RechartsTooltip />
                      <Bar dataKey="count" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3">Interaction Risks</h4>
                  {insights.medicationComplexity.interactions.length > 0 ? (
                    <div className="space-y-2">
                      {insights.medicationComplexity.interactions.map((interaction, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <AlertCircle className="w-4 h-4 text-yellow-400" />
                          <span className="text-gray-300">{interaction}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">No significant interactions detected</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Detailed Medication List */}
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(insights.medicationComplexity.categories).map(([category, meds]) => {
                  const medList = meds as any[];
                  if (medList.length === 0) return null;
                  
                  return (
                    <div key={category} className="bg-gray-700/50 rounded-lg p-3">
                      <h5 className="text-white font-medium mb-2">{category} ({medList.length})</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {medList.map((med, idx) => (
                          <div key={idx} className="text-sm">
                            <p className="text-gray-300">{med.name}</p>
                            <p className="text-gray-500 text-xs">{med.dosage} - {med.frequency}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Service Impact Analysis */}
      <div className="bg-gray-800 rounded-xl p-6">
        <button
          onClick={() => toggleSection('service')}
          className="w-full flex items-center justify-between mb-4 text-left"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Service Impact & Deployments</h3>
          </div>
          {expandedSections.has('service') ? <ChevronDown /> : <ChevronRight />}
        </button>
        
        <AnimatePresence>
          {expandedSections.has('service') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-gray-400 text-sm mb-1">Combat Deployments</h4>
                  <p className="text-2xl font-bold text-white">{insights.combatExposure.combat}</p>
                  <p className="text-xs text-gray-500">of {insights.combatExposure.total} total</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-gray-400 text-sm mb-1">Total Deployment Days</h4>
                  <p className="text-2xl font-bold text-white">{insights.combatExposure.totalDays}</p>
                  <p className="text-xs text-gray-500">≈ {Math.round(insights.combatExposure.totalDays / 365)} years</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-gray-400 text-sm mb-1">Service Impact Score</h4>
                  <p className="text-2xl font-bold text-white">{insights.serviceImpact.score}</p>
                  <p className="text-xs text-gray-500">of 100</p>
                </div>
              </div>
              
              {/* Service Impact Factors */}
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Service Impact Factors</h4>
                <div className="flex flex-wrap gap-2">
                  {insights.serviceImpact.factors.map((factor, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Deployment Locations */}
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Deployment History</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Locations:</p>
                    <div className="flex flex-wrap gap-2">
                      {insights.combatExposure.locations.map((location, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-600 text-gray-300 rounded text-xs">
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Operations:</p>
                    <div className="flex flex-wrap gap-2">
                      {insights.combatExposure.operations.map((op, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-600 text-gray-300 rounded text-xs">
                          {op}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Health Projections */}
      <div className="bg-gray-800 rounded-xl p-6">
        <button
          onClick={() => toggleSection('projections')}
          className="w-full flex items-center justify-between mb-4 text-left"
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">Health Projections & Risk Assessment</h3>
          </div>
          {expandedSections.has('projections') ? <ChevronDown /> : <ChevronRight />}
        </button>
        
        <AnimatePresence>
          {expandedSections.has('projections') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4"
            >
              {/* Health Projection Chart */}
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">5-Year Health Projections</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={healthProjections}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="year" tick={{ fill: '#9ca3af' }} />
                    <YAxis tick={{ fill: '#9ca3af' }} />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="optimistic" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="realistic" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="pessimistic" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Risk Factors */}
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Identified Risk Factors</h4>
                <div className="space-y-2">
                  {insights.riskFactors.map((risk, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`w-4 h-4 ${
                          risk.level === 'High' ? 'text-red-400' :
                          risk.level === 'Moderate' ? 'text-yellow-400' :
                          'text-green-400'
                        }`} />
                        <span className="text-gray-300">{risk.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm">{risk.description}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          risk.level === 'High' ? 'bg-red-500/20 text-red-400' :
                          risk.level === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {risk.level}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Compensation Optimization */}
      <div className="bg-gray-800 rounded-xl p-6">
        <button
          onClick={() => toggleSection('compensation')}
          className="w-full flex items-center justify-between mb-4 text-left"
        >
          <div className="flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-semibold text-white">Compensation Optimization</h3>
          </div>
          {expandedSections.has('compensation') ? <ChevronDown /> : <ChevronRight />}
        </button>
        
        <AnimatePresence>
          {expandedSections.has('compensation') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4"
            >
              {insights.compensationOptimization.map((suggestion, idx) => (
                <div key={idx} className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-green-400 mt-1" />
                    <div className="flex-1">
                      <h4 className="text-green-400 font-medium mb-1">{suggestion.type}</h4>
                      <p className="text-gray-300 text-sm mb-2">{suggestion.description}</p>
                      <p className="text-gray-400 text-xs">Potential Impact: {suggestion.impact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lab Results Trends */}
      <div className="bg-gray-800 rounded-xl p-6">
        <button
          onClick={() => toggleSection('labs')}
          className="w-full flex items-center justify-between mb-4 text-left"
        >
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-semibold text-white">Lab Results & Trends</h3>
          </div>
          {expandedSections.has('labs') ? <ChevronDown /> : <ChevronRight />}
        </button>
        
        <AnimatePresence>
          {expandedSections.has('labs') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(insights.labTrends).slice(0, 4).map(([type, data]) => {
                  const labData = data as any;
                  return (
                    <div key={type} className="bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">{type}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Latest: {labData[labData.length - 1]?.value}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          labData.trend === 'increasing' ? 'bg-yellow-500/20 text-yellow-400' :
                          labData.trend === 'decreasing' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {labData.trend || 'stable'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mental Health Assessment */}
      <div className="bg-gray-800 rounded-xl p-6">
        <button
          onClick={() => toggleSection('mental')}
          className="w-full flex items-center justify-between mb-4 text-left"
        >
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-pink-400" />
            <h3 className="text-xl font-semibold text-white">Mental Health Profile</h3>
          </div>
          {expandedSections.has('mental') ? <ChevronDown /> : <ChevronRight />}
        </button>
        
        <AnimatePresence>
          {expandedSections.has('mental') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-gray-400 text-sm mb-2">Diagnosed Conditions</h4>
                  <div className="space-y-1">
                    {insights.mentalHealthIndicators.diagnosed.map((condition, idx) => (
                      <p key={idx} className="text-white text-sm">{condition}</p>
                    ))}
                    {insights.mentalHealthIndicators.diagnosed.length === 0 && (
                      <p className="text-gray-500 text-sm">None identified</p>
                    )}
                  </div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-gray-400 text-sm mb-2">Risk Factors</h4>
                  <div className="space-y-1">
                    {insights.mentalHealthIndicators.risk.map((risk, idx) => (
                      <p key={idx} className="text-yellow-400 text-sm">{risk}</p>
                    ))}
                    {insights.mentalHealthIndicators.risk.length === 0 && (
                      <p className="text-gray-500 text-sm">No significant risks</p>
                    )}
                  </div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-gray-400 text-sm mb-2">Protective Factors</h4>
                  <div className="space-y-1">
                    {insights.mentalHealthIndicators.protective.map((factor, idx) => (
                      <p key={idx} className="text-green-400 text-sm">{factor}</p>
                    ))}
                    {insights.mentalHealthIndicators.protective.length === 0 && (
                      <p className="text-gray-500 text-sm">None identified</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}