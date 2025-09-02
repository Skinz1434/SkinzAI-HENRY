'use client';

import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadialBarChart, RadialBar, Sankey
} from 'recharts';
import {
  FileText, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw,
  TrendingUp, Calendar, Filter, Search, Download, Eye, Edit,
  ChevronRight, MoreVertical, Shield, Award, DollarSign,
  Target, Zap, AlertTriangle, Info, ArrowUp, ArrowDown,
  FileSearch, Upload, Send, Archive, Trash2, Star
} from 'lucide-react';
import ClaimsDetailModal from '@/components/ClaimsDetailModal';
import { generateDetailedClaim } from '@/lib/va-claims/claims-data';

interface ClaimsEnhancedProps {
  veterans: any[];
}

export default function ClaimsEnhanced({ veterans }: ClaimsEnhancedProps) {
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Aggregate all claims from veterans
  const allClaims = useMemo(() => {
    return veterans.flatMap(v => 
      (v.claims || []).map((c: any) => ({
        ...c,
        veteranName: `${v.firstName} ${v.lastName}`,
        veteranId: v.id,
        ssn: v.ssn,
        dischargeStatus: v.dischargeStatus,
        disabilityRating: v.disabilityRating,
        branch: v.branch
      }))
    );
  }, [veterans]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = allClaims.length;
    const pending = allClaims.filter(c => c.status === 'PENDING').length;
    const approved = allClaims.filter(c => c.status === 'APPROVED').length;
    const denied = allClaims.filter(c => c.status === 'DENIED').length;
    const avgProcessingDays = allClaims.reduce((sum, c) => {
      const days = c.estimatedCompletionDate ? 
        Math.floor((new Date(c.estimatedCompletionDate).getTime() - new Date(c.filingDate).getTime()) / (1000 * 60 * 60 * 24)) : 
        120;
      return sum + days;
    }, 0) / (total || 1);
    
    // Count veterans with no benefits due to discharge
    const ineligibleVeterans = veterans.filter(v => 
      v.dischargeStatus === 'OTHER_THAN_HONORABLE' || 
      v.dischargeStatus === 'BAD_CONDUCT' || 
      v.dischargeStatus === 'DISHONORABLE'
    ).length;

    return { total, pending, approved, denied, avgProcessingDays, ineligibleVeterans };
  }, [allClaims, veterans]);

  // Filter and sort claims
  const filteredClaims = useMemo(() => {
    let filtered = [...allClaims];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.claimNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.veteranName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus);
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(c => c.type === filterType);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.filingDate).getTime() - new Date(a.filingDate).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'veteran':
          return a.veteranName.localeCompare(b.veteranName);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allClaims, searchQuery, filterStatus, filterType, sortBy]);

  // Claims by phase data
  const claimsByPhase = [
    { phase: 'Phase 1: Claim Received', count: 145, color: '#6b7280' },
    { phase: 'Phase 2: Initial Review', count: 234, color: '#60a5fa' },
    { phase: 'Phase 3: Evidence Gathering', count: 567, color: '#34d399' },
    { phase: 'Phase 4: Evidence Review', count: 432, color: '#fbbf24' },
    { phase: 'Phase 5: Preparation for Decision', count: 298, color: '#f97316' },
    { phase: 'Phase 6: Rating Decision', count: 187, color: '#a78bfa' },
    { phase: 'Phase 7: Notification', count: 92, color: '#f472b6' },
    { phase: 'Phase 8: Complete', count: 1466, color: '#10b981' }
  ];

  // Processing time trends
  const processingTrends = [
    { month: 'Jan', days: 145, target: 125 },
    { month: 'Feb', days: 138, target: 125 },
    { month: 'Mar', days: 132, target: 125 },
    { month: 'Apr', days: 127, target: 125 },
    { month: 'May', days: 121, target: 125 },
    { month: 'Jun', days: 118, target: 125 }
  ];

  const handleClaimClick = (claim: any) => {
    const detail = generateDetailedClaim(claim);
    setSelectedClaim(detail);
    setIsModalOpen(true);
  };

  return (
    <>
      {selectedClaim && (
        <ClaimsDetailModal
          claim={selectedClaim}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedClaim(null);
          }}
        />
      )}

      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Claims Management</h2>
            <p className="text-gray-400 text-sm mt-1">Monitor and manage all veteran claims</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-skinz-bg-secondary text-white px-4 py-2 rounded-lg hover:bg-skinz-bg-tertiary transition-colors flex items-center gap-2 border border-skinz-border">
              <Upload className="w-4 h-4" />
              Import Claims
            </button>
            <button className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-lg hover:bg-cyan-500/30 transition-colors flex items-center gap-2">
              <FileText className="w-4 h-4" />
              New Claim
            </button>
          </div>
        </div>

        {/* Alert for Ineligible Veterans */}
        {metrics.ineligibleVeterans > 0 && (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-orange-400 font-semibold mb-1">Benefits Eligibility Notice</h3>
                <p className="text-gray-300 text-sm">
                  {metrics.ineligibleVeterans} veteran{metrics.ineligibleVeterans > 1 ? 's' : ''} in the system 
                  {metrics.ineligibleVeterans > 1 ? ' have' : ' has'} discharge status that may affect benefits eligibility.
                  Veterans with Other Than Honorable, Bad Conduct, or Dishonorable discharges typically do not qualify 
                  for VA benefits without a discharge upgrade or Character of Discharge review.
                </p>
                <button className="mt-3 text-orange-400 text-sm hover:text-orange-300 flex items-center gap-1">
                  Learn about discharge upgrades <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <MetricCard
            title="Total Claims"
            value={metrics.total.toLocaleString()}
            icon={<FileText className="w-5 h-5" />}
            color="blue"
            change="+12.5%"
            trend="up"
          />
          <MetricCard
            title="Pending Review"
            value={metrics.pending.toLocaleString()}
            icon={<Clock className="w-5 h-5" />}
            color="yellow"
            subtitle="234 high priority"
          />
          <MetricCard
            title="Approved"
            value={metrics.approved.toLocaleString()}
            icon={<CheckCircle className="w-5 h-5" />}
            color="green"
            percentage={(metrics.approved / metrics.total * 100).toFixed(1)}
          />
          <MetricCard
            title="Denied"
            value={metrics.denied.toLocaleString()}
            icon={<XCircle className="w-5 h-5" />}
            color="red"
            percentage={(metrics.denied / metrics.total * 100).toFixed(1)}
          />
          <MetricCard
            title="Avg Processing"
            value={`${Math.round(metrics.avgProcessingDays)}d`}
            icon={<Calendar className="w-5 h-5" />}
            color="purple"
            subtitle="Target: 125d"
            trend={metrics.avgProcessingDays < 125 ? "up" : "down"}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Claims by Phase */}
          <div className="lg:col-span-2 bg-skinz-bg-secondary rounded-xl p-6 border border-skinz-border">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              Claims Processing Pipeline
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={claimsByPhase} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#666" />
                <YAxis dataKey="phase" type="category" stroke="#666" width={150} tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#00ffff">
                  {claimsByPhase.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Processing Time Trends */}
          <div className="bg-skinz-bg-secondary rounded-xl p-6 border border-skinz-border">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Processing Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={processingTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="days" stroke="#00ffff" strokeWidth={2} />
                <Line type="monotone" dataKey="target" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Claims Table */}
        <div className="bg-skinz-bg-secondary rounded-xl border border-skinz-border">
          {/* Table Header with Filters */}
          <div className="p-4 border-b border-skinz-border">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search claims..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-skinz-bg-tertiary text-white pl-10 pr-4 py-2 rounded-lg border border-skinz-border focus:border-skinz-accent focus:outline-none"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-skinz-bg-tertiary text-white px-4 py-2 rounded-lg border border-skinz-border"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="DENIED">Denied</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-skinz-bg-tertiary text-white px-4 py-2 rounded-lg border border-skinz-border"
              >
                <option value="all">All Types</option>
                <option value="COMPENSATION">Compensation</option>
                <option value="PENSION">Pension</option>
                <option value="EDUCATION">Education</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-skinz-bg-tertiary text-white px-4 py-2 rounded-lg border border-skinz-border"
              >
                <option value="date">Sort by Date</option>
                <option value="status">Sort by Status</option>
                <option value="type">Sort by Type</option>
                <option value="veteran">Sort by Veteran</option>
              </select>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-skinz-border">
                  <th className="text-left p-4 text-xs font-medium text-gray-400 uppercase">Claim Number</th>
                  <th className="text-left p-4 text-xs font-medium text-gray-400 uppercase">Veteran</th>
                  <th className="text-left p-4 text-xs font-medium text-gray-400 uppercase">Type</th>
                  <th className="text-left p-4 text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="text-left p-4 text-xs font-medium text-gray-400 uppercase">Filed Date</th>
                  <th className="text-left p-4 text-xs font-medium text-gray-400 uppercase">Est. Completion</th>
                  <th className="text-left p-4 text-xs font-medium text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims.slice(0, 10).map((claim, index) => (
                  <tr 
                    key={`${claim.veteranId}-${claim.claimNumber}-${index}`} 
                    className="border-b border-skinz-border/50 hover:bg-skinz-bg-tertiary/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-cyan-400" />
                        <span className="text-white font-medium">{claim.claimNumber}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-white">{claim.veteranName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-gray-500 text-xs">{claim.ssn}</p>
                          {claim.dischargeStatus && (
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              claim.dischargeStatus === 'HONORABLE' ? 'bg-green-500/20 text-green-400' :
                              claim.dischargeStatus === 'GENERAL' ? 'bg-blue-500/20 text-blue-400' :
                              claim.dischargeStatus === 'OTHER_THAN_HONORABLE' ? 'bg-yellow-500/20 text-yellow-400' :
                              claim.dischargeStatus === 'BAD_CONDUCT' ? 'bg-orange-500/20 text-orange-400' :
                              claim.dischargeStatus === 'DISHONORABLE' ? 'bg-red-500/20 text-red-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {claim.dischargeStatus.replace(/_/g, ' ')}
                            </span>
                          )}
                          {claim.disabilityRating > 0 && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">
                              {claim.disabilityRating}%
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-300">{claim.type}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        claim.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
                        claim.status === 'DENIED' ? 'bg-red-500/20 text-red-400' :
                        claim.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300 text-sm">
                      {new Date(claim.filingDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-gray-300 text-sm">
                      {claim.estimatedCompletionDate ? 
                        new Date(claim.estimatedCompletionDate).toLocaleDateString() : 
                        'TBD'
                      }
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleClaimClick(claim)}
                          className="p-1.5 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 bg-gray-600 text-gray-300 rounded hover:bg-gray-500 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 bg-gray-600 text-gray-300 rounded hover:bg-gray-500 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-4 border-t border-skinz-border flex justify-between items-center">
            <p className="text-gray-400 text-sm">
              Showing 1-10 of {filteredClaims.length} claims
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-skinz-bg-tertiary text-white rounded hover:bg-skinz-bg-primary transition-colors">
                Previous
              </button>
              <button className="px-3 py-1 bg-skinz-bg-tertiary text-white rounded hover:bg-skinz-bg-primary transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Metric Card Component
function MetricCard({ title, value, icon, color, change, trend, subtitle, percentage }: any) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    yellow: 'from-yellow-500 to-yellow-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <div className="bg-skinz-bg-secondary rounded-xl p-5 border border-skinz-border">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 bg-gradient-to-br ${colorClasses[color as string] || 'from-gray-500 to-gray-600'} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
        {(change || trend) && (
          <div className={`flex items-center gap-1 text-xs ${
            trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'
          }`}>
            {trend === 'up' ? <ArrowUp className="w-3 h-3" /> : trend === 'down' ? <ArrowDown className="w-3 h-3" /> : null}
            {change}
          </div>
        )}
        {percentage && (
          <span className="text-xs text-gray-400">{percentage}%</span>
        )}
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-gray-400">{title}</p>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      )}
    </div>
  );
}