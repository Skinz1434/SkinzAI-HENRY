'use client';

import React from 'react';
import { VeteranProfileEnhanced } from '@/lib/veteran-profile-enhanced';
import { User, Phone, Mail, MapPin, Calendar, Heart, Shield, AlertCircle, CreditCard, Users, Globe, FileText } from 'lucide-react';

interface PersonalProfileProps {
  veteran: VeteranProfileEnhanced;
}

export default function PersonalProfile({ veteran }: PersonalProfileProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information Card */}
      <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-skinz-accent to-skinz-primary rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Personal Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-skinz-text-secondary text-sm mb-1">Full Name</p>
            <p className="text-white font-medium">
              {veteran.firstName} {veteran.middleName} {veteran.lastName} {veteran.suffix}
            </p>
          </div>
          
          <div>
            <p className="text-skinz-text-secondary text-sm mb-1">Social Security Number</p>
            <p className="text-white font-medium font-mono">{veteran.ssn}</p>
          </div>
          
          <div>
            <p className="text-skinz-text-secondary text-sm mb-1">Date of Birth</p>
            <p className="text-white font-medium">
              {new Date(veteran.dateOfBirth).toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric' 
              })}
            </p>
          </div>
          
          <div>
            <p className="text-skinz-text-secondary text-sm mb-1">Place of Birth</p>
            <p className="text-white font-medium">{veteran.placeOfBirth}</p>
          </div>
          
          <div>
            <p className="text-skinz-text-secondary text-sm mb-1">Gender</p>
            <p className="text-white font-medium">{veteran.gender}</p>
          </div>
          
          <div>
            <p className="text-skinz-text-secondary text-sm mb-1">Marital Status</p>
            <p className="text-white font-medium">{veteran.maritalStatus}</p>
          </div>
        </div>
      </div>

      {/* Contact Information Card */}
      <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Contact Information</h3>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-skinz-text-secondary text-sm mb-1">Primary Phone</p>
              <p className="text-white font-medium">{veteran.contact.phone}</p>
            </div>
            
            {veteran.contact.altPhone && (
              <div>
                <p className="text-skinz-text-secondary text-sm mb-1">Alternative Phone</p>
                <p className="text-white font-medium">{veteran.contact.altPhone}</p>
              </div>
            )}
            
            <div>
              <p className="text-skinz-text-secondary text-sm mb-1">Email Address</p>
              <p className="text-white font-medium">{veteran.contact.email}</p>
            </div>
          </div>
          
          <div>
            <p className="text-skinz-text-secondary text-sm mb-2">Primary Address</p>
            <div className="bg-skinz-bg-tertiary/30 rounded-lg p-4">
              <p className="text-white">{veteran.contact.address.street1}</p>
              {veteran.contact.address.street2 && (
                <p className="text-white">{veteran.contact.address.street2}</p>
              )}
              <p className="text-white">
                {veteran.contact.address.city}, {veteran.contact.address.state} {veteran.contact.address.zipCode}
              </p>
              <p className="text-white">{veteran.contact.address.country}</p>
            </div>
          </div>
          
          {veteran.contact.mailingAddress && (
            <div>
              <p className="text-skinz-text-secondary text-sm mb-2">Mailing Address</p>
              <div className="bg-skinz-bg-tertiary/30 rounded-lg p-4">
                <p className="text-white">{veteran.contact.mailingAddress.street1}</p>
                {veteran.contact.mailingAddress.street2 && (
                  <p className="text-white">{veteran.contact.mailingAddress.street2}</p>
                )}
                <p className="text-white">
                  {veteran.contact.mailingAddress.city}, {veteran.contact.mailingAddress.state} {veteran.contact.mailingAddress.zipCode}
                </p>
                <p className="text-white">{veteran.contact.mailingAddress.country}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Contacts - Temporarily disabled due to type issues */}
      {/* {veteran.profileServices?.emergencyInfo && (
        <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Emergency Contacts</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {veteran.profileServices.emergencyInfo.emergencyContacts.map((contact, index) => (
              <div key={index} className="bg-skinz-bg-tertiary/30 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-white font-medium">{contact.name}</p>
                  <span className="text-xs bg-skinz-accent/20 text-skinz-accent px-2 py-1 rounded">
                    {contact.relationship}
                  </span>
                </div>
                <p className="text-skinz-text-secondary text-sm">{contact.phone}</p>
                {contact.altPhone && (
                  <p className="text-skinz-text-secondary text-sm">Alt: {contact.altPhone}</p>
                )}
              </div>
            ))}
          </div>
          
          {veteran.profileServices.emergencyInfo.bloodType && (
            <div className="mt-4 flex items-center gap-4">
              <div>
                <p className="text-skinz-text-secondary text-sm">Blood Type</p>
                <p className="text-white font-medium text-lg">{veteran.profileServices.emergencyInfo.bloodType}</p>
              </div>
              
              {veteran.profileServices.emergencyInfo.allergies && veteran.profileServices.emergencyInfo.allergies.length > 0 && (
                <div>
                  <p className="text-skinz-text-secondary text-sm">Known Allergies</p>
                  <div className="flex gap-2 mt-1">
                    {veteran.profileServices.emergencyInfo.allergies.map((allergy, i) => (
                      <span key={i} className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )} */}

      {/* Insurance Information */}
      {veteran.profileServices?.insurancePlans && veteran.profileServices.insurancePlans.length > 0 && (
        <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Insurance Coverage</h3>
          </div>
          
          <div className="space-y-3">
            {veteran.profileServices.insurancePlans.map((plan, index) => (
              <div key={index} className="bg-skinz-bg-tertiary/30 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-white font-medium">{plan.provider}</p>
                    <p className="text-skinz-text-secondary text-sm">{plan.planType}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    plan.status === 'Active' 
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {plan.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-skinz-text-secondary text-xs">Policy Number</p>
                    <p className="text-white text-sm font-mono">{plan.policyNumber}</p>
                  </div>
                  <div>
                    <p className="text-skinz-text-secondary text-xs">Group Number</p>
                    <p className="text-white text-sm font-mono">{plan.groupNumber}</p>
                  </div>
                  <div>
                    <p className="text-skinz-text-secondary text-xs">Effective Date</p>
                    <p className="text-white text-sm">
                      {new Date(plan.effectiveDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-skinz-text-secondary text-xs">Coverage Level</p>
                    <p className="text-white text-sm">{plan.coverageLevel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dependents Information */}
      {veteran.benefits.dependents > 0 && (
        <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Dependents</h3>
          </div>
          
          <div className="bg-skinz-bg-tertiary/30 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-2">Number of Dependents</p>
            <p className="text-white text-2xl font-bold">{veteran.benefits.dependents}</p>
            <p className="text-skinz-text-secondary text-sm mt-2">
              Dependents may be eligible for various VA benefits including education, healthcare, and survivor benefits.
            </p>
          </div>
        </div>
      )}

      {/* Additional Information */}
      <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Additional Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-skinz-bg-tertiary/30 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-1">Preferred Language</p>
            <p className="text-white font-medium">English</p>
          </div>
          
          <div className="bg-skinz-bg-tertiary/30 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-1">Time Zone</p>
            <p className="text-white font-medium">Eastern Standard Time</p>
          </div>
          
          <div className="bg-skinz-bg-tertiary/30 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-1">Communication Preference</p>
            <p className="text-white font-medium">Email</p>
          </div>
          
          <div className="bg-skinz-bg-tertiary/30 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-1">Accessibility Needs</p>
            <p className="text-white font-medium">None Specified</p>
          </div>
        </div>
      </div>
    </div>
  );
}