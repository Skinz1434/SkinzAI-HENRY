'use client';

import React from 'react';
import { VeteranProfileEnhanced } from '@/lib/veteran-profile-enhanced';
import { DollarSign, GraduationCap, Home, Heart, Shield, TrendingUp, Calendar, CheckCircle, XCircle, Clock, Award, CreditCard } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface BenefitsProfileProps {
  veteran: VeteranProfileEnhanced;
}

export default function BenefitsProfile({ veteran }: BenefitsProfileProps) {
  // Calculate total monthly benefits
  const totalMonthlyBenefits = veteran.benefits.monthlyAmount;
  
  // Benefits breakdown for pie chart
  const benefitsBreakdown = [
    { name: 'Disability Compensation', value: veteran.benefits.monthlyAmount * 0.7, color: '#00F0FF' },
    { name: 'Education', value: veteran.benefits.monthlyAmount * 0.15, color: '#FF6B6B' },
    { name: 'Housing', value: veteran.benefits.monthlyAmount * 0.1, color: '#4ECDC4' },
    { name: 'Other', value: veteran.benefits.monthlyAmount * 0.05, color: '#95E1D3' },
  ];

  // GI Bill usage data
  const giBillData = [
    { name: 'Used', value: veteran.benefits.education.giBlllUsed, color: '#FF6B6B' },
    { name: 'Remaining', value: veteran.benefits.education.giBlllRemaining, color: '#00F0FF' },
  ];

  return (
    <div className="space-y-6">
      {/* Benefits Overview */}
      <div className="bg-gradient-to-br from-skinz-bg-secondary to-skinz-bg-tertiary backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-skinz-accent to-skinz-primary rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Benefits Summary</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-2">Total Monthly Benefits</p>
            <p className="text-white font-bold text-3xl">${totalMonthlyBenefits.toLocaleString()}</p>
            <p className="text-skinz-accent text-sm mt-2">{veteran.benefits.compensationType}</p>
          </div>
          
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-2">Annual Benefits</p>
            <p className="text-white font-bold text-3xl">${(totalMonthlyBenefits * 12).toLocaleString()}</p>
            <p className="text-green-400 text-sm mt-2">+3.2% COLA Adjustment</p>
          </div>
          
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-2">Dependents</p>
            <p className="text-white font-bold text-3xl">{veteran.benefits.dependents}</p>
            <p className="text-skinz-text-secondary text-sm mt-2">Eligible for benefits</p>
          </div>
        </div>
        
        {/* Benefits Breakdown Chart */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-skinz-text-secondary text-sm mb-3">Benefits Distribution</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={benefitsBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {benefitsBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `$${value.toFixed(2)}`}
                    contentStyle={{ backgroundColor: '#1a1d23', border: '1px solid #333' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-2">
              {benefitsBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                    <span className="text-skinz-text-secondary">{item.name}</span>
                  </div>
                  <span className="text-white font-medium">${item.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-skinz-text-secondary text-sm mb-3">Monthly Trend</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { month: 'Jul', amount: totalMonthlyBenefits - 200 },
                  { month: 'Aug', amount: totalMonthlyBenefits - 150 },
                  { month: 'Sep', amount: totalMonthlyBenefits - 100 },
                  { month: 'Oct', amount: totalMonthlyBenefits },
                  { month: 'Nov', amount: totalMonthlyBenefits },
                  { month: 'Dec', amount: totalMonthlyBenefits + 50 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    formatter={(value: number) => `$${value}`}
                    contentStyle={{ backgroundColor: '#1a1d23', border: '1px solid #333' }}
                  />
                  <Bar dataKey="amount" fill="#00F0FF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Eligibility Status */}
      {veteran.profileServices?.eligibility && (
        <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Benefits Eligibility</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(veteran.profileServices.eligibility).map(([key, value]) => (
              <div key={key} className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-medium">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </p>
                  {'eligible' in value && value.eligible ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <p className={`text-sm ${'eligible' in value && value.eligible ? 'text-green-400' : 'text-red-400'}`}>
                  {'eligible' in value && value.eligible ? 'Eligible' : 'Not Eligible'}
                </p>
                {'enrollmentDate' in value && value.enrollmentDate && (
                  <p className="text-skinz-text-secondary text-xs mt-1">
                    Enrolled: {new Date(value.enrollmentDate).toLocaleDateString()}
                  </p>
                )}
                {'expirationDate' in value && (value as any).expirationDate && (
                  <p className="text-skinz-text-secondary text-xs mt-1">
                    Expires: {new Date((value as any).expirationDate).toLocaleDateString()}
                  </p>
                )}
                {'percentageUsed' in value && (value as any).percentageUsed !== undefined && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-skinz-text-secondary">Usage</span>
                      <span className="text-white">{(value as any).percentageUsed}%</span>
                    </div>
                    <div className="w-full bg-skinz-bg-primary rounded-full h-2">
                      <div 
                        className="bg-skinz-accent h-2 rounded-full"
                        style={{ width: `${(value as any).percentageUsed}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Benefits */}
      <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Education Benefits</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-skinz-text-secondary text-sm mb-3">GI Bill Usage</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={giBillData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {giBillData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `${value} months`}
                    contentStyle={{ backgroundColor: '#1a1d23', border: '1px solid #333' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-skinz-text-secondary">Months Used</span>
                <span className="text-white font-medium">{veteran.benefits.education.giBlllUsed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-skinz-text-secondary">Months Remaining</span>
                <span className="text-white font-medium">{veteran.benefits.education.giBlllRemaining}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {veteran.benefits.education.degreeProgram && (
              <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
                <p className="text-skinz-text-secondary text-sm mb-1">Current Program</p>
                <p className="text-white font-semibold">{veteran.benefits.education.degreeProgram}</p>
              </div>
            )}
            
            {veteran.benefits.education.school && (
              <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
                <p className="text-skinz-text-secondary text-sm mb-1">Institution</p>
                <p className="text-white font-semibold">{veteran.benefits.education.school}</p>
              </div>
            )}
            
            <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
              <p className="text-skinz-text-secondary text-sm mb-1">Monthly Housing Allowance</p>
              <p className="text-white font-semibold text-xl">$2,145</p>
            </div>
            
            <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
              <p className="text-skinz-text-secondary text-sm mb-1">Book Stipend</p>
              <p className="text-white font-semibold">$1,000/year</p>
            </div>
          </div>
        </div>
      </div>

      {/* Healthcare Benefits */}
      <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Healthcare Benefits</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-skinz-text-secondary text-sm">Enrollment Status</p>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Active</span>
            </div>
            <p className="text-white font-semibold text-lg">Priority Group {veteran.benefits.healthcare.priorityGroup}</p>
            <p className="text-skinz-text-secondary text-sm mt-2">
              Enrolled: {new Date(veteran.benefits.healthcare.enrollmentDate).toLocaleDateString()}
            </p>
          </div>
          
          <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-3">Primary Facility</p>
            <p className="text-white font-semibold">{veteran.benefits.healthcare.facility}</p>
            <p className="text-skinz-text-secondary text-sm mt-2">
              Copay Status: <span className={veteran.benefits.healthcare.copayStatus === 'Exempt' ? 'text-green-400' : 'text-yellow-400'}>
                {veteran.benefits.healthcare.copayStatus}
              </span>
            </p>
          </div>
          
          <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-3">Dental Coverage</p>
            <p className="text-white font-semibold">Class IIA</p>
            <p className="text-skinz-text-secondary text-sm mt-2">Service-connected dental conditions</p>
          </div>
          
          <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-3">Vision Coverage</p>
            <p className="text-white font-semibold">Full Coverage</p>
            <p className="text-skinz-text-secondary text-sm mt-2">Routine eye exams and glasses</p>
          </div>
        </div>
      </div>

      {/* Housing Benefits */}
      <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Housing Benefits</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-skinz-text-secondary text-sm">VA Loan Status</p>
              {veteran.benefits.housing.hasVALoan ? (
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Active</span>
              ) : (
                <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded">Available</span>
              )}
            </div>
            {veteran.benefits.housing.loanAmount && (
              <>
                <p className="text-white font-semibold text-xl">
                  ${veteran.benefits.housing.loanAmount.toLocaleString()}
                </p>
                <p className="text-skinz-text-secondary text-sm mt-2">Current loan amount</p>
              </>
            )}
            {!veteran.benefits.housing.hasVALoan && (
              <p className="text-skinz-text-secondary text-sm">Eligible for VA home loan guarantee</p>
            )}
          </div>
          
          {veteran.benefits.housing.propertyAddress && (
            <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
              <p className="text-skinz-text-secondary text-sm mb-3">Property Address</p>
              <p className="text-white">{veteran.benefits.housing.propertyAddress}</p>
            </div>
          )}
          
          <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-3">Entitlement</p>
            <p className="text-white font-semibold">Full Entitlement</p>
            <p className="text-skinz-text-secondary text-sm mt-2">No limit on loan amount</p>
          </div>
          
          <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-3">Funding Fee</p>
            <p className="text-white font-semibold">Exempt</p>
            <p className="text-skinz-text-secondary text-sm mt-2">Due to service-connected disability</p>
          </div>
        </div>
      </div>

      {/* Additional Benefits */}
      <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Additional Benefits</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
            <Shield className="w-5 h-5 text-blue-400 mb-2" />
            <p className="text-white font-medium">Life Insurance</p>
            <p className="text-skinz-text-secondary text-sm mt-1">SGLI: $400,000 coverage</p>
          </div>
          
          <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
            <CreditCard className="w-5 h-5 text-green-400 mb-2" />
            <p className="text-white font-medium">Travel Reimbursement</p>
            <p className="text-skinz-text-secondary text-sm mt-1">For VA medical appointments</p>
          </div>
          
          <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
            <Calendar className="w-5 h-5 text-purple-400 mb-2" />
            <p className="text-white font-medium">Vocational Rehabilitation</p>
            <p className="text-skinz-text-secondary text-sm mt-1">Chapter 31 eligible</p>
          </div>
          
          <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
            <Home className="w-5 h-5 text-yellow-400 mb-2" />
            <p className="text-white font-medium">Property Tax Exemption</p>
            <p className="text-skinz-text-secondary text-sm mt-1">100% disabled veteran</p>
          </div>
          
          <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
            <TrendingUp className="w-5 h-5 text-red-400 mb-2" />
            <p className="text-white font-medium">Commissary Access</p>
            <p className="text-skinz-text-secondary text-sm mt-1">Lifetime privilege</p>
          </div>
          
          <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
            <Clock className="w-5 h-5 text-cyan-400 mb-2" />
            <p className="text-white font-medium">Space-A Travel</p>
            <p className="text-skinz-text-secondary text-sm mt-1">Category VI eligible</p>
          </div>
        </div>
      </div>
    </div>
  );
}