'use client';

import { useState } from 'react';
import { 
  X, User, Phone, Mail, MapPin, Shield, Award, Heart, 
  FileText, Calendar, Download, ChevronRight, CheckCircle,
  AlertCircle, Clock, DollarSign, Home, GraduationCap,
  Stethoscope, Pill, Activity, FolderOpen, RefreshCw,
  AlertTriangle, TrendingUp, Users, Star
} from 'lucide-react';
import { VeteranDetails } from '@/lib/veteran-details';

interface VeteranDetailModalProps {
  veteran: VeteranDetails;
  isOpen: boolean;
  onClose: () => void;
  onSync: (id: string) => void;
  isSyncing: boolean;
}

type TabType = 'overview' | 'service' | 'medical' | 'benefits' | 'claims' | 'documents' | 'sync';

export function VeteranDetailModal({ veteran, isOpen, onClose, onSync, isSyncing }: VeteranDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  if (!isOpen) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'service', label: 'Service Record', icon: Shield },
    { id: 'medical', label: 'Medical', icon: Heart },
    { id: 'benefits', label: 'Benefits', icon: DollarSign },
    { id: 'claims', label: 'Claims', icon: FileText },
    { id: 'documents', label: 'Documents', icon: FolderOpen },
    { id: 'sync', label: 'Sync Status', icon: RefreshCw }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        </div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {veteran.firstName} {veteran.middleName} {veteran.lastName} {veteran.suffix}
                  </h2>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-blue-100">SSN: {veteran.ssn}</span>
                    <span className="text-blue-100">DOD ID: {veteran.mpr.dodId}</span>
                    <span className="px-2 py-0.5 bg-white/20 rounded text-white text-sm">
                      {veteran.mpr.branch}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="text-white/80 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="bg-gray-700 px-6 py-3 border-b border-gray-600">
            <div className="grid grid-cols-6 gap-4">
              <QuickStat label="Disability Rating" value={`${veteran.mpd.disabilityRating}%`} color="green" />
              <QuickStat label="Service Years" value={veteran.mpr.totalServiceYears} color="blue" />
              <QuickStat label="Monthly Benefit" value={`$${veteran.benefits.monthlyAmount}`} color="yellow" />
              <QuickStat label="Claims" value={veteran.claims.length} color="purple" />
              <QuickStat label="Profile Accuracy" value={`${veteran.vetProfileStatus.accuracy.toFixed(1)}%`} color="cyan" />
              <QuickStat label="Last Sync" value={new Date(veteran.vetProfileStatus.lastSync).toLocaleDateString()} color="gray" />
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-gray-750 border-b border-gray-600">
            <div className="flex overflow-x-auto">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`px-4 py-3 flex items-center gap-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-400 text-blue-400 bg-gray-800'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto bg-gray-800">
            {activeTab === 'overview' && <OverviewTab veteran={veteran} />}
            {activeTab === 'service' && <ServiceTab veteran={veteran} />}
            {activeTab === 'medical' && <MedicalTab veteran={veteran} />}
            {activeTab === 'benefits' && <BenefitsTab veteran={veteran} />}
            {activeTab === 'claims' && <ClaimsTab veteran={veteran} />}
            {activeTab === 'documents' && <DocumentsTab veteran={veteran} />}
            {activeTab === 'sync' && <SyncTab veteran={veteran} onSync={onSync} isSyncing={isSyncing} />}
          </div>

          {/* Footer */}
          <div className="bg-gray-700 px-6 py-4 flex justify-between">
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Profile
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Generate Report
              </button>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab Components
function OverviewTab({ veteran }: { veteran: VeteranDetails }) {
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Section title="Personal Information" icon={User}>
        <div className="grid grid-cols-2 gap-4">
          <InfoItem label="Full Name" value={`${veteran.firstName} ${veteran.middleName} ${veteran.lastName} ${veteran.suffix || ''}`} />
          <InfoItem label="Date of Birth" value={new Date(veteran.dateOfBirth).toLocaleDateString()} />
          <InfoItem label="Place of Birth" value={veteran.placeOfBirth} />
          <InfoItem label="Gender" value={veteran.gender} />
          <InfoItem label="Marital Status" value={veteran.maritalStatus} />
          <InfoItem label="SSN" value={veteran.ssn} />
        </div>
      </Section>

      {/* Contact Information */}
      <Section title="Contact Information" icon={Phone}>
        <div className="grid grid-cols-2 gap-4">
          <InfoItem label="Phone" value={veteran.contact.phone} icon={<Phone className="w-4 h-4" />} />
          <InfoItem label="Email" value={veteran.contact.email} icon={<Mail className="w-4 h-4" />} />
          <div className="col-span-2">
            <InfoItem 
              label="Address" 
              value={`${veteran.contact.address.street1}${veteran.contact.address.street2 ? ', ' + veteran.contact.address.street2 : ''}, ${veteran.contact.address.city}, ${veteran.contact.address.state} ${veteran.contact.address.zipCode}`}
              icon={<MapPin className="w-4 h-4" />}
            />
          </div>
        </div>
      </Section>

      {/* Service Summary */}
      <Section title="Service Summary" icon={Shield}>
        <div className="grid grid-cols-3 gap-4">
          <InfoItem label="Branch" value={veteran.mpr.branch} />
          <InfoItem label="Rank" value={veteran.mpr.rank} />
          <InfoItem label="Pay Grade" value={veteran.mpr.payGrade} />
          <InfoItem label="Service Number" value={veteran.mpr.serviceNumber} />
          <InfoItem label="Component" value={veteran.mpr.component} />
          <InfoItem label="Total Service" value={`${veteran.mpr.totalServiceYears} years, ${veteran.mpr.totalServiceMonths % 12} months`} />
        </div>
      </Section>
    </div>
  );
}

function ServiceTab({ veteran }: { veteran: VeteranDetails }) {
  return (
    <div className="space-y-6">
      {/* Service Timeline */}
      <Section title="Service Timeline" icon={Calendar}>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-600"></div>
          {veteran.mpr.units.map((unit, index) => (
            <div key={index} className="relative flex items-start mb-4">
              <div className="absolute left-4 w-2 h-2 bg-blue-400 rounded-full -translate-x-1/2"></div>
              <div className="ml-10 bg-gray-700 rounded-lg p-4 flex-1">
                <h4 className="font-semibold text-white">{unit.unitName}</h4>
                <p className="text-gray-400 text-sm">{unit.location}</p>
                <p className="text-gray-400 text-sm">Duty: {unit.duty}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {new Date(unit.assignedDate).toLocaleDateString()} - {unit.departedDate ? new Date(unit.departedDate).toLocaleDateString() : 'Present'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Deployments */}
      <Section title="Deployments" icon={Award}>
        <div className="space-y-3">
          {veteran.mpr.deployments.map((deployment, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-white">{deployment.operation}</h4>
                  <p className="text-gray-400">{deployment.location}</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(deployment.startDate).toLocaleDateString()} - {new Date(deployment.endDate).toLocaleDateString()}
                  </p>
                </div>
                {deployment.awards.length > 0 && (
                  <div className="flex gap-2">
                    {deployment.awards.map((award, i) => (
                      <span key={i} className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                        {award}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Military Education & Specialties */}
      <Section title="Education & Specialties" icon={GraduationCap}>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-300 mb-2">Military Education</h4>
            <ul className="space-y-1">
              {veteran.mpr.education.militaryEducation.map((edu, i) => (
                <li key={i} className="text-gray-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  {edu}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-300 mb-2">Specialties</h4>
            <ul className="space-y-2">
              {veteran.mpr.specialties.map((spec, i) => (
                <li key={i} className="text-gray-400">
                  <span className="font-medium">{spec.code}</span> - {spec.title}
                  <span className={`ml-2 text-xs ${spec.status === 'Active' ? 'text-green-400' : 'text-gray-500'}`}>
                    ({spec.status})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </div>
  );
}

function MedicalTab({ veteran }: { veteran: VeteranDetails }) {
  return (
    <div className="space-y-6">
      {/* Medical Conditions */}
      <Section title="Service-Connected Conditions" icon={Heart}>
        <div className="space-y-3">
          {veteran.mpd.conditions.map((condition, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-white">{condition.description}</h4>
                  <p className="text-gray-400 text-sm">Code: {condition.code}</p>
                  <p className="text-gray-400 text-sm">Treatment: {condition.treatment}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-blue-400">{condition.rating}%</span>
                  <p className="text-xs text-gray-400">Rating</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    condition.status === 'Active' ? 'bg-red-500/20 text-red-400' :
                    condition.status === 'Chronic' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {condition.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Medications */}
      <Section title="Current Medications" icon={Pill}>
        <div className="grid grid-cols-2 gap-3">
          {veteran.mpd.medications.map((med, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-white">{med.name}</h4>
                  <p className="text-gray-400 text-sm">{med.dosage} - {med.frequency}</p>
                  <p className="text-gray-500 text-xs">Prescribed by {med.prescribedBy}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  med.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {med.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Appointments */}
      <Section title="Upcoming Appointments" icon={Calendar}>
        <div className="space-y-2">
          {veteran.mpd.appointments
            .filter(apt => apt.status === 'Scheduled')
            .map((apt, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">
                      {new Date(apt.date).getDate()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{apt.type}</p>
                    <p className="text-gray-400 text-sm">{apt.provider} - {apt.facility}</p>
                  </div>
                </div>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
            ))}
        </div>
      </Section>
    </div>
  );
}

function BenefitsTab({ veteran }: { veteran: VeteranDetails }) {
  return (
    <div className="space-y-6">
      {/* Compensation */}
      <Section title="Compensation & Pension" icon={DollarSign}>
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-green-100 text-sm">Monthly Amount</p>
              <p className="text-3xl font-bold">${veteran.benefits.monthlyAmount}</p>
            </div>
            <div>
              <p className="text-green-100 text-sm">Type</p>
              <p className="text-xl font-semibold">{veteran.benefits.compensationType}</p>
            </div>
            <div>
              <p className="text-green-100 text-sm">Dependents</p>
              <p className="text-xl font-semibold">{veteran.benefits.dependents}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Education Benefits */}
      <Section title="Education Benefits" icon={GraduationCap}>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">GI Bill Status</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Months Remaining</span>
                <span className="text-white font-semibold">{veteran.benefits.education.giBlllRemaining}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Months Used</span>
                <span className="text-white font-semibold">{veteran.benefits.education.giBlllUsed}</span>
              </div>
            </div>
          </div>
          {veteran.benefits.education.degreeProgram && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Current Education</h4>
              <p className="text-gray-400">Program: {veteran.benefits.education.degreeProgram}</p>
              <p className="text-gray-400">School: {veteran.benefits.education.school}</p>
            </div>
          )}
        </div>
      </Section>

      {/* Healthcare */}
      <Section title="Healthcare Benefits" icon={Stethoscope}>
        <div className="grid grid-cols-2 gap-4">
          <InfoItem label="Enrollment Date" value={new Date(veteran.benefits.healthcare.enrollmentDate).toLocaleDateString()} />
          <InfoItem label="Priority Group" value={`Group ${veteran.benefits.healthcare.priorityGroup}`} />
          <InfoItem label="Primary Facility" value={veteran.benefits.healthcare.facility} />
          <InfoItem label="Copay Status" value={veteran.benefits.healthcare.copayStatus} />
        </div>
      </Section>

      {/* Housing */}
      <Section title="Housing Benefits" icon={Home}>
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white">VA Home Loan</h4>
              <p className="text-gray-400">
                Status: {veteran.benefits.housing.hasVALoan ? 'Active' : 'Not Used'}
              </p>
              {veteran.benefits.housing.loanAmount && (
                <p className="text-gray-400">
                  Loan Amount: ${veteran.benefits.housing.loanAmount.toLocaleString()}
                </p>
              )}
            </div>
            <Home className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </Section>
    </div>
  );
}

function ClaimsTab({ veteran }: { veteran: VeteranDetails }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Claims History</h3>
        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
          File New Claim
        </button>
      </div>
      
      {veteran.claims.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No claims on record
        </div>
      ) : (
        <div className="space-y-3">
          {veteran.claims.map((claim, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-white">{claim.claimNumber}</h4>
                  <p className="text-gray-400">{claim.type}</p>
                  <p className="text-gray-500 text-sm">Filed: {new Date(claim.filingDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs ${
                    claim.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
                    claim.status === 'DENIED' ? 'bg-red-500/20 text-red-400' :
                    claim.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {claim.status}
                  </span>
                  {claim.rating && (
                    <p className="text-lg font-bold text-white mt-2">{claim.rating}%</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DocumentsTab({ veteran }: { veteran: VeteranDetails }) {
  const categories = ['All', 'Service', 'Medical', 'Benefits', 'Claims', 'Other'];
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const filteredDocs = selectedCategory === 'All' 
    ? veteran.documents 
    : veteran.documents.filter(doc => doc.category === selectedCategory);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded text-sm ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {filteredDocs.map((doc) => (
          <div key={doc.id} className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-400 mt-1" />
                <div>
                  <p className="font-semibold text-white text-sm">{doc.type}</p>
                  <p className="text-gray-400 text-xs">{doc.name}</p>
                  <p className="text-gray-500 text-xs">
                    {new Date(doc.uploadDate).toLocaleDateString()} • {doc.size}
                  </p>
                </div>
              </div>
              <Download className="w-4 h-4 text-gray-400 hover:text-white" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SyncTab({ veteran, onSync, isSyncing }: { veteran: VeteranDetails; onSync: (id: string) => void; isSyncing: boolean }) {
  return (
    <div className="space-y-6">
      {/* Sync Status Overview */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Profile Sync Status</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-blue-100 text-sm">Accuracy</p>
                <p className="text-3xl font-bold">{veteran.vetProfileStatus.accuracy.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Status</p>
                <p className="text-xl font-semibold">{veteran.vetProfileStatus.status}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Last Sync</p>
                <p className="text-lg">{new Date(veteran.vetProfileStatus.lastSync).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => onSync(veteran.id)}
            disabled={isSyncing}
            className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-blue-50 disabled:opacity-50"
          >
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>
      </div>

      {/* Data Points Verification */}
      <Section title="Data Points Verification" icon={CheckCircle}>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(veteran.vetProfileStatus.dataPoints).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
              <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              {value ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Discrepancies */}
      {veteran.vetProfileStatus.discrepancies.length > 0 && (
        <Section title="Discrepancies Found" icon={AlertTriangle}>
          <div className="space-y-2">
            {veteran.vetProfileStatus.discrepancies.map((disc, index) => (
              <div key={index} className="flex items-center gap-2 text-yellow-400">
                <AlertTriangle className="w-4 h-4" />
                <span>{disc}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Fallback Status */}
      {veteran.vetProfileStatus.fallbackUsed && (
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-400">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">DD-214 Fallback Used</span>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Vet Profile API was unavailable. Data was retrieved from DD-214 records.
          </p>
        </div>
      )}
    </div>
  );
}

// Helper Components
function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InfoItem({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-white font-medium flex items-center gap-2">
        {icon}
        {value}
      </p>
    </div>
  );
}

function QuickStat({ label, value, color }: { label: string; value: any; color: string }) {
  const colorClasses = {
    green: 'text-green-400',
    blue: 'text-blue-400',
    yellow: 'text-yellow-400',
    purple: 'text-purple-400',
    cyan: 'text-cyan-400',
    gray: 'text-gray-400'
  };

  return (
    <div className="text-center">
      <p className="text-gray-400 text-xs">{label}</p>
      <p className={`text-lg font-bold ${colorClasses[color as keyof typeof colorClasses]}`}>{value}</p>
    </div>
  );
}