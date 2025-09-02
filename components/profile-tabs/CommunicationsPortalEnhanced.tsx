'use client';

import React, { useState } from 'react';
import { VeteranProfileEnhanced } from '@/lib/henry/veteran-profile-enhanced';
import { 
  vaFormsDatabase, 
  letterTemplatesDatabase, 
  searchVAForms, 
  searchLetterTemplates,
  getFormCategories,
  getTemplateCategories,
  type VAForm,
  type LetterTemplate 
} from '@/lib/va-claims/va-forms-database';
import { 
  MessageSquare, Send, Phone, Mail, FileText, Calendar, 
  Clock, User, CheckCircle, AlertCircle, Eye, Download,
  Plus, Search, Filter, Archive, Star, Paperclip,
  Edit3, Save, X, ChevronRight, ChevronDown, Copy,
  Printer, History, Bell, Flag, Zap, Upload, 
  Settings, MoreHorizontal, RefreshCw, AlertTriangle,
  PhoneCall, Video, MessageCircle, Headphones, Hash,
  BookOpen, Database, FileText as Template, Users, Building, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommunicationsPortalEnhancedProps {
  veteran: VeteranProfileEnhanced;
}

interface Communication {
  id: string;
  type: 'letter' | 'email' | 'phone' | 'meeting' | 'note';
  subject: string;
  content: string;
  date: Date;
  status: 'sent' | 'pending' | 'delivered' | 'read' | 'responded';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  method: string;
  form0820: {
    filled: boolean;
    formId?: string;
    noteId?: string;
  };
  attachments?: string[];
  tracking?: {
    deliveredAt?: Date;
    readAt?: Date;
    respondedAt?: Date;
  };
}

interface DocumentState {
  searchTerm: string;
  selectedCategory: string;
  selectedTemplate: LetterTemplate | null;
  selectedForm: VAForm | null;
  variableValues: Record<string, string>;
  previewMode: boolean;
}

export default function CommunicationsPortalEnhanced({ veteran }: CommunicationsPortalEnhancedProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'compose' | 'history' | 'templates' | 'tracking' | 'form0820' | 'forms'>('dashboard');
  const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null);
  const [showForm0820, setShowForm0820] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [documentState, setDocumentState] = useState<DocumentState>({
    searchTerm: '',
    selectedCategory: 'All',
    selectedTemplate: null,
    selectedForm: null,
    variableValues: {},
    previewMode: false
  });

  // Sample communications data
  const communications: Communication[] = [
    {
      id: '1',
      type: 'letter',
      subject: 'C&P Examination Notification',
      content: 'Dear Mr. Johnson, You have been scheduled for a Compensation and Pension examination...',
      date: new Date('2024-08-25'),
      status: 'delivered',
      priority: 'high',
      method: 'USPS Certified Mail',
      form0820: { filled: true, formId: 'F0820-001', noteId: 'NOTE-001' },
      attachments: ['exam_instructions.pdf'],
      tracking: {
        deliveredAt: new Date('2024-08-27'),
        readAt: new Date('2024-08-28')
      }
    },
    {
      id: '2',
      type: 'phone',
      subject: 'Follow-up on Missing Documentation',
      content: 'Called veteran regarding missing medical records for claim #123456. Veteran confirmed will submit within 10 days.',
      date: new Date('2024-08-20'),
      status: 'responded',
      priority: 'normal',
      method: 'Phone Call',
      form0820: { filled: true, formId: 'F0820-002', noteId: 'NOTE-002' },
      tracking: {
        respondedAt: new Date('2024-08-22')
      }
    },
    {
      id: '3',
      type: 'email',
      subject: 'Claim Decision Notification',
      content: 'Your disability compensation claim has been processed...',
      date: new Date('2024-08-15'),
      status: 'read',
      priority: 'urgent',
      method: 'Secure Email',
      form0820: { filled: false },
      tracking: {
        deliveredAt: new Date('2024-08-15'),
        readAt: new Date('2024-08-16')
      }
    }
  ];

  // Get templates from comprehensive database
  const templates = letterTemplatesDatabase;
  const vaForms = vaFormsDatabase;
  const formCategories = getFormCategories();
  const templateCategories = getTemplateCategories();

  // Legacy template structure for backward compatibility
  const legacyTemplates = [
    {
      id: 't1',
      name: 'C&P Examination Notice',
      category: 'Examinations',
      form: 'VA Form 21-2545',
      description: 'Notification letter for Compensation and Pension examinations',
      content: `Dear \{\{veteranName\}\},

You have been scheduled for a Compensation and Pension (C&P) examination in connection with your disability claim.

Examination Details:
Date: \{\{examDate\}\}
Time: \{\{examTime\}\}
Location: \{\{examLocation\}\}
Type: \{\{examType\}\}

Please bring:
- Photo identification
- List of current medications
- Any relevant medical records

Failure to attend this examination may result in a decision based on the evidence already in your file.

If you cannot attend, please contact us immediately at \{\{contactNumber\}\}.

Sincerely,
\{\{processorName\}\}
VA Regional Office`,
      variables: ['veteranName', 'examDate', 'examTime', 'examLocation', 'examType', 'contactNumber', 'processorName'],
      useCount: 45,
      lastUsed: new Date('2024-08-25')
    },
    {
      id: 't2',
      name: 'Request for Additional Evidence',
      category: 'Evidence Requests',
      form: 'VA Form 21-4138',
      description: 'Letter requesting additional medical evidence or documentation',
      content: `Dear \{\{veteranName\}\},

We are processing your disability compensation claim filed on \{\{claimDate\}\}. To complete our review, we need additional information:

Required Documents:
\{\{requiredDocuments\}\}

Please submit the requested information within 30 days of this letter. You may submit documents:
- Online at VA.gov
- By mail to: \{\{mailingAddress\}\}
- By fax to: \{\{faxNumber\}\}

If you need assistance obtaining these records, please contact us at \{\{contactNumber\}\}.

Your claim will remain in pending status until we receive this information.

Sincerely,
\{\{processorName\}\}
Veterans Service Representative`,
      variables: ['veteranName', 'claimDate', 'requiredDocuments', 'mailingAddress', 'faxNumber', 'contactNumber', 'processorName'],
      useCount: 32,
      lastUsed: new Date('2024-08-20')
    },
    {
      id: 't3',
      name: 'Decision Notification Letter',
      category: 'Decisions',
      form: 'VA Form 21-6817',
      description: 'Notification of claim decision and rating',
      content: `Dear \{\{veteranName\}\},

We have completed the review of your disability compensation claim filed on \{\{claimDate\}\}.

DECISION SUMMARY:
\{\{decisionSummary\}\}

EFFECTIVE DATE: \{\{effectiveDate\}\}
MONTHLY COMPENSATION: $\{\{monthlyAmount\}\}

This decision is based on:
\{\{evidenceConsidered\}\}

RIGHT TO APPEAL:
If you disagree with this decision, you have the right to appeal. You have one year from the date of this letter to file:
- A Supplemental Claim with new evidence
- A Higher-Level Review
- An Appeal to the Board of Veterans' Appeals

For more information about your appeal rights, please see the enclosed VA Form 4107.

Sincerely,
\{\{processorName\}\}
Rating Veterans Service Representative`,
      variables: ['veteranName', 'claimDate', 'decisionSummary', 'effectiveDate', 'monthlyAmount', 'evidenceConsidered', 'processorName'],
      useCount: 28,
      lastUsed: new Date('2024-08-15')
    }
  ];

  // Form 0820 structure
  const form0820Template = {
    form: 'VA Form 0820',
    title: 'Report of Contact',
    sections: {
      veteranInfo: {
        name: `${veteran.firstName} ${veteran.lastName}`,
        ssn: veteran.ssn,
        vaFileNumber: veteran.mpr.serviceNumber,
        claimNumber: 'Multiple Active Claims'
      },
      contactInfo: {
        dateOfContact: new Date(),
        timeOfContact: '',
        methodOfContact: '',
        initiatedBy: '',
        contactedBy: '',
        purpose: '',
        summary: '',
        actionTaken: '',
        followUpRequired: false,
        followUpDate: '',
        additionalNotes: ''
      }
    }
  };

  const [composingMessage, setComposingMessage] = useState({
    type: 'letter' as Communication['type'],
    subject: '',
    content: '',
    method: '',
    priority: 'normal' as Communication['priority'],
    templateId: '',
    attachments: [] as string[]
  });

  const [form0820Data, setForm0820Data] = useState(form0820Template);

  const getStatusColor = (status: Communication['status']) => {
    switch (status) {
      case 'sent': return 'text-blue-400 bg-blue-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      case 'delivered': return 'text-green-400 bg-green-500/20';
      case 'read': return 'text-purple-400 bg-purple-500/20';
      case 'responded': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getPriorityColor = (priority: Communication['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'normal': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'low': return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      default: return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    }
  };

  const applyTemplate = (template: LetterTemplate) => {
    setDocumentState({
      ...documentState,
      selectedTemplate: template,
      variableValues: {}
    });
    setComposingMessage({
      ...composingMessage,
      subject: template.name,
      content: template.content,
      templateId: template.id
    });
  };

  const substituteVariables = (content: string, values: Record<string, string>) => {
    let result = content;
    Object.entries(values).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, value);
    });
    return result;
  };

  const fillForm0820 = (communication: Communication) => {
    setForm0820Data({
      ...form0820Template,
      sections: {
        ...form0820Template.sections,
        contactInfo: {
          ...form0820Template.sections.contactInfo,
          dateOfContact: communication.date,
          methodOfContact: communication.method,
          purpose: communication.subject,
          summary: communication.content.substring(0, 500),
          actionTaken: `${communication.type} communication sent via ${communication.method}`,
          followUpRequired: communication.priority === 'high' || communication.priority === 'urgent'
        }
      }
    });
    setShowForm0820(true);
  };

  const filteredCommunications = communications.filter(comm => {
    const matchesSearch = comm.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comm.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || comm.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-skinz-bg-secondary to-skinz-bg-tertiary backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Communications Portal</h3>
              <p className="text-skinz-text-secondary text-sm">
                Comprehensive communication management for {veteran.firstName} {veteran.lastName}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-skinz-accent text-white rounded-lg hover:bg-skinz-accent/80 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Communication
            </button>
            <button 
              onClick={() => setShowForm0820(true)}
              className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              VA Form 0820
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: MessageSquare },
            { id: 'compose', label: 'Compose', icon: Edit3 },
            { id: 'templates', label: 'Letter Templates', icon: Template },
            { id: 'forms', label: 'VA Forms', icon: Database },
            { id: 'history', label: 'History', icon: History },
            { id: 'tracking', label: 'Tracking', icon: Eye },
            { id: 'form0820', label: 'Form 0820', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-skinz-accent text-white'
                    : 'bg-skinz-bg-tertiary/50 text-skinz-text-secondary hover:bg-skinz-bg-tertiary'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-skinz-bg-secondary/50 rounded-lg p-4 border border-skinz-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-skinz-text-secondary text-sm">Total Communications</p>
                  <p className="text-white font-bold text-2xl">{communications.length}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-skinz-bg-secondary/50 rounded-lg p-4 border border-skinz-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-skinz-text-secondary text-sm">Pending Responses</p>
                  <p className="text-white font-bold text-2xl">
                    {communications.filter(c => c.status === 'pending' || c.status === 'sent').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </div>

            <div className="bg-skinz-bg-secondary/50 rounded-lg p-4 border border-skinz-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-skinz-text-secondary text-sm">Forms 0820 Filed</p>
                  <p className="text-white font-bold text-2xl">
                    {communications.filter(c => c.form0820.filled).length}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-green-400" />
              </div>
            </div>

            <div className="bg-skinz-bg-secondary/50 rounded-lg p-4 border border-skinz-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-skinz-text-secondary text-sm">High Priority</p>
                  <p className="text-white font-bold text-2xl">
                    {communications.filter(c => c.priority === 'high' || c.priority === 'urgent').length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </div>
          </div>

          {/* Recent Communications */}
          <div className="bg-skinz-bg-secondary/50 rounded-xl p-6 border border-skinz-border">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">Recent Communications</h4>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-skinz-text-secondary absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search communications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-skinz-bg-tertiary rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-skinz-accent"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-skinz-bg-tertiary rounded-lg text-white text-sm focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="sent">Sent</option>
                  <option value="pending">Pending</option>
                  <option value="delivered">Delivered</option>
                  <option value="read">Read</option>
                  <option value="responded">Responded</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredCommunications.map((comm, idx) => (
                <motion.div
                  key={comm.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50 hover:border-skinz-accent/50 transition-all cursor-pointer"
                  onClick={() => setSelectedCommunication(comm)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          comm.type === 'letter' ? 'bg-blue-500/20' :
                          comm.type === 'email' ? 'bg-green-500/20' :
                          comm.type === 'phone' ? 'bg-purple-500/20' :
                          'bg-orange-500/20'
                        }`}>
                          {comm.type === 'letter' && <Mail className="w-4 h-4 text-blue-400" />}
                          {comm.type === 'email' && <MessageCircle className="w-4 h-4 text-green-400" />}
                          {comm.type === 'phone' && <Phone className="w-4 h-4 text-purple-400" />}
                          {comm.type === 'meeting' && <Users className="w-4 h-4 text-orange-400" />}
                        </div>
                        <div>
                          <p className="text-white font-medium">{comm.subject}</p>
                          <p className="text-skinz-text-secondary text-xs">{comm.method}</p>
                        </div>
                      </div>
                      
                      <p className="text-skinz-text-secondary text-sm mb-3 line-clamp-2">
                        {comm.content}
                      </p>

                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-skinz-text-secondary">
                          {comm.date.toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-1 rounded ${getStatusColor(comm.status)}`}>
                          {comm.status}
                        </span>
                        <span className={`px-2 py-1 rounded border ${getPriorityColor(comm.priority)}`}>
                          {comm.priority}
                        </span>
                        {comm.form0820.filled && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            0820 Filed
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          fillForm0820(comm);
                        }}
                        className="p-1 hover:bg-skinz-bg-primary rounded"
                        title="Fill Form 0820"
                      >
                        <FileText className="w-4 h-4 text-skinz-text-secondary hover:text-white" />
                      </button>
                      
                      {comm.attachments && comm.attachments.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Paperclip className="w-3 h-3 text-skinz-text-secondary" />
                          <span className="text-xs text-skinz-text-secondary">{comm.attachments.length}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Compose Tab */}
      {activeTab === 'compose' && (
        <div className="space-y-6">
          <div className="bg-skinz-bg-secondary/50 rounded-xl p-6 border border-skinz-border">
            <h4 className="text-lg font-semibold text-white mb-6">Compose New Communication</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Communication Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-skinz-text-secondary text-sm mb-2">Communication Type</label>
                  <select
                    value={composingMessage.type}
                    onChange={(e) => setComposingMessage({...composingMessage, type: e.target.value as Communication['type']})}
                    className="w-full px-3 py-2 bg-skinz-bg-tertiary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-skinz-accent"
                  >
                    <option value="letter">Letter</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone Call</option>
                    <option value="meeting">Meeting</option>
                    <option value="note">Note</option>
                  </select>
                </div>

                <div>
                  <label className="block text-skinz-text-secondary text-sm mb-2">Subject</label>
                  <input
                    type="text"
                    value={composingMessage.subject}
                    onChange={(e) => setComposingMessage({...composingMessage, subject: e.target.value})}
                    className="w-full px-3 py-2 bg-skinz-bg-tertiary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-skinz-accent"
                    placeholder="Enter communication subject..."
                  />
                </div>

                <div>
                  <label className="block text-skinz-text-secondary text-sm mb-2">Method</label>
                  <input
                    type="text"
                    value={composingMessage.method}
                    onChange={(e) => setComposingMessage({...composingMessage, method: e.target.value})}
                    className="w-full px-3 py-2 bg-skinz-bg-tertiary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-skinz-accent"
                    placeholder="e.g., USPS Certified Mail, Secure Email, Phone Call"
                  />
                </div>

                <div>
                  <label className="block text-skinz-text-secondary text-sm mb-2">Priority</label>
                  <select
                    value={composingMessage.priority}
                    onChange={(e) => setComposingMessage({...composingMessage, priority: e.target.value as Communication['priority']})}
                    className="w-full px-3 py-2 bg-skinz-bg-tertiary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-skinz-accent"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {/* Template Selection */}
              <div className="space-y-4">
                <div>
                  <label className="block text-skinz-text-secondary text-sm mb-2">Use Template</label>
                  <select
                    value={composingMessage.templateId}
                    onChange={(e) => {
                      const template = templates.find(t => t.id === e.target.value);
                      if (template) applyTemplate(template);
                    }}
                    className="w-full px-3 py-2 bg-skinz-bg-tertiary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-skinz-accent"
                  >
                    <option value="">Select a template...</option>
                    <optgroup label="Examinations">
                      {templates.filter(t => t.category === 'Examinations').map(template => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Evidence">
                      {templates.filter(t => t.category === 'Evidence').map(template => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Decisions">
                      {templates.filter(t => t.category === 'Decisions').map(template => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Notices">
                      {templates.filter(t => t.category === 'Notices').map(template => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Other">
                      {templates.filter(t => !['Examinations', 'Evidence', 'Decisions', 'Notices'].includes(t.category)).map(template => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Variable Substitution */}
                {documentState.selectedTemplate && (
                  <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4 mt-4">
                    <h5 className="text-white font-medium mb-3">Template Variables</h5>
                    <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                      {documentState.selectedTemplate.variables.slice(0, 8).map(variable => (
                        <div key={variable}>
                          <label className="block text-skinz-text-secondary text-xs mb-1">
                            {variable.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <input
                            type="text"
                            value={documentState.variableValues[variable] || ''}
                            onChange={(e) => {
                              const newValues = {...documentState.variableValues, [variable]: e.target.value};
                              setDocumentState({...documentState, variableValues: newValues});
                              const updatedContent = substituteVariables(documentState.selectedTemplate!.content, newValues);
                              setComposingMessage({...composingMessage, content: updatedContent});
                            }}
                            className="w-full px-2 py-1 bg-skinz-bg-primary rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-skinz-accent"
                            placeholder={`Enter ${variable}`}
                          />
                        </div>
                      ))}
                    </div>
                    {documentState.selectedTemplate.variables.length > 8 && (
                      <p className="text-skinz-text-secondary text-xs mt-2">
                        +{documentState.selectedTemplate.variables.length - 8} more variables...
                      </p>
                    )}
                  </div>
                )}

                <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
                  <h5 className="text-white font-medium mb-2">Quick Actions</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30 transition-colors">
                      C&P Exam Notice
                    </button>
                    <button className="px-3 py-2 bg-green-500/20 text-green-400 rounded text-sm hover:bg-green-500/30 transition-colors">
                      Request Evidence
                    </button>
                    <button className="px-3 py-2 bg-purple-500/20 text-purple-400 rounded text-sm hover:bg-purple-500/30 transition-colors">
                      Decision Letter
                    </button>
                    <button className="px-3 py-2 bg-orange-500/20 text-orange-400 rounded text-sm hover:bg-orange-500/30 transition-colors">
                      Status Update
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="mt-6">
              <label className="block text-skinz-text-secondary text-sm mb-2">Content</label>
              <textarea
                value={composingMessage.content}
                onChange={(e) => setComposingMessage({...composingMessage, content: e.target.value})}
                rows={12}
                className="w-full px-3 py-2 bg-skinz-bg-tertiary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-skinz-accent resize-none"
                placeholder="Enter your message content..."
              />
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3 justify-end">
              <button className="px-4 py-2 bg-skinz-bg-tertiary text-white rounded-lg hover:bg-skinz-bg-primary transition-colors">
                Save Draft
              </button>
              <button className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors">
                Preview
              </button>
              <button className="px-4 py-2 bg-skinz-accent text-white rounded-lg hover:bg-skinz-accent/80 transition-colors flex items-center gap-2">
                <Send className="w-4 h-4" />
                Send & File 0820
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="bg-skinz-bg-secondary/50 rounded-xl p-6 border border-skinz-border">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-white">Document Templates</h4>
              <button className="px-4 py-2 bg-skinz-accent text-white rounded-lg hover:bg-skinz-accent/80 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Template
              </button>
            </div>

            {/* Templates Categories */}
            <div className="mb-4">
              <select
                value={documentState.selectedCategory}
                onChange={(e) => setDocumentState({...documentState, selectedCategory: e.target.value})}
                className="px-3 py-2 bg-skinz-bg-tertiary rounded-lg text-white text-sm focus:outline-none"
              >
                <option value="All">All Categories</option>
                {templateCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates
                .filter(template => documentState.selectedCategory === 'All' || template.category === documentState.selectedCategory)
                .map((template, idx) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50 hover:border-skinz-accent/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{template.name}</p>
                      {template.subcategory && (
                        <p className="text-skinz-accent text-xs mt-1">{template.subcategory}</p>
                      )}
                    </div>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded whitespace-nowrap">
                      {template.category}
                    </span>
                  </div>

                  <p className="text-skinz-text-secondary text-xs mb-3 line-clamp-2">
                    {template.purpose || template.description}
                  </p>

                  {template.regulatory && (
                    <div className="text-xs bg-skinz-bg-primary px-2 py-1 rounded mb-3">
                      <span className="text-skinz-text-secondary">Reg: </span>
                      <span className="text-skinz-accent">{template.regulatory}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-skinz-text-secondary mb-3">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {template.variables.length} variables
                    </span>
                    {template.relatedForms && (
                      <span className="flex items-center gap-1">
                        <Database className="w-3 h-3" />
                        {template.relatedForms.length} forms
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        applyTemplate(template);
                        setActiveTab('compose');
                      }}
                      className="flex-1 px-3 py-1 bg-skinz-accent/20 text-skinz-accent rounded hover:bg-skinz-accent/30 transition-colors text-sm"
                    >
                      Use Template
                    </button>
                    <button 
                      onClick={() => setDocumentState({...documentState, selectedTemplate: template, previewMode: true})}
                      className="p-1 hover:bg-skinz-bg-primary rounded"
                    >
                      <Eye className="w-4 h-4 text-skinz-text-secondary hover:text-white" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-skinz-bg-secondary/50 rounded-xl p-6 border border-skinz-border">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-white">Communication History</h4>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export History
                </button>
                <button className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center gap-2">
                  <Archive className="w-4 h-4" />
                  Archive Selected
                </button>
              </div>
            </div>

            {/* Timeline View */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <h5 className="text-white font-medium">Communication Timeline</h5>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-skinz-accent/20 text-skinz-accent rounded text-sm">
                    All Time
                  </button>
                  <button className="px-3 py-1 bg-skinz-bg-tertiary/50 text-skinz-text-secondary rounded text-sm hover:bg-skinz-bg-tertiary">
                    Last 30 Days
                  </button>
                  <button className="px-3 py-1 bg-skinz-bg-tertiary/50 text-skinz-text-secondary rounded text-sm hover:bg-skinz-bg-tertiary">
                    Last 90 Days
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-skinz-border"></div>
                <div className="space-y-6">
                  {communications.map((comm, idx) => (
                    <motion.div
                      key={comm.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative flex items-start gap-4"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 bg-skinz-bg-secondary z-10 ${
                        comm.type === 'letter' ? 'border-blue-500' :
                        comm.type === 'email' ? 'border-green-500' :
                        comm.type === 'phone' ? 'border-purple-500' :
                        'border-orange-500'
                      }`}>
                        {comm.type === 'letter' && <Mail className="w-4 h-4 text-blue-400" />}
                        {comm.type === 'email' && <MessageCircle className="w-4 h-4 text-green-400" />}
                        {comm.type === 'phone' && <Phone className="w-4 h-4 text-purple-400" />}
                        {comm.type === 'meeting' && <Users className="w-4 h-4 text-orange-400" />}
                      </div>

                      <div className="flex-1 bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-white font-medium">{comm.subject}</p>
                            <p className="text-skinz-text-secondary text-sm">{comm.date.toLocaleDateString()} • {comm.method}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(comm.status)}`}>
                              {comm.status}
                            </span>
                            {comm.form0820.filled && (
                              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                0820
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-skinz-text-secondary text-sm mb-3 line-clamp-2">
                          {comm.content}
                        </p>

                        {comm.tracking && (
                          <div className="bg-skinz-bg-primary/50 rounded p-2 text-xs text-skinz-text-secondary">
                            <div className="flex gap-4">
                              {comm.tracking.deliveredAt && (
                                <span>Delivered: {comm.tracking.deliveredAt.toLocaleDateString()}</span>
                              )}
                              {comm.tracking.readAt && (
                                <span>Read: {comm.tracking.readAt.toLocaleDateString()}</span>
                              )}
                              {comm.tracking.respondedAt && (
                                <span>Responded: {comm.tracking.respondedAt.toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => setSelectedCommunication(comm)}
                            className="px-3 py-1 bg-skinz-accent/20 text-skinz-accent rounded text-sm hover:bg-skinz-accent/30 transition-colors"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => fillForm0820(comm)}
                            className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30 transition-colors"
                          >
                            {comm.form0820.filled ? 'View 0820' : 'Fill 0820'}
                          </button>
                          <button className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded text-sm hover:bg-gray-500/30 transition-colors">
                            Follow Up
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Tab */}
      {activeTab === 'tracking' && (
        <div className="space-y-6">
          <div className="bg-skinz-bg-secondary/50 rounded-xl p-6 border border-skinz-border">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-white">Communication Tracking & Delivery</h4>
              <button className="px-4 py-2 bg-skinz-accent text-white rounded-lg hover:bg-skinz-accent/80 transition-colors flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh Status
              </button>
            </div>

            {/* Tracking Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-skinz-text-secondary text-sm">Delivery Rate</p>
                    <p className="text-white font-bold text-xl">
                      {Math.round((communications.filter(c => c.tracking?.deliveredAt).length / communications.length) * 100)}%
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-skinz-text-secondary text-sm">Read Rate</p>
                    <p className="text-white font-bold text-xl">
                      {Math.round((communications.filter(c => c.tracking?.readAt).length / communications.length) * 100)}%
                    </p>
                  </div>
                  <Eye className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-skinz-text-secondary text-sm">Response Rate</p>
                    <p className="text-white font-bold text-xl">
                      {Math.round((communications.filter(c => c.tracking?.respondedAt).length / communications.length) * 100)}%
                    </p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-purple-400" />
                </div>
              </div>

              <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-skinz-text-secondary text-sm">Avg Response Time</p>
                    <p className="text-white font-bold text-xl">2.3</p>
                    <p className="text-skinz-text-secondary text-xs">days</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-400" />
                </div>
              </div>
            </div>

            {/* Detailed Tracking */}
            <div className="space-y-4">
              <h5 className="text-white font-medium">Detailed Tracking Information</h5>
              {communications.map((comm) => (
                <div key={comm.id} className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-white font-medium">{comm.subject}</p>
                      <p className="text-skinz-text-secondary text-sm">{comm.date.toLocaleDateString()} • {comm.method}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(comm.status)}`}>
                      {comm.status}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-skinz-text-secondary text-xs">Communication Progress</span>
                      <span className="text-white text-xs">
                        {comm.tracking?.respondedAt ? '100%' :
                         comm.tracking?.readAt ? '75%' :
                         comm.tracking?.deliveredAt ? '50%' : '25%'}
                      </span>
                    </div>
                    <div className="w-full bg-skinz-bg-primary rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          comm.tracking?.respondedAt ? 'bg-green-500' :
                          comm.tracking?.readAt ? 'bg-blue-500' :
                          comm.tracking?.deliveredAt ? 'bg-yellow-500' : 'bg-gray-500'
                        }`}
                        style={{ 
                          width: comm.tracking?.respondedAt ? '100%' :
                                 comm.tracking?.readAt ? '75%' :
                                 comm.tracking?.deliveredAt ? '50%' : '25%'
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Tracking Steps */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className={`text-center p-3 rounded-lg ${
                      true ? 'bg-green-500/20 border border-green-500/30' : 'bg-skinz-bg-primary/50'
                    }`}>
                      <Send className={`w-5 h-5 mx-auto mb-2 ${true ? 'text-green-400' : 'text-gray-400'}`} />
                      <p className={`text-xs ${true ? 'text-green-400' : 'text-gray-400'}`}>Sent</p>
                      <p className="text-xs text-skinz-text-secondary">{comm.date.toLocaleDateString()}</p>
                    </div>

                    <div className={`text-center p-3 rounded-lg ${
                      comm.tracking?.deliveredAt ? 'bg-yellow-500/20 border border-yellow-500/30' : 'bg-skinz-bg-primary/50'
                    }`}>
                      <CheckCircle className={`w-5 h-5 mx-auto mb-2 ${
                        comm.tracking?.deliveredAt ? 'text-yellow-400' : 'text-gray-400'
                      }`} />
                      <p className={`text-xs ${comm.tracking?.deliveredAt ? 'text-yellow-400' : 'text-gray-400'}`}>
                        Delivered
                      </p>
                      <p className="text-xs text-skinz-text-secondary">
                        {comm.tracking?.deliveredAt?.toLocaleDateString() || '--'}
                      </p>
                    </div>

                    <div className={`text-center p-3 rounded-lg ${
                      comm.tracking?.readAt ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-skinz-bg-primary/50'
                    }`}>
                      <Eye className={`w-5 h-5 mx-auto mb-2 ${
                        comm.tracking?.readAt ? 'text-blue-400' : 'text-gray-400'
                      }`} />
                      <p className={`text-xs ${comm.tracking?.readAt ? 'text-blue-400' : 'text-gray-400'}`}>
                        Read
                      </p>
                      <p className="text-xs text-skinz-text-secondary">
                        {comm.tracking?.readAt?.toLocaleDateString() || '--'}
                      </p>
                    </div>

                    <div className={`text-center p-3 rounded-lg ${
                      comm.tracking?.respondedAt ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-skinz-bg-primary/50'
                    }`}>
                      <MessageSquare className={`w-5 h-5 mx-auto mb-2 ${
                        comm.tracking?.respondedAt ? 'text-purple-400' : 'text-gray-400'
                      }`} />
                      <p className={`text-xs ${comm.tracking?.respondedAt ? 'text-purple-400' : 'text-gray-400'}`}>
                        Responded
                      </p>
                      <p className="text-xs text-skinz-text-secondary">
                        {comm.tracking?.respondedAt?.toLocaleDateString() || '--'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VA Forms Tab */}
      {activeTab === 'forms' && (
        <div className="space-y-6">
          <div className="bg-skinz-bg-secondary/50 rounded-xl p-6 border border-skinz-border">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-white">VA Forms Repository</h4>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Search forms..."
                  value={documentState.searchTerm}
                  onChange={(e) => setDocumentState({...documentState, searchTerm: e.target.value})}
                  className="px-3 py-2 bg-skinz-bg-tertiary rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-skinz-accent"
                />
                <select
                  value={documentState.selectedCategory}
                  onChange={(e) => setDocumentState({...documentState, selectedCategory: e.target.value})}
                  className="px-3 py-2 bg-skinz-bg-tertiary rounded-lg text-white text-sm focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  {formCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Access Forms */}
            <div className="mb-6">
              <h5 className="text-white font-medium mb-3">Quick Access Forms</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['21-526EZ', '21-4142', '21-0995', '21-22', 'SF-1199A', '21-686c', '10-10EZ', '21-2680'].map(formNum => {
                  const form = vaForms.find(f => f.formNumber.includes(formNum));
                  if (!form) return null;
                  return (
                    <button
                      key={form.id}
                      onClick={() => window.open(form.url, '_blank')}
                      className="px-3 py-2 bg-skinz-accent/20 text-skinz-accent rounded-lg hover:bg-skinz-accent/30 transition-colors text-sm text-left"
                    >
                      <p className="font-bold">{formNum}</p>
                      <p className="text-xs opacity-80 truncate">{form.title.substring(0, 30)}...</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Forms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vaForms
                .filter(form => {
                  const matchesSearch = documentState.searchTerm === '' || 
                    form.title.toLowerCase().includes(documentState.searchTerm.toLowerCase()) ||
                    form.formNumber.toLowerCase().includes(documentState.searchTerm.toLowerCase()) ||
                    form.description.toLowerCase().includes(documentState.searchTerm.toLowerCase());
                  const matchesCategory = documentState.selectedCategory === 'All' || form.category === documentState.selectedCategory;
                  return matchesSearch && matchesCategory;
                })
                .slice(0, 30)
                .map((form, idx) => (
                  <motion.div
                    key={form.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50 hover:border-skinz-accent/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-skinz-accent font-bold text-sm">{form.formNumber}</p>
                        <p className="text-white font-medium text-sm mt-1 line-clamp-2">{form.title}</p>
                      </div>
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded whitespace-nowrap">
                        {form.category}
                      </span>
                    </div>
                    
                    <p className="text-skinz-text-secondary text-xs mb-3 line-clamp-2">
                      {form.description}
                    </p>

                    {form.processingTime && (
                      <div className="flex items-center gap-2 text-xs text-skinz-text-secondary mb-3">
                        <Clock className="w-3 h-3" />
                        <span>{form.processingTime}</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(form.url, '_blank')}
                        className="flex-1 px-3 py-1 bg-skinz-accent/20 text-skinz-accent rounded hover:bg-skinz-accent/30 transition-colors text-sm flex items-center justify-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Open Form
                      </button>
                      <button
                        onClick={() => setDocumentState({...documentState, selectedForm: form})}
                        className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors text-sm"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>

                    {form.relatedForms && form.relatedForms.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-skinz-border/50">
                        <p className="text-xs text-skinz-text-secondary mb-1">Related Forms:</p>
                        <div className="flex flex-wrap gap-1">
                          {form.relatedForms.slice(0, 3).map(related => (
                            <span key={related} className="text-xs bg-skinz-bg-primary px-2 py-0.5 rounded text-skinz-text-secondary">
                              {related}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Form 0820 Tab */}
      {activeTab === 'form0820' && (
        <div className="space-y-6">
          <div className="bg-skinz-bg-secondary/50 rounded-xl p-6 border border-skinz-border">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-white">VA Form 0820 Management</h4>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowForm0820(true)}
                  className="px-4 py-2 bg-skinz-accent text-white rounded-lg hover:bg-skinz-accent/80 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Form 0820
                </button>
                <button className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Form Database
                </button>
              </div>
            </div>

            {/* Form 0820 Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-skinz-text-secondary text-sm">Forms Filed</p>
                    <p className="text-white font-bold text-2xl">
                      {communications.filter(c => c.form0820.filled).length}
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-skinz-text-secondary text-sm">Pending Forms</p>
                    <p className="text-white font-bold text-2xl">
                      {communications.filter(c => !c.form0820.filled).length}
                    </p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-yellow-400" />
                </div>
              </div>

              <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-skinz-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-skinz-text-secondary text-sm">Compliance Rate</p>
                    <p className="text-white font-bold text-2xl">
                      {Math.round((communications.filter(c => c.form0820.filled).length / communications.length) * 100)}%
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-blue-400" />
                </div>
              </div>
            </div>

            {/* Form 0820 List */}
            <div className="space-y-4">
              <h5 className="text-white font-medium">Form 0820 Records</h5>
              {communications.map((comm) => (
                <div key={comm.id} className={`bg-skinz-bg-tertiary/50 rounded-lg p-4 border ${
                  comm.form0820.filled ? 'border-green-500/30' : 'border-yellow-500/30'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          comm.form0820.filled ? 'bg-green-500/20' : 'bg-yellow-500/20'
                        }`}>
                          {comm.form0820.filled ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-yellow-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">{comm.subject}</p>
                          <p className="text-skinz-text-secondary text-sm">
                            {comm.date.toLocaleDateString()} • {comm.method}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-skinz-text-secondary text-xs">Communication Type</p>
                          <p className="text-white text-sm capitalize">{comm.type}</p>
                        </div>
                        <div>
                          <p className="text-skinz-text-secondary text-xs">Form Status</p>
                          <span className={`inline-block px-2 py-1 rounded text-xs ${
                            comm.form0820.filled 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {comm.form0820.filled ? 'Filed' : 'Pending'}
                          </span>
                        </div>
                        <div>
                          <p className="text-skinz-text-secondary text-xs">Form ID</p>
                          <p className="text-white text-sm font-mono">
                            {comm.form0820.formId || 'Not Assigned'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => fillForm0820(comm)}
                        className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30 transition-colors"
                      >
                        {comm.form0820.filled ? 'View Form' : 'Fill Form'}
                      </button>
                      {comm.form0820.filled && (
                        <button className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm hover:bg-green-500/30 transition-colors flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          PDF
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VA Form 0820 Modal */}
      <AnimatePresence>
        {showForm0820 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm0820(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-skinz-bg-secondary rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto border border-skinz-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">VA Form 0820 - Report of Contact</h3>
                </div>
                <button
                  onClick={() => setShowForm0820(false)}
                  className="text-skinz-text-secondary hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Veteran Information */}
                <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-4">Veteran Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-skinz-text-secondary text-sm mb-1">Name</label>
                      <input
                        type="text"
                        value={form0820Data.sections.veteranInfo.name}
                        readOnly
                        className="w-full px-3 py-2 bg-skinz-bg-primary rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-skinz-text-secondary text-sm mb-1">SSN</label>
                      <input
                        type="text"
                        value={form0820Data.sections.veteranInfo.ssn}
                        readOnly
                        className="w-full px-3 py-2 bg-skinz-bg-primary rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-skinz-text-secondary text-sm mb-1">VA File Number</label>
                      <input
                        type="text"
                        value={form0820Data.sections.veteranInfo.vaFileNumber}
                        readOnly
                        className="w-full px-3 py-2 bg-skinz-bg-primary rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-skinz-text-secondary text-sm mb-1">Claim Number</label>
                      <input
                        type="text"
                        value={form0820Data.sections.veteranInfo.claimNumber}
                        className="w-full px-3 py-2 bg-skinz-bg-tertiary rounded text-white focus:outline-none focus:ring-2 focus:ring-skinz-accent"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-4">Contact Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-skinz-text-secondary text-sm mb-1">Date of Contact</label>
                      <input
                        type="date"
                        value={form0820Data.sections.contactInfo.dateOfContact.toISOString().split('T')[0]}
                        onChange={(e) => setForm0820Data({
                          ...form0820Data,
                          sections: {
                            ...form0820Data.sections,
                            contactInfo: {
                              ...form0820Data.sections.contactInfo,
                              dateOfContact: new Date(e.target.value)
                            }
                          }
                        })}
                        className="w-full px-3 py-2 bg-skinz-bg-tertiary rounded text-white focus:outline-none focus:ring-2 focus:ring-skinz-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-skinz-text-secondary text-sm mb-1">Time of Contact</label>
                      <input
                        type="time"
                        value={form0820Data.sections.contactInfo.timeOfContact}
                        onChange={(e) => setForm0820Data({
                          ...form0820Data,
                          sections: {
                            ...form0820Data.sections,
                            contactInfo: {
                              ...form0820Data.sections.contactInfo,
                              timeOfContact: e.target.value
                            }
                          }
                        })}
                        className="w-full px-3 py-2 bg-skinz-bg-tertiary rounded text-white focus:outline-none focus:ring-2 focus:ring-skinz-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-skinz-text-secondary text-sm mb-1">Method of Contact</label>
                      <select
                        value={form0820Data.sections.contactInfo.methodOfContact}
                        onChange={(e) => setForm0820Data({
                          ...form0820Data,
                          sections: {
                            ...form0820Data.sections,
                            contactInfo: {
                              ...form0820Data.sections.contactInfo,
                              methodOfContact: e.target.value
                            }
                          }
                        })}
                        className="w-full px-3 py-2 bg-skinz-bg-tertiary rounded text-white focus:outline-none focus:ring-2 focus:ring-skinz-accent"
                      >
                        <option value="">Select method...</option>
                        <option value="Telephone">Telephone</option>
                        <option value="In Person">In Person</option>
                        <option value="Letter">Letter</option>
                        <option value="Email">Email</option>
                        <option value="Secure Message">Secure Message</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-skinz-text-secondary text-sm mb-1">Contacted By</label>
                      <input
                        type="text"
                        value={form0820Data.sections.contactInfo.contactedBy}
                        onChange={(e) => setForm0820Data({
                          ...form0820Data,
                          sections: {
                            ...form0820Data.sections,
                            contactInfo: {
                              ...form0820Data.sections.contactInfo,
                              contactedBy: e.target.value
                            }
                          }
                        })}
                        placeholder="Enter your name and title"
                        className="w-full px-3 py-2 bg-skinz-bg-tertiary rounded text-white focus:outline-none focus:ring-2 focus:ring-skinz-accent"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-skinz-text-secondary text-sm mb-1">Purpose of Contact</label>
                    <input
                      type="text"
                      value={form0820Data.sections.contactInfo.purpose}
                      onChange={(e) => setForm0820Data({
                        ...form0820Data,
                        sections: {
                          ...form0820Data.sections,
                          contactInfo: {
                            ...form0820Data.sections.contactInfo,
                            purpose: e.target.value
                          }
                        }
                      })}
                      placeholder="Brief description of contact purpose"
                      className="w-full px-3 py-2 bg-skinz-bg-tertiary rounded text-white focus:outline-none focus:ring-2 focus:ring-skinz-accent"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-skinz-text-secondary text-sm mb-1">Summary of Contact</label>
                    <textarea
                      value={form0820Data.sections.contactInfo.summary}
                      onChange={(e) => setForm0820Data({
                        ...form0820Data,
                        sections: {
                          ...form0820Data.sections,
                          contactInfo: {
                            ...form0820Data.sections.contactInfo,
                            summary: e.target.value
                          }
                        }
                      })}
                      rows={4}
                      placeholder="Detailed summary of the contact and discussion"
                      className="w-full px-3 py-2 bg-skinz-bg-tertiary rounded text-white focus:outline-none focus:ring-2 focus:ring-skinz-accent resize-none"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-skinz-text-secondary text-sm mb-1">Action Taken</label>
                    <textarea
                      value={form0820Data.sections.contactInfo.actionTaken}
                      onChange={(e) => setForm0820Data({
                        ...form0820Data,
                        sections: {
                          ...form0820Data.sections,
                          contactInfo: {
                            ...form0820Data.sections.contactInfo,
                            actionTaken: e.target.value
                          }
                        }
                      })}
                      rows={3}
                      placeholder="Actions taken as a result of this contact"
                      className="w-full px-3 py-2 bg-skinz-bg-tertiary rounded text-white focus:outline-none focus:ring-2 focus:ring-skinz-accent resize-none"
                    />
                  </div>

                  <div className="mt-4 flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form0820Data.sections.contactInfo.followUpRequired}
                        onChange={(e) => setForm0820Data({
                          ...form0820Data,
                          sections: {
                            ...form0820Data.sections,
                            contactInfo: {
                              ...form0820Data.sections.contactInfo,
                              followUpRequired: e.target.checked
                            }
                          }
                        })}
                        className="rounded"
                      />
                      <span className="text-white">Follow-up Required</span>
                    </label>
                    
                    {form0820Data.sections.contactInfo.followUpRequired && (
                      <input
                        type="date"
                        value={form0820Data.sections.contactInfo.followUpDate}
                        onChange={(e) => setForm0820Data({
                          ...form0820Data,
                          sections: {
                            ...form0820Data.sections,
                            contactInfo: {
                              ...form0820Data.sections.contactInfo,
                              followUpDate: e.target.value
                            }
                          }
                        })}
                        className="px-3 py-1 bg-skinz-bg-tertiary rounded text-white focus:outline-none focus:ring-2 focus:ring-skinz-accent"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3 justify-end">
                <button
                  onClick={() => setShowForm0820(false)}
                  className="px-4 py-2 bg-skinz-bg-tertiary text-white rounded-lg hover:bg-skinz-bg-primary transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Generate PDF
                </button>
                <button className="px-4 py-2 bg-skinz-accent text-white rounded-lg hover:bg-skinz-accent/80 transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save to Veteran Notes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Communication Detail Modal */}
      <AnimatePresence>
        {selectedCommunication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCommunication(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-skinz-bg-secondary rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-skinz-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">{selectedCommunication.subject}</h3>
                <button
                  onClick={() => setSelectedCommunication(null)}
                  className="text-skinz-text-secondary hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-skinz-text-secondary text-sm">Type</p>
                    <p className="text-white capitalize">{selectedCommunication.type}</p>
                  </div>
                  <div>
                    <p className="text-skinz-text-secondary text-sm">Method</p>
                    <p className="text-white">{selectedCommunication.method}</p>
                  </div>
                  <div>
                    <p className="text-skinz-text-secondary text-sm">Date</p>
                    <p className="text-white">{selectedCommunication.date.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-skinz-text-secondary text-sm">Status</p>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedCommunication.status)}`}>
                      {selectedCommunication.status}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-skinz-text-secondary text-sm mb-2">Content</p>
                  <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
                    <p className="text-white text-sm leading-relaxed">{selectedCommunication.content}</p>
                  </div>
                </div>

                {selectedCommunication.tracking && (
                  <div>
                    <p className="text-skinz-text-secondary text-sm mb-2">Tracking Information</p>
                    <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4 space-y-2">
                      {selectedCommunication.tracking.deliveredAt && (
                        <div className="flex justify-between">
                          <span className="text-skinz-text-secondary">Delivered:</span>
                          <span className="text-white">{selectedCommunication.tracking.deliveredAt.toLocaleString()}</span>
                        </div>
                      )}
                      {selectedCommunication.tracking.readAt && (
                        <div className="flex justify-between">
                          <span className="text-skinz-text-secondary">Read:</span>
                          <span className="text-white">{selectedCommunication.tracking.readAt.toLocaleString()}</span>
                        </div>
                      )}
                      {selectedCommunication.tracking.respondedAt && (
                        <div className="flex justify-between">
                          <span className="text-skinz-text-secondary">Responded:</span>
                          <span className="text-white">{selectedCommunication.tracking.respondedAt.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => fillForm0820(selectedCommunication)}
                    className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    {selectedCommunication.form0820.filled ? 'View Form 0820' : 'Fill Form 0820'}
                  </button>
                  <button className="px-4 py-2 bg-skinz-accent text-white rounded-lg hover:bg-skinz-accent/80 transition-colors">
                    Follow Up
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
