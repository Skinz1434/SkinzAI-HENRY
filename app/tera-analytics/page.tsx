'use client';

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, Users, FileText, TrendingUp, Clock, Shield, 
  Brain, Activity, Target, ArrowRight, Filter, Search, Download,
  RefreshCw, Eye, MoreVertical, Calendar, Globe, Database,
  Zap, Heart, Award, Gauge, Info, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockFetchVeterans } from '@/lib/henry/mock-data';
import { Veteran } from '@/types';
import { generateVeteranProfileEnhanced, VeteranProfileEnhanced } from '@/lib/henry/veteran-profile-enhanced';
import { generateVeteranDetails } from '@/lib/henry/veteran-details';
import AnalyticsInsightsEnhanced from '@/components/profile-tabs/AnalyticsInsightsEnhanced';
import AnimatedParticles from '@/components/ui/AnimatedParticles';
import GradientOrbs from '@/components/ui/GradientOrbs';

export default function TERAAnalyticsPage() {
  const [veterans, setVeterans] = useState<Veteran[]>([]);
  const [selectedVeteran, setSelectedVeteran] = useState<VeteranProfileEnhanced | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showVeteranModal, setShowVeteranModal] = useState(false);

  // Load veterans data
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await mockFetchVeterans(1, 50);
        setVeterans(result.data);
      } catch (error) {
        console.error('Failed to load veterans:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Calculate TERA statistics
  const teraStats = {
    totalAnalyzed: veterans.length,
    highRisk: veterans.filter(v => v.riskScore && v.riskScore > 70).length,
    pactEligible: Math.floor(veterans.length * 0.65), // Estimated
    avgRisk: veterans.reduce((sum, v) => sum + (v.riskScore || 0), 0) / veterans.length || 0,
    burnPitExposed: Math.floor(veterans.length * 0.34), // OIF/OEF era estimate
    agentOrangeExposed: Math.floor(veterans.length * 0.12), // Vietnam era estimate
    campLejeune: Math.floor(veterans.length * 0.08), // Stationed at Camp Lejeune
    radiationExposed: Math.floor(veterans.length * 0.05) // Nuclear testing/incidents
  };

  const handleVeteranSelect = (veteran: Veteran) => {
    const detailedVeteran = generateVeteranDetails(veteran);
    const enhancedVeteran = generateVeteranProfileEnhanced(detailedVeteran);
    setSelectedVeteran(enhancedVeteran);
    setShowVeteranModal(true);
  };

  const filteredVeterans = veterans.filter(veteran => {
    if (searchQuery && !veteran.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedFilter === 'high-risk' && (!veteran.riskScore || veteran.riskScore <= 70)) {
      return false;
    }
    if (selectedFilter === 'pact-eligible') {
      // Simplified PACT Act eligibility based on service era and location
      const serviceYear = new Date(veteran.serviceStartDate).getFullYear();
      const isPactEligible = serviceYear >= 1990 || // Gulf War and later
        veteran.branch === 'MARINES' || // Higher likelihood
        Math.random() > 0.4; // Simplified random assignment
      if (!isPactEligible) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-henry-bg relative overflow-hidden">
      {/* Background Effects */}
      <AnimatedParticles 
        className="fixed inset-0" 
        particleColor="rgba(251, 146, 60, 0.3)"
        lineColor="rgba(239, 68, 68, 0.2)"
        particleCount={120}
        speed={0.1}
        interactive={false}
      />
      <GradientOrbs animated={true} />

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-gray-800/95 via-gray-900/98 to-gray-800/95 backdrop-blur-xl border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between h-auto sm:h-20 py-4 sm:py-0">
            {/* Title Section */}
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                  TERA Analytics Platform
                </h1>
                <p className="text-sm text-gray-400 mt-1">Toxic Exposure Risk Assessment & Analysis</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-initial flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                <span className="text-sm">Export Report</span>
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="flex-1 sm:flex-initial flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                <span className="text-sm">Back to Platform</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* TERA Overview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4 mb-8">
          <StatCard title="Total Veterans" value={teraStats.totalAnalyzed.toLocaleString()} color="blue" />
          <StatCard title="High Risk" value={teraStats.highRisk.toString()} color="red" />
          <StatCard title="PACT Eligible" value={teraStats.pactEligible.toString()} color="green" />
          <StatCard title="Avg Risk Score" value={`${teraStats.avgRisk.toFixed(1)}%`} color="orange" />
          <StatCard title="Burn Pit" value={teraStats.burnPitExposed.toString()} color="yellow" />
          <StatCard title="Agent Orange" value={teraStats.agentOrangeExposed.toString()} color="purple" />
          <StatCard title="Camp Lejeune" value={teraStats.campLejeune.toString()} color="teal" />
          <StatCard title="Radiation" value={teraStats.radiationExposed.toString()} color="pink" />
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search veterans by name, ID, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
              />
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Veterans</option>
              <option value="high-risk">High Risk Only</option>
              <option value="pact-eligible">PACT Act Eligible</option>
            </select>
          </div>
        </div>

        {/* Veterans Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredVeterans.map((veteran) => (
              <VeteranCard
                key={veteran.id}
                veteran={veteran}
                onClick={() => handleVeteranSelect(veteran)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Veteran Detail Modal */}
      <AnimatePresence>
        {showVeteranModal && selectedVeteran && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
            onClick={() => setShowVeteranModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-6xl max-h-[90vh] bg-gray-900 rounded-2xl border border-gray-700 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{selectedVeteran.firstName} {selectedVeteran.lastName}</h3>
                    <p className="text-sm text-gray-400">TERA Analysis</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowVeteranModal(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
                <AnalyticsInsightsEnhanced veteran={selectedVeteran} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, color }: { title: string; value: string; color: string }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600',
    teal: 'from-teal-500 to-teal-600',
    pink: 'from-pink-500 to-pink-600'
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className={`w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-lg mb-2`} />
      <div className="text-lg sm:text-xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-400">{title}</div>
    </div>
  );
}

// Veteran Card Component
function VeteranCard({ veteran, onClick }: { veteran: Veteran; onClick: () => void }) {
  const riskLevel = veteran.riskScore && veteran.riskScore > 70 ? 'High' : 
                   veteran.riskScore && veteran.riskScore > 40 ? 'Medium' : 'Low';
  const riskColor = riskLevel === 'High' ? 'red' : riskLevel === 'Medium' ? 'yellow' : 'green';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-gray-700 hover:border-orange-500/50 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
            {veteran.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
          </div>
          <div>
            <h4 className="text-white font-medium">{veteran.name}</h4>
            <p className="text-xs text-gray-400">{veteran.branch} • {veteran.edipi}</p>
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full ${
          riskColor === 'red' ? 'bg-red-500' : 
          riskColor === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'
        } animate-pulse`} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="bg-gray-700/50 rounded px-2 py-1">
          <span className="text-gray-400">Rating: </span>
          <span className="text-white">{veteran.disabilityRating}%</span>
        </div>
        <div className="bg-gray-700/50 rounded px-2 py-1">
          <span className="text-gray-400">Risk: </span>
          <span className={`${
            riskColor === 'red' ? 'text-red-400' : 
            riskColor === 'yellow' ? 'text-yellow-400' : 'text-green-400'
          }`}>
            {riskLevel}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          Service: {new Date(veteran.serviceStartDate).getFullYear()}
        </span>
        <div className="flex items-center text-orange-400 group-hover:text-orange-300 transition-colors">
          <span className="text-xs font-medium mr-1">Analyze</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}
