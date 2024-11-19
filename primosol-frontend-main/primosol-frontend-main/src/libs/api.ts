import axios from 'axios'

export function sleep(ms = 2000): Promise<void> {
  console.log('Kindly remember to remove `sleep`')
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const appBackend = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL
})

export const setAuthToken = (token: string) => {
  if (token) {
    appBackend.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete appBackend.defaults.headers.common['Authorization']
  }
}

appBackend.interceptors.request.use(
  function (config) {
    const accessToken = localStorage.getItem('token');
    if (accessToken != null) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export const tokenBackend = axios.create({
  baseURL: import.meta.env.VITE_TOKEN_API_URL
})

export const rpcBackend = axios.create({
  baseURL: import.meta.env.VITE_MAINNET_RPC_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})