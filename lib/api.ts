// import axios, { AxiosError } from "axios";

// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:4000";

// export const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.request.use((config) => {
//   if (typeof window !== "undefined") {
//     const token = localStorage.getItem("hms_admin_token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   }

//   return config;
// });

// api.interceptors.response.use(
//   (response) => response,
//   (error: AxiosError<{ message?: string | string[] }>) => {
//     if (error.response?.status === 401 && typeof window !== "undefined") {
//       localStorage.removeItem("hms_admin_token");
//       localStorage.removeItem("hms_admin_name");
//       window.location.href = "/admin/login";
//     }

//     return Promise.reject(error);
//   }
// );

// export function getApiErrorMessage(error: unknown): string {
//   if (axios.isAxiosError(error)) {
//     const message = error.response?.data?.message;

//     if (Array.isArray(message)) {
//       return message.join(", ");
//     }

//     if (typeof message === "string") {
//       return message;
//     }

//     return error.message;
//   }

//   return "Something went wrong";
// }


import axios, { AxiosError } from "axios";
import {
  clearAuthStorage,
  getStoredToken,
  isTokenExpired,
} from "@/lib/auth-storage";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:4000";

function redirectToLogin() {
  if (typeof window === "undefined") {
    return;
  }

  if (window.location.pathname !== "/admin/login") {
    window.location.href = "/admin/login?expired=1";
  }
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();

    if (token) {
      if (isTokenExpired(token)) {
        clearAuthStorage();
        redirectToLogin();

        return Promise.reject(new Error("Session expired. Please login again."));
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string | string[] }>) => {
    if (error.response?.status === 401) {
      clearAuthStorage();
      redirectToLogin();
    }

    return Promise.reject(error);
  }
);

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
      return message.join(", ");
    }

    if (typeof message === "string") {
      return message;
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}