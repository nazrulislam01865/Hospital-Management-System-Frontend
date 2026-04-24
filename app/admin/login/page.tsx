"use client";

import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent, type JSX } from "react";
import { z } from "zod";

// Zod schema
const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginData = z.infer<typeof loginSchema>;
type LoginErrors = Partial<Record<keyof LoginData, string>>;

const initialLoginData: LoginData = {
  email: "",
  password: "",
};

export default function LoginPage(): JSX.Element {
  const [formData, setFormData] = useState<LoginData>(initialLoginData);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [message, setMessage] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const field = e.target.name as keyof LoginData;

    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    setErrors((prev) => {
      const nextErrors = { ...prev };
      delete nextErrors[field];
      return nextErrors;
    });

    setMessage("");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: LoginErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginData;

        if (field) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);
      setMessage("");
      return;
    }

    const loginPayload = {
      email: result.data.email,
      password: result.data.password,
    };

    console.log(loginPayload);

    setFormData(initialLoginData);
    setErrors({});
    setMessage("Login form submitted successfully");
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-900">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-cyan-700 via-blue-800 to-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
              Hospital Management
            </p>

            <h1 className="mt-6 max-w-md text-4xl font-bold leading-tight">
              Manage patients, appointments, rooms and billing from one secure
              dashboard.
            </h1>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur">
            <p className="text-sm text-cyan-100">Admin Portal</p>
            <p className="mt-2 text-2xl font-semibold">Secure Login</p>
            <p className="mt-3 text-sm leading-6 text-slate-200">
              Sign in with your registered admin email and password to access
              the dashboard.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-700">
                Welcome back
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-950">
                Admin Login
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Enter your credentials to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
                />

                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
                />

                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>

              {message && (
                <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                  {message}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-cyan-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-700/20 transition hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-200"
              >
                Login
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Do not have an admin account?{" "}
              <Link
                href="/admin/signup"
                className="font-semibold text-cyan-700 hover:text-cyan-800"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}