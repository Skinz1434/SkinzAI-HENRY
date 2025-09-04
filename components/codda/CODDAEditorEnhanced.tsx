'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Edit3,
  Search,
  Filter,
  MoreVertical,
  Type,
  AlignLeft,
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Save,
  Download,
  Upload,
  FileText,
  Eye,
  EyeOff,
  Maximize,
  Minimize,
  Settings,
  Undo,
  Redo,
  Copy,
  Paste,
  Scissors,
  AlignCenter,
  AlignRight,
  Underline,
  Strikethrough,
  Quote,
  Code,
  Image,
  Table,
  Calendar,
  User,
  Clock,
  CheckSquare,
  AlertTriangle,
  Info,
  Zap,
  FileDown,
  Mail,
  Users,
  MessageCircle
} from 'lucide-react';
import { CODCase, CODDASettings, DraftSection } from '@/types/codda';
import Tooltip from './ui/Tooltip';
import Modal from './ui/Modal';

interface CODDAEditorEnhancedProps {
  currentCase: CODCase;
  settings: CODDASettings;
  onCaseUpdate: (updatedCase: CODCase) => void;
  onExportPDF?: () => void;
  onExportWord?: () => void;
  onSendForReview?: (reviewers: string[]) => void;
}

const DOCUMENT_SECTIONS = [
  { id: 'issue', label: 'ISSUE', required: true, description: 'Statement of the issue to be decided' },
  { id: 'evidence', label: 'EVIDENCE', required: true, description: 'Summary of evidence considered' },
  { id: 'laws-regs', label: 'LAWS/REGS', required: true, description: 'Applicable laws and regulations' },
  { id: 'decision', label: 'DECISION', required: true, description: 'The determination reached' },
  { id: 'reasons-bases', label: 'REASONS & BASES', required: true, description: 'Detailed reasoning and analysis' },
  { id: 'favorable', label: 'FAVORABLE FINDINGS', required: false, description: 'Any findings favorable to the claimant' }
];

