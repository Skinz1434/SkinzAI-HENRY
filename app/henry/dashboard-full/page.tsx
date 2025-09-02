'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { mockFetchVeterans, mockSyncVetProfile, mockProcessClaim, mockExportData } from '@/lib/henry/mock-data';
import { Veteran, Branch, DischargeStatus, ClaimStatus } from '@/types';
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
      console.error('Failed to load veterans:', error);
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

  const handleExport = async (format: 'csv' | 'xlsx') => {
    const url = await mockExportData(format, veterans);
    const a = document.createElement('a');
    a.href = url;
    a.download = `veterans-export.${format}`;
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
      
      <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="relative mr-4 group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <Shield className="relative w-10 h-10 text-cyan-400 animate-pulse drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-lg blur-sm opacity-25"></div>
                <div className="relative">
                  <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
                    HENRY Platform
                  </h1>
                  <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase">Heroes' Early Notification & Response Yesterday</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="/va-claims-ai"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
              >
                <Brain className="w-5 h-5" />
                <span className="font-semibold">VA Claims AI</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <div className="text-right">
                <p className="text-xs text-gray-400">Vet Profile Accuracy</p>
                <p className="text-lg font-bold text-green-400">{vetProfileAccuracy.toFixed(1)}%</p>
              </div>
              <button className="p-2 text-gray-400 hover:text-white">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-400 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
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
}: any) {
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search veterans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <select
            value={filters.branch}
            onChange={(e) => setFilters({...filters, branch: e.target.value})}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Branches</option>
            {Object.values(Branch).map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            {Object.values(DischargeStatus).map(status => (
              <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 text-gray-400 hover:text-white"
          >
            {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => onExport('csv')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">SSN</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Branch</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Accuracy</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Last Sync</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {veterans.map((veteran: Veteran) => (
                <tr key={veteran.id} className="hover:bg-gray-700/50 cursor-pointer">
                  <td className="px-4 py-3 text-white" onClick={() => onVeteranClick(veteran)}>
                    {veteran.firstName} {veteran.lastName}
                  </td>
                  <td className="px-4 py-3 text-gray-300">{veteran.ssn}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
                      {veteran.branch}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                      {veteran.dischargeStatus.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white">
                    {veteran.accuracy.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {veteran.lastSyncDate ? new Date(veteran.lastSyncDate).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onSync(veteran.id)}
                        disabled={syncingIds.has(veteran.id)}
                        className="p-1 text-blue-400 hover:text-blue-300 disabled:opacity-50"
                      >
                        {syncingIds.has(veteran.id) ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4" />
                        )}
                      </button>
                      <button 
                        onClick={() => onVeteranClick(veteran)}
                        className="p-1 text-gray-400 hover:text-gray-300"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-300">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-4 py-3 bg-gray-900 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Showing {(currentPage - 1) * 20 + 1} to {Math.min(currentPage * 20, totalRecords)} of {totalRecords} results
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-800 text-white rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage * 20 >= totalRecords}
                className="px-3 py-1 bg-gray-800 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Other tab components
function ClaimsTab({ veterans }: any) {
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

function SyncTab({ veterans, onSync, syncingIds }: any) {
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

function ReportsTab({ veterans }: any) {
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

function ActivityItem({ icon: Icon, text, time, color }: { icon: any; text: string; time: string; color: MetricColor }) {
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