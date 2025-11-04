import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import { SquidexClientConfig } from '../types/config';
import { handleSquidexError, isRetryableError } from '../utils/error-handler';

/**
 * HTTP client wrapper for ap-games-api requests
 */
export class HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(config: SquidexClientConfig) {

    this.axiosInstance = axios.create({
      baseURL: config.apiBaseUrl,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    // Configure retry logic
    axiosRetry(this.axiosInstance, {
      retries: config.retries || 3,
      retryDelay: (retryCount) => {
        const delay = config.retryDelay || 1000;
        return delay * Math.pow(2, retryCount - 1); // Exponential backoff
      },
      retryCondition: (error) => {
        return isRetryableError(error);
      },
    });

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        handleSquidexError(error);
      }
    );
  }

  /**
   * Make a GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  /**
   * Make a POST request
   */
  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Make a PUT request
   */
  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Make a PATCH request
   */
  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  /**
   * Get the underlying Axios instance (for advanced usage)
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}