export default function CODDAEditorEnhanced({ 
  currentCase, 
  settings, 
  onCaseUpdate,
  onExportPDF,
  onExportWord,
  onSendForReview
}: CODDAEditorEnhancedProps) {
  const [activeSection, setActiveSection] = useState('issue');
  const [content, setContent] = useState('');
  const [showToolbar, setShowToolbar] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Available reviewers for collaboration
  const availableReviewers = [
    { id: 'rvsr-1', name: 'Sarah Johnson', role: 'RVSR', email: 'sarah.johnson@va.gov' },
    { id: 'dro-1', name: 'Michael Chen', role: 'DRO', email: 'michael.chen@va.gov' },
    { id: 'coach-1', name: 'Dr. Emily Rodriguez', role: 'Coach/QA', email: 'emily.rodriguez@va.gov' },
    { id: 'medical-1', name: 'Dr. James Wilson', role: 'Medical Reviewer', email: 'james.wilson@va.gov' }
  ];

  useEffect(() => {
    // Load template content based on current case
    const templateContent = generateTemplateContent(currentCase);
    setContent(templateContent);
    updateWordCount(templateContent);
  }, [currentCase]);

  const generateTemplateContent = (caseData: CODCase) => {
    const servicePeriod = caseData.service[0];
    return `## ISSUE
Character of discharge for the service period from ${new Date(servicePeriod?.start || '').toLocaleDateString()} to ${new Date(servicePeriod?.end || '').toLocaleDateString()}.

## EVIDENCE
The evidence considered includes:
- DD Form 214 (Certificate of Release or Discharge from Active Duty)
- Service personnel records
- Service treatment records
- [Additional evidence items to be listed]

## PERTINENT LAWS AND REGULATIONS
- 38 CFR 3.12 - Character of discharge
- 38 CFR 3.354 - Insanity
- 38 CFR 3.360 - Eligibility for health care
- [Additional applicable regulations]

## DECISION
[Decision statement to be completed]

## REASONS AND BASES
[Detailed analysis and reasoning to be provided]

## FAVORABLE FINDINGS
[Any favorable findings to be noted]`;
  };

  const updateWordCount = useCallback((text: string) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setCharacterCount(text.length);
  }, []);

  const handleContentChange = useCallback((newContent: string) => {
    // Add current content to undo stack
    setUndoStack(prev => [...prev.slice(-9), content]);
    setRedoStack([]);
    
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
  }, [content, settings.autoSave]);

  const handleSave = useCallback(() => {
    const updatedCase = {
      ...currentCase,
      decision: {
        ...currentCase.decision,
        decisionText: content,
        lastModified: new Date().toISOString()
      },
      updatedAt: new Date().toISOString(),
      qa: {
        ...currentCase.qa,
        completeness: calculateCompleteness(content)
      }
    };
    
    onCaseUpdate(updatedCase);
    setLastSaved(new Date());
    setHasUnsavedChanges(false);
  }, [content, currentCase, onCaseUpdate]);

  const calculateCompleteness = (text: string): number => {
    const sections = text.split('##').filter(section => section.trim());
    const completedSections = sections.filter(section => {
      const sectionContent = section.split('\n').slice(1).join('\n').trim();
      return sectionContent && 
             !sectionContent.includes('[') && 
             sectionContent.length > 100;
    });
    
    return Math.min(100, Math.round((completedSections.length / DOCUMENT_SECTIONS.length) * 100));
  };

  const insertText = useCallback((text: string, replace = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    let newContent: string;
    if (replace && start !== end) {
      newContent = content.substring(0, start) + text + content.substring(end);
    } else {
      newContent = content.substring(0, start) + text + content.substring(start);
    }
    
    handleContentChange(newContent);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + text.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  }, [content, handleContentChange]);

  const formatText = useCallback((format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = selectedText ? `**${selectedText}**` : '**bold text**';
        break;
      case 'italic':
        formattedText = selectedText ? `*${selectedText}*` : '*italic text*';
        break;
      case 'underline':
        formattedText = selectedText ? `<u>${selectedText}</u>` : '<u>underlined text</u>';
        break;
      case 'strikethrough':
        formattedText = selectedText ? `~~${selectedText}~~` : '~~strikethrough text~~';
        break;
      case 'quote':
        formattedText = selectedText ? `> ${selectedText}` : '> quoted text';
        break;
      case 'code':
        formattedText = selectedText ? `\`${selectedText}\`` : '`code`';
        break;
      case 'link':
        formattedText = selectedText ? `[${selectedText}](url)` : '[link text](url)';
        break;
      case 'bullet':
        formattedText = selectedText ? `- ${selectedText}` : '- List item';
        break;
      case 'numbered':
        formattedText = selectedText ? `1. ${selectedText}` : '1. Numbered item';
        break;
      default:
        return;
    }

    insertText(formattedText, selectedText.length > 0);
  }, [content, insertText]);

  const insertClause = useCallback((clauseType: string) => {
    const clauses: Record<string, string> = {
      'issue-standard': 'Character of discharge for the service period from {start} to {end}.',
      'evidence-lead': 'The evidence considered includes: {list}.',
      'evidence-combat': 'The record establishes combat service in {location} from {startDate} to {endDate}.',
      'insanity-not': 'Insanity is **not** raised by the record or argument.',
      'insanity-detailed': 'Insanity during service was carefully considered. While the veteran was diagnosed with {diagnosis}, this condition does not meet the legal standard for insanity under 38 CFR 3.354.',
      'compelling-combat': 'Compelling circumstances include the veteran\'s combat service in {location}, exposure to traumatic events, and service-connected mental health conditions.',
      'bar-misconduct': 'The discharge constitutes a bar to benefits under 38 CFR 3.12(d) based on a pattern of misconduct.',
      'healthcare-combat': 'Although a bar applies, the veteran is eligible for healthcare benefits under 38 CFR 3.360 based on combat service.',
      'decision-favorable': 'For the period {start}–{end}, the service is characterized as honorable for VA purposes.',
      'favorable-findings': 'The following favorable findings are made and are binding: {items}.'
    };

    if (clauses[clauseType]) {
      insertText('\n\n' + clauses[clauseType] + '\n\n');
    }
  }, [insertText]);

  const handleUndo = useCallback(() => {
    if (undoStack.length > 0) {
      const previousContent = undoStack[undoStack.length - 1];
      setRedoStack(prev => [content, ...prev.slice(0, 9)]);
      setUndoStack(prev => prev.slice(0, -1));
      setContent(previousContent);
      updateWordCount(previousContent);
    }
  }, [undoStack, content, updateWordCount]);

  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const nextContent = redoStack[0];
      setUndoStack(prev => [...prev.slice(-9), content]);
      setRedoStack(prev => prev.slice(1));
      setContent(nextContent);
      updateWordCount(nextContent);
    }
  }, [redoStack, content, updateWordCount]);

  const handleFileImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        handleContentChange(text);
      };
      reader.readAsText(file);
    }
  }, [handleContentChange]);

  const handleExport = useCallback((format: 'pdf' | 'word' | 'markdown') => {
    switch (format) {
      case 'pdf':
        onExportPDF?.();
        break;
      case 'word':
        onExportWord?.();
        break;
      case 'markdown':
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentCase.id}-draft.md`;
        a.click();
        URL.revokeObjectURL(url);
        break;
    }
    setShowExportModal(false);
  }, [content, currentCase.id, onExportPDF, onExportWord]);

  const handleSendForReview = useCallback(() => {
    if (selectedReviewers.length > 0) {
      onSendForReview?.(selectedReviewers);
      setShowReviewModal(false);
      setSelectedReviewers([]);
    }
  }, [selectedReviewers, onSendForReview]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'z':
            if (!e.shiftKey) {
              e.preventDefault();
              handleUndo();
            }
            break;
          case 'y':
          case 'Z':
            if (e.shiftKey || e.key === 'y') {
              e.preventDefault();
              handleRedo();
            }
            break;
          case 'b':
            e.preventDefault();
            formatText('bold');
            break;
          case 'i':
            e.preventDefault();
            formatText('italic');
            break;
          case 'u':
            e.preventDefault();
            formatText('underline');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, handleUndo, handleRedo, formatText]);

  const getCompletionPercentage = () => calculateCompleteness(content);

  return (
    <div className={`flex-1 flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900' : ''}`}>
      {/* Enhanced Editor Toolbar */}
      <div className="border-b border-white/10 bg-slate-800/50 px-4 py-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {/* Section selector */}
            <select 
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value)}
              className="bg-slate-700 border border-white/10 rounded px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-500 min-w-[140px]"
            >
              {DOCUMENT_SECTIONS.map(section => (
                <option key={section.id} value={section.id}>
                  {section.label} {section.required ? '*' : ''}
                </option>
              ))}
            </select>
            
            <div className="w-px h-4 bg-white/10" />
            
            {/* View controls */}
            <div className="flex items-center gap-1">
              <Tooltip content="Toggle toolbar">
                <button 
                  onClick={() => setShowToolbar(!showToolbar)}
                  className={`p-1.5 rounded transition-colors ${showToolbar ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </Tooltip>
              
              <Tooltip content="Toggle preview">
                <button 
                  onClick={() => setShowPreview(!showPreview)}
                  className={`p-1.5 rounded transition-colors ${showPreview ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </Tooltip>
              
              <Tooltip content="Toggle fullscreen">
                <button 
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </button>
              </Tooltip>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Document stats */}
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Type className="w-3 h-3" />
                <span>{wordCount} words</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                <span>{characterCount} chars</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getCompletionPercentage() > 80 ? 'bg-green-500' : getCompletionPercentage() > 50 ? 'bg-amber-500' : 'bg-red-500'}`} />
                <span>{getCompletionPercentage()}% Complete</span>
              </div>
            </div>
            
            {/* Save status */}
            <div className="flex items-center gap-2 text-xs">
              {hasUnsavedChanges ? (
                <div className="flex items-center gap-1 text-amber-400">
                  <Clock className="w-3 h-3" />
                  <span>Unsaved</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-green-400">
                  <CheckSquare className="w-3 h-3" />
                  <span>Saved {lastSaved.toLocaleTimeString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Advanced toolbar */}
        {showToolbar && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {/* File operations */}
              <div className="flex items-center gap-1 mr-2">
                <Tooltip content="Save (Ctrl+S)">
                  <button 
                    onClick={handleSave}
                    className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded transition-colors"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </Tooltip>
                
                <Tooltip content="Import file">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </Tooltip>
                
                <Tooltip content="Export options">
                  <button 
                    onClick={() => setShowExportModal(true)}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </Tooltip>
              </div>

              <div className="w-px h-4 bg-white/10 mx-2" />

              {/* Undo/Redo */}
              <div className="flex items-center gap-1 mr-2">
                <Tooltip content="Undo (Ctrl+Z)">
                  <button 
                    onClick={handleUndo}
                    disabled={undoStack.length === 0}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Undo className="w-4 h-4" />
                  </button>
                </Tooltip>
                
                <Tooltip content="Redo (Ctrl+Y)">
                  <button 
                    onClick={handleRedo}
                    disabled={redoStack.length === 0}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Redo className="w-4 h-4" />
                  </button>
                </Tooltip>
              </div>

              <div className="w-px h-4 bg-white/10 mx-2" />

              {/* Text formatting */}
              <div className="flex items-center gap-1 mr-2">
                <Tooltip content="Bold (Ctrl+B)">
                  <button 
                    onClick={() => formatText('bold')}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                </Tooltip>
                
                <Tooltip content="Italic (Ctrl+I)">
                  <button 
                    onClick={() => formatText('italic')}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                </Tooltip>
                
                <Tooltip content="Underline (Ctrl+U)">
                  <button 
                    onClick={() => formatText('underline')}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                  >
                    <Underline className="w-4 h-4" />
                  </button>
                </Tooltip>
                
                <Tooltip content="Strikethrough">
                  <button 
                    onClick={() => formatText('strikethrough')}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                  >
                    <Strikethrough className="w-4 h-4" />
                  </button>
                </Tooltip>
              </div>

              <div className="w-px h-4 bg-white/10 mx-2" />

              {/* Lists and formatting */}
              <div className="flex items-center gap-1 mr-2">
                <Tooltip content="Bullet list">
                  <button 
                    onClick={() => formatText('bullet')}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </Tooltip>
                
                <Tooltip content="Numbered list">
                  <button 
                    onClick={() => formatText('numbered')}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </button>
                </Tooltip>
                
                <Tooltip content="Quote">
                  <button 
                    onClick={() => formatText('quote')}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                  >
                    <Quote className="w-4 h-4" />
                  </button>
                </Tooltip>
                
                <Tooltip content="Link">
                  <button 
                    onClick={() => formatText('link')}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                  >
                    <Link className="w-4 h-4" />
                  </button>
                </Tooltip>
              </div>

              {/* Clause insertion */}
              <div className="relative">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      insertClause(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  value=""
                  className="bg-slate-700 border border-white/10 rounded px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-500 min-w-[160px]"
                >
                  <option value="">Insert Clause...</option>
                  <optgroup label="Issue Statements">
                    <option value="issue-standard">Standard Issue</option>
                  </optgroup>
                  <optgroup label="Evidence">
                    <option value="evidence-lead">Evidence Lead-in</option>
                    <option value="evidence-combat">Combat Evidence</option>
                  </optgroup>
                  <optgroup label="Insanity Analysis">
                    <option value="insanity-not">Insanity - Not at Issue</option>
                    <option value="insanity-detailed">Insanity - Detailed Analysis</option>
                  </optgroup>
                  <optgroup label="Compelling Circumstances">
                    <option value="compelling-combat">Combat Circumstances</option>
                  </optgroup>
                  <optgroup label="Bar Determinations">
                    <option value="bar-misconduct">Misconduct Bar</option>
                  </optgroup>
                  <optgroup label="Healthcare">
                    <option value="healthcare-combat">Combat Healthcare</option>
                  </optgroup>
                  <optgroup label="Decisions">
                    <option value="decision-favorable">Favorable Decision</option>
                  </optgroup>
                  <optgroup label="Favorable Findings">
                    <option value="favorable-findings">Favorable Findings</option>
                  </optgroup>
                </select>
              </div>
            </div>
            
            {/* Collaboration tools */}
            <div className="flex items-center gap-1">
              <Tooltip content="Send for review">
                <button 
                  onClick={() => setShowReviewModal(true)}
                  className="p-1.5 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded transition-colors"
                >
                  <Users className="w-4 h-4" />
                </button>
              </Tooltip>
              
              <Tooltip content="Add comment">
                <button 
                  onClick={() => insertText('\n\n<!-- Comment: [Add your comment here] -->\n\n')}
                  className="p-1.5 text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 rounded transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              </Tooltip>
              
              <Tooltip content="Editor settings">
                <button 
                  onClick={() => setShowSettingsModal(true)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </Tooltip>
            </div>
          </div>
        )}
      </div>
      
      {/* Editor */}
      <div className="flex-1 flex">
        {/* Main editor */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full'} p-6`}>
          <div className="h-full bg-slate-800/30 border border-white/10 rounded-lg overflow-hidden relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              className={`w-full h-full bg-transparent text-gray-200 p-6 resize-none outline-none font-mono text-sm leading-relaxed ${
                settings.wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre'
              } ${settings.showLineNumbers ? 'pl-16' : ''}`}
              placeholder="Begin drafting your character of discharge determination...

Use the toolbar above to format your document and insert standard clauses.
The system will automatically check for completeness and compliance."
              spellCheck={true}
            />
            
            {/* Line numbers */}
            {settings.showLineNumbers && (
              <div className="absolute left-0 top-0 w-12 h-full bg-slate-800/50 border-r border-white/10 p-6 text-xs text-gray-500 font-mono leading-relaxed pointer-events-none overflow-hidden">
                {content.split('\n').map((_, i) => (
                  <div key={i} className="text-right pr-2">
                    {i + 1}
                  </div>
                ))}
              </div>
            )}
            
            {/* Ruler guide */}
            {settings.rulerGuide && (
              <div className="absolute top-0 left-0 right-0 h-4 bg-slate-700/30 border-b border-white/5 flex items-center px-6 text-xs text-gray-500 font-mono">
                {Array.from({ length: 20 }, (_, i) => (
                  <div key={i} className="w-8 text-center">
                    {(i + 1) * 5}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Preview panel */}
        {showPreview && (
          <div className="w-1/2 p-6 border-l border-white/10">
            <div className="h-full bg-white rounded-lg p-6 overflow-y-auto">
              <div className="prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ 
                  __html: content
                    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                    .replace(/^\* (.+)$/gm, '<li>$1</li>')
                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.+?)\*/g, '<em>$1</em>')
                    .replace(/\n/g, '<br>')
                }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md,.doc,.docx"
        onChange={handleFileImport}
        className="hidden"
      />

      {/* Export Modal */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Document"
        size="md"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Choose Export Format</h3>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => handleExport('pdf')}
                className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors text-left"
              >
                <FileDown className="w-6 h-6 text-red-400" />
                <div>
                  <div className="font-medium text-white">PDF Document</div>
                  <div className="text-sm text-gray-400">Official format with digital signature support</div>
                </div>
              </button>
              
              <button
                onClick={() => handleExport('word')}
                className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors text-left"
              >
                <FileText className="w-6 h-6 text-blue-400" />
                <div>
                  <div className="font-medium text-white">Word Document</div>
                  <div className="text-sm text-gray-400">Editable format for further collaboration</div>
                </div>
              </button>
              
              <button
                onClick={() => handleExport('markdown')}
                className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors text-left"
              >
                <Code className="w-6 h-6 text-green-400" />
                <div>
                  <div className="font-medium text-white">Markdown</div>
                  <div className="text-sm text-gray-400">Plain text format with formatting</div>
                </div>
              </button>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <input type="checkbox" id="includeSignature" defaultChecked className="rounded" />
              <label htmlFor="includeSignature" className="text-sm text-gray-200">
                Include digital signature block
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="autoRoute" className="rounded" />
              <label htmlFor="autoRoute" className="text-sm text-gray-200">
                Automatically route for review via Outlook
              </label>
            </div>
          </div>
        </div>
      </Modal>

      {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Send for Review"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Select Reviewers</h3>
            <div className="space-y-3">
              {availableReviewers.map(reviewer => (
                <div key={reviewer.id} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                  <input
                    type="checkbox"
                    id={reviewer.id}
                    checked={selectedReviewers.includes(reviewer.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedReviewers(prev => [...prev, reviewer.id]);
                      } else {
                        setSelectedReviewers(prev => prev.filter(id => id !== reviewer.id));
                      }
                    }}
                    className="rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-white">{reviewer.name}</div>
                    <div className="text-sm text-gray-400">{reviewer.role} • {reviewer.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Review Message (Optional)
            </label>
            <textarea
              placeholder="Add a message for reviewers..."
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-gray-200 resize-none"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowReviewModal(false)}
              className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSendForReview}
              disabled={selectedReviewers.length === 0}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send for Review
            </button>
          </div>
        </div>
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Editor Settings"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-200">Show line numbers</span>
            <input type="checkbox" checked={settings.showLineNumbers} className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-200">Word wrap</span>
            <input type="checkbox" checked={settings.wordWrap} className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-200">Auto-save</span>
            <input type="checkbox" checked={settings.autoSave} className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-200">Ruler guide</span>
            <input type="checkbox" checked={settings.rulerGuide} className="rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Editor density
            </label>
            <select 
              value={settings.editorDensity}
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-gray-200"
            >
              <option value="compact">Compact</option>
              <option value="comfortable">Comfortable</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
