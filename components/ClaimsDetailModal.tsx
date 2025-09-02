'use client';

import React, { useState } from 'react';
import { X, FileText, Clock, CheckCircle, AlertCircle, Calendar, DollarSign, Upload, Download, Eye, ChevronRight, AlertTriangle, Briefcase, UserCheck, Star } from 'lucide-react';
import { ClaimDetail } from '@/lib/va-claims/claims-types';

interface ClaimsDetailModalProps {
  claim: ClaimDetail;
  isOpen: boolean;
  onClose: () => void;
}

export default function ClaimsDetailModal({ claim, isOpen, onClose }: ClaimsDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'evidence' | 'contentions' | 'exams' | 'documents'>('overview');

  if (!isOpen) return null;

  const getPhaseColor = (phase: number) => {
    if (phase <= 2) return 'text-yellow-400';
    if (phase <= 5) return 'text-blue-400';
    if (phase <= 7) return 'text-purple-400';
    return 'text-green-400';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Complete': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'Open': return <Clock className="w-5 h-5 text-blue-400" />;
      case 'Evidence Gathering': return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default: return <AlertTriangle className="w-5 h-5 text-orange-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-skinz-bg-secondary rounded-2xl border border-skinz-border overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-skinz-bg-tertiary to-skinz-bg-secondary p-6 border-b border-skinz-border">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {getStatusIcon(claim.status)}
                <h2 className="text-2xl font-bold text-white">{claim.type} Claim</h2>
                <span className="text-sm bg-skinz-accent/20 text-skinz-accent px-3 py-1 rounded-full">
                  #{claim.claimNumber}
                </span>
              </div>
              <p className="text-skinz-text-secondary">
                Filed: {new Date(claim.filingDate).toLocaleDateString()} • 
                Last Updated: {new Date(claim.lastUpdated).toLocaleDateString()}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-skinz-bg-tertiary rounded-lg transition-colors">
              <X className="w-5 h-5 text-skinz-text-secondary" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-skinz-text-secondary mb-2">
              <span>Phase {claim.phase} of 8</span>
              <span className={getPhaseColor(claim.phase)}>{claim.status}</span>
            </div>
            <div className="w-full bg-skinz-bg-primary rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-skinz-accent to-skinz-primary h-2 rounded-full transition-all"
                style={{ width: `${(claim.phase / 8) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-4 bg-skinz-bg-tertiary border-b border-skinz-border overflow-x-auto">
          {['overview', 'timeline', 'evidence', 'contentions', 'exams', 'documents'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? 'bg-skinz-accent text-white' 
                  : 'text-skinz-text-secondary hover:bg-skinz-bg-secondary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <p className="text-skinz-text-secondary text-sm">Est. Completion</p>
                  </div>
                  <p className="text-white font-bold text-lg">
                    {claim.estimatedCompletion 
                      ? new Date(claim.estimatedCompletion).toLocaleDateString()
                      : 'TBD'}
                  </p>
                </div>
                
                <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-green-400" />
                    <p className="text-skinz-text-secondary text-sm">Contentions</p>
                  </div>
                  <p className="text-white font-bold text-lg">{claim.contentions.length}</p>
                </div>
                
                <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-4 h-4 text-purple-400" />
                    <p className="text-skinz-text-secondary text-sm">Evidence Items</p>
                  </div>
                  <p className="text-white font-bold text-lg">{claim.evidence.length}</p>
                </div>
                
                <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCheck className="w-4 h-4 text-yellow-400" />
                    <p className="text-skinz-text-secondary text-sm">C&P Exams</p>
                  </div>
                  <p className="text-white font-bold text-lg">{claim.exams.length}</p>
                </div>
              </div>

              {/* Regional Office Info */}
              <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border">
                <h3 className="text-white font-semibold mb-3">Processing Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-skinz-text-secondary text-sm">Regional Office</p>
                    <p className="text-white">{claim.regionalOffice}</p>
                  </div>
                  <div>
                    <p className="text-skinz-text-secondary text-sm">Power of Attorney</p>
                    <p className="text-white">{claim.POA}</p>
                  </div>
                  {claim.suspenseDate && (
                    <div>
                      <p className="text-skinz-text-secondary text-sm">Suspense Date</p>
                      <p className="text-yellow-400">{new Date(claim.suspenseDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Decision Info (if available) */}
              {claim.decisionDate && (
                <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg p-4 border border-green-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-5 h-5 text-green-400" />
                    <h3 className="text-white font-semibold">Decision Information</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-skinz-text-secondary text-sm">Decision Date</p>
                      <p className="text-white">{new Date(claim.decisionDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-skinz-text-secondary text-sm">Decision Type</p>
                      <p className="text-white">{claim.decisionType}</p>
                    </div>
                    <div>
                      <p className="text-skinz-text-secondary text-sm">Effective Date</p>
                      <p className="text-white">{claim.effectiveDate ? new Date(claim.effectiveDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    {claim.retroactiveAmount && (
                      <div>
                        <p className="text-skinz-text-secondary text-sm">Retroactive Amount</p>
                        <p className="text-green-400 font-bold">${claim.retroactiveAmount.toLocaleString()}</p>
                      </div>
                    )}
                    {claim.monthlyIncrease && (
                      <div>
                        <p className="text-skinz-text-secondary text-sm">Monthly Increase</p>
                        <p className="text-green-400 font-bold">+${claim.monthlyIncrease}</p>
                      </div>
                    )}
                    {claim.newCombinedRating && (
                      <div>
                        <p className="text-skinz-text-secondary text-sm">New Combined Rating</p>
                        <p className="text-white font-bold">{claim.newCombinedRating}%</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h3 className="text-white font-semibold mb-4">Claim Timeline</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-skinz-border"></div>
                {claim.timeline.map((event, index) => (
                  <div key={event.id} className="relative flex gap-4 mb-6">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                      event.status === 'completed' ? 'bg-green-500' :
                      event.status === 'current' ? 'bg-blue-500' :
                      'bg-gray-500'
                    }`}>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="flex-1 bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-medium">{event.event}</h4>
                        <span className="text-skinz-text-secondary text-sm">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-skinz-text-secondary text-sm">{event.description}</p>
                      <p className="text-skinz-accent text-xs mt-2">By: {event.actor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'contentions' && (
            <div className="space-y-4">
              <h3 className="text-white font-semibold mb-4">Claimed Conditions</h3>
              {claim.contentions.map((contention) => (
                <div key={contention.id} className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-white font-medium">{contention.condition}</h4>
                      {contention.diagnostic_code && (
                        <p className="text-skinz-text-secondary text-sm">Code: {contention.diagnostic_code}</p>
                      )}
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      contention.status === 'Granted' ? 'bg-green-500/20 text-green-400' :
                      contention.status === 'Denied' ? 'bg-red-500/20 text-red-400' :
                      contention.status === 'Deferred' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {contention.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-skinz-text-secondary text-sm">Current Rating</p>
                      <p className="text-white font-bold">{contention.currentRating}%</p>
                    </div>
                    <div>
                      <p className="text-skinz-text-secondary text-sm">Requested Rating</p>
                      <p className="text-white font-bold">{contention.requestedRating}%</p>
                    </div>
                    <div>
                      <p className="text-skinz-text-secondary text-sm">Type</p>
                      <p className="text-white">
                        {contention.presumptive && 'Presumptive'}
                        {contention.bilateral && ' • Bilateral'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold">Evidence Submitted</h3>
                <button className="flex items-center gap-2 bg-skinz-accent/20 text-skinz-accent px-4 py-2 rounded-lg hover:bg-skinz-accent/30 transition-colors">
                  <Upload className="w-4 h-4" />
                  Upload Evidence
                </button>
              </div>
              {claim.evidence.map((evidence) => (
                <div key={evidence.id} className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-white font-medium">{evidence.type}</h4>
                      <p className="text-skinz-text-secondary text-sm">{evidence.description}</p>
                      <p className="text-skinz-text-secondary text-xs mt-2">
                        Source: {evidence.source} • 
                        Period: {new Date(evidence.date_range.start).toLocaleDateString()} - {new Date(evidence.date_range.end).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      evidence.status === 'Submitted' ? 'bg-green-500/20 text-green-400' :
                      evidence.status === 'Received' ? 'bg-blue-500/20 text-blue-400' :
                      evidence.status === 'Requested' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {evidence.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'exams' && (
            <div className="space-y-4">
              <h3 className="text-white font-semibold mb-4">C&P Examinations</h3>
              {claim.exams.map((exam) => (
                <div key={exam.id} className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-white font-medium">{exam.specialty} Exam</h4>
                      <p className="text-skinz-text-secondary text-sm">{exam.type} • {exam.provider}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      exam.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                      exam.status === 'Scheduled' ? 'bg-blue-500/20 text-blue-400' :
                      exam.status === 'No-Show' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {exam.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-skinz-text-secondary text-sm">Location</p>
                      <p className="text-white">{exam.location}</p>
                    </div>
                    <div>
                      <p className="text-skinz-text-secondary text-sm">
                        {exam.completedDate ? 'Completed' : 'Scheduled'}
                      </p>
                      <p className="text-white">
                        {exam.completedDate 
                          ? new Date(exam.completedDate).toLocaleDateString()
                          : exam.scheduledDate 
                          ? new Date(exam.scheduledDate).toLocaleDateString()
                          : 'TBD'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold">Claim Documents</h3>
                <button className="flex items-center gap-2 bg-skinz-accent/20 text-skinz-accent px-4 py-2 rounded-lg hover:bg-skinz-accent/30 transition-colors">
                  <Download className="w-4 h-4" />
                  Download All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {claim.documents.map((doc) => (
                  <div key={doc.id} className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-skinz-accent mt-1" />
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">{doc.name}</h4>
                        <p className="text-skinz-text-secondary text-xs mt-1">{doc.type} • {doc.size}</p>
                        <p className="text-skinz-text-secondary text-xs">
                          Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <button className="text-skinz-accent text-xs hover:underline">View</button>
                          <button className="text-skinz-text-secondary text-xs hover:text-white">Download</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}