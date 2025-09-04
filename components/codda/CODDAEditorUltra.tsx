'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
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
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
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
  Info,
  FileText,
  Bookmark,
  Tag,
  Hash,
  AtSign,
  Paperclip,
  Calendar,
  MapPin,
  Phone,
  Globe,
  Star,
  Award,
  Shield,
  Zap,
  Brain,
  Target,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Database,
  Archive,
  FolderOpen,
  Plus,
  Minus,
  X,
  Check,
  ChevronDown,
  MoreVertical,
  MousePointer,
  Keyboard,
  Monitor,
  Smartphone,
  Tablet,
  Book
} from 'lucide-react';
import { CODCase, CODDASettings } from '@/types/codda';
import Tooltip from './ui/Tooltip';
import Modal from './ui/Modal';

interface CODDAEditorUltraProps {
  currentCase: CODCase;
  settings: CODDASettings;
  onCaseUpdate: (updatedCase: CODCase) => void;
  onExportPDF?: () => void;
  onExportWord?: () => void;
  onSendForReview?: (reviewers: string[]) => void;
}

interface TableData {
  rows: number;
  cols: number;
  data: string[][];
}

interface Citation {
  id: string;
  text: string;
  source: string;
  page?: string;
  date?: string;
  type: 'regulation' | 'evidence' | 'case-law' | 'manual';
}

