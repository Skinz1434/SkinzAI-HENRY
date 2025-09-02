'use client';

import { motion } from 'framer-motion';
import { Activity as ActivityType, ActivityType as ActivityTypeEnum } from '@/types';
import {
  UserPlus,
  FileText,
  CheckCircle,
  XCircle,
  Upload,
  RefreshCw,
  LogIn,
  FileSearch
} from 'lucide-react';

interface RecentActivityProps {
  activities: ActivityType[];
}

const activityIcons: Record<ActivityTypeEnum, any> = {
  VETERAN_CREATED: UserPlus,
  VETERAN_UPDATED: RefreshCw,
  CLAIM_SUBMITTED: FileText,
  CLAIM_UPDATED: RefreshCw,
  CLAIM_APPROVED: CheckCircle,
  CLAIM_DENIED: XCircle,
  DOCUMENT_UPLOADED: Upload,
  VET_PROFILE_SYNC: RefreshCw,
  DD214_FALLBACK: FileSearch,
  USER_LOGIN: LogIn,
  REPORT_GENERATED: FileText
};

const activityColors: Record<ActivityTypeEnum, string> = {
  VETERAN_CREATED: 'text-blue-400',
  VETERAN_UPDATED: 'text-purple-400',
  CLAIM_SUBMITTED: 'text-green-400',
  CLAIM_UPDATED: 'text-yellow-400',
  CLAIM_APPROVED: 'text-emerald-400',
  CLAIM_DENIED: 'text-red-400',
  DOCUMENT_UPLOADED: 'text-indigo-400',
  VET_PROFILE_SYNC: 'text-cyan-400',
  DD214_FALLBACK: 'text-orange-400',
  USER_LOGIN: 'text-gray-400',
  REPORT_GENERATED: 'text-pink-400'
};

export function RecentActivity({ activities }: RecentActivityProps) {
  const defaultActivities: ActivityType[] = activities.length > 0 ? activities : [
    {
      id: '1',
      type: ActivityTypeEnum.VET_PROFILE_SYNC,
      description: 'Vet Profile API sync completed with 97.8% accuracy',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      userId: 'system',
      veteranId: null,
      metadata: { accuracy: 97.8 }
    },
    {
      id: '2',
      type: ActivityTypeEnum.CLAIM_APPROVED,
      description: 'Disability claim #CL2024-0342 approved',
      timestamp: new Date(Date.now() - 1000 * 60 * 12),
      userId: 'user-1',
      veteranId: 'vet-123',
      metadata: { claimNumber: 'CL2024-0342' }
    },
    {
      id: '3',
      type: ActivityTypeEnum.DOCUMENT_UPLOADED,
      description: 'DD-214 uploaded for veteran John Smith',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      userId: 'user-2',
      veteranId: 'vet-124',
      metadata: { documentType: 'DD-214' }
    },
    {
      id: '4',
      type: ActivityTypeEnum.DD214_FALLBACK,
      description: 'Fallback to DD-214 processing due to Vet Profile timeout',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      userId: 'system',
      veteranId: 'vet-125',
      metadata: { reason: 'timeout' }
    },
    {
      id: '5',
      type: ActivityTypeEnum.VETERAN_CREATED,
      description: 'New veteran profile created: Jane Doe',
      timestamp: new Date(Date.now() - 1000 * 60 * 67),
      userId: 'user-3',
      veteranId: 'vet-126',
      metadata: { veteranName: 'Jane Doe' }
    }
  ];

  const formatTime = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="space-y-3">
      {defaultActivities.map((activity, index) => {
        const Icon = activityIcons[activity.type];
        const colorClass = activityColors[activity.type];

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-skinz-bg-secondary transition-colors"
          >
            <div className={`p-2 bg-skinz-bg-tertiary rounded-lg ${colorClass}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-gray-300 text-sm">{activity.description}</p>
              <p className="text-gray-500 text-xs mt-1">
                {formatTime(activity.timestamp)}
              </p>
            </div>
            {activity.type === ActivityTypeEnum.VET_PROFILE_SYNC && activity.metadata?.accuracy && (
              <span className="accuracy-badge text-xs">
                {activity.metadata.accuracy}%
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}