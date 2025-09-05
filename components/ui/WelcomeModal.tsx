'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Shield, Brain, Activity, FileText, Users, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'henry_welcome_v1'; // Bump this version to re-show after updates

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });

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

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow dragging from the header area (not buttons)
    if (e.target instanceof HTMLElement && 
        (e.target.closest('button') || e.target.closest('[role="button"]'))) {
      return;
    }
    
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;
    
    const newX = dragRef.current.initialX + deltaX;
    const newY = dragRef.current.initialY + deltaY;
    
    // Constrain to viewport bounds
    const modal = modalRef.current;
    if (modal) {
      const rect = modal.getBoundingClientRect();
      const maxX = window.innerWidth - rect.width;
      const maxY = window.innerHeight - rect.height;
      
      setPosition({
        x: Math.max(-rect.width / 2, Math.min(maxX - rect.width / 2, newX)),
        y: Math.max(-rect.height / 2, Math.min(maxY - rect.height / 2, newY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.target instanceof HTMLElement &&
        (e.target.closest('button') || e.target.closest('[role="button"]'))) {
      return;
    }
    if (!e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    setIsDragging(true);
    dragRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      initialX: position.x,
      initialY: position.y
    };
    document.addEventListener('touchmove', handleTouchMove as any, { passive: false });
    document.addEventListener('touchend', handleTouchEnd as any);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    if (!e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragRef.current.startX;
    const deltaY = touch.clientY - dragRef.current.startY;
    const newX = dragRef.current.initialX + deltaX;
    const newY = dragRef.current.initialY + deltaY;
    const modal = modalRef.current;
    if (modal) {
      const rect = modal.getBoundingClientRect();
      const maxX = window.innerWidth - rect.width;
      const maxY = window.innerHeight - rect.height;
      setPosition({
        x: Math.max(-rect.width / 2, Math.min(maxX - rect.width / 2, newX)),
        y: Math.max(-rect.height / 2, Math.min(maxY - rect.height / 2, newY))
      });
    }
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    document.removeEventListener('touchmove', handleTouchMove as any);
    document.removeEventListener('touchend', handleTouchEnd as any);
  };

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove as any);
      document.removeEventListener('touchend', handleTouchEnd as any);
    };
  }, []);

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
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, type: 'spring', bounce: 0.4 }}
            className="fixed left-1/2 top-1/2 z-50"
            style={{ transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)` }}
          >
            <div 
              className={`relative w-[92vw] max-w-3xl max-h-[90vh] overflow-auto rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-900/98 to-black/95 p-8 shadow-2xl backdrop-blur-xl ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 z-10 rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white cursor-pointer"
                aria-label="Close modal"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <X className="h-5 w-5" />
              </button>

              {/* Decorative gradient orb */}
              <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl" />

              {/* Content */}
              <div className="relative">
                {/* Drag Handle */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/20 rounded-full cursor-grab active:cursor-grabbing" />
                
                {/* Header */}
                <div className="mb-6 flex items-start gap-4 pt-4">
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
                      onMouseDown={(e) => e.stopPropagation()}
                      className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/20 cursor-pointer"
                    >
                      Start Exploring
                    </button>
                    <button
                      onClick={handleLearnMore}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:from-cyan-400 hover:to-blue-500 hover:shadow-xl cursor-pointer"
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