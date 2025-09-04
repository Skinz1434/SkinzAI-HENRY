'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { HelpCircle } from 'lucide-react';
import { CODCase, NavigationItem, ChatMessage, CODDASettings } from '@/types/codda';
import CODDAHeader from '@/components/codda/CODDAHeader';
import CODDANavigatorFunctional from '@/components/codda/CODDANavigatorFunctional';
import CODDADocumentEditor from '@/components/codda/CODDADocumentEditor';
import CODDAInsightPanelEnhanced from '@/components/codda/CODDAInsightPanelEnhanced';
import CODDAFooter from '@/components/codda/CODDAFooter';
import CODDAInstructionsModal from '@/components/codda/CODDAInstructionsModal';
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
  const [showInstructions, setShowInstructions] = useState(false);

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

  // Show instructions on first visit
  useEffect(() => {
    const hasSeenInstructions = localStorage.getItem('codda-instructions-seen');
    if (!hasSeenInstructions) {
      setShowInstructions(true);
      localStorage.setItem('codda-instructions-seen', 'true');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <CODDAHeader 
        currentCase={currentCase}
        leftPanelOpen={leftPanelOpen}
        rightPanelOpen={rightPanelOpen}
        onToggleLeftPanel={() => setLeftPanelOpen(!leftPanelOpen)}
        onToggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)}
      />

      <div className="flex h-[calc(100vh-80px)]">
        {leftPanelOpen && (
          <CODDANavigatorFunctional 
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

        <CODDADocumentEditor 
          currentCase={currentCase}
          settings={settings}
          onCaseUpdate={setCurrentCase}
          onExportPDF={handleExportPDF}
          onExportWord={handleExportWord}
          onSendForReview={handleSendForReview}
        />

        {rightPanelOpen && (
          <CODDAInsightPanelEnhanced
            currentCase={currentCase}
            activeTab={activeRightTab}
            onTabChange={setActiveRightTab}
          />
        )}
      </div>

      <CODDAFooter currentCase={currentCase} />
      
      {/* Instructions Modal */}
      <CODDAInstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />
      
      {/* Help Button */}
      <button
        onClick={() => setShowInstructions(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-50"
        title="Show Instructions"
      >
        <HelpCircle className="w-6 h-6" />
      </button>
    </div>
  );
}