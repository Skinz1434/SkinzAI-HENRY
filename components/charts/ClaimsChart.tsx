'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ClaimStatus } from '@/types';

interface ClaimsChartProps {
  data?: Record<ClaimStatus, number>;
}

const COLORS = {
  PENDING: '#3b82f6',
  UNDER_REVIEW: '#8b5cf6',
  GATHERING_EVIDENCE: '#ec4899',
  PENDING_DECISION: '#f59e0b',
  APPROVED: '#10b981',
  DENIED: '#ef4444',
  APPEALED: '#6366f1'
};

export function ClaimsChart({ data }: ClaimsChartProps) {
  const chartData = data ? Object.entries(data).map(([status, value]) => ({
    name: status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
    value,
    status
  })) : [
    { name: 'Pending', value: 423, status: 'PENDING' },
    { name: 'Under Review', value: 856, status: 'UNDER_REVIEW' },
    { name: 'Gathering Evidence', value: 234, status: 'GATHERING_EVIDENCE' },
    { name: 'Pending Decision', value: 145, status: 'PENDING_DECISION' },
    { name: 'Approved', value: 1523, status: 'APPROVED' },
    { name: 'Denied', value: 89, status: 'DENIED' },
    { name: 'Appealed', value: 151, status: 'APPEALED' }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      return (
        <div className="glass-morphism px-3 py-2 rounded-lg">
          <p className="text-white font-medium">{payload[0].name}</p>
          <p className="text-gray-400 text-sm">{payload[0].value} claims</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="grid grid-cols-2 gap-2 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-400 text-xs">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.status as keyof typeof COLORS]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
}