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
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.25, type: 'spring', bounce: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
          >
            <div 
              className="relative w-full max-w-[90vw] sm:max-w-2xl lg:max-w-3xl rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-900/98 to-black/95 p-4 sm:p-6 lg:p-8 shadow-2xl backdrop-blur-xl max-h-[90vh] overflow-y-auto"
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute right-3 top-3 sm:right-4 sm:top-4 z-10 rounded-lg p-1.5 sm:p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white cursor-pointer"
                aria-label="Close modal"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              {/* Decorative gradient orb */}
              <div className="pointer-events-none absolute -left-10 -top-10 sm:-left-20 sm:-top-20 h-32 w-32 sm:h-60 sm:w-60 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-10 -right-10 sm:-bottom-20 sm:-right-20 h-32 w-32 sm:h-60 sm:w-60 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl" />

              {/* Content */}
              <div className="relative">
                {/* Header */}
                <div className="mb-4 sm:mb-6 flex items-start gap-3 sm:gap-4 pt-2 sm:pt-4">
                  <div className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <Shield className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 text-xs sm:text-sm font-medium uppercase tracking-widest text-cyan-400/80">
                      Welcome to
                    </div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                      HENRY Platform
                    </h2>
                    <p className="mt-1 text-sm sm:text-base lg:text-lg font-medium text-slate-300">
                      Heroes' Early Notification & Response Yesterday
                    </p>
                  </div>
                </div>

                {/* Main content */}
                <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
                  <p className="text-sm sm:text-base leading-relaxed text-slate-300">
                    We designed HENRY for a proactive approach to Veterans' care and benefits. Instead of waiting
                    for problems to surface, HENRY continuously verifies profiles, surfaces risks early, and routes
                    the right information to the right humans—fast.
                  </p>

                  <p className="text-sm sm:text-base leading-relaxed text-slate-300">
                    The platform blends clinical reasoning with regulatory knowledge to help teams act sooner,
                    reduce rework, and make transparent, reviewable decisions with human oversight.
                  </p>
                </div>

                {/* Features grid */}
                <div className="mb-4 sm:mb-6 grid grid-cols-1 gap-2 sm:gap-3 sm:grid-cols-2">
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

                {/* What HENRY Does */}
                <div className="mb-4 sm:mb-6 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                  <h3 className="text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3">What this platform does</h3>
                  <ul className="grid grid-cols-1 gap-2">
                    <li className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400 flex-shrink-0"></span>
                      <span>Proactive Veteran Profile verification and continuous sync with trusted sources</span>
                    </li>
                    <li className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                      <span>Early risk detection and intelligent routing for timely interventions</span>
                    </li>
                    <li className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-400 flex-shrink-0"></span>
                      <span>Evidence ingestion, triage, and organization for Claims and Clinical review</span>
                    </li>
                    <li className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                      <span>AI-assisted reasoning with clear rationales and human-in-the-loop oversight</span>
                    </li>
                    <li className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-pink-400 flex-shrink-0"></span>
                      <span>Transparent, auditable outcomes aligned to policy and clinical best practices</span>
                    </li>
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                  <div className="flex items-center gap-2 text-xs text-slate-400 order-2 sm:order-1">
                    <Sparkles className="h-3 w-3 flex-shrink-0" />
                    <span className="text-center sm:text-left">Powered by advanced AI with human oversight</span>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 order-1 sm:order-2">
                    <button
                      onClick={handleClose}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="rounded-lg sm:rounded-xl bg-white/10 px-3 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium text-white transition-all hover:bg-white/20 cursor-pointer"
                    >
                      Start Exploring
                    </button>
                    <button
                      onClick={handleLearnMore}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 sm:gap-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium text-white shadow-lg transition-all hover:from-cyan-400 hover:to-blue-500 hover:shadow-xl cursor-pointer"
                    >
                      Learn More
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
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
    <div className="flex items-start gap-2 sm:gap-3 rounded-lg sm:rounded-xl border border-white/10 bg-white/5 p-2 sm:p-3">
      <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-md sm:rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex-shrink-0">
        <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-xs sm:text-sm font-semibold text-white">{title}</h3>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
    </div>
  );
}
