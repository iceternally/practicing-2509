import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiClient } from './apiClient';

function mockFetchOnce(responseInit: ResponseInit & { body?: any }) {
  const { body, ...init } = responseInit;
  const headers = new Headers(init.headers || {});
  const res = new Response(
    headers.get('content-type')?.includes('application/json')
      ? JSON.stringify(body)
      : body ?? '',
    init,
  );
  (global as any).fetch = vi.fn().mockResolvedValueOnce(res);
}

function mockAbortableFetch() {
  (global as any).fetch = vi.fn().mockImplementation((_url: any, init: any) => {
    return new Promise((_resolve, reject) => {
      const signal: AbortSignal | undefined = init?.signal;
      if (signal) {
        const onAbort = () => {
          const err = new Error('Aborted');
          (err as any).name = 'AbortError';
          reject(err);
        };
        if (signal.aborted) {
          onAbort();
          return;
        }
        signal.addEventListener('abort', onAbort, { once: true });
      }
      // never resolve unless aborted
    });
  });
}

describe('ApiClient', () => {
  let client: ApiClient;

  beforeEach(() => {
    vi.useFakeTimers();
    client = new ApiClient({ timeoutMs: 100, retries: 0 });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });

  it('returns ok=true with JSON body on success', async () => {
    mockFetchOnce({ status: 200, headers: { 'content-type': 'application/json' }, body: { x: 1 } });
    const res = await client.request<{ x: number }>('/api/any');
    expect(res.ok).toBe(true);
    expect(res.status).toBe(200);
    expect(res.data).toEqual({ x: 1 });
  });

  it('returns ok=true with text body when content-type is not json', async () => {
    mockFetchOnce({ status: 200, headers: { 'content-type': 'text/plain' }, body: 'hello' });
    const res = await client.request<string>('/api/any');
    expect(res.ok).toBe(true);
    expect(res.status).toBe(200);
    expect(res.data).toBe('hello');
  });

  it('returns ok=false and error message on non-ok status with json error', async () => {
    mockFetchOnce({ status: 500, headers: { 'content-type': 'application/json' }, body: { error: 'oops' } });
    const res = await client.request<any>('/api/any');
    expect(res.ok).toBe(false);
    expect(res.status).toBe(500);
    expect(res.error).toBe('oops');
  });

  it('returns ok=false and error message on non-ok status with text error', async () => {
    mockFetchOnce({ status: 404, headers: { 'content-type': 'text/plain' }, body: 'Not found' });
    const res = await client.request<any>('/api/any');
    expect(res.ok).toBe(false);
    expect(res.status).toBe(404);
    expect(res.error).toBe('Not found');
  });

  it('aborts on timeout and returns ok=false when no retries', async () => {
    mockAbortableFetch();
    const p = client.request<any>('/api/slow');
    vi.advanceTimersByTime(110);
    const res = await p;
    expect(res.ok).toBe(false);
    expect(res.status).toBe(0);
    expect(res.error).toBe('Request timed out');
  });

  it('retries when configured and returns last error after exhausting', async () => {
    client = new ApiClient({ timeoutMs: 50, retries: 1, retryDelayMs: 10 });
    mockAbortableFetch();
    const p = client.request<any>('/api/slow');
    await vi.advanceTimersByTimeAsync(60); // first attempt timeout triggers abort
    await vi.advanceTimersByTimeAsync(10); // retry delay
    await vi.advanceTimersByTimeAsync(60); // second attempt timeout triggers abort
    const res = await p;
    expect(res.ok).toBe(false);
    expect(res.status).toBe(0);
    expect(res.error).toBe('Request timed out');
    expect((global as any).fetch).toHaveBeenCalledTimes(2);
  });

  it('resolves relative URLs to absolute on server', async () => {
    const originalWindow = (global as any).window;
    delete (global as any).window; // simulate server environment
    process.env.PORT = '3000';

    mockFetchOnce({ status: 200, headers: { 'content-type': 'application/json' }, body: { ok: true } });
    const res = await client.request<any>('/api/test');
    expect(res.ok).toBe(true);
    // fetch should have been called with a URL object containing origin
    const calledWith = (global as any).fetch.mock.calls[0][0];
    expect(calledWith instanceof URL).toBe(true);
    expect((calledWith as URL).href).toMatch(/^http:\/\/127\.0\.0\.1:3000\/api\/test$/);

    (global as any).window = originalWindow; // restore
  });

  it('returns network error when fetch rejects', async () => {
    (global as any).fetch = vi.fn().mockRejectedValueOnce(new Error('boom'));
    const res = await client.request<any>('/api/err');
    expect(res.ok).toBe(false);
    expect(res.status).toBe(0);
    expect(res.error).toBe('boom');
  });
});