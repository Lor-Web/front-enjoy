import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3001",
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("fe-auth-token");
  if (!raw || raw === "null") {
    return config;
  }
  try {
    const token = JSON.parse(raw) as string | null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    return config;
  }
  return config;
});

export function getApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message) {
      return message;
    }
    if (Array.isArray(message) && message.length > 0) {
      return message.filter((item) => typeof item === "string").join(". ");
    }
  }
  return "Не получилось выполнить запрос";
}
