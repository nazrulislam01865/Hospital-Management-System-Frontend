export type TokenPayload = {
  sub?: number;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
};

export function getStoredToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("hms_admin_token");
}

export function getStoredAdminName() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("hms_admin_name");
}

export function clearAuthStorage() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("hms_admin_token");
  localStorage.removeItem("hms_admin_name");
}

export function getTokenPayload(token: string): TokenPayload | null {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    return JSON.parse(atob(payload)) as TokenPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string) {
  const payload = getTokenPayload(token);

  if (!payload?.exp) {
    return true;
  }

  const currentTimeInSeconds = Math.floor(Date.now() / 1000);

  return payload.exp <= currentTimeInSeconds;
}

export function getAdminIdFromToken() {
  const token = getStoredToken();

  if (!token || isTokenExpired(token)) {
    return null;
  }

  const payload = getTokenPayload(token);

  return payload?.sub ?? null;
}