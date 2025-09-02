'use client';

import { useState, useMemo } from 'react';
import { 
  X, XCircle, User, Phone, Mail, MapPin, Shield, Award, Heart, 
  FileText, Calendar, Download, ChevronRight, CheckCircle,
  AlertCircle, Clock, DollarSign, Home, GraduationCap,
  Stethoscope, Pill, Activity, FolderOpen, RefreshCw,
  AlertTriangle, TrendingUp, Users, Star, BarChart3,
  MessageSquare, Bell, CreditCard, Scale, Briefcase,
  Globe, History, Lock, Settings, ChevronDown, ChevronUp,
  Info, Zap, Target, Brain, LineChart as LineChartIcon, PieChart as PieChartIcon,
  FileCheck, UserCheck, Building, Truck, Map, Flag,
  Award as AwardIcon, Medal, Ribbon, Trophy
} from 'lucide-react';
import { VeteranProfileEnhanced } from '@/lib/veteran-profile-enhanced';
import {
  LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadialBarChart, RadialBar, Treemap
} from 'recharts';

// Import all profile components
import VeteranOverviewEnhanced from './profile-tabs/VeteranOverviewEnhanced';
import PersonalProfile from './profile-tabs/PersonalProfile';
import ServiceProfileEnhanced from './profile-tabs/ServiceProfileEnhanced';
import MedicalProfile from './profile-tabs/MedicalProfile';
import BenefitsProfileEnhanced from './profile-tabs/BenefitsProfileEnhanced';
import ClaimsProfile from './profile-tabs/ClaimsProfile';
import DocumentsProfile from './profile-tabs/DocumentsProfile';
import FinancialProfile from './profile-tabs/FinancialProfile';
import LegalProfileEnhanced from './profile-tabs/LegalProfileEnhanced';
import AuditHistory from './profile-tabs/AuditHistory';
import AnalyticsInsightsUltraEnhanced from './profile-tabs/AnalyticsInsightsUltraEnhanced';
import CompleteProfileEnhanced from './profile-tabs/CompleteProfileEnhanced';
import CommunicationsPortalEnhanced from './profile-tabs/CommunicationsPortalEnhanced';

interface VeteranDetailModalEnhancedProps {
  veteran: VeteranProfileEnhanced;
  isOpen: boolean;
  onClose: () => void;
  onSync: (id: string) => void;
  isSyncing: boolean;
}

type MainTabType = 'overview' | 'profile' | 'analytics' | 'communications' | 'audit';
type ProfileTabType = 'complete' | 'personal' | 'service' | 'medical' | 'benefits' | 'claims' | 'documents' | 'eligibility' | 'financial' | 'legal';

