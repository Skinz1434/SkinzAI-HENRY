'use client';

import React, { useState, useMemo } from 'react';
import { 
  Clock, Calendar, MapPin, Shield, Heart, FileText, 
  AlertCircle, CheckCircle, Star, Zap, Activity,
  ChevronRight, Filter, Search, TrendingUp, Award,
  User, Building, Pill, Stethoscope, Flag, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Area, AreaChart, Scatter,
  ScatterChart, ZAxis, ComposedChart, Bar
} from 'recharts';

interface TimelineEvent {
  date: string;
  event: string;
  type: 'service' | 'medical' | 'claim' | 'treatment' | 'deployment' | 'diagnosis';
  category: 'milestone' | 'trauma' | 'treatment' | 'administrative';
  importance: 'high' | 'medium' | 'low';
  location?: string;
  provider?: string;
  details?: string;
  documents?: string[];
  impact?: number;
  related?: string[];
}

interface TimelineViewEnhancedProps {
  timeline: TimelineEvent[];
  veteranData?: any;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-lg p-3 shadow-xl">
        <p className="text-white font-semibold text-sm">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-gray-300 text-xs mt-1">
            {entry.name}: <span className="text-blue-400 font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function TimelineViewEnhanced({ timeline, veteranData }: TimelineViewEnhancedProps) {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterImportance, setFilterImportance] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'timeline' | 'graph' | 'calendar'>('timeline');

  // Process timeline data for visualizations
  const timelineData = useMemo(() => {
    if (!timeline || timeline.length === 0) return { sorted: [], byYear: [] };
    const sorted = [...timeline].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Group by year for graph view
    const byYear = sorted.reduce((acc, event) => {
      const year = new Date(event.date).getFullYear();
      if (!acc[year]) {
        acc[year] = {
          year,
          service: 0,
          medical: 0,
          claim: 0,
          treatment: 0,
          total: 0
        };
      }
      acc[year][event.type]++;
      acc[year].total++;
      return acc;
    }, {} as any);

    return {
      sorted,
      byYear: Object.values(byYear)
    };
  }, [timeline]);

