'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Enhanced Quantum Field Animation with Particle Physics
 * 
 * Creates a sophisticated particle field that simulates quantum behavior
 * with proper physics-based movement and interaction patterns
 */
export const EnhancedQuantumField: React.FC<{
  particleCount?: number;
  intensity?: number;
  interactionMode?: 'passive' | 'interactive' | 'reactive';
  className?: string;
}> = ({ 
  particleCount = 50, 
  intensity = 1, 
  interactionMode = 'passive',
  className = '' 
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);

  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      speed: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      amplitude: 10 + Math.random() * 20,
      frequency: 0.5 + Math.random() * 1.5,
      opacity: 0.3 + Math.random() * 0.4,
      color: Math.random() > 0.5 ? 'cyan' : Math.random() > 0.5 ? 'violet' : 'green',
    }));
  }, [particleCount]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (interactionMode === 'interactive') {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
      setIsInteracting(true);
    }
  };

  const handleMouseLeave = () => {
    setIsInteracting(false);
  };

  return (
    <div 
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ pointerEvents: interactionMode === 'interactive' ? 'auto' : 'none' }}
    >
      {/* Quantum field gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-violet-500/5 to-green-500/5" />
      
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color === 'cyan' ? '#00ffff' : 
                            particle.color === 'violet' ? '#8b5cf6' : '#00ff88',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            x: [
              0,
              Math.sin(particle.phase) * particle.amplitude * intensity,
              Math.sin(particle.phase + Math.PI) * particle.amplitude * intensity,
              0
            ],
            y: [
              0,
              Math.cos(particle.phase * particle.frequency) * particle.amplitude * 0.5 * intensity,
              Math.cos(particle.phase * particle.frequency + Math.PI) * particle.amplitude * 0.5 * intensity,
              0
            ],
            scale: [1, 1.2, 0.8, 1],
            opacity: [
              particle.opacity,
              particle.opacity * 1.3,
              particle.opacity * 0.7,
              particle.opacity
            ],
            // Interactive mode: particles react to mouse
            ...(isInteracting && interactionMode === 'interactive' && {
              x: [
                0,
                (particle.x - mousePos.x) * 0.5,
                (particle.x - mousePos.x) * 0.3,
                0
              ],
              y: [
                0,
                (particle.y - mousePos.y) * 0.5,
                (particle.y - mousePos.y) * 0.3,
                0
              ]
            })
          }}
          transition={{
            duration: 3 + particle.speed * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.phase * 0.1,
          }}
        />
      ))}
      
      {/* Quantum interference patterns */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute inset-0 border border-cyan-400/20 rounded-full"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [0.5, 2 + i * 0.5, 0.5],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 4 + i * 2,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

/**
 * Quantum State Indicator with Visual Feedback
 */
export const QuantumStateIndicator: React.FC<{
  state: 'superposition' | 'entangled' | 'coherent' | 'collapsed';
  intensity?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}> = ({ state, intensity = 1, size = 'md', showLabel = false, className = '' }) => {
  const stateConfig = {
    superposition: {
      colors: ['#00ffff', '#8b5cf6', '#00ff88'],
      label: 'Superposition',
      description: 'Multiple states simultaneously',
    },
    entangled: {
      colors: ['#ff6b35', '#f59e0b'],
      label: 'Entangled',
      description: 'Correlated clinical findings',
    },
    coherent: {
      colors: ['#00ff88'],
      label: 'Coherent',
      description: 'Aligned diagnostic vectors',
    },
    collapsed: {
      colors: ['#ffffff'],
      label: 'Collapsed',
      description: 'Definitive measurement',
    },
  };

  const config = stateConfig[state];
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden`}>
        {/* Multi-color gradient for superposition */}
        {state === 'superposition' && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(${config.colors.join(', ')})`,
            }}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )}
        
        {/* Pulsing effect for other states */}
        {state !== 'superposition' && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: config.colors[0] }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
        
        {/* Core indicator */}
        <div 
          className="absolute inset-2 rounded-full"
          style={{ 
            backgroundColor: config.colors[0],
            opacity: 0.8 * intensity,
          }}
        />
      </div>
      
      {showLabel && (
        <div className="text-xs">
          <div className="text-white font-medium">{config.label}</div>
          <div className="text-gray-400">{config.description}</div>
        </div>
      )}
    </div>
  );
};

/**
 * Enhanced Glassmorphism Panel with Quantum Effects
 */
