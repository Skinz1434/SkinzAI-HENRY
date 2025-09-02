'use client';

import React, { useState } from 'react';
import { VeteranProfileEnhanced } from '@/lib/veteran-profile-enhanced';
import { Activity, Pill, Calendar, FileText, AlertCircle, TrendingUp, Heart, Brain, Stethoscope, Syringe, FlaskConical, Clock } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface MedicalProfileProps {
  veteran: VeteranProfileEnhanced;
}

export default function MedicalProfile({ veteran }: MedicalProfileProps) {
  const [selectedCondition, setSelectedCondition] = useState<number | null>(null);

  // Generate chart data for disability rating progression
  const ratingProgressionData = [
    { month: 'Jan', rating: veteran.mpd.disabilityRating - 15 },
    { month: 'Mar', rating: veteran.mpd.disabilityRating - 10 },
    { month: 'May', rating: veteran.mpd.disabilityRating - 8 },
    { month: 'Jul', rating: veteran.mpd.disabilityRating - 5 },
    { month: 'Sep', rating: veteran.mpd.disabilityRating - 2 },
    { month: 'Nov', rating: veteran.mpd.disabilityRating },
  ];

  // Generate condition severity data
  const conditionSeverityData = veteran.mpd.conditions.slice(0, 5).map(condition => ({
    name: condition.description.length > 15 ? condition.description.substring(0, 15) + '...' : condition.description,
    rating: condition.rating,
    serviceConnected: condition.serviceConnected ? 'Yes' : 'No'
  }));

  return (
    <div className="space-y-6">
      {/* Medical Overview */}
      <div className="bg-gradient-to-br from-skinz-bg-secondary to-skinz-bg-tertiary backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-skinz-accent to-skinz-primary rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Medical Profile Overview</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-skinz-accent" />
              <p className="text-skinz-text-secondary text-sm">Disability Rating</p>
            </div>
            <p className="text-white font-bold text-2xl">{veteran.mpd.disabilityRating}%</p>
            <p className="text-skinz-text-secondary text-xs mt-1">
              Effective: {new Date(veteran.mpd.effectiveDate).toLocaleDateString()}
            </p>
          </div>
          
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Stethoscope className="w-4 h-4 text-blue-400" />
              <p className="text-skinz-text-secondary text-sm">Active Conditions</p>
            </div>
            <p className="text-white font-bold text-2xl">
              {veteran.mpd.conditions.filter(c => c.status === 'Active').length}
            </p>
            <p className="text-skinz-text-secondary text-xs mt-1">
              {veteran.mpd.conditions.filter(c => c.serviceConnected).length} Service-Connected
            </p>
          </div>
          
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Pill className="w-4 h-4 text-green-400" />
              <p className="text-skinz-text-secondary text-sm">Active Medications</p>
            </div>
            <p className="text-white font-bold text-2xl">
              {veteran.mpd.medications.filter(m => m.status === 'Active').length}
            </p>
            <p className="text-skinz-text-secondary text-xs mt-1">
              Last Prescribed: {new Date(Math.max(...veteran.mpd.medications.map(m => new Date(m.prescribedDate).getTime()))).toLocaleDateString()}
            </p>
          </div>
          
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <p className="text-skinz-text-secondary text-sm">Upcoming Appointments</p>
            </div>
            <p className="text-white font-bold text-2xl">
              {veteran.mpd.appointments.filter(a => a.status === 'Scheduled').length}
            </p>
            <p className="text-skinz-text-secondary text-xs mt-1">
              Next: {veteran.mpd.appointments.find(a => a.status === 'Scheduled')?.type || 'None'}
            </p>
          </div>
        </div>
      </div>

      {/* Disability Rating Progression */}
      <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Disability Rating Progression</h3>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ratingProgressionData}>
              <defs>
                <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1d23', border: '1px solid #333' }}
                labelStyle={{ color: '#999' }}
              />
              <Area 
                type="monotone" 
                dataKey="rating" 
                stroke="#00F0FF" 
                fill="url(#ratingGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Medical Conditions */}
      <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Medical Conditions</h3>
        </div>
        
        <div className="space-y-3">
          {veteran.mpd.conditions.map((condition, index) => (
            <div 
              key={index} 
              className={`bg-skinz-bg-tertiary/50 rounded-lg p-4 border cursor-pointer transition-all ${
                selectedCondition === index ? 'border-skinz-accent' : 'border-skinz-border/50'
              }`}
              onClick={() => setSelectedCondition(selectedCondition === index ? null : index)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-white font-semibold">{condition.description}</p>
                    {condition.serviceConnected && (
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                        Service Connected
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-skinz-text-secondary">ICD Code</p>
                      <p className="text-white font-mono">{condition.code}</p>
                    </div>
                    <div>
                      <p className="text-skinz-text-secondary">Rating</p>
                      <p className="text-white font-bold">{condition.rating}%</p>
                    </div>
                    <div>
                      <p className="text-skinz-text-secondary">Status</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs ${
                        condition.status === 'Active' 
                          ? 'bg-red-500/20 text-red-400'
                          : condition.status === 'Chronic'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {condition.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-skinz-text-secondary">Diagnosed</p>
                      <p className="text-white">{new Date(condition.dateDiagnosed).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {selectedCondition === index && (
                    <div className="mt-4 pt-4 border-t border-skinz-border/50">
                      <p className="text-skinz-text-secondary text-sm mb-2">Treatment Plan</p>
                      <p className="text-white">{condition.treatment}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Condition Severity Chart */}
        <div className="mt-6 pt-6 border-t border-skinz-border">
          <p className="text-skinz-text-secondary text-sm mb-4">Condition Severity Distribution</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conditionSeverityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#666" angle={-45} textAnchor="end" height={70} />
                <YAxis stroke="#666" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1d23', border: '1px solid #333' }}
                  labelStyle={{ color: '#999' }}
                />
                <Bar dataKey="rating" fill="#00F0FF" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Current Medications */}
      <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <Pill className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Current Medications</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {veteran.mpd.medications.map((med, index) => (
            <div key={index} className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-white font-semibold">{med.name}</p>
                  <p className="text-skinz-accent">{med.dosage} - {med.frequency}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  med.status === 'Active'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {med.status}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-skinz-text-secondary">
                  Prescribed by: <span className="text-white">{med.prescribedBy}</span>
                </p>
                <p className="text-skinz-text-secondary">
                  {new Date(med.prescribedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Appointments */}
      <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Medical Appointments</h3>
        </div>
        
        <div className="space-y-3">
          {veteran.mpd.appointments.map((apt, index) => (
            <div key={index} className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-4 h-4 text-skinz-accent" />
                    <p className="text-white font-semibold">{apt.type}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      apt.status === 'Scheduled' 
                        ? 'bg-blue-500/20 text-blue-400'
                        : apt.status === 'Completed'
                        ? 'bg-green-500/20 text-green-400'
                        : apt.status === 'Cancelled'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-skinz-text-secondary">Date</p>
                      <p className="text-white">{new Date(apt.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-skinz-text-secondary">Provider</p>
                      <p className="text-white">{apt.provider}</p>
                    </div>
                    <div>
                      <p className="text-skinz-text-secondary">Facility</p>
                      <p className="text-white">{apt.facility}</p>
                    </div>
                  </div>
                  {apt.notes && (
                    <div className="mt-3 pt-3 border-t border-skinz-border/50">
                      <p className="text-skinz-text-secondary text-sm">Notes</p>
                      <p className="text-white text-sm mt-1">{apt.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lab Results */}
      <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Recent Lab Results</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-skinz-border">
                <th className="text-left text-skinz-text-secondary text-sm font-medium pb-3">Date</th>
                <th className="text-left text-skinz-text-secondary text-sm font-medium pb-3">Test Type</th>
                <th className="text-left text-skinz-text-secondary text-sm font-medium pb-3">Result</th>
                <th className="text-left text-skinz-text-secondary text-sm font-medium pb-3">Normal Range</th>
                <th className="text-left text-skinz-text-secondary text-sm font-medium pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {veteran.mpd.labResults.map((lab, index) => (
                <tr key={index} className="border-b border-skinz-border/30">
                  <td className="py-3 text-white">{new Date(lab.date).toLocaleDateString()}</td>
                  <td className="py-3 text-white">{lab.type}</td>
                  <td className="py-3 text-white font-mono">{lab.result}</td>
                  <td className="py-3 text-skinz-text-secondary">{lab.normalRange}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-1 rounded ${
                      lab.status === 'Normal'
                        ? 'bg-green-500/20 text-green-400'
                        : lab.status === 'Abnormal'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {lab.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Treatment Records */}
      {veteran.profileServices?.treatmentRecords && veteran.profileServices.treatmentRecords.length > 0 && (
        <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <Syringe className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Treatment History</h3>
          </div>
          
          <div className="space-y-3">
            {veteran.profileServices.treatmentRecords.slice(0, 5).map((record, index) => (
              <div key={index} className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-white font-semibold">{record.chiefComplaint}</p>
                    <p className="text-skinz-text-secondary text-sm">{record.provider} - {record.facility}</p>
                  </div>
                  <p className="text-skinz-text-secondary text-sm">
                    {new Date(record.date).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-skinz-text-secondary text-sm mt-2">{record.diagnosis} - {record.treatment}</p>
                {record.followUp && (
                  <div className="mt-2 pt-2 border-t border-skinz-border/50">
                    <p className="text-skinz-accent text-sm">Follow-up: {record.followUp}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}