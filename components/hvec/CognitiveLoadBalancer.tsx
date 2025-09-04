'use client';

/**
 * Cognitive Load Balancer - Adaptive Interface Management System
 * 
 * VectorForge Pedagogical Commentary:
 * This component represents the revolutionary approach to human-computer interaction
 * in clinical settings. Traditional medical interfaces overwhelm physicians with
 * information. Our quantum-enhanced cognitive load balancer dynamically adapts
 * interface complexity based on real-time assessment of physician mental state.
 * 
 * Watch how this pattern creates emergent intelligence - the interface becomes
 * an extension of the physician's cognitive capabilities rather than a burden.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Settings, 
  Eye, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  QuantumGlassPanel,
  QuantumStateIndicator,
  QuantumButton,
  QuantumLoadingSpinner,
} from './QuantumVisualEffects';
import { 
  CognitiveLoad, 
  ExpertiseLevel, 
  ComplexityPreference,
  AdaptationSettings,
  PerformanceMetrics 
} from '../../app/hvec/types';

/**
 * Real-time Cognitive Load Assessment
 * 
 * This monitors multiple cognitive factors to determine optimal interface complexity
 */
interface CognitiveLoadAssessment {
  overall: number;
  components: {
    intrinsic: number;      // Task complexity
    extraneous: number;     // Interface overhead
    germane: number;        // Learning load
  };
  factors: {
    timeConstraint: number;
    taskComplexity: number;
    interruptions: number;
    fatigue: number;
    errorRate: number;
    interactionSpeed: number;
  };
  recommendations: {
    action: 'simplify' | 'maintain' | 'enhance';
    reason: string;
    adjustments: string[];
  };
}

/**
 * Complexity Level Selector Component
 */
