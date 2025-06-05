import axios, { AxiosRequestConfig } from "axios";

const BASE_BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://dev.cordestitch.com";

// GET Request
export const fetchData = async <T>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await axios.get(`${BASE_BACKEND_URL}${endpoint}`, {
      ...config,
      withCredentials: true,
      headers: {
        ...config?.headers,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// POST Request
export const submitData = async <T>(
  endpoint: string,
  payload?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await axios.post(`${BASE_BACKEND_URL}${endpoint}`, payload, {
      ...config,
      withCredentials: true,
      headers: {
        ...config?.headers,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// PUT Request
export const updateData = async <T>(
  endpoint: string,
  payload?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await axios.put(`${BASE_BACKEND_URL}${endpoint}`, payload, {
      ...config,
      withCredentials: true,
      headers: {
        ...config?.headers,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// DELETE Request
export const removeData = async <T>(
  endpoint: string,
  payload?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await axios.delete(`${BASE_BACKEND_URL}${endpoint}`, {
      ...config,
      withCredentials: true,
      headers: {
        ...config?.headers,
        'Content-Type': 'application/json',
      },
      data: payload,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// POST Request for FormData
export const uploadFormData = async <T>(
  endpoint: string,
  formData?: FormData | unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const updatedConfig: AxiosRequestConfig = {
      ...config,
      withCredentials: true,
      headers: {
        ...config?.headers,
      },
    };

    const response = await axios.post(`${BASE_BACKEND_URL}${endpoint}`, formData, updatedConfig);
    return response.data;
  } catch (error) {
    throw error;
  }
};