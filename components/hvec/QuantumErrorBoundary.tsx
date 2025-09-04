'use client';

/**
 * Quantum Error Boundary and Loading States System
 * 
 * VectorForge Pedagogical Commentary:
 * In quantum mechanics, measurements can fail and systems can decohere.
 * Similarly, our clinical intelligence system needs graceful error handling
 * that maintains the quantum metaphor while providing meaningful feedback.
 * 
 * Watch how this pattern creates emergent intelligence - even system failures
 * become opportunities for elegant user experience and system recovery.
 */

import React, { Component, ErrorInfo, ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  RefreshCw, 
  Zap, 
  Brain,
  Activity,
  Shield,
  Wifi,
  WifiOff,
  Clock
} from 'lucide-react';
import {
  QuantumGlassPanel,
  QuantumStateIndicator,
  QuantumButton,
  QuantumLoadingSpinner,
} from './QuantumVisualEffects';

// Error types with quantum analogies
export type QuantumErrorType = 
  | 'decoherence'        // System state became inconsistent
  | 'entanglement_break' // Connection between components failed
  | 'superposition_collapse' // Multiple states resolved to error
  | 'measurement_failure' // Data collection/processing failed
  | 'quantum_tunnel_blocked' // Network/API communication failed
  | 'wave_function_interference' // Conflicting operations
  | 'uncertainty_overflow'; // Too much ambiguity in system state

interface QuantumError {
  type: QuantumErrorType;
  message: string;
  technicalDetails?: string;
  recoveryActions: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  context?: Record<string, any>;
}

/**
 * Error Boundary Component with Quantum State Management
 */
interface QuantumErrorBoundaryState {
  hasError: boolean;
  error: QuantumError | null;
  errorCount: number;
  isRecovering: boolean;
}

interface QuantumErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: QuantumError) => void;
  maxRetries?: number;
  autoRecover?: boolean;
}

export class QuantumErrorBoundary extends Component<
  QuantumErrorBoundaryProps,
  QuantumErrorBoundaryState
