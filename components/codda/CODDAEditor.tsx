'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  ListOrdered
} from 'lucide-react';
import { CODCase, CODDASettings } from '@/types/codda';

interface CODDAEditorProps {
  currentCase: CODCase;
  settings: CODDASettings;
  onCaseUpdate: (updatedCase: CODCase) => void;
}

const DOCUMENT_SECTIONS = [
  { id: 'issue', label: 'ISSUE', required: true },
  { id: 'evidence', label: 'EVIDENCE', required: true },
  { id: 'laws-regs', label: 'LAWS/REGS', required: true },
  { id: 'decision', label: 'DECISION', required: true },
  { id: 'reasons-bases', label: 'REASONS & BASES', required: true },
  { id: 'favorable', label: 'FAVORABLE FINDINGS', required: false }
];

export default function CODDAEditor({ currentCase, settings, onCaseUpdate }: CODDAEditorProps) {
  const [activeSection, setActiveSection] = useState('issue');
  const [content, setContent] = useState('');
  const [showToolbar, setShowToolbar] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Load default template content
    setContent(`## ISSUE
Character of discharge for the service period from ${currentCase.service[0]?.start || '[start]'} to ${currentCase.service[0]?.end || '[end]'}.

## EVIDENCE
The evidence considered includes: [list].

## PERTINENT LAWS AND REGULATIONS
[Relevant CFR sections and regulations]

## DECISION
[Decision statement]

## REASONS AND BASES
[Detailed reasoning and analysis]

## FAVORABLE FINDINGS
[Any favorable findings made]`);
  }, [currentCase]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    
    // Auto-save if enabled
    if (settings.autoSave) {
      // Debounce the save operation
      const timeoutId = setTimeout(() => {
        const updatedCase = {
          ...currentCase,
          decision: {
            ...currentCase.decision,
            decisionText: newContent
          },
          updatedAt: new Date().toISOString()
        };
        onCaseUpdate(updatedCase);
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  };

  const insertText = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + text + content.substring(end);
    
    setContent(newContent);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const insertClause = (clauseType: string) => {
    const clauses: Record<string, string> = {
      'issue': 'Character of discharge for the service period from {start} to {end}.',
      'evidence-lead': 'The evidence considered includes: {list}.',
      'insanity-not': 'Insanity is **not** raised by the record or argument.',
      'insanity-applies': 'The record reflects symptoms/diagnosis suggesting insanity at the time of the offense(s); the criteria are met because {rationale}.',
      'compelling': 'Compelling circumstances were considered, including {factors}. {conclusion}.',
      'bar-met': 'The discharge constitutes a bar to benefits under {branch} based on {facts}.',
      'healthcare': 'Although a bar applies, eligibility for health care under chapter 17 is considered; {analysis}.',
      'decision': 'For the period {start}–{end}, the service is {status} for VA purposes.',
      'favorable': 'The following favorable findings are made and are binding: {items}.'
    };

    if (clauses[clauseType]) {
      insertText('\n\n' + clauses[clauseType] + '\n\n');
    }
  };

  const getCompletionPercentage = () => {
    const sections = content.split('##').filter(section => section.trim());
    const completedSections = sections.filter(section => {
      const sectionContent = section.split('\n').slice(1).join('\n').trim();
      return sectionContent && !sectionContent.includes('[') && sectionContent.length > 50;
    });
    
    return Math.round((completedSections.length / DOCUMENT_SECTIONS.length) * 100);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Editor Toolbar */}
      <div className="border-b border-white/10 bg-slate-800/50 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <select 
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value)}
              className="bg-slate-700 border border-white/10 rounded px-2 py-1 text-sm text-gray-200 focus:outline-none focus:border-cyan-500"
            >
              {DOCUMENT_SECTIONS.map(section => (
                <option key={section.id} value={section.id}>
                  {section.label} {section.required ? '*' : ''}
                </option>
              ))}
            </select>
            
            <div className="w-px h-4 bg-white/10" />
            
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setShowToolbar(!showToolbar)}
                className="p-1 text-gray-400 hover:text-white rounded transition-colors"
                title="Toggle Toolbar"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button className="p-1 text-gray-400 hover:text-white rounded transition-colors" title="Search">
                <Search className="w-4 h-4" />
              </button>
              <button className="p-1 text-gray-400 hover:text-white rounded transition-colors" title="Filter">
                <Filter className="w-4 h-4" />
              </button>
            </div>

            {showToolbar && (
              <>
                <div className="w-px h-4 bg-white/10" />
                
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => insertText('**bold text**')}
                    className="p-1 text-gray-400 hover:text-white rounded transition-colors"
                    title="Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => insertText('*italic text*')}
                    className="p-1 text-gray-400 hover:text-white rounded transition-colors"
                    title="Italic"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => insertText('[link text](url)')}
                    className="p-1 text-gray-400 hover:text-white rounded transition-colors"
                    title="Link"
                  >
                    <Link className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => insertText('\n- List item\n')}
                    className="p-1 text-gray-400 hover:text-white rounded transition-colors"
                    title="Bullet List"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => insertText('\n1. Numbered item\n')}
                    className="p-1 text-gray-400 hover:text-white rounded transition-colors"
                    title="Numbered List"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </button>
                </div>

                <div className="w-px h-4 bg-white/10" />

                <div className="relative">
                  <select
                    onChange={(e) => e.target.value && insertClause(e.target.value)}
                    value=""
                    className="bg-slate-700 border border-white/10 rounded px-2 py-1 text-sm text-gray-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Insert Clause...</option>
                    <option value="issue">Issue Statement</option>
                    <option value="evidence-lead">Evidence Lead-in</option>
                    <option value="insanity-not">Insanity - Not at Issue</option>
                    <option value="insanity-applies">Insanity - Applies</option>
                    <option value="compelling">Compelling Circumstances</option>
                    <option value="bar-met">Bar Met</option>
                    <option value="healthcare">Healthcare Eligibility</option>
                    <option value="decision">Decision Statement</option>
                    <option value="favorable">Favorable Findings</option>
                  </select>
                </div>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className={`w-2 h-2 rounded-full ${getCompletionPercentage() > 50 ? 'bg-green-500' : 'bg-amber-500'}`} />
              <span>{getCompletionPercentage()}% Complete</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>Lines: {content.split('\n').length}</span>
              <span>•</span>
              <span>Words: {content.split(/\s+/).filter(w => w).length}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Editor */}
      <div className="flex-1 p-6">
        <div className="h-full bg-slate-800/30 border border-white/10 rounded-lg overflow-hidden">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            className={`w-full h-full bg-transparent text-gray-200 p-6 resize-none outline-none font-mono text-sm leading-relaxed ${
              settings.wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre'
            }`}
            placeholder="Begin drafting your character of discharge determination...

Use the toolbar above to insert standard clauses and format your document.
The system will automatically check for completeness and compliance."
            spellCheck={false}
          />
          
          {/* Line numbers (if enabled) */}
          {settings.showLineNumbers && (
            <div className="absolute left-0 top-0 w-12 h-full bg-slate-800/50 border-r border-white/10 p-6 text-xs text-gray-500 font-mono leading-relaxed pointer-events-none">
              {content.split('\n').map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
