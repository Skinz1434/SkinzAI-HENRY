'use client';

import React, { useState } from 'react';
import { VeteranProfileEnhanced } from '@/lib/veteran-profile-enhanced';
import { 
  Shield, Award, MapPin, Calendar, Star, ChevronRight, Flag, Users, 
  GraduationCap, Target, Zap, Globe, Clock, Medal, Briefcase, 
  AlertTriangle, Hash, Lock, CheckCircle, Activity, TrendingUp,
  Plane, Ship, Truck, Building, UserCheck, FileText, Percent
} from 'lucide-react';

interface ServiceProfileEnhancedProps {
  veteran: VeteranProfileEnhanced;
}

export default function ServiceProfileEnhanced({ veteran }: ServiceProfileEnhancedProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'deployments' | 'personnel' | 'training' | 'awards'>('overview');
  
  const calculateTotalServiceDays = () => {
    if (!veteran.mpr.serviceStartDate || !veteran.mpr.serviceEndDate) return 0;
    const start = new Date(veteran.mpr.serviceStartDate);
    const end = veteran.mpr.serviceEndDate ? new Date(veteran.mpr.serviceEndDate) : new Date();
    return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const calculateRetirementPercentage = () => {
    const totalMonths = veteran.mpr.totalServiceYears * 12 + (veteran.mpr.totalServiceMonths % 12);
    const yearsOfService = totalMonths / 12;
    return Math.min(75, yearsOfService * 2.5);
  };

  // Enhanced personnel data
  const personnelData = {
    securityClearance: {
      level: 'SECRET',
      issueDate: '2018-03-15',
      expirationDate: '2028-03-15',
      investigationType: 'T3',
      status: 'Active'
    },
    performanceEvals: [
      { period: '2021-2022', rating: 'Outstanding', score: 4.8 },
      { period: '2020-2021', rating: 'Exceeds Standards', score: 4.5 },
      { period: '2019-2020', rating: 'Outstanding', score: 4.9 }
    ],
    qualifications: [
      { name: 'Combat Lifesaver', date: '2020-06-15', expires: '2025-06-15', status: 'Current' },
      { name: 'Expert Marksmanship', date: '2021-09-20', expires: null, status: 'Permanent' },
      { name: 'Airborne', date: '2019-03-10', expires: null, status: 'Permanent' },
      { name: 'Air Assault', date: '2019-08-25', expires: null, status: 'Permanent' }
    ],
    fitnesScores: [
      { date: '2022-10-15', score: 285, maxScore: 300, events: { pushups: 75, situps: 80, run: '13:30' } },
      { date: '2022-04-15', score: 278, maxScore: 300, events: { pushups: 72, situps: 78, run: '14:00' } }
    ],
    leadership: {
      positionsHeld: [
        { title: 'Squad Leader', unit: '2nd Battalion', duration: '2 years' },
        { title: 'Platoon Sergeant', unit: '3rd Brigade', duration: '1.5 years' }
      ],
      soldiersLed: 45,
      mentorshipProvided: 12
    }
  };

  // Combat statistics
  const combatStats = {
    totalCombatDays: veteran.mpr.deployments?.reduce((acc, dep) => {
      const start = new Date(dep.startDate);
      const end = new Date(dep.endDate);
      return acc + Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    }, 0) || 0,
    combatZones: veteran.mpr.deployments?.map(d => d.location) || [],
    operations: veteran.mpr.deployments?.map(d => d.operation) || [],
    campaigns: veteran.mpr.deployments?.length || 0
  };

  // Service connections network
  const serviceConnections = {
    unitMembers: 147,
    commandStructure: {
      immediateCommander: 'LTC Johnson, Robert',
      seniorNCO: 'CSM Smith, Michael',
      firstSergeant: 'MSG Davis, Jennifer'
    },
    battleBuddies: [
      { name: 'SSG Wilson, James', unit: '2-82 ABN', contact: 'Connected' },
      { name: 'SFC Brown, Maria', unit: '101st AIR ASLT', contact: 'Connected' }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-skinz-bg-secondary/50 p-1 rounded-lg overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Shield },
          { id: 'deployments', label: 'Deployments', icon: Globe },
          { id: 'personnel', label: 'Personnel', icon: UserCheck },
          { id: 'training', label: 'Training', icon: GraduationCap },
          { id: 'awards', label: 'Awards', icon: Medal }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-skinz-accent text-white shadow-lg'
                  : 'text-skinz-text-secondary hover:text-white hover:bg-skinz-bg-tertiary/50'
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
          {/* Enhanced Service Summary */}
          <div className="bg-gradient-to-br from-skinz-bg-secondary to-skinz-bg-tertiary backdrop-blur-md rounded-xl p-6 border border-skinz-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-skinz-accent to-skinz-primary rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Complete Military Service Record</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Flag className="w-4 h-4 text-blue-400" />
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">BRANCH</span>
                </div>
                <p className="text-white font-bold text-lg">{veteran.mpr.branch}</p>
                <p className="text-skinz-accent text-sm">{veteran.mpr.component}</p>
              </div>
              
              <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <ChevronRight className="w-4 h-4 text-green-400" />
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">RANK</span>
                </div>
                <p className="text-white font-bold text-lg">{veteran.mpr.rank}</p>
                <p className="text-skinz-accent text-sm">{veteran.mpr.payGrade}</p>
              </div>
              
              <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">SERVICE</span>
                </div>
                <p className="text-white font-bold text-lg">{veteran.mpr.totalServiceYears}Y {veteran.mpr.totalServiceMonths % 12}M</p>
                <p className="text-skinz-accent text-sm">{calculateTotalServiceDays()} days</p>
              </div>
              
              <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Percent className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">RETIREMENT</span>
                </div>
                <p className="text-white font-bold text-lg">{calculateRetirementPercentage().toFixed(1)}%</p>
                <p className="text-skinz-accent text-sm">Base pay</p>
              </div>
            </div>

            {/* Service Numbers and IDs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-skinz-bg-primary/50 rounded-lg p-3">
                <p className="text-skinz-text-secondary text-xs mb-1">Service Number</p>
                <p className="text-white font-mono text-sm">{veteran.mpr.serviceNumber}</p>
              </div>
              <div className="bg-skinz-bg-primary/50 rounded-lg p-3">
                <p className="text-skinz-text-secondary text-xs mb-1">DoD ID</p>
                <p className="text-white font-mono text-sm">{veteran.mpr.dodId}</p>
              </div>
              <div className="bg-skinz-bg-primary/50 rounded-lg p-3">
                <p className="text-skinz-text-secondary text-xs mb-1">EDIPI</p>
                <p className="text-white font-mono text-sm">{veteran.mpr.dodId}</p>
              </div>
            </div>

            {/* Service Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
                <p className="text-skinz-text-secondary text-sm mb-2">Entry on Active Duty</p>
                <p className="text-white font-semibold">
                  {new Date(veteran.mpr.serviceStartDate).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
                <p className="text-skinz-text-secondary text-xs mt-1">Initial Entry Training: Fort Benning, GA</p>
              </div>
              <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
                <p className="text-skinz-text-secondary text-sm mb-2">Release from Active Duty</p>
                <p className="text-white font-semibold">
                  {veteran.mpr.serviceEndDate 
                    ? new Date(veteran.mpr.serviceEndDate).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })
                    : 'Currently Serving'}
                </p>
                <p className="text-skinz-text-secondary text-xs mt-1">Terminal Leave: 60 days</p>
              </div>
            </div>
          </div>

          {/* Combat Service Summary */}
          <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Combat Service Summary</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4 text-center">
                <p className="text-skinz-text-secondary text-sm mb-1">Combat Days</p>
                <p className="text-white font-bold text-2xl">{combatStats.totalCombatDays}</p>
              </div>
              <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4 text-center">
                <p className="text-skinz-text-secondary text-sm mb-1">Deployments</p>
                <p className="text-white font-bold text-2xl">{combatStats.campaigns}</p>
              </div>
              <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4 text-center">
                <p className="text-skinz-text-secondary text-sm mb-1">Combat Zones</p>
                <p className="text-white font-bold text-2xl">{combatStats.combatZones.length}</p>
              </div>
              <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4 text-center">
                <p className="text-skinz-text-secondary text-sm mb-1">Operations</p>
                <p className="text-white font-bold text-2xl">{combatStats.operations.length}</p>
              </div>
            </div>
          </div>

          {/* Unit History */}
          <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Unit Assignment History</h3>
            </div>
            
            <div className="space-y-3">
              {veteran.mpr.units?.map((unit, index) => (
                <div key={index} className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="w-4 h-4 text-skinz-accent" />
                        <p className="text-white font-semibold">{unit.unitName}</p>
                        <span className="text-xs bg-skinz-accent/20 text-skinz-accent px-2 py-1 rounded">
                          {unit.duty}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-skinz-text-secondary">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {unit.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(unit.assignedDate).toLocaleDateString()} - 
                          {unit.departedDate ? new Date(unit.departedDate).toLocaleDateString() : 'Present'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )) || (
                <p className="text-skinz-text-secondary text-center py-4">No unit history available</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Deployments Tab */}
      {activeTab === 'deployments' && (
        <div className="space-y-6">
          {veteran.mpr.deployments?.map((deployment, index) => (
            <div key={index} className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-white font-semibold text-lg flex items-center gap-2">
                    <Globe className="w-5 h-5 text-red-400" />
                    {deployment.location}
                  </h4>
                  <p className="text-skinz-accent font-medium">{deployment.operation}</p>
                </div>
                <span className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded">
                  COMBAT ZONE
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-skinz-bg-tertiary/50 rounded-lg p-3">
                  <p className="text-skinz-text-secondary text-xs mb-1">Duration</p>
                  <p className="text-white font-medium">
                    {Math.floor((new Date(deployment.endDate).getTime() - new Date(deployment.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                  </p>
                </div>
                <div className="bg-skinz-bg-tertiary/50 rounded-lg p-3">
                  <p className="text-skinz-text-secondary text-xs mb-1">Start Date</p>
                  <p className="text-white font-medium">
                    {new Date(deployment.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-skinz-bg-tertiary/50 rounded-lg p-3">
                  <p className="text-skinz-text-secondary text-xs mb-1">End Date</p>
                  <p className="text-white font-medium">
                    {new Date(deployment.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              {deployment.awards && deployment.awards.length > 0 && (
                <div>
                  <p className="text-skinz-text-secondary text-sm mb-2">Campaign Awards</p>
                  <div className="flex flex-wrap gap-2">
                    {deployment.awards.map((award, i) => (
                      <span key={i} className="flex items-center gap-1 text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded">
                        <Star className="w-3 h-3" />
                        {award}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )) || (
            <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-12 border border-skinz-border text-center">
              <Globe className="w-12 h-12 text-skinz-text-secondary mx-auto mb-4" />
              <p className="text-skinz-text-secondary">No deployment records available</p>
            </div>
          )}
        </div>
      )}

      {/* Personnel Tab */}
      {activeTab === 'personnel' && (
        <div className="space-y-6">
          {/* Security Clearance */}
          <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Security Clearance</h3>
              <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                {personnelData.securityClearance.status.toUpperCase()}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-skinz-text-secondary text-sm mb-2">Clearance Level</p>
                <p className="text-white font-bold text-xl">{personnelData.securityClearance.level}</p>
                <p className="text-skinz-text-secondary text-xs mt-1">Investigation: {personnelData.securityClearance.investigationType}</p>
              </div>
              <div>
                <p className="text-skinz-text-secondary text-sm mb-2">Valid Through</p>
                <p className="text-white font-bold">
                  {new Date(personnelData.securityClearance.expirationDate).toLocaleDateString()}
                </p>
                <p className="text-green-400 text-xs mt-1">Active - No issues</p>
              </div>
            </div>
          </div>

          {/* Performance Evaluations */}
          <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Performance Evaluations</h3>
            </div>
            
            <div className="space-y-3">
              {personnelData.performanceEvals.map((evaluation, idx) => (
                <div key={idx} className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium">Period: {evaluation.period}</p>
                      <p className="text-skinz-text-secondary text-sm">Rating: {evaluation.rating}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-400">{evaluation.score}</p>
                      <p className="text-skinz-text-secondary text-xs">out of 5.0</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fitness Scores */}
          <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Physical Fitness Scores</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personnelData.fitnesScores.map((test, idx) => (
                <div key={idx} className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-white font-medium">{new Date(test.date).toLocaleDateString()}</p>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                      PASS
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-skinz-text-secondary text-sm">Overall Score</p>
                    <p className="text-white font-bold text-xl">{test.score}/{test.maxScore}</p>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-skinz-text-secondary">Push-ups:</span>
                      <span className="text-white">{test.events.pushups}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-skinz-text-secondary">Sit-ups:</span>
                      <span className="text-white">{test.events.situps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-skinz-text-secondary">2-Mile Run:</span>
                      <span className="text-white">{test.events.run}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leadership Experience */}
          <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Leadership Experience</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4 text-center">
                <p className="text-skinz-text-secondary text-sm mb-1">Soldiers Led</p>
                <p className="text-white font-bold text-2xl">{personnelData.leadership.soldiersLed}</p>
              </div>
              <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4 text-center">
                <p className="text-skinz-text-secondary text-sm mb-1">Mentored</p>
                <p className="text-white font-bold text-2xl">{personnelData.leadership.mentorshipProvided}</p>
              </div>
              <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4 text-center">
                <p className="text-skinz-text-secondary text-sm mb-1">Positions</p>
                <p className="text-white font-bold text-2xl">{personnelData.leadership.positionsHeld.length}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {personnelData.leadership.positionsHeld.map((pos, idx) => (
                <div key={idx} className="bg-skinz-bg-tertiary/50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium">{pos.title}</p>
                      <p className="text-skinz-text-secondary text-sm">{pos.unit}</p>
                    </div>
                    <span className="text-skinz-accent text-sm">{pos.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Training Tab */}
      {activeTab === 'training' && (
        <div className="space-y-6">
          {/* Military Qualifications */}
          <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Military Qualifications & Certifications</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {personnelData.qualifications.map((qual, idx) => (
                <div key={idx} className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-white font-medium">{qual.name}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      qual.status === 'Current' ? 'bg-green-500/20 text-green-400' :
                      qual.status === 'Permanent' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {qual.status}
                    </span>
                  </div>
                  <p className="text-skinz-text-secondary text-sm">
                    Achieved: {new Date(qual.date).toLocaleDateString()}
                  </p>
                  {qual.expires && (
                    <p className="text-skinz-text-secondary text-sm">
                      Expires: {new Date(qual.expires).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* MOS/Specialties */}
          <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">Military Occupational Specialties</h3>
            </div>
            
            <div className="space-y-3">
              {veteran.mpr.specialties?.map((specialty, index) => (
                <div key={index} className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-semibold">{specialty.title}</p>
                      <p className="text-skinz-accent font-mono text-sm">MOS: {specialty.code}</p>
                      <p className="text-skinz-text-secondary text-sm mt-1">
                        Qualified: {new Date(specialty.dateAchieved).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      specialty.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {specialty.status}
                    </span>
                  </div>
                </div>
              )) || (
                <p className="text-skinz-text-secondary text-center py-4">No specialties recorded</p>
              )}
            </div>
          </div>

          {/* Military Education */}
          {veteran.mpr.education && (
            <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">Military Education & Schools</h3>
              </div>
              
              <div className="space-y-2">
                {veteran.mpr.education.militaryEducation.map((edu, index) => (
                  <div key={index} className="bg-skinz-bg-tertiary/50 rounded-lg p-3 flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <p className="text-white">{edu}</p>
                  </div>
                ))}
              </div>
              
              {veteran.mpr.education.civilianEducation && (
                <div className="mt-4 p-4 bg-skinz-bg-tertiary/50 rounded-lg border border-skinz-border/50">
                  <p className="text-skinz-text-secondary text-sm mb-2">Civilian Education</p>
                  <p className="text-white">{veteran.mpr.education.civilianEducation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Awards Tab */}
      {activeTab === 'awards' && (
        <div className="space-y-6">
          {veteran.profileServices?.awards && veteran.profileServices.awards.length > 0 ? (
            <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                  <Medal className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">Awards & Decorations</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {veteran.profileServices.awards.map((award, index) => (
                  <div key={index} className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-lg flex items-center justify-center">
                        <Star className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold">{award.name}</p>
                        <p className="text-skinz-text-secondary text-sm mt-1">
                          {new Date(award.date).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric'
                          })}
                        </p>
                        {award.citation && (
                          <p className="text-skinz-text-secondary text-sm mt-2 italic">
                            "{award.citation}"
                          </p>
                        )}
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs bg-skinz-accent/20 text-skinz-accent px-2 py-1 rounded">
                            {award.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-12 border border-skinz-border text-center">
              <Medal className="w-12 h-12 text-skinz-text-secondary mx-auto mb-4" />
              <p className="text-skinz-text-secondary">No awards recorded</p>
            </div>
          )}

          {/* Discharge Information */}
          {veteran.profileServices?.dischargeStatus && (
            <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">Discharge Information (DD-214)</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
                  <p className="text-skinz-text-secondary text-sm mb-2">Discharge Type</p>
                  <p className="text-white font-semibold">{veteran.profileServices.dischargeStatus.type}</p>
                </div>
                
                <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
                  <p className="text-skinz-text-secondary text-sm mb-2">Discharge Date</p>
                  <p className="text-white font-semibold">
                    {new Date(veteran.profileServices.dischargeStatus.date).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
                
                <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
                  <p className="text-skinz-text-secondary text-sm mb-2">Character of Service</p>
                  <p className="text-white font-semibold">{veteran.profileServices.dischargeStatus.characterOfService}</p>
                </div>
                
                <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
                  <p className="text-skinz-text-secondary text-sm mb-2">Reenlistment Code</p>
                  <p className="text-white font-semibold">{veteran.profileServices.dischargeStatus.reenlistmentCode}</p>
                </div>
                
                <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
                  <p className="text-skinz-text-secondary text-sm mb-2">Separation Code</p>
                  <p className="text-white font-semibold">JFV1</p>
                </div>
                
                <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
                  <p className="text-skinz-text-secondary text-sm mb-2">Narrative Reason</p>
                  <p className="text-white font-semibold">Completion of Required Active Service</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}