export const QuantumGlassPanel: React.FC<{
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  quantumState?: 'active' | 'inactive' | 'processing';
  blur?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ 
  children, 
  className = '', 
  intensity = 1, 
  quantumState = 'inactive',
  blur = 'md'
}) => {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  };

  const stateEffects = {
    active: 'border-cyan-400/50 shadow-cyan-500/20',
    inactive: 'border-gray-700/50',
    processing: 'border-violet-400/50 shadow-violet-500/20',
  };

  return (
    <motion.div
      className={`
        relative bg-gray-900/40 ${blurClasses[blur]} rounded-xl border 
        ${stateEffects[quantumState]} transition-all duration-500 
        ${className}
      `}
      whileHover={{
        scale: 1.02,
        y: -2,
      }}
      style={{
        boxShadow: quantumState === 'active' 
          ? `0 0 20px rgba(6, 182, 212, ${0.1 * intensity})` 
          : quantumState === 'processing'
          ? `0 0 20px rgba(139, 92, 246, ${0.1 * intensity})`
          : 'none',
      }}
    >
      {/* Quantum glow effect */}
      {quantumState !== 'inactive' && (
        <motion.div
          className={`
            absolute inset-0 rounded-xl 
            ${quantumState === 'active' ? 'bg-cyan-400/5' : 'bg-violet-400/5'}
          `}
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Processing indicator */}
      {quantumState === 'processing' && (
        <motion.div
          className="absolute top-2 right-2 w-2 h-2 bg-violet-400 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.div>
  );
};

/**
 * Quantum Loading Spinner with Superposition Animation
 */
export const QuantumLoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}> = ({ size = 'md', message }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Multiple rotating rings for quantum superposition effect */}
        {[0, 1, 2].map((ring) => (
          <motion.div
            key={ring}
            className="absolute inset-0 border-2 border-transparent rounded-full"
            style={{
              borderTopColor: ring === 0 ? '#00ffff' : ring === 1 ? '#8b5cf6' : '#00ff88',
              borderRightColor: ring === 0 ? '#00ffff' : ring === 1 ? '#8b5cf6' : '#00ff88',
            }}
            animate={{
              rotate: ring % 2 === 0 ? [0, 360] : [360, 0],
            }}
            transition={{
              duration: 1.5 + ring * 0.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
        
        {/* Central quantum dot */}
        <motion.div
          className="absolute inset-1/3 bg-white rounded-full"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      
      {message && (
        <motion.div
          className="text-gray-400 text-sm font-mono"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {message}
        </motion.div>
      )}
    </div>
  );
};

/**
 * Vector Field Lines Background Effect
 */
export const VectorFieldLines: React.FC<{
  density?: number;
  animated?: boolean;
  className?: string;
}> = ({ density = 10, animated = true, className = '' }) => {
  const lines = useMemo(() => {
    return Array.from({ length: density }, (_, i) => ({
      id: i,
      x1: Math.random() * 100,
      y1: Math.random() * 100,
      x2: Math.random() * 100,
      y2: Math.random() * 100,
      opacity: 0.1 + Math.random() * 0.2,
      strokeWidth: 0.5 + Math.random() * 0.5,
    }));
  }, [density]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg className="w-full h-full">
        {lines.map((line) => (
          <motion.line
            key={line.id}
            x1={`${line.x1}%`}
            y1={`${line.y1}%`}
            x2={`${line.x2}%`}
            y2={`${line.y2}%`}
            stroke="url(#vectorGradient)"
            strokeWidth={line.strokeWidth}
            opacity={line.opacity}
            animate={animated ? {
              x2: [`${line.x2}%`, `${(line.x2 + 10) % 100}%`, `${line.x2}%`],
              y2: [`${line.y2}%`, `${(line.y2 + 5) % 100}%`, `${line.y2}%`],
              opacity: [line.opacity, line.opacity * 1.5, line.opacity],
            } : {}}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="vectorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffff" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00ff88" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

/**
 * Quantum Button with Enhanced Interactions
 */
export const QuantumButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'quantum';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  className = '' 
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const variants = {
    primary: 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500',
    secondary: 'bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500',
    quantum: 'bg-gradient-to-r from-cyan-500 via-violet-500 to-green-500 hover:from-cyan-400 hover:via-violet-400 hover:to-green-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      className={`
        relative font-medium text-white rounded-lg transition-all duration-200
        ${variants[variant]} ${sizes[size]} ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onClick={disabled ? undefined : onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      whileHover={!disabled ? { scale: 1.05, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      style={{
        boxShadow: variant === 'quantum' 
          ? '0 0 20px rgba(139, 92, 246, 0.3)' 
          : undefined,
      }}
    >
      {/* Quantum ripple effect */}
      {isPressed && variant === 'quantum' && (
        <motion.div
          className="absolute inset-0 bg-white rounded-lg"
          initial={{ scale: 0, opacity: 0.3 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default {
  EnhancedQuantumField,
  QuantumStateIndicator,
  QuantumGlassPanel,
  QuantumLoadingSpinner,
  VectorFieldLines,
  QuantumButton,
};
