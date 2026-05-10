"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "axios";
import { PageHeader } from "@/components/admin/PageHeader";

type Admin = {
  id?: number;
  adminId?: number;
  name: string;
  uname?: string;
  email: string;
  dateOfBirth?: string | null;
  socialMediaLinks?: string | null;
  createdAt?: string | null;
};

const API_ENDPOINT =
  process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:4000";

function getToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem("hms_admin_token") || "";
}

function getAuthHeaders() {
  const token = getToken();

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

function extractData<T>(response: { data: { data?: T } | T }): T {
  if (
    response.data &&
    typeof response.data === "object" &&
    "data" in response.data
  ) {
    return response.data.data as T;
  }

  return response.data as T;
}

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const backendMessage = error.response?.data?.message;

    if (Array.isArray(backendMessage)) {
      return backendMessage.join(", ");
    }

    if (typeof backendMessage === "string") {
      return backendMessage;
    }

    return error.message;
  }

  return "Something went wrong.";
}

function getAdminId(admin?: Admin | null) {
  return admin?.adminId ?? admin?.id;
}

function formatDate(dateValue?: string | null) {
  if (!dateValue) {
    return "N/A";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString();
}

function formatDateTime(dateValue?: string | null) {
  if (!dateValue) {
    return "N/A";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleString();
}

export default function AdminDetailsPage() {
  const params = useParams<{ id: string }>();
  const adminId = Number(params.id);

  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!Number.isInteger(adminId) || adminId < 1) {
      setError("Invalid admin ID.");
      setLoading(false);
      return;
    }

    loadAdmin();
  }, [adminId]);

  async function loadAdmin() {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_ENDPOINT}/admin/admins/${adminId}`,
        getAuthHeaders()
      );

      const adminData = extractData<Admin>(response);
      setAdmin(adminData);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Admin Details"
        description="Dynamic admin details page."
        action={
          <Link
            href="/admin/dashboard/admins"
            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            Back to Admins
          </Link>
        }
      />

      {error ? (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm font-medium text-slate-600 shadow-sm">
          Loading admin details...
        </div>
      ) : null}

      {!loading && admin ? (
        <>
          <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Admin ID</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950">
                #{getAdminId(admin) || "N/A"}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Internal admin identifier
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Name</p>
              <h3 className="mt-2 text-xl font-bold text-slate-950">
                {admin.name || "N/A"}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Admin profile name
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Username</p>
              <h3 className="mt-2 text-xl font-bold text-slate-950">
                {admin.uname || "N/A"}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Login username
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Email</p>
              <h3 className="mt-2 break-all text-lg font-bold text-slate-950">
                {admin.email || "N/A"}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Registered email address
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-950">
              Admin Information
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Admin ID
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {getAdminId(admin) || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Name
                </p>
                <p className="mt-1 text-slate-700">{admin.name || "N/A"}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Username
                </p>
                <p className="mt-1 text-slate-700">{admin.uname || "N/A"}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Email
                </p>
                <p className="mt-1 break-all text-slate-700">
                  {admin.email || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Date of Birth
                </p>
                <p className="mt-1 text-slate-700">
                  {formatDate(admin.dateOfBirth)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Created At
                </p>
                <p className="mt-1 text-slate-700">
                  {formatDateTime(admin.createdAt)}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Social Media Link
                </p>

                {admin.socialMediaLinks ? (
                  <a
                    href={admin.socialMediaLinks}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block break-all font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {admin.socialMediaLinks}
                  </a>
                ) : (
                  <p className="mt-1 text-slate-700">N/A</p>
                )}
              </div>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}