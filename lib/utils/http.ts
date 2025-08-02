import type { ApiResponse } from "@/lib/types";

interface HttpClientConfig {
  baseUrl?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

class HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(config: HttpClientConfig = {}) {
    this.baseUrl = config.baseUrl || "";
    this.defaultHeaders = config.headers || {};
    this.timeout = config.timeout || 30000;
  }

  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const fullUrl = this.baseUrl + url;
    const headers = {
      "Content-Type": "application/json",
      ...this.defaultHeaders,
      ...options.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers,
        signal: options.signal || controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          success: false,
          code: response.status,
          message: `HTTP ${response.status}: ${response.statusText}`,
          data: null as T,
        };
      }

      const data = await response.json();
      return {
        success: true,
        code: response.status,
        message: "Request successful",
        data,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          return {
            success: false,
            code: "TIMEOUT",
            message: "Request timeout",
            data: null as T,
          };
        }
        
        return {
          success: false,
          code: "NETWORK_ERROR",
          message: error.message,
          data: null as T,
        };
      }

      return {
        success: false,
        code: "UNKNOWN_ERROR",
        message: "An unknown error occurred",
        data: null as T,
      };
    }
  }

  async get<T>(url: string, config: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: "GET" });
  }

  async post<T>(
    url: string,
    data?: unknown,
    config: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Create authenticated HTTP client factory
export function createHttpClient(token?: string): HttpClient {
  const headers: Record<string, string> = {};
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return new HttpClient({
    baseUrl: process.env.NEXT_PUBLIC_DATA_API_URL || process.env.DATA_API_URL,
    headers,
    timeout: 30000,
  });
}

export default HttpClient;