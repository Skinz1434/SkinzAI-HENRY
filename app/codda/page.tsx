'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CODCase, NavigationItem, ChatMessage, CODDASettings } from '@/types/codda';
import CODDAHeader from '@/components/codda/CODDAHeader';
import CODDANavigatorEnhanced from '@/components/codda/CODDANavigatorEnhanced';
import CODDAEditorEnhanced from '@/components/codda/CODDAEditorEnhanced';
import CODDAInsightPanel from '@/components/codda/CODDAInsightPanel';
import CODDAFooter from '@/components/codda/CODDAFooter';
import { getDemoCaseById } from '@/lib/codda/demo-data';
import { createExportService, defaultMSGraphConfig } from '@/lib/codda/export-service';

export default function CODDAPage() {
  // Load demo case or default case
  const [currentCase, setCurrentCase] = useState<CODCase>(() => {
    return getDemoCaseById('COD-DEMO-001') || {
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
  });
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

  // Initialize export service
  const exportService = createExportService(defaultMSGraphConfig);

  // Export handlers
  const handleExportPDF = useCallback(async () => {
    try {
      const pdfBlob = await exportService.exportToPDF(
        currentCase,
        currentCase.decision.decisionText,
        {
          format: 'pdf',
          includeSignatureBlock: true,
          autoRoute: false,
          officialFormat: true
        }
      );
      
      // Download the PDF
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentCase.id}-Decision.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF export failed:', error);
    }
  }, [currentCase, exportService]);

  const handleExportWord = useCallback(async () => {
    try {
      const wordBlob = await exportService.exportToWord(
        currentCase,
        currentCase.decision.decisionText,
        {
          format: 'word',
          includeSignatureBlock: true,
          autoRoute: false,
          officialFormat: true
        }
      );
      
      // Download the Word document
      const url = URL.createObjectURL(wordBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentCase.id}-Decision.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Word export failed:', error);
    }
  }, [currentCase, exportService]);

  const handleSendForReview = useCallback(async (reviewers: string[]) => {
    try {
      await exportService.sendForReview({
        caseId: currentCase.id,
        reviewers,
        message: 'Please review this character of discharge determination and provide your feedback.',
        priority: 'normal'
      });
      
      // Show success notification
      console.log('Document sent for review successfully');
    } catch (error) {
      console.error('Failed to send for review:', error);
    }
  }, [currentCase, exportService]);

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
          <CODDANavigatorEnhanced 
            currentCase={currentCase}
            onCaseSelect={(caseId) => {
              const newCase = getDemoCaseById(caseId);
              if (newCase) setCurrentCase(newCase);
            }}
            onSectionSelect={(sectionId) => {
              console.log('Section selected:', sectionId);
            }}
          />
        )}

        <div className="flex-1">
          <CODDAEditorEnhanced 
            currentCase={currentCase}
            settings={settings}
            onCaseUpdate={setCurrentCase}
            onExportPDF={handleExportPDF}
            onExportWord={handleExportWord}
            onSendForReview={handleSendForReview}
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