'use client';

import React from 'react';
import { VeteranProfileEnhanced } from '@/lib/veteran-profile-enhanced';
import { 
  DollarSign, GraduationCap, Home, Heart, Shield, TrendingUp, Calendar, 
  CheckCircle, XCircle, Clock, Award, CreditCard, AlertTriangle, Info,
  Briefcase, Users, Car, Plane, Building, FileText, Zap, Gift
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface BenefitsProfileEnhancedProps {
  veteran: VeteranProfileEnhanced;
}

export default function BenefitsProfileEnhanced({ veteran }: BenefitsProfileEnhancedProps) {
  // Comprehensive benefit eligibility detection based on veteran's profile
  const detectEligibilities = () => {
    const eligibilities = [];
    
    // Disability Compensation
    if (veteran.mpd?.disabilityRating > 0) {
      eligibilities.push({
        name: 'Disability Compensation',
        eligible: true,
        status: 'Active',
        details: `${veteran.mpd.disabilityRating}% rating - $${veteran.benefits.monthlyAmount}/month`,
        category: 'compensation',
        priority: 1
      });
    }
    
    // SMC (Special Monthly Compensation)
    if (veteran.mpd?.disabilityRating >= 100) {
      eligibilities.push({
        name: 'Special Monthly Compensation (SMC)',
        eligible: true,
        status: veteran.benefits.compensationType === 'Special Monthly' ? 'Receiving' : 'Eligible',
        details: 'Additional compensation for severe disabilities',
        category: 'compensation',
        priority: 2
      });
    }
    
    // Individual Unemployability
    if (veteran.mpd?.disabilityRating >= 60 && veteran.mpd?.disabilityRating < 100) {
      eligibilities.push({
        name: 'Individual Unemployability (IU)',
        eligible: true,
        status: 'Potentially Eligible',
        details: 'Could receive 100% compensation rate if unable to work',
        category: 'compensation',
        priority: 2,
        action: 'Apply for IU benefits'
      });
    }
    
    // PACT Act Benefits
    if (veteran.mpr?.deployments?.length > 0) {
      eligibilities.push({
        name: 'PACT Act Benefits',
        eligible: true,
        status: 'Eligible',
        details: 'Toxic exposure presumptive conditions coverage',
        category: 'healthcare',
        priority: 1,
        action: 'File for presumptive conditions'
      });
    }
    
    // Education Benefits
    if (veteran.benefits.education.giBlllRemaining > 0) {
      eligibilities.push({
        name: 'GI Bill (Post-9/11)',
        eligible: true,
        status: 'Active',
        details: `${veteran.benefits.education.giBlllRemaining} months remaining`,
        category: 'education',
        priority: 1
      });
    }
    
    // Yellow Ribbon Program
    if (veteran.benefits.education.giBlllRemaining > 0) {
      eligibilities.push({
        name: 'Yellow Ribbon Program',
        eligible: true,
        status: 'Available',
        details: 'Additional funding for private school tuition',
        category: 'education',
        priority: 3
      });
    }
    
    // Vocational Rehabilitation (Chapter 31)
    if (veteran.mpd?.disabilityRating >= 20) {
      eligibilities.push({
        name: 'Vocational Rehabilitation (Ch. 31)',
        eligible: true,
        status: 'Eligible',
        details: 'Job training and employment assistance',
        category: 'education',
        priority: 2
      });
    }
    
    // VA Healthcare
    eligibilities.push({
      name: 'VA Healthcare',
      eligible: true,
      status: veteran.benefits.healthcare.enrollmentDate ? 'Enrolled' : 'Eligible',
      details: `Priority Group ${veteran.benefits.healthcare.priorityGroup}`,
      category: 'healthcare',
      priority: 1
    });
    
    // Dental Care
    if (veteran.mpd?.disabilityRating >= 100 || veteran.mpd?.conditions?.some(c => c.description.toLowerCase().includes('dental'))) {
      eligibilities.push({
        name: 'VA Dental Care',
        eligible: true,
        status: 'Eligible',
        details: 'Comprehensive dental coverage',
        category: 'healthcare',
        priority: 2
      });
    }
    
    // Vision Care
    if (veteran.mpd?.disabilityRating > 0) {
      eligibilities.push({
        name: 'VA Vision Care',
        eligible: true,
        status: 'Eligible',
        details: 'Eye exams and glasses',
        category: 'healthcare',
        priority: 3
      });
    }
    
    // Mental Health Care
    eligibilities.push({
      name: 'Mental Health Services',
      eligible: true,
      status: 'Available',
      details: 'Counseling, therapy, and psychiatric care',
      category: 'healthcare',
      priority: 2
    });
    
    // VA Home Loan
    eligibilities.push({
      name: 'VA Home Loan',
      eligible: true,
      status: veteran.benefits.housing.hasVALoan ? 'Used' : 'Available',
      details: 'No down payment, no PMI',
      category: 'housing',
      priority: 1
    });
    
    // SAH/SHA Grants
    if (veteran.mpd?.disabilityRating >= 50) {
      eligibilities.push({
        name: 'Adaptive Housing Grant',
        eligible: true,
        status: 'Available',
        details: 'Specially Adapted Housing (SAH) or Special Housing Adaptation (SHA)',
        category: 'housing',
        priority: 2,
        action: 'Apply for housing grant'
      });
    }
    
    // Property Tax Exemption
    if (veteran.mpd?.disabilityRating >= 100) {
      eligibilities.push({
        name: 'Property Tax Exemption',
        eligible: true,
        status: 'Available',
        details: 'State-specific exemptions for disabled veterans',
        category: 'financial',
        priority: 2
      });
    }
    
    // Auto Allowance
    if (veteran.mpd?.disabilityRating >= 50 && veteran.mpd?.conditions?.some(c => 
      c.description.toLowerCase().includes('loss of') || c.description.toLowerCase().includes('amputation'))) {
      eligibilities.push({
        name: 'Automobile Allowance',
        eligible: true,
        status: 'Available',
        details: 'One-time payment for vehicle purchase',
        category: 'transportation',
        priority: 2,
        action: 'Apply for auto grant'
      });
    }
    
    // Clothing Allowance
    if (veteran.mpd?.disabilityRating > 0) {
      eligibilities.push({
        name: 'Clothing Allowance',
        eligible: true,
        status: 'Annual',
        details: 'For prosthetic or orthopedic device wear',
        category: 'financial',
        priority: 3
      });
    }
    
    // Life Insurance
    eligibilities.push({
      name: 'VA Life Insurance (S-DVI)',
      eligible: true,
      status: 'Available',
      details: 'Service-Disabled Veterans Insurance',
      category: 'insurance',
      priority: 2
    });
    
    // CHAMPVA
    if (veteran.mpd?.disabilityRating >= 100 && veteran.benefits.dependents > 0) {
      eligibilities.push({
        name: 'CHAMPVA',
        eligible: true,
        status: 'Available',
        details: 'Healthcare for dependents',
        category: 'healthcare',
        priority: 1,
        action: 'Enroll dependents'
      });
    }
    
    // DEA (Chapter 35)
    if (veteran.mpd?.disabilityRating >= 100 && veteran.benefits.dependents > 0) {
      eligibilities.push({
        name: 'DEA Education Benefits',
        eligible: true,
        status: 'Available',
        details: 'Education for dependents (Chapter 35)',
        category: 'education',
        priority: 2,
        action: 'Apply for dependent education'
      });
    }
    
    // Commissary & Exchange
    if (veteran.mpd?.disabilityRating > 0) {
      eligibilities.push({
        name: 'Commissary & Exchange Access',
        eligible: true,
        status: 'Active',
        details: 'On-base shopping privileges',
        category: 'lifestyle',
        priority: 3
      });
    }
    
    // Space-A Travel
    if (veteran.mpd?.disabilityRating >= 100) {
      eligibilities.push({
        name: 'Space-A Travel',
        eligible: true,
        status: 'Category VI',
        details: 'Military flight privileges',
        category: 'lifestyle',
        priority: 3
      });
    }
    
    // State-Specific Benefits
    eligibilities.push({
      name: 'State Veterans Benefits',
      eligible: true,
      status: 'Check State',
      details: 'Additional state-specific programs',
      category: 'other',
      priority: 3,
      action: 'Research state benefits'
    });
    
    // Aid & Attendance
    if (veteran.mpd?.disabilityRating >= 100) {
      eligibilities.push({
        name: 'Aid & Attendance',
        eligible: true,
        status: 'Potentially Eligible',
        details: 'Additional compensation for daily living assistance',
        category: 'compensation',
        priority: 2,
        action: 'Apply if needing assistance'
      });
    }
    
    // Burial Benefits
    eligibilities.push({
      name: 'Burial & Memorial Benefits',
      eligible: true,
      status: 'Pre-approved',
      details: 'National cemetery, headstone, flag',
      category: 'memorial',
      priority: 4
    });
    
    // Work-Study Program
    if (veteran.benefits.education.giBlllUsed > 0 && veteran.benefits.education.giBlllRemaining > 0) {
      eligibilities.push({
        name: 'VA Work-Study Program',
        eligible: true,
        status: 'Available',
        details: 'Part-time employment while in school',
        category: 'education',
        priority: 3
      });
    }
    
    return eligibilities;
  };
  
  const eligibilities = detectEligibilities();
  const categorizedEligibilities = {
    compensation: eligibilities.filter(e => e.category === 'compensation'),
    healthcare: eligibilities.filter(e => e.category === 'healthcare'),
    education: eligibilities.filter(e => e.category === 'education'),
    housing: eligibilities.filter(e => e.category === 'housing'),
    financial: eligibilities.filter(e => e.category === 'financial'),
    insurance: eligibilities.filter(e => e.category === 'insurance'),
    lifestyle: eligibilities.filter(e => e.category === 'lifestyle'),
    other: eligibilities.filter(e => e.category === 'other' || e.category === 'memorial' || e.category === 'transportation')
  };
  
  const totalMonthlyBenefits = veteran.benefits.monthlyAmount;
  
  // Benefits breakdown for pie chart
  const benefitsBreakdown = [
    { name: 'Disability Compensation', value: veteran.benefits.monthlyAmount * 0.7, color: '#00F0FF' },
    { name: 'Education', value: veteran.benefits.monthlyAmount * 0.15, color: '#FF6B6B' },
    { name: 'Housing', value: veteran.benefits.monthlyAmount * 0.1, color: '#4ECDC4' },
    { name: 'Other', value: veteran.benefits.monthlyAmount * 0.05, color: '#95E1D3' },
  ];
  
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'compensation': return <DollarSign className="w-4 h-4" />;
      case 'healthcare': return <Heart className="w-4 h-4" />;
      case 'education': return <GraduationCap className="w-4 h-4" />;
      case 'housing': return <Home className="w-4 h-4" />;
      case 'financial': return <CreditCard className="w-4 h-4" />;
      case 'insurance': return <Shield className="w-4 h-4" />;
      case 'lifestyle': return <Gift className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'compensation': return 'from-green-500 to-green-600';
      case 'healthcare': return 'from-red-500 to-red-600';
      case 'education': return 'from-blue-500 to-blue-600';
      case 'housing': return 'from-purple-500 to-purple-600';
      case 'financial': return 'from-yellow-500 to-yellow-600';
      case 'insurance': return 'from-indigo-500 to-indigo-600';
      case 'lifestyle': return 'from-pink-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Eligibility Summary Dashboard */}
      <div className="bg-gradient-to-br from-skinz-bg-secondary to-skinz-bg-tertiary backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-skinz-accent to-skinz-primary rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Comprehensive Benefits Analysis</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-2">Total Eligible</p>
            <p className="text-white font-bold text-3xl">{eligibilities.length}</p>
            <p className="text-green-400 text-xs mt-1">Benefits Available</p>
          </div>
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-2">Active Benefits</p>
            <p className="text-white font-bold text-3xl">
              {eligibilities.filter(e => e.status === 'Active' || e.status === 'Receiving').length}
            </p>
            <p className="text-blue-400 text-xs mt-1">Currently Using</p>
          </div>
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-2">Action Required</p>
            <p className="text-white font-bold text-3xl">
              {eligibilities.filter(e => e.action).length}
            </p>
            <p className="text-yellow-400 text-xs mt-1">Apply/Enroll</p>
          </div>
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-2">Monthly Value</p>
            <p className="text-white font-bold text-3xl">${totalMonthlyBenefits.toLocaleString()}</p>
            <p className="text-skinz-accent text-xs mt-1">Direct Payments</p>
          </div>
        </div>
        
        {/* Action Items Alert */}
        {eligibilities.filter(e => e.action).length > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <p className="text-yellow-400 font-medium mb-2">Recommended Actions</p>
                <div className="space-y-1">
                  {eligibilities.filter(e => e.action).slice(0, 3).map((item, idx) => (
                    <p key={idx} className="text-skinz-text-secondary text-sm">
                      • {item.action} ({item.name})
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Categorized Benefits Grid */}
      {Object.entries(categorizedEligibilities).map(([category, items]) => {
        if (items.length === 0) return null;
        
        return (
          <div key={category} className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 bg-gradient-to-br ${getCategoryColor(category)} rounded-lg flex items-center justify-center`}>
                {getCategoryIcon(category)}
              </div>
              <h3 className="text-xl font-semibold text-white capitalize">{category} Benefits</h3>
              <span className="ml-auto text-skinz-text-secondary text-sm">
                {items.filter(i => i.eligible).length} eligible
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((benefit, idx) => (
                <div key={idx} className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-white font-medium">{benefit.name}</p>
                      <p className="text-skinz-text-secondary text-sm mt-1">{benefit.details}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {benefit.eligible ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      <span className={`text-xs px-2 py-1 rounded ${
                        benefit.status === 'Active' || benefit.status === 'Receiving' ? 'bg-green-500/20 text-green-400' :
                        benefit.status === 'Enrolled' ? 'bg-blue-500/20 text-blue-400' :
                        benefit.status === 'Available' || benefit.status === 'Eligible' ? 'bg-yellow-500/20 text-yellow-400' :
                        benefit.status === 'Used' ? 'bg-gray-500/20 text-gray-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {benefit.status}
                      </span>
                    </div>
                  </div>
                  {benefit.action && (
                    <div className="mt-3 pt-3 border-t border-skinz-border/50">
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-yellow-400" />
                        <p className="text-yellow-400 text-sm">{benefit.action}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
      
      {/* Financial Impact Analysis */}
      <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Financial Impact Analysis</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-skinz-text-secondary text-sm mb-3">Monthly Benefits Distribution</p>
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
          </div>
          
          <div className="space-y-4">
            <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
              <p className="text-skinz-text-secondary text-sm mb-1">Annual Benefits Value</p>
              <p className="text-white font-bold text-2xl">${(totalMonthlyBenefits * 12).toLocaleString()}</p>
              <p className="text-green-400 text-sm mt-1">+3.2% COLA expected</p>
            </div>
            
            <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
              <p className="text-skinz-text-secondary text-sm mb-1">Healthcare Value (est.)</p>
              <p className="text-white font-bold text-2xl">$15,000+</p>
              <p className="text-blue-400 text-sm mt-1">Annual healthcare coverage</p>
            </div>
            
            <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
              <p className="text-skinz-text-secondary text-sm mb-1">Education Benefits</p>
              <p className="text-white font-bold text-2xl">$50,000+</p>
              <p className="text-purple-400 text-sm mt-1">Remaining GI Bill value</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}