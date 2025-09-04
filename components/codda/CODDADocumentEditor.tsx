'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  FileText,
  Save,
  Download,
  Upload,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Undo,
  Redo,
  Type,
  Palette,
  Link,
  Image,
  Table,
  Quote,
  Code,
  Scissors,
  Copy,
  Settings,
  Eye,
  EyeOff,
  Search,
  Replace,
  Printer,
  Mail,
  Users,
  MessageCircle,
  CheckSquare,
  Clock,
  AlertTriangle,
  Info
} from 'lucide-react';
import { CODCase, CODDASettings } from '@/types/codda';
import Tooltip from './ui/Tooltip';
import Modal from './ui/Modal';

interface CODDADocumentEditorProps {
  currentCase: CODCase;
  settings: CODDASettings;
  onCaseUpdate: (updatedCase: CODCase) => void;
  onExportPDF?: () => void;
  onExportWord?: () => void;
  onSendForReview?: (reviewers: string[]) => void;
}

export default function CODDADocumentEditor({ 
  currentCase, 
  settings, 
  onCaseUpdate,
  onExportPDF,
  onExportWord,
  onSendForReview
}: CODDADocumentEditorProps) {
  const [content, setContent] = useState('');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRuler, setShowRuler] = useState(true);
  const [showPageBreaks, setShowPageBreaks] = useState(true);
  const [activeFont, setActiveFont] = useState('Times New Roman');
  const [fontSize, setFontSize] = useState(12);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());
  
  const editorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Initialize with comprehensive template
  useEffect(() => {
    const servicePeriod = currentCase.service[0];
    const templateContent = `
<div class="document-page">
  <div class="document-header">
    <h1 style="text-align: center; font-size: 16px; font-weight: bold; margin: 20px 0;">
      DEPARTMENT OF VETERANS AFFAIRS<br/>
      CHARACTER OF DISCHARGE DETERMINATION
    </h1>
    
    <div style="margin: 20px 0; font-size: 12px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td><strong>Case ID:</strong></td>
          <td>${currentCase.id}</td>
          <td><strong>File Number:</strong></td>
          <td>${currentCase.fileNumber}</td>
        </tr>
        <tr>
          <td><strong>Claimant:</strong></td>
          <td>${currentCase.claimant}</td>
          <td><strong>Station:</strong></td>
          <td>${currentCase.station}</td>
        </tr>
        <tr>
          <td><strong>Date:</strong></td>
          <td>${new Date().toLocaleDateString()}</td>
          <td><strong>Status:</strong></td>
          <td style="text-transform: capitalize;">${currentCase.status}</td>
        </tr>
      </table>
    </div>
  </div>

  <hr style="margin: 30px 0; border: 1px solid #000;"/>

  <div class="document-content">
    <h2 style="font-size: 14px; font-weight: bold; margin: 20px 0 10px 0;">ISSUE</h2>
    <p style="margin: 10px 0; line-height: 1.6;">
      Character of discharge for the service period from ${servicePeriod ? new Date(servicePeriod.start).toLocaleDateString() : '[Start Date]'} to ${servicePeriod ? new Date(servicePeriod.end).toLocaleDateString() : '[End Date]'}.
    </p>

    <h2 style="font-size: 14px; font-weight: bold; margin: 20px 0 10px 0;">EVIDENCE</h2>
    <p style="margin: 10px 0; line-height: 1.6;">
      The evidence considered includes:
    </p>
    <ul style="margin: 10px 0 10px 30px; line-height: 1.6;">
      <li>DD Form 214 (Certificate of Release or Discharge from Active Duty)</li>
      <li>Service personnel records</li>
      <li>Service treatment records</li>
      <li>Court-martial records (if applicable)</li>
      <li>Command statements and witness testimony</li>
      <li>Medical and psychiatric evaluations</li>
      <li>VA treatment records (post-service)</li>
    </ul>

    <h2 style="font-size: 14px; font-weight: bold; margin: 20px 0 10px 0;">PERTINENT LAWS AND REGULATIONS</h2>
    <p style="margin: 10px 0; line-height: 1.6;">
      The following laws and regulations are applicable to this determination:
    </p>
    <ul style="margin: 10px 0 10px 30px; line-height: 1.6;">
      <li><strong>38 CFR 3.12</strong> - Character of discharge</li>
      <li><strong>38 CFR 3.354</strong> - Insanity</li>
      <li><strong>38 CFR 3.360</strong> - Eligibility for health care</li>
      <li><strong>M21-1 Part III.iv.1.B.1.a</strong> - Character of discharge procedures</li>
    </ul>

    <h2 style="font-size: 14px; font-weight: bold; margin: 20px 0 10px 0;">ANALYSIS AND FINDINGS</h2>
    
    <h3 style="font-size: 13px; font-weight: bold; margin: 15px 0 8px 0;">Service History</h3>
    <p style="margin: 10px 0; line-height: 1.6;">
      ${servicePeriod ? `The veteran served in the ${servicePeriod.branch} from ${new Date(servicePeriod.start).toLocaleDateString()} to ${new Date(servicePeriod.end).toLocaleDateString()}, receiving a discharge characterized as ${servicePeriod.charOfDischarge}.` : 'Service history details to be completed.'}
    </p>

    <h3 style="font-size: 13px; font-weight: bold; margin: 15px 0 8px 0;">Insanity Consideration</h3>
    <p style="margin: 10px 0; line-height: 1.6;">
      Insanity during service has been considered in accordance with 38 CFR 3.354. [Analysis of mental health evidence and determination of insanity exception applicability to be completed.]
    </p>

    <h3 style="font-size: 13px; font-weight: bold; margin: 15px 0 8px 0;">Compelling Circumstances</h3>
    <p style="margin: 10px 0; line-height: 1.6;">
      Compelling circumstances have been evaluated, including but not limited to combat service, traumatic experiences, and personal circumstances that may have contributed to the veteran's conduct. [Detailed analysis to be completed.]
    </p>

    <h2 style="font-size: 14px; font-weight: bold; margin: 20px 0 10px 0;">DECISION</h2>
    <p style="margin: 10px 0; line-height: 1.6;">
      <strong>[Decision statement to be completed based on analysis]</strong>
    </p>

    <h2 style="font-size: 14px; font-weight: bold; margin: 20px 0 10px 0;">REASONS AND BASES</h2>
    <p style="margin: 10px 0; line-height: 1.6;">
      [Detailed reasoning and legal basis for the decision to be provided, including specific citations to evidence and applicable law.]
    </p>

    <h2 style="font-size: 14px; font-weight: bold; margin: 20px 0 10px 0;">FAVORABLE FINDINGS</h2>
    <p style="margin: 10px 0; line-height: 1.6;">
      The following favorable findings are made and are binding on future determinations:
    </p>
    <ul style="margin: 10px 0 10px 30px; line-height: 1.6;">
      <li>[Any favorable findings to be listed]</li>
    </ul>
  </div>

  <div class="document-footer" style="margin-top: 40px; border-top: 1px solid #000; padding-top: 20px;">
    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
      <div style="width: 45%;">
        <p style="margin: 0; font-size: 12px; line-height: 1.4;">
          <strong>Prepared by:</strong><br/>
          [Name]<br/>
          [Title]<br/>
          [Date]
        </p>
      </div>
      <div style="width: 45%;">
        <p style="margin: 0; font-size: 12px; line-height: 1.4;">
          <strong>Reviewed by:</strong><br/>
          [Name]<br/>
          [Title]<br/>
          [Date]
        </p>
      </div>
    </div>
  </div>
</div>
    `;
    
    setContent(templateContent);
    updateWordCount(templateContent);
  }, [currentCase]);

  const updateWordCount = useCallback((text: string) => {
    const plainText = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    const words = plainText.split(' ').filter(word => word.length > 0);
    setWordCount(words.length);
    
    // Estimate page count (assuming ~250 words per page)
    setPageCount(Math.max(1, Math.ceil(words.length / 250)));
  }, []);

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    updateWordCount(newContent);
    setHasUnsavedChanges(true);
    
    // Auto-save if enabled
    if (settings.autoSave) {
      const timeoutId = setTimeout(() => {
        handleSave();
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [settings.autoSave]);

  const handleSave = useCallback(() => {
    const updatedCase = {
      ...currentCase,
      decision: {
        ...currentCase.decision,
        decisionText: content,
        lastModified: new Date().toISOString()
      },
      updatedAt: new Date().toISOString()
    };
    
    onCaseUpdate(updatedCase);
    setLastSaved(new Date());
    setHasUnsavedChanges(false);
  }, [content, currentCase, onCaseUpdate]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(200, prev + 10));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(50, prev - 10));
  };

  const handleZoomReset = () => {
    setZoomLevel(100);
  };

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (contentRef.current) {
      handleContentChange(contentRef.current.innerHTML);
    }
  };

  const insertPageBreak = () => {
    const pageBreak = '<div style="page-break-before: always; height: 0; border-top: 2px dashed #ccc; margin: 20px 0; position: relative;"><span style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: white; padding: 0 10px; color: #666; font-size: 10px;">Page Break</span></div>';
    document.execCommand('insertHTML', false, pageBreak);
    if (contentRef.current) {
      handleContentChange(contentRef.current.innerHTML);
    }
  };

  const findAndReplace = () => {
    if (!findText) return;
    
    const content = contentRef.current?.innerHTML || '';
    const regex = new RegExp(findText, 'gi');
    const newContent = content.replace(regex, replaceText || findText);
    
    if (contentRef.current) {
      contentRef.current.innerHTML = newContent;
      handleContentChange(newContent);
    }
  };

  return (
    <div className={`flex-1 flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'bg-gray-50'}`}>
      {/* Enhanced Toolbar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        {/* Main Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            {/* File Operations */}
            <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
              <Tooltip content="Save Document (Ctrl+S)">
                <button
                  onClick={handleSave}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <Save className="w-4 h-4 text-gray-600" />
                </button>
              </Tooltip>
              
              <Tooltip content="Export to PDF">
                <button
                  onClick={onExportPDF}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
              </Tooltip>
              
              <Tooltip content="Print Document">
                <button
                  onClick={() => window.print()}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <Printer className="w-4 h-4 text-gray-600" />
                </button>
              </Tooltip>
            </div>

            {/* Undo/Redo */}
            <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
              <Tooltip content="Undo (Ctrl+Z)">
                <button
                  onClick={() => document.execCommand('undo')}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <Undo className="w-4 h-4 text-gray-600" />
                </button>
              </Tooltip>
              
              <Tooltip content="Redo (Ctrl+Y)">
                <button
                  onClick={() => document.execCommand('redo')}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <Redo className="w-4 h-4 text-gray-600" />
                </button>
              </Tooltip>
            </div>

            {/* Font Controls */}
            <div className="flex items-center gap-2 border-r border-gray-200 pr-2">
              <select
                value={activeFont}
                onChange={(e) => {
                  setActiveFont(e.target.value);
                  formatText('fontName', e.target.value);
                }}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Times New Roman">Times New Roman</option>
                <option value="Arial">Arial</option>
                <option value="Calibri">Calibri</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
              </select>
              
              <select
                value={fontSize}
                onChange={(e) => {
                  setFontSize(Number(e.target.value));
                  formatText('fontSize', e.target.value);
                }}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-16"
              >
                <option value="8">8</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="14">14</option>
                <option value="16">16</option>
                <option value="18">18</option>
                <option value="20">20</option>
                <option value="24">24</option>
                <option value="28">28</option>
                <option value="32">32</option>
              </select>
            </div>

            {/* Text Formatting */}
            <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
              <Tooltip content="Bold (Ctrl+B)">
                <button
                  onClick={() => formatText('bold')}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <Bold className="w-4 h-4 text-gray-600" />
                </button>
              </Tooltip>
              
              <Tooltip content="Italic (Ctrl+I)">
                <button
                  onClick={() => formatText('italic')}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <Italic className="w-4 h-4 text-gray-600" />
                </button>
              </Tooltip>
              
              <Tooltip content="Underline (Ctrl+U)">
                <button
                  onClick={() => formatText('underline')}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <Underline className="w-4 h-4 text-gray-600" />
                </button>
              </Tooltip>
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
              <Tooltip content="Align Left">
                <button
                  onClick={() => formatText('justifyLeft')}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <AlignLeft className="w-4 h-4 text-gray-600" />
                </button>
              </Tooltip>
              
              <Tooltip content="Align Center">
                <button
                  onClick={() => formatText('justifyCenter')}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <AlignCenter className="w-4 h-4 text-gray-600" />
                </button>
              </Tooltip>
              
              <Tooltip content="Align Right">
                <button
                  onClick={() => formatText('justifyRight')}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <AlignRight className="w-4 h-4 text-gray-600" />
                </button>
              </Tooltip>
              
              <Tooltip content="Justify">
                <button
                  onClick={() => formatText('justifyFull')}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <AlignJustify className="w-4 h-4 text-gray-600" />
                </button>
              </Tooltip>
            </div>

            {/* Lists */}
            <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
              <Tooltip content="Bullet List">
                <button
                  onClick={() => formatText('insertUnorderedList')}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <List className="w-4 h-4 text-gray-600" />
                </button>
              </Tooltip>
              
              <Tooltip content="Numbered List">
                <button
                  onClick={() => formatText('insertOrderedList')}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <ListOrdered className="w-4 h-4 text-gray-600" />
                </button>
              </Tooltip>
            </div>

            {/* Special Functions */}
            <div className="flex items-center gap-1">
              <Tooltip content="Find & Replace">
                <button
                  onClick={() => setShowFindReplace(true)}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <Search className="w-4 h-4 text-gray-600" />
                </button>
              </Tooltip>
              
              <Tooltip content="Insert Page Break">
                <button
                  onClick={insertPageBreak}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <FileText className="w-4 h-4 text-gray-600" />
                </button>
              </Tooltip>
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 border-l border-gray-200 pl-2">
              <Tooltip content="Zoom Out">
                <button
                  onClick={handleZoomOut}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <ZoomOut className="w-4 h-4 text-gray-600" />
                </button>
              </Tooltip>
              
              <button
                onClick={handleZoomReset}
                className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded min-w-[50px]"
              >
                {zoomLevel}%
              </button>
              
              <Tooltip content="Zoom In">
                <button
                  onClick={handleZoomIn}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <ZoomIn className="w-4 h-4 text-gray-600" />
                </button>
              </Tooltip>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-1 border-l border-gray-200 pl-2">
              <Tooltip content="Toggle Ruler">
                <button
                  onClick={() => setShowRuler(!showRuler)}
                  className={`p-2 rounded transition-colors ${showRuler ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  <Type className="w-4 h-4" />
                </button>
              </Tooltip>
              
              <Tooltip content="Toggle Fullscreen">
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4 text-gray-600" /> : <Maximize2 className="w-4 h-4 text-gray-600" />}
                </button>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Ruler */}
        {showRuler && (
          <div className="h-6 bg-gray-50 border-b border-gray-200 flex items-center px-4">
            <div className="flex-1 relative h-4 bg-white border border-gray-300">
              {/* Ruler markings */}
              {Array.from({ length: 17 }, (_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 border-l border-gray-400"
                  style={{ left: `${(i * 6.25)}%` }}
                >
                  <span className="absolute -top-4 text-xs text-gray-500 transform -translate-x-1/2">
                    {i}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-gray-100 border-b border-gray-200 px-4 py-1 text-xs text-gray-600 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span>Page {pageCount} of {pageCount}</span>
          <span>{wordCount} words</span>
          <span>Line {cursorPosition.line}, Column {cursorPosition.column}</span>
          {hasUnsavedChanges ? (
            <span className="text-amber-600 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Unsaved changes
            </span>
          ) : (
            <span className="text-green-600 flex items-center gap-1">
              <CheckSquare className="w-3 h-3" />
              Saved at {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span>Case: {currentCase.id}</span>
          <span>•</span>
          <span>{currentCase.claimant}</span>
        </div>
      </div>

      {/* Document Editor */}
      <div className="flex-1 overflow-auto bg-gray-200 p-4">
        <div 
          className="max-w-4xl mx-auto bg-white shadow-lg"
          style={{ 
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            minHeight: '11in',
            width: '8.5in'
          }}
        >
          <div
            ref={contentRef}
            contentEditable
            className="p-16 min-h-full focus:outline-none"
            style={{
              fontFamily: activeFont,
              fontSize: `${fontSize}px`,
              lineHeight: '1.6',
              color: '#000'
            }}
            dangerouslySetInnerHTML={{ __html: content }}
            onInput={(e) => {
              const target = e.target as HTMLDivElement;
              handleContentChange(target.innerHTML);
            }}
            onKeyDown={(e) => {
              // Handle keyboard shortcuts
              if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                  case 's':
                    e.preventDefault();
                    handleSave();
                    break;
                  case 'f':
                    e.preventDefault();
                    setShowFindReplace(true);
                    break;
                }
              }
            }}
          />
        </div>
      </div>

      {/* Find & Replace Modal */}
      <Modal
        isOpen={showFindReplace}
        onClose={() => setShowFindReplace(false)}
        title="Find & Replace"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Find
            </label>
            <input
              type="text"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter text to find..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Replace with
            </label>
            <input
              type="text"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter replacement text..."
            />
          </div>
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowFindReplace(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={findAndReplace}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Replace All
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
