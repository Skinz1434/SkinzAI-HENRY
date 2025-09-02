'use client';

import React, { useState } from 'react';
import { VeteranProfileEnhanced } from '@/lib/veteran-profile-enhanced';
import { Scale, FileText, AlertTriangle, Shield, Gavel, Users, DollarSign, CheckCircle, TrendingUp, User } from 'lucide-react';

interface LegalProfileProps {
  veteran: VeteranProfileEnhanced;
}

export default function LegalProfile({ veteran }: LegalProfileProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'poa' | 'attorney' | 'forms'>('overview');
  const legalInfo = veteran.profileServices?.legalInfo;

  const calculateMonthlyAttorneyFees = () => {
    if (!legalInfo?.representation?.privateAttorney) return 0;

    const attorney = legalInfo.representation.privateAttorney;
    const feeStructure = attorney.feeStructure;
    const monthlyBenefits = veteran.benefits?.monthlyAmount || 0;

    if (feeStructure.type === 'percentage' && feeStructure.percentage && feeStructure.monthlyRetainer) {
      // Percentage of monthly benefits + retainer
      const percentageFee = (monthlyBenefits * feeStructure.percentage) / 100;
      return percentageFee + feeStructure.monthlyRetainer;
    } else if (feeStructure.type === 'percentage' && feeStructure.percentage) {
      return (monthlyBenefits * feeStructure.percentage) / 100;
    } else if (feeStructure.hourlyRate && feeStructure.monthlyRetainer) {
      return feeStructure.monthlyRetainer;
    }

    return 0;
  };

  const monthlyFees = calculateMonthlyAttorneyFees();
  const hasProblematicAttorney = legalInfo?.representation?.privateAttorney?.feeStructure?.isProblematic || false;

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-700/50 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: Scale },
          { id: 'poa', label: 'Power of Attorney', icon: Shield },
          { id: 'attorney', label: 'Legal Representation', icon: Gavel },
          { id: 'forms', label: 'VA Forms', icon: FileText }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'poa' | 'attorney' | 'forms')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-600/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Legal Status Overview */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-700 backdrop-blur-md rounded-xl p-6 border border-gray-600">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Legal Status Overview</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Power of Attorney</p>
                <p className="text-white font-semibold text-sm">
                  {legalInfo?.powerOfAttorney?.name || 'Not Designated'}
                </p>
                {legalInfo?.powerOfAttorney && (
                  <p className="text-gray-500 text-xs mt-1">
                    Type: {legalInfo.powerOfAttorney.type}
                  </p>
                )}
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Will Status</p>
                <p className="text-white font-semibold text-sm">
                  {legalInfo?.willStatus ? 'On File' : 'Not on File'}
                </p>
                {legalInfo?.willStatus && (
                  <p className="text-gray-500 text-xs mt-1">
                    Updated: {new Date(legalInfo.willLastUpdated).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Advance Directives</p>
                <p className="text-white font-semibold text-sm">
                  {legalInfo?.advanceDirectives ? 'Completed' : 'Not Completed'}
                </p>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Legal Representation</p>
                <p className="text-white font-semibold text-sm">
                  {legalInfo?.representation?.attorney || 'None'}
                </p>
                {legalInfo?.representation && (
                  <p className="text-gray-500 text-xs mt-1">
                    VSO: {legalInfo.representation.vso}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Red Flag Alert for Problematic Attorneys */}
          {hasProblematicAttorney && (
            <div className="bg-gradient-to-r from-red-600/20 to-red-700/20 border border-red-500/30 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h4 className="text-red-400 font-semibold text-lg mb-2">⚠️ Attorney Fee Alert</h4>
                  <p className="text-red-300 text-sm mb-3">
                    This veteran&apos;s private attorney is charging what appears to be an excessive fee structure.
                    Monthly charges: <span className="font-bold">${monthlyFees.toFixed(2)}</span>
                  </p>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded">
                      Review Attorney Fees
                    </button>
                    <button className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded">
                      Contact Veteran
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm mb-1">Active VA Forms</p>
              <p className="text-2xl font-bold text-cyan-400">
                {legalInfo?.form2122History?.filter(f => f.status === 'Approved').length || 0}
              </p>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm mb-1">POA History</p>
              <p className="text-2xl font-bold text-green-400">
                {legalInfo?.powerOfAttorneyHistory?.length || 0}
              </p>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm mb-1">Monthly Attorney Fees</p>
              <p className={`text-2xl font-bold ${hasProblematicAttorney ? 'text-red-400' : 'text-blue-400'}`}>
                ${monthlyFees.toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Power of Attorney Tab */}
      {activeTab === 'poa' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-700 backdrop-blur-md rounded-xl p-6 border border-gray-600">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Power of Attorney History</h3>
            </div>

            <div className="space-y-4">
              {legalInfo?.powerOfAttorneyHistory?.map((poa, index) => (
                <div key={index} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-white font-medium">{poa.name}</p>
                        <span className={`px-2 py-1 rounded text-xs ${
                          poa.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                          poa.status === 'Revoked' ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {poa.status}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">{poa.type} • {poa.form2122}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        Effective: {new Date(poa.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">
                        {new Date(poa.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8">
                  <p className="text-gray-400">No Power of Attorney history available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Legal Representation Tab */}
      {activeTab === 'attorney' && (
        <div className="space-y-6">
          {legalInfo?.representation?.privateAttorney ? (
            <div className="space-y-6">
              {/* Attorney Profile */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 backdrop-blur-md rounded-xl p-6 border border-gray-600">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Private Attorney Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-medium mb-3">Attorney Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name:</span>
                        <span className="text-white">{legalInfo.representation.privateAttorney.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Firm:</span>
                        <span className="text-white">{legalInfo.representation.privateAttorney.firm}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Bar Number:</span>
                        <span className="text-white">{legalInfo.representation.privateAttorney.barNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Date Hired:</span>
                        <span className="text-white">{new Date(legalInfo.representation.privateAttorney.dateHired).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Phone:</span>
                        <span className="text-white">{legalInfo.representation.privateAttorney.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white text-sm">{legalInfo.representation.privateAttorney.email}</span>
                      </div>
                      <div className="mt-2">
                        <p className="text-gray-400 text-sm">Address:</p>
                        <p className="text-white text-sm">{legalInfo.representation.privateAttorney.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fee Structure - RED FLAG SECTION */}
              <div className={`backdrop-blur-md rounded-xl p-6 border-2 ${
                hasProblematicAttorney
                  ? 'bg-gradient-to-br from-red-900/20 to-red-800/20 border-red-500/50'
                  : 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600'
              }`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    hasProblematicAttorney
                      ? 'bg-gradient-to-br from-red-500 to-red-600'
                      : 'bg-gradient-to-br from-yellow-500 to-yellow-600'
                  }`}>
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Fee Structure & Analysis</h3>
                  {hasProblematicAttorney && (
                    <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold">
                      ⚠️ HIGH RISK
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-medium mb-3">Fee Details</h4>
                    <div className="space-y-3">
                      <div className="bg-gray-700/50 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Fee Type:</span>
                          <span className="text-white capitalize">{legalInfo.representation.privateAttorney.feeStructure.type}</span>
                        </div>
                      </div>

                      {legalInfo.representation.privateAttorney.feeStructure.percentage && (
                        <div className="bg-gray-700/50 rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Percentage Rate:</span>
                            <span className={`font-bold ${
                              legalInfo.representation.privateAttorney.feeStructure.percentage > 25
                                ? 'text-red-400'
                                : legalInfo.representation.privateAttorney.feeStructure.percentage > 15
                                ? 'text-yellow-400'
                                : 'text-green-400'
                            }`}>
                              {legalInfo.representation.privateAttorney.feeStructure.percentage}%
                            </span>
                          </div>
                        </div>
                      )}

                      {legalInfo.representation.privateAttorney.feeStructure.hourlyRate && (
                        <div className="bg-gray-700/50 rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Hourly Rate:</span>
                            <span className="text-white">${legalInfo.representation.privateAttorney.feeStructure.hourlyRate}/hr</span>
                          </div>
                        </div>
                      )}

                      {legalInfo.representation.privateAttorney.feeStructure.monthlyRetainer && (
                        <div className="bg-gray-700/50 rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Monthly Retainer:</span>
                            <span className="text-white">${legalInfo.representation.privateAttorney.feeStructure.monthlyRetainer}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-3">Monthly Cost Analysis</h4>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-400">Veteran&apos;s Monthly VA Benefits:</span>
                        <span className="text-white font-semibold">${veteran.benefits?.monthlyAmount || 0}</span>
                      </div>

                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-400">Monthly Attorney Fees:</span>
                        <span className={`font-bold text-lg ${
                          monthlyFees > (veteran.benefits?.monthlyAmount || 0) * 0.2
                            ? 'text-red-400'
                            : monthlyFees > (veteran.benefits?.monthlyAmount || 0) * 0.1
                            ? 'text-yellow-400'
                            : 'text-green-400'
                        }`}>
                          ${monthlyFees.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Percentage of Benefits:</span>
                        <span className={`font-bold ${
                          (monthlyFees / (veteran.benefits?.monthlyAmount || 1)) * 100 > 20
                            ? 'text-red-400'
                            : (monthlyFees / (veteran.benefits?.monthlyAmount || 1)) * 100 > 10
                            ? 'text-yellow-400'
                            : 'text-green-400'
                        }`}>
                          {((monthlyFees / (veteran.benefits?.monthlyAmount || 1)) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {hasProblematicAttorney && (
                      <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                        <p className="text-red-300 text-sm">
                          <strong>⚠️ Concern:</strong> This fee structure appears excessive.
                          Consider reviewing for veteran protection.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Attorney Performance */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 backdrop-blur-md rounded-xl p-6 border border-gray-600">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Attorney Performance Metrics</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                    <p className="text-gray-400 text-sm mb-1">Success Rate</p>
                    <p className={`text-2xl font-bold ${
                      legalInfo.representation.privateAttorney.performance.successRate > 60
                        ? 'text-green-400'
                        : legalInfo.representation.privateAttorney.performance.successRate > 40
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}>
                      {legalInfo.representation.privateAttorney.performance.successRate.toFixed(0)}%
                    </p>
                  </div>

                  <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                    <p className="text-gray-400 text-sm mb-1">Avg Processing Time</p>
                    <p className={`text-2xl font-bold ${
                      legalInfo.representation.privateAttorney.performance.avgProcessingTime < 120
                        ? 'text-green-400'
                        : legalInfo.representation.privateAttorney.performance.avgProcessingTime < 180
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}>
                      {legalInfo.representation.privateAttorney.performance.avgProcessingTime} days
                    </p>
                  </div>

                  <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                    <p className="text-gray-400 text-sm mb-1">Client Satisfaction</p>
                    <p className={`text-2xl font-bold ${
                      legalInfo.representation.privateAttorney.performance.clientSatisfaction > 80
                        ? 'text-green-400'
                        : legalInfo.representation.privateAttorney.performance.clientSatisfaction > 60
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}>
                      {legalInfo.representation.privateAttorney.performance.clientSatisfaction.toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Cases Handled */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 backdrop-blur-md rounded-xl p-6 border border-gray-600">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Current Cases</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {legalInfo.representation.privateAttorney.cases.map((caseType, index) => (
                    <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                      <p className="text-white font-medium">{caseType}</p>
                      <p className="text-gray-400 text-sm">Active case</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 backdrop-blur-md rounded-xl p-6 border border-gray-600 text-center py-12">
              <User className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No private attorney representation</p>
              <p className="text-gray-500 text-sm mt-2">Veteran is represented by VSO: {legalInfo?.representation?.vso}</p>
            </div>
          )}
        </div>
      )}

      {/* VA Forms Tab */}
      {activeTab === 'forms' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-700 backdrop-blur-md rounded-xl p-6 border border-gray-600">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">VA Form 21-22 History</h3>
            </div>

            <div className="space-y-4">
              {legalInfo?.form2122History?.map((form, index) => (
                <div key={index} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-white font-medium">{form.formId}</p>
                        <span className={`px-2 py-1 rounded text-xs ${
                          form.status === 'Approved' ? 'bg-green-500/20 text-green-400' :
                          form.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {form.status}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">
                        Representative: {form.representative} • Type: {form.type}
                      </p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>Filed: {new Date(form.dateFiled).toLocaleDateString()}</span>
                        <span>Effective: {new Date(form.effectiveDate).toLocaleDateString()}</span>
                        <span>Expires: {new Date(form.expirationDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      {form.status === 'Approved' && (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      )}
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8">
                  <p className="text-gray-400">No VA Form 21-22 history available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Beneficiaries Section (Always Visible) */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 backdrop-blur-md rounded-xl p-6 border border-gray-600">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Beneficiaries</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {legalInfo?.beneficiaries?.map((beneficiary, index) => (
            <div key={index} className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-white font-medium">{beneficiary.name}</p>
              <p className="text-gray-400 text-sm">{beneficiary.relationship}</p>
              <div className="mt-2 text-xs">
                <span className="text-cyan-400 font-semibold">{beneficiary.percentage}%</span>
                <span className="text-gray-500 ml-2">of benefits</span>
              </div>
            </div>
          )) || (
            <div className="col-span-2 text-center py-8">
              <p className="text-gray-400">No beneficiaries designated</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}