export default function CODDAEditorUltra({ 
  currentCase, 
  settings, 
  onCaseUpdate,
  onExportPDF,
  onExportWord,
  onSendForReview
}: CODDAEditorUltraProps) {
  const [content, setContent] = useState('');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRuler, setShowRuler] = useState(true);
  const [showPageBreaks, setShowPageBreaks] = useState(true);
  const [activeFont, setActiveFont] = useState('Times New Roman');
  const [fontSize, setFontSize] = useState(12);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showCitationModal, setShowCitationModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);
  const [documentStructure, setDocumentStructure] = useState<any[]>([]);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [trackChanges, setTrackChanges] = useState(false);
  const [changeHistory, setChangeHistory] = useState<any[]>([]);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Initialize with enhanced template
  useEffect(() => {
    const servicePeriod = currentCase.service[0];
    const templateContent = generateAdvancedTemplate(currentCase);
    setContent(templateContent);
    updateWordCount(templateContent);
    analyzeDocumentStructure(templateContent);
  }, [currentCase]);

  const generateAdvancedTemplate = (caseData: CODCase) => {
    const servicePeriod = caseData.service[0];
    return `
<div class="document-page">
  <!-- Document Header -->
  <div class="document-header" style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px;">
    <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
      <img src="/assets/images/va-seal.png" alt="VA Seal" style="width: 60px; height: 60px; margin-right: 15px;" />
      <div>
        <h1 style="font-size: 18px; font-weight: bold; margin: 0; color: #000;">
          DEPARTMENT OF VETERANS AFFAIRS
        </h1>
        <h2 style="font-size: 16px; font-weight: bold; margin: 5px 0 0 0; color: #000;">
          CHARACTER OF DISCHARGE DETERMINATION
        </h2>
      </div>
    </div>
    
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #000;">
      <tr style="background-color: #f0f0f0;">
        <td style="border: 1px solid #000; padding: 8px; font-weight: bold; width: 25%;">Case ID</td>
        <td style="border: 1px solid #000; padding: 8px; width: 25%;">${caseData.id}</td>
        <td style="border: 1px solid #000; padding: 8px; font-weight: bold; width: 25%;">File Number</td>
        <td style="border: 1px solid #000; padding: 8px; width: 25%;">${caseData.fileNumber}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #000; padding: 8px; font-weight: bold;">Claimant</td>
        <td style="border: 1px solid #000; padding: 8px;">${caseData.claimant}</td>
        <td style="border: 1px solid #000; padding: 8px; font-weight: bold;">Station</td>
        <td style="border: 1px solid #000; padding: 8px;">${caseData.station}</td>
      </tr>
      <tr style="background-color: #f0f0f0;">
        <td style="border: 1px solid #000; padding: 8px; font-weight: bold;">Date Prepared</td>
        <td style="border: 1px solid #000; padding: 8px;">${new Date().toLocaleDateString()}</td>
        <td style="border: 1px solid #000; padding: 8px; font-weight: bold;">Status</td>
        <td style="border: 1px solid #000; padding: 8px; text-transform: capitalize;">${caseData.status}</td>
      </tr>
    </table>
  </div>

  <!-- Document Body -->
  <div class="document-content" style="margin: 30px 0;">
    
    <!-- ISSUE Section -->
    <section data-section="issue" style="margin-bottom: 25px;">
      <h2 style="font-size: 14px; font-weight: bold; margin: 0 0 10px 0; padding: 5px 0; border-bottom: 1px solid #ccc; color: #000;">
        I. ISSUE
      </h2>
      <p style="margin: 10px 0; line-height: 1.8; text-align: justify;">
        Character of discharge for the service period from <strong>${servicePeriod ? new Date(servicePeriod.start).toLocaleDateString() : '[Start Date]'}</strong> 
        to <strong>${servicePeriod ? new Date(servicePeriod.end).toLocaleDateString() : '[End Date]'}</strong>, 
        ${servicePeriod ? servicePeriod.branch : '[Service Branch]'}.
      </p>
    </section>

    <!-- EVIDENCE Section -->
    <section data-section="evidence" style="margin-bottom: 25px;">
      <h2 style="font-size: 14px; font-weight: bold; margin: 0 0 10px 0; padding: 5px 0; border-bottom: 1px solid #ccc; color: #000;">
        II. EVIDENCE CONSIDERED
      </h2>
      <p style="margin: 10px 0; line-height: 1.8; text-align: justify;">
        The evidence of record includes the following:
      </p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0; border: 1px solid #000;">
        <thead>
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #000; padding: 8px; text-align: left; font-weight: bold;">Evidence Item</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">Date</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">Source</th>
            <th style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">Reliability</th>
          </tr>
        </thead>
        <tbody>
          ${caseData.evidence.filter(e => !e.isGap).map(evidence => `
            <tr>
              <td style="border: 1px solid #000; padding: 8px;">${evidence.title}</td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">${evidence.date || 'N/A'}</td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center;">${evidence.source}</td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center; text-transform: capitalize;">${evidence.reliability}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      ${caseData.evidence.filter(e => e.isGap).length > 0 ? `
      <p style="margin: 15px 0; line-height: 1.8; color: #d32f2f; font-weight: bold;">
        <strong>Note:</strong> Additional evidence was requested but not received:
      </p>
      <ul style="margin: 10px 0 10px 30px; line-height: 1.8; color: #d32f2f;">
        ${caseData.evidence.filter(e => e.isGap).map(gap => `
          <li>${gap.title}</li>
        `).join('')}
      </ul>
      ` : ''}
    </section>

    <!-- LAWS AND REGULATIONS Section -->
    <section data-section="laws-regs" style="margin-bottom: 25px;">
      <h2 style="font-size: 14px; font-weight: bold; margin: 0 0 10px 0; padding: 5px 0; border-bottom: 1px solid #ccc; color: #000;">
        III. PERTINENT LAWS AND REGULATIONS
      </h2>
      <p style="margin: 10px 0; line-height: 1.8; text-align: justify;">
        The following laws and regulations are applicable to this determination:
      </p>
      
      <ul style="margin: 10px 0 10px 30px; line-height: 1.8;">
        <li><strong>38 U.S.C. § 5303(a)</strong> - Character of discharge as affecting entitlement</li>
        <li><strong>38 CFR 3.12</strong> - Character of discharge</li>
        <li><strong>38 CFR 3.354</strong> - Insanity</li>
        <li><strong>38 CFR 3.360</strong> - Eligibility for health care</li>
        <li><strong>M21-1 Part III.iv.1.B</strong> - Character of discharge procedures</li>
        <li><strong>M21-1 Part III.iv.1.B.1.a</strong> - General procedures</li>
      </ul>
    </section>

    <!-- ANALYSIS Section -->
    <section data-section="analysis" style="margin-bottom: 25px;">
      <h2 style="font-size: 14px; font-weight: bold; margin: 0 0 10px 0; padding: 5px 0; border-bottom: 1px solid #ccc; color: #000;">
        IV. ANALYSIS AND FINDINGS
      </h2>
      
      <h3 style="font-size: 13px; font-weight: bold; margin: 20px 0 8px 0; color: #000;">
        A. Service History and Characterization
      </h3>
      <p style="margin: 10px 0; line-height: 1.8; text-align: justify;">
        ${servicePeriod ? `The veteran served in the ${servicePeriod.branch} from ${new Date(servicePeriod.start).toLocaleDateString()} 
        to ${new Date(servicePeriod.end).toLocaleDateString()}, receiving a discharge characterized as 
        <strong>${servicePeriod.charOfDischarge}</strong>.` : '[Service history analysis to be completed.]'}
        ${servicePeriod?.notes ? ` The record indicates: ${servicePeriod.notes}` : ''}
      </p>

      <h3 style="font-size: 13px; font-weight: bold; margin: 20px 0 8px 0; color: #000;">
        B. Insanity Consideration (38 CFR 3.354)
      </h3>
      <p style="margin: 10px 0; line-height: 1.8; text-align: justify;">
        Insanity during service has been considered in accordance with 38 CFR 3.354. 
        ${caseData.finding.insanityConsidered ? 
          (caseData.finding.insanityApplies ? 
            `The evidence establishes that the veteran suffered from a mental condition that constituted insanity under the regulation. ${caseData.finding.rationaleInsanity || '[Detailed analysis of insanity determination to be provided.]'}` :
            `The evidence does not establish insanity under 38 CFR 3.354. ${caseData.finding.rationaleInsanity || '[Detailed analysis of why insanity exception does not apply.]'}`) :
          '[Insanity consideration analysis to be completed.]'
        }
      </p>

      <h3 style="font-size: 13px; font-weight: bold; margin: 20px 0 8px 0; color: #000;">
        C. Compelling Circumstances
      </h3>
      <p style="margin: 10px 0; line-height: 1.8; text-align: justify;">
        ${caseData.finding.compellingCircumstancesConsidered ? 
          `Compelling circumstances have been evaluated. ${caseData.finding.compellingRationale || '[Detailed analysis of compelling circumstances to be provided.]'}` :
          'Compelling circumstances have been considered, including but not limited to combat service, traumatic experiences, and personal circumstances that may have contributed to the veteran\'s conduct. [Detailed analysis to be completed.]'
        }
      </p>

      <h3 style="font-size: 13px; font-weight: bold; margin: 20px 0 8px 0; color: #000;">
        D. Healthcare Eligibility Analysis (38 CFR 3.360)
      </h3>
      <p style="margin: 10px 0; line-height: 1.8; text-align: justify;">
        ${caseData.finding.healthcareOnlyConsidered ? 
          `Healthcare eligibility under Chapter 17 has been analyzed. ${caseData.finding.healthcareOnlyRationale || '[Healthcare eligibility determination to be provided.]'}` :
          'Healthcare eligibility under 38 CFR 3.360 is being evaluated. [Analysis to be completed.]'
        }
      </p>
    </section>

    <!-- DECISION Section -->
    <section data-section="decision" style="margin-bottom: 25px;">
      <h2 style="font-size: 14px; font-weight: bold; margin: 0 0 10px 0; padding: 5px 0; border-bottom: 1px solid #ccc; color: #000;">
        V. DECISION
      </h2>
      <div style="background-color: #fff3cd; border: 2px solid #ffc107; padding: 15px; margin: 15px 0; border-radius: 5px;">
        <p style="margin: 0; line-height: 1.8; text-align: justify; font-weight: bold; color: #000;">
          ${caseData.decision.decisionText || '[Decision statement to be completed based on analysis above.]'}
        </p>
      </div>
    </section>

    <!-- REASONS AND BASES Section -->
    <section data-section="reasons-bases" style="margin-bottom: 25px;">
      <h2 style="font-size: 14px; font-weight: bold; margin: 0 0 10px 0; padding: 5px 0; border-bottom: 1px solid #ccc; color: #000;">
        VI. REASONS AND BASES
      </h2>
      <p style="margin: 10px 0; line-height: 1.8; text-align: justify;">
        ${caseData.decision.reasonsBases || '[Detailed reasoning and legal basis for the decision to be provided, including specific citations to evidence and applicable law.]'}
      </p>
    </section>

    <!-- FAVORABLE FINDINGS Section -->
    <section data-section="favorable" style="margin-bottom: 25px;">
      <h2 style="font-size: 14px; font-weight: bold; margin: 0 0 10px 0; padding: 5px 0; border-bottom: 1px solid #ccc; color: #000;">
        VII. FAVORABLE FINDINGS
      </h2>
      <p style="margin: 10px 0; line-height: 1.8; text-align: justify;">
        The following favorable findings are made and are binding on future determinations:
      </p>
      
      ${caseData.decision.favorableFindings && caseData.decision.favorableFindings.length > 0 ? `
      <ul style="margin: 10px 0 10px 30px; line-height: 1.8;">
        ${caseData.decision.favorableFindings.map(finding => `<li style="margin-bottom: 5px;">${finding}</li>`).join('')}
      </ul>
      ` : `
      <ul style="margin: 10px 0 10px 30px; line-height: 1.8;">
        <li style="margin-bottom: 5px;">[Any favorable findings to be listed here]</li>
      </ul>
      `}
    </section>
  </div>

  <!-- Signature Block -->
  <div class="document-footer" style="margin-top: 50px; border-top: 2px solid #000; padding-top: 30px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="width: 50%; vertical-align: top; padding-right: 20px;">
          <p style="margin: 0; font-size: 12px; line-height: 1.6; border: 1px solid #ccc; padding: 10px; height: 100px;">
            <strong>PREPARED BY:</strong><br/><br/>
            ________________________________<br/>
            [Name], [Title]<br/>
            [Date]
          </p>
        </td>
        <td style="width: 50%; vertical-align: top; padding-left: 20px;">
          <p style="margin: 0; font-size: 12px; line-height: 1.6; border: 1px solid #ccc; padding: 10px; height: 100px;">
            <strong>REVIEWED BY:</strong><br/><br/>
            ________________________________<br/>
            [Name], [Title]<br/>
            [Date]
          </p>
        </td>
      </tr>
    </table>
    
    <div style="margin-top: 20px; text-align: center; font-size: 10px; color: #666;">
      <p>This determination was prepared using CODDA (Character of Discharge Determination Assistant)</p>
      <p>Document ID: ${caseData.id} | Generated: ${new Date().toLocaleDateString()}</p>
    </div>
  </div>
</div>
    `;
  };

  const updateWordCount = useCallback((text: string) => {
    const plainText = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    const words = plainText.split(' ').filter(word => word.length > 0);
    setWordCount(words.length);
    
    // Estimate page count (assuming ~250 words per page)
    setPageCount(Math.max(1, Math.ceil(words.length / 250)));
  }, []);

  const analyzeDocumentStructure = (text: string) => {
    const sections = text.match(/<section[^>]*data-section="([^"]*)"[^>]*>/g) || [];
    const structure = sections.map(section => {
      const sectionId = section.match(/data-section="([^"]*)"/)?.[1] || '';
      return {
        id: sectionId,
        title: sectionId.toUpperCase().replace('-', ' & '),
        wordCount: 0, // Would calculate actual word count
        completeness: Math.random() * 40 + 60 // Mock completeness
      };
    });
    setDocumentStructure(structure);
  };

  const handleContentChange = useCallback((newContent: string) => {
    if (trackChanges) {
      setChangeHistory(prev => [...prev.slice(-20), {
        timestamp: new Date(),
        content: content,
        author: 'Current User',
        type: 'edit'
      }]);
    }
    
    setContent(newContent);
    updateWordCount(newContent);
    analyzeDocumentStructure(newContent);
    setHasUnsavedChanges(true);
    
    // Auto-save if enabled
    if (settings.autoSave) {
      const timeoutId = setTimeout(() => {
        handleSave();
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [content, settings.autoSave, trackChanges]);

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
    const sections = text.match(/<section[^>]*>/g) || [];
    const filledSections = sections.filter(section => {
      const sectionContent = text.substring(text.indexOf(section));
      return sectionContent.length > 200 && !sectionContent.includes('[') && !sectionContent.includes('to be completed');
    });
    
    return Math.min(100, Math.round((filledSections.length / 6) * 100)); // 6 main sections
  };

  const insertTable = (rows: number, cols: number) => {
    let tableHTML = '<table style="width: 100%; border-collapse: collapse; margin: 15px 0; border: 1px solid #000;">';
    
    // Header row
    tableHTML += '<tr style="background-color: #f0f0f0;">';
    for (let j = 0; j < cols; j++) {
      tableHTML += '<th style="border: 1px solid #000; padding: 8px; text-align: left; font-weight: bold;">[Header]</th>';
    }
    tableHTML += '</tr>';
    
    // Data rows
    for (let i = 1; i < rows; i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < cols; j++) {
        tableHTML += '<td style="border: 1px solid #000; padding: 8px;">[Data]</td>';
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</table>';
    
    document.execCommand('insertHTML', false, tableHTML);
    if (contentRef.current) {
      handleContentChange(contentRef.current.innerHTML);
    }
    setShowTableModal(false);
  };

  const insertCitation = (citation: Citation) => {
    const citationHTML = `<span style="color: #0066cc; text-decoration: underline; cursor: pointer;" 
      title="${citation.source}${citation.page ? ', p. ' + citation.page : ''}${citation.date ? ' (' + citation.date + ')' : ''}"
      data-citation-id="${citation.id}">
      [${citations.length + 1}]
    </span>`;
    
    document.execCommand('insertHTML', false, citationHTML);
    setCitations(prev => [...prev, { ...citation, id: Date.now().toString() }]);
    
    if (contentRef.current) {
      handleContentChange(contentRef.current.innerHTML);
    }
    setShowCitationModal(false);
  };

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (contentRef.current) {
      handleContentChange(contentRef.current.innerHTML);
    }
  };

  const insertSpecialElement = (type: string) => {
    let html = '';
    switch (type) {
      case 'page-break':
        html = '<div style="page-break-before: always; height: 0; border-top: 2px dashed #ccc; margin: 20px 0; position: relative;"><span style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: white; padding: 0 10px; color: #666; font-size: 10px;">Page Break</span></div>';
        break;
      case 'signature-block':
        html = '<div style="margin-top: 40px; border: 1px solid #000; padding: 20px;"><p><strong>SIGNATURE:</strong></p><br/><br/>_________________________________<br/>Name, Title<br/>Date: _______________</div>';
        break;
      case 'evidence-citation':
        html = '<span style="background-color: #e3f2fd; padding: 2px 4px; border-radius: 3px; font-size: 11px;">[Evidence Reference]</span>';
        break;
      case 'regulation-cite':
        html = '<span style="background-color: #f3e5f5; padding: 2px 4px; border-radius: 3px; font-size: 11px; font-weight: bold;">[38 CFR Reference]</span>';
        break;
    }
    
    if (html) {
      document.execCommand('insertHTML', false, html);
      if (contentRef.current) {
        handleContentChange(contentRef.current.innerHTML);
      }
    }
  };

  return (
    <div className={`flex-1 flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'bg-gray-100'}`}>
      {/* Ultra-Enhanced Toolbar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        {/* Main Toolbar Row */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            {/* File Operations */}
            <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
              <Tooltip content="Save Document (Ctrl+S)">
                <button
                  onClick={handleSave}
                  className={`p-2 rounded transition-colors ${hasUnsavedChanges ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  <Save className="w-4 h-4" />
                </button>
              </Tooltip>
              
              <Tooltip content="Export to PDF">
                <button
                  onClick={onExportPDF}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <Download className="w-4 h-4 text-red-600" />
                </button>
              </Tooltip>
              
              <Tooltip content="Export to Word">
                <button
                  onClick={onExportWord}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
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

            {/* Edit Operations */}
            <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
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
              
              <Tooltip content="Copy">
                <button
                  onClick={() => document.execCommand('copy')}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
              </Tooltip>
            </div>

            {/* Font Controls */}
            <div className="flex items-center gap-2 border-r border-gray-200 pr-3">
              <select
                value={activeFont}
                onChange={(e) => {
                  setActiveFont(e.target.value);
                  formatText('fontName', e.target.value);
                }}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
              >
                <option value="Times New Roman">Times New Roman</option>
                <option value="Arial">Arial</option>
                <option value="Calibri">Calibri</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
                <option value="Courier New">Courier New</option>
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
                <option value="9">9</option>
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
            <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
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
            <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
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
            <div className="flex items-center gap-1 border-r border-gray-200 pr-3">
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

            {/* Advanced Tools */}
            <div className="flex items-center gap-1">
              <Tooltip content="Insert Table">
                <button
                  onClick={() => setShowTableModal(true)}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <Table className="w-4 h-4 text-gray-600" />
                </button>
              </Tooltip>
              
              <Tooltip content="Add Citation">
                <button
                  onClick={() => setShowCitationModal(true)}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <Bookmark className="w-4 h-4 text-purple-600" />
                </button>
              </Tooltip>
              
              <Tooltip content="Insert Image">
                <button
                  onClick={() => setShowImageModal(true)}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <Image className="w-4 h-4 text-green-600" />
                </button>
              </Tooltip>
              
              <Tooltip content="More Tools">
                <div className="relative">
                  <button
                    onClick={() => setShowAdvancedTools(!showAdvancedTools)}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                  
                  {showAdvancedTools && (
                    <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10 min-w-[200px]">
                      <button
                        onClick={() => insertSpecialElement('page-break')}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        <FileText className="w-4 h-4" />
                        Insert Page Break
                      </button>
                      <button
                        onClick={() => insertSpecialElement('signature-block')}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        <Award className="w-4 h-4" />
                        Insert Signature Block
                      </button>
                      <button
                        onClick={() => insertSpecialElement('evidence-citation')}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        <Link className="w-4 h-4" />
                        Evidence Reference
                      </button>
                      <button
                        onClick={() => insertSpecialElement('regulation-cite')}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        <Book className="w-4 h-4" />
                        Regulation Citation
                      </button>
                    </div>
                  )}
                </div>
              </Tooltip>
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2">
            {/* Track Changes */}
            <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
              <Tooltip content="Track Changes">
                <button
                  onClick={() => setTrackChanges(!trackChanges)}
                  className={`p-2 rounded transition-colors ${
                    trackChanges ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                </button>
              </Tooltip>
              
              <Tooltip content="Show Comments">
                <button
                  onClick={() => setShowComments(!showComments)}
                  className={`p-2 rounded transition-colors ${
                    showComments ? 'bg-amber-100 text-amber-600' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              </Tooltip>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 border-l border-gray-200 pl-3">
              <Tooltip content="Zoom Out">
                <button
                  onClick={() => setZoomLevel(Math.max(25, zoomLevel - 10))}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <ZoomOut className="w-4 h-4 text-gray-600" />
                </button>
              </Tooltip>
              
              <button
                onClick={() => setZoomLevel(100)}
                className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded min-w-[60px] text-center"
              >
                {zoomLevel}%
              </button>
              
              <Tooltip content="Zoom In">
                <button
                  onClick={() => setZoomLevel(Math.min(300, zoomLevel + 10))}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <ZoomIn className="w-4 h-4 text-gray-600" />
                </button>
              </Tooltip>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-1 border-l border-gray-200 pl-3">
              <Tooltip content="Toggle Ruler">
                <button
                  onClick={() => setShowRuler(!showRuler)}
                  className={`p-2 rounded transition-colors ${
                    showRuler ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
                  }`}
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

        {/* Secondary Toolbar - Advanced Features */}
        <div className="flex items-center justify-between px-4 py-1 bg-gray-50">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Advanced:</span>
            
            <button
              onClick={() => setShowFindReplace(true)}
              className="flex items-center gap-1 px-2 py-1 hover:bg-gray-200 rounded transition-colors text-gray-600"
            >
              <Search className="w-3 h-3" />
              Find & Replace
            </button>
            
            <button
              onClick={() => insertSpecialElement('page-break')}
              className="flex items-center gap-1 px-2 py-1 hover:bg-gray-200 rounded transition-colors text-gray-600"
            >
              <FileText className="w-3 h-3" />
              Page Break
            </button>
            
            <button
              onClick={() => setShowCitationModal(true)}
              className="flex items-center gap-1 px-2 py-1 hover:bg-gray-200 rounded transition-colors text-purple-600"
            >
              <Bookmark className="w-3 h-3" />
              Citation
            </button>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Page {pageCount}</span>
            <span>{wordCount} words</span>
            <span>Line {cursorPosition.line}</span>
            {trackChanges && (
              <span className="flex items-center gap-1 text-blue-600">
                <Activity className="w-3 h-3" />
                Tracking
              </span>
            )}
          </div>
        </div>

        {/* Ruler */}
        {showRuler && (
          <div className="h-6 bg-gray-50 border-b border-gray-200 flex items-center px-4">
            <div className="flex-1 relative h-4 bg-white border border-gray-300">
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
      <div className="bg-blue-50 border-b border-gray-200 px-4 py-2 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-gray-800">Case: {currentCase.id}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">{currentCase.claimant}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">{currentCase.qa.completeness}% Complete</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {hasUnsavedChanges ? (
              <span className="text-amber-600 flex items-center gap-1 font-medium">
                <Clock className="w-4 h-4" />
                Unsaved changes
              </span>
            ) : (
              <span className="text-green-600 flex items-center gap-1">
                <CheckSquare className="w-4 h-4" />
                Saved at {lastSaved.toLocaleTimeString()}
              </span>
            )}
            
            <div className="text-gray-600">
              Page {pageCount} • {wordCount} words
            </div>
          </div>
        </div>
      </div>

      {/* Document Editor */}
      <div className="flex-1 overflow-auto bg-gray-200 p-6">
        <div className="flex justify-center">
          <div 
            className="bg-white shadow-2xl border border-gray-300"
            style={{ 
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              minHeight: '11in',
              width: '8.5in',
              maxWidth: '8.5in'
            }}
          >
            <div
              ref={contentRef}
              contentEditable
              className="p-16 min-h-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              onMouseUp={() => {
                // Update cursor position on mouse up
                setTimeout(() => {
                  const selection = window.getSelection();
                  if (selection && selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const textBeforeCursor = range.startContainer.textContent?.substring(0, range.startOffset) || '';
                    const lines = textBeforeCursor.split('\n');
                    setCursorPosition({
                      line: lines.length,
                      column: lines[lines.length - 1].length + 1
                    });
                  }
                }, 0);
              }}
            />
          </div>
        </div>
      </div>

      {/* Comments Sidebar */}
      {showComments && (
        <div className="fixed right-0 top-0 bottom-0 w-80 bg-white border-l border-gray-200 shadow-lg z-40 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Comments</h3>
            <button
              onClick={() => setShowComments(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          
          <div className="space-y-3">
            {comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-8 h-8 mx-auto mb-2" />
                <p>No comments yet</p>
                <p className="text-xs">Select text and add a comment</p>
              </div>
            ) : (
              comments.map((comment, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {comment.author?.[0] || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{comment.author || 'User'}</span>
                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Table Modal */}
      <Modal
        isOpen={showTableModal}
        onClose={() => setShowTableModal(false)}
        title="Insert Table"
        size="md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Rows</label>
              <input
                type="number"
                min="1"
                max="20"
                defaultValue="3"
                id="table-rows"
                className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Columns</label>
              <input
                type="number"
                min="1"
                max="10"
                defaultValue="3"
                id="table-cols"
                className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded text-gray-200"
              />
            </div>
          </div>
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowTableModal(false)}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const rows = (document.getElementById('table-rows') as HTMLInputElement)?.value || '3';
                const cols = (document.getElementById('table-cols') as HTMLInputElement)?.value || '3';
                insertTable(Number(rows), Number(cols));
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Insert Table
            </button>
          </div>
        </div>
      </Modal>

      {/* Citation Modal */}
      <Modal
        isOpen={showCitationModal}
        onClose={() => setShowCitationModal(false)}
        title="Add Citation"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Citation Type</label>
            <select className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded text-gray-200">
              <option value="regulation">Regulation (CFR)</option>
              <option value="evidence">Evidence Item</option>
              <option value="case-law">Case Law</option>
              <option value="manual">Manual/Procedure</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Citation Text</label>
            <input
              type="text"
              placeholder="e.g., 38 CFR 3.12(d)"
              className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded text-gray-200"
              id="citation-text"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Source</label>
            <input
              type="text"
              placeholder="e.g., Code of Federal Regulations"
              className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded text-gray-200"
              id="citation-source"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Page (Optional)</label>
              <input
                type="text"
                placeholder="Page number"
                className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded text-gray-200"
                id="citation-page"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Date (Optional)</label>
              <input
                type="date"
                className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded text-gray-200"
                id="citation-date"
              />
            </div>
          </div>
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowCitationModal(false)}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const text = (document.getElementById('citation-text') as HTMLInputElement)?.value || '';
                const source = (document.getElementById('citation-source') as HTMLInputElement)?.value || '';
                const page = (document.getElementById('citation-page') as HTMLInputElement)?.value || '';
                const date = (document.getElementById('citation-date') as HTMLInputElement)?.value || '';
                
                if (text && source) {
                  insertCitation({
                    id: Date.now().toString(),
                    text,
                    source,
                    page,
                    date,
                    type: 'regulation'
                  });
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Citation
            </button>
          </div>
        </div>
      </Modal>

      {/* Find & Replace Modal */}
      <Modal
        isOpen={showFindReplace}
        onClose={() => setShowFindReplace(false)}
        title="Find & Replace"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Find</label>
            <input
              type="text"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded text-gray-200"
              placeholder="Enter text to find..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Replace with</label>
            <input
              type="text"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded text-gray-200"
              placeholder="Enter replacement text..."
            />
          </div>
          
          <div className="flex items-center gap-2">
            <input type="checkbox" id="match-case" className="rounded" />
            <label htmlFor="match-case" className="text-sm text-gray-200">Match case</label>
            
            <input type="checkbox" id="whole-words" className="rounded ml-4" />
            <label htmlFor="whole-words" className="text-sm text-gray-200">Whole words only</label>
          </div>
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowFindReplace(false)}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Find next implementation
                console.log('Find next:', findText);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Find Next
            </button>
            <button
              onClick={() => {
                if (findText && contentRef.current) {
                  const content = contentRef.current.innerHTML;
                  const newContent = content.replace(new RegExp(findText, 'gi'), replaceText);
                  contentRef.current.innerHTML = newContent;
                  handleContentChange(newContent);
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Replace All
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
