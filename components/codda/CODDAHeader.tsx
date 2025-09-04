'use client';

import React from 'react';
import { 
  FileText, 
  Save, 
  Clock,
  Sidebar,
  PanelLeftClose,
  PanelRightClose
} from 'lucide-react';
import { CODCase } from '@/types/codda';

interface CODDAHeaderProps {
  currentCase: CODCase;
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  onToggleLeftPanel: () => void;
  onToggleRightPanel: () => void;
}

export default function CODDAHeader({
  currentCase,
  leftPanelOpen,
  rightPanelOpen,
  onToggleLeftPanel,
  onToggleRightPanel
}: CODDAHeaderProps) {
  const lastSaved = new Date();

  return (
    <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">CODDA</h1>
              <p className="text-sm text-gray-400">Character of Discharge Determination Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Case:</span>
            <span className="text-cyan-400 font-mono">{currentCase.id}</span>
            <span>•</span>
            <span>{currentCase.claimant}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleLeftPanel}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
            title="Toggle Navigator"
          >
            {leftPanelOpen ? <PanelLeftClose className="w-4 h-4" /> : <Sidebar className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggleRightPanel}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
            title="Toggle Insights Panel"
          >
            <PanelRightClose className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-white/10 mx-2" />
          
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span>Saved {lastSaved.toLocaleTimeString()}</span>
          </div>
          
          <button className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-md hover:bg-cyan-500/30 transition-colors">
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
}