  // Filter timeline
  const filteredTimeline = useMemo(() => {
    if (!timelineData || !('sorted' in timelineData)) return [];
    let filtered = timelineData.sorted;

    if (filterType !== 'all') {
      filtered = filtered.filter(e => e.type === filterType);
    }

    if (filterImportance !== 'all') {
      filtered = filtered.filter(e => e.importance === filterImportance);
    }

    if (searchTerm) {
      filtered = filtered.filter(e => 
        e.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [timelineData.sorted, filterType, filterImportance, searchTerm]);

  // Get event type color and icon
  const getEventStyle = (type: string) => {
    const styles = {
      service: { color: 'from-blue-600 to-blue-700', icon: Shield, accent: 'text-blue-400' },
      medical: { color: 'from-green-600 to-green-700', icon: Heart, accent: 'text-green-400' },
      claim: { color: 'from-purple-600 to-purple-700', icon: FileText, accent: 'text-purple-400' },
      treatment: { color: 'from-yellow-600 to-yellow-700', icon: Pill, accent: 'text-yellow-400' },
      deployment: { color: 'from-orange-600 to-orange-700', icon: MapPin, accent: 'text-orange-400' },
      diagnosis: { color: 'from-red-600 to-red-700', icon: Stethoscope, accent: 'text-red-400' }
    };
    return styles[type as keyof typeof styles] || styles.service;
  };

  const getImportanceStyle = (importance: string) => {
    const styles = {
      high: 'bg-red-500/20 text-red-400 border-red-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      low: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return styles[importance as keyof typeof styles] || styles.low;
  };

  return (
    <div className="space-y-6">
      {/* Header with View Mode Selector */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Medical & Service Timeline
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Comprehensive history from {timelineData.sorted[0]?.date} to {timelineData.sorted[timelineData.sorted.length - 1]?.date}
            </p>
          </div>
          
          {/* View Mode Tabs */}
          <div className="flex gap-1 bg-gray-800/50 p-1 rounded-xl">
            {[
              { id: 'timeline', icon: Clock, label: 'Timeline' },
              { id: 'graph', icon: Activity, label: 'Graph' },
              { id: 'calendar', icon: Calendar, label: 'Calendar' }
            ].map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id as any)}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    viewMode === mode.id
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {mode.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="service">Service</option>
            <option value="medical">Medical</option>
            <option value="claim">Claims</option>
            <option value="treatment">Treatment</option>
            <option value="deployment">Deployment</option>
            <option value="diagnosis">Diagnosis</option>
          </select>

          <select
            value={filterImportance}
            onChange={(e) => setFilterImportance(e.target.value)}
            className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Importance</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-6 gap-3 mt-4">
          {Object.entries(
            filteredTimeline.reduce((acc, event) => {
              acc[event.type] = (acc[event.type] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).map(([type, count]) => {
            const style = getEventStyle(type);
            const Icon = style.icon;
            return (
              <div key={type} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${style.accent}`} />
                  <span className="text-xs text-gray-400 capitalize">{type}</span>
                </div>
                <p className="text-xl font-bold text-white">{count}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* View Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'timeline' && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-xl"
          >
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600"></div>
              
              {/* Events */}
              <div className="space-y-6">
                {filteredTimeline.map((event, idx) => {
                  const style = getEventStyle(event.type);
                  const Icon = style.icon;
                  const isSelected = selectedEvent?.date === event.date && selectedEvent?.event === event.event;
                  
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="relative flex items-start gap-6"
                    >
                      {/* Event Node */}
                      <div className="relative z-10">
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          className={`w-10 h-10 rounded-full bg-gradient-to-br ${style.color} flex items-center justify-center shadow-lg`}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </motion.div>
                        {event.importance === 'high' && (
                          <div className="absolute -top-1 -right-1">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>

                      {/* Event Card */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedEvent(isSelected ? null : event)}
                        className={`flex-1 bg-gray-800/50 backdrop-blur rounded-xl border transition-all cursor-pointer ${
                          isSelected ? 'border-blue-500 shadow-xl' : 'border-gray-700/50 hover:border-gray-600'
                        }`}
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <p className="text-white font-semibold">{event.event}</p>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getImportanceStyle(event.importance)}`}>
                                  {event.importance.toUpperCase()}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-sm text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(event.date).toLocaleDateString()}
                                </span>
                                {event.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {event.location}
                                  </span>
                                )}
                                {event.provider && (
                                  <span className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {event.provider}
                                  </span>
                                )}
                              </div>
                            </div>
                            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                              isSelected ? 'rotate-90' : ''
                            }`} />
                          </div>

                          {event.details && (
                            <p className="text-gray-300 text-sm mb-2">{event.details}</p>
                          )}

                          {/* Event Tags */}
                          <div className="flex flex-wrap gap-2">
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${style.accent} bg-gray-700/50`}>
                              {event.type}
                            </span>
                            <span className="px-2 py-1 bg-gray-700/50 text-gray-400 rounded-lg text-xs">
                              {event.category}
                            </span>
                            {event.impact && (
                              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {event.impact}% Impact
                              </span>
                            )}
                          </div>

                          {/* Expanded Details */}
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-4 pt-4 border-t border-gray-700/50"
                              >
                                {event.documents && event.documents.length > 0 && (
                                  <div className="mb-3">
                                    <p className="text-sm text-gray-400 mb-2">Related Documents</p>
                                    <div className="flex flex-wrap gap-2">
                                      {event.documents.map((doc, dIdx) => (
                                        <span key={dIdx} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs flex items-center gap-1">
                                          <FileText className="w-3 h-3" />
                                          {doc}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {event.related && event.related.length > 0 && (
                                  <div>
                                    <p className="text-sm text-gray-400 mb-2">Related Events</p>
                                    <div className="flex flex-wrap gap-2">
                                      {event.related.map((rel, rIdx) => (
                                        <span key={rIdx} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs">
                                          {rel}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {viewMode === 'graph' && (
          <motion.div
            key="graph"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-xl"
          >
            <h3 className="text-xl font-bold text-white mb-4">Event Distribution Over Time</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={timelineData.byYear}>
                  <defs>
                    <linearGradient id="serviceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.2} />
                    </linearGradient>
                    <linearGradient id="medicalGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0.2} />
                    </linearGradient>
                    <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="year" tick={{ fill: '#9CA3AF' }} />
                  <YAxis tick={{ fill: '#9CA3AF' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="service" stackId="a" fill="url(#serviceGradient)" />
                  <Bar dataKey="medical" stackId="a" fill="url(#medicalGradient)" />
                  <Line type="monotone" dataKey="total" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6', r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Event Impact Chart */}
            <div className="mt-6">
              <h3 className="text-xl font-bold text-white mb-4">Event Impact Analysis</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <defs>
                      <linearGradient id="impactGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#EC4899" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" dataKey="x" name="Time" tick={{ fill: '#9CA3AF' }} />
                    <YAxis type="number" dataKey="y" name="Impact" tick={{ fill: '#9CA3AF' }} />
                    <ZAxis type="number" dataKey="z" range={[50, 400]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                    <Scatter
                      name="Events"
                      data={filteredTimeline.map((e, i) => ({
                        x: i,
                        y: e.impact || Math.random() * 100,
                        z: e.importance === 'high' ? 400 : e.importance === 'medium' ? 200 : 100,
                        name: e.event
                      }))}
                      fill="url(#impactGradient)"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {viewMode === 'calendar' && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-xl"
          >
            <div className="grid grid-cols-3 gap-4">
              {/* Group events by year and month */}
              {Object.entries(
                filteredTimeline.reduce((acc, event) => {
                  const date = new Date(event.date);
                  const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                  if (!acc[key]) acc[key] = [];
                  acc[key].push(event);
                  return acc;
                }, {} as Record<string, typeof filteredTimeline>)
              ).map(([month, events]) => (
                <div key={month} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                  <h4 className="text-white font-semibold mb-3">
                    {new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h4>
                  <div className="space-y-2">
                    {events.map((event, idx) => {
                      const style = getEventStyle(event.type);
                      const Icon = style.icon;
                      return (
                        <div key={idx} className="flex items-start gap-2">
                          <Icon className={`w-4 h-4 mt-1 ${style.accent}`} />
                          <div className="flex-1">
                            <p className="text-sm text-white">{event.event}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(event.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}