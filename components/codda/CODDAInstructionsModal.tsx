'use client';

import React, { useState } from 'react';
import { 
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Book,
  FileText,
  Users,
  Brain,
  Shield,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Target,
  Zap,
  Star,
  Award,
  HelpCircle,
  Video,
  Download,
  ExternalLink,
  Mouse,
  Keyboard,
  Eye,
  Edit,
  Save,
  Upload,
  MessageSquare,
  Search,
  Filter,
  Settings,
  RefreshCw
} from 'lucide-react';
import Modal from './ui/Modal';

interface CODDAInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  image?: string;
  actions?: Array<{
    label: string;
    description: string;
    icon: React.ReactNode;
  }>;
  tips?: string[];
}

export default function CODDAInstructionsModal({ isOpen, onClose }: CODDAInstructionsModalProps) {
  const [currentSection, setCurrentSection] = useState('overview');
  const [currentStep, setCurrentStep] = useState(0);
  const [showInteractiveTour, setShowInteractiveTour] = useState(false);

  const sections = [
    { id: 'overview', label: 'Overview', icon: Book },
    { id: 'getting-started', label: 'Getting Started', icon: Play },
    { id: 'navigation', label: 'Navigation', icon: Mouse },
    { id: 'document-editor', label: 'Document Editor', icon: Edit },
    { id: 'insights-panel', label: 'Insights Panel', icon: Brain },
    { id: 'collaboration', label: 'Collaboration', icon: Users },
    { id: 'quality-assurance', label: 'Quality Assurance', icon: Shield },
    { id: 'export-sharing', label: 'Export & Sharing', icon: Upload },
    { id: 'tips-tricks', label: 'Tips & Tricks', icon: Lightbulb },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: HelpCircle }
  ];

  const tutorialSteps: Record<string, TutorialStep[]> = {
    'getting-started': [
      {
        id: 'step-1',
        title: 'Welcome to CODDA',
        content: 'CODDA (Character of Discharge Determination Assistant) is an AI-powered tool designed to help you efficiently process character of discharge determinations with comprehensive guidance and quality assurance.',
        actions: [
          {
            label: 'Select a Case',
            description: 'Choose from existing cases or create a new determination',
            icon: <FileText className="w-4 h-4" />
          },
          {
            label: 'Review Case Details',
            description: 'Examine veteran information, service history, and existing evidence',
            icon: <Eye className="w-4 h-4" />
          }
        ],
        tips: [
          'Start with the case overview to understand the veteran\'s service history',
          'Check for any existing determinations or related cases'
        ]
      },
      {
        id: 'step-2',
        title: 'Understanding the Interface',
        content: 'CODDA uses a three-panel layout: Navigator (left), Document Editor (center), and Insights Panel (right). Each panel serves a specific purpose in the determination process.',
        actions: [
          {
            label: 'Navigator Panel',
            description: 'Case management, section navigation, and progress tracking',
            icon: <Mouse className="w-4 h-4" />
          },
          {
            label: 'Document Editor',
            description: 'MS Word-style editor for drafting your determination',
            icon: <Edit className="w-4 h-4" />
          },
          {
            label: 'Insights Panel',
            description: 'AI assistance, regulations, evidence analysis, and QBit chat',
            icon: <Brain className="w-4 h-4" />
          }
        ]
      },
      {
        id: 'step-3',
        title: 'Starting Your First Case',
        content: 'Begin by selecting a case from the navigator, reviewing the evidence, and using QBit to understand applicable regulations and requirements.',
        actions: [
          {
            label: 'Evidence Review',
            description: 'Examine all available evidence and identify gaps',
            icon: <Search className="w-4 h-4" />
          },
          {
            label: 'Regulation Analysis',
            description: 'Review applicable CFR sections and legal requirements',
            icon: <Book className="w-4 h-4" />
          },
          {
            label: 'Begin Drafting',
            description: 'Use templates and AI assistance to start your determination',
            icon: <Edit className="w-4 h-4" />
          }
        ]
      }
    ],
    'navigation': [
      {
        id: 'nav-1',
        title: 'Case Navigator',
        content: 'The left panel provides hierarchical navigation through all your cases, sections, and tasks. Use it to switch between cases, jump to specific sections, and track progress.',
        actions: [
          {
            label: 'Switch Cases',
            description: 'Click "Switch Case" button to select from available cases',
            icon: <FileText className="w-4 h-4" />
          },
          {
            label: 'Section Navigation',
            description: 'Click on document sections to jump directly to them in the editor',
            icon: <ArrowRight className="w-4 h-4" />
          },
          {
            label: 'Progress Tracking',
            description: 'Visual indicators show completion status for each section',
            icon: <CheckCircle className="w-4 h-4" />
          }
        ],
        tips: [
          'Use the search bar to quickly find specific cases or sections',
          'Favorite frequently used items with the star icon',
          'Expand/collapse sections to focus on what you need'
        ]
      },
      {
        id: 'nav-2',
        title: 'Search and Filtering',
        content: 'Use the search functionality to quickly locate cases, sections, or specific content. Filters help you focus on specific types of items or statuses.',
        actions: [
          {
            label: 'Quick Search',
            description: 'Type in the search box to find cases, sections, or content',
            icon: <Search className="w-4 h-4" />
          },
          {
            label: 'Status Filters',
            description: 'Filter by completion status, priority, or assignment',
            icon: <Filter className="w-4 h-4" />
          }
        ]
      }
    ],
    'document-editor': [
      {
        id: 'editor-1',
        title: 'MS Word-Style Editor',
        content: 'The document editor provides a full-featured, MS Word-like experience with professional formatting, zoom controls, and real-time collaboration features.',
        actions: [
          {
            label: 'Formatting Tools',
            description: 'Bold, italic, underline, alignment, lists, and more',
            icon: <Edit className="w-4 h-4" />
          },
          {
            label: 'Zoom Controls',
            description: 'Adjust zoom level from 50% to 200% for comfortable editing',
            icon: <Eye className="w-4 h-4" />
          },
          {
            label: 'Page Layout',
            description: 'Professional page layout with margins, headers, and footers',
            icon: <FileText className="w-4 h-4" />
          }
        ],
        tips: [
          'Use Ctrl+S to save your work',
          'The ruler helps with precise formatting',
          'Toggle fullscreen mode for distraction-free editing'
        ]
      },
      {
        id: 'editor-2',
        title: 'Templates and Clauses',
        content: 'CODDA provides pre-built templates and legal clauses to ensure consistency and compliance. Use the clause library to insert standard language.',
        actions: [
          {
            label: 'Insert Clauses',
            description: 'Choose from pre-approved legal language templates',
            icon: <Book className="w-4 h-4" />
          },
          {
            label: 'Auto-formatting',
            description: 'Automatic formatting for legal documents and citations',
            icon: <Settings className="w-4 h-4" />
          }
        ]
      },
      {
        id: 'editor-3',
        title: 'Quality Assurance',
        content: 'Built-in quality checks ensure your document meets all requirements. Real-time feedback helps you maintain compliance and consistency.',
        actions: [
          {
            label: 'Grammar Check',
            description: 'Real-time grammar and spell checking',
            icon: <CheckCircle className="w-4 h-4" />
          },
          {
            label: 'Compliance Check',
            description: 'Automatic verification of required sections and content',
            icon: <Shield className="w-4 h-4" />
          },
          {
            label: 'Bias Detection',
            description: 'AI-powered bias detection and neutral language suggestions',
            icon: <Brain className="w-4 h-4" />
          }
        ]
      }
    ],
    'insights-panel': [
      {
        id: 'insights-1',
        title: 'AI-Powered Insights',
        content: 'The right panel provides intelligent assistance through four main tabs: Insights, Evidence, Bias Guard, and QBit Chat.',
        actions: [
          {
            label: 'Regulation Insights',
            description: 'Contextual regulation analysis and applicable CFR sections',
            icon: <Book className="w-4 h-4" />
          },
          {
            label: 'Evidence Analysis',
            description: 'Comprehensive evidence review and gap identification',
            icon: <Search className="w-4 h-4" />
          },
          {
            label: 'Bias Guard',
            description: 'Real-time bias detection and writing quality assessment',
            icon: <Shield className="w-4 h-4" />
          },
          {
            label: 'QBit Assistant',
            description: 'AI chat assistant specialized in COD determinations',
            icon: <MessageSquare className="w-4 h-4" />
          }
        ]
      },
      {
        id: 'insights-2',
        title: 'Using QBit Effectively',
        content: 'QBit is your AI assistant specialized in character of discharge determinations. Ask specific questions about regulations, evidence analysis, or decision drafting.',
        actions: [
          {
            label: 'Ask Specific Questions',
            description: 'Get detailed answers about regulations and procedures',
            icon: <HelpCircle className="w-4 h-4" />
          },
          {
            label: 'Request Analysis',
            description: 'Ask for evidence analysis or case-specific guidance',
            icon: <Brain className="w-4 h-4" />
          },
          {
            label: 'Draft Assistance',
            description: 'Get help with specific sections or language suggestions',
            icon: <Edit className="w-4 h-4" />
          }
        ],
        tips: [
          'Be specific in your questions for better responses',
          'Ask about applicable regulations for your specific case type',
          'Request help with evidence gaps or missing documentation'
        ]
      }
    ],
    'collaboration': [
      {
        id: 'collab-1',
        title: 'Team Collaboration',
        content: 'CODDA supports full team collaboration with real-time sharing, review workflows, and Microsoft integration.',
        actions: [
          {
            label: 'Send for Review',
            description: 'Share documents with team members for review and approval',
            icon: <Users className="w-4 h-4" />
          },
          {
            label: 'Outlook Integration',
            description: 'Automatic email notifications and review requests',
            icon: <MessageSquare className="w-4 h-4" />
          },
          {
            label: 'Teams Integration',
            description: 'Notifications and collaboration through Microsoft Teams',
            icon: <Users className="w-4 h-4" />
          }
        ]
      },
      {
        id: 'collab-2',
        title: 'Review Workflows',
        content: 'Set up automated review workflows with deadlines, escalation rules, and approval chains.',
        actions: [
          {
            label: 'Create Workflow',
            description: 'Define review steps and approval requirements',
            icon: <ArrowRight className="w-4 h-4" />
          },
          {
            label: 'Track Progress',
            description: 'Monitor review status and pending approvals',
            icon: <CheckCircle className="w-4 h-4" />
          }
        ]
      }
    ],
    'export-sharing': [
      {
        id: 'export-1',
        title: 'Professional Export Options',
        content: 'Export your determinations in multiple formats with digital signatures and automated routing capabilities.',
        actions: [
          {
            label: 'PDF Export',
            description: 'Generate official PDF with digital signature support',
            icon: <Download className="w-4 h-4" />
          },
          {
            label: 'Word Export',
            description: 'Export as editable Word document for further collaboration',
            icon: <FileText className="w-4 h-4" />
          },
          {
            label: 'Digital Signatures',
            description: 'Add secure digital signatures with certificate validation',
            icon: <Award className="w-4 h-4" />
          }
        ]
      }
    ]
  };

  const keyboardShortcuts = [
    { keys: 'Ctrl + S', action: 'Save document' },
    { keys: 'Ctrl + Z', action: 'Undo' },
    { keys: 'Ctrl + Y', action: 'Redo' },
    { keys: 'Ctrl + B', action: 'Bold text' },
    { keys: 'Ctrl + I', action: 'Italic text' },
    { keys: 'Ctrl + U', action: 'Underline text' },
    { keys: 'Ctrl + F', action: 'Find and replace' },
    { keys: 'F11', action: 'Toggle fullscreen' },
    { keys: 'Ctrl + +', action: 'Zoom in' },
    { keys: 'Ctrl + -', action: 'Zoom out' }
  ];

  const renderSectionContent = () => {
    switch (currentSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to CODDA</h2>
              <p className="text-gray-600 text-lg">Character of Discharge Determination Assistant</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">What is CODDA?</h3>
              <p className="text-blue-800 mb-4">
                CODDA is an AI-powered, IDE-style workspace designed to streamline the character of discharge determination process. 
                It provides comprehensive guidance, quality assurance, and collaboration tools to ensure accurate and compliant decisions.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-800">AI-Powered</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    QBit AI assistant provides contextual guidance and regulation analysis
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-gray-800">Quality Assured</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Built-in quality checks and bias detection ensure compliance
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-800">Collaborative</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Team collaboration with Outlook and Teams integration
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-amber-600" />
                    <h4 className="font-semibold text-gray-800">Professional</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    MS Word-style editor with official formatting and export options
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Key Benefits</h3>
              <ul className="space-y-2">
                {[
                  'Reduce determination time by 60% with AI assistance',
                  'Ensure regulatory compliance with built-in quality checks',
                  'Improve decision consistency with standardized templates',
                  'Enhance collaboration with integrated review workflows',
                  'Maintain audit trails with comprehensive documentation'
                ].map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'getting-started':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Getting Started Tutorial</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-600">
                  {currentStep + 1} of {tutorialSteps['getting-started'].length}
                </span>
                <button
                  onClick={() => setCurrentStep(Math.min(tutorialSteps['getting-started'].length - 1, currentStep + 1))}
                  disabled={currentStep === tutorialSteps['getting-started'].length - 1}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {tutorialSteps['getting-started'][currentStep] && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {tutorialSteps['getting-started'][currentStep].title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {tutorialSteps['getting-started'][currentStep].content}
                  </p>
                  
                  {tutorialSteps['getting-started'][currentStep].actions && (
                    <div className="space-y-3 mb-4">
                      <h4 className="font-medium text-gray-800">Action Steps:</h4>
                      {tutorialSteps['getting-started'][currentStep].actions!.map((action, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="p-2 bg-white rounded-lg border border-gray-200">
                            {action.icon}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{action.label}</div>
                            <div className="text-sm text-gray-600">{action.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {tutorialSteps['getting-started'][currentStep].tips && (
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-amber-600" />
                        <span className="font-medium text-amber-800">Pro Tips</span>
                      </div>
                      <ul className="space-y-1">
                        {tutorialSteps['getting-started'][currentStep].tips!.map((tip, idx) => (
                          <li key={idx} className="text-sm text-amber-700 flex items-start gap-2">
                            <Star className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowInteractiveTour(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Play className="w-4 h-4" />
                Start Interactive Tour
              </button>
              
              <div className="text-sm text-gray-500">
                Complete the tutorial to unlock advanced features
              </div>
            </div>
          </div>
        );

      case 'tips-tricks':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Tips & Tricks</h2>
            
            {/* Keyboard Shortcuts */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Keyboard className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">Keyboard Shortcuts</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {keyboardShortcuts.map((shortcut, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                    <span className="text-sm text-gray-600">{shortcut.action}</span>
                    <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 border border-gray-300 rounded">
                      {shortcut.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Best Practices */}
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-green-900">Best Practices</h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Always run evidence gap scan before drafting your decision',
                  'Use QBit to verify applicable regulations for each case type',
                  'Run bias analysis before finalizing your determination',
                  'Save frequently using Ctrl+S or enable auto-save',
                  'Review quality checklist before submitting for approval',
                  'Use templates and clauses for consistency across determinations'
                ].map((practice, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{practice}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Hidden Features */}
            <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-purple-900">Hidden Features</h3>
              </div>
              <div className="space-y-3">
                {[
                  { feature: 'Quick Section Jump', description: 'Double-click any section in the navigator to jump directly to it in the editor' },
                  { feature: 'Smart Clause Suggestions', description: 'QBit automatically suggests relevant clauses based on your case context' },
                  { feature: 'Bulk Evidence Import', description: 'Drag and drop multiple files to import evidence items at once' },
                  { feature: 'Custom Templates', description: 'Create and save your own clause templates for frequently used language' },
                  { feature: 'Advanced Search', description: 'Use regex patterns in the search box for complex queries' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-white rounded border border-purple-100">
                    <div className="font-medium text-purple-900">{item.feature}</div>
                    <div className="text-sm text-purple-700">{item.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        if (tutorialSteps[currentSection]) {
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 capitalize">
                {currentSection.replace('-', ' ')}
              </h2>
              
              {tutorialSteps[currentSection].map((step, idx) => (
                <div key={step.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">{step.title}</h3>
                    <p className="text-gray-600 mb-4">{step.content}</p>
                    
                    {step.actions && (
                      <div className="space-y-3 mb-4">
                        <h4 className="font-medium text-gray-800">Key Actions:</h4>
                        <div className="grid grid-cols-1 gap-3">
                          {step.actions.map((action, actionIdx) => (
                            <div key={actionIdx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className="p-2 bg-white rounded-lg border border-gray-200">
                                {action.icon}
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">{action.label}</div>
                                <div className="text-sm text-gray-600">{action.description}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {step.tips && (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-800">Tips</span>
                        </div>
                        <ul className="space-y-1">
                          {step.tips.map((tip, tipIdx) => (
                            <li key={tipIdx} className="text-sm text-blue-700 flex items-start gap-2">
                              <Star className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        }
        return <div>Content for {currentSection}</div>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="CODDA Instructions & Tutorial"
      size="full"
      showCloseButton={true}
    >
      <div className="flex h-[80vh]">
        {/* Sidebar Navigation */}
        <div className="w-64 border-r border-gray-200 bg-gray-50 p-4">
          <div className="space-y-2">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => {
                  setCurrentSection(section.id);
                  setCurrentStep(0);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  currentSection === section.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <section.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{section.label}</span>
              </button>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Video className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Video Tutorials</span>
            </div>
            <p className="text-xs text-blue-700 mb-3">
              Watch comprehensive video guides for each feature
            </p>
            <button className="w-full px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
              View Videos
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {renderSectionContent()}
        </div>
      </div>
      
      {/* Footer */}
      <div className="border-t border-gray-200 p-4 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowInteractiveTour(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Play className="w-4 h-4" />
            Interactive Tour
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Download Guide
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <ExternalLink className="w-4 h-4" />
            Online Help
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          Need help? Contact support or use QBit for assistance
        </div>
      </div>
    </Modal>
  );
}
