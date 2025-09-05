'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { HelpCircle, X, FileText, Shield } from 'lucide-react';
import { CODCase, NavigationItem, ChatMessage, CODDASettings } from '@/types/codda';
import CODDATopNavigation from '@/components/codda/CODDATopNavigation';
import CODDAHeader from '@/components/codda/CODDAHeader';
import CODDANavigatorFunctional from '@/components/codda/CODDANavigatorFunctional';
import CODDAEditorUltra from '@/components/codda/CODDAEditorUltra';
import CODDAInsightPanelEnhanced from '@/components/codda/CODDAInsightPanelEnhanced';
import EvidenceViewerAdvanced from '@/components/codda/EvidenceViewerAdvanced';
import BiasGuardAdvanced from '@/components/codda/BiasGuardAdvanced';
import CODDAFooter from '@/components/codda/CODDAFooter';
import CODDAInstructionsModal from '@/components/codda/CODDAInstructionsModal';
import Tooltip from '@/components/codda/ui/Tooltip';
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
  const [navMenuOpen, setNavMenuOpen] = useState(false);
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
  const [isInteractiveTourActive, setIsInteractiveTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [showEvidenceViewer, setShowEvidenceViewer] = useState(false);
  const [showAdvancedBiasGuard, setShowAdvancedBiasGuard] = useState(false);

  // Initialize export service
  const exportService = createExportService(defaultMSGraphConfig);

  // Interactive tour functionality
  const startInteractiveTour = useCallback(() => {
    setIsInteractiveTourActive(true);
    setTourStep(0);
    setShowInstructions(false);
    // Show tour overlay with instructions
  }, []);

  const endInteractiveTour = useCallback(() => {
    setIsInteractiveTourActive(false);
    setTourStep(0);
  }, []);

  const nextTourStep = useCallback(() => {
    setTourStep(prev => prev + 1);
  }, []);

  const prevTourStep = useCallback(() => {
    setTourStep(prev => Math.max(0, prev - 1));
  }, []);

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
    
    // Listen for evidence viewer events
    const handleOpenEvidenceViewer = () => setShowEvidenceViewer(true);
    const handleOpenBiasGuard = () => setShowAdvancedBiasGuard(true);
    
    window.addEventListener('openEvidenceViewer', handleOpenEvidenceViewer);
    window.addEventListener('openBiasGuard', handleOpenBiasGuard);
    
    return () => {
      window.removeEventListener('openEvidenceViewer', handleOpenEvidenceViewer);
      window.removeEventListener('openBiasGuard', handleOpenBiasGuard);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <CODDATopNavigation 
        currentCase={currentCase}
        onMenuToggle={() => setNavMenuOpen(!navMenuOpen)}
        isMenuOpen={navMenuOpen}
      />
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

        <CODDAEditorUltra 
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
        onStartInteractiveTour={startInteractiveTour}
      />
      
      {/* Evidence Viewer */}
      <EvidenceViewerAdvanced
        currentCase={currentCase}
        isOpen={showEvidenceViewer}
        onClose={() => setShowEvidenceViewer(false)}
      />
      
      {/* Advanced Bias Guard */}
      {showAdvancedBiasGuard && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl max-h-[90vh] bg-slate-800 rounded-xl border border-white/10 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white">Advanced Bias Analysis</h2>
              <button
                onClick={() => setShowAdvancedBiasGuard(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <BiasGuardAdvanced
                currentCase={currentCase}
                documentContent={currentCase.decision.decisionText}
                onContentUpdate={(updatedContent) => {
                  const updatedCase = {
                    ...currentCase,
                    decision: {
                      ...currentCase.decision,
                      decisionText: updatedContent
                    }
                  };
                  setCurrentCase(updatedCase);
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <Tooltip content="Advanced Evidence Viewer" placement="left">
          <button
            onClick={() => setShowEvidenceViewer(true)}
            className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <FileText className="w-5 h-5" />
          </button>
        </Tooltip>
        
        <Tooltip content="Advanced Bias Analysis" placement="left">
          <button
            onClick={() => setShowAdvancedBiasGuard(true)}
            className="w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <Shield className="w-5 h-5" />
          </button>
        </Tooltip>
        
        <Tooltip content="Show Instructions" placement="left">
          <button
            onClick={() => setShowInstructions(true)}
            className="w-12 h-12 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}