export function VeteranDetailModalEnhanced({ 
  veteran, 
  isOpen, 
  onClose, 
  onSync, 
  isSyncing 
}: VeteranDetailModalEnhancedProps) {
  const [activeMainTab, setActiveMainTab] = useState<MainTabType>('overview');
  const [activeProfileTab, setActiveProfileTab] = useState<ProfileTabType>('complete');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const mainTabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'profile', label: 'Complete Profile', icon: User },
    { id: 'analytics', label: 'Analytics & Insights', icon: BarChart3 },
    { id: 'communications', label: 'Communications', icon: MessageSquare },
    { id: 'audit', label: 'Audit & History', icon: History }
  ];

  const profileTabs = [
    { id: 'complete', label: 'Complete Analysis', icon: BarChart3 },
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'service', label: 'Service', icon: Shield },
    { id: 'medical', label: 'Medical', icon: Heart },
    { id: 'benefits', label: 'Benefits', icon: DollarSign },
    { id: 'claims', label: 'Claims', icon: FileText },
    { id: 'documents', label: 'Documents', icon: FolderOpen },
    { id: 'eligibility', label: 'Eligibility', icon: CheckCircle },
    { id: 'financial', label: 'Financial', icon: CreditCard },
    { id: 'legal', label: 'Legal', icon: Scale }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm" onClick={onClose} />
      
      <div className="fixed inset-4 lg:inset-8 bg-gray-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Enhanced Header with Quick Actions */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  {veteran.firstName} {veteran.middleName} {veteran.lastName} {veteran.suffix}
                  {veteran.profileServices.awards.some(a => a.category === 'valor') && (
                    <Medal className="w-6 h-6 text-yellow-300" />
                  )}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <span className="text-blue-100 text-sm">SSN: {veteran.ssn}</span>
                  <span className="text-blue-100 text-sm">DOD ID: {veteran.mpr.dodId}</span>
                  <span className="px-2 py-0.5 bg-white/20 rounded text-white text-xs">
                    {veteran.mpr.branch} • {veteran.mpr.rank}
                  </span>
                  <span className="px-2 py-0.5 bg-green-500/30 rounded text-green-100 text-xs">
                    {veteran.mpd.disabilityRating}% Disabled
                  </span>
                </div>
                
                {/* Quick Action Buttons */}
                <div className="flex gap-2 mt-3">
                  <button className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-white text-sm flex items-center gap-1">
                    <Download className="w-3 h-3" /> Export Full Profile
                  </button>
                  <button className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-white text-sm flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Generate Report
                  </button>
                  <button 
                    onClick={() => onSync(veteran.id)}
                    disabled={isSyncing}
                    className="px-3 py-1 bg-green-500/30 hover:bg-green-500/40 rounded text-white text-sm flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} /> 
                    Sync MPD/Vet Profile
                  </button>
                  <button className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-white text-sm flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> Contact
                  </button>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white p-2">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Enhanced Metrics Bar */}
        <div className="bg-gray-700 px-6 py-3 border-b border-gray-600">
          <div className="grid grid-cols-8 gap-4">
            <MetricBadge 
              label="Disability" 
              value={`${veteran.mpd.disabilityRating}%`} 
              trend={veteran.analytics.trends.ratingHistory.slice(-2)[1]?.rating > veteran.analytics.trends.ratingHistory.slice(-2)[0]?.rating ? 'up' : 'stable'}
              color="green" 
            />
            <MetricBadge 
              label="Monthly" 
              value={`$${veteran.benefits.monthlyAmount}`} 
              color="blue" 
            />
            <MetricBadge 
              label="Claims" 
              value={veteran.claims.filter(c => c.status === 'PENDING').length} 
              subtext="pending"
              color="yellow" 
            />
            <MetricBadge 
              label="MPD Accuracy" 
              value={`${veteran.vetProfileStatus.accuracy.toFixed(1)}%`} 
              color="cyan" 
            />
            <MetricBadge 
              label="Risk Score" 
              value={veteran.analytics.riskScores.healthRisk} 
              color={veteran.analytics.riskScores.healthRisk === 'high' ? 'red' : veteran.analytics.riskScores.healthRisk === 'medium' ? 'yellow' : 'green'} 
            />
            <MetricBadge 
              label="Engagement" 
              value={`${veteran.analytics.engagement.benefitUtilization.toFixed(0)}%`} 
              color="purple" 
            />
            <MetricBadge 
              label="Data Quality" 
              value={`${veteran.qualityMetrics?.dataCompleteness?.toFixed(0) || 0}%`} 
              color="indigo" 
            />
            <MetricBadge 
              label="Appeals" 
              value={veteran.profileServices?.appeals?.length || 0} 
              subtext="active"
              color="orange" 
            />
          </div>
        </div>

        {/* Main Navigation */}
        <div className="bg-gray-750 border-b border-gray-600 px-6">
          <div className="flex gap-1">
            {mainTabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveMainTab(tab.id as MainTabType)}
                  className={`px-4 py-3 flex items-center gap-2 text-sm font-medium border-b-2 transition-all ${
                    activeMainTab === tab.id
                      ? 'border-blue-400 text-blue-400 bg-gray-800/50'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area with Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar for Profile Tab */}
          {activeMainTab === 'profile' && (
            <div className="w-48 bg-gray-750 border-r border-gray-600 overflow-y-auto">
              <div className="p-3 space-y-1">
                {profileTabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveProfileTab(tab.id as ProfileTabType)}
                      className={`w-full px-3 py-2 flex items-center gap-2 text-sm rounded-lg transition-all ${
                        activeProfileTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto bg-gray-800 p-6">
            {activeMainTab === 'overview' && <VeteranOverviewEnhanced veteran={veteran} />}
            {activeMainTab === 'profile' && (
              <>
                {activeProfileTab === 'complete' && <CompleteProfileEnhanced veteran={veteran} />}
                {activeProfileTab === 'personal' && <PersonalProfile veteran={veteran} />}
                {activeProfileTab === 'service' && <ServiceProfileEnhanced veteran={veteran} />}
                {activeProfileTab === 'medical' && <MedicalProfile veteran={veteran} />}
                {activeProfileTab === 'benefits' && <BenefitsProfileEnhanced veteran={veteran} />}
                {activeProfileTab === 'claims' && <ClaimsProfile veteran={veteran} />}
                {activeProfileTab === 'documents' && <DocumentsProfile veteran={veteran} />}
                {activeProfileTab === 'eligibility' && <EligibilityProfile veteran={veteran} />}
                {activeProfileTab === 'financial' && <FinancialProfile veteran={veteran} />}
                {activeProfileTab === 'legal' && <LegalProfileEnhanced veteran={veteran} />}
              </>
            )}
            {activeMainTab === 'analytics' && <AnalyticsInsightsUltraEnhanced veteran={veteran} />}
            {activeMainTab === 'communications' && <CommunicationsPortalEnhanced veteran={veteran} />}
            {activeMainTab === 'audit' && <AuditHistory veteran={veteran} />}
          </div>
        </div>

        {/* Enhanced Footer with Actions */}
        <div className="bg-gray-700 px-6 py-3 flex justify-between items-center border-t border-gray-600">
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">
              Last Updated: {new Date(veteran.vetProfileStatus.lastSync).toLocaleString()}
            </span>
            <span className="text-xs text-gray-400">
              Data Quality: {veteran.profileServices.qualityMetrics?.dataCompleteness?.toFixed(0) || 0}%
            </span>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 text-sm">
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Overview Dashboard Component
function OverviewDashboard({ veteran }: { veteran: VeteranProfileEnhanced }) {
  const riskColors = {
    low: 'text-green-400 bg-green-500/20',
    medium: 'text-yellow-400 bg-yellow-500/20',
    high: 'text-red-400 bg-red-500/20'
  };

  return (
    <div className="space-y-6">
      {/* Risk Assessment Grid */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          Risk Assessment Dashboard
        </h3>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(veteran.analytics.riskScores).map(([key, value]) => (
            <div key={key} className="bg-gray-700 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-xs mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1').replace('Risk', '')}
              </p>
              <span className={`text-lg font-bold px-3 py-1 rounded-full ${riskColors[value]}`}>
                {value.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Benefit Utilization Chart */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3">Benefit Utilization</h4>
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={[
              { name: 'Healthcare', value: veteran.analytics.engagement.benefitUtilization, fill: '#3b82f6' },
              { name: 'Education', value: (veteran.benefits.education.giBlllUsed / 36) * 100, fill: '#10b981' },
              { name: 'Disability', value: veteran.mpd.disabilityRating, fill: '#f59e0b' }
            ]}>
              <RadialBar dataKey="value" />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Timeline */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3">Engagement Timeline</h4>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={veteran.analytics.trends.healthScores}>
              <defs>
                <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={false} />
              <YAxis hide />
              <Tooltip />
              <Area type="monotone" dataKey="score" stroke="#10b981" fillOpacity={1} fill="url(#colorHealth)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Predictive Insights */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3 flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400" />
            Predictive Insights
          </h4>
          <div className="space-y-2">
            <InsightBar 
              label="Claim Approval" 
              probability={veteran.analytics.predictions.nextClaimApprovalProbability} 
              color="blue"
            />
            <InsightBar 
              label="Rating Increase" 
              probability={veteran.analytics.predictions.ratingIncreaseLikelihood} 
              color="green"
            />
            <InsightBar 
              label="Appeal Success" 
              probability={veteran.analytics.predictions.appealSuccessProbability} 
              color="purple"
            />
            <p className="text-xs text-gray-400 mt-2">
              Est. Processing: {veteran.analytics.predictions.estimatedProcessingDays} days
            </p>
          </div>
        </div>
      </div>

      {/* Integration Status */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-400" />
          System Integrations
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {veteran.profileServices.integrations && Object.entries(veteran.profileServices.integrations).map(([system, data]) => (
            <div key={system} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium capitalize">
                  {system.replace(/([A-Z])/g, ' $1')}
                </span>
                {data.connected ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <p className="text-gray-400 text-xs">
                Last Sync: {data.lastSync ? new Date(data.lastSync).toLocaleDateString() : 'Never'}
              </p>
              {system === 'myHealtheVet' && data.connected && 'recordsAvailable' in data && (
                <p className="text-gray-400 text-xs mt-1">
                  {(data as any).recordsAvailable} records available
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          Recent Activity
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {veteran.profileServices.auditTrail?.slice(0, 10).map((event, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                <Activity className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">{event.action}</p>
                <p className="text-gray-400 text-xs">
                  {event.user} • {new Date(event.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// Helper Components
function MetricBadge({ label, value, subtext, color, trend }: any) {
  const colorClasses: Record<string, string> = {
    green: 'text-green-400',
    blue: 'text-blue-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    purple: 'text-purple-400',
    cyan: 'text-cyan-400',
    indigo: 'text-indigo-400',
    orange: 'text-orange-400'
  };

  return (
    <div className="text-center">
      <p className="text-gray-400 text-xs">{label}</p>
      <div className="flex items-center justify-center gap-1">
        <p className={`text-lg font-bold ${colorClasses[color as string] || 'text-gray-400'}`}>{value}</p>
        {trend === 'up' && <TrendingUp className="w-3 h-3 text-green-400" />}
      </div>
      {subtext && <p className="text-gray-500 text-xs">{subtext}</p>}
    </div>
  );
}

function InsightBar({ label, probability, color }: any) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-white">{probability.toFixed(0)}%</span>
      </div>
      <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-${color}-500 transition-all duration-500`}
          style={{ width: `${probability}%` }}
        />
      </div>
    </div>
  );
}

function EngagementCard({ title, value, subtitle, icon }: any) {
  return (
    <div className="bg-gray-700 rounded-lg p-4 text-center">
      <div className="flex justify-center mb-2 text-blue-400">
        {icon}
      </div>
      <p className="text-white text-xl font-bold">{value}</p>
      <p className="text-gray-400 text-xs">{subtitle}</p>
      <p className="text-gray-500 text-xs mt-1">{title}</p>
    </div>
  );
}

function PreferenceToggle({ label, enabled }: any) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-300 text-sm">{label}</span>
      <div className={`w-10 h-6 rounded-full p-1 transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-600'
      }`}>
        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
          enabled ? 'translate-x-4' : 'translate-x-0'
        }`} />
      </div>
    </div>
  );
}

// Add remaining profile components (PersonalProfile, ServiceProfile, etc.)
// These would follow similar patterns with detailed information display
// Due to length, showing structure for one more:

function EligibilityProfile({ veteran }: { veteran: VeteranProfileEnhanced }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Eligibility & Entitlements</h3>
      
      {/* Healthcare Eligibility */}
      <div className="bg-gray-700 rounded-lg p-4">
        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-400" />
          VA Healthcare
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Enrollment Group</p>
            <p className="text-white">{veteran.profileServices.eligibility.vaHealthcare.enrollmentGroup}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Copay Required</p>
            <p className="text-white">{veteran.profileServices.eligibility.vaHealthcare.copayRequired ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Catastrophic Cap</p>
            <p className="text-white">${veteran.profileServices.eligibility.vaHealthcare.catastrophicCap}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Medicare Eligible</p>
            <p className="text-white">{veteran.profileServices.eligibility.vaHealthcare.medicareEligible ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>

      {/* Education Benefits */}
      <div className="bg-gray-700 rounded-lg p-4">
        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-400" />
          Education Benefits
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Post-9/11 GI Bill (Ch 33)</span>
            <CheckCircle className={`w-5 h-5 ${veteran.profileServices.eligibility.educationBenefits.chapter33 ? 'text-green-400' : 'text-gray-500'}`} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Montgomery GI Bill (Ch 30)</span>
            <CheckCircle className={`w-5 h-5 ${veteran.profileServices.eligibility.educationBenefits.chapter30 ? 'text-green-400' : 'text-gray-500'}`} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Yellow Ribbon Program</span>
            <CheckCircle className={`w-5 h-5 ${veteran.profileServices.eligibility.educationBenefits.yellowRibbon ? 'text-green-400' : 'text-gray-500'}`} />
          </div>
          <div className="pt-3 border-t border-gray-600">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Months Remaining</span>
              <span className="text-white font-medium">{veteran.profileServices.eligibility.educationBenefits.monthsRemaining}</span>
            </div>
            <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500"
                style={{ width: `${(veteran.profileServices.eligibility.educationBenefits.monthsRemaining / 36) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional eligibility sections would continue here... */}
    </div>
  );
}

// Profile components are now imported from separate files