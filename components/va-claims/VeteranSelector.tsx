'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Filter, ChevronDown, User, Shield, Award, 
  Calendar, MapPin, Hash, Star, Activity, TrendingUp,
  Folder, FileText, AlertCircle, CheckCircle, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Veteran {
  id: string;
  name: string;
  ssn: string;
  dob: string;
  branch: string;
  rank: string;
  serviceYears: string;
  disabilityRating: number;
  claimStatus: 'active' | 'pending' | 'approved' | 'denied';
  lastActivity: string;
  documentsCount: number;
  pendingActions: number;
  profileImage?: string;
  unit?: string;
  mos?: string;
  deployments?: string[];
  conditions?: string[];
}

interface VeteranSelectorProps {
  selectedVeteran: any;
  onSelectVeteran: (veteran: any) => void;
  veterans: any[];
}

export default function VeteranSelector({ selectedVeteran, onSelectVeteran, veterans }: VeteranSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranch, setFilterBranch] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'activity'>('activity');
  const [showFilters, setShowFilters] = useState(false);

  const branches = ['all', 'Army', 'Navy', 'Air Force', 'Marines', 'Coast Guard', 'Space Force'];
  const statuses = ['all', 'active', 'pending', 'approved', 'denied'];

  const filteredVeterans = useMemo(() => {
    let filtered = [...veterans];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(vet => 
        vet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vet.ssn.includes(searchTerm) ||
        vet.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(vet.conditions) ? vet.conditions.some((c: any) => 
          typeof c === 'string' ? c.toLowerCase().includes(searchTerm.toLowerCase()) : 
          c.name?.toLowerCase().includes(searchTerm.toLowerCase())
        ) : false)
      );
    }

    // Branch filter
    if (filterBranch !== 'all') {
      filtered = filtered.filter(vet => vet.branch === filterBranch);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(vet => vet.claimStatus === filterStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.disabilityRating - a.disabilityRating;
        case 'activity':
          return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [veterans, searchTerm, filterBranch, filterStatus, sortBy]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-400 bg-blue-400/10';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'approved': return 'text-green-400 bg-green-400/10';
      case 'denied': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getBranchIcon = (branch: string) => {
    // Service branch icon representation
    return <Shield className="w-4 h-4" />;
  };

  return (
    <div className="relative">
      {/* Selected Veteran Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedVeteran ? (
              <>
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-300" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">{selectedVeteran.name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{selectedVeteran.branch}</span>
                    <span>•</span>
                    <span>{selectedVeteran.disabilityRating}% Rating</span>
                    <span>•</span>
                    <span className={`px-2 py-0.5 rounded ${getStatusColor(selectedVeteran.claimStatus)}`}>
                      {selectedVeteran.claimStatus}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">Select a Veteran</span>
              </div>
            )}
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-[600px] overflow-hidden"
          >
            {/* Search and Filter Header */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex gap-2 mb-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Veterans by name, service, or medical condition..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    showFilters ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>

              {/* Filter Options */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-3 overflow-hidden"
                  >
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Branch</label>
                        <select
                          value={filterBranch}
                          onChange={(e) => setFilterBranch(e.target.value)}
                          className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:outline-none focus:border-blue-500"
                        >
                          {branches.map(branch => (
                            <option key={branch} value={branch}>
                              {branch === 'all' ? 'All Branches' : branch}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Status</label>
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:outline-none focus:border-blue-500"
                        >
                          {statuses.map(status => (
                            <option key={status} value={status}>
                              {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Sort By</label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as any)}
                          className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="activity">Recent Activity</option>
                          <option value="name">Name</option>
                          <option value="rating">Disability Rating</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Veterans List */}
            <div className="max-h-[400px] overflow-y-auto">
              {filteredVeterans.length > 0 ? (
                filteredVeterans.map((veteran) => (
                  <button
                    key={veteran.id}
                    onClick={() => {
                      onSelectVeteran(veteran);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-3 hover:bg-gray-700/50 transition-colors border-b border-gray-700/50 ${
                      selectedVeteran?.id === veteran.id ? 'bg-gray-700/30' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-300" />
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium">{veteran.name}</p>
                            <span className={`px-2 py-0.5 text-xs rounded ${getStatusColor(veteran.claimStatus)}`}>
                              {veteran.claimStatus}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              {getBranchIcon(veteran.branch)}
                              {veteran.branch}
                            </span>
                            <span className="flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              {veteran.disabilityRating}%
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {veteran.serviceYears}
                            </span>
                          </div>
                          {veteran.conditions && veteran.conditions.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {veteran.conditions.slice(0, 3).map((condition: any, idx: number) => (
                                <span key={idx} className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
                                  {typeof condition === 'string' ? condition : condition.name}
                                </span>
                              ))}
                              {veteran.conditions.length > 3 && (
                                <span className="px-2 py-0.5 bg-gray-700 text-gray-400 text-xs rounded">
                                  +{veteran.conditions.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Folder className="w-3 h-3" />
                          {veteran.documentsCount} docs
                        </div>
                        {veteran.pendingActions > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs text-yellow-400">{veteran.pendingActions} pending</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Search className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No veterans found</p>
                  <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </div>

            {/* Footer Stats */}
            <div className="p-3 border-t border-gray-700 bg-gray-800/50">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Showing {filteredVeterans.length} of {veterans.length} veterans</span>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterBranch('all');
                    setFilterStatus('all');
                  }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Clear filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}