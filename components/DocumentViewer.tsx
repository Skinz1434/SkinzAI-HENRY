'use client';

import React from 'react';
import { X, Download, Printer, Share2, ZoomIn, ZoomOut, RotateCw, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

interface DocumentViewerProps {
  document: {
    id: string;
    name: string;
    type: string;
    category: string;
    size: string;
    uploadDate: Date;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function DocumentViewer({ document, isOpen, onClose }: DocumentViewerProps) {
  const [zoom, setZoom] = React.useState(100);
  const [rotation, setRotation] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.floor(Math.random() * 10) + 5; // Mock page count

  if (!isOpen) return null;

  const handleZoomIn = () => setZoom(Math.min(zoom + 25, 200));
  const handleZoomOut = () => setZoom(Math.max(zoom - 25, 50));
  const handleRotate = () => setRotation((rotation + 90) % 360);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Document Viewer */}
      <div className="relative w-[90vw] h-[90vh] bg-skinz-bg-secondary rounded-xl border border-skinz-border overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-skinz-bg-tertiary border-b border-skinz-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-skinz-accent" />
            <div>
              <h3 className="text-white font-semibold">{document.name}</h3>
              <p className="text-skinz-text-secondary text-sm">
                {document.type} • {document.size} • Page {currentPage} of {totalPages}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <button
              onClick={handleZoomOut}
              className="p-2 bg-skinz-bg-secondary rounded-lg hover:bg-skinz-bg-primary transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 text-skinz-text-secondary" />
            </button>
            <span className="text-skinz-text-secondary text-sm w-12 text-center">{zoom}%</span>
            <button
              onClick={handleZoomIn}
              className="p-2 bg-skinz-bg-secondary rounded-lg hover:bg-skinz-bg-primary transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 text-skinz-text-secondary" />
            </button>
            
            <div className="w-px h-6 bg-skinz-border mx-2" />
            
            {/* Rotate */}
            <button
              onClick={handleRotate}
              className="p-2 bg-skinz-bg-secondary rounded-lg hover:bg-skinz-bg-primary transition-colors"
              title="Rotate"
            >
              <RotateCw className="w-4 h-4 text-skinz-text-secondary" />
            </button>
            
            <div className="w-px h-6 bg-skinz-border mx-2" />
            
            {/* Actions */}
            <button
              className="p-2 bg-skinz-bg-secondary rounded-lg hover:bg-skinz-bg-primary transition-colors"
              title="Print"
            >
              <Printer className="w-4 h-4 text-skinz-text-secondary" />
            </button>
            <button
              className="p-2 bg-skinz-bg-secondary rounded-lg hover:bg-skinz-bg-primary transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4 text-skinz-text-secondary" />
            </button>
            <button
              className="p-2 bg-skinz-bg-secondary rounded-lg hover:bg-skinz-bg-primary transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4 text-skinz-text-secondary" />
            </button>
            
            <div className="w-px h-6 bg-skinz-border mx-2" />
            
            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>
        
        {/* Document Content Area */}
        <div className="flex-1 overflow-auto bg-gray-100 p-8">
          <div 
            className="mx-auto bg-white shadow-2xl transition-transform"
            style={{
              width: `${8.5 * (zoom / 100)}in`,
              minHeight: `${11 * (zoom / 100)}in`,
              transform: `rotate(${rotation}deg)`,
              transformOrigin: 'center center'
            }}
          >
            {/* Mock Document Content */}
            <div className="p-12">
              <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{document.type}</h1>
                <p className="text-gray-600">Official Department of Veterans Affairs Document</p>
                <div className="mt-4 w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-400">VA SEAL</span>
                </div>
              </div>
              
              <div className="space-y-6 text-gray-700">
                <div>
                  <h2 className="font-bold text-lg mb-2">Document Information</h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Document ID:</span> {document.id}
                    </div>
                    <div>
                      <span className="font-semibold">Category:</span> {document.category}
                    </div>
                    <div>
                      <span className="font-semibold">Upload Date:</span> {new Date(document.uploadDate).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-semibold">File Size:</span> {document.size}
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h2 className="font-bold text-lg mb-2">Content Preview</h2>
                  <div className="space-y-4">
                    {Array.from({ length: 15 }, (_, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-20 h-3 bg-gray-200 rounded" />
                        <div className="flex-1 h-3 bg-gray-100 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t text-center text-xs text-gray-500">
                  This is a mock preview. In production, actual PDF content would be displayed here.
                  <br />
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer with Page Navigation */}
        <div className="bg-skinz-bg-tertiary border-t border-skinz-border p-3 flex items-center justify-center gap-4">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 bg-skinz-bg-secondary rounded-lg hover:bg-skinz-bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 text-skinz-text-secondary" />
          </button>
          
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={currentPage}
              onChange={(e) => setCurrentPage(Math.min(totalPages, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-16 bg-skinz-bg-secondary text-white text-center rounded px-2 py-1 border border-skinz-border"
              min={1}
              max={totalPages}
            />
            <span className="text-skinz-text-secondary">/ {totalPages}</span>
          </div>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 bg-skinz-bg-secondary rounded-lg hover:bg-skinz-bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4 text-skinz-text-secondary" />
          </button>
        </div>
      </div>
    </div>
  );
}