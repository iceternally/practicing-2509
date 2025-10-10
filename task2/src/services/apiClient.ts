export interface ApiClientOptions {
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
}

export interface ApiResponse<T> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
  headers: Headers;
}

export class ApiClient {
  private timeoutMs: number;
  private retries: number;
  private retryDelayMs: number;

  constructor(options: ApiClientOptions = {}) {
    this.timeoutMs = options.timeoutMs ?? 10000;
    this.retries = options.retries ?? 0;
    this.retryDelayMs = options.retryDelayMs ?? 300;
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async request<T>(input: RequestInfo | URL, init: RequestInit = {}): Promise<ApiResponse<T>> {
    let attempt = 0;
    let lastError: any = null;

    while (attempt <= this.retries) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

      try {
        const res = await fetch(input, {
          ...init,
          signal: init.signal ?? controller.signal,
          cache: init.cache ?? 'no-store',
        });
        clearTimeout(timeout);

        const contentType = res.headers.get('content-type') || '';
        let data: any;
        if (contentType.includes('application/json')) {
          data = await res.json();
        } else {
          data = await res.text();
        }

        if (!res.ok) {
          const errorMsg = typeof data === 'string' ? data : data?.error || `HTTP ${res.status}`;
          return { ok: false, status: res.status, error: errorMsg, headers: res.headers };
        }

        return { ok: true, status: res.status, data, headers: res.headers };
      } catch (error: any) {
        clearTimeout(timeout);
        lastError = error;
        if (error?.name === 'AbortError') {
          // Abort due to timeout; decide whether to retry
        }
        if (attempt < this.retries) {
          await this.delay(this.retryDelayMs);
          attempt += 1;
          continue;
        } else {
          const message = error?.name === 'AbortError' ? 'Request timed out' : error?.message || 'Network error';
          return { ok: false, status: 0, error: message, headers: new Headers() };
        }
      }
    }

    const message = lastError?.message || 'Unknown error';
    return { ok: false, status: 0, error: message, headers: new Headers() };
  }
}

export const apiClient = new ApiClient({ timeoutMs: 10000, retries: 1, retryDelayMs: 300 });