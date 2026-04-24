import type { LoginFormData, SignupFormData } from "./schemas";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3000";

type SignupPayload = Omit<SignupFormData, "confirmPassword">;

export async function signupAdmin(data: SignupPayload) {
  const response = await fetch(`${API_BASE_URL}/auth/register-admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      Array.isArray(result.message)
        ? result.message.join(", ")
        : result.message || "Signup failed"
    );
  }

  return result;
}

export async function loginAdmin(data: LoginFormData) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      Array.isArray(result.message)
        ? result.message.join(", ")
        : result.message || "Login failed"
    );
  }

  return result;
}