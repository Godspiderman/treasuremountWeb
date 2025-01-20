import axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const useAxiosInstance = () => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ,
    headers: {
      "Content-Type": "application/json",
    },
  });
  instance.interceptors.request.use(
    (config) => {
      if (config.headers['Content-Type'] === 'multipart/form-data') {
        config.headers = {
          'Content-Type': 'multipart/form-data',
        };
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

export default useAxiosInstance;




