import axios from 'axios';
import { ML_SERVICE_URL } from '../config/env.js';

/**
 * Axios Instance
 *
 * Pre-configured axios instance with timeout for calling
 * external services (Gemini API, FastAPI ML service).
 * Interceptors will be added later for logging and error handling.
 */

const axiosInstance = axios.create({
  baseURL: ML_SERVICE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors will be added later for request/response logging and error handling

export default axiosInstance;
