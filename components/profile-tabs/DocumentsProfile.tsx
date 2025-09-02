'use client';

import React, { useState } from 'react';
import { VeteranProfileEnhanced } from '@/lib/veteran-profile-enhanced';
import { FileText, Download, Eye, Upload, Search, Filter, Folder, File, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import DocumentViewer from '../DocumentViewer';

interface DocumentsProfileProps {
  veteran: VeteranProfileEnhanced;
}

export default function DocumentsProfile({ veteran }: DocumentsProfileProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const categories = ['All', 'Service', 'Medical', 'Benefits', 'Claims', 'Other'];
  
  const filteredDocuments = veteran.documents.filter(doc => {
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Service': return 'bg-blue-500/20 text-blue-400';
      case 'Medical': return 'bg-red-500/20 text-red-400';
      case 'Benefits': return 'bg-green-500/20 text-green-400';
      case 'Claims': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('DD-214')) return '🎖️';
    if (type.includes('Medical')) return '🏥';
    if (type.includes('Award')) return '🏅';
    if (type.includes('VA Form')) return '📋';
    return '📄';
  };

  return (
    <div className="space-y-6">
      {/* Documents Overview */}
      <div className="bg-gradient-to-br from-skinz-bg-secondary to-skinz-bg-tertiary backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-skinz-accent to-skinz-primary rounded-lg flex items-center justify-center">
              <Folder className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Document Library</h3>
          </div>
          <button className="flex items-center gap-2 bg-skinz-accent/20 text-skinz-accent px-4 py-2 rounded-lg hover:bg-skinz-accent/30 transition-colors">
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.slice(1).map(category => {
            const count = veteran.documents.filter(d => d.category === category).length;
            return (
              <div key={category} className="bg-skinz-bg-primary/50 rounded-lg p-4 text-center">
                <p className="text-skinz-text-secondary text-sm mb-1">{category}</p>
                <p className="text-white font-bold text-2xl">{count}</p>
                <p className="text-skinz-text-secondary text-xs mt-1">documents</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-4 border border-skinz-border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-skinz-text-secondary" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-skinz-bg-tertiary/50 text-white placeholder-skinz-text-secondary rounded-lg pl-10 pr-4 py-2 border border-skinz-border focus:border-skinz-accent focus:outline-none"
            />
          </div>
          
          <div className="flex gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-skinz-accent text-white'
                    : 'bg-skinz-bg-tertiary/50 text-skinz-text-secondary hover:bg-skinz-bg-tertiary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((doc, index) => (
          <div key={index} className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-4 border border-skinz-border hover:border-skinz-accent/50 transition-all">
            <div className="flex items-start gap-3">
              <div className="text-2xl">{getFileIcon(doc.type)}</div>
              <div className="flex-1">
                <p className="text-white font-medium mb-1 line-clamp-1">{doc.name}</p>
                <p className="text-skinz-text-secondary text-sm mb-2">{doc.type}</p>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(doc.category)}`}>
                    {doc.category}
                  </span>
                  <span className="text-skinz-text-secondary text-xs">{doc.size}</span>
                </div>
                
                <p className="text-skinz-text-secondary text-xs mb-3">
                  Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                </p>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setSelectedDocument(doc);
                      setIsViewerOpen(true);
                    }}
                    className="flex items-center gap-1 text-xs bg-skinz-accent/20 text-skinz-accent px-3 py-1 rounded hover:bg-skinz-accent/30 transition-colors">
                    <Eye className="w-3 h-3" />
                    View
                  </button>
                  <button className="flex items-center gap-1 text-xs bg-skinz-bg-tertiary text-skinz-text-secondary px-3 py-1 rounded hover:bg-skinz-bg-primary transition-colors">
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Recent Document Activity</h3>
        </div>
        
        <div className="space-y-3">
          {veteran.documents.slice(0, 5).map((doc, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-skinz-bg-tertiary/30 rounded-lg">
              <div className="text-lg">{getFileIcon(doc.type)}</div>
              <div className="flex-1">
                <p className="text-white text-sm">{doc.name}</p>
                <p className="text-skinz-text-secondary text-xs">
                  Uploaded on {new Date(doc.uploadDate).toLocaleDateString()}
                </p>
              </div>
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Document Viewer Modal */}
      {selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          isOpen={isViewerOpen}
          onClose={() => {
            setIsViewerOpen(false);
            setSelectedDocument(null);
          }}
        />
      )}
    </div>
  );
}