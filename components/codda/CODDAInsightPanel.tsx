'use client';

import React, { useState } from 'react';
import { 
  Brain,
  FileText,
  Shield,
  MessageSquare,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  BookOpen,
  Zap
} from 'lucide-react';
import { CODCase, ChatMessage, CODDASuggestion } from '@/types/codda';

interface CODDAInsightPanelProps {
  currentCase: CODCase;
  activeTab: 'insights' | 'evidence' | 'bias' | 'chat';
  onTabChange: (tab: 'insights' | 'evidence' | 'bias' | 'chat') => void;
}

export default function CODDAInsightPanel({ 
  currentCase, 
  activeTab, 
  onTabChange 
}: CODDAInsightPanelProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString(),
      context: {
        caseId: currentCase.id,
        section: 'general'
      }
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I understand you need assistance with the character of discharge determination. Based on the case details, I recommend starting with the evidence sweep to identify any gaps in the service record.',
        timestamp: new Date().toISOString(),
        context: {
          caseId: currentCase.id
        },
        suggestions: [
          {
            type: 'action',
            title: 'Run Evidence Gap Scan',
            content: 'Automatically detect missing evidence items'
          },
          {
            type: 'clause',
            title: 'Insert Issue Statement',
            content: 'Add standard issue template for COD determination'
          }
        ]
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const tabs = [
    { id: 'insights', label: 'Insights', icon: Brain },
    { id: 'evidence', label: 'Evidence', icon: FileText },
    { id: 'bias', label: 'Bias Guard', icon: Shield },
    { id: 'chat', label: 'QBit', icon: MessageSquare }
  ];

  return (
    <div className="w-96 border-l border-white/10 bg-slate-900/50 backdrop-blur-sm flex flex-col">
      {/* Tab Headers */}
      <div className="border-b border-white/10 bg-slate-800/50">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm transition-colors ${
                activeTab === tab.id 
                  ? 'bg-slate-700 text-cyan-400 border-b-2 border-cyan-400' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'insights' && (
          <div className="p-4 space-y-4">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-gray-200">Regulation Snippets</h3>
              </div>
              <div className="space-y-2 text-xs text-gray-400">
                <div className="p-2 bg-slate-700/50 rounded">
                  <div className="font-medium text-gray-300 mb-1">38 CFR 3.12(c)</div>
                  <div>Discharge under dishonorable conditions bars benefits except as provided...</div>
                  <button className="mt-1 text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    <span>View Full Text</span>
                  </button>
                </div>
                <div className="p-2 bg-slate-700/50 rounded">
                  <div className="font-medium text-gray-300 mb-1">38 CFR 3.354</div>
                  <div>Insanity during service - determination criteria...</div>
                  <button className="mt-1 text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    <span>View Full Text</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-gray-200">Rule Path Suggestions</h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-slate-700/50 rounded">
                  <div className="font-medium text-green-400 mb-1">Recommended: 3.12(d)</div>
                  <div className="text-gray-400 mb-2">Pattern of misconduct - OTH discharge</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-400">95% confidence</span>
                  </div>
                </div>
                <div className="p-2 bg-slate-700/50 rounded">
                  <div className="font-medium text-amber-400 mb-1">Consider: 3.354</div>
                  <div className="text-gray-400 mb-2">Insanity evaluation required</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-amber-400">65% confidence</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <h3 className="text-sm font-semibold text-gray-200">Quality Checklist</h3>
              </div>
              <div className="space-y-2 text-xs">
                {[
                  { label: 'Issue statement present', completed: false },
                  { label: 'Evidence considered', completed: false },
                  { label: 'Insanity addressed', completed: false },
                  { label: 'Healthcare eligibility', completed: false },
                  { label: 'Decision statement', completed: false }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-sm ${item.completed ? 'bg-green-500' : 'bg-gray-600'} flex items-center justify-center`}>
                      {item.completed && <CheckCircle className="w-2 h-2 text-white" />}
                    </div>
                    <span className={item.completed ? 'text-green-400' : 'text-gray-400'}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'evidence' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-200">Evidence Items</h3>
              <button className="p-1 text-gray-400 hover:text-white rounded">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="text-xs text-gray-400 text-center py-8">
                <FileText className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <div className="mb-2">No evidence items yet</div>
                <div>Run Evidence Gap Scan to detect missing items</div>
              </div>
            </div>
            
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-cyan-500/20 text-cyan-400 rounded-md hover:bg-cyan-500/30 transition-colors">
              <Search className="w-4 h-4" />
              <span>Run Gap Scan</span>
            </button>

            <div className="bg-slate-800/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-200 mb-2">Expected Evidence</h4>
              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span>Separation packet</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span>Service treatment records</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span>Personnel records</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span>Command statements</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'bias' && (
          <div className="p-4 space-y-4">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-green-400" />
                <h3 className="text-sm font-semibold text-gray-200">Bias Analysis</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Overall Score</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full bg-green-500 transition-all duration-300`} style={{ width: `${100 - currentCase.qa.biasScore}%` }} />
                    </div>
                    <span className="text-xs text-green-400">{100 - currentCase.qa.biasScore}/100</span>
                  </div>
                </div>
                
                <div className="text-xs text-gray-400">
                  {currentCase.qa.biasScore === 0 ? (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-3 h-3" />
                      <span>No bias issues detected</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-amber-400">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Issues found</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-200 mb-2">Writing Guidelines</h4>
              <div className="space-y-2 text-xs text-gray-400">
                <div>• Use neutral, objective language</div>
                <div>• Avoid conclusory statements</div>
                <div>• Consider all evidence fairly</div>
                <div>• Address counter-evidence</div>
                <div>• Use precise regulatory language</div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-200 mb-2">Flagged Phrases</h4>
              <div className="text-xs text-gray-400">
                <div className="text-center py-4">
                  No flagged phrases detected
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {chatMessages.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-400 mb-4">
                    Hi! I'm QBit, your CODDA assistant.
                  </div>
                  <div className="text-xs text-gray-500 mb-4">
                    Ask me anything about character of discharge determinations, regulations, or evidence requirements.
                  </div>
                  <div className="space-y-2">
                    <button 
                      onClick={() => setCurrentMessage("What evidence do I need for an OTH discharge determination?")}
                      className="block w-full text-left text-xs p-2 bg-slate-800/50 rounded hover:bg-slate-700/50 transition-colors text-gray-300"
                    >
                      What evidence do I need for an OTH discharge determination?
                    </button>
                    <button 
                      onClick={() => setCurrentMessage("Explain the insanity exception under 3.354")}
                      className="block w-full text-left text-xs p-2 bg-slate-800/50 rounded hover:bg-slate-700/50 transition-colors text-gray-300"
                    >
                      Explain the insanity exception under 3.354
                    </button>
                    <button 
                      onClick={() => setCurrentMessage("How do I structure the reasons and bases section?")}
                      className="block w-full text-left text-xs p-2 bg-slate-800/50 rounded hover:bg-slate-700/50 transition-colors text-gray-300"
                    >
                      How do I structure the reasons and bases section?
                    </button>
                  </div>
                </div>
              ) : (
                chatMessages.map(message => (
                  <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user' 
                        ? 'bg-cyan-500/20 text-cyan-100' 
                        : 'bg-slate-800/50 text-gray-200'
                    }`}>
                      <div className="text-sm">{message.content}</div>
                      {message.suggestions && (
                        <div className="mt-2 space-y-1">
                          {message.suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              className="block w-full text-left text-xs p-2 bg-white/5 rounded hover:bg-white/10 transition-colors"
                            >
                              {suggestion.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="border-t border-white/10 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask QBit for help..."
                  className="flex-1 bg-slate-800 border border-white/10 rounded px-3 py-2 text-sm text-gray-200 outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim()}
                  className="px-3 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
