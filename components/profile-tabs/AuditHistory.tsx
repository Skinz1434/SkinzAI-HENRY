'use client';

import React from 'react';
import { VeteranProfileEnhanced } from '@/lib/veteran-profile-enhanced';
import { History, User, Calendar, Activity, Shield, AlertCircle, CheckCircle } from 'lucide-react';

interface AuditHistoryProps {
  veteran: VeteranProfileEnhanced;
}

export default function AuditHistory({ veteran }: AuditHistoryProps) {
  const auditTrail = veteran.auditTrail || [];
  
  const getActionIcon = (action: string) => {
    if (action.includes('Update')) return <Activity className="w-4 h-4" />;
    if (action.includes('Access')) return <Shield className="w-4 h-4" />;
    if (action.includes('Claim')) return <CheckCircle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };
  
  const getActionColor = (action: string) => {
    if (action.includes('Update')) return 'text-blue-400';
    if (action.includes('Access')) return 'text-green-400';
    if (action.includes('Claim')) return 'text-yellow-400';
    return 'text-gray-400';
  };
  
  return (
    <div className="space-y-6">
      {/* Audit Overview */}
      <div className="bg-gradient-to-br from-skinz-bg-secondary to-skinz-bg-tertiary backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-skinz-accent to-skinz-primary rounded-lg flex items-center justify-center">
            <History className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Audit Trail & Activity History</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-2">Total Activities</p>
            <p className="text-white font-bold text-2xl">{auditTrail.length}</p>
          </div>
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-2">Last Activity</p>
            <p className="text-white font-bold">
              {auditTrail[0] ? new Date(auditTrail[0].timestamp).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-2">Active Users</p>
            <p className="text-white font-bold text-2xl">
              {[...new Set(auditTrail.map((a: any) => a.user))].length}
            </p>
          </div>
        </div>
        
        {/* Activity Timeline */}
        <div className="space-y-3">
          <h4 className="text-white font-medium mb-3">Recent Activity</h4>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {auditTrail.slice(0, 20).map((activity: any, index: number) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-skinz-bg-tertiary/30 rounded-lg hover:bg-skinz-bg-tertiary/50 transition-colors">
                <div className={`mt-1 ${getActionColor(activity.action)}`}>
                  {getActionIcon(activity.action)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white text-sm font-medium">{activity.action}</p>
                      <p className="text-skinz-text-secondary text-xs mt-1">{activity.details}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-skinz-text-secondary text-xs">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </p>
                      <p className="text-skinz-text-secondary text-xs">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <User className="w-3 h-3 text-skinz-text-secondary" />
                    <p className="text-skinz-text-secondary text-xs">{activity.user}</p>
                    {activity.system && (
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded ml-2">
                        {activity.system}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Access Log */}
      <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Access Log</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-skinz-border">
                <th className="text-left text-skinz-text-secondary text-sm font-medium pb-3">Date/Time</th>
                <th className="text-left text-skinz-text-secondary text-sm font-medium pb-3">User</th>
                <th className="text-left text-skinz-text-secondary text-sm font-medium pb-3">Action</th>
                <th className="text-left text-skinz-text-secondary text-sm font-medium pb-3">System</th>
              </tr>
            </thead>
            <tbody>
              {auditTrail.filter((a: any) => a.action.includes('Access')).slice(0, 10).map((log: any, index: number) => (
                <tr key={index} className="border-b border-skinz-border/30">
                  <td className="py-3 text-white text-sm">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 text-white text-sm">{log.user}</td>
                  <td className="py-3 text-white text-sm">{log.action}</td>
                  <td className="py-3">
                    <span className="text-xs bg-skinz-accent/20 text-skinz-accent px-2 py-1 rounded">
                      {log.system}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}