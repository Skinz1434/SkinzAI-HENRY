'use client';

import React, { useState } from 'react';
import { 
  Download, FileText, Send, Printer, Mail, 
  CheckCircle, AlertCircle, Info, Package,
  FileDown, Share2, Copy, ExternalLink, Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ExportViewProps {
  analysisData: any;
  veteranData: any;
  documents: any[];
}

export default function ExportView({ analysisData, veteranData, documents }: ExportViewProps) {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'json' | 'csv'>('pdf');
  const [exportType, setExportType] = useState<'full' | 'summary' | 'examiner' | 'veteran'>('full');
  const [includeOptions, setIncludeOptions] = useState({
    analysis: true,
    documents: true,
    timeline: true,
    recommendations: true,
    evidence: true,
    annotations: true
  });
  const [exportStatus, setExportStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handleExport = async () => {
    setExportStatus('processing');
    
    // Simulate export process
    setTimeout(() => {
      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 3000);
    }, 2000);
  };

  const exportTemplates = [
    {
      id: 'full',
      name: 'Full Report',
      description: 'Complete analysis with all evidence and recommendations',
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      id: 'summary',
      name: 'Executive Summary',
      description: 'High-level overview for quick review',
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      id: 'examiner',
      name: 'C&P Examiner Report',
      description: 'Formatted for VA medical examiners',
      icon: Shield,
      color: 'bg-purple-500'
    },
    {
      id: 'veteran',
      name: 'Veteran Copy',
      description: 'Simplified version with plain language',
      icon: FileDown,
      color: 'bg-orange-500'
    }
  ];

  const shareOptions = [
    {
      id: 'vbms',
      name: 'Upload to VBMS',
      description: 'Direct upload to VA system',
      icon: Send,
      available: true
    },
    {
      id: 'email',
      name: 'Email Report',
      description: 'Send via secure email',
      icon: Mail,
      available: true
    },
    {
      id: 'print',
      name: 'Print Report',
      description: 'Print physical copy',
      icon: Printer,
      available: true
    },
    {
      id: 'share',
      name: 'Share Link',
      description: 'Generate secure sharing link',
      icon: Share2,
      available: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Export Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Export & Share Analysis</h2>
        <p className="text-green-100">
          Generate comprehensive reports for {veteranData?.name || 'Veteran'}'s claim
        </p>
      </div>

      {/* Report Templates */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Select Report Template</h3>
        <div className="grid grid-cols-2 gap-4">
          {exportTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => setExportType(template.id as any)}
              className={`p-4 rounded-lg border-2 transition-all ${
                exportType === template.id
                  ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${template.color} bg-opacity-20`}>
                  <template.icon className={`w-6 h-6 text-white`} />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-white mb-1">{template.name}</h4>
                  <p className="text-gray-400 text-sm">{template.description}</p>
                </div>
                {exportType === template.id && (
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-2 gap-6">
        {/* Format Selection */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Export Format</h3>
          <div className="space-y-3">
            {[
              { id: 'pdf', name: 'PDF Document', desc: 'Best for printing and archiving' },
              { id: 'json', name: 'JSON Data', desc: 'For system integration' },
              { id: 'csv', name: 'CSV Spreadsheet', desc: 'For data analysis' }
            ].map((format) => (
              <label
                key={format.id}
                className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-650 transition-colors"
              >
                <input
                  type="radio"
                  name="format"
                  value={format.id}
                  checked={exportFormat === format.id}
                  onChange={(e) => setExportFormat(e.target.value as any)}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <p className="text-white font-medium">{format.name}</p>
                  <p className="text-gray-400 text-sm">{format.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Include Options */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Include in Export</h3>
          <div className="space-y-3">
            {Object.entries(includeOptions).map(([key, value]) => (
              <label
                key={key}
                className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-650 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setIncludeOptions({
                    ...includeOptions,
                    [key]: e.target.checked
                  })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-white capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Report Preview</h3>
        <div className="bg-gray-900 rounded-lg p-6 space-y-4">
          <div className="border-b border-gray-700 pb-4">
            <h4 className="text-lg font-semibold text-white mb-2">
              VA Disability Claim Analysis Report
            </h4>
            <p className="text-gray-400 text-sm">
              Generated: {new Date().toLocaleDateString()} | 
              Claim #: {veteranData?.claimNumber || '12345678'} | 
              Veteran: {veteranData?.name || 'John Doe'}
            </p>
          </div>

          {includeOptions.analysis && (
            <div className="space-y-2">
              <h5 className="font-semibold text-white">Analysis Summary</h5>
              <p className="text-gray-400 text-sm">
                Overall claim strength: {analysisData?.overallScore}% | 
                Conditions identified: {analysisData?.conditions?.length || 0} | 
                Service-connected: {analysisData?.conditions?.filter((c: any) => c.serviceConnected).length || 0}
              </p>
            </div>
          )}

          {includeOptions.documents && (
            <div className="space-y-2">
              <h5 className="font-semibold text-white">Documents Included</h5>
              <p className="text-gray-400 text-sm">
                Total documents: {documents?.length || 0} | 
                Processed: {documents?.filter((d: any) => d.status === 'processed').length || 0}
              </p>
            </div>
          )}

          {includeOptions.recommendations && (
            <div className="space-y-2">
              <h5 className="font-semibold text-white">Key Recommendations</h5>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Obtain nexus letter for PTSD condition</li>
                <li>• Schedule C&P examination for back condition</li>
                <li>• Submit buddy statements for combat events</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Share Options */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Share & Distribution</h3>
        <div className="grid grid-cols-2 gap-4">
          {shareOptions.map((option) => (
            <button
              key={option.id}
              disabled={!option.available}
              className={`p-4 rounded-lg border transition-all ${
                option.available
                  ? 'border-gray-700 hover:border-gray-600 hover:bg-gray-750'
                  : 'border-gray-700 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3">
                <option.icon className={`w-6 h-6 ${option.available ? 'text-blue-400' : 'text-gray-500'}`} />
                <div className="flex-1 text-left">
                  <p className={`font-medium ${option.available ? 'text-white' : 'text-gray-500'}`}>
                    {option.name}
                  </p>
                  <p className="text-gray-400 text-sm">{option.description}</p>
                </div>
                {!option.available && (
                  <span className="text-xs text-gray-500">Coming Soon</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Export Actions */}
      <div className="flex items-center justify-between bg-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <Info className="w-5 h-5 text-blue-400" />
          <p className="text-gray-400">
            Report will be generated with {Object.values(includeOptions).filter(v => v).length} sections
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={handleExport}
            disabled={exportStatus === 'processing'}
            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              exportStatus === 'processing'
                ? 'bg-gray-600 text-gray-400 cursor-wait'
                : exportStatus === 'success'
                ? 'bg-green-600 text-white'
                : exportStatus === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {exportStatus === 'processing' && (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing...
              </>
            )}
            {exportStatus === 'success' && (
              <>
                <CheckCircle className="w-5 h-5" />
                Export Complete!
              </>
            )}
            {exportStatus === 'error' && (
              <>
                <AlertCircle className="w-5 h-5" />
                Export Failed
              </>
            )}
            {exportStatus === 'idle' && (
              <>
                <Download className="w-5 h-5" />
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Export Status */}
      {exportStatus === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500 bg-opacity-20 border border-green-500 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-white font-semibold">Report Generated Successfully</p>
                <p className="text-green-200 text-sm">
                  Your report has been saved and is ready for download
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </button>
              <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2">
                <Copy className="w-4 h-4" />
                Copy Link
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}