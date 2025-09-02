'use client';

import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadialBarChart, RadialBar, Treemap
} from 'recharts';
import {
  Activity, TrendingUp, Users, FileText, CheckCircle, AlertCircle,
  Clock, DollarSign, Shield, Heart, Award, Target, Zap, Database,
  Globe, RefreshCw, AlertTriangle, Info, ArrowUp, ArrowDown, Minus
} from 'lucide-react';

interface OverviewEnhancedProps {
  accuracy: number;
  veteranCount: number;
  veterans?: any[];
}

export default function OverviewEnhanced({ accuracy, veteranCount, veterans = [] }: OverviewEnhancedProps) {
  // Calculate real metrics from veterans data
  const activeClaimsCount = veterans.reduce((sum, v) => sum + (v.claims?.filter((c: any) => c.status === 'PENDING').length || 0), 0);
  const avgDisabilityRating = veterans.reduce((sum, v) => sum + (v.disabilityRating || 0), 0) / (veterans.length || 1);
  const syncSuccessRate = veterans.filter(v => v.vetProfileSyncStatus?.status === 'success').length / (veterans.length || 1) * 100;

  // Mock time series data
  const performanceData = [
    { time: '00:00', accuracy: 96.5, response: 142, veterans: 2450 },
    { time: '04:00', accuracy: 97.1, response: 128, veterans: 2465 },
    { time: '08:00', accuracy: 97.3, response: 156, veterans: 2512 },
    { time: '12:00', accuracy: 97.8, response: 134, veterans: 2587 },
    { time: '16:00', accuracy: 97.5, response: 145, veterans: 2634 },
    { time: '20:00', accuracy: 97.2, response: 138, veterans: 2678 },
    { time: 'Now', accuracy: accuracy, response: 125, veterans: veteranCount }
  ];

  const claimsByType = [
    { type: 'Compensation', count: 1245, percentage: 36 },
    { type: 'Pension', count: 856, percentage: 25 },
    { type: 'Education', count: 687, percentage: 20 },
    { type: 'Healthcare', count: 445, percentage: 13 },
    { type: 'Other', count: 188, percentage: 6 }
  ];

  const systemHealth = [
    { name: 'MPD Database', status: 'operational', uptime: 99.99, responseTime: 45 },
    { name: 'Vet Profile API', status: 'operational', uptime: 99.97, responseTime: 142 },
    { name: 'Claims Service', status: 'operational', uptime: 99.95, responseTime: 234 },
    { name: 'Document Store', status: 'degraded', uptime: 98.5, responseTime: 567 },
    { name: 'Analytics Engine', status: 'operational', uptime: 100, responseTime: 89 }
  ];

  const riskDistribution = [
    { risk: 'Low', veterans: 1876, color: '#10b981' },
    { risk: 'Medium', veterans: 542, color: '#f59e0b' },
    { risk: 'High', veterans: 198, color: '#ef4444' },
    { risk: 'Critical', veterans: 62, color: '#991b1b' }
  ];

  return (
    <div className="space-y-6">
      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <KPICard
          title="Vet Profile Accuracy"
          value={`${accuracy.toFixed(1)}%`}
          target="97.0%"
          trend={accuracy > 97 ? 'up' : 'down'}
          sparkline={[96, 96.5, 97, 97.2, 97.5, accuracy]}
          icon={<Target className="w-5 h-5" />}
          color="cyan"
        />
        <KPICard
          title="Total Veterans"
          value={veteranCount.toLocaleString()}
          change="+4.2%"
          trend="up"
          sparkline={[2400, 2450, 2500, 2550, 2600, veteranCount]}
          icon={<Users className="w-5 h-5" />}
          color="blue"
        />
        <KPICard
          title="Active Claims"
          value={activeClaimsCount.toLocaleString()}
          change="-12.3%"
          trend="down"
          sparkline={[3800, 3600, 3500, 3450, 3421, activeClaimsCount]}
          icon={<FileText className="w-5 h-5" />}
          color="purple"
        />
        <KPICard
          title="Avg Rating"
          value={`${avgDisabilityRating.toFixed(0)}%`}
          change="+2.1%"
          trend="up"
          sparkline={[68, 69, 70, 71, 72, avgDisabilityRating]}
          icon={<Heart className="w-5 h-5" />}
          color="red"
        />
        <KPICard
          title="System Uptime"
          value="99.98%"
          status="Operational"
          trend="stable"
          sparkline={[99.95, 99.96, 99.97, 99.98, 99.98, 99.98]}
          icon={<Shield className="w-5 h-5" />}
          color="green"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Performance Chart */}
        <div className="bg-skinz-bg-secondary rounded-xl p-6 border border-skinz-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">System Performance</h3>
            <div className="flex gap-2">
              <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">Live</span>
              <span className="text-xs text-gray-400">Last 24h</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ffff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00ffff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" stroke="#666" />
              <YAxis stroke="#666" domain={[95, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                labelStyle={{ color: '#fff' }}
              />
              <Area 
                type="monotone" 
                dataKey="accuracy" 
                stroke="#00ffff" 
                fill="url(#accuracyGradient)" 
                strokeWidth={2}
              />
              <Line type="monotone" dataKey="response" stroke="#f59e0b" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Claims Distribution */}
        <div className="bg-skinz-bg-secondary rounded-xl p-6 border border-skinz-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Claims by Type</h3>
            <select className="bg-skinz-bg-tertiary text-white text-sm rounded px-2 py-1 border border-skinz-border">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Quarter</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={claimsByType}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="count"
              >
                {claimsByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#00ffff', '#3b82f6', '#8b5cf6', '#f59e0b', '#6b7280'][index]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                labelStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {claimsByType.map((type, index) => (
              <div key={type.type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: ['#00ffff', '#3b82f6', '#8b5cf6', '#f59e0b', '#6b7280'][index] }} />
                  <span className="text-xs text-gray-400">{type.type}</span>
                </div>
                <span className="text-xs text-white font-medium">{type.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Health & Risk Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health Status */}
        <div className="bg-skinz-bg-secondary rounded-xl p-6 border border-skinz-border">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            System Health
          </h3>
          <div className="space-y-3">
            {systemHealth.map((system) => (
              <div key={system.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${system.status === 'operational' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                  <span className="text-sm text-white">{system.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400">{system.responseTime}ms</span>
                  <span className={`text-xs ${system.uptime > 99 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {system.uptime}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-skinz-bg-secondary rounded-xl p-6 border border-skinz-border">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Risk Distribution
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={riskDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="risk" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="veterans" fill="#00ffff">
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="bg-skinz-bg-secondary rounded-xl p-6 border border-skinz-border">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg px-4 py-3 text-sm font-medium transition-colors flex items-center justify-between">
              <span>Run Full Sync</span>
              <RefreshCw className="w-4 h-4" />
            </button>
            <button className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg px-4 py-3 text-sm font-medium transition-colors flex items-center justify-between">
              <span>Generate Report</span>
              <FileText className="w-4 h-4" />
            </button>
            <button className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg px-4 py-3 text-sm font-medium transition-colors flex items-center justify-between">
              <span>Export Data</span>
              <Database className="w-4 h-4" />
            </button>
            <button className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg px-4 py-3 text-sm font-medium transition-colors flex items-center justify-between">
              <span>System Diagnostics</span>
              <Shield className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-skinz-bg-secondary rounded-xl p-6 border border-skinz-border">
        <h3 className="text-lg font-semibold text-white mb-4">Real-time Activity Feed</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          <ActivityItem type="success" message="Vet Profile sync completed for batch #2847" time="Just now" />
          <ActivityItem type="warning" message="High latency detected on Claims Service" time="2 min ago" />
          <ActivityItem type="info" message="New veteran registration: VET-2679" time="5 min ago" />
          <ActivityItem type="success" message="Claim CL2024-0892 approved" time="12 min ago" />
          <ActivityItem type="error" message="DD-214 fallback triggered for VET-2456" time="18 min ago" />
          <ActivityItem type="info" message="System backup completed successfully" time="25 min ago" />
          <ActivityItem type="success" message="Batch processing completed: 250 records" time="32 min ago" />
          <ActivityItem type="warning" message="Document upload queue at 85% capacity" time="45 min ago" />
        </div>
      </div>
    </div>
  );
}

// KPI Card Component
function KPICard({ title, value, change, target, status, trend, sparkline, icon, color }: any) {
  const colorClasses: Record<string, string> = {
    cyan: 'from-cyan-500 to-cyan-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-green-600'
  };

  return (
    <div className="bg-skinz-bg-secondary rounded-xl p-5 border border-skinz-border hover:border-skinz-accent/50 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 bg-gradient-to-br ${colorClasses[color as string] || 'from-gray-500 to-gray-600'} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs ${
            trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'
          }`}>
            {trend === 'up' ? <ArrowUp className="w-3 h-3" /> : trend === 'down' ? <ArrowDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            {change || target || status}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-gray-400">{title}</p>
      {sparkline && (
        <div className="mt-3 h-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkline.map((v: number, i: number) => ({ value: v }))}>
              <Line type="monotone" dataKey="value" stroke={color === 'cyan' ? '#00ffff' : '#3b82f6'} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// Activity Item Component
function ActivityItem({ type, message, time }: any) {
  const icons: Record<string, React.ReactNode> = {
    success: <CheckCircle className="w-4 h-4 text-green-400" />,
    warning: <AlertCircle className="w-4 h-4 text-yellow-400" />,
    error: <AlertTriangle className="w-4 h-4 text-red-400" />,
    info: <Info className="w-4 h-4 text-blue-400" />
  };

  return (
    <div className="flex items-start gap-3 p-3 bg-skinz-bg-tertiary/30 rounded-lg">
      {icons[type as string] || <Info className="w-4 h-4 text-gray-400" />}
      <div className="flex-1">
        <p className="text-sm text-white">{message}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
}