const ComplexitySelector: React.FC<{
  currentLevel: ComplexityPreference;
  onLevelChange: (level: ComplexityPreference) => void;
  cognitiveLoad: number;
  disabled?: boolean;
}> = ({ currentLevel, onLevelChange, cognitiveLoad, disabled = false }) => {
  const complexityLevels: Array<{
    id: ComplexityPreference;
    label: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  }> = [
    {
      id: 'minimal',
      label: 'Minimal',
      description: 'Essential information only - optimal for high cognitive load',
      icon: <Eye className="w-4 h-4" />,
      color: 'from-green-500 to-emerald-600',
    },
    {
      id: 'standard',
      label: 'Standard',
      description: 'Balanced information density - suitable for routine clinical work',
      icon: <Activity className="w-4 h-4" />,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      id: 'detailed',
      label: 'Detailed',
      description: 'Rich information display - for complex diagnostic reasoning',
      icon: <Brain className="w-4 h-4" />,
      color: 'from-violet-500 to-purple-600',
    },
    {
      id: 'comprehensive',
      label: 'Comprehensive',
      description: 'Maximum available information - for research and teaching',
      icon: <Settings className="w-4 h-4" />,
      color: 'from-orange-500 to-red-600',
    },
  ];

  // AI recommendation based on cognitive load
  const getRecommendedLevel = (load: number): ComplexityPreference => {
    if (load > 80) return 'minimal';
    if (load > 60) return 'standard';
    if (load > 40) return 'detailed';
    return 'comprehensive';
  };

  const recommendedLevel = getRecommendedLevel(cognitiveLoad);

  return (
    <QuantumGlassPanel 
      quantumState="processing" 
      className="p-4"
      intensity={1.1}
    >
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Interface Complexity</h3>
        <QuantumStateIndicator
          state="coherent"
          size="sm"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {complexityLevels.map((level) => {
          const isRecommended = level.id === recommendedLevel;
          const isActive = level.id === currentLevel;
          
          return (
            <motion.button
              key={level.id}
              onClick={() => !disabled && onLevelChange(level.id)}
              disabled={disabled}
              className={`
                relative p-3 rounded-lg border transition-all duration-200 text-left
                ${isActive
                  ? `bg-gradient-to-r ${level.color} text-white border-transparent shadow-lg`
                  : 'bg-gray-800/50 border-gray-600 hover:border-gray-500 text-gray-300'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
              whileTap={!disabled ? { scale: 0.98 } : {}}
            >
              {/* AI Recommendation Badge */}
              {isRecommended && !isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center"
                >
                  <AlertTriangle className="w-3 h-3 text-white" />
                </motion.div>
              )}
              
              <div className="flex items-start gap-2 mb-2">
                <div className={`p-1 rounded ${isActive ? 'bg-white/20' : 'bg-gray-700'}`}>
                  {level.icon}
                </div>
                <div>
                  <div className="font-medium">{level.label}</div>
                  {isRecommended && (
                    <div className="text-xs text-yellow-400 font-medium">
                      AI Recommended
                    </div>
                  )}
                </div>
              </div>
              
              <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                {level.description}
              </p>
            </motion.button>
          );
        })}
      </div>
      
      {/* Cognitive Load Warning */}
      {cognitiveLoad > 75 && currentLevel !== 'minimal' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-amber-500/20 border border-amber-500/50 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">
              High cognitive load detected - consider simplified interface
            </span>
          </div>
        </motion.div>
      )}
    </QuantumGlassPanel>
  );
};

/**
 * Progressive Disclosure Panel
 * 
 * Reveals information in layers based on cognitive capacity and user interaction
 */
const ProgressiveDisclosurePanel: React.FC<{
  title: string;
  priority: 'critical' | 'important' | 'supplementary' | 'educational';
  complexity: ComplexityPreference;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}> = ({ title, priority, complexity, children, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  // Auto-expand based on complexity level and priority
  const shouldShow = useMemo(() => {
    switch (complexity) {
      case 'minimal':
        return priority === 'critical';
      case 'standard':
        return priority === 'critical' || priority === 'important';
      case 'detailed':
        return priority !== 'educational';
      case 'comprehensive':
        return true;
      default:
        return true;
    }
  }, [complexity, priority]);

  const priorityColors = {
    critical: 'text-red-400 border-red-500/50',
    important: 'text-yellow-400 border-yellow-500/50',
    supplementary: 'text-cyan-400 border-cyan-500/50',
    educational: 'text-gray-400 border-gray-500/50',
  };

  if (!shouldShow) return null;

  return (
    <QuantumGlassPanel
      quantumState={priority === 'critical' ? 'active' : 'inactive'}
      className={`transition-all duration-300 ${priorityColors[priority]}`}
    >
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${
            priority === 'critical' ? 'bg-red-400' :
            priority === 'important' ? 'bg-yellow-400' :
            priority === 'supplementary' ? 'bg-cyan-400' : 'bg-gray-400'
          }`} />
          <h3 className="font-semibold text-white">{title}</h3>
          <QuantumStateIndicator
            state={priority === 'critical' ? 'entangled' : 'coherent'}
            size="sm"
          />
        </div>
        
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="px-4 pb-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </QuantumGlassPanel>
  );
};

/**
 * Cognitive Performance Dashboard
 */
const CognitivePerformanceDashboard: React.FC<{
  assessment: CognitiveLoadAssessment;
  className?: string;
}> = ({ assessment, className = '' }) => {
  return (
    <QuantumGlassPanel
      quantumState="processing"
      className={`p-6 ${className}`}
      intensity={1.3}
    >
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-6 h-6 text-violet-400" />
        <h2 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
          Cognitive Performance Analysis
        </h2>
      </div>
      
      {/* Overall Load Gauge */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300 font-medium">Overall Cognitive Load</span>
          <span className={`text-lg font-mono font-bold ${
            assessment.overall < 30 ? 'text-green-400' :
            assessment.overall < 60 ? 'text-yellow-400' :
            assessment.overall < 80 ? 'text-orange-400' : 'text-red-400'
          }`}>
            {assessment.overall}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              assessment.overall < 30 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
              assessment.overall < 60 ? 'bg-gradient-to-r from-yellow-500 to-amber-400' :
              assessment.overall < 80 ? 'bg-gradient-to-r from-orange-500 to-red-400' :
              'bg-gradient-to-r from-red-500 to-red-600'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${assessment.overall}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </div>
      </div>
      
      {/* Load Components Breakdown */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {Object.entries(assessment.components).map(([key, value]) => (
          <div key={key} className="text-center">
            <div className="text-sm text-gray-400 capitalize mb-1">{key}</div>
            <div className="text-lg font-mono font-bold text-cyan-400">{value}%</div>
            <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
              <motion.div
                className="h-full bg-cyan-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* AI Recommendations */}
      <div className="p-4 bg-gray-700/50 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 text-cyan-400" />
          <span className="font-medium text-white">AI Recommendations</span>
        </div>
        <div className="space-y-2">
          <div className={`text-sm font-medium ${
            assessment.recommendations.action === 'simplify' ? 'text-red-400' :
            assessment.recommendations.action === 'maintain' ? 'text-yellow-400' : 'text-green-400'
          }`}>
            Action: {assessment.recommendations.action.toUpperCase()}
          </div>
          <div className="text-sm text-gray-300">{assessment.recommendations.reason}</div>
          <div className="space-y-1">
            {assessment.recommendations.adjustments.map((adjustment, idx) => (
              <div key={idx} className="text-xs text-gray-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-400" />
                {adjustment}
              </div>
            ))}
          </div>
        </div>
      </div>
    </QuantumGlassPanel>
  );
};

/**
 * Main Cognitive Load Balancer Component
 */
export const CognitiveLoadBalancer: React.FC<{
  initialComplexity?: ComplexityPreference;
  onComplexityChange?: (complexity: ComplexityPreference) => void;
  onLoadChange?: (load: CognitiveLoadAssessment) => void;
}> = ({ 
  initialComplexity = 'standard',
  onComplexityChange,
  onLoadChange 
}) => {
  const [complexity, setComplexity] = useState<ComplexityPreference>(initialComplexity);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [assessment, setAssessment] = useState<CognitiveLoadAssessment>({
    overall: 45,
    components: { intrinsic: 30, extraneous: 15, germane: 25 },
    factors: {
      timeConstraint: 20,
      taskComplexity: 40,
      interruptions: 1,
      fatigue: 35,
      errorRate: 5,
      interactionSpeed: 85,
    },
    recommendations: {
      action: 'maintain',
      reason: 'Current cognitive load is within optimal range',
      adjustments: [
        'Interface complexity appropriate for current task',
        'Consider taking a brief break if fatigue increases',
        'Monitor for signs of cognitive overload'
      ],
    },
  });

  // Simulate real-time cognitive load assessment
  useEffect(() => {
    const interval = setInterval(() => {
      setAssessment(prev => {
        const newOverall = Math.max(20, Math.min(90, 
          prev.overall + (Math.random() - 0.5) * 8
        ));
        
        const newAssessment: CognitiveLoadAssessment = {
          ...prev,
          overall: newOverall,
          components: {
            intrinsic: Math.max(10, Math.min(80, prev.components.intrinsic + (Math.random() - 0.5) * 10)),
            extraneous: Math.max(5, Math.min(40, prev.components.extraneous + (Math.random() - 0.5) * 8)),
            germane: Math.max(10, Math.min(60, prev.components.germane + (Math.random() - 0.5) * 6)),
          },
          factors: {
            ...prev.factors,
            fatigue: Math.max(0, Math.min(100, prev.factors.fatigue + (Math.random() - 0.5) * 5)),
            interactionSpeed: Math.max(60, Math.min(100, prev.factors.interactionSpeed + (Math.random() - 0.5) * 3)),
          },
          recommendations: {
            action: newOverall > 75 ? 'simplify' : newOverall < 35 ? 'enhance' : 'maintain',
            reason: newOverall > 75 
              ? 'High cognitive load detected - recommend interface simplification'
              : newOverall < 35
              ? 'Low cognitive load - can handle more detailed information'
              : 'Cognitive load optimal for current complexity level',
            adjustments: newOverall > 75 
              ? ['Reduce information density', 'Hide non-critical details', 'Increase font sizes']
              : ['Current settings appropriate', 'Monitor for changes', 'Ready for complex tasks'],
          },
        };
        
        // Auto-adjust complexity if enabled
        if (isAutoMode) {
          const recommendedComplexity = newOverall > 80 ? 'minimal' :
                                      newOverall > 60 ? 'standard' :
                                      newOverall > 40 ? 'detailed' : 'comprehensive';
          
          if (recommendedComplexity !== complexity) {
            setComplexity(recommendedComplexity);
            onComplexityChange?.(recommendedComplexity);
          }
        }
        
        onLoadChange?.(newAssessment);
        return newAssessment;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [complexity, isAutoMode, onComplexityChange, onLoadChange]);

  const handleComplexityChange = (newComplexity: ComplexityPreference) => {
    setComplexity(newComplexity);
    onComplexityChange?.(newComplexity);
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <QuantumGlassPanel quantumState="active" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Cognitive Load Balancer
            </h1>
            <QuantumStateIndicator
              state="superposition"
              size="md"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Auto Mode</span>
              <QuantumButton
                variant={isAutoMode ? 'quantum' : 'secondary'}
                size="sm"
                onClick={() => setIsAutoMode(!isAutoMode)}
              >
                {isAutoMode ? 'ON' : 'OFF'}
              </QuantumButton>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ComplexitySelector
            currentLevel={complexity}
            onLevelChange={handleComplexityChange}
            cognitiveLoad={assessment.overall}
            disabled={isAutoMode}
          />
          
          <CognitivePerformanceDashboard assessment={assessment} />
        </div>
      </QuantumGlassPanel>
      
      {/* Demo: Progressive Disclosure Panels */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Info className="w-5 h-5 text-cyan-400" />
          Adaptive Information Display Demo
        </h2>
        
        <ProgressiveDisclosurePanel
          title="Critical Patient Alerts"
          priority="critical"
          complexity={complexity}
          defaultExpanded={true}
        >
          <div className="space-y-2">
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <div className="text-red-400 font-medium">Severe Allergic Reaction Risk</div>
              <div className="text-red-300 text-sm">Patient has documented severe penicillin allergy</div>
            </div>
          </div>
        </ProgressiveDisclosurePanel>
        
        <ProgressiveDisclosurePanel
          title="Diagnostic Insights"
          priority="important"
          complexity={complexity}
        >
          <div className="space-y-3">
            <div className="p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
              <div className="text-yellow-400 font-medium">Pattern Recognition Alert</div>
              <div className="text-yellow-300 text-sm">Similar presentation seen in 3 recent cases - consider autoimmune workup</div>
            </div>
          </div>
        </ProgressiveDisclosurePanel>
        
        <ProgressiveDisclosurePanel
          title="Supplementary Information"
          priority="supplementary"
          complexity={complexity}
        >
          <div className="text-gray-300 text-sm space-y-2">
            <p>Recent lab trends show improving inflammatory markers</p>
            <p>Patient compliance with medication regimen: 87%</p>
            <p>Next scheduled follow-up: 2 weeks</p>
          </div>
        </ProgressiveDisclosurePanel>
        
        <ProgressiveDisclosurePanel
          title="Educational Resources"
          priority="educational"
          complexity={complexity}
        >
          <div className="text-gray-400 text-sm space-y-2">
            <p>Latest guidelines for rheumatoid arthritis management</p>
            <p>CME opportunities in autoimmune disorders</p>
            <p>Research updates in biologic therapies</p>
          </div>
        </ProgressiveDisclosurePanel>
      </div>
    </div>
  );
};

export default CognitiveLoadBalancer;
