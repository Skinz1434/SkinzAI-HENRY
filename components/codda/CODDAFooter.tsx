'use client';

import React from 'react';
import { 
  HelpCircle,
  Zap,
  Eye,
  CheckCircle,
  Upload,
  AlertTriangle,
  Clock,
  FileDown
} from 'lucide-react';
import { CODCase } from '@/types/codda';

interface CODDAFooterProps {
  currentCase: CODCase;
}

export default function CODDAFooter({ currentCase }: CODDAFooterProps) {
  const handleExplainPath = () => {
    // TODO: Implement explain path functionality
    console.log('Explain my path clicked');
  };

  const handleRunIPR = () => {
    // TODO: Implement IPR packager
    console.log('Run IPR Packager clicked');
  };

  const handlePreviewPDF = () => {
    // TODO: Implement PDF preview
    console.log('Preview PDF clicked');
  };

  const handleQAChecklist = () => {
    // TODO: Implement QA checklist
    console.log('QA Checklist clicked');
  };

  const handleUploadPackage = () => {
    // TODO: Implement upload package
    console.log('Upload Package clicked');
  };

  const getQAStatus = () => {
    const { qa } = currentCase;
    if (qa.completeness < 30) return { color: 'text-red-400', icon: AlertTriangle, label: 'Incomplete' };
    if (qa.completeness < 70) return { color: 'text-amber-400', icon: Clock, label: 'In Progress' };
    if (qa.completeness < 90) return { color: 'text-blue-400', icon: Eye, label: 'Review Ready' };
    return { color: 'text-green-400', icon: CheckCircle, label: 'Complete' };
  };

  const qaStatus = getQAStatus();
  const StatusIcon = qaStatus.icon;

  const canRunIPR = currentCase.ipr.required && currentCase.qa.completeness > 80;
  const canUpload = currentCase.qa.completeness > 90 && currentCase.qa.templateFidelity;

  return (
    <div className="border-t border-gray-200 bg-white shadow-sm px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <button 
            onClick={handleExplainPath}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Explain My Path</span>
          </button>
          
          <button 
            onClick={handleRunIPR}
            disabled={!canRunIPR}
            className={`flex items-center gap-2 px-2 py-1 rounded transition-colors ${
              canRunIPR 
                ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
            title={canRunIPR ? 'Run IPR Packager' : 'Complete draft before running IPR'}
          >
            <Zap className="w-4 h-4" />
            <span>Run IPR Packager</span>
          </button>
          
          <button 
            onClick={handlePreviewPDF}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Preview PDF</span>
          </button>

          <button 
            onClick={() => {}}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
          >
            <FileDown className="w-4 h-4" />
            <span>Export Draft</span>
          </button>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <StatusIcon className={`w-4 h-4 ${qaStatus.color.replace('text-', 'text-')}`} />
            <span className={qaStatus.color.replace('text-', 'text-')}>{qaStatus.label}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600 font-medium">{currentCase.qa.completeness}%</span>
          </div>

          {currentCase.qa.lintFlags.length > 0 && (
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
              <span>{currentCase.qa.lintFlags.length} issue{currentCase.qa.lintFlags.length !== 1 ? 's' : ''}</span>
            </div>
          )}

          <div className="w-px h-4 bg-gray-300" />
          
          <button 
            onClick={handleQAChecklist}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            <span>QA Checklist</span>
          </button>
          
          <button 
            onClick={handleUploadPackage}
            disabled={!canUpload}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
              canUpload
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            title={canUpload ? 'Upload to eFolder' : 'Complete QA checks before uploading'}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Package</span>
          </button>
        </div>
      </div>

      {/* Status Details */}
      {(currentCase.qa.lintFlags.length > 0 || currentCase.ipr.required) && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              {currentCase.qa.lintFlags.length > 0 && (
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Quality issues need attention</span>
                </div>
              )}
              
              {currentCase.ipr.required && (
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    currentCase.ipr.status === 'pending' ? 'bg-amber-500' :
                    currentCase.ipr.status === 'submitted' ? 'bg-blue-500' :
                    'bg-green-500'
                  }`} />
                  <span className="text-gray-600">
                    IPR {currentCase.ipr.status === 'pending' ? 'Required' : 
                         currentCase.ipr.status === 'submitted' ? 'Submitted' : 'Cleared'}
                  </span>
                  {currentCase.ipr.suspenseDate && (
                    <span className="text-gray-500">
                      • Due {new Date(currentCase.ipr.suspenseDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="text-gray-500">
              Last updated: {new Date(currentCase.updatedAt).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
