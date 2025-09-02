'use client';

import React from 'react';
import { VeteranProfileEnhanced } from '@/lib/veteran-profile-enhanced';
import { Shield, Award, MapPin, Calendar, Star, ChevronRight, Flag, Users, GraduationCap, Target, Zap, Globe } from 'lucide-react';

interface ServiceProfileProps {
  veteran: VeteranProfileEnhanced;
}

export default function ServiceProfile({ veteran }: ServiceProfileProps) {
  const calculateTotalServiceDays = () => {
    if (!veteran.mpr.serviceStartDate || !veteran.mpr.serviceEndDate) return 0;
    const start = new Date(veteran.mpr.serviceStartDate);
    const end = veteran.mpr.serviceEndDate ? new Date(veteran.mpr.serviceEndDate) : new Date();
    return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Service Summary Card */}
      <div className="bg-gradient-to-br from-skinz-bg-secondary to-skinz-bg-tertiary backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-skinz-accent to-skinz-primary rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Military Service Summary</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-1">Branch of Service</p>
            <p className="text-white font-bold text-lg">{veteran.mpr.branch}</p>
            <p className="text-skinz-accent text-sm mt-1">{veteran.mpr.component} Duty</p>
          </div>
          
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-1">Final Rank</p>
            <p className="text-white font-bold text-lg">{veteran.mpr.rank}</p>
            <p className="text-skinz-accent text-sm mt-1">Pay Grade: {veteran.mpr.payGrade}</p>
          </div>
          
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-1">Total Service Time</p>
            <p className="text-white font-bold text-lg">
              {veteran.mpr.totalServiceYears} Years {veteran.mpr.totalServiceMonths % 12} Months
            </p>
            <p className="text-skinz-accent text-sm mt-1">{calculateTotalServiceDays()} Total Days</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-1">Service Number</p>
            <p className="text-white font-mono">{veteran.mpr.serviceNumber}</p>
          </div>
          
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-1">DoD ID Number</p>
            <p className="text-white font-mono">{veteran.mpr.dodId}</p>
          </div>
          
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-1">Service Start Date</p>
            <p className="text-white">
              {new Date(veteran.mpr.serviceStartDate).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
          
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-1">Service End Date</p>
            <p className="text-white">
              {veteran.mpr.serviceEndDate 
                ? new Date(veteran.mpr.serviceEndDate).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })
                : 'Currently Serving'}
            </p>
          </div>
        </div>
      </div>

      {/* Combat Deployments */}
      {veteran.mpr.deployments && veteran.mpr.deployments.length > 0 && (
        <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Combat Deployments</h3>
          </div>
          
          <div className="space-y-3">
            {veteran.mpr.deployments.map((deployment, index) => (
              <div key={index} className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-white font-semibold text-lg">{deployment.location}</p>
                    <p className="text-skinz-accent">{deployment.operation}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-skinz-text-secondary text-sm">
                      {new Date(deployment.startDate).toLocaleDateString()} - {new Date(deployment.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-skinz-text-secondary text-sm">
                      {Math.floor((new Date(deployment.endDate).getTime() - new Date(deployment.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                </div>
                
                {deployment.awards && deployment.awards.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {deployment.awards.map((award, i) => (
                      <span key={i} className="flex items-center gap-1 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                        <Star className="w-3 h-3" />
                        {award}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unit Assignments */}
      {veteran.mpr.units && veteran.mpr.units.length > 0 && (
        <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Unit Assignments</h3>
          </div>
          
          <div className="space-y-3">
            {veteran.mpr.units.map((unit, index) => (
              <div key={index} className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-semibold">{unit.unitName}</p>
                    <p className="text-skinz-text-secondary text-sm mt-1">
                      <MapPin className="w-3 h-3 inline mr-1" />
                      {unit.location}
                    </p>
                    <p className="text-skinz-accent text-sm mt-1">{unit.duty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-skinz-text-secondary text-sm">
                      {new Date(unit.assignedDate).toLocaleDateString()}
                    </p>
                    <p className="text-skinz-text-secondary text-sm">
                      to {unit.departedDate ? new Date(unit.departedDate).toLocaleDateString() : 'Present'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Military Specialties */}
      {veteran.mpr.specialties && veteran.mpr.specialties.length > 0 && (
        <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Military Occupational Specialties</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {veteran.mpr.specialties.map((specialty, index) => (
              <div key={index} className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-semibold">{specialty.title}</p>
                    <p className="text-skinz-text-secondary text-sm">MOS Code: {specialty.code}</p>
                    <p className="text-skinz-text-secondary text-sm mt-1">
                      Achieved: {new Date(specialty.dateAchieved).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    specialty.status === 'Active'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {specialty.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Military Education */}
      {veteran.mpr.education && (
        <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Military Education & Training</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-skinz-text-secondary text-sm mb-3">Military Education</p>
              <div className="space-y-2">
                {veteran.mpr.education.militaryEducation.map((edu, index) => (
                  <div key={index} className="bg-skinz-bg-tertiary/50 rounded-lg p-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-skinz-accent" />
                    <p className="text-white">{edu}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-skinz-text-secondary text-sm mb-3">Civilian Education</p>
              <div className="bg-skinz-bg-tertiary/50 rounded-lg p-3">
                <p className="text-white">{veteran.mpr.education.civilianEducation}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Awards and Decorations */}
      {veteran.profileServices?.awards && veteran.profileServices.awards.length > 0 && (
        <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Awards & Decorations</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {veteran.profileServices.awards.map((award, index) => (
              <div key={index} className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-white font-semibold">{award.name}</p>
                    <p className="text-skinz-text-secondary text-sm mt-1">
                      {new Date(award.date).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                    {award.citation && (
                      <p className="text-skinz-text-secondary text-sm mt-2 italic">"{award.citation}"</p>
                    )}
                    <span className="inline-block mt-2 text-xs bg-skinz-accent/20 text-skinz-accent px-2 py-1 rounded">
                      {award.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discharge Information */}
      {veteran.profileServices?.dischargeStatus && (
        <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Flag className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Discharge Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
              <p className="text-skinz-text-secondary text-sm mb-1">Discharge Type</p>
              <p className="text-white font-semibold">{veteran.profileServices.dischargeStatus.type}</p>
            </div>
            
            <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
              <p className="text-skinz-text-secondary text-sm mb-1">Discharge Date</p>
              <p className="text-white font-semibold">
                {new Date(veteran.profileServices.dischargeStatus.date).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
            </div>
            
            <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
              <p className="text-skinz-text-secondary text-sm mb-1">Character of Service</p>
              <p className="text-white font-semibold">{veteran.profileServices.dischargeStatus.characterOfService}</p>
            </div>
            
            <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
              <p className="text-skinz-text-secondary text-sm mb-1">Reenlistment Code</p>
              <p className="text-white font-semibold">{veteran.profileServices.dischargeStatus.reenlistmentCode}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}