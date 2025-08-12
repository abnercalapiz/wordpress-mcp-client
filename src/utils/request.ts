import fetch, { RequestInit } from 'node-fetch';
import { WordPressMCPError, NetworkError, TimeoutError } from './errors';

export interface RequestOptions extends RequestInit {
  timeout?: number;
}

export async function makeRequest<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { timeout = 30000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': '@abnerjezweb/wordpress-mcp-client',
        ...(fetchOptions.headers as Record<string, string>),
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}) as any);
      throw new WordPressMCPError(
        (errorData as any).message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        (errorData as any).code
      );
    }

    const data = await response.json();
    return data as T;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new TimeoutError();
    }

    if (error instanceof WordPressMCPError) {
      throw error;
    }

    throw new NetworkError(error.message || 'Network request failed');
  }
}