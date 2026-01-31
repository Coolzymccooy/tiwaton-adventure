import { apiUrl } from './api';

export type InsightSummary = {
  totalEvents: number;
  failureCount: number;
  averageDuration: number;
  viewMetrics: Record<
    string,
    {
      count: number;
      avgDuration: number;
      failures: number;
    }
  >;
  recentErrors: {
    view: string;
    event: string;
    error: string;
    timestamp: number;
  }[];
};

export const getInsightsSummary = async (): Promise<InsightSummary | null> => {
  try {
    const res = await fetch(apiUrl('/api/insights/summary'), { credentials: 'include' });
    if (!res.ok) return null;
    const payload = await res.json();
    return payload.summary || null;
  } catch (error) {
    console.warn('Insights summary failed', error);
    return null;
  }
};
