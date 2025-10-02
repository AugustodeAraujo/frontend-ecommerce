// src/api/axios.ts
import axios from "axios";
import Cookies from "js-cookie";

const DEFAULT_BASE_API = "http://localhost:3333/api";
const rawBaseApi = import.meta.env.BASE_API ?? DEFAULT_BASE_API;
let baseURL = DEFAULT_BASE_API;

try {
  const url = new URL(rawBaseApi);
  if (url.pathname === "/" || url.pathname === "") {
    url.pathname = "/api";
  }
  baseURL = url.toString().replace(/\/$/, "");
} catch {
  baseURL = rawBaseApi.endsWith("/api")
    ? rawBaseApi.replace(/\/$/, "")
    : DEFAULT_BASE_API;
}

const api = axios.create({
  baseURL,
});

// Interceptor global: injeta o Bearer token se existir
api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
