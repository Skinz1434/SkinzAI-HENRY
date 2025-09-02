'use client';

import React, { useState, useMemo } from 'react';
import { 
  FileText, Download, Eye, Trash2, Filter, Search, 
  Calendar, Tag, AlertCircle, CheckCircle, Clock,
  FileImage, FileHeart, Shield, Award, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  uploadDate: string;
  size: string;
  pages: number;
  status: 'processed' | 'processing' | 'error' | 'pending';
  confidence: number;
  extractedData?: {
    dates?: string[];
    conditions?: string[];
    providers?: string[];
    medications?: string[];
  };
  relevanceScore: number;
  flags?: string[];
}

interface DocumentsViewProps {
  documents: Document[];
  onViewDocument: (doc: Document) => void;
  onDeleteDocument: (id: string) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'Medical Records': <FileHeart className="w-5 h-5" />,
  'Service Records': <Shield className="w-5 h-5" />,
  'Nexus Letters': <FileText className="w-5 h-5" />,
  'DBQ Forms': <Award className="w-5 h-5" />,
  'Supporting Evidence': <FileImage className="w-5 h-5" />
};

const categoryColors: Record<string, string> = {
  'Medical Records': 'bg-blue-500',
  'Service Records': 'bg-green-500',
  'Nexus Letters': 'bg-purple-500',
  'DBQ Forms': 'bg-orange-500',
  'Supporting Evidence': 'bg-gray-500'
};

export default function DocumentsView({ documents, onViewDocument, onDeleteDocument }: DocumentsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'relevance' | 'name'>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(documents.map(doc => doc.category));
    return ['all', ...Array.from(cats)];
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    let filtered = documents;

    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.extractedData?.conditions?.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())) ||
        doc.extractedData?.providers?.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        case 'relevance':
          return b.relevanceScore - a.relevanceScore;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [documents, searchTerm, selectedCategory, sortBy]);

  const stats = useMemo(() => {
    return {
      total: documents.length,
      processed: documents.filter(d => d.status === 'processed').length,
      highRelevance: documents.filter(d => d.relevanceScore >= 80).length,
      flagged: documents.filter(d => d.flags && d.flags.length > 0).length
    };
  }, [documents]);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Documents</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-400 opacity-50" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Processed</p>
              <p className="text-2xl font-bold text-green-400">{stats.processed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400 opacity-50" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">High Relevance</p>
              <p className="text-2xl font-bold text-purple-400">{stats.highRelevance}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-purple-400 opacity-50" />
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Flagged</p>
              <p className="text-2xl font-bold text-orange-400">{stats.flagged}</p>
            </div>
            <Tag className="w-8 h-8 text-orange-400 opacity-50" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search documents, conditions, providers..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-gray-700"
            >
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="date">Upload Date</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredDocuments.map((doc) => (
          <motion.div
            key={doc.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition-colors cursor-pointer"
            onClick={() => setSelectedDocument(doc)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${categoryColors[doc.category]} bg-opacity-20`}>
                  {categoryIcons[doc.category] || <FileText className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{doc.name}</h3>
                  <p className="text-sm text-gray-400">{doc.category} • {doc.pages} pages • {doc.size}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {doc.status === 'processed' && (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                )}
                {doc.status === 'processing' && (
                  <Clock className="w-5 h-5 text-yellow-400 animate-pulse" />
                )}
                {doc.status === 'error' && (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
              </div>
            </div>

            {/* Relevance Score */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-400">Relevance Score</span>
                <span className={`font-semibold ${
                  doc.relevanceScore >= 80 ? 'text-green-400' :
                  doc.relevanceScore >= 60 ? 'text-yellow-400' : 'text-orange-400'
                }`}>
                  {doc.relevanceScore}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    doc.relevanceScore >= 80 ? 'bg-green-400' :
                    doc.relevanceScore >= 60 ? 'bg-yellow-400' : 'bg-orange-400'
                  }`}
                  style={{ width: `${doc.relevanceScore}%` }}
                />
              </div>
            </div>

            {/* Extracted Data Preview */}
            {doc.extractedData && (
              <div className="space-y-2 mb-3">
                {doc.extractedData.conditions && doc.extractedData.conditions.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {doc.extractedData.conditions.slice(0, 3).map((condition, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-500 bg-opacity-20 text-blue-400 text-xs rounded">
                        {condition}
                      </span>
                    ))}
                    {doc.extractedData.conditions.length > 3 && (
                      <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded">
                        +{doc.extractedData.conditions.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Flags */}
            {doc.flags && doc.flags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {doc.flags.map((flag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-orange-500 bg-opacity-20 text-orange-400 text-xs rounded flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {flag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-700">
              <span className="text-xs text-gray-500">
                Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDocument(doc);
                  }}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="View Document"
                >
                  <Eye className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Download functionality
                  }}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDocument(doc.id);
                  }}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Document Detail Modal */}
      <AnimatePresence>
        {selectedDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedDocument(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedDocument.name}</h2>
                    <p className="text-gray-400">{selectedDocument.category} • {selectedDocument.pages} pages</p>
                  </div>
                  <button
                    onClick={() => setSelectedDocument(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {/* Document Analysis */}
                <div className="space-y-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Info className="w-5 h-5 text-blue-400" />
                      Document Analysis
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Confidence Score</p>
                        <p className="text-lg font-semibold text-white">{selectedDocument.confidence}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Relevance Score</p>
                        <p className="text-lg font-semibold text-white">{selectedDocument.relevanceScore}%</p>
                      </div>
                    </div>
                  </div>

                  {selectedDocument.extractedData && (
                    <>
                      {selectedDocument.extractedData.conditions && (
                        <div className="bg-gray-700 rounded-lg p-4">
                          <h3 className="font-semibold text-white mb-3">Identified Conditions</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedDocument.extractedData.conditions.map((condition, idx) => (
                              <span key={idx} className="px-3 py-1 bg-blue-500 bg-opacity-20 text-blue-400 rounded">
                                {condition}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedDocument.extractedData.providers && (
                        <div className="bg-gray-700 rounded-lg p-4">
                          <h3 className="font-semibold text-white mb-3">Healthcare Providers</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedDocument.extractedData.providers.map((provider, idx) => (
                              <span key={idx} className="px-3 py-1 bg-green-500 bg-opacity-20 text-green-400 rounded">
                                {provider}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedDocument.extractedData.medications && (
                        <div className="bg-gray-700 rounded-lg p-4">
                          <h3 className="font-semibold text-white mb-3">Medications</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedDocument.extractedData.medications.map((med, idx) => (
                              <span key={idx} className="px-3 py-1 bg-purple-500 bg-opacity-20 text-purple-400 rounded">
                                {med}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => onViewDocument(selectedDocument)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Full Document
                  </button>
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}