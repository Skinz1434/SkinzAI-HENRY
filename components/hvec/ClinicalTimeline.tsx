'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, FileText, Pill, Heart, Brain, AlertTriangle, 
  Shield, Award, TrendingUp, Activity, Stethoscope, User
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  date: Date;
  type: 'diagnosis' | 'treatment' | 'surgery' | 'medication' | 'claim' | 'deployment' | 'exposure';
  title: string;
  description: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  icon: any;
  color: string;
  metadata?: Record<string, any>;
}

interface ClinicalTimelineProps {
  events: TimelineEvent[];
  onEventClick?: (event: TimelineEvent) => void;
}

export const ClinicalTimeline: React.FC<ClinicalTimelineProps> = ({ events, onEventClick }) => {
  const sortedEvents = [...events].sort((a, b) => b.date.getTime() - a.date.getTime());

  const getIconForType = (type: string) => {
    switch (type) {
      case 'diagnosis': return Heart;
      case 'treatment': return Stethoscope;
      case 'surgery': return Activity;
      case 'medication': return Pill;
      case 'claim': return FileText;
      case 'deployment': return Shield;
      case 'exposure': return AlertTriangle;
      default: return Calendar;
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'diagnosis': return 'bg-red-500';
      case 'treatment': return 'bg-blue-500';
      case 'surgery': return 'bg-purple-500';
      case 'medication': return 'bg-green-500';
      case 'claim': return 'bg-yellow-500';
      case 'deployment': return 'bg-indigo-500';
      case 'exposure': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
      
      {/* Timeline events */}
      <div className="space-y-6">
        {sortedEvents.map((event, index) => {
          const Icon = getIconForType(event.type);
          const colorClass = getColorForType(event.type);
          
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-start gap-4"
            >
              {/* Icon */}
              <div className={`relative z-10 w-16 h-16 rounded-full ${colorClass} flex items-center justify-center shadow-lg`}>
                <Icon className="w-8 h-8 text-white" />
                {event.severity === 'critical' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full animate-pulse"></div>
                )}
              </div>
              
              {/* Content */}
              <div 
                className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onEventClick?.(event)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {event.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {event.date.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  {event.severity && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      event.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      event.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                      event.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {event.severity}
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {event.description}
                </p>
                
                {event.metadata && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(event.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}:</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

interface MilitaryServiceTimelineProps {
  deployments: Array<{
    id: string;
    location: string;
    startDate: Date;
    endDate: Date;
    branch: string;
    unit: string;
    exposures: string[];
    combatService: boolean;
  }>;
}

export const MilitaryServiceTimeline: React.FC<MilitaryServiceTimelineProps> = ({ deployments }) => {
  const sortedDeployments = [...deployments].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  
  // Calculate total service time
  const totalDays = sortedDeployments.reduce((acc, d) => {
    const days = Math.floor((d.endDate.getTime() - d.startDate.getTime()) / (1000 * 60 * 60 * 24));
    return acc + days;
  }, 0);
  
  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-500" />
          Military Service Timeline
        </h3>
        <div className="text-sm text-gray-500">
          Total Service: {years} years, {months} months
        </div>
      </div>
      
      <div className="relative">
        {/* Timeline bar */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-600 -translate-y-1/2"></div>
        
        {/* Deployments */}
        <div className="relative flex justify-between">
          {sortedDeployments.map((deployment, index) => (
            <div
              key={deployment.id}
              className="relative flex flex-col items-center"
              style={{
                left: `${(index / (sortedDeployments.length - 1)) * 100}%`,
                position: index === 0 ? 'relative' : 'absolute',
                transform: index !== 0 ? 'translateX(-50%)' : undefined
              }}
            >
              {/* Marker */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`w-4 h-4 rounded-full ${
                  deployment.combatService ? 'bg-red-500' : 'bg-blue-500'
                } border-2 border-white dark:border-gray-800 shadow-lg z-10`}
              />
              
              {/* Details */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.1 }}
                className={`absolute ${
                  index % 2 === 0 ? 'top-6' : 'bottom-6'
                } bg-white dark:bg-gray-700 rounded-lg shadow-md p-3 w-48 text-xs`}
              >
                <div className="font-semibold text-gray-900 dark:text-white mb-1">
                  {deployment.location}
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  {deployment.startDate.getFullYear()} - {deployment.endDate.getFullYear()}
                </div>
                <div className="text-gray-600 dark:text-gray-300 mt-1">
                  {deployment.unit}
                </div>
                {deployment.exposures.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                    <div className="text-orange-600 dark:text-orange-400 font-medium">
                      Exposures:
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      {deployment.exposures.join(', ')}
                    </div>
                  </div>
                )}
                {deployment.combatService && (
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                      Combat Service
                    </span>
                  </div>
                )}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};