> {
  private retryTimeout: NodeJS.Timeout | null = null;

  constructor(props: QuantumErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorCount: 0,
      isRecovering: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<QuantumErrorBoundaryState> {
    // Classify error using quantum analogies
    const quantumError: QuantumError = {
      type: 'decoherence',
      message: 'System coherence lost - quantum state needs restoration',
      technicalDetails: error.message,
      recoveryActions: [
        'Attempt automatic coherence restoration',
        'Reset quantum state to last stable configuration',
        'Reinitialize system components'
      ],
      severity: 'high',
      timestamp: new Date(),
      context: {
        errorName: error.name,
        stack: error.stack,
      },
    };

    return {
      hasError: true,
      error: quantumError,
      errorCount: 1,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const quantumError = this.state.error!;
    
    // Enhanced error classification
    if (error.message.includes('fetch') || error.message.includes('network')) {
      quantumError.type = 'quantum_tunnel_blocked';
      quantumError.message = 'Quantum tunnel collapsed - unable to reach remote systems';
    } else if (error.message.includes('timeout')) {
      quantumError.type = 'measurement_failure';
      quantumError.message = 'Measurement exceeded uncertainty threshold - operation timed out';
    } else if (error.message.includes('parse') || error.message.includes('JSON')) {
      quantumError.type = 'wave_function_interference';
      quantumError.message = 'Wave function interference detected - data format incompatible';
    }

    this.props.onError?.(quantumError);
    
    // Auto-recovery mechanism
    if (this.props.autoRecover && this.state.errorCount < (this.props.maxRetries || 3)) {
      this.startRecoveryProcess();
    }
  }

  private startRecoveryProcess = () => {
    this.setState({ isRecovering: true });
    
    this.retryTimeout = setTimeout(() => {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        isRecovering: false,
        errorCount: prevState.errorCount + 1,
      }));
    }, 3000 + this.state.errorCount * 2000); // Exponential backoff
  };

  private handleManualRecovery = () => {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
    
    this.setState({
      hasError: false,
      error: null,
      isRecovering: false,
      errorCount: 0,
    });
  };

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.state.isRecovering) {
        return <QuantumRecoveryScreen error={this.state.error} />;
      }
      
      return this.props.fallback || (
        <QuantumErrorDisplay
          error={this.state.error}
          onRetry={this.handleManualRecovery}
          retryCount={this.state.errorCount}
          maxRetries={this.props.maxRetries || 3}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Quantum Error Display Component
 */
const QuantumErrorDisplay: React.FC<{
  error: QuantumError;
  onRetry: () => void;
  retryCount: number;
  maxRetries: number;
}> = ({ error, onRetry, retryCount, maxRetries }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-400 border-blue-500/50';
      case 'medium': return 'text-yellow-400 border-yellow-500/50';
      case 'high': return 'text-orange-400 border-orange-500/50';
      case 'critical': return 'text-red-400 border-red-500/50';
      default: return 'text-gray-400 border-gray-500/50';
    }
  };

  const getErrorIcon = (type: QuantumErrorType) => {
    switch (type) {
      case 'decoherence': return <Zap className="w-8 h-8" />;
      case 'entanglement_break': return <WifiOff className="w-8 h-8" />;
      case 'superposition_collapse': return <AlertTriangle className="w-8 h-8" />;
      case 'measurement_failure': return <Activity className="w-8 h-8" />;
      case 'quantum_tunnel_blocked': return <Shield className="w-8 h-8" />;
      case 'wave_function_interference': return <Brain className="w-8 h-8" />;
      case 'uncertainty_overflow': return <Clock className="w-8 h-8" />;
      default: return <AlertTriangle className="w-8 h-8" />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <QuantumGlassPanel
          quantumState="active"
          className={`p-8 text-center ${getSeverityColor(error.severity)}`}
          intensity={1.5}
        >
          {/* Error Icon and Type */}
          <motion.div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
              error.severity === 'critical' ? 'bg-red-500/20' :
              error.severity === 'high' ? 'bg-orange-500/20' :
              error.severity === 'medium' ? 'bg-yellow-500/20' :
              'bg-blue-500/20'
            }`}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {getErrorIcon(error.type)}
          </motion.div>

          <h1 className="text-2xl font-bold text-white mb-4">
            Quantum System Anomaly Detected
          </h1>

          <div className="flex items-center justify-center gap-2 mb-6">
            <QuantumStateIndicator
              state="collapsed"
              size="md"
              showLabel={false}
            />
            <span className="text-lg font-mono text-cyan-400 capitalize">
              {error.type.replace(/_/g, ' ')}
            </span>
          </div>

          <p className="text-white/90 text-lg mb-6">
            {error.message}
          </p>

          {/* Technical Details (Expandable) */}
          {error.technicalDetails && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-gray-400 hover:text-gray-300 transition-colors">
                Technical Diagnostic Data
              </summary>
              <div className="mt-3 p-4 bg-gray-800/50 rounded-lg font-mono text-sm text-gray-300">
                {error.technicalDetails}
              </div>
            </details>
          )}

          {/* Recovery Actions */}
          <div className="mb-8 text-left">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Quantum Recovery Protocols
            </h3>
            <ul className="space-y-2">
              {error.recoveryActions.map((action, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-center gap-2 text-gray-300"
                >
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                  {action}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4">
            <QuantumButton
              variant="quantum"
              onClick={onRetry}
              disabled={retryCount >= maxRetries}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Restore Quantum Coherence
            </QuantumButton>
            
            <QuantumButton
              variant="secondary"
              onClick={() => window.location.reload()}
            >
              Full System Reset
            </QuantumButton>
          </div>

          {/* Retry Status */}
          {retryCount > 0 && (
            <div className="mt-4 text-sm text-gray-400">
              Recovery attempts: {retryCount} / {maxRetries}
            </div>
          )}

          {/* Timestamp */}
          <div className="mt-6 text-xs text-gray-500 font-mono">
            Anomaly detected: {error.timestamp.toLocaleString()}
          </div>
        </QuantumGlassPanel>
      </motion.div>
    </div>
  );
};

/**
 * Quantum Recovery Screen
 */
const QuantumRecoveryScreen: React.FC<{ error: QuantumError }> = ({ error }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-gray-900 via-violet-900/20 to-gray-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <QuantumGlassPanel quantumState="processing" className="p-12" intensity={1.8}>
          <QuantumLoadingSpinner
            size="lg"
            message="Restoring Quantum Coherence..."
          />
          
          <h2 className="text-xl font-semibold text-white mt-6 mb-4">
            Quantum Recovery in Progress
          </h2>
          
          <p className="text-gray-400 mb-6">
            Attempting to restore system state and re-establish quantum entanglement...
          </p>
          
          <div className="flex items-center justify-center gap-2">
            <QuantumStateIndicator
              state="superposition"
              size="sm"
              showLabel={false}
            />
            <span className="text-sm text-cyan-400 font-mono">
              {error.type.replace(/_/g, ' ')} → coherent
            </span>
          </div>
        </QuantumGlassPanel>
      </motion.div>
    </div>
  );
};

/**
 * Quantum Skeleton Loader for Data Fetching States
 */
export const QuantumSkeleton: React.FC<{
  lines?: number;
  width?: 'full' | 'partial' | 'varied';
  animated?: boolean;
  className?: string;
}> = ({ lines = 3, width = 'varied', animated = true, className = '' }) => {
  const getWidth = (index: number) => {
    switch (width) {
      case 'full': return 'w-full';
      case 'partial': return 'w-3/4';
      case 'varied': return index % 3 === 0 ? 'w-full' : index % 3 === 1 ? 'w-3/4' : 'w-1/2';
      default: return 'w-full';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          className={`h-4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded ${getWidth(index)}`}
          animate={animated ? {
            opacity: [0.5, 1, 0.5],
          } : {}}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

/**
 * Network Status Indicator
 */
export const QuantumNetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Measure latency
    const measureLatency = async () => {
      const start = performance.now();
      try {
        await fetch('/api/ping', { method: 'HEAD' });
        const end = performance.now();
        setLatency(end - start);
      } catch {
        setLatency(null);
      }
    };

    const interval = setInterval(measureLatency, 10000);
    measureLatency();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return (
    <motion.div
      className="fixed bottom-4 left-4 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <QuantumGlassPanel
        quantumState={isOnline ? 'active' : 'inactive'}
        className="p-3"
      >
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-green-400" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-400" />
          )}
          
          <div className="text-xs">
            <div className={`font-medium ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
              {isOnline ? 'Quantum Tunnel Active' : 'Quantum Tunnel Collapsed'}
            </div>
            {isOnline && latency && (
              <div className="text-gray-400">
                Latency: {latency.toFixed(0)}ms
              </div>
            )}
          </div>
          
          <QuantumStateIndicator
            state={isOnline ? 'coherent' : 'collapsed'}
            size="sm"
          />
        </div>
      </QuantumGlassPanel>
    </motion.div>
  );
};

export default {
  QuantumErrorBoundary,
  QuantumSkeleton,
  QuantumNetworkStatus,
};
