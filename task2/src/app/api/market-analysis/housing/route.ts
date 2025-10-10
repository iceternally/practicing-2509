import { NextResponse } from 'next/server';
import { sampleHousingData } from '@/services/marketDataService';

// Proxy route: fetch housing market data from backend, fallback to sample data
export async function GET() {
  const baseUrl = process.env.MARKET_ANALYSIS_API_BASE_URL || 'http://127.0.0.1:8080';
  const targetUrl = `${baseUrl}/api/market-analysis/housing`;

  try {
    const response = await fetch(targetUrl, { next: { revalidate: 60 } });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to proxy housing data, returning sample data:', error);
    return NextResponse.json(sampleHousingData);
  }
}