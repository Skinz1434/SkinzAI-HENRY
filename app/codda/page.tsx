'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CODCase, NavigationItem, ChatMessage, CODDASettings } from '@/types/codda';
import CODDAHeader from '@/components/codda/CODDAHeader';
import CODDANavigator from '@/components/codda/CODDANavigator';
import CODDAEditor from '@/components/codda/CODDAEditor';
import CODDAInsightPanel from '@/components/codda/CODDAInsightPanel';
import CODDAFooter from '@/components/codda/CODDAFooter';

// Mock data for development
const mockCase: CODCase = {
  id: 'COD-2024-001',
  fileNumber: '123456789',
  claimant: 'John Doe',
  station: 'St. Petersburg',
  service: [{
    id: 'sp-1',
    branch: 'ARMY',
    start: '2010-06-01',
    end: '2014-03-15',
    charOfDischarge: 'OTH',
    notes: 'Other Than Honorable discharge due to pattern of misconduct'
  }],
  evidence: [],
  finding: {
    insanityConsidered: false,
    compellingCircumstancesConsidered: false
  },
  decision: {
    issue: '',
    evidenceIds: [],
    regs: [],
    decisionText: '',
    reasonsBases: ''
  },
  ipr: {
    required: false,
    status: 'pending'
  },
  qa: {
    completeness: 15,
    lintFlags: [],
    templateFidelity: false,
    regCompleteness: false,
    toneLint: [],
    evidenceTraceability: false,
    iprEnforcement: false,
    biasScore: 0
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: 'draft'
};

export default function CODDAPage() {
  const [currentCase, setCurrentCase] = useState<CODCase>(mockCase);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [activeRightTab, setActiveRightTab] = useState<'insights' | 'evidence' | 'bias' | 'chat'>('insights');
  const [settings, setSettings] = useState<CODDASettings>({
    theme: 'dark',
    editorDensity: 'comfortable',
    persona: 'clinical',
    snippetPacks: ['core'],
    shortcuts: {},
    showSidePanels: true,
    rulerGuide: true,
    distractionFreeMode: false,
    autoSave: true,
    showLineNumbers: true,
    wordWrap: true
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <CODDAHeader 
        currentCase={currentCase}
        leftPanelOpen={leftPanelOpen}
        rightPanelOpen={rightPanelOpen}
        onToggleLeftPanel={() => setLeftPanelOpen(!leftPanelOpen)}
        onToggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)}
      />

      <div className="flex h-[calc(100vh-80px)]">
        {leftPanelOpen && (
          <CODDANavigator currentCase={currentCase} />
        )}

        <div className="flex-1">
          <CODDAEditor 
            currentCase={currentCase}
            settings={settings}
            onCaseUpdate={setCurrentCase}
          />
        </div>

        {rightPanelOpen && (
          <CODDAInsightPanel
            currentCase={currentCase}
            activeTab={activeRightTab}
            onTabChange={setActiveRightTab}
          />
        )}
      </div>

      <CODDAFooter currentCase={currentCase} />
    </div>
  );
}