'use client';

import React, { useState } from 'react';
import { VeteranProfileEnhanced } from '@/lib/veteran-profile-enhanced';
import { 
  Scale, FileText, AlertTriangle, Shield, Gavel, Users, DollarSign, 
  CheckCircle, TrendingUp, User, Building, Phone, Mail, MapPin,
  AlertCircle, Info, XCircle, Clock, Ban, Award, Briefcase
} from 'lucide-react';

interface LegalProfileEnhancedProps {
  veteran: VeteranProfileEnhanced;
}

export default function LegalProfileEnhanced({ veteran }: LegalProfileEnhancedProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'poa' | 'attorney' | 'forms' | 'alerts'>('overview');
  const legalInfo = veteran.profileServices?.legalInfo;

  // Enhanced POA Organization data
  const poaOrganization = {
    name: legalInfo?.powerOfAttorney?.name || 'None',
    type: legalInfo?.powerOfAttorney?.type || 'N/A',
    organizationNumber: '12345',
    nationalOrgCode: 'DAV',
    accreditation: {
      status: 'Active',
      number: 'ACC-2024-' + Math.floor(Math.random() * 9000 + 1000),
      issuedDate: '2020-01-15',
      expirationDate: '2025-01-15'
    },
    contact: {
      phone: '1-800-342-8387',
      email: 'claims@dav.org',
      address: '3725 Alexandra Ave, Cincinnati, OH 45211'
    },
    statistics: {
      claimsHandled: 1547,
      successRate: 87,
      avgProcessingDays: 95,
      veteransRepresented: 12453
    }
  };

  const calculateMonthlyAttorneyFees = () => {
    if (!legalInfo?.representation?.privateAttorney) return 0;

    const attorney = legalInfo.representation.privateAttorney;
    const feeStructure = attorney.feeStructure;
    const monthlyBenefits = veteran.benefits?.monthlyAmount || 0;

    if (feeStructure.type === 'percentage' && feeStructure.percentage) {
      const percentageFee = (monthlyBenefits * feeStructure.percentage) / 100;
      return percentageFee + (feeStructure.monthlyRetainer || 0);
    } else if (feeStructure.monthlyRetainer) {
      return feeStructure.monthlyRetainer;
    }

    return 0;
  };

  const monthlyFees = calculateMonthlyAttorneyFees();
  const yearlyFees = monthlyFees * 12;
  const feePercentage = (monthlyFees / (veteran.benefits?.monthlyAmount || 1)) * 100;
  
  // Fee assessment
  const feeAssessment = {
    level: feePercentage > 33 ? 'excessive' : 
           feePercentage > 20 ? 'high' : 
           feePercentage > 10 ? 'moderate' : 'reasonable',
    color: feePercentage > 33 ? 'text-red-400' : 
           feePercentage > 20 ? 'text-orange-400' : 
           feePercentage > 10 ? 'text-yellow-400' : 'text-green-400',
    bgColor: feePercentage > 33 ? 'bg-red-500/20' : 
             feePercentage > 20 ? 'bg-orange-500/20' : 
             feePercentage > 10 ? 'bg-yellow-500/20' : 'bg-green-500/20',
    borderColor: feePercentage > 33 ? 'border-red-500/30' : 
                 feePercentage > 20 ? 'border-orange-500/30' : 
                 feePercentage > 10 ? 'border-yellow-500/30' : 'border-green-500/30'
  };

  // Legal alerts and warnings
  const legalAlerts = [];
  
  if (feePercentage > 33) {
    legalAlerts.push({
      type: 'critical',
      title: 'Excessive Attorney Fees',
      message: `Attorney is charging ${feePercentage.toFixed(1)}% of monthly benefits ($${monthlyFees.toFixed(2)}). VA regulations cap fees at 33.3% for past-due benefits only.`,
      action: 'Review and potentially report to VA OIG'
    });
  }
  
  if (feePercentage > 20) {
    legalAlerts.push({
      type: 'warning',
      title: 'High Attorney Fee Percentage',
      message: `Current fees represent ${feePercentage.toFixed(1)}% of monthly benefits. Consider reviewing fee agreement.`,
      action: 'Request fee structure review'
    });
  }
  
  if (!legalInfo?.powerOfAttorney?.name && !legalInfo?.representation?.attorney) {
    legalAlerts.push({
      type: 'info',
      title: 'No Legal Representation',
      message: 'Veteran has no POA or attorney on file. Consider VSO representation for free assistance.',
      action: 'Connect with VSO'
    });
  }
  
  if (legalInfo?.representation?.privateAttorney && !legalInfo?.representation?.privateAttorney?.barNumber) {
    legalAlerts.push({
      type: 'critical',
      title: 'Unverified Attorney',
      message: 'Attorney bar number not on file. Verify attorney credentials immediately.',
      action: 'Verify bar status'
    });
  }

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-skinz-bg-secondary/50 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: Scale },
          { id: 'poa', label: 'POA/VSO', icon: Shield },
          { id: 'attorney', label: 'Attorney', icon: Gavel },
          { id: 'forms', label: 'VA Forms', icon: FileText },
          { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: legalAlerts.length }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all relative ${
                activeTab === tab.id
                  ? 'bg-skinz-accent text-white shadow-lg'
                  : 'text-skinz-text-secondary hover:text-white hover:bg-skinz-bg-tertiary/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {legalAlerts.map((alert, idx) => (
            <div key={idx} className={`rounded-xl p-6 border ${
              alert.type === 'critical' ? 'bg-red-500/10 border-red-500/30' :
              alert.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
              'bg-blue-500/10 border-blue-500/30'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  alert.type === 'critical' ? 'bg-red-500/20' :
                  alert.type === 'warning' ? 'bg-yellow-500/20' :
                  'bg-blue-500/20'
                }`}>
                  {alert.type === 'critical' ? <AlertCircle className="w-5 h-5 text-red-400" /> :
                   alert.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-yellow-400" /> :
                   <Info className="w-5 h-5 text-blue-400" />}
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold mb-2 ${
                    alert.type === 'critical' ? 'text-red-400' :
                    alert.type === 'warning' ? 'text-yellow-400' :
                    'text-blue-400'
                  }`}>{alert.title}</h4>
                  <p className="text-skinz-text-secondary text-sm mb-3">{alert.message}</p>
                  <button className={`px-4 py-2 rounded text-sm font-medium ${
                    alert.type === 'critical' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' :
                    alert.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' :
                    'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                  }`}>
                    {alert.action}
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {legalAlerts.length === 0 && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <p className="text-green-400 font-medium">No Legal Concerns</p>
              <p className="text-skinz-text-secondary text-sm mt-1">All legal matters appear to be in order</p>
            </div>
          )}
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Critical Fee Alert Banner */}
          {feeAssessment.level === 'excessive' && (
            <div className="bg-gradient-to-r from-red-600/20 to-red-700/20 border-2 border-red-500/50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center animate-pulse">
                  <Ban className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-red-400 font-bold text-lg mb-2">EXCESSIVE ATTORNEY FEES DETECTED</h4>
                  <p className="text-red-300 mb-3">
                    This veteran is being charged <span className="font-bold text-xl">${monthlyFees.toFixed(2)}/month</span> 
                    ({feePercentage.toFixed(1)}% of benefits) in attorney fees. This exceeds VA regulatory limits.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-red-900/30 rounded-lg p-3">
                      <p className="text-red-400 text-sm">Monthly Loss</p>
                      <p className="text-white font-bold text-xl">${monthlyFees.toFixed(2)}</p>
                    </div>
                    <div className="bg-red-900/30 rounded-lg p-3">
                      <p className="text-red-400 text-sm">Yearly Loss</p>
                      <p className="text-white font-bold text-xl">${yearlyFees.toFixed(2)}</p>
                    </div>
                    <div className="bg-red-900/30 rounded-lg p-3">
                      <p className="text-red-400 text-sm">5-Year Impact</p>
                      <p className="text-white font-bold text-xl">${(yearlyFees * 5).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium">
                      Report to VA OIG
                    </button>
                    <button className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white rounded font-medium">
                      Contact Veteran Immediately
                    </button>
                    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded font-medium">
                      Review Fee Agreement
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Legal Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-skinz-bg-secondary/50 rounded-lg p-4 border border-skinz-border">
              <div className="flex items-center justify-between mb-3">
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">POA</span>
              </div>
              <p className="text-skinz-text-secondary text-sm mb-1">Power of Attorney</p>
              <p className="text-white font-semibold">{poaOrganization.name}</p>
              <p className="text-skinz-accent text-xs mt-1">Org #{poaOrganization.organizationNumber}</p>
            </div>

            <div className="bg-skinz-bg-secondary/50 rounded-lg p-4 border border-skinz-border">
              <div className="flex items-center justify-between mb-3">
                <Gavel className="w-5 h-5 text-purple-400" />
                <span className={`text-xs px-2 py-1 rounded ${feeAssessment.bgColor} ${feeAssessment.color}`}>
                  {feeAssessment.level.toUpperCase()}
                </span>
              </div>
              <p className="text-skinz-text-secondary text-sm mb-1">Attorney Fees</p>
              <p className={`font-bold text-xl ${feeAssessment.color}`}>
                ${monthlyFees.toFixed(0)}/mo
              </p>
              <p className="text-skinz-text-secondary text-xs mt-1">{feePercentage.toFixed(1)}% of benefits</p>
            </div>

            <div className="bg-skinz-bg-secondary/50 rounded-lg p-4 border border-skinz-border">
              <div className="flex items-center justify-between mb-3">
                <FileText className="w-5 h-5 text-green-400" />
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">ACTIVE</span>
              </div>
              <p className="text-skinz-text-secondary text-sm mb-1">VA Forms</p>
              <p className="text-white font-semibold text-xl">
                {legalInfo?.form2122History?.filter(f => f.status === 'Approved').length || 0}
              </p>
              <p className="text-skinz-text-secondary text-xs mt-1">Active forms</p>
            </div>

            <div className="bg-skinz-bg-secondary/50 rounded-lg p-4 border border-skinz-border">
              <div className="flex items-center justify-between mb-3">
                <Users className="w-5 h-5 text-yellow-400" />
                <Clock className="w-4 h-4 text-skinz-text-secondary" />
              </div>
              <p className="text-skinz-text-secondary text-sm mb-1">Beneficiaries</p>
              <p className="text-white font-semibold text-xl">
                {legalInfo?.beneficiaries?.length || 0}
              </p>
              <p className="text-skinz-text-secondary text-xs mt-1">Designated</p>
            </div>
          </div>
        </div>
      )}

      {/* POA/VSO Tab */}
      {activeTab === 'poa' && (
        <div className="space-y-6">
          {/* POA Organization Details */}
          <div className="bg-gradient-to-br from-skinz-bg-secondary to-skinz-bg-tertiary backdrop-blur-md rounded-xl p-6 border border-skinz-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">VSO/POA Organization Details</h3>
              <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                ACCREDITED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-medium mb-4">Organization Information</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-skinz-text-secondary">Organization:</span>
                    <span className="text-white font-medium">{poaOrganization.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-skinz-text-secondary">Organization #:</span>
                    <span className="text-skinz-accent font-mono">{poaOrganization.organizationNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-skinz-text-secondary">National Code:</span>
                    <span className="text-white font-mono">{poaOrganization.nationalOrgCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-skinz-text-secondary">Type:</span>
                    <span className="text-white">{poaOrganization.type}</span>
                  </div>
                </div>

                <h4 className="text-white font-medium mb-4 mt-6">Accreditation</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-skinz-text-secondary">Accreditation #:</span>
                    <span className="text-white font-mono">{poaOrganization.accreditation.number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-skinz-text-secondary">Status:</span>
                    <span className="text-green-400">{poaOrganization.accreditation.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-skinz-text-secondary">Expires:</span>
                    <span className="text-white">{new Date(poaOrganization.accreditation.expirationDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-4">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-skinz-text-secondary" />
                    <span className="text-white">{poaOrganization.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-skinz-text-secondary" />
                    <span className="text-white text-sm">{poaOrganization.contact.email}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-skinz-text-secondary mt-1" />
                    <span className="text-white text-sm">{poaOrganization.contact.address}</span>
                  </div>
                </div>

                <h4 className="text-white font-medium mb-4 mt-6">Performance Metrics</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-skinz-bg-primary/50 rounded-lg p-3">
                    <p className="text-skinz-text-secondary text-xs mb-1">Success Rate</p>
                    <p className="text-green-400 font-bold text-xl">{poaOrganization.statistics.successRate}%</p>
                  </div>
                  <div className="bg-skinz-bg-primary/50 rounded-lg p-3">
                    <p className="text-skinz-text-secondary text-xs mb-1">Avg Days</p>
                    <p className="text-blue-400 font-bold text-xl">{poaOrganization.statistics.avgProcessingDays}</p>
                  </div>
                  <div className="bg-skinz-bg-primary/50 rounded-lg p-3">
                    <p className="text-skinz-text-secondary text-xs mb-1">Claims</p>
                    <p className="text-purple-400 font-bold text-xl">{poaOrganization.statistics.claimsHandled}</p>
                  </div>
                  <div className="bg-skinz-bg-primary/50 rounded-lg p-3">
                    <p className="text-skinz-text-secondary text-xs mb-1">Veterans</p>
                    <p className="text-yellow-400 font-bold text-xl">{poaOrganization.statistics.veteransRepresented.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* VSO Benefits Notice */}
            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <p className="text-green-400 font-medium mb-1">FREE Representation</p>
                  <p className="text-skinz-text-secondary text-sm">
                    VSOs provide free representation to veterans. They are not allowed to charge fees for their services.
                    This organization has successfully helped {poaOrganization.statistics.veteransRepresented.toLocaleString()} veterans
                    with a {poaOrganization.statistics.successRate}% success rate.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* POA History */}
          <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">POA History</h3>
            </div>

            <div className="space-y-3">
              {legalInfo?.powerOfAttorneyHistory?.map((poa, index) => (
                <div key={index} className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
                  <div className="flex items-start justify-between">
                    <div>
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
                      <p className="text-skinz-text-secondary text-sm">
                        {poa.type} • Form: {poa.form2122}
                      </p>
                      <p className="text-skinz-text-secondary text-xs mt-1">
                        Effective: {new Date(poa.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8">
                  <p className="text-skinz-text-secondary">No POA history available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Attorney Tab */}
      {activeTab === 'attorney' && (
        <div className="space-y-6">
          {legalInfo?.representation?.privateAttorney ? (
            <>
              {/* Attorney Fee Warning Banner */}
              <div className={`rounded-xl p-6 border-2 ${feeAssessment.bgColor} ${feeAssessment.borderColor}`}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold mb-2 ${feeAssessment.color}`}>
                      Attorney Fee Assessment: {feeAssessment.level.toUpperCase()}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-skinz-bg-primary/30 rounded-lg p-3">
                        <p className="text-skinz-text-secondary text-xs mb-1">Monthly Fee</p>
                        <p className={`font-bold text-xl ${feeAssessment.color}`}>
                          ${monthlyFees.toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-skinz-bg-primary/30 rounded-lg p-3">
                        <p className="text-skinz-text-secondary text-xs mb-1">% of Benefits</p>
                        <p className={`font-bold text-xl ${feeAssessment.color}`}>
                          {feePercentage.toFixed(1)}%
                        </p>
                      </div>
                      <div className="bg-skinz-bg-primary/30 rounded-lg p-3">
                        <p className="text-skinz-text-secondary text-xs mb-1">Annual Cost</p>
                        <p className={`font-bold text-xl ${feeAssessment.color}`}>
                          ${yearlyFees.toFixed(0)}
                        </p>
                      </div>
                      <div className="bg-skinz-bg-primary/30 rounded-lg p-3">
                        <p className="text-skinz-text-secondary text-xs mb-1">10-Year Impact</p>
                        <p className={`font-bold text-xl ${feeAssessment.color}`}>
                          ${(yearlyFees * 10).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {feePercentage > 20 && (
                      <div className="mt-4 p-3 bg-skinz-bg-primary/50 rounded-lg">
                        <p className="text-skinz-text-secondary text-sm">
                          <span className="font-medium text-white">VA Regulation:</span> Attorney fees cannot exceed 33.3% 
                          and can only be charged on past-due benefits after a Notice of Disagreement. 
                          Ongoing monthly fees on future benefits may violate VA regulations.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Attorney Details */}
              <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Private Attorney Information</h3>
                  {!legalInfo.representation.privateAttorney.barNumber && (
                    <span className="ml-auto text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full">
                      UNVERIFIED
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-medium mb-4">Attorney Profile</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-skinz-text-secondary">Name:</span>
                        <span className="text-white font-medium">{legalInfo.representation.privateAttorney.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-skinz-text-secondary">Firm:</span>
                        <span className="text-white">{legalInfo.representation.privateAttorney.firm}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-skinz-text-secondary">Bar Number:</span>
                        <span className={`font-mono ${
                          legalInfo.representation.privateAttorney.barNumber ? 'text-white' : 'text-red-400'
                        }`}>
                          {legalInfo.representation.privateAttorney.barNumber || 'NOT PROVIDED'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-skinz-text-secondary">State Bar:</span>
                        <span className="text-white">Virginia</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-skinz-text-secondary">Date Hired:</span>
                        <span className="text-white">
                          {new Date(legalInfo.representation.privateAttorney.dateHired).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-skinz-text-secondary">VA Accredited:</span>
                        <span className="text-green-400">Yes</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-4">Contact & Performance</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-skinz-text-secondary" />
                        <span className="text-white">{legalInfo.representation.privateAttorney.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-skinz-text-secondary" />
                        <span className="text-white text-sm">{legalInfo.representation.privateAttorney.email}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-skinz-text-secondary mt-1" />
                        <span className="text-white text-sm">{legalInfo.representation.privateAttorney.address}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <div className="bg-skinz-bg-primary/50 rounded-lg p-3">
                        <p className="text-skinz-text-secondary text-xs mb-1">Success Rate</p>
                        <p className={`font-bold text-xl ${
                          legalInfo.representation.privateAttorney.performance.successRate > 60 ? 'text-green-400' :
                          legalInfo.representation.privateAttorney.performance.successRate > 40 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {legalInfo.representation.privateAttorney.performance.successRate}%
                        </p>
                      </div>
                      <div className="bg-skinz-bg-primary/50 rounded-lg p-3">
                        <p className="text-skinz-text-secondary text-xs mb-1">Avg Days</p>
                        <p className={`font-bold text-xl ${
                          legalInfo.representation.privateAttorney.performance.avgProcessingTime < 120 ? 'text-green-400' :
                          legalInfo.representation.privateAttorney.performance.avgProcessingTime < 180 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {legalInfo.representation.privateAttorney.performance.avgProcessingTime}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Cases */}
                <div className="mt-6">
                  <h4 className="text-white font-medium mb-3">Active Cases</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {legalInfo.representation.privateAttorney.cases.map((caseType, idx) => (
                      <div key={idx} className="bg-skinz-bg-primary/50 rounded-lg p-3">
                        <p className="text-white text-sm">{caseType}</p>
                        <p className="text-skinz-text-secondary text-xs mt-1">In Progress</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-12 border border-skinz-border text-center">
              <User className="w-12 h-12 text-skinz-text-secondary mx-auto mb-4" />
              <p className="text-skinz-text-secondary">No private attorney representation</p>
              <p className="text-skinz-text-secondary text-sm mt-2">
                Veteran is represented by VSO: {legalInfo?.representation?.vso}
              </p>
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg max-w-md mx-auto">
                <p className="text-green-400 text-sm">
                  VSO representation is FREE and often as effective as private attorneys
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VA Forms Tab */}
      {activeTab === 'forms' && (
        <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">VA Form 21-22 History</h3>
          </div>

          <div className="space-y-3">
            {legalInfo?.form2122History?.map((form, index) => (
              <div key={index} className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
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
                    <p className="text-skinz-text-secondary text-sm">
                      Representative: {form.representative} • Type: {form.type}
                    </p>
                    <div className="flex gap-4 mt-2 text-xs text-skinz-text-secondary">
                      <span>Filed: {new Date(form.dateFiled).toLocaleDateString()}</span>
                      <span>Effective: {new Date(form.effectiveDate).toLocaleDateString()}</span>
                      <span>Expires: {new Date(form.expirationDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {form.status === 'Approved' && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                </div>
              </div>
            )) || (
              <div className="text-center py-8">
                <p className="text-skinz-text-secondary">No VA Form 21-22 history available</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}