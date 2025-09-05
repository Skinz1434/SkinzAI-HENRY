'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GradientOrbsProps {
  animated?: boolean;
  className?: string;
}

export default function GradientOrbs({ animated = true, className = '' }: GradientOrbsProps) {
  if (animated) {
    return (
      <div className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/10 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/10 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 20, -20, 0],
            y: [0, -20, 20, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 blur-3xl"
        />
      </div>
    );
  }

  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <div className="absolute -left-16 -top-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-[80px]" />
      <div className="absolute bottom-0 right-[-40px] h-80 w-80 rounded-full bg-fuchsia-500/20 blur-[90px]" />
      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[100px]" />
    </div>
  );
}