'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, User, AlertTriangle, AlertCircle, FileText, Calendar, TrendingUp, Search,
  ChevronRight, BarChart3, Target, Clock, Database, Shield, Brain, Stethoscope,
  ClipboardCheck, LineChart, Info, Download, CheckCircle, Filter, RefreshCw, Heart,
  Microscope, Pill, ThermometerSun, Zap, BookOpen, Link2, MessageSquare, Share2,
  Printer, Mail, Sparkles, TrendingDown, AlertOctagon, Award, Beaker, BrainCircuit,
  HeartPulse, Layers, Network, Workflow, ChevronDown, ChevronUp, ExternalLink,
  TestTube, ArrowRight, PlayCircle, PauseCircle, CheckSquare, XCircle, Copy,
  CheckCheck, Settings, HelpCircle, Lightbulb, GitBranch, ArrowUpRight, ArrowDownRight,
  Gauge, Menu, X, Bell, Sun, Moon, Home, Users, FileSearch, CreditCard, LogOut,
  MoreVertical, Eye, EyeOff, Lock, Unlock, Hash, DollarSign, Percent, TrendingUp as TrendUp
} from 'lucide-react';
import { mockFetchVeterans } from '../../lib/henry/mock-data';
import { Veteran } from '../../types';
import { generateVeteranDetails } from '../../lib/henry/veteran-details';
import { generateVeteranProfileEnhanced, VeteranProfileEnhanced } from '../../lib/henry/veteran-profile-enhanced';
import { generatePersonalizedAIInsights } from '../../lib/henry/ai-insights-generator';
import { TooltipModal } from '../../components/hvec/TooltipModal';
import { generateClinicalAssessment, ClinicalAssessment } from '../../lib/henry/clinical-assessment-generator';
import { 
  InflammatoryTrendChart, 
  JointAssessmentRadar, 
  DiseaseActivityGauge,
  MedicationAdherenceChart,
  FunctionalAssessmentChart,
  ComorbidityNetwork
} from '../../components/hvec/ClinicalCharts';
import { 
  ClinicalTimeline, 
  MilitaryServiceTimeline 
} from '../../components/hvec/ClinicalTimeline';
import {
  RiskPredictionDashboard,
  CascadeRiskAnalysis,
  PredictiveHealthScore
} from '../../components/hvec/RiskPredictionModels';
import { DiagnosticsAdvanced } from '../../components/hvec/DiagnosticsAdvanced';
import { AIInsightsEnhanced } from '../../components/hvec/AIInsightsEnhanced';
import { motion, AnimatePresence } from 'framer-motion';

// Medical Reference Links with actual URLs
const MEDICAL_REFERENCES = {
  acr: {
    title: 'ACR Guidelines',
    icon: ExternalLink,
    links: [
      { text: 'Rheumatoid Arthritis Management 2021', url: 'https://www.rheumatology.org/Practice-Quality/Clinical-Support/Clinical-Practice-Guidelines/Rheumatoid-Arthritis' },
      { text: 'Lupus Nephritis Guidelines', url: 'https://www.rheumatology.org/Practice-Quality/Clinical-Support/Clinical-Practice-Guidelines/Lupus-Nephritis' },
      { text: 'Vasculitis Treatment Protocol', url: 'https://www.rheumatology.org/Practice-Quality/Clinical-Support/Clinical-Practice-Guidelines/Vasculitis' },
      { text: 'Osteoarthritis Clinical Practice', url: 'https://www.rheumatology.org/Practice-Quality/Clinical-Support/Clinical-Practice-Guidelines/Osteoarthritis' }
    ]
  },
  va: {
    title: 'VA Clinical Resources',
    icon: BookOpen,
    links: [
      { text: 'VA/DoD Clinical Practice Guidelines', url: 'https://www.healthquality.va.gov/guidelines/MH/ptsd/' },
      { text: 'VASRD Rating Schedule', url: 'https://www.ecfr.gov/current/title-38/chapter-I/part-4' },
      { text: 'M21-1 Adjudication Manual', url: 'https://www.knowva.ebenefits.va.gov/system/templates/selfservice/va_ssnew/help/customer/locale/en-US/portal/554400000001018' },
      { text: 'BVA Decision Database', url: 'https://www.index.va.gov/search/va/bva.jsp' }
    ]
  },
  diagnostic: {
    title: 'Diagnostic Tools',
    icon: TestTube,
    links: [
      { text: 'DAS28 Calculator', url: 'https://www.das-score.nl/das28/DAScalculators/dasculators.html' },
      { text: 'SLEDAI-2K Score', url: 'https://qxmd.com/calculate/calculator_335/sledai-2k' },
      { text: 'ACR/EULAR Criteria', url: 'https://www.rheumatology.org/Practice-Quality/Clinical-Support/Criteria' },
      { text: 'HAQ-DI Assessment', url: 'https://www.mdcalc.com/calc/2176/health-assessment-questionnaire-disability-index-haq-di' }
    ]
  },
  literature: {
    title: 'Medical Literature',
    icon: FileText,
    links: [
      { text: 'PubMed Central', url: 'https://www.ncbi.nlm.nih.gov/pmc/' },
      { text: 'UpToDate', url: 'https://www.uptodate.com/contents/table-of-contents/rheumatology' },
      { text: 'Cochrane Reviews', url: 'https://www.cochranelibrary.com/cdsr/reviews' },
      { text: 'NEJM Journal Watch', url: 'https://www.jwatch.org/rheumatology' }
    ]
  }
};

