import { NextResponse } from 'next/server';
import { sampleHousingData } from '@/services/marketDataService';

// Proxy route: fetch housing market data from backend, fallback to sample data
export async function GET() {
  const baseUrl = process.env.MARKET_ANALYSIS_API_BASE_URL || 'http://127.0.0.1:8080';
  const targetUrl = `${baseUrl}/api/market-analysis/housing`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(targetUrl, { signal: controller.signal, cache: 'no-store', next: { revalidate: 60 } });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json(data, { headers: { 'x-fallback': 'false' } });
  } catch (error) {
    console.error('Failed to proxy housing data, returning sample data:', error);
    return NextResponse.json(sampleHousingData, { headers: { 'x-fallback': 'true' } });
  } finally {
    clearTimeout(timeout);
  }
}