'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PropertyData, marketDataService } from '@/services/marketDataService';

export interface UseHousingDataOptions {
  // Initial data to seed the hook (e.g., from server component)
  initialData?: PropertyData[];
  // Auto refetch interval in milliseconds; set 0 or undefined to disable
  revalidateMs?: number;
  // Trigger an immediate fetch on mount when no initialData is provided
  immediate?: boolean;
}

export interface UseHousingDataResult {
  data: PropertyData[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
  refetch: () => Promise<void>;
  usingFallback: boolean;
}

/**
 * Client-side hook to fetch housing market data via the internal Next.js route.
 * - Uses marketDataService.fetchHousingData() to keep transformation consistent.
 * - Supports cancellation via AbortController and periodic revalidation.
 */
export function useHousingData(options: UseHousingDataOptions = {}): UseHousingDataResult {
  const { initialData, revalidateMs = 60_000, immediate = true } = options;
  const [data, setData] = useState<PropertyData[]>(initialData ?? []);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(initialData ? Date.now() : null);
  const [usingFallback, setUsingFallback] = useState<boolean>(false);

  const abortRef = useRef<AbortController | null>(null);
  const intervalRef = useRef<number | null>(null);

  const cleanupAbort = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  };

  const refetch = useCallback(async () => {
    cleanupAbort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);

    try {
      // Fetch data with meta to include fallback indicator from headers
      const result = await marketDataService.fetchHousingDataWithMeta(controller.signal);
      setData(result.data);
      setUsingFallback(result.usingFallback);
      setLastUpdated(Date.now());
    } catch (e: any) {
      const message = e?.name === 'AbortError' ? 'Request canceled' : e?.message || 'Failed to fetch housing data';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch only if no initialData provided and immediate is true
    if (!initialData && immediate) {
      refetch();
    }

    // Setup periodic revalidation
    if (revalidateMs && revalidateMs > 0) {
      intervalRef.current = window.setInterval(() => {
        refetch();
      }, revalidateMs);
    }

    return () => {
      cleanupAbort();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // We intentionally omit dependencies like initialData/revalidateMs to keep stable behavior
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch]);

  return { data, loading, error, lastUpdated, refetch, usingFallback };
}