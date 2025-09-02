'use client';

import React, { useState } from 'react';
import { VeteranProfileEnhanced } from '@/lib/henry/veteran-profile-enhanced';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, Calendar, ChevronRight, Download, Eye, BarChart3, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import ClaimsDetailModal from '../ClaimsDetailModal';
import { generateDetailedClaim } from '@/lib/va-claims/claims-data';
import { ClaimDetail } from '@/lib/va-claims/claims-types';

interface ClaimsProfileProps {
  veteran: VeteranProfileEnhanced;
}

export default function ClaimsProfile({ veteran }: ClaimsProfileProps) {
  const [selectedClaim, setSelectedClaim] = useState<number | null>(null);
  const [detailedClaim, setDetailedClaim] = useState<ClaimDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Claims status distribution
  const claimsStatusData = [
    { name: 'Approved', value: veteran.claims.filter(c => c.status === 'Approved').length, color: '#10B981' },
    { name: 'Pending', value: veteran.claims.filter(c => c.status === 'Pending Review').length, color: '#F59E0B' },
    { name: 'In Progress', value: veteran.claims.filter(c => c.status === 'Gathering Evidence').length, color: '#3B82F6' },
    { name: 'Denied', value: veteran.claims.filter(c => c.status === 'Denied').length, color: '#EF4444' },
  ];

  // Claims timeline data
  const claimsTimelineData = veteran.claims.slice(0, 6).map(claim => ({
    date: new Date(claim.filingDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    count: Math.floor(Math.random() * 5) + 1,
    rating: claim.rating || 0,
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Pending Review': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Gathering Evidence': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Denied': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="w-4 h-4" />;
      case 'Pending Review': return <Clock className="w-4 h-4" />;
      case 'Gathering Evidence': return <AlertCircle className="w-4 h-4" />;
      case 'Denied': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Claims Overview */}
      <div className="bg-gradient-to-br from-skinz-bg-secondary to-skinz-bg-tertiary backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-skinz-accent to-skinz-primary rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Claims Overview</h3>
          </div>
          {/* Test button to ensure modal works */}
          <button
            onClick={() => {
              console.log('Test button clicked');
              if (veteran.claims && veteran.claims.length > 0) {
                const testClaim = generateDetailedClaim(veteran.claims[0]);
                console.log('Test claim generated:', testClaim);
                setDetailedClaim(testClaim);
                setIsModalOpen(true);
              } else {
                console.log('No claims available');
              }
            }}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            type="button">
            Test Modal (Click Me)
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-2">Total Claims</p>
            <p className="text-white font-bold text-3xl">{veteran.claims.length}</p>
            <p className="text-skinz-text-secondary text-xs mt-2">All time</p>
          </div>
          
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-2">Approved</p>
            <p className="text-green-400 font-bold text-3xl">
              {veteran.claims.filter(c => c.status === 'Approved').length}
            </p>
            <p className="text-skinz-text-secondary text-xs mt-2">
              {((veteran.claims.filter(c => c.status === 'Approved').length / veteran.claims.length) * 100).toFixed(0)}% approval rate
            </p>
          </div>
          
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-2">Pending</p>
            <p className="text-yellow-400 font-bold text-3xl">
              {veteran.claims.filter(c => c.status === 'Pending Review' || c.status === 'Gathering Evidence').length}
            </p>
            <p className="text-skinz-text-secondary text-xs mt-2">Awaiting decision</p>
          </div>
          
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-2">Avg Processing</p>
            <p className="text-white font-bold text-3xl">127</p>
            <p className="text-skinz-text-secondary text-xs mt-2">Days</p>
          </div>
        </div>
        
        {/* Claims Status Distribution */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-skinz-text-secondary text-sm mb-3">Status Distribution</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={claimsStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {claimsStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1d23', border: '1px solid #333' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {claimsStatusData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                  <span className="text-skinz-text-secondary">{item.name}</span>
                  <span className="text-white font-medium ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-skinz-text-secondary text-sm mb-3">Claims Timeline</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={claimsTimelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1d23', border: '1px solid #333' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#00F0FF" 
                    strokeWidth={2}
                    dot={{ fill: '#00F0FF', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Active Claims */}
      <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Active Claims</h3>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 bg-skinz-accent/20 text-skinz-accent px-3 py-1 rounded-lg hover:bg-skinz-accent/30 transition-colors text-sm">
              <Plus className="w-4 h-4" />
              New Claim
            </button>
            <button className="text-skinz-accent hover:text-skinz-primary transition-colors flex items-center gap-1 text-sm">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {veteran.claims.filter(c => c.status !== 'Approved' && c.status !== 'Denied').slice(0, 5).map((claim, index) => (
            <div 
              key={index}
              className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50 hover:border-skinz-accent/50 transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-white font-semibold">{claim.type}</p>
                  <p className="text-skinz-text-secondary text-sm">Claim #{claim.claimNumber}</p>
                </div>
                <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded border ${getStatusColor(claim.status)}`}>
                  {getStatusIcon(claim.status)}
                  {claim.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-skinz-text-secondary">Filed Date</p>
                  <p className="text-white">{new Date(claim.filingDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-skinz-text-secondary">Last Action</p>
                  <p className="text-white">{new Date(claim.lastActionDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-skinz-text-secondary">Est. Completion</p>
                  <p className="text-white">
                    {claim.estimatedCompletion 
                      ? new Date(claim.estimatedCompletion).toLocaleDateString()
                      : 'TBD'}
                  </p>
                </div>
                <div>
                  <p className="text-skinz-text-secondary">Days Pending</p>
                  <p className="text-white">
                    {Math.floor((new Date().getTime() - new Date(claim.filingDate).getTime()) / (1000 * 60 * 60 * 24))}
                  </p>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-skinz-border/50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-skinz-text-secondary text-xs">Last Action</p>
                    <p className="text-white text-sm">{claim.lastAction || 'Pending review'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('View Details clicked for claim:', claim);
                        const detailed = generateDetailedClaim(claim);
                        console.log('Generated detailed claim:', detailed);
                        setDetailedClaim(detailed);
                        setIsModalOpen(true);
                      }}
                      className="flex items-center gap-1 text-sm bg-skinz-accent text-white px-4 py-2 rounded-lg hover:bg-skinz-primary transition-colors font-semibold shadow-lg hover:shadow-xl"
                      type="button">
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button className="flex items-center gap-1 text-xs bg-skinz-bg-primary text-skinz-text-secondary px-3 py-1.5 rounded hover:bg-skinz-bg-tertiary transition-colors">
                      <Download className="w-3 h-3" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Claims History */}
      <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Claims History</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-skinz-border">
                <th className="text-left text-skinz-text-secondary text-sm font-medium pb-3">Claim Number</th>
                <th className="text-left text-skinz-text-secondary text-sm font-medium pb-3">Type</th>
                <th className="text-left text-skinz-text-secondary text-sm font-medium pb-3">Filing Date</th>
                <th className="text-left text-skinz-text-secondary text-sm font-medium pb-3">Status</th>
                <th className="text-left text-skinz-text-secondary text-sm font-medium pb-3">Rating</th>
                <th className="text-left text-skinz-text-secondary text-sm font-medium pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {veteran.claims.map((claim, index) => (
                <tr key={index} className="border-b border-skinz-border/30 hover:bg-skinz-bg-tertiary/20 transition-colors">
                  <td className="py-3 text-white font-mono text-sm">{claim.claimNumber}</td>
                  <td className="py-3 text-white text-sm">{claim.type}</td>
                  <td className="py-3 text-skinz-text-secondary text-sm">
                    {new Date(claim.filingDate).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded border w-fit ${getStatusColor(claim.status)}`}>
                      {getStatusIcon(claim.status)}
                      {claim.status}
                    </span>
                  </td>
                  <td className="py-3">
                    {claim.rating ? (
                      <span className="text-white font-semibold">{claim.rating}%</span>
                    ) : (
                      <span className="text-skinz-text-secondary">-</span>
                    )}
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Table View clicked for claim:', claim);
                          const detailed = generateDetailedClaim(claim);
                          setDetailedClaim(detailed);
                          setIsModalOpen(true);
                        }}
                        className="p-2 bg-skinz-accent/20 text-skinz-accent hover:bg-skinz-accent hover:text-white rounded transition-colors"
                        type="button"
                        title="View Claim Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-skinz-text-secondary hover:text-white transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appeals */}
      {veteran.profileServices?.appeals && veteran.profileServices.appeals.length > 0 && (
        <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Appeals</h3>
          </div>
          
          <div className="space-y-3">
            {veteran.profileServices.appeals.map((appeal, index) => (
              <div key={index} className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-white font-semibold">{appeal.type}</p>
                    <p className="text-skinz-text-secondary text-sm">Appeal #{appeal.id}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    appeal.status === 'Active'
                      ? 'bg-blue-500/20 text-blue-400'
                      : appeal.status === 'Resolved'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {appeal.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-skinz-text-secondary">Filed Date</p>
                    <p className="text-white">{new Date(appeal.issueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-skinz-text-secondary">Docket Number</p>
                    <p className="text-white font-mono">{appeal.docketNumber}</p>
                  </div>
                  <div>
                    <p className="text-skinz-text-secondary">Current Stage</p>
                    <p className="text-white">{appeal.status}</p>
                  </div>
                </div>
                
                {appeal.hearingDate && (
                  <div className="mt-3 pt-3 border-t border-skinz-border/50">
                    <p className="text-skinz-text-secondary text-sm">Hearing Date</p>
                    <p className="text-white text-sm">
                      {new Date(appeal.hearingDate).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Claims Detail Modal */}
      {detailedClaim && (
        <ClaimsDetailModal
          claim={detailedClaim}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setDetailedClaim(null);
          }}
        />
      )}
    </div>
  );
}
