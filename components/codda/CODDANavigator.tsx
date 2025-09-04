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
  Upload
} from 'lucide-react';
import { CODCase, NavigationItem } from '@/types/codda';

interface CODDANavigatorProps {
  currentCase: CODCase;
}

export default function CODDANavigator({ currentCase }: CODDANavigatorProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['case', 'service-periods']));

  const navigationItems: NavigationItem[] = [
    {
      id: 'case',
      label: `Case ${currentCase.id}`,
      type: 'case',
      status: 'in-progress',
      children: [
        {
          id: 'service-periods',
          label: 'Service Periods',
          type: 'service-period',
          status: currentCase.service.length > 0 ? 'completed' : 'pending',
          children: currentCase.service.map(sp => ({
            id: sp.id,
            label: `${sp.branch} (${new Date(sp.start).getFullYear()}-${new Date(sp.end).getFullYear()})`,
            type: 'service-period',
            status: 'in-progress'
          }))
        },
        {
          id: 'rules-tree',
          label: 'Rules Tree',
          type: 'rule-tree',
          status: currentCase.rulePath ? 'completed' : 'pending'
        },
        {
          id: 'tasks-ipr',
          label: 'Tasks & IPR',
          type: 'task',
          status: currentCase.ipr.required ? 'in-progress' : 'pending'
        },
        {
          id: 'export-upload',
          label: 'Export/Upload',
          type: 'export',
          status: 'pending'
        }
      ]
    }
  ];

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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-cyan-500';
      case 'error': return 'bg-red-500';
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

  const renderNavigationTree = (items: NavigationItem[], level = 0) => {
    return items.map(item => {
      const Icon = getTypeIcon(item.type);
      
      return (
        <div key={item.id} className={`${level > 0 ? 'ml-4' : ''}`}>
          <div
            className="flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-white/5 transition-colors group"
            onClick={() => item.children && toggleExpanded(item.id)}
          >
            {item.children && (
              expandedItems.has(item.id) ? 
              <ChevronDown className="w-4 h-4 text-gray-400" /> :
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
            {!item.children && <div className="w-4" />}
            
            <Icon className="w-4 h-4 text-gray-400" />
            
            <div className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`} />
            
            <span className="text-gray-200 flex-1 truncate">{item.label}</span>
            
            <button 
              className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-white rounded transition-all"
              onClick={(e) => {
                e.stopPropagation();
                // Handle item menu
              }}
            >
              <MoreVertical className="w-3 h-3" />
            </button>
          </div>
          
          {item.children && expandedItems.has(item.id) && (
            <div className="mt-1">
              {renderNavigationTree(item.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="w-80 border-r border-white/10 bg-slate-900/50 backdrop-blur-sm">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-200">Navigator</h2>
          <button className="p-1 text-gray-400 hover:text-white rounded">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-1">
          {renderNavigationTree(navigationItems)}
        </div>
        
        {/* Case Summary */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="bg-slate-800/30 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-2">Case Summary</div>
            <div className="space-y-1 text-xs">
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
                <span className="text-cyan-400">{currentCase.qa.completeness}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