// Enhanced search filters
interface SearchFilters {
  specialty: string;
  riskLevel: string;
  claimStatus: string;
  disabilityRange: string;
  branch: string;
  combatService: string;
  sortBy: string;
}

export default function HVECEnhanced() {
  const [veterans, setVeterans] = useState<Veteran[]>([]);
  const [selectedVeteran, setSelectedVeteran] = useState<Veteran | null>(null);
  const [veteranDetails, setVeteranDetails] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'assessment' | 'history' | 'diagnostics' | 'insights' | 'documentation' | 'collaboration'>('assessment');
  const [dataLoading, setDataLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [currentAssessment, setCurrentAssessment] = useState<ClinicalAssessment | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('hvec-welcome-shown');
    }
    return false;
  });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notifications] = useState([
    { id: 1, message: 'New VA rating decision available', time: '2 hours ago', type: 'success' },
    { id: 2, message: 'Clinical review required for 3 veterans', time: '5 hours ago', type: 'warning' },
    { id: 3, message: 'System maintenance scheduled', time: '1 day ago', type: 'info' }
  ]);
  
  const [filters, setFilters] = useState<SearchFilters>({
    specialty: 'all',
    riskLevel: 'all',
    claimStatus: 'all',
    disabilityRange: 'all',
    branch: 'all',
    combatService: 'all',
    sortBy: 'name'
  });

  // Tooltip content for various features
  const tooltips = {
    riskScore: "AI-calculated risk score based on multiple health factors including disability rating, claim history, and service-connected conditions.",
    syncStatus: "Real-time synchronization status with VA databases. Green indicates successful sync within last 24 hours.",
    cascadeRisk: "Predictive model identifying potential for cascading health events based on condition combinations.",
    serviceConnection: "Probability of establishing service connection based on medical evidence and VA precedent cases."
  };

  // Load veterans data
  useEffect(() => {
    const loadVeterans = async () => {
      setDataLoading(true);
      try {
        const response = await mockFetchVeterans();
        setVeterans(response.data);
      } catch (error) {
        console.error('Failed to load veterans:', error);
      } finally {
        setDataLoading(false);
      }
    };
    loadVeterans();
  }, []);

  // Handle welcome modal dismissal
  const handleCloseWelcome = () => {
    setShowWelcomeModal(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hvec-welcome-shown', 'true');
    }
  };

  // Generate details when veteran is selected
  useEffect(() => {
    if (selectedVeteran) {
      const details = generateVeteranDetails(selectedVeteran);
      setVeteranDetails(details);
      
      // Generate personalized AI insights
      const insights = generatePersonalizedAIInsights(selectedVeteran);
      setAiInsights(insights);
      
      // Generate clinical assessment
      const assessment = generateClinicalAssessment(selectedVeteran);
      setCurrentAssessment(assessment);
    }
  }, [selectedVeteran]);

  // Enhanced filtering logic
  const filteredVeterans = useMemo(() => {
    let result = veterans.filter(veteran => {
      // Search query
      if (searchQuery && !veteran.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !veteran.edipi?.includes(searchQuery)) {
        return false;
      }
      
      // Branch filter
      if (filters.branch !== 'all' && veteran.branch !== filters.branch) {
        return false;
      }
      
      // Combat service filter
      if (filters.combatService !== 'all') {
        const hasCombat = veteran.combatService;
        if (filters.combatService === 'yes' && !hasCombat) return false;
        if (filters.combatService === 'no' && hasCombat) return false;
      }
      
      // Disability range filter
      if (filters.disabilityRange !== 'all') {
        const rating = veteran.disabilityRating;
        switch(filters.disabilityRange) {
          case '0-30': if (rating > 30) return false; break;
          case '40-60': if (rating < 40 || rating > 60) return false; break;
          case '70-90': if (rating < 70 || rating > 90) return false; break;
          case '100': if (rating !== 100) return false; break;
        }
      }
      
      // Claim status filter
      if (filters.claimStatus !== 'all' && veteran.claims) {
        const hasStatus = veteran.claims.some(c => c.status === filters.claimStatus);
        if (!hasStatus) return false;
      }
      
      return true;
    });
    
    // Sort results
    result.sort((a, b) => {
      switch(filters.sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'rating': return (b.disabilityRating || 0) - (a.disabilityRating || 0);
        case 'recent': return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'risk': return (b.riskScore || 0) - (a.riskScore || 0);
        default: return 0;
      }
    });
    
    return result;
  }, [veterans, searchQuery, filters]);

  // Modal component for detailed views
  const [modalContent, setModalContent] = useState<{ title: string; content: React.ReactNode } | null>(null);

  const openModal = (title: string, content: React.ReactNode) => {
    setModalContent({ title, content });
  };

  const closeModal = () => {
    setModalContent(null);
  };

  // Export functionality
  const handleExport = (format: 'pdf' | 'csv' | 'email') => {
    const exportData = {
      veteran: selectedVeteran,
      details: veteranDetails,
      insights: aiInsights,
      timestamp: new Date().toISOString()
    };
    
    switch(format) {
      case 'pdf':
        console.log('Exporting to PDF:', exportData);
        alert('PDF export initiated. Document will be downloaded shortly.');
        break;
      case 'csv':
        console.log('Exporting to CSV:', exportData);
        alert('CSV export initiated. File will be downloaded shortly.');
        break;
      case 'email':
        const subject = `HVEC Report - ${selectedVeteran?.name}`;
        const body = `Clinical report for ${selectedVeteran?.name} generated on ${new Date().toLocaleDateString()}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        break;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-gray-50 dark:bg-gray-900`}>
      {/* Premium Header with HENRY Branding */}
      <header className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 shadow-2xl border-b border-blue-800/30">
        {/* Subtle animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-600/5 to-transparent animate-pulse" />
        
        <div className="relative z-10">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Left Section: Logo and Brand */}
              <div className="flex items-center gap-4">
                {/* Mobile Menu Toggle */}
                <button 
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="lg:hidden p-2.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 backdrop-blur-sm"
                >
                  {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                
                {/* Brand Identity */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 blur-xl opacity-50 rounded-full" />
                    <div className="relative p-3 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl backdrop-blur-xl border border-white/10">
                      <HeartPulse className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold text-white tracking-tight">HENRY</h1>
                      <span className="text-xs font-semibold px-2 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full uppercase tracking-wider">
                        HVEC
                      </span>
                    </div>
                    <p className="text-xs text-blue-200/80 font-medium mt-0.5">Veterans Enhanced Care System</p>
                  </div>
                </div>
              </div>
              
              {/* Center Section: Main Navigation */}
              <nav className="hidden lg:flex items-center gap-1 bg-white/5 backdrop-blur-sm rounded-2xl p-1.5">
                <a href="/hvec" className="flex items-center gap-2 px-4 py-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group">
                  <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Dashboard</span>
                </a>
                <a href="/henry" className="flex items-center gap-2 px-4 py-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group">
                  <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Veterans</span>
                </a>
                <a href="/va-claims-ai" className="flex items-center gap-2 px-4 py-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group">
                  <FileSearch className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Claims</span>
                </a>
                <a href="#" className="flex items-center gap-2 px-4 py-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group">
                  <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Benefits</span>
                </a>
                <a href="#" className="flex items-center gap-2 px-4 py-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group">
                  <Brain className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">AI Insights</span>
                </a>
              </nav>
              
              {/* Right Section: Actions and User Menu */}
              <div className="flex items-center gap-2">
                {/* Quick Actions */}
                <button
                  onClick={() => setShowWelcomeModal(true)}
                  className="hidden lg:flex items-center gap-2 px-3 py-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Help</span>
                </button>
                
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                  >
                    <Bell className="w-5 h-5" />
                    {notifications.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    )}
                  </button>
                  
                  {showNotifications && (
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 z-50"
                      >
                        <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                            <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full">
                              {notifications.length} new
                            </span>
                          </div>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.map((notif) => (
                            <div key={notif.id} className="p-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${
                                  notif.type === 'success' ? 'bg-green-100 dark:bg-green-900/50' :
                                  notif.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/50' :
                                  'bg-blue-100 dark:bg-blue-900/50'
                                }`}>
                                  {notif.type === 'success' ? <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" /> :
                                   notif.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" /> :
                                   <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-gray-900 dark:text-white">{notif.message}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notif.time}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-3 border-t border-gray-200/50 dark:border-gray-700/50">
                          <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                            View all notifications
                          </button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
                
                {/* Theme Toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 px-3 py-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-xl transition-all duration-200 border border-white/10"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-xs text-blue-200/80">Welcome back</p>
                      <p className="text-sm text-white font-semibold">Dr. Smith</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-blue-200/70 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showUserMenu && (
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 z-50"
                      >
                        <div className="p-2">
                          <a href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
                            <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Profile</span>
                          </a>
                          <a href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
                            <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Settings</span>
                          </a>
                          <a href="#" className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
                            <Shield className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Security</span>
                          </a>
                          <hr className="my-2 border-gray-200/50 dark:border-gray-700/50" />
                          <button className="flex items-center gap-3 px-3 py-2 w-full hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                            <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                            <span className="text-sm text-red-600 dark:text-red-400">Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-blue-800/30 bg-slate-900/95 backdrop-blur-xl"
            >
              <nav className="px-4 py-4 space-y-1">
                <a href="/hvec" className="flex items-center gap-3 px-4 py-3 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200">
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Dashboard</span>
                </a>
                <a href="/henry" className="flex items-center gap-3 px-4 py-3 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Veterans</span>
                </a>
                <a href="/va-claims-ai" className="flex items-center gap-3 px-4 py-3 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200">
                  <FileSearch className="w-5 h-5" />
                  <span className="font-medium">Claims</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Benefits</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200">
                  <Brain className="w-5 h-5" />
                  <span className="font-medium">AI Insights</span>
                </a>
                <hr className="border-blue-800/30" />
                <button
                  onClick={() => setShowWelcomeModal(true)}
                  className="flex items-center gap-3 px-4 py-3 w-full text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                >
                  <HelpCircle className="w-5 h-5" />
                  <span className="font-medium">Help & Tutorial</span>
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Welcome Modal */}
      <AnimatePresence>
        {showWelcomeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseWelcome}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header with Gradient */}
              <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-8 py-12">
                <button
                  onClick={handleCloseWelcome}
                  className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <HeartPulse className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Welcome to HENRY HVEC</h2>
                    <p className="text-blue-100 mt-1">Your Advanced Veterans Healthcare Command Center</p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-6">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                    Version 2.0
                  </span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                    AI-Powered
                  </span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                    HIPAA Compliant
                  </span>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">AI-Powered Insights</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Advanced machine learning algorithms analyze patient data to provide predictive diagnostics and treatment recommendations.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">VA Benefits Integration</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Seamlessly connects with VA systems to track claims, benefits, and disability ratings in real-time.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <Microscope className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Advanced Diagnostics</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ACR/EULAR classification criteria and comprehensive lab analysis for accurate clinical assessment.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Predictive Analytics</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Risk stratification and disease progression modeling to prevent cascading health events.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Quick Start Guide */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    Quick Start Guide
                  </h3>
                  <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex gap-2">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">1.</span>
                      Select a veteran from the patient list or use the search function
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">2.</span>
                      Review their comprehensive clinical assessment and AI insights
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">3.</span>
                      Navigate tabs to access diagnostics, history, and documentation
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">4.</span>
                      Use the export feature to generate reports for VA claims
                    </li>
                  </ol>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      handleCloseWelcome();
                      window.open('https://github.com/yourusername/henry-hvec/wiki', '_blank');
                    }}
                    className="px-5 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all font-medium"
                  >
                    View Documentation
                  </button>
                  <button
                    onClick={handleCloseWelcome}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area with Enhanced Scaling */}
      <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Page Title and Stats */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Veterans Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Comprehensive clinical management and AI-powered insights</p>
              </div>
              <div className="flex gap-3">
                <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Veterans</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{veterans.length}</p>
                </div>
                <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active Cases</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {veterans.filter(v => v.claims?.some(c => c.status === 'PENDING')).length}
                  </p>
                </div>
                <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">High Risk</p>
                  <p className="text-xl font-bold text-red-600 dark:text-red-400">
                    {veterans.filter(v => v.riskScore && v.riskScore > 70).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Enhanced Patient Selection Panel */}
            <div className="xl:col-span-3">
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
                {/* Search and Filter Header */}
                <div className="p-5 border-b border-gray-200/50 dark:border-gray-700/50">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    Patient Registry
                    <TooltipModal
                      title="Patient Selection Help"
                      content="Search and filter veterans by various criteria. Click on a patient to view their detailed clinical information."
                      triggerText="Learn more about patient selection"
                    />
                  </h2>
                
                {/* Enhanced Search */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search name or EDIPI..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Filter className="w-4 h-4" />
                    Advanced Filters
                  </span>
                  {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Advanced Filters */}
              {showFilters && (
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Branch</label>
                    <select
                      value={filters.branch}
                      onChange={(e) => setFilters({...filters, branch: e.target.value})}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    >
                      <option value="all">All Branches</option>
                      <option value="ARMY">Army</option>
                      <option value="NAVY">Navy</option>
                      <option value="AIR_FORCE">Air Force</option>
                      <option value="MARINES">Marines</option>
                      <option value="COAST_GUARD">Coast Guard</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Disability Rating</label>
                    <select
                      value={filters.disabilityRange}
                      onChange={(e) => setFilters({...filters, disabilityRange: e.target.value})}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    >
                      <option value="all">All Ratings</option>
                      <option value="0-30">0-30%</option>
                      <option value="40-60">40-60%</option>
                      <option value="70-90">70-90%</option>
                      <option value="100">100%</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Combat Service</label>
                    <select
                      value={filters.combatService}
                      onChange={(e) => setFilters({...filters, combatService: e.target.value})}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    >
                      <option value="all">All Veterans</option>
                      <option value="yes">Combat Veterans</option>
                      <option value="no">Non-Combat</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    >
                      <option value="name">Name</option>
                      <option value="rating">Disability Rating</option>
                      <option value="recent">Recently Updated</option>
                      <option value="risk">Risk Score</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Patient List with Enhanced Styling */}
              <div className="max-h-[calc(100vh-24rem)] overflow-y-auto custom-scrollbar">
                {dataLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
                      <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 dark:border-blue-400 rounded-full animate-spin border-t-transparent"></div>
                    </div>
                    <span className="mt-3 text-sm text-gray-500 dark:text-gray-400">Loading veterans...</span>
                  </div>
                ) : filteredVeterans.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No veterans found</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try adjusting your filters</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setFilters({
                          specialty: 'all',
                          riskLevel: 'all',
                          claimStatus: 'all',
                          disabilityRange: 'all',
                          branch: 'all',
                          combatService: 'all',
                          sortBy: 'name'
                        });
                      }}
                      className="mt-4 px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 p-2">
                    {filteredVeterans.map(veteran => {
                      const riskColor = veteran.riskScore && veteran.riskScore > 70 ? 'red' :
                                       veteran.riskScore && veteran.riskScore > 40 ? 'yellow' : 'green';
                      
                      return (
                        <motion.button
                          key={veteran.id}
                          onClick={() => setSelectedVeteran(veteran)}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className={`w-full text-left p-4 rounded-xl transition-all ${
                            selectedVeteran?.id === veteran.id
                              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 ring-2 ring-blue-500 shadow-lg'
                              : 'bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold">
                                {veteran.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 dark:text-white">
                                  {veteran.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {veteran.edipi}
                                </div>
                              </div>
                            </div>
                            {veteran.riskScore && (
                              <div className={`w-2 h-2 rounded-full animate-pulse ${
                                riskColor === 'red' ? 'bg-red-500' :
                                riskColor === 'yellow' ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`} />
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs">
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md">
                              {veteran.branch}
                            </span>
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-md font-medium">
                              {veteran.disabilityRating}%
                            </span>
                            {veteran.combatService && (
                              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-md">
                                Combat
                              </span>
                            )}
                            {veteran.claims && veteran.claims.length > 0 && (
                              <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded-md">
                                {veteran.claims.length} claims
                              </span>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>
              
              {/* List Summary */}
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Showing {filteredVeterans.length} of {veterans.length} veterans
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Area with Enhanced Production Styling */}
          <div className="xl:col-span-9">
            {selectedVeteran ? (
              <>
                {/* Premium Patient Header Card */}
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden mb-6">
                  <div className="bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Patient Info */}
                    <div className="lg:col-span-2">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            {selectedVeteran.name}
                          </h2>
                          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <span>{selectedVeteran.branch}</span>
                            <span>•</span>
                            <span>EDIPI: {selectedVeteran.edipi}</span>
                            <span>•</span>
                            <span>DOB: {new Date(selectedVeteran.dateOfBirth).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => openModal('Patient Details', (
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2">Service Information</h4>
                                <dl className="grid grid-cols-2 gap-2 text-sm">
                                  <dt className="text-gray-500">Service Period:</dt>
                                  <dd>{new Date(selectedVeteran.serviceStartDate).getFullYear()} - {selectedVeteran.serviceEndDate ? new Date(selectedVeteran.serviceEndDate).getFullYear() : 'Present'}</dd>
                                  <dt className="text-gray-500">Discharge Status:</dt>
                                  <dd>{selectedVeteran.dischargeStatus}</dd>
                                  <dt className="text-gray-500">Combat Service:</dt>
                                  <dd>{selectedVeteran.combatService ? 'Yes' : 'No'}</dd>
                                </dl>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Benefits</h4>
                                <dl className="grid grid-cols-2 gap-2 text-sm">
                                  <dt className="text-gray-500">Disability Rating:</dt>
                                  <dd>{selectedVeteran.disabilityRating}%</dd>
                                  <dt className="text-gray-500">Monthly Compensation:</dt>
                                  <dd>${selectedVeteran.monthlyCompensation}</dd>
                                  <dt className="text-gray-500">Healthcare Enrolled:</dt>
                                  <dd>{selectedVeteran.enrolledVaHealthcare ? 'Yes' : 'No'}</dd>
                                </dl>
                              </div>
                            </div>
                          ))}
                          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {/* Key Metrics */}
                      <div className="grid grid-cols-4 gap-3">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2 mb-1">
                            <Percent className="w-4 h-4 text-blue-500" />
                            <span className="text-xs text-gray-500">VA Rating</span>
                          </div>
                          <div className="text-xl font-bold text-gray-900 dark:text-white">
                            {selectedVeteran.disabilityRating}%
                          </div>
                          <div className="text-xs text-gray-400">
                            {selectedVeteran.disabilityRating >= 70 ? 'TDIU Eligible' : 
                             selectedVeteran.disabilityRating >= 30 ? 'Healthcare Priority' : 'Standard'}
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2 mb-1">
                            <Heart className="w-4 h-4 text-red-500" />
                            <span className="text-xs text-gray-500">Conditions</span>
                          </div>
                          <div className="text-xl font-bold text-gray-900 dark:text-white">
                            {veteranDetails?.conditions?.length || selectedVeteran.claims?.filter(c => c.status === 'APPROVED').length || 0}
                          </div>
                          <div className="text-xs text-gray-400">
                            Service Connected
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-purple-500" />
                            <span className="text-xs text-gray-500">Service</span>
                          </div>
                          <div className="text-xl font-bold text-gray-900 dark:text-white">
                            {(() => {
                              const start = new Date(selectedVeteran.serviceStartDate).getFullYear();
                              const end = selectedVeteran.serviceEndDate ? new Date(selectedVeteran.serviceEndDate).getFullYear() : new Date().getFullYear();
                              return end - start;
                            })()} yrs
                          </div>
                          <div className="text-xs text-gray-400">
                            {selectedVeteran.combatService ? 'Combat' : 'Non-Combat'}
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2 mb-1">
                            <Activity className="w-4 h-4 text-green-500" />
                            <span className="text-xs text-gray-500">Health Score</span>
                            <TooltipModal
                              title="Health Score"
                              content="Composite score based on conditions, treatments, and health metrics"
                            />
                          </div>
                          <div className="text-xl font-bold text-gray-900 dark:text-white">
                            {Math.max(30, 100 - selectedVeteran.disabilityRating)}
                          </div>
                          <div className="text-xs text-gray-400">
                            {selectedVeteran.disabilityRating >= 70 ? 'Needs Support' : 'Stable'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* AI Quick Insights */}
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                      <div className="flex items-center gap-2 mb-3">
                        <BrainCircuit className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <h3 className="font-semibold text-purple-900 dark:text-purple-100">AI Quick Insights</h3>
                      </div>
                      {aiInsights && aiInsights.insights.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-sm text-purple-700 dark:text-purple-300">
                            <span className="font-medium">Primary Risk:</span> {aiInsights.insights[0].title}
                          </div>
                          <div className="text-sm text-purple-700 dark:text-purple-300">
                            <span className="font-medium">Confidence:</span> {(aiInsights.insights[0].confidence * 100).toFixed(0)}%
                          </div>
                          <button
                            onClick={() => setActiveTab('insights')}
                            className="mt-2 text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 underline"
                          >
                            View Full Analysis →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  </div>
                </div>

                {/* Enhanced Tab Navigation */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
                  <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex -mb-px">
                      {[
                        { id: 'assessment', label: 'Clinical Assessment', icon: ClipboardCheck },
                        { id: 'history', label: 'Medical History', icon: Clock },
                        { id: 'diagnostics', label: 'Diagnostics', icon: Microscope },
                        { id: 'insights', label: 'AI Insights', icon: Brain },
                        { id: 'documentation', label: 'Documentation', icon: FileText },
                        { id: 'collaboration', label: 'Collaborate', icon: Network }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === tab.id
                              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                          }`}
                        >
                          <tab.icon className="w-4 h-4" />
                          <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                      ))}
                    </nav>
                  </div>

                  <div className="p-6">
                    {/* Clinical Assessment Tab */}
                    {activeTab === 'assessment' && currentAssessment && (
                      <div className="space-y-6">
                        {/* Chief Complaint */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Chief Complaint
                          </h3>
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <p className="text-gray-700 dark:text-gray-300">
                              {currentAssessment.chiefComplaint}
                            </p>
                          </div>
                        </div>

                        {/* Joint Involvement */}
                        {currentAssessment.jointInvolvement && (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                              Joint Involvement Analysis
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pattern</div>
                                <div className="font-medium text-gray-900 dark:text-white capitalize">
                                  {currentAssessment.jointInvolvement.pattern}
                                </div>
                              </div>
                              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Distribution</div>
                                <div className="font-medium text-gray-900 dark:text-white capitalize">
                                  {currentAssessment.jointInvolvement.distribution}
                                </div>
                              </div>
                              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Duration</div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {currentAssessment.jointInvolvement.duration}
                                </div>
                              </div>
                              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Affected Joints</div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {currentAssessment.jointInvolvement.joints.join(', ')}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Differential Diagnosis */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Differential Diagnosis
                          </h3>
                          <div className="space-y-4">
                            {currentAssessment.differentialDiagnosis.map((diagnosis, idx) => (
                              <div key={idx} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                      {diagnosis.condition}
                                    </h4>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      ICD-10: {diagnosis.icd10}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Probability</div>
                                    <div className="font-semibold text-lg text-blue-600 dark:text-blue-400">
                                      {(diagnosis.probability * 100).toFixed(0)}%
                                    </div>
                                  </div>
                                </div>

                                {/* Evidence */}
                                <div className="grid grid-cols-2 gap-4 mb-3">
                                  <div>
                                    <div className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">
                                      Supporting Evidence
                                    </div>
                                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                      {diagnosis.supportingEvidence.map((evidence, i) => (
                                        <li key={i} className="flex items-start gap-1">
                                          <span className="text-green-500 mt-1">•</span>
                                          {evidence}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  {diagnosis.conflictingEvidence.length > 0 && (
                                    <div>
                                      <div className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">
                                        Conflicting Evidence
                                      </div>
                                      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                        {diagnosis.conflictingEvidence.map((evidence, i) => (
                                          <li key={i} className="flex items-start gap-1">
                                            <span className="text-red-500 mt-1">•</span>
                                            {evidence}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>

                                {/* Recommended Tests */}
                                <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Recommended Tests
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {diagnosis.recommendedTests.map((test, i) => (
                                      <span key={i} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                        {test}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Clinical Recommendations */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Clinical Decision Support
                          </h3>
                          <div className="space-y-3">
                            {currentAssessment.clinicalDecisionSupport.map((rec, idx) => (
                              <div key={idx} className={`border rounded-lg p-4 ${
                                rec.priority === 'immediate' 
                                  ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20'
                                  : rec.priority === 'urgent'
                                  ? 'border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/20'
                                  : 'border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700'
                              }`}>
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                      rec.priority === 'immediate'
                                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                        : rec.priority === 'urgent'
                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                                    }`}>
                                      {rec.priority}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {rec.category}
                                    </span>
                                  </div>
                                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                    Evidence Level: {rec.evidenceLevel}
                                  </span>
                                </div>
                                <div className="font-medium text-gray-900 dark:text-white mb-1">
                                  {rec.recommendation}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                  {rec.rationale}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Medical History Tab */}
                    {activeTab === 'history' && veteranDetails && (
                      <div className="space-y-6">
                        {/* Service History */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Military Service History
                          </h3>
                          <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                            <dl className="grid grid-cols-2 gap-4">
                              <div>
                                <dt className="text-sm text-gray-500 dark:text-gray-400">Branch</dt>
                                <dd className="mt-1 font-medium text-gray-900 dark:text-white">{selectedVeteran.branch}</dd>
                              </div>
                              <div>
                                <dt className="text-sm text-gray-500 dark:text-gray-400">Service Period</dt>
                                <dd className="mt-1 font-medium text-gray-900 dark:text-white">
                                  {new Date(selectedVeteran.serviceStartDate).getFullYear()} - {selectedVeteran.serviceEndDate ? new Date(selectedVeteran.serviceEndDate).getFullYear() : 'Present'}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-sm text-gray-500 dark:text-gray-400">Discharge Status</dt>
                                <dd className="mt-1 font-medium text-gray-900 dark:text-white">{selectedVeteran.dischargeStatus}</dd>
                              </div>
                              <div>
                                <dt className="text-sm text-gray-500 dark:text-gray-400">Combat Service</dt>
                                <dd className="mt-1 font-medium text-gray-900 dark:text-white">{selectedVeteran.combatService ? 'Yes' : 'No'}</dd>
                              </div>
                            </dl>
                          </div>
                        </div>

                        {/* Medical Conditions */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Service-Connected Conditions
                          </h3>
                          <div className="space-y-3">
                            {selectedVeteran.claims?.map((claim, idx) => (
                              <div key={idx} className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                      {claim.description || claim.type}
                                    </h4>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                      Filed: {new Date(claim.filingDate).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {claim.rating && (
                                      <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                        {claim.rating}%
                                      </span>
                                    )}
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                      claim.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                      claim.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                      claim.status === 'DENIED' ? 'bg-red-100 text-red-700' :
                                      'bg-gray-100 text-gray-700'
                                    }`}>
                                      {claim.status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Medications */}
                        {veteranDetails?.mpd?.medications && (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                              Current Medications
                            </h3>
                            <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                              <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-600">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Medication</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Dosage</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Prescribed By</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                  {veteranDetails.mpd.medications.map((med: any, idx: number) => (
                                    <tr key={idx}>
                                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{med.name}</td>
                                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{med.dosage} - {med.frequency}</td>
                                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{med.prescribedBy}</td>
                                      <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                          med.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                          {med.status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Enhanced Diagnostics Tab */}
                    {activeTab === 'diagnostics' && selectedVeteran && currentAssessment && (
                      <DiagnosticsAdvanced 
                        veteran={selectedVeteran}
                        assessment={currentAssessment}
                      />
                    )}
                    
                    {/* Enhanced AI Insights Tab */}
                    {activeTab === 'insights' && selectedVeteran && aiInsights && (
                      <AIInsightsEnhanced 
                        veteran={selectedVeteran}
                        insights={aiInsights}
                      />
                    )}
                    
                    {/* Enhanced Documentation Tab with Working Links */}
                    {activeTab === 'documentation' && (
                      <div className="space-y-6">
                        {/* Medical Reference Links */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Medical Guidelines & References
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(MEDICAL_REFERENCES).map(([key, section]) => (
                              <div key={key} className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                  <section.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                  {section.title}
                                </h4>
                                <div className="space-y-2">
                                  {section.links.map((link, idx) => (
                                    <a
                                      key={idx}
                                      href={link.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline flex items-center gap-1"
                                    >
                                      • {link.text}
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Enhanced Collaboration Tab */}
                    {activeTab === 'collaboration' && (
                      <div className="space-y-6">
                        {/* Team Collaboration */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Team Collaboration
                          </h3>
                          
                          {/* Active Collaborators */}
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-4 border border-green-200 dark:border-green-700">
                            <h4 className="font-medium text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              Active Team Members
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {['Dr. Johnson (Primary)', 'Dr. Lee (Rheumatology)', 'Dr. Patel (Neurology)', 'RN Smith'].map(member => (
                                <div key={member} className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-2">
                                  <div className="w-8 h-8 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-green-700 dark:text-green-300" />
                                  </div>
                                  <span className="text-xs text-gray-700 dark:text-gray-300">{member}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Collaboration Actions */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <button
                              onClick={() => alert('Opening secure messaging...')}
                              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                            >
                              <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              <div className="text-left">
                                <div className="font-medium text-sm text-gray-900 dark:text-white">Start Discussion</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Open secure chat</div>
                              </div>
                            </button>
                            
                            <button
                              onClick={() => alert('Scheduling consultation...')}
                              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 transition-colors"
                            >
                              <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                              <div className="text-left">
                                <div className="font-medium text-sm text-gray-900 dark:text-white">Schedule Consult</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Book team meeting</div>
                              </div>
                            </button>
                            
                            <button
                              onClick={() => alert('Creating referral...')}
                              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
                            >
                              <Share2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                              <div className="text-left">
                                <div className="font-medium text-sm text-gray-900 dark:text-white">Make Referral</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Refer to specialist</div>
                              </div>
                            </button>
                          </div>
                        </div>
                        
                        {/* Export and Sharing */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Export & Share Reports
                          </h3>
                          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <button
                                onClick={() => handleExport('pdf')}
                                className="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                              >
                                <Download className="w-6 h-6 text-red-600" />
                                <span className="text-sm font-medium">PDF Report</span>
                                <span className="text-xs text-gray-500">Full clinical summary</span>
                              </button>
                              
                              <button
                                onClick={() => window.print()}
                                className="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                              >
                                <Printer className="w-6 h-6 text-blue-600" />
                                <span className="text-sm font-medium">Print</span>
                                <span className="text-xs text-gray-500">Send to printer</span>
                              </button>
                              
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(window.location.href);
                                  alert('Link copied to clipboard!');
                                }}
                                className="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                              >
                                <Copy className="w-6 h-6 text-green-600" />
                                <span className="text-sm font-medium">Copy Link</span>
                                <span className="text-xs text-gray-500">Share access</span>
                              </button>
                              
                              <button
                                onClick={() => handleExport('email')}
                                className="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                              >
                                <Mail className="w-6 h-6 text-purple-600" />
                                <span className="text-sm font-medium">Email</span>
                                <span className="text-xs text-gray-500">Send via email</span>
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Recent Activity */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Recent Collaboration Activity
                          </h3>
                          <div className="space-y-3">
                            {[
                              { user: 'Dr. Johnson', action: 'Updated clinical notes', time: '2 hours ago', icon: FileText },
                              { user: 'Dr. Lee', action: 'Added lab results', time: '5 hours ago', icon: Beaker },
                              { user: 'RN Smith', action: 'Scheduled follow-up', time: '1 day ago', icon: Calendar },
                              { user: 'Dr. Patel', action: 'Reviewed imaging', time: '2 days ago', icon: Eye }
                            ].map((activity, idx) => (
                              <div key={idx} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                  <activity.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium text-sm text-gray-900 dark:text-white">{activity.user}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{activity.action}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
                <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Select a Patient to Begin
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Choose a patient from the list to access their clinical assessment and decision support tools.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
      
      {/* Modal */}
      {modalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{modalContent.title}</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-8rem)]">
              {modalContent.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}