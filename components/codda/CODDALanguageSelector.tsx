'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText,
  Search,
  Book,
  Brain,
  Gavel,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Copy,
  Edit,
  Star,
  Filter,
  X
} from 'lucide-react';
import { 
  CODLanguageLibrary, 
  LanguageTemplate, 
  getTemplatesByCategory,
  applyTemplateVariables,
  TEMPLATE_CATEGORIES 
} from '@/lib/codda/cod-language-library';

interface CODDALanguageSelectorProps {
  onInsertTemplate: (content: string) => void;
  currentSection?: string;
}

export default function CODDALanguageSelector({ 
  onInsertTemplate,
  currentSection = 'issue'
}: CODDALanguageSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState(currentSection);
  const [selectedTemplate, setSelectedTemplate] = useState<LanguageTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showVariableForm, setShowVariableForm] = useState(false);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filterSubcategory, setFilterSubcategory] = useState<string>('');

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('codda-favorite-templates');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      FileText,
      Search,
      Book,
      Brain,
      Gavel,
      MessageSquare,
      CheckCircle,
      AlertTriangle
    };
    const Icon = icons[iconName] || FileText;
    return <Icon className="w-4 h-4" />;
  };

  const templates = getTemplatesByCategory(selectedCategory);
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchQuery === '' || 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSubcategory = filterSubcategory === '' || 
      template.subcategory === filterSubcategory;
    
    return matchesSearch && matchesSubcategory;
  });

  const subcategories = [...new Set(templates.map(t => t.subcategory).filter(Boolean))];

  const toggleFavorite = (templateId: string) => {
    const newFavorites = favorites.includes(templateId)
      ? favorites.filter(id => id !== templateId)
      : [...favorites, templateId];
    
    setFavorites(newFavorites);
    localStorage.setItem('codda-favorite-templates', JSON.stringify(newFavorites));
  };

  const handleTemplateSelect = (template: LanguageTemplate) => {
    setSelectedTemplate(template);
    if (template.variables && template.variables.length > 0) {
      setShowVariableForm(true);
      // Initialize variable values
      const initialValues: Record<string, string> = {};
      template.variables.forEach(v => {
        initialValues[v] = '';
      });
      setVariableValues(initialValues);
    } else {
      // No variables, insert directly
      onInsertTemplate(template.content);
    }
  };

  const handleInsertWithVariables = () => {
    if (selectedTemplate) {
      const content = applyTemplateVariables(selectedTemplate.content, variableValues);
      onInsertTemplate(content);
      setShowVariableForm(false);
      setSelectedTemplate(null);
      setVariableValues({});
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Language Templates</h3>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {TEMPLATE_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setFilterSubcategory('');
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getIcon(cat.icon)}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Subcategory Filter */}
        {subcategories.length > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterSubcategory}
              onChange={(e) => setFilterSubcategory(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Subcategories</option>
              {subcategories.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Template List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              className="border border-gray-200 rounded-lg p-3 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-gray-800">{template.title}</h4>
                  {template.subcategory && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block">
                      {template.subcategory}
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(template.id);
                  }}
                  className={`p-1 rounded ${
                    favorites.includes(template.id)
                      ? 'text-yellow-500'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Star className="w-4 h-4" fill={favorites.includes(template.id) ? 'currentColor' : 'none'} />
                </button>
              </div>

              <p className="text-sm text-gray-600 line-clamp-3 mb-2">
                {template.content}
              </p>

              {template.variables && template.variables.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-blue-600">
                  <Edit className="w-3 h-3" />
                  <span>{template.variables.length} variables to fill</span>
                </div>
              )}

              {template.regulations && template.regulations.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {template.regulations.map(reg => (
                    <span key={reg} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                      {reg}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Variable Input Modal */}
      {showVariableForm && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Fill in Template Variables
                </h3>
                <button
                  onClick={() => {
                    setShowVariableForm(false);
                    setSelectedTemplate(null);
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">{selectedTemplate.title}</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  {selectedTemplate.content}
                </p>
              </div>

              <div className="space-y-3">
                {selectedTemplate.variables?.map(variable => (
                  <div key={variable}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {variable.replace(/_/g, ' ')}
                    </label>
                    <input
                      type="text"
                      value={variableValues[variable] || ''}
                      onChange={(e) => setVariableValues({
                        ...variableValues,
                        [variable]: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Enter ${variable.toLowerCase().replace(/_/g, ' ')}`}
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleInsertWithVariables}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Insert Template
                </button>
                <button
                  onClick={() => {
                    setShowVariableForm(false);
                    setSelectedTemplate(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}