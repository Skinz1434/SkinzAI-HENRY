'use client';

import React, { useState, useEffect } from 'react';
import { X, Shield, Brain, Activity, FileText, Users, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'henry_welcome_v1'; // Bump this version to re-show after updates

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSeenWelcome = localStorage.getItem(STORAGE_KEY);
      if (!hasSeenWelcome) {
        // Small delay for better UX
        const timer = setTimeout(() => {
          setOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, '1');
    }
  };

  const handleLearnMore = () => {
    handleClose();
    // Scroll to learn more section if it exists
    const learnSection = document.getElementById('learn-more');
    if (learnSection) {
      learnSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, type: 'spring', bounce: 0.4 }}
            className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative w-[92vw] max-w-3xl rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-900/98 to-black/95 p-8 shadow-2xl backdrop-blur-xl">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Decorative gradient orb */}
              <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl" />

              {/* Content */}
              <div className="relative">
                {/* Header */}
                <div className="mb-6 flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <Shield className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-medium uppercase tracking-widest text-cyan-400/80">
                      Welcome to
                    </div>
                    <h2 className="text-3xl font-bold text-white">
                      HENRY Platform
                    </h2>
                    <p className="mt-1 text-lg font-medium text-slate-300">
                      Heroes' Early Notification & Response Yesterday
                    </p>
                  </div>
                </div>

                {/* Main content */}
                <div className="mb-6 space-y-4">
                  <p className="text-base leading-relaxed text-slate-300">
                    We built HENRY to transform how Veterans receive care and benefits. Our AI-powered platform 
                    reduces processing time from months to minutes, ensures fair and unbiased decisions, and 
                    keeps human expertise at the center of every determination.
                  </p>

                  <p className="text-base leading-relaxed text-slate-300">
                    HENRY combines advanced clinical intelligence with comprehensive regulatory knowledge to 
                    deliver accurate, evidence-based outcomes that honor our Veterans' service and sacrifice.
                  </p>
                </div>

                {/* Features grid */}
                <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <FeatureItem
                    icon={Brain}
                    title="HVEC Clinical Intelligence"
                    description="AI-powered diagnostic reasoning & documentation"
                  />
                  <FeatureItem
                    icon={Activity}
                    title="Real-Time Analytics"
                    description="Live verification, profiles, and claims tracking"
                  />
                  <FeatureItem
                    icon={FileText}
                    title="VA Claims AI"
                    description="Automated OCR, annotation, and intelligent triage"
                  />
                  <FeatureItem
                    icon={Shield}
                    title="CODDA IDE"
                    description="Character of discharge decisions with IPR automation"
                  />
                </div>

                {/* Platform stats */}
                <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-cyan-400">98.7%</div>
                      <div className="text-xs text-slate-400">Accuracy Rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">42s</div>
                      <div className="text-xs text-slate-400">Avg Processing</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-400">24/7</div>
                      <div className="text-xs text-slate-400">Availability</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Sparkles className="h-3 w-3" />
                    <span>Powered by advanced AI with human oversight</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleClose}
                      className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/20"
                    >
                      Start Exploring
                    </button>
                    <button
                      onClick={handleLearnMore}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:from-cyan-400 hover:to-blue-500 hover:shadow-xl"
                    >
                      Learn More
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function FeatureItem({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: any; 
  title: string; 
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20">
        <Icon className="h-4 w-4 text-cyan-400" />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
    </div>
  );
}