'use client';

import React, { useState } from 'react';
import { 
  ChevronRight,
  ChevronDown,
  MoreVertical,
  FileText,
  Users,
  GitBranch,
  CheckSquare,
  Upload,
  Plus,
  Edit3,
  Trash2,
  Copy,
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  Calendar,
  MessageSquare,
  Share2,
  Eye,
  Lock,
  Unlock,
  Star,
  StarOff,
  Filter,
  Search,
  Settings
} from 'lucide-react';
import { CODCase, NavigationItem } from '@/types/codda';
import Tooltip from './ui/Tooltip';
import Modal, { ConfirmModal } from './ui/Modal';

interface CODDANavigatorEnhancedProps {
  currentCase: CODCase;
  onCaseSelect?: (caseId: string) => void;
  onSectionSelect?: (sectionId: string) => void;
}

interface CollaboratorInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

export default function CODDANavigatorEnhanced({ 
  currentCase, 
  onCaseSelect,
  onSectionSelect 
}: CODDANavigatorEnhancedProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['case', 'service-periods']));
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCollaborationModal, setShowCollaborationModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [favoriteItems, setFavoriteItems] = useState<Set<string>>(new Set());

  // Mock collaborators data
  const collaborators: CollaboratorInfo[] = [
    {
      id: 'user-1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@va.gov',
      role: 'RVSR',
      status: 'online',
      avatar: 'SJ'
    },
    {
      id: 'user-2', 
      name: 'Mike Chen',
      email: 'mike.chen@va.gov',
      role: 'VSR',
      status: 'away',
      lastSeen: '5 minutes ago'
    },
    {
      id: 'user-3',
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@va.gov', 
      role: 'Medical Reviewer',
      status: 'offline',
      lastSeen: '2 hours ago'
    }
  ];

  const navigationItems: NavigationItem[] = [
    {
      id: 'case',
      label: `Case ${currentCase.id}`,
      type: 'case',
      status: 'in-progress',
      metadata: {
        assignedTo: 'VSR-12345',
        priority: 'high',
        dueDate: currentCase.dueDate,
        collaborators: collaborators.slice(0, 2)
      },
      children: [
        {
          id: 'case-details',
          label: 'Case Details',
          type: 'case',
          status: 'completed',
          metadata: { section: 'details' }
        },
        {
          id: 'service-periods',
          label: 'Service Periods',
          type: 'service-period',
          status: currentCase.service.length > 0 ? 'completed' : 'pending',
          metadata: { count: currentCase.service.length },
          children: currentCase.service.map(sp => ({
            id: sp.id,
            label: `${sp.branch} (${new Date(sp.start).getFullYear()}-${new Date(sp.end).getFullYear()})`,
            type: 'service-period',
            status: 'in-progress',
            metadata: {
              discharge: sp.charOfDischarge,
              duration: calculateServiceDuration(sp.start, sp.end)
            }
          }))
        },
        {
          id: 'evidence-collection',
          label: 'Evidence Collection',
          type: 'task',
          status: currentCase.evidence.length > 0 ? 'in-progress' : 'pending',
          metadata: { 
            count: currentCase.evidence.length,
            gaps: currentCase.evidence.filter(e => e.isGap).length
          },
          children: [
            {
              id: 'evidence-items',
              label: 'Evidence Items',
              type: 'task',
              status: 'in-progress',
              metadata: { count: currentCase.evidence.length }
            },
            {
              id: 'evidence-gaps',
              label: 'Evidence Gaps',
              type: 'task', 
              status: 'error',
              metadata: { count: currentCase.evidence.filter(e => e.isGap).length }
            }
          ]
        },
        {
          id: 'rules-analysis',
          label: 'Rules & Analysis',
          type: 'rule-tree',
          status: currentCase.rulePath ? 'completed' : 'pending',
          metadata: { 
            rulePath: currentCase.rulePath?.label,
            requiresInsanity: currentCase.rulePath?.requiresInsanityCheck
          }
        },
        {
          id: 'document-drafting',
          label: 'Document Drafting',
          type: 'task',
          status: currentCase.qa.completeness > 50 ? 'in-progress' : 'pending',
          metadata: { 
            completeness: currentCase.qa.completeness,
            sections: 6,
            completedSections: Math.floor(currentCase.qa.completeness / 16.67)
          }
        },
        {
          id: 'quality-review',
          label: 'Quality Review',
          type: 'task',
          status: currentCase.qa.lintFlags.length === 0 ? 'completed' : 'error',
          metadata: { 
            issues: currentCase.qa.lintFlags.length,
            biasScore: currentCase.qa.biasScore
          }
        },
        {
          id: 'ipr-processing',
          label: 'IPR Processing',
          type: 'task',
          status: currentCase.ipr.required ? 'pending' : 'completed',
          metadata: { 
            required: currentCase.ipr.required,
            status: currentCase.ipr.status
          }
        },
        {
          id: 'export-upload',
          label: 'Export & Upload',
          type: 'export',
          status: 'pending',
          metadata: { 
            formats: ['PDF', 'Word'],
            destination: 'eFolder'
          }
        }
      ]
    }
  ];

  function calculateServiceDuration(start: string, end: string): string {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    return `${diffYears}y ${diffMonths}m`;
  }

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const toggleFavorite = (itemId: string) => {
    setFavoriteItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-cyan-500';
      case 'error': return 'bg-red-500';
      case 'pending': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'case': return FileText;
      case 'service-period': return Users;
      case 'rule-tree': return GitBranch;
      case 'task': return CheckSquare;
      case 'export': return Upload;
      default: return FileText;
    }
  };

  const handleItemAction = (action: string, itemId: string) => {
    switch (action) {
      case 'edit':
        console.log('Edit item:', itemId);
        break;
      case 'duplicate':
        console.log('Duplicate item:', itemId);
        break;
      case 'delete':
        setItemToDelete(itemId);
        setShowDeleteConfirm(true);
        break;
      case 'share':
        setShowCollaborationModal(true);
        break;
      default:
        break;
    }
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      console.log('Delete item:', itemToDelete);
      setItemToDelete(null);
    }
  };

  const renderNavigationTree = (items: NavigationItem[], level = 0) => {
    return items.map(item => {
      const Icon = getTypeIcon(item.type);
      const isFavorite = favoriteItems.has(item.id);
      
      return (
        <div key={item.id} className={`${level > 0 ? 'ml-4' : ''} mb-1`}>
          <div
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-white/5 transition-colors group relative"
            onClick={() => {
              if (item.children) {
                toggleExpanded(item.id);
              } else {
                onSectionSelect?.(item.id);
              }
            }}
          >
            {/* Expansion indicator */}
            {item.children && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpanded(item.id);
                }}
                className="p-0.5 hover:bg-white/10 rounded transition-colors"
              >
                {expandedItems.has(item.id) ? 
                  <ChevronDown className="w-4 h-4 text-gray-400" /> :
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                }
              </button>
            )}
            {!item.children && <div className="w-5" />}
            
            {/* Icon */}
            <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
            
            {/* Status indicator */}
            <Tooltip content={`Status: ${item.status || 'unknown'}`}>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor(item.status)}`} />
            </Tooltip>
            
            {/* Label */}
            <span className="text-gray-200 flex-1 truncate font-medium">
              {item.label}
            </span>

            {/* Metadata badges */}
            {item.metadata && (
              <div className="flex items-center gap-1">
                {item.metadata.count !== undefined && (
                  <Tooltip content={`${item.metadata.count} items`}>
                    <span className="text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded">
                      {item.metadata.count}
                    </span>
                  </Tooltip>
                )}
                {item.metadata.gaps && item.metadata.gaps > 0 && (
                  <Tooltip content={`${item.metadata.gaps} evidence gaps`}>
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                  </Tooltip>
                )}
                {item.metadata.priority === 'high' && (
                  <Tooltip content="High priority">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                  </Tooltip>
                )}
              </div>
            )}

            {/* Favorite star */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(item.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all"
            >
              {isFavorite ? 
                <Star className="w-3 h-3 text-yellow-400 fill-current" /> :
                <StarOff className="w-3 h-3 text-gray-400" />
              }
            </button>
            
            {/* Actions menu */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Tooltip content="More actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Show context menu
                  }}
                  className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                >
                  <MoreVertical className="w-3 h-3" />
                </button>
              </Tooltip>
            </div>
          </div>
          
          {/* Expanded children */}
          {item.children && expandedItems.has(item.id) && (
            <div className="mt-1 border-l border-white/10 ml-2 pl-2">
              {renderNavigationTree(item.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="w-80 border-r border-white/10 bg-slate-900/50 backdrop-blur-sm flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-200">Case Navigator</h2>
          <div className="flex items-center gap-1">
            <Tooltip content="Search cases">
              <button
                onClick={() => setSearchQuery('')}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </Tooltip>
            <Tooltip content="Filter items">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-1.5 hover:bg-white/10 rounded transition-colors ${
                  showFilters ? 'text-cyan-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Filter className="w-4 h-4" />
              </button>
            </Tooltip>
            <Tooltip content="Navigator settings">
              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
            </Tooltip>
          </div>
        </div>
        
        {/* Search bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search navigation items..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Quick filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-3">
            {['Completed', 'In Progress', 'Pending', 'Issues'].map(filter => (
              <button
                key={filter}
                onClick={() => {
                  setSelectedFilters(prev => 
                    prev.includes(filter) 
                      ? prev.filter(f => f !== filter)
                      : [...prev, filter]
                  );
                }}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  selectedFilters.includes(filter)
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Navigation tree */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {renderNavigationTree(navigationItems)}
        </div>
      </div>

      {/* Case summary */}
      <div className="p-4 border-t border-white/10">
        <div className="bg-slate-800/30 rounded-lg p-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-400">Case Summary</div>
            <Tooltip content="Share case with team">
              <button
                onClick={() => setShowCollaborationModal(true)}
                className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
              >
                <Share2 className="w-3 h-3" />
              </button>
            </Tooltip>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">File Number:</span>
              <span className="text-gray-200 font-mono">{currentCase.fileNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Station:</span>
              <span className="text-gray-200">{currentCase.station}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className={`capitalize ${
                currentCase.status === 'draft' ? 'text-amber-400' :
                currentCase.status === 'review' ? 'text-blue-400' :
                currentCase.status === 'completed' ? 'text-green-400' :
                'text-gray-400'
              }`}>
                {currentCase.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Completeness:</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 transition-all duration-300"
                    style={{ width: `${currentCase.qa.completeness}%` }}
                  />
                </div>
                <span className="text-cyan-400 font-medium">{currentCase.qa.completeness}%</span>
              </div>
            </div>
          </div>

          {/* Collaborators */}
          {collaborators.length > 0 && (
            <div className="pt-2 border-t border-white/10">
              <div className="text-xs text-gray-400 mb-2">Team Members</div>
              <div className="flex -space-x-2">
                {collaborators.slice(0, 3).map(collaborator => (
                  <Tooltip
                    key={collaborator.id}
                    content={
                      <div>
                        <div className="font-medium">{collaborator.name}</div>
                        <div className="text-xs text-gray-400">{collaborator.role}</div>
                        <div className="text-xs text-gray-400">{collaborator.status}</div>
                      </div>
                    }
                  >
                    <div className="relative">
                      <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-xs font-medium text-white border-2 border-slate-800">
                        {collaborator.avatar || collaborator.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-slate-800 ${
                        collaborator.status === 'online' ? 'bg-green-500' :
                        collaborator.status === 'away' ? 'bg-amber-500' :
                        'bg-gray-500'
                      }`} />
                    </div>
                  </Tooltip>
                ))}
                {collaborators.length > 3 && (
                  <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs text-gray-400 border-2 border-slate-800">
                    +{collaborators.length - 3}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Navigator Settings"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Default View
            </label>
            <select className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-gray-200">
              <option>Expanded</option>
              <option>Collapsed</option>
              <option>Favorites Only</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-200">Show status indicators</span>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-200">Auto-expand active items</span>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showCollaborationModal}
        onClose={() => setShowCollaborationModal(false)}
        title="Collaboration & Sharing"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-white mb-3">Current Team Members</h3>
            <div className="space-y-3">
              {collaborators.map(collaborator => (
                <div key={collaborator.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-sm font-medium text-white">
                        {collaborator.avatar || collaborator.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-800 ${
                        collaborator.status === 'online' ? 'bg-green-500' :
                        collaborator.status === 'away' ? 'bg-amber-500' :
                        'bg-gray-500'
                      }`} />
                    </div>
                    <div>
                      <div className="font-medium text-white">{collaborator.name}</div>
                      <div className="text-sm text-gray-400">{collaborator.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip content="Send message">
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </Tooltip>
                    <Tooltip content="Remove from case">
                      <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-3">Add Team Member</h3>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter email address..."
                className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-gray-200"
              />
              <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors">
                Invite
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Item"
        message="Are you sure you want to delete this navigation item? This action cannot be undone."
        type="error"
        confirmText="Delete"
      />
    </div>
  );
}
