'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface PredictionInput {
  square_footage: number;
  bedrooms: number;
  bathrooms: number;
  year_built: number;
  lot_size: number;
  distance_to_city_center: number;
  school_rating: number;
}

export interface UsePredictionResult {
  predictions: number[] | null;
  loading: boolean;
  error: string | null;
  predict: (payload: PredictionInput[]) => Promise<number[] | null>;
  cancel: () => void;
  reset: () => void;
}

/**
 * Client-side hook to call the internal /api/predict route.
 * - Normalized response expected: { predictions: number[] }
 * - Provides loading, error, cancel, and reset controls
 */
export function usePrediction(): UsePredictionResult {
  const [predictions, setPredictions] = useState<number[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const cancel = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    setPredictions(null);
    setError(null);
  }, []);

  const predict = useCallback(async (payload: PredictionInput[]) => {
    cancel();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
        cache: 'no-store',
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Prediction API error ${res.status}: ${text}`);
      }

      const data = await res.json();
      const values: number[] | undefined = Array.isArray(data?.predictions)
        ? data.predictions.filter((n: any) => typeof n === 'number' && !Number.isNaN(n))
        : undefined;

      if (!values || values.length === 0) {
        throw new Error('Prediction API did not return any numeric predictions');
      }

      setPredictions(values);
      return values;
    } catch (e: any) {
      const message = e?.name === 'AbortError' ? 'Prediction request canceled' : e?.message || 'Prediction failed';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [cancel]);

  useEffect(() => () => cancel(), [cancel]);

  return { predictions, loading, error, predict, cancel, reset };
}