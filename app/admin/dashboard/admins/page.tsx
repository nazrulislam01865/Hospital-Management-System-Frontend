// import { PageHeader } from "@/components/admin/PageHeader";
// import { StatusBadge } from "@/components/admin/StatusBadge";
// import { admins } from "@/lib/admin-data";

// export default function AdminsPage() {
//   return (
//     <div>
//       <PageHeader
//         title="Admins"
//         description="Manage admin users according to the backend admin authentication module."
//         action={
//           <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
//             Add Admin
//           </button>
//         }
//       />

//       <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//         <h2 className="mb-4 text-lg font-semibold text-slate-950">Admin Form</h2>

//         <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Admin Name" />
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Email" />
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Phone" />
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Password" type="password" />
//         </form>
//       </section>

//       <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
//         <div className="border-b border-slate-200 p-5">
//           <h2 className="text-lg font-semibold text-slate-950">Admin List</h2>
//           <p className="text-sm text-slate-500">Admin data is static until backend API connection is added.</p>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[850px] text-left text-sm">
//             <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
//               <tr>
//                 <th className="px-5 py-3">Name</th>
//                 <th className="px-5 py-3">Email</th>
//                 <th className="px-5 py-3">Phone</th>
//                 <th className="px-5 py-3">Role</th>
//                 <th className="px-5 py-3">Created</th>
//                 <th className="px-5 py-3">Status</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-slate-100">
//               {admins.map((admin) => (
//                 <tr key={admin.id} className="hover:bg-slate-50">
//                   <td className="px-5 py-4 font-semibold text-slate-900">{admin.name}</td>
//                   <td className="px-5 py-4 text-slate-700">{admin.email}</td>
//                   <td className="px-5 py-4 text-slate-700">{admin.phone}</td>
//                   <td className="px-5 py-4 text-slate-700">{admin.role}</td>
//                   <td className="px-5 py-4 text-slate-700">{admin.createdAt}</td>
//                   <td className="px-5 py-4">
//                     <StatusBadge status={admin.status} />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </section>
//     </div>
//   );
// }

"use client";

import { useEffect, useState, type FormEvent } from "react";
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

type AdminForm = {
  name: string;
  uname: string;
  email: string;
  password: string;
  dateOfBirth: string;
  socialMediaLinks: string;
};

type AdminFormErrors = {
  name?: string;
  uname?: string;
  email?: string;
  password?: string;
  dateOfBirth?: string;
  socialMediaLinks?: string;
};

const initialForm: AdminForm = {
  name: "",
  uname: "",
  email: "",
  password: "",
  dateOfBirth: "",
  socialMediaLinks: "",
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

function getErrorMessages(error: unknown) {
  if (axios.isAxiosError(error)) {
    const backendMessage = error.response?.data?.message;

    if (Array.isArray(backendMessage)) {
      return backendMessage.map((message) => String(message));
    }

    if (typeof backendMessage === "string") {
      return [backendMessage];
    }

    return [error.message];
  }

  return ["Something went wrong."];
}

function getErrorMessage(error: unknown) {
  return getErrorMessages(error).join(", ");
}

function mapBackendErrorsToFields(messages: string[]): AdminFormErrors {
  const errors: AdminFormErrors = {};

  messages.forEach((message) => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("same email or username")) {
      errors.email = message;
      errors.uname = message;
      return;
    }

    if (lowerMessage.includes("name field") || lowerMessage.includes("name")) {
      errors.name = message;
      return;
    }

    if (
      lowerMessage.includes("username") ||
      lowerMessage.includes("uname")
    ) {
      errors.uname = message;
      return;
    }

    if (lowerMessage.includes("email")) {
      errors.email = message;
      return;
    }

    if (lowerMessage.includes("password")) {
      errors.password = message;
      return;
    }

    if (lowerMessage.includes("date")) {
      errors.dateOfBirth = message;
      return;
    }

    if (
      lowerMessage.includes("social media") ||
      lowerMessage.includes("social") ||
      lowerMessage.includes("link") ||
      lowerMessage.includes("url")
    ) {
      errors.socialMediaLinks = message;
    }
  });

  return errors;
}

