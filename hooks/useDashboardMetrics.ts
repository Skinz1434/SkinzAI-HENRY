import { useQuery } from '@tanstack/react-query';
import { DashboardMetrics } from '@/types';
import { api } from '@/lib/api/client';

export function useDashboardMetrics() {
  const { data, isLoading, error, refetch } = useQuery<DashboardMetrics>({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      // In production, this would call the actual API
      // For now, returning mock data
      return {
        totalVeterans: 12847,
        activeClaiMs: 3421,
        averageProcessingTime: 4.2,
        dataAccuracy: 97.3,
        vetProfileAccuracy: 98.5,
        systemHealth: {
          status: 'operational',
          vetProfileApi: {
            status: 'up',
            responseTime: 142,
            lastCheck: new Date(),
            errorRate: 0.3
          },
          verificationApi: {
            status: 'up',
            responseTime: 142,
            lastCheck: new Date(),
            errorRate: 0.3
          },
          profileService: {
            status: 'up',
            responseTime: 98,
            lastCheck: new Date(),
            errorRate: 0.1
          },
          database: {
            status: 'up',
            responseTime: 12,
            lastCheck: new Date(),
            errorRate: 0
          },
          responseTime: 142,
          uptime: 99.98
        },
        recentActivity: [],
        claimsByStatus: {
          PENDING: 423,
          UNDER_REVIEW: 856,
          GATHERING_EVIDENCE: 234,
          PENDING_DECISION: 145,
          APPROVED: 1523,
          DENIED: 89,
          APPEALED: 151
        },
        veteransByBranch: {
          ARMY: 4523,
          NAVY: 3214,
          AIR_FORCE: 2876,
          MARINES: 1534,
          COAST_GUARD: 543,
          SPACE_FORCE: 157
        }
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return {
    metrics: data,
    isLoading,
    error,
    refetch
  };
}