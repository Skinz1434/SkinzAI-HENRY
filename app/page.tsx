'use client';

import { useRouter } from 'next/navigation';
import { Shield, Brain, Activity, ArrowRight, Zap, FileText, Heart, Users, Award, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedParticles from '@/components/ui/AnimatedParticles';
import GradientOrbs from '@/components/ui/GradientOrbs';
import WelcomeModal from '@/components/ui/WelcomeModal';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-henry-bg relative overflow-hidden">
      {/* Background Effects */}
      <AnimatedParticles 
        className="fixed inset-0" 
        particleColor="rgba(94, 234, 212, 0.20)"
        lineColor="rgba(59, 130, 246, 0.15)"
        particleCount={140}
        speed={0.15}
        interactive={false}
      />
      <GradientOrbs animated={true} />
      
      {/* Welcome Modal */}
      <WelcomeModal />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-cyan-400 animate-pulse drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full animate-ping"></div>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
            HENRY Platform
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 px-4">Heroes' Early Notification & Response Yesterday - Powered by The Henry Protocol</p>
          
          {/* Personalized Mission Statement */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-4 sm:p-6 shadow-2xl">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 animate-pulse" />
                <h3 className="text-base sm:text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Our Mission</h3>
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 animate-pulse" />
              </div>
              <p className="text-center text-sm sm:text-base text-gray-300 leading-relaxed mb-4">
                We built HENRY to honor every Veteran's sacrifice by transforming months of waiting into minutes of action. 
                Our AI-powered platform ensures that no hero's story goes unheard, no evidence goes unexamined, and no 
                decision lacks the thoroughness our Veterans deserve.
              </p>
              <p className="text-center text-xs sm:text-sm text-gray-400 italic">
                "Because yesterday's heroes deserve tomorrow's technology today."
              </p>
              <p className="mt-2 text-center text-[10px] sm:text-[11px] text-gray-500 italic">
                Dedicated to the memory of Christopher J. Henry, USMC — our brother. This mission is for every Veteran we lost and every life we can still save.
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-gray-700">
                <div className="text-center">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 mx-auto mb-1" />
                  <div className="text-base sm:text-lg font-bold text-white">500</div>
                  <div className="text-xs text-gray-400">Unique Veteran Profiles (current)</div>
                </div>
                <div className="text-center">
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mx-auto mb-1" />
                  <div className="text-base sm:text-lg font-bold text-white">Custom Predictive Algorithms</div>
                  <div className="text-xs text-gray-400">Built for early risk and needs detection</div>
                </div>
                <div className="text-center">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mx-auto mb-1" />
                  <div className="text-base sm:text-lg font-bold text-white">TERA Exposure Analysis</div>
                  <div className="text-xs text-gray-400">Toxic Exposure Risk Assessment integrated</div>
                </div>
                <div className="text-center">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mx-auto mb-1" />
                  <div className="text-base sm:text-lg font-bold text-white">Proactive Outreach</div>
                  <div className="text-xs text-gray-400">Actionable routing and follow‑up workflows</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Cards Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4 sm:gap-6"
        >
          {/* HVEC Clinical Intelligence Card */}
          <div 
            onClick={() => window.location.href = '/hvec'}
            className="bg-gray-800/50 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer group relative z-10 min-h-[420px] flex flex-col"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent leading-tight">HVEC Clinical Intelligence</h2>
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed flex-grow">
              Advanced clinical decision support system with AI-powered diagnostic reasoning, pattern recognition, and comprehensive VA service connection analysis.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="text-sm text-gray-500 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0 mt-1.5"></span>
                <span>Multi-specialty diagnostic engine</span>
              </li>
              <li className="text-sm text-gray-500 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0 mt-1.5"></span>
                <span>Evidence-based recommendations</span>
              </li>
              <li className="text-sm text-gray-500 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0 mt-1.5"></span>
                <span>Automated documentation & DBQ</span>
              </li>
              <li className="text-sm text-gray-500 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0 mt-1.5"></span>
                <span>Real-time Veteran data integration</span>
              </li>
            </ul>
            <div className="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors mt-auto">
              <span className="text-sm font-medium">Launch Clinical Intelligence</span>
              <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Dashboard Card */}
          <div 
            onClick={() => window.location.href = '/henry/dashboard-full'}
            className="bg-gray-800/50 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-cyan-500/50 transition-all cursor-pointer group relative z-10 min-h-[420px] flex flex-col"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-200 via-blue-200 to-cyan-200 bg-clip-text text-transparent leading-tight">HENRY Dashboard</h2>
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed flex-grow">
              Complete Veteran service verification suite with profile management, claims tracking, and VA integration.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="text-sm text-gray-500 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full flex-shrink-0 mt-1.5"></span>
                <span>Veteran profile management</span>
              </li>
              <li className="text-sm text-gray-500 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full flex-shrink-0 mt-1.5"></span>
                <span>Claims tracking & analysis</span>
              </li>
              <li className="text-sm text-gray-500 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full flex-shrink-0 mt-1.5"></span>
                <span>VA profile synchronization</span>
              </li>
              <li className="text-sm text-gray-500 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full flex-shrink-0 mt-1.5"></span>
                <span>Comprehensive reporting</span>
              </li>
            </ul>
            <div className="flex items-center gap-2 text-cyan-400 group-hover:text-cyan-300 transition-colors mt-auto">
              <span className="text-sm font-semibold">Open Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* VA Claims AI Card */}
          <div 
            onClick={() => window.location.href = '/va-claims-ai'}
            className="bg-gray-800/50 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer group relative overflow-hidden z-10 min-h-[420px] flex flex-col"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-bl-lg">
              NEW
            </div>
            <div className="flex items-center gap-3 mb-4 mt-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent leading-tight">VA Claims AI</h2>
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed flex-grow">
              AI-powered document review system for VA disability claims with automated evidence analysis and annotation.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="text-sm text-gray-500 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0 mt-1.5"></span>
                <span>Intelligent document processing & OCR</span>
              </li>
              <li className="text-sm text-gray-500 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0 mt-1.5"></span>
                <span>AI evidence analysis & scoring</span>
              </li>
              <li className="text-sm text-gray-500 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0 mt-1.5"></span>
                <span>Automated annotations & tabbing</span>
              </li>
              <li className="text-sm text-gray-500 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0 mt-1.5"></span>
                <span>C&P exam request generation</span>
              </li>
            </ul>
            <div className="flex items-center gap-2 text-purple-400 group-hover:text-purple-300 transition-colors mt-auto">
              <span className="text-sm font-semibold">Launch AI Review</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* CODDA Card */}
          <div 
            onClick={() => window.location.href = '/codda'}
            className="bg-gray-800/50 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-teal-500/50 transition-all cursor-pointer group relative overflow-hidden z-10 min-h-[420px] flex flex-col"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs font-bold rounded-bl-lg">
              NEW
            </div>
            <div className="flex items-center gap-3 mb-4 mt-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-teal-200 via-cyan-200 to-teal-200 bg-clip-text text-transparent leading-tight">CODDA</h2>
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed flex-grow">
              AI-powered Character of Discharge Determination Assistant with IDE-style workspace and QBit integration.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="text-sm text-gray-500 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full flex-shrink-0 mt-1.5"></span>
                <span>Evidence gap detection & analysis</span>
              </li>
              <li className="text-sm text-gray-500 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full flex-shrink-0 mt-1.5"></span>
                <span>QBit AI assistant integration</span>
              </li>
              <li className="text-sm text-gray-500 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full flex-shrink-0 mt-1.5"></span>
                <span>IPR workflow automation</span>
              </li>
              <li className="text-sm text-gray-500 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full flex-shrink-0 mt-1.5"></span>
                <span>Bias guard & quality assurance</span>
              </li>
            </ul>
            <div className="flex items-center gap-2 text-teal-400 group-hover:text-teal-300 transition-colors mt-auto">
              <span className="text-sm font-semibold">Launch CODDA</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          
          {/* TERA Analytics Card */}
          <div 
            onClick={() => window.location.href = '/tera-analytics'}
            className="bg-gray-800/50 backdrop-blur-md rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-700 hover:border-orange-500/50 transition-all cursor-pointer group relative overflow-hidden z-10"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs font-bold rounded-bl-lg">
              TERA
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-orange-200 via-red-200 to-orange-200 bg-clip-text text-transparent">TERA Analytics</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">
              Advanced toxic exposure risk assessment platform with comprehensive PACT Act analysis and veteran health insights.
            </p>
            <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
              <li className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full flex-shrink-0"></span>
                <span>Burn pit exposure analysis</span>
              </li>
              <li className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full flex-shrink-0"></span>
                <span>Agent Orange risk assessment</span>
              </li>
              <li className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full flex-shrink-0"></span>
                <span>PACT Act eligibility screening</span>
              </li>
              <li className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full flex-shrink-0"></span>
                <span>Comprehensive reporting tools</span>
              </li>
            </ul>
            <div className="flex items-center gap-2 text-orange-400 group-hover:text-orange-300 transition-colors">
              <span className="text-xs sm:text-sm font-semibold">Launch TERA Analytics</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.div>

        {/* Features Bar */}
        <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-gray-800/30 backdrop-blur-md rounded-xl border border-gray-700">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-cyan-400">95%</p>
              <p className="text-xs sm:text-sm text-gray-500">Accuracy Rate</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-blue-400">30s</p>
              <p className="text-xs sm:text-sm text-gray-500">Avg Processing</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-purple-400">100+</p>
              <p className="text-xs sm:text-sm text-gray-500">Concurrent Claims</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-green-400">24/7</p>
              <p className="text-xs sm:text-sm text-gray-500">Availability</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}