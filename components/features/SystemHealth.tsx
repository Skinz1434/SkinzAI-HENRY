'use client';

import { motion } from 'framer-motion';
import { SystemHealth as SystemHealthType, ServiceStatus } from '@/types';
import { CheckCircle, AlertCircle, XCircle, Activity, Database, Cloud, Shield } from 'lucide-react';

interface SystemHealthProps {
  health?: SystemHealthType;
}

export function SystemHealth({ health }: SystemHealthProps) {
  const defaultHealth: SystemHealthType = health || {
    status: 'operational',
    vetProfileApi: { status: 'up', responseTime: 142, lastCheck: new Date(), errorRate: 0.3 },
    verificationApi: { status: 'up', responseTime: 120, lastCheck: new Date(), errorRate: 0.2 },
    profileService: { status: 'up', responseTime: 98, lastCheck: new Date(), errorRate: 0.1 },
    database: { status: 'up', responseTime: 12, lastCheck: new Date(), errorRate: 0 },
    responseTime: 142,
    uptime: 99.98
  };

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'up':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'degraded':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'down':
        return <XCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'up':
        return 'bg-green-500/20 border-green-500/30';
      case 'degraded':
        return 'bg-yellow-500/20 border-yellow-500/30';
      case 'down':
        return 'bg-red-500/20 border-red-500/30';
    }
  };

  const services = [
    { name: 'Vet Profile API', icon: Cloud, data: defaultHealth.vetProfileApi },
    { name: 'Profile Service', icon: Shield, data: defaultHealth.profileService },
    { name: 'Database', icon: Database, data: defaultHealth.database }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          <span className="text-white font-medium">System Status</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          defaultHealth.status === 'operational' 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : defaultHealth.status === 'degraded'
            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {defaultHealth.status.charAt(0).toUpperCase() + defaultHealth.status.slice(1)}
        </span>
      </div>

      <div className="space-y-3">
        {services.map((service, index) => {
          const serviceData = service.data || { 
            status: 'down' as const, 
            responseTime: 0, 
            errorRate: 0, 
            lastCheck: new Date() 
          };
          return (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${getStatusColor(serviceData.status)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <service.icon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">{service.name}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Response: {serviceData.responseTime}ms | Error Rate: {serviceData.errorRate}%
                    </p>
                  </div>
                </div>
                {getStatusIcon(serviceData.status)}
              </div>
              <div className="mt-3">
                <div className="w-full h-1 bg-skinz-bg-tertiary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${100 - (serviceData.errorRate * 10)}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full ${
                      serviceData.status === 'up' 
                        ? 'bg-green-500' 
                        : serviceData.status === 'degraded' 
                        ? 'bg-yellow-500' 
                        : 'bg-red-500'
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-skinz-border-subtle">
        <div>
          <p className="text-gray-400 text-xs">Average Response Time</p>
          <p className="text-white text-lg font-bold">{defaultHealth.responseTime}ms</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">System Uptime</p>
          <p className="text-white text-lg font-bold">{defaultHealth.uptime}%</p>
        </div>
      </div>
    </div>
  );
}