function getAdminId(admin: Admin) {
  return admin.adminId ?? admin.id;
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

function toDateInputValue(dateValue?: string | null) {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue.slice(0, 10);
  }

  return date.toISOString().slice(0, 10);
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return Boolean(url.protocol);
  } catch {
    return false;
  }
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [form, setForm] = useState<AdminForm>(initialForm);
  const [formErrors, setFormErrors] = useState<AdminFormErrors>({});
  const [editingAdminId, setEditingAdminId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadAdmins();
  }, []);

  async function loadAdmins() {
    try {
      setPageLoading(true);
      setError("");

      const response = await axios.get(
        `${API_ENDPOINT}/admin/admins`,
        getAuthHeaders()
      );

      const adminsData = extractData<Admin[]>(response);

      setAdmins(Array.isArray(adminsData) ? adminsData : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPageLoading(false);
    }
  }

  function resetForm() {
    setForm(initialForm);
    setFormErrors({});
    setEditingAdminId(null);
    setError("");
    setMessage("");
  }

  function clearFieldError(field: keyof AdminForm) {
    setFormErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));

    setError("");
  }

  function getInputClass(field: keyof AdminForm) {
    return `w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-500 ${
      formErrors[field] ? "border-red-400" : "border-slate-200"
    }`;
  }

  function validateForm() {
    const errors: AdminFormErrors = {};

    const name = form.name.trim();
    const uname = form.uname.trim();
    const email = form.email.trim();
    const password = form.password.trim();
    const socialMediaLinks = form.socialMediaLinks.trim();

    if (!name) {
      errors.name = "Name field is required.";
    } else if (/\d/.test(name)) {
      errors.name = "Name field should not contain any numbers.";
    }

    if (!uname) {
      errors.uname = "Username field is required.";
    }

    if (!email) {
      errors.email = "Email field is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please provide a valid email address.";
    }

    if (!password) {
      errors.password = "Password field is required.";
    } else if (!/^(?=.*[@#$&]).+$/.test(password)) {
      errors.password =
        "Password must contain at least one special character (@ or # or $ or &).";
    }

    if (form.dateOfBirth) {
      const date = new Date(form.dateOfBirth);

      if (Number.isNaN(date.getTime())) {
        errors.dateOfBirth = "Please provide a valid date.";
      }
    }

    if (socialMediaLinks && !isValidUrl(socialMediaLinks)) {
      errors.socialMediaLinks =
        "Please provide a valid social media link. Example: https://facebook.com/username";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  }

  function buildAdminPayload() {
    return {
      name: form.name.trim(),
      uname: form.uname.trim(),
      email: form.email.trim(),
      password: form.password.trim(),
      ...(form.dateOfBirth ? { dateOfBirth: form.dateOfBirth } : {}),
      ...(form.socialMediaLinks.trim()
        ? { socialMediaLinks: form.socialMediaLinks.trim() }
        : {}),
    };
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const payload = buildAdminPayload();

      if (editingAdminId) {
        await axios.put(
          `${API_ENDPOINT}/admin/admins/${editingAdminId}`,
          payload,
          getAuthHeaders()
        );

        setMessage("Admin updated successfully.");
      } else {
        await axios.post(
          `${API_ENDPOINT}/admin/admins`,
          payload,
          getAuthHeaders()
        );

        setMessage("Admin created successfully.");
      }

      setForm(initialForm);
      setFormErrors({});
      setEditingAdminId(null);
      await loadAdmins();
    } catch (err) {
      const messages = getErrorMessages(err);
      const fieldErrors = mapBackendErrorsToFields(messages);

      if (Object.keys(fieldErrors).length > 0) {
        setFormErrors((prev) => ({
          ...prev,
          ...fieldErrors,
        }));
      } else {
        setError(messages.join(", "));
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleEditAdmin(admin: Admin) {
    const adminId = getAdminId(admin);

    if (!adminId) {
      setError("Admin ID was not found for this record.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");
      setFormErrors({});

      const response = await axios.get(
        `${API_ENDPOINT}/admin/admins/${adminId}`,
        getAuthHeaders()
      );

      const adminDetails = extractData<Admin>(response);

      setEditingAdminId(adminId);
      setForm({
        name: adminDetails.name || admin.name || "",
        uname: adminDetails.uname || admin.uname || "",
        email: adminDetails.email || admin.email || "",
        password: "",
        dateOfBirth: toDateInputValue(
          adminDetails.dateOfBirth ?? admin.dateOfBirth ?? ""
        ),
        socialMediaLinks:
          adminDetails.socialMediaLinks || admin.socialMediaLinks || "",
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAdmin(admin: Admin) {
    const adminId = getAdminId(admin);

    if (!adminId) {
      setError("Admin ID was not found for this record.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");
      setFormErrors({});

      await axios.delete(
        `${API_ENDPOINT}/admin/admins/${adminId}`,
        getAuthHeaders()
      );

      if (editingAdminId === adminId) {
        setForm(initialForm);
        setEditingAdminId(null);
      }

      setMessage("Admin deleted successfully.");
      await loadAdmins();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Admins"
        description="Manage admin users using the fields supported by the backend admin API."
        action={
          <button
            type="button"
            onClick={resetForm}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Add Admin
          </button>
        }
      />

      {message ? (
        <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              {editingAdminId ? "Update Admin" : "Admin Form"}
            </h2>
            <p className="text-sm text-slate-500">
              Backend fields: name, username, email, password, date of birth,
              and social media link.
            </p>
          </div>

          {editingAdminId ? (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
            >
              Cancel Update
            </button>
          ) : null}
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          <div>
            <input
              className={getInputClass("name")}
              placeholder="Admin Name"
              value={form.name}
              aria-invalid={Boolean(formErrors.name)}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                clearFieldError("name");
              }}
            />

            {formErrors.name ? (
              <p className="mt-1 text-xs font-medium text-red-600">
                {formErrors.name}
              </p>
            ) : null}
          </div>

          <div>
            <input
              className={getInputClass("uname")}
              placeholder="Username"
              value={form.uname}
              aria-invalid={Boolean(formErrors.uname)}
              onChange={(e) => {
                setForm({ ...form, uname: e.target.value });
                clearFieldError("uname");
              }}
            />

            {formErrors.uname ? (
              <p className="mt-1 text-xs font-medium text-red-600">
                {formErrors.uname}
              </p>
            ) : null}
          </div>

          <div>
            <input
              className={getInputClass("email")}
              placeholder="Email"
              type="email"
              value={form.email}
              aria-invalid={Boolean(formErrors.email)}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                clearFieldError("email");
              }}
            />

            {formErrors.email ? (
              <p className="mt-1 text-xs font-medium text-red-600">
                {formErrors.email}
              </p>
            ) : null}
          </div>

          <div>
            <input
              className={getInputClass("password")}
              placeholder={
                editingAdminId
                  ? "Password required for update"
                  : "Password"
              }
              type="password"
              value={form.password}
              aria-invalid={Boolean(formErrors.password)}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                clearFieldError("password");
              }}
            />

            {formErrors.password ? (
              <p className="mt-1 text-xs font-medium text-red-600">
                {formErrors.password}
              </p>
            ) : null}
          </div>

          <div>
            <input
              className={getInputClass("dateOfBirth")}
              type="date"
              value={form.dateOfBirth}
              aria-invalid={Boolean(formErrors.dateOfBirth)}
              onChange={(e) => {
                setForm({ ...form, dateOfBirth: e.target.value });
                clearFieldError("dateOfBirth");
              }}
            />

            {formErrors.dateOfBirth ? (
              <p className="mt-1 text-xs font-medium text-red-600">
                {formErrors.dateOfBirth}
              </p>
            ) : null}
          </div>

          <div>
            <input
              className={getInputClass("socialMediaLinks")}
              placeholder="Social Media Link"
              type="url"
              value={form.socialMediaLinks}
              aria-invalid={Boolean(formErrors.socialMediaLinks)}
              onChange={(e) => {
                setForm({ ...form, socialMediaLinks: e.target.value });
                clearFieldError("socialMediaLinks");
              }}
            />

            {formErrors.socialMediaLinks ? (
              <p className="mt-1 text-xs font-medium text-red-600">
                {formErrors.socialMediaLinks}
              </p>
            ) : null}
          </div>

          <div className="flex justify-end gap-2 md:col-span-2 xl:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading
                ? editingAdminId
                  ? "Updating..."
                  : "Creating..."
                : editingAdminId
                  ? "Update Admin"
                  : "Create Admin"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-950">Admin List</h2>
          <p className="text-sm text-slate-500">
            Data is loaded from the backend admin API.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Username</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Date of Birth</th>
                <th className="px-5 py-3">Social Link</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {pageLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-slate-500"
                  >
                    Loading admins...
                  </td>
                </tr>
              ) : null}

              {!pageLoading &&
                admins.map((admin) => {
                  const adminId = getAdminId(admin);

                  return (
                    <tr
                      key={adminId ?? admin.email}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        {adminId ? `#${adminId}` : "N/A"}
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-900">
                        {admin.name}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {admin.uname || "N/A"}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {admin.email}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {formatDate(admin.dateOfBirth)}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {admin.socialMediaLinks ? (
                          <a
                            href={admin.socialMediaLinks}
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-blue-600 hover:text-blue-700"
                          >
                            Open Link
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditAdmin(admin)}
                            disabled={loading}
                            className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Update
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteAdmin(admin)}
                            disabled={loading}
                            className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

              {!pageLoading && admins.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-slate-500"
                  >
                    No admins found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}