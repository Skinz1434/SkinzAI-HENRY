'use client';

import { useState, useEffect, useCallback } from 'react';

// Extend Window interface for scroll timeout
declare global {
  interface Window {
    scrollTimeout: NodeJS.Timeout;
  }
}
import { 
  Activity, 
  Users, 
  FileText, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Upload,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  FileDown,
  Loader2,
  Database,
  Shield,
  Clock,
  ChevronRight,
  Grid,
  List,
  Brain,
  ExternalLink
} from 'lucide-react';
import { mockFetchVeterans, mockSyncVetProfile, mockExportData } from '@/lib/henry/mock-data';
import { Veteran, Branch, DischargeStatus } from '@/types';
import { BRANCHES, DISCHARGE_STATUSES } from './constants';
import { VeteranDetailModalEnhanced } from '@/components/VeteranDetailModalEnhanced';
import { generateVeteranDetails } from '@/lib/henry/veteran-details';
import { generateVeteranProfileEnhanced, VeteranProfileEnhanced } from '@/lib/henry/veteran-profile-enhanced';
import OverviewEnhanced from '@/components/tabs/OverviewEnhanced';
import ClaimsEnhanced from '@/components/tabs/ClaimsEnhanced';

type TabType = 'overview' | 'veterans' | 'claims' | 'sync' | 'reports';

export default function DashboardFullPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [veterans, setVeterans] = useState<Veteran[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVeteran, setSelectedVeteran] = useState<VeteranProfileEnhanced | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    branch: '',
    status: '',
    syncStatus: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [syncingIds, setSyncingIds] = useState<Set<string>>(new Set());
  const [vetProfileAccuracy, setVetProfileAccuracy] = useState(97.3);
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);

  // Scroll event handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      setScrollY(scrollTop);
      setShowTopFade(scrollTop > 50);
      setShowBottomFade(scrollTop + clientHeight < scrollHeight - 50);
      
      setIsScrolling(true);
      
      // Clear scrolling state after a delay
      clearTimeout(window.scrollTimeout);
      window.scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(window.scrollTimeout);
    };
  }, []);

  // Load veterans data
  const loadVeterans = useCallback(async () => {
    setLoading(true);
    try {
      const result = await mockFetchVeterans(currentPage, 20, {
        search: searchQuery,
        ...filters
      });
      setVeterans(result.data);
      setTotalRecords(result.total);
    } catch (error) {
      // Failed to load veterans data
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, filters]);

  useEffect(() => {
    loadVeterans();
  }, [loadVeterans]);

  // Update accuracy periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setVetProfileAccuracy(96.5 + Math.random() * 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleVeteranClick = (veteran: Veteran) => {
    const detailedVeteran = generateVeteranDetails(veteran);
    const enhancedVeteran = generateVeteranProfileEnhanced(detailedVeteran);
    setSelectedVeteran(enhancedVeteran);
    setIsModalOpen(true);
  };

  const handleSync = async (veteranId: string) => {
    setSyncingIds(prev => new Set(prev).add(veteranId));
    try {
      const result = await mockSyncVetProfile(veteranId);
      if (result.success) {
        setVeterans(prev => prev.map(v => 
          v.id === veteranId 
            ? { ...v, accuracy: result.accuracy, lastSyncDate: result.syncDate }
            : v
        ));
        // Update selected veteran if open
        if (selectedVeteran && selectedVeteran.id === veteranId) {
          setSelectedVeteran(prev => prev ? {
            ...prev,
            vetProfileStatus: {
              ...prev.vetProfileStatus,
              accuracy: result.accuracy,
              lastSync: result.syncDate,
              status: result.success ? 'Success' : 'Failed'
            }
          } : null);
        }
      }
      if (!isModalOpen) {
        alert(`Sync ${result.success ? 'successful' : 'failed'}: ${result.accuracy.toFixed(1)}% accuracy`);
      }
    } finally {
      setSyncingIds(prev => {
        const next = new Set(prev);
        next.delete(veteranId);
        return next;
      });
    }
  };

  const handleExport = async (format: 'pdf' | 'csv' | 'email') => {
    // Map email and pdf to csv for now since mockExportData only supports csv/xlsx
    const exportFormat = format === 'email' || format === 'pdf' ? 'csv' : format as 'csv';
    const url = await mockExportData(exportFormat, veterans);
    
    if (format === 'email') {
      // For email, we'd normally send to an API endpoint
      console.log('Email export requested');
      alert('Email export feature coming soon');
      return;
    }
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `veterans-export.${exportFormat}`;
    a.click();
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'veterans', label: 'Veterans', icon: Users },
    { id: 'claims', label: 'Claims', icon: FileText },
    { id: 'sync', label: 'Vet Profile Sync', icon: RefreshCw },
    { id: 'reports', label: 'Reports', icon: FileDown }
  ];

  return (
    <>
      {/* Veteran Detail Modal */}
      {selectedVeteran && (
        <VeteranDetailModalEnhanced
          veteran={selectedVeteran}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedVeteran(null);
          }}
          onSync={handleSync}
          isSyncing={syncingIds.has(selectedVeteran.id)}
        />
      )}
      
      {/* Background */}
      <div className="min-h-screen bg-gray-900 relative">
        
        {/* Scroll-based Fade Overlays */}
        <div 
          className={`fixed top-0 left-0 right-0 h-16 bg-gradient-to-b from-gray-900 via-gray-900/50 to-transparent pointer-events-none z-40 transition-opacity duration-300 ${
            showTopFade && isScrolling ? 'opacity-100' : 'opacity-0'
          }`} 
        />
        <div 
          className={`fixed bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent pointer-events-none z-40 transition-opacity duration-300 ${
            showBottomFade && isScrolling ? 'opacity-100' : 'opacity-0'
          }`} 
        />
        
        {/* Enhanced Header */}
        <div className="relative bg-gradient-to-r from-gray-800/95 via-gray-800/98 to-gray-800/95 backdrop-blur-xl border-b border-gray-700/50 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex items-center justify-between h-16 md:h-20">
              <div className="flex items-center">
                {/* Enhanced Logo */}
                <div className="relative mr-6 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-all duration-500" />
                  <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-2xl border border-cyan-400/30 shadow-lg">
                    <Shield className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping" />
                  </div>
                </div>
                
                {/* Enhanced Title */}
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="relative group">
                    <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                      HENRY Platform
                    </h1>
                    <p className="text-xs text-gray-400 font-bold tracking-[0.2em] uppercase mt-1">
                      Heroes&apos; Early Notification & Response Yesterday
                    </p>
                    <div className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
                  </div>
                </div>
              </div>
              
              {/* Enhanced Header Actions */}
              <div className="flex items-center gap-6">
                {/* Status Indicators */}
                <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-gray-400">All Systems Operational</span>
                  </div>
                </div>
                
                {/* Navigation Links */}
                <div className="hidden lg:flex items-center gap-2">
                  <a 
                    href="/"
                    className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                    title="Platform Home"
                  >
                    <Activity className="w-4 h-4" />
                    <span className="text-sm">Home</span>
                  </a>
                  <a 
                    href="/hvec"
                    className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                    title="HVEC Clinical Intelligence"
                  >
                    <Brain className="w-4 h-4" />
                    <span className="text-sm">HVEC</span>
                  </a>
                  <a 
                    href="/va-claims-ai"
                    className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                    title="VA Claims AI"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">Claims AI</span>
                  </a>
                  <a 
                    href="/codda"
                    className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                    title="CODDA IDE"
                  >
                    <Database className="w-4 h-4" />
                    <span className="text-sm">CODDA</span>
                  </a>
                  <a 
                    href="/tera-analytics"
                    className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                    title="TERA Analytics"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">TERA</span>
                  </a>
                </div>
                
                {/* Mobile Navigation Menu */}
                <div className="lg:hidden">
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
                    <Grid className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Accuracy Metric */}
                <div className="text-right px-4 py-2 bg-green-500/10 rounded-xl border border-green-500/20 backdrop-blur-sm">
                  <p className="text-xs text-gray-400 font-medium">Vet Profile Accuracy</p>
                  <p className="text-xl font-bold text-green-400 flex items-center gap-1">
                    {vetProfileAccuracy.toFixed(1)}%
                    <TrendingUp className="w-4 h-4" />
                  </p>
                </div>
                
                {/* Refresh Button */}
                <button className="p-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-200 hover:scale-110">
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="relative bg-gradient-to-r from-gray-800/90 via-gray-800/95 to-gray-800/90 backdrop-blur-sm border-b border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex space-x-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`relative px-6 py-4 font-medium text-sm flex items-center gap-2 transition-all duration-300 rounded-t-lg group ${
                      isActive
                        ? 'text-white bg-gradient-to-b from-blue-600/20 to-transparent border-b-2 border-blue-400'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/30'
                    }`}
                  >
                    {/* Active tab glow effect */}
                    {isActive && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-cyan-600/10 to-purple-600/10 rounded-t-lg" />
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
                      </>
                    )}
                    
                    {/* Icon with enhanced styling */}
                    <div className={`relative transition-all duration-300 ${
                      isActive ? 'scale-110' : 'group-hover:scale-105'
                    }`}>
                      <Icon className={`w-4 h-4 relative z-10 ${
                        isActive ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''
                      }`} />
                    </div>
                    
                    <span className="relative z-10 font-semibold">{tab.label}</span>
                    
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <OverviewEnhanced accuracy={vetProfileAccuracy} veteranCount={totalRecords} veterans={veterans} />
        )}

        {activeTab === 'veterans' && (
          <VeteransTab
            veterans={veterans}
            loading={loading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filters={filters}
            setFilters={setFilters}
            onSync={handleSync}
            syncingIds={syncingIds}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onExport={handleExport}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalRecords={totalRecords}
            onVeteranClick={handleVeteranClick}
          />
        )}

        {activeTab === 'claims' && <ClaimsEnhanced veterans={veterans} />}
        
        {activeTab === 'sync' && (
          <SyncTab 
            veterans={veterans} 
            onSync={handleSync}
            syncingIds={syncingIds}
          />
        )}
        
        {activeTab === 'reports' && <ReportsTab veterans={veterans} />}
      </div>
    </div>
    </>
  );
}

// Overview Tab Component
function OverviewTab({ accuracy, veteranCount }: { accuracy: number; veteranCount: number }) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Vet Profile Accuracy"
          value={`${accuracy.toFixed(1)}%`}
          subtitle="Above 97% threshold"
          color="green"
        />
        <MetricCard
          title="Total Veterans"
          value={veteranCount.toLocaleString()}
          subtitle="+124 this week"
          color="blue"
        />
        <MetricCard
          title="Active Claims"
          value="3,421"
          subtitle="234 pending review"
          color="yellow"
        />
        <MetricCard
          title="System Health"
          value="99.98%"
          subtitle="All systems operational"
          color="green"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <ActivityItem
            icon={CheckCircle}
            text="Vet Profile sync completed for 50 veterans"
            time="2 minutes ago"
            color="green"
          />
          <ActivityItem
            icon={AlertCircle}
            text="DD-214 fallback triggered for VET-123"
            time="15 minutes ago"
            color="yellow"
          />
          <ActivityItem
            icon={FileText}
            text="New claim submitted: CL2024-0892"
            time="1 hour ago"
            color="blue"
          />
          <ActivityItem
            icon={Database}
            text="Database backup completed"
            time="3 hours ago"
            color="gray"
          />
        </div>
      </div>
    </div>
  );
}

// Veterans Tab Component
function VeteransTab({ 
  veterans, 
  loading, 
  searchQuery, 
  setSearchQuery,
  filters,
  setFilters,
  onSync,
  syncingIds,
  viewMode,
  setViewMode,
  onExport,
  currentPage,
  setCurrentPage,
  totalRecords,
  onVeteranClick
}: {
  veterans: Veteran[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: { branch: string; status: string; syncStatus: string };
  setFilters: (filters: { branch: string; status: string; syncStatus: string }) => void;
  onSync: (id: string) => void;
  syncingIds: Set<string>;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  onExport: (format: 'pdf' | 'csv' | 'email') => Promise<void>;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalRecords: number;
  onVeteranClick: (veteran: Veteran) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Enhanced Toolbar */}
      <div className="space-y-4">
        {/* Search Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, EDIPI, SSN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title={viewMode === 'grid' ? 'Switch to List View' : 'Switch to Grid View'}
            >
              {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => onExport('csv')}
              className="flex-1 sm:flex-initial px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
        
        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <select
            value={filters.branch}
            onChange={(e) => setFilters({...filters, branch: e.target.value})}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Branches</option>
            {Object.values(Branch || BRANCHES).map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            {Object.values(DischargeStatus || DISCHARGE_STATUSES).map(status => (
              <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
            ))}
          </select>
          
          <select
            value={filters.syncStatus}
            onChange={(e) => setFilters({...filters, syncStatus: e.target.value})}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Sync Status</option>
            <option value="success">Synced</option>
            <option value="error">Sync Error</option>
            <option value="pending">Pending Sync</option>
          </select>
        </div>
      </div>

      {/* Enhanced Data Display */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      ) : (
        <>
          {/* Mobile Card View (Hidden on Desktop) */}
          <div className="block lg:hidden space-y-4">
            {veterans.map((veteran: Veteran) => (
              <div key={veteran.id} className="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:border-blue-500/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                      {veteran.firstName?.[0]}{veteran.lastName?.[0]}
                    </div>
                    <div>
                      <h4 
                        className="text-white font-medium cursor-pointer hover:text-blue-400"
                        onClick={() => onVeteranClick(veteran)}
                      >
                        {veteran.firstName} {veteran.lastName}
                      </h4>
                      <p className="text-xs text-gray-400">
                        EDIPI: {veteran.edipi} • SSN: {veteran.ssn ? `***-**-${veteran.ssn.slice(-4)}` : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSync(veteran.id)}
                      disabled={syncingIds.has(veteran.id)}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg disabled:opacity-50 transition-colors"
                      title="Sync Profile"
                    >
                      {syncingIds.has(veteran.id) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                    </button>
                    <button 
                      onClick={() => onVeteranClick(veteran)}
                      className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <div className="text-gray-400 text-xs mb-1">Branch & Status</div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
                        {veteran.branch}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                        {veteran.dischargeStatus?.replace(/_/g, ' ') || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <div className="text-gray-400 text-xs mb-1">Profile Accuracy</div>
                    <div className="text-white font-medium">
                      {veteran.accuracy?.toFixed(1) || '0'}%
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <div className="text-gray-400 text-xs mb-1">Disability Rating</div>
                    <div className="text-white font-medium">
                      {veteran.disabilityRating || 0}%
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <div className="text-gray-400 text-xs mb-1">Last Sync</div>
                    <div className="text-gray-300 text-xs">
                      {veteran.lastSyncDate ? new Date(veteran.lastSyncDate).toLocaleDateString() : 'Never'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Desktop Table View (Hidden on Mobile) */}
          <div className="hidden lg:block bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">EDIPI</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">SSN</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Branch</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Rating</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Accuracy</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Last Sync</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {veterans.map((veteran: Veteran) => (
                    <tr key={veteran.id} className="hover:bg-gray-700/50 cursor-pointer">
                      <td className="px-4 py-3" onClick={() => onVeteranClick(veteran)}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-xs">
                            {veteran.firstName?.[0]}{veteran.lastName?.[0]}
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              {veteran.firstName} {veteran.lastName}
                            </div>
                            <div className="text-xs text-gray-400">
                              {veteran.rank && `${veteran.rank} • `}Veteran
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-300 font-mono text-sm">
                        {veteran.edipi || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-gray-300 font-mono text-sm">
                        {veteran.ssn ? `***-**-${veteran.ssn.slice(-4)}` : 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
                          {veteran.branch}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                          {veteran.dischargeStatus?.replace(/_/g, ' ') || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">
                            {veteran.disabilityRating || 0}%
                          </span>
                          {(veteran.disabilityRating || 0) >= 70 && (
                            <span className="px-1.5 py-0.5 text-xs bg-red-500/20 text-red-400 rounded">
                              HIGH
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${
                            (veteran.accuracy || 0) >= 95 ? 'text-green-400' : 
                            (veteran.accuracy || 0) >= 90 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {veteran.accuracy?.toFixed(1) || '0.0'}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-sm">
                        {veteran.lastSyncDate ? new Date(veteran.lastSyncDate).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onSync(veteran.id)}
                            disabled={syncingIds.has(veteran.id)}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg disabled:opacity-50 transition-colors"
                            title="Sync Profile"
                          >
                            {syncingIds.has(veteran.id) ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <RefreshCw className="w-4 h-4" />
                            )}
                          </button>
                          <button 
                            onClick={() => onVeteranClick(veteran)}
                            className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                            title="Edit Veteran"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Enhanced Pagination */}
            <div className="px-4 py-4 bg-gray-900 border-t border-gray-700">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-sm text-gray-400">
                  Showing <span className="font-medium text-white">{(currentPage - 1) * 20 + 1}</span> to{' '}
                  <span className="font-medium text-white">{Math.min(currentPage * 20, totalRecords)}</span> of{' '}
                  <span className="font-medium text-white">{totalRecords}</span> veterans
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-2 text-sm text-gray-400">
                    Page {currentPage} of {Math.ceil(totalRecords / 20)}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage * 20 >= totalRecords}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Other tab components
function ClaimsTab({ veterans }: { veterans: Veteran[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Claims Processing</h2>
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <p className="text-gray-400">Claims processing interface with workflow management</p>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-gray-700 p-4 rounded">
            <p className="text-sm text-gray-400">Pending</p>
            <p className="text-2xl font-bold text-yellow-400">423</p>
          </div>
          <div className="bg-gray-700 p-4 rounded">
            <p className="text-sm text-gray-400">Under Review</p>
            <p className="text-2xl font-bold text-blue-400">856</p>
          </div>
          <div className="bg-gray-700 p-4 rounded">
            <p className="text-sm text-gray-400">Approved</p>
            <p className="text-2xl font-bold text-green-400">1,523</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SyncTab({ veterans, onSync, syncingIds }: { 
  veterans: Veteran[]; 
  onSync: (id: string) => void; 
  syncingIds: Set<string> 
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Vet Profile Synchronization</h2>
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-lg font-semibold text-white">Bulk Sync Operations</p>
            <p className="text-gray-400">Synchronize veteran data with Vet Profile API</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Sync All
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-700 p-4 rounded">
            <p className="text-sm text-gray-400">Success Rate</p>
            <p className="text-2xl font-bold text-green-400">97.3%</p>
          </div>
          <div className="bg-gray-700 p-4 rounded">
            <p className="text-sm text-gray-400">DD-214 Fallback Rate</p>
            <p className="text-2xl font-bold text-yellow-400">2.7%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportsTab({ veterans }: { veterans: Veteran[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Reports & Analytics</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Generate Reports</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-gray-700 rounded hover:bg-gray-600 flex items-center justify-between">
              <span className="text-white">Monthly Summary Report</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-700 rounded hover:bg-gray-600 flex items-center justify-between">
              <span className="text-white">Claims Analysis Report</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-700 rounded hover:bg-gray-600 flex items-center justify-between">
              <span className="text-white">Accuracy Metrics Report</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Export Options</h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
              Export to Excel
            </button>
            <button className="w-full px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700">
              Export to CSV
            </button>
            <button className="w-full px-4 py-3 bg-purple-600 text-white rounded hover:bg-purple-700">
              Generate PDF Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
type MetricColor = 'green' | 'blue' | 'yellow' | 'red' | 'gray';

function MetricCard({ title, value, subtitle, color }: { title: string; value: string; subtitle: string; color: MetricColor }) {
  const colorClasses: Record<MetricColor, string> = {
    green: 'text-green-400 bg-green-500/20',
    blue: 'text-blue-400 bg-blue-500/20',
    yellow: 'text-yellow-400 bg-yellow-500/20',
    red: 'text-red-400 bg-red-500/20',
    gray: 'text-gray-400 bg-gray-500/20'
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className={`text-3xl font-bold ${colorClasses[color].split(' ')[0]}`}>{value}</p>
      <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
    </div>
  );
}

function ActivityItem({ icon: Icon, text, time, color }: { icon: React.ComponentType<{ className?: string }>; text: string; time: string; color: MetricColor }) {
  const colorClasses: Record<MetricColor, string> = {
    green: 'text-green-400 bg-green-500/20',
    blue: 'text-blue-400 bg-blue-500/20',
    yellow: 'text-yellow-400 bg-yellow-500/20',
    red: 'text-red-400 bg-red-500/20',
    gray: 'text-gray-400 bg-gray-500/20'
  };

  return (
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <p className="text-white text-sm">{text}</p>
        <p className="text-gray-500 text-xs mt-1">{time}</p>
      </div>
    </div>
  );
}
