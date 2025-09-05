'use client';

import React from 'react';
import { 
  TrendingUp, Clock, Users, Shield, FileText, 
  BarChart3, Award, Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

export interface HenryInsights {
  accuracyRate: number;
  avgProcessingSeconds: number;
  concurrentClaims: number;
  availabilityPct: number;
  coddaIprPassRate: number;
  documentsAnalyzed: number;
  veteransServed: number;
  activeUsers?: number;
}

const defaultInsights: HenryInsights = {
  accuracyRate: 98.7,
  avgProcessingSeconds: 42,
  concurrentClaims: 1247,
  availabilityPct: 99.95,
  coddaIprPassRate: 94.3,
  documentsAnalyzed: 847329,
  veteransServed: 12843,
  activeUsers: 328
};

interface FooterInsightsProps {
  insights?: HenryInsights;
}

export default function FooterInsights({ insights = defaultInsights }: FooterInsightsProps) {
  const items = [
    { 
      label: 'Accuracy Rate', 
      value: `${insights.accuracyRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-500/10'
    },
    { 
      label: 'Avg Processing', 
      value: `${Math.round(insights.avgProcessingSeconds)}s`,
      icon: Clock,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-500/10'
    },
    { 
      label: 'Active Claims', 
      value: insights.concurrentClaims.toLocaleString(),
      icon: FileText,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-500/10'
    },
    { 
      label: 'Platform Uptime', 
      value: `${insights.availabilityPct.toFixed(2)}%`,
      icon: Shield,
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-500/10'
    },
    { 
      label: 'CODDA IPR Pass', 
      value: `${insights.coddaIprPassRate.toFixed(1)}%`,
      icon: Award,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-500/10'
    },
    { 
      label: 'Docs Analyzed', 
      value: formatNumber(insights.documentsAnalyzed),
      icon: BarChart3,
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-indigo-500/10'
    },
    { 
      label: 'Veterans Served', 
      value: formatNumber(insights.veteransServed),
      icon: Users,
      color: 'from-rose-500 to-pink-600',
      bgColor: 'bg-rose-500/10'
    }
  ];

  if (insights.activeUsers) {
    items.push({
      label: 'Active Users',
      value: insights.activeUsers.toString(),
      icon: Activity,
      color: 'from-teal-500 to-emerald-600',
      bgColor: 'bg-teal-500/10'
    });
  }

  return (
    <footer className="border-t border-white/10 bg-gradient-to-b from-slate-900/80 to-black/90 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-12">
        {/* Title Section */}
        <div className="mb-8 text-center">
          <h3 className="font-display text-2xl font-bold text-white mb-2">
            Platform Performance Metrics
          </h3>
          <p className="text-sm text-slate-400">
            Real-time insights from HENRY analytics engine
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-8 mb-8">
          {items.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative"
            >
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-slate-900/80 hover:shadow-2xl hover:-translate-y-1">
                {/* Icon */}
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${item.color} shadow-lg`}>
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                
                {/* Label */}
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">
                  {item.label}
                </div>
                
                {/* Value */}
                <div className="text-xl font-bold text-white">
                  {item.value}
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-400">
              Live metrics updated every 30 seconds
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">API Status</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Documentation</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Support</a>
          </div>

          <div className="text-xs text-slate-500">
            © 2024 HENRY Platform. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}