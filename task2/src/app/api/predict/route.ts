import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const baseUrl = process.env.PREDICTION_API_BASE_URL || 'http://127.0.0.1:8000';
    const url = `${baseUrl.replace(/\/$/, '')}/predict`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: 'no-store',
      next: { revalidate: 0 },
    }).finally(() => clearTimeout(timeout));

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: 'Upstream prediction API returned an error', upstreamStatus: res.status, details: text },
        { status: 502 }
      );
    }

    const data = await res.json();

    // Normalize response to { predictions: number[] }
    let normalized: { predictions: number[] } | any;
    if (Array.isArray(data?.predictions)) {
      normalized = { predictions: data.predictions.map((x: any) => Number(x)).filter((n) => !Number.isNaN(n)) };
    } else if (typeof data === 'number') {
      normalized = { predictions: [data] };
    } else if (Array.isArray(data)) {
      normalized = { predictions: data.map((x: any) => Number(x)).filter((n) => !Number.isNaN(n)) };
    } else if (typeof data?.prediction === 'number') {
      normalized = { predictions: [data.prediction] };
    } else {
      normalized = data;
    }

    return NextResponse.json(normalized, { status: 200 });
  } catch (error: any) {
    const message = error?.name === 'AbortError' ? 'Prediction request timed out' : error?.message || 'Unexpected error while calling prediction API';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}