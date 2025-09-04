'use client';

import React, { useState, useCallback } from 'react';
import { 
  ChevronRight,
  ChevronDown,
  FileText,
  Users,
  GitBranch,
  CheckSquare,
  Upload,
  Plus,
  Search,
  Filter,
  Settings,
  Star,
  StarOff,
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  Share2,
  MoreVertical,
  Eye,
  Edit3,
  Copy,
  Trash2,
  FolderOpen,
  Folder,
  PlayCircle,
  PauseCircle,
  XCircle
} from 'lucide-react';
import { CODCase, NavigationItem } from '@/types/codda';
import { demoCODCases } from '@/lib/codda/demo-data';
import Tooltip from './ui/Tooltip';
import Modal, { ConfirmModal } from './ui/Modal';

interface CODDANavigatorFunctionalProps {
  currentCase: CODCase;
  onCaseSelect: (caseId: string) => void;
  onSectionSelect?: (sectionId: string) => void;
}

export default function CODDANavigatorFunctional({ 
  currentCase, 
  onCaseSelect,
  onSectionSelect 
}: CODDANavigatorFunctionalProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['cases', 'current-case', 'sections']));
  const [searchQuery, setSearchQuery] = useState('');
  const [showCaseSelector, setShowCaseSelector] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(currentCase.id);
  const [favoriteItems, setFavoriteItems] = useState<Set<string>>(new Set());

  const toggleExpanded = useCallback((itemId: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((itemId: string) => {
    setFavoriteItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  const handleCaseChange = useCallback((caseId: string) => {
    setSelectedCaseId(caseId);
    onCaseSelect(caseId);
    setShowCaseSelector(false);
  }, [onCaseSelect]);

  const handleSectionClick = useCallback((sectionId: string) => {
    onSectionSelect?.(sectionId);
    // Scroll to section in editor or highlight it
    const element = document.querySelector(`[data-section="${sectionId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [onSectionSelect]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress': return <PlayCircle className="w-4 h-4 text-blue-500" />;
      case 'pending': return <PauseCircle className="w-4 h-4 text-gray-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 70) return 'text-blue-600 bg-blue-100';
    if (percentage >= 50) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  // Create navigation structure
  const navigationItems = [
    {
      id: 'cases',
      label: 'All Cases',
      type: 'folder',
      icon: FolderOpen,
      children: demoCODCases.map(caseItem => ({
        id: caseItem.id,
        label: `${caseItem.id} - ${caseItem.claimant}`,
        type: 'case',
        icon: FileText,
        status: caseItem.status,
        metadata: {
          completeness: caseItem.qa.completeness,
          priority: caseItem.dueDate ? 'high' : 'normal',
          assignedTo: caseItem.assignedTo
        },
        onClick: () => handleCaseChange(caseItem.id)
      }))
    },
    {
      id: 'current-case',
      label: `Current: ${currentCase.id}`,
      type: 'case',
      icon: FileText,
      status: currentCase.status,
      children: [
        {
          id: 'case-info',
          label: 'Case Information',
          type: 'info',
          icon: FileText,
          status: 'completed',
          onClick: () => handleSectionClick('case-info')
        },
        {
          id: 'sections',
          label: 'Document Sections',
          type: 'folder',
          icon: Folder,
          children: [
            {
              id: 'issue',
              label: 'Issue',
              type: 'section',
              icon: Edit3,
              status: 'completed',
              onClick: () => handleSectionClick('issue')
            },
            {
              id: 'evidence',
              label: 'Evidence',
              type: 'section',
              icon: Search,
              status: currentCase.evidence.length > 0 ? 'completed' : 'pending',
              metadata: { count: currentCase.evidence.length },
              onClick: () => handleSectionClick('evidence')
            },
            {
              id: 'laws-regs',
              label: 'Laws & Regulations',
              type: 'section',
              icon: GitBranch,
              status: currentCase.rulePath ? 'completed' : 'pending',
              onClick: () => handleSectionClick('laws-regs')
            },
            {
              id: 'analysis',
              label: 'Analysis & Findings',
              type: 'section',
              icon: CheckSquare,
              status: 'in-progress',
              onClick: () => handleSectionClick('analysis')
            },
            {
              id: 'decision',
              label: 'Decision',
              type: 'section',
              icon: CheckCircle,
              status: currentCase.decision.decisionText ? 'completed' : 'pending',
              onClick: () => handleSectionClick('decision')
            },
            {
              id: 'reasons-bases',
              label: 'Reasons & Bases',
              type: 'section',
              icon: FileText,
              status: 'in-progress',
              onClick: () => handleSectionClick('reasons-bases')
            },
            {
              id: 'favorable',
              label: 'Favorable Findings',
              type: 'section',
              icon: Star,
              status: currentCase.decision.favorableFindings?.length ? 'completed' : 'pending',
              onClick: () => handleSectionClick('favorable')
            }
          ]
        },
        {
          id: 'quality',
          label: 'Quality Review',
          type: 'quality',
          icon: CheckSquare,
          status: currentCase.qa.lintFlags.length === 0 ? 'completed' : 'error',
          metadata: {
            completeness: currentCase.qa.completeness,
            issues: currentCase.qa.lintFlags.length
          },
          onClick: () => handleSectionClick('quality')
        },
        {
          id: 'collaboration',
          label: 'Collaboration',
          type: 'collaboration',
          icon: Users,
          status: 'active',
          onClick: () => handleSectionClick('collaboration')
        }
      ]
    }
  ];

  const renderNavigationItem = (item: any, level = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const isFavorite = favoriteItems.has(item.id);
    const Icon = item.icon;

    return (
      <div key={item.id} className={`${level > 0 ? 'ml-4' : ''} mb-1`}>
        <div
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer transition-all duration-200 group relative
            ${item.id === currentCase.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}
          `}
          onClick={() => {
            if (item.children) {
              toggleExpanded(item.id);
            }
            if (item.onClick) {
              item.onClick();
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
              className="p-0.5 hover:bg-gray-200 rounded transition-colors"
            >
              {isExpanded ? 
                <ChevronDown className="w-4 h-4 text-gray-500" /> :
                <ChevronRight className="w-4 h-4 text-gray-500" />
              }
            </button>
          )}
          {!item.children && <div className="w-5" />}
          
          {/* Icon */}
          <Icon className="w-4 h-4 text-gray-600 flex-shrink-0" />
          
          {/* Status indicator */}
          {item.status && (
            <Tooltip content={`Status: ${item.status}`}>
              {getStatusIcon(item.status)}
            </Tooltip>
          )}
          
          {/* Label */}
          <span className="text-gray-800 flex-1 truncate font-medium">
            {item.label}
          </span>

          {/* Metadata */}
          <div className="flex items-center gap-1">
            {item.metadata?.completeness !== undefined && (
              <Tooltip content={`${item.metadata.completeness}% complete`}>
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${getCompletionColor(item.metadata.completeness)}`}>
                  {item.metadata.completeness}%
                </span>
              </Tooltip>
            )}
            
            {item.metadata?.count !== undefined && (
              <Tooltip content={`${item.metadata.count} items`}>
                <span className="text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">
                  {item.metadata.count}
                </span>
              </Tooltip>
            )}
            
            {item.metadata?.issues > 0 && (
              <Tooltip content={`${item.metadata.issues} issues`}>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </Tooltip>
            )}
            
            {item.metadata?.priority === 'high' && (
              <Tooltip content="High priority">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
              </Tooltip>
            )}
          </div>

          {/* Action buttons */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            {item.type === 'case' && (
              <Tooltip content="View case">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.onClick) item.onClick();
                  }}
                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  <Eye className="w-3 h-3" />
                </button>
              </Tooltip>
            )}
            
            <Tooltip content={isFavorite ? "Remove from favorites" : "Add to favorites"}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(item.id);
                }}
                className="p-1 text-gray-400 hover:text-yellow-500 rounded transition-colors"
              >
                {isFavorite ? 
                  <Star className="w-3 h-3 fill-current text-yellow-500" /> :
                  <StarOff className="w-3 h-3" />
                }
              </button>
            </Tooltip>
            
            <Tooltip content="More actions">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Show context menu
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
              >
                <MoreVertical className="w-3 h-3" />
              </button>
            </Tooltip>
          </div>
        </div>
        
        {/* Expanded children */}
        {item.children && isExpanded && (
          <div className="mt-1 border-l border-gray-200 ml-2 pl-2">
            {item.children.map((child: any) => renderNavigationItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-80 border-r border-gray-200 bg-white flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">CODDA Navigator</h2>
          <div className="flex items-center gap-1">
            <Tooltip content="Add new case">
              <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </Tooltip>
            <Tooltip content="Navigator settings">
              <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </Tooltip>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cases and sections..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Case Selector */}
        <div className="mt-3">
          <button
            onClick={() => setShowCaseSelector(true)}
            className="w-full flex items-center justify-between p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-700">Switch Case</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
      
      {/* Navigation tree */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {navigationItems
            .filter(item => 
              searchQuery === '' || 
              item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.children?.some((child: any) => 
                child.label.toLowerCase().includes(searchQuery.toLowerCase())
              )
            )
            .map(item => renderNavigationItem(item))
          }
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="bg-white rounded-lg p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Current Case</span>
            <Tooltip content="Share case">
              <button className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </Tooltip>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Case ID:</span>
              <span className="font-mono text-gray-800">{currentCase.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Claimant:</span>
              <span className="text-gray-800">{currentCase.claimant}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status:</span>
              <span className={`capitalize font-medium ${
                currentCase.status === 'draft' ? 'text-amber-600' :
                currentCase.status === 'review' ? 'text-blue-600' :
                currentCase.status === 'completed' ? 'text-green-600' :
                'text-gray-600'
              }`}>
                {currentCase.status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Progress:</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${currentCase.qa.completeness}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-700">{currentCase.qa.completeness}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Case Selector Modal */}
      <Modal
        isOpen={showCaseSelector}
        onClose={() => setShowCaseSelector(false)}
        title="Select Case"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid gap-3 max-h-96 overflow-y-auto">
            {demoCODCases.map(caseItem => (
              <div
                key={caseItem.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  caseItem.id === selectedCaseId 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleCaseChange(caseItem.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-800">{caseItem.id}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getCompletionColor(caseItem.qa.completeness)}`}>
                        {caseItem.qa.completeness}% complete
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">{caseItem.claimant}</p>
                    <p className="text-sm text-gray-500">{caseItem.station}</p>
                    {caseItem.service[0] && (
                      <p className="text-sm text-gray-500">
                        {caseItem.service[0].branch} • {caseItem.service[0].charOfDischarge}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {getStatusIcon(caseItem.status)}
                    <p className="text-xs text-gray-500 mt-1 capitalize">{caseItem.status}</p>
                  </div>
                </div>
                
                {caseItem.qa.lintFlags.length > 0 && (
                  <div className="mt-2 flex items-center gap-1 text-amber-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">{caseItem.qa.lintFlags.length} issues need attention</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
