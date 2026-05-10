"use client";

import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";

type Patient = {
  id: number;
  uniqueId?: string;
  name: string;
  email: string;
  dateOfBirth?: string;
  socialMediaLinks?: string[];
  createdAt?: string;
};

const initialForm = {
  name: "",
  email: "",
  password: "",
  dateOfBirth: "",
  socialMediaLinks: "",
};

type PatientForm = typeof initialForm;
type PatientFormField = keyof PatientForm;
type FormErrors = Partial<Record<PatientFormField, string[]>>;

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

function getBackendMessages(error: unknown) {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;
    const backendMessage = responseData?.message;

    if (Array.isArray(backendMessage)) {
      return backendMessage.map(String);
    }

    if (typeof backendMessage === "string") {
      return [backendMessage];
    }

    if (typeof responseData?.error === "string") {
      return [responseData.error];
    }

    return [error.message];
  }

  return ["Something went wrong."];
}

function addFieldError(
  errors: FormErrors,
  field: PatientFormField,
  message: string
) {
  if (!errors[field]) {
    errors[field] = [];
  }

  if (!errors[field]?.includes(message)) {
    errors[field]?.push(message);
  }
}

function mapBackendMessagesToFields(messages: string[]) {
  const fieldErrors: FormErrors = {};
  const generalErrors: string[] = [];

  messages.forEach((message) => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("name")) {
      addFieldError(fieldErrors, "name", message);
      return;
    }

    if (lowerMessage.includes("email")) {
      addFieldError(fieldErrors, "email", message);
      return;
    }

    if (lowerMessage.includes("password")) {
      addFieldError(fieldErrors, "password", message);
      return;
    }

    if (
      lowerMessage.includes("dateofbirth") ||
      lowerMessage.includes("date of birth") ||
      lowerMessage.includes("birth") ||
      lowerMessage.includes("date")
    ) {
      addFieldError(fieldErrors, "dateOfBirth", message);
      return;
    }

    if (
      lowerMessage.includes("socialmedialinks") ||
      lowerMessage.includes("social") ||
      lowerMessage.includes("url") ||
      lowerMessage.includes("link")
    ) {
      addFieldError(fieldErrors, "socialMediaLinks", message);
      return;
    }

    generalErrors.push(message);
  });

  return { fieldErrors, generalErrors };
}

function parseSocialMediaLinks(value: string) {
  return value
    .split(",")
    .map((link) => link.trim())
    .filter(Boolean);
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return Boolean(url.protocol && url.hostname);
  } catch {
    return false;
  }
}

function validateSingleField(
  field: PatientFormField,
  values: PatientForm,
  isEditing: boolean
) {
  const errors: string[] = [];

  if (field === "name") {
    const name = values.name.trim();

    if (!name) {
      errors.push("Patient name is required.");
    } else if (/\d/.test(name)) {
      errors.push("Name field should not contain any numbers.");
    }
  }

  if (field === "email") {
    const email = values.email.trim();

    if (!email) {
      errors.push("Email is required.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Please provide a valid email address.");
    }
  }

  if (field === "password") {
    if (!isEditing && !values.password) {
      errors.push("Password field is required.");
    }

    if (values.password && !/[@#$&]/.test(values.password)) {
      errors.push(
        "Password must contain at least one special character (@ or # or $ or &)."
      );
    }
  }

  if (field === "dateOfBirth") {
    if (!values.dateOfBirth) {
      errors.push("Date of birth is required.");
    } else if (Number.isNaN(new Date(values.dateOfBirth).getTime())) {
      errors.push("Please provide a valid date.");
    }
  }

  if (field === "socialMediaLinks") {
    const socialLinks = parseSocialMediaLinks(values.socialMediaLinks);

    if (
      values.socialMediaLinks.trim() &&
      socialLinks.some((link) => !isValidUrl(link))
    ) {
      errors.push(
        "Each social media link must be a valid URL with protocol, for example https://example.com."
      );
    }
  }

  return errors;
}

function toDateInputValue(dateValue?: string) {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toISOString().slice(0, 10);
}

function formatDate(dateValue?: string) {
  if (!dateValue) {
    return "N/A";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString();
}

function calculateAge(dateValue?: string) {
  if (!dateValue) {
    return "N/A";
  }

  const birthDate = new Date(dateValue);

  if (Number.isNaN(birthDate.getTime())) {
    return "N/A";
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return String(age);
}

function formatSocialLinks(links?: string[]) {
  if (!links || links.length === 0) {
    return "N/A";
  }

  return links.join(", ");
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [form, setForm] = useState<PatientForm>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [errorSummary, setErrorSummary] = useState<string[]>([]);
  const [errorTitle, setErrorTitle] = useState("");
  const [editingPatientId, setEditingPatientId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState("");

  const isEditing = editingPatientId !== null;

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    try {
      setPageLoading(true);
      clearErrors();

      const response = await axios.get(
        `${API_ENDPOINT}/admin/patients`,
        getAuthHeaders()
      );

      const patientsData = extractData<Patient[]>(response);
      setPatients(Array.isArray(patientsData) ? patientsData : []);
    } catch (err) {
      setErrorTitle("Patients could not be loaded because:");
      setErrorSummary(getBackendMessages(err));
    } finally {
      setPageLoading(false);
    }
  }

  function clearErrors() {
    setFieldErrors({});
    setErrorSummary([]);
    setErrorTitle("");
  }

  function resetPatientForm() {
    setForm(initialForm);
    setEditingPatientId(null);
    clearErrors();
  }

  function handleEditPatient(patient: Patient) {
    setEditingPatientId(patient.id);
    setForm({
      name: patient.name || "",
      email: patient.email || "",
      password: "",
      dateOfBirth: toDateInputValue(patient.dateOfBirth),
      socialMediaLinks: patient.socialMediaLinks?.join(", ") || "",
    });

    clearErrors();
    setMessage(
      "Editing patient. Leave password blank to keep the existing password."
    );
  }

  function handleCancelEdit() {
    resetPatientForm();
    setMessage("");
  }

  function handleFieldChange(field: PatientFormField, value: string) {
    setForm((previousForm) => ({
      ...previousForm,
      [field]: value,
    }));

    setMessage("");

    setFieldErrors((previousErrors) => {
      const nextErrors = { ...previousErrors };
      delete nextErrors[field];
      return nextErrors;
    });

    setErrorSummary([]);
    setErrorTitle("");
  }

  function handleFieldBlur(field: PatientFormField) {
    const messages = validateSingleField(field, form, isEditing);

    setFieldErrors((previousErrors) => {
      const nextErrors = { ...previousErrors };

      if (messages.length > 0) {
        nextErrors[field] = messages;
      } else {
        delete nextErrors[field];
      }

      return nextErrors;
    });
  }

  function getInputClass(field: PatientFormField) {
    const hasError = Boolean(fieldErrors[field]?.length);

    return [
      "w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2",
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
        : "border-slate-200 focus:border-blue-500 focus:ring-blue-100",
    ].join(" ");
  }

  function renderFieldError(field: PatientFormField) {
    const messages = fieldErrors[field];

    if (!messages || messages.length === 0) {
      return null;
    }

    return (
      <div id={`${field}-error`} className="mt-1 space-y-1">
        {messages.map((fieldError) => (
          <p key={fieldError} className="text-xs font-medium text-red-600">
            {fieldError}
          </p>
        ))}
      </div>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const patientPayload: {
      name: string;
      email: string;
      password?: string;
      dateOfBirth: string;
      socialMediaLinks: string[];
    } = {
      name: form.name.trim(),
      email: form.email.trim(),
      dateOfBirth: form.dateOfBirth,
      socialMediaLinks: parseSocialMediaLinks(form.socialMediaLinks),
    };

    if (!isEditing || form.password) {
      patientPayload.password = form.password;
    }

    try {
      setLoading(true);
      setMessage("");
      clearErrors();

      if (isEditing) {
        await axios.put(
          `${API_ENDPOINT}/admin/patients/${editingPatientId}`,
          patientPayload,
          getAuthHeaders()
        );

        setMessage("Patient updated successfully.");
      } else {
        await axios.post(
          `${API_ENDPOINT}/admin/patients`,
          patientPayload,
          getAuthHeaders()
        );

        setMessage("Patient created successfully.");
      }

      resetPatientForm();
      await loadPatients();
    } catch (err) {
      const backendMessages = getBackendMessages(err);
      const { fieldErrors: backendFieldErrors, generalErrors } =
        mapBackendMessagesToFields(backendMessages);

      const mappedMessages = Object.values(backendFieldErrors).flatMap(
        (messages) => messages || []
      );

      const visibleMessages =
        mappedMessages.length > 0 || generalErrors.length > 0
          ? [...mappedMessages, ...generalErrors]
          : backendMessages;

      setFieldErrors(backendFieldErrors);
      setErrorTitle(
        isEditing
          ? "Patient was not updated because:"
          : "Patient was not created because:"
      );
      setErrorSummary(visibleMessages);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePatient(id: number) {
    try {
      setMessage("");
      clearErrors();

      await axios.delete(
        `${API_ENDPOINT}/admin/patients/${id}`,
        getAuthHeaders()
      );

      if (editingPatientId === id) {
        resetPatientForm();
      }

      setMessage("Patient deleted successfully.");
      await loadPatients();
    } catch (err) {
      setErrorTitle("Patient could not be deleted because:");
      setErrorSummary(getBackendMessages(err));
    }
  }

  return (
    <div>
      <PageHeader
        title="Patients"
        description="Manage patient profile information according to the backend patient module."
      />

      {message ? (
        <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {message}
        </div>
      ) : null}

      {errorTitle || errorSummary.length > 0 ? (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorTitle ? <p className="font-semibold">{errorTitle}</p> : null}

          {errorSummary.length > 0 ? (
            <ul className="mt-2 list-disc space-y-1 pl-5 font-medium">
              {errorSummary.map((summaryError) => (
                <li key={summaryError}>{summaryError}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-950">
            {isEditing ? "Update Patient" : "Patient Form"}
          </h2>
          <p className="text-sm text-slate-500">
            {isEditing
              ? "Update backend-supported patient fields. Leave password blank to keep the existing password."
              : "Only backend-supported patient fields are shown here."}
          </p>
        </div>

        <form
          id="patient-form"
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          noValidate
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Patient Name
            </label>
            <input
              className={getInputClass("name")}
              placeholder="Patient Name"
              value={form.name}
              onBlur={() => handleFieldBlur("name")}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              aria-invalid={Boolean(fieldErrors.name?.length)}
              aria-describedby={
                fieldErrors.name?.length ? "name-error" : undefined
              }
            />
            {renderFieldError("name")}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              className={getInputClass("email")}
              placeholder="Email"
              type="email"
              value={form.email}
              onBlur={() => handleFieldBlur("email")}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              aria-invalid={Boolean(fieldErrors.email?.length)}
              aria-describedby={
                fieldErrors.email?.length ? "email-error" : undefined
              }
            />
            {renderFieldError("email")}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              {isEditing ? "New Password (optional)" : "Password"}
            </label>
            <input
              className={getInputClass("password")}
              placeholder={
                isEditing ? "Leave blank to keep existing password" : "Password"
              }
              type="password"
              value={form.password}
              onBlur={() => handleFieldBlur("password")}
              onChange={(e) => handleFieldChange("password", e.target.value)}
              aria-invalid={Boolean(fieldErrors.password?.length)}
              aria-describedby={
                fieldErrors.password?.length ? "password-error" : undefined
              }
            />
            {renderFieldError("password")}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Date of Birth
            </label>
            <input
              className={getInputClass("dateOfBirth")}
              type="date"
              value={form.dateOfBirth}
              onBlur={() => handleFieldBlur("dateOfBirth")}
              onChange={(e) => handleFieldChange("dateOfBirth", e.target.value)}
              aria-invalid={Boolean(fieldErrors.dateOfBirth?.length)}
              aria-describedby={
                fieldErrors.dateOfBirth?.length
                  ? "dateOfBirth-error"
                  : undefined
              }
            />
            {renderFieldError("dateOfBirth")}
          </div>

          <div className="md:col-span-2 xl:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Social Links
            </label>
            <input
              className={getInputClass("socialMediaLinks")}
              placeholder="https://facebook.com/example, https://linkedin.com/in/example"
              value={form.socialMediaLinks}
              onBlur={() => handleFieldBlur("socialMediaLinks")}
              onChange={(e) =>
                handleFieldChange("socialMediaLinks", e.target.value)
              }
              aria-invalid={Boolean(fieldErrors.socialMediaLinks?.length)}
              aria-describedby={
                fieldErrors.socialMediaLinks?.length
                  ? "socialMediaLinks-error"
                  : undefined
              }
            />
            {renderFieldError("socialMediaLinks")}
          </div>

          <div className="flex flex-wrap items-end gap-3 md:col-span-2 xl:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading
                ? isEditing
                  ? "Updating..."
                  : "Adding..."
                : isEditing
                  ? "Update Patient"
                  : "Add Patient"}
            </button>

            {isEditing ? (
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={loading}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-950">
            Patient List
          </h2>
          <p className="text-sm text-slate-500">
            Data is loaded from backend patient API.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Patient ID</th>
                <th className="px-5 py-3">Unique ID</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Date of Birth</th>
                <th className="px-5 py-3">Age</th>
                <th className="px-5 py-3">Social Links</th>
                <th className="px-5 py-3">Created</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {pageLoading ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-5 py-8 text-center text-slate-500"
                  >
                    Loading patients...
                  </td>
                </tr>
              ) : null}

              {!pageLoading &&
                patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {patient.id}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {patient.uniqueId || "N/A"}
                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {patient.name}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {patient.email}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {formatDate(patient.dateOfBirth)}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {calculateAge(patient.dateOfBirth)}
                    </td>

                    <td className="max-w-xs truncate px-5 py-4 text-slate-700">
                      {formatSocialLinks(patient.socialMediaLinks)}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {formatDate(patient.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status="Active" />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditPatient(patient)}
                          className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeletePatient(patient.id)}
                          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!pageLoading && patients.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-5 py-8 text-center text-slate-500"
                  >
                    No patients found.
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

// "use client";

// import { useEffect, useState, type FormEvent } from "react";
// import axios from "axios";
// import { PageHeader } from "@/components/admin/PageHeader";
// import { StatusBadge } from "@/components/admin/StatusBadge";

// type Patient = {
//   id: number;
//   uniqueId?: string;
//   name: string;
//   email: string;
//   dateOfBirth?: string;
//   socialMediaLinks?: string[];
//   createdAt?: string;
// };

// const initialForm = {
//   name: "",
//   email: "",
//   password: "",
//   dateOfBirth: "",
//   socialMediaLinks: "",
// };

// type PatientForm = typeof initialForm;
// type PatientFormField = keyof PatientForm;
// type FormErrors = Partial<Record<PatientFormField, string[]>>;

// const API_ENDPOINT =
//   process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:4000";

// function getToken() {
//   if (typeof window === "undefined") {
//     return "";
//   }

//   return localStorage.getItem("hms_admin_token") || "";
// }

// function getAuthHeaders() {
//   const token = getToken();

//   return {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
// }

// function extractData<T>(response: { data: { data?: T } | T }): T {
//   if (
//     response.data &&
//     typeof response.data === "object" &&
//     "data" in response.data
//   ) {
//     return response.data.data as T;
//   }

//   return response.data as T;
// }

// function getBackendMessages(error: unknown) {
//   if (axios.isAxiosError(error)) {
//     const responseData = error.response?.data;
//     const backendMessage = responseData?.message;

//     if (Array.isArray(backendMessage)) {
//       return backendMessage.map(String);
//     }

//     if (typeof backendMessage === "string") {
//       return [backendMessage];
//     }

//     if (typeof responseData?.error === "string") {
//       return [responseData.error];
//     }

//     return [error.message];
//   }

//   return ["Something went wrong."];
// }

// function getErrorMessage(error: unknown) {
//   return getBackendMessages(error).join(", ");
// }

// function addFieldError(
//   errors: FormErrors,
//   field: PatientFormField,
//   message: string
// ) {
//   if (!errors[field]) {
//     errors[field] = [];
//   }

//   if (!errors[field]?.includes(message)) {
//     errors[field]?.push(message);
//   }
// }

// function setSingleFieldError(
//   errors: FormErrors,
//   field: PatientFormField,
//   fieldMessages?: string[]
// ) {
//   const nextErrors = { ...errors };

//   if (fieldMessages && fieldMessages.length > 0) {
//     nextErrors[field] = fieldMessages;
//   } else {
//     delete nextErrors[field];
//   }

//   return nextErrors;
// }

// function mapBackendMessagesToFields(messages: string[]) {
//   const fieldErrors: FormErrors = {};
//   const generalErrors: string[] = [];

//   messages.forEach((message) => {
//     const lowerMessage = message.toLowerCase();

//     if (lowerMessage.includes("name")) {
//       addFieldError(fieldErrors, "name", message);
//       return;
//     }

//     if (lowerMessage.includes("email")) {
//       addFieldError(fieldErrors, "email", message);
//       return;
//     }

//     if (lowerMessage.includes("password")) {
//       addFieldError(fieldErrors, "password", message);
//       return;
//     }

//     if (
//       lowerMessage.includes("dateofbirth") ||
//       lowerMessage.includes("date of birth") ||
//       lowerMessage.includes("birth") ||
//       lowerMessage.includes("date")
//     ) {
//       addFieldError(fieldErrors, "dateOfBirth", message);
//       return;
//     }

//     if (
//       lowerMessage.includes("socialmedialinks") ||
//       lowerMessage.includes("social") ||
//       lowerMessage.includes("url") ||
//       lowerMessage.includes("link")
//     ) {
//       addFieldError(fieldErrors, "socialMediaLinks", message);
//       return;
//     }

//     generalErrors.push(message);
//   });

//   return { fieldErrors, generalErrors };
// }

// function parseSocialMediaLinks(value: string) {
//   return value
//     .split(",")
//     .map((link) => link.trim())
//     .filter(Boolean);
// }

// function isValidUrl(value: string) {
//   try {
//     const url = new URL(value);
//     return Boolean(url.protocol && url.hostname);
//   } catch {
//     return false;
//   }
// }

// function toDateInputValue(dateValue?: string) {
//   if (!dateValue) {
//     return "";
//   }

//   const date = new Date(dateValue);

//   if (Number.isNaN(date.getTime())) {
//     return dateValue;
//   }

//   return date.toISOString().slice(0, 10);
// }

// function validateForm(values: PatientForm, isEditing = false) {
//   const errors: FormErrors = {};
//   const trimmedName = values.name.trim();
//   const trimmedEmail = values.email.trim();
//   const socialLinks = parseSocialMediaLinks(values.socialMediaLinks);

//   if (!trimmedName) {
//     addFieldError(errors, "name", "Patient name is required.");
//   } else if (/\d/.test(trimmedName)) {
//     addFieldError(errors, "name", "Name field should not contain any numbers.");
//   }

//   if (!trimmedEmail) {
//     addFieldError(errors, "email", "Email is required.");
//   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
//     addFieldError(errors, "email", "Please provide a valid email address.");
//   }

//   if (!isEditing && !values.password) {
//     addFieldError(errors, "password", "Password field is required.");
//   }

//   if (values.password && !/[@#$&]/.test(values.password)) {
//     addFieldError(
//       errors,
//       "password",
//       "Password must contain at least one special character (@ or # or $ or &)."
//     );
//   }

//   if (!values.dateOfBirth) {
//     addFieldError(errors, "dateOfBirth", "Date of birth is required.");
//   } else if (Number.isNaN(new Date(values.dateOfBirth).getTime())) {
//     addFieldError(errors, "dateOfBirth", "Please provide a valid date.");
//   }

//   if (
//     values.socialMediaLinks.trim() &&
//     socialLinks.some((link) => !isValidUrl(link))
//   ) {
//     addFieldError(
//       errors,
//       "socialMediaLinks",
//       "Each social media link must be a valid URL with protocol, for example https://example.com."
//     );
//   }

//   return errors;
// }

// function flattenFieldErrors(errors: FormErrors) {
//   return Object.values(errors).flatMap((messages) => messages || []);
// }

// function formatDate(dateValue?: string) {
//   if (!dateValue) {
//     return "N/A";
//   }

//   const date = new Date(dateValue);

//   if (Number.isNaN(date.getTime())) {
//     return dateValue;
//   }

//   return date.toLocaleDateString();
// }

// function calculateAge(dateValue?: string) {
//   if (!dateValue) {
//     return "N/A";
//   }

//   const birthDate = new Date(dateValue);

//   if (Number.isNaN(birthDate.getTime())) {
//     return "N/A";
//   }

//   const today = new Date();
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const monthDifference = today.getMonth() - birthDate.getMonth();

//   if (
//     monthDifference < 0 ||
//     (monthDifference === 0 && today.getDate() < birthDate.getDate())
//   ) {
//     age--;
//   }

//   return String(age);
// }

// function formatSocialLinks(links?: string[]) {
//   if (!links || links.length === 0) {
//     return "N/A";
//   }

//   return links.join(", ");
// }

// export default function PatientsPage() {
//   const [patients, setPatients] = useState<Patient[]>([]);
//   const [form, setForm] = useState<PatientForm>(initialForm);
//   const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
//   const [errorSummary, setErrorSummary] = useState<string[]>([]);
//   const [formSubmitted, setFormSubmitted] = useState(false);
//   const [editingPatientId, setEditingPatientId] = useState<number | null>(null);

//   const [loading, setLoading] = useState(false);
//   const [pageLoading, setPageLoading] = useState(true);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const isEditing = editingPatientId !== null;

//   useEffect(() => {
//     loadPatients();
//   }, []);

//   async function loadPatients() {
//     try {
//       setPageLoading(true);
//       setError("");
//       setErrorSummary([]);

//       const response = await axios.get(
//         `${API_ENDPOINT}/admin/patients`,
//         getAuthHeaders()
//       );

//       const patientsData = extractData<Patient[]>(response);
//       setPatients(Array.isArray(patientsData) ? patientsData : []);
//     } catch (err) {
//       setError("Could not load patients.");
//       setErrorSummary(getBackendMessages(err));
//     } finally {
//       setPageLoading(false);
//     }
//   }

//   function resetPatientForm() {
//     setForm(initialForm);
//     setFieldErrors({});
//     setErrorSummary([]);
//     setFormSubmitted(false);
//     setEditingPatientId(null);
//   }

//   function handleEditPatient(patient: Patient) {
//     setEditingPatientId(patient.id);
//     setForm({
//       name: patient.name || "",
//       email: patient.email || "",
//       password: "",
//       dateOfBirth: toDateInputValue(patient.dateOfBirth),
//       socialMediaLinks: patient.socialMediaLinks?.join(", ") || "",
//     });
//     setFieldErrors({});
//     setErrorSummary([]);
//     setFormSubmitted(false);
//     setError("");
//     setMessage("Editing patient. Leave password blank to keep the existing password.");
//   }

//   function handleCancelEdit() {
//     resetPatientForm();
//     setError("");
//     setMessage("");
//   }

//   function handleFieldChange(field: PatientFormField, value: string) {
//     const nextForm = { ...form, [field]: value };
//     setForm(nextForm);
//     setMessage("");
//     setError("");
//     setErrorSummary([]);

//     if (formSubmitted || fieldErrors[field]?.length) {
//       const nextErrors = validateForm(nextForm, isEditing);
//       setFieldErrors((previousErrors) =>
//         setSingleFieldError(previousErrors, field, nextErrors[field])
//       );
//     }
//   }

//   function handleFieldBlur(field: PatientFormField) {
//     const nextErrors = validateForm(form, isEditing);
//     setFieldErrors((previousErrors) =>
//       setSingleFieldError(previousErrors, field, nextErrors[field])
//     );
//   }

//   function getInputClass(field: PatientFormField) {
//     const hasError = Boolean(fieldErrors[field]?.length);

//     return [
//       "w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2",
//       hasError
//         ? "border-red-400 focus:border-red-500 focus:ring-red-100"
//         : "border-slate-200 focus:border-blue-500 focus:ring-blue-100",
//     ].join(" ");
//   }

//   function renderFieldError(field: PatientFormField) {
//     const messages = fieldErrors[field];

//     if (!messages || messages.length === 0) {
//       return null;
//     }

//     return (
//       <div id={`${field}-error`} className="mt-1 space-y-1">
//         {messages.map((fieldError) => (
//           <p key={fieldError} className="text-xs font-medium text-red-600">
//             {fieldError}
//           </p>
//         ))}
//       </div>
//     );
//   }

//   async function handleSubmit(e: FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setFormSubmitted(true);

//     const nextErrors = validateForm(form, isEditing);
//     const clientErrorMessages = flattenFieldErrors(nextErrors);

//     if (clientErrorMessages.length > 0) {
//       setFieldErrors(nextErrors);
//       setError("Please fix the following patient form errors.");
//       setErrorSummary(clientErrorMessages);
//       return;
//     }

//     const patientPayload: {
//       name: string;
//       email: string;
//       password?: string;
//       dateOfBirth: string;
//       socialMediaLinks: string[];
//     } = {
//       name: form.name.trim(),
//       email: form.email.trim(),
//       dateOfBirth: form.dateOfBirth,
//       socialMediaLinks: parseSocialMediaLinks(form.socialMediaLinks),
//     };

//     if (!isEditing || form.password) {
//       patientPayload.password = form.password;
//     }

//     try {
//       setLoading(true);
//       setError("");
//       setMessage("");
//       setErrorSummary([]);
//       setFieldErrors({});

//       if (isEditing) {
//         await axios.put(
//           `${API_ENDPOINT}/admin/patients/${editingPatientId}`,
//           patientPayload,
//           getAuthHeaders()
//         );

//         setMessage("Patient updated successfully.");
//       } else {
//         await axios.post(
//           `${API_ENDPOINT}/admin/patients`,
//           patientPayload,
//           getAuthHeaders()
//         );

//         setMessage("Patient created successfully.");
//       }

//       resetPatientForm();
//       await loadPatients();
//     } catch (err) {
//       const backendMessages = getBackendMessages(err);
//       const { fieldErrors: backendFieldErrors, generalErrors } =
//         mapBackendMessagesToFields(backendMessages);
//       const mappedErrorMessages = flattenFieldErrors(backendFieldErrors);
//       const allVisibleMessages = [...mappedErrorMessages, ...generalErrors];

//       setFieldErrors((previousErrors) => ({
//         ...previousErrors,
//         ...backendFieldErrors,
//       }));
//       setError(
//         isEditing
//           ? "Patient update failed. Please fix the backend validation errors."
//           : "Patient creation failed. Please fix the backend validation errors."
//       );
//       setErrorSummary(
//         allVisibleMessages.length > 0 ? allVisibleMessages : backendMessages
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleDeletePatient(id: number) {
//     try {
//       setError("");
//       setMessage("");
//       setErrorSummary([]);

//       await axios.delete(
//         `${API_ENDPOINT}/admin/patients/${id}`,
//         getAuthHeaders()
//       );

//       if (editingPatientId === id) {
//         resetPatientForm();
//       }

//       setMessage("Patient deleted successfully.");
//       await loadPatients();
//     } catch (err) {
//       setError("Patient delete failed.");
//       setErrorSummary(getBackendMessages(err));
//     }
//   }

//   return (
//     <div>
//       <PageHeader
//         title="Patients"
//         description="Manage patient profile information according to the backend patient module."
//       />

//       {message ? (
//         <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
//           {message}
//         </div>
//       ) : null}

//       {error || errorSummary.length > 0 ? (
//         <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
//           {error ? <p className="font-semibold">{error}</p> : null}

//           {errorSummary.length > 0 ? (
//             <ul className="mt-2 list-disc space-y-1 pl-5 font-medium">
//               {errorSummary.map((summaryError) => (
//                 <li key={summaryError}>{summaryError}</li>
//               ))}
//             </ul>
//           ) : null}
//         </div>
//       ) : null}

//       <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//         <div className="mb-4">
//           <h2 className="text-lg font-semibold text-slate-950">
//             {isEditing ? "Update Patient" : "Patient Form"}
//           </h2>
//           <p className="text-sm text-slate-500">
//             {isEditing
//               ? "Update backend-supported patient fields. Leave password blank to keep the existing password."
//               : "Only backend-supported patient fields are shown here."}
//           </p>
//         </div>

//         <form
//           id="patient-form"
//           onSubmit={handleSubmit}
//           className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
//           noValidate
//         >
//           <div>
//             <label className="mb-1 block text-sm font-medium text-slate-700">
//               Patient Name
//             </label>
//             <input
//               className={getInputClass("name")}
//               placeholder="Patient Name"
//               value={form.name}
//               onBlur={() => handleFieldBlur("name")}
//               onChange={(e) => handleFieldChange("name", e.target.value)}
//               aria-invalid={Boolean(fieldErrors.name?.length)}
//               aria-describedby={fieldErrors.name?.length ? "name-error" : undefined}
//             />
//             {renderFieldError("name")}
//           </div>

//           <div>
//             <label className="mb-1 block text-sm font-medium text-slate-700">
//               Email
//             </label>
//             <input
//               className={getInputClass("email")}
//               placeholder="Email"
//               type="email"
//               value={form.email}
//               onBlur={() => handleFieldBlur("email")}
//               onChange={(e) => handleFieldChange("email", e.target.value)}
//               aria-invalid={Boolean(fieldErrors.email?.length)}
//               aria-describedby={
//                 fieldErrors.email?.length ? "email-error" : undefined
//               }
//             />
//             {renderFieldError("email")}
//           </div>

//           <div>
//             <label className="mb-1 block text-sm font-medium text-slate-700">
//               {isEditing ? "New Password (optional)" : "Password"}
//             </label>
//             <input
//               className={getInputClass("password")}
//               placeholder={
//                 isEditing ? "Leave blank to keep existing password" : "Password"
//               }
//               type="password"
//               value={form.password}
//               onBlur={() => handleFieldBlur("password")}
//               onChange={(e) => handleFieldChange("password", e.target.value)}
//               aria-invalid={Boolean(fieldErrors.password?.length)}
//               aria-describedby={
//                 fieldErrors.password?.length ? "password-error" : undefined
//               }
//             />
//             {renderFieldError("password")}
//           </div>

//           <div>
//             <label className="mb-1 block text-sm font-medium text-slate-700">
//               Date of Birth
//             </label>
//             <input
//               className={getInputClass("dateOfBirth")}
//               type="date"
//               value={form.dateOfBirth}
//               onBlur={() => handleFieldBlur("dateOfBirth")}
//               onChange={(e) => handleFieldChange("dateOfBirth", e.target.value)}
//               aria-invalid={Boolean(fieldErrors.dateOfBirth?.length)}
//               aria-describedby={
//                 fieldErrors.dateOfBirth?.length
//                   ? "dateOfBirth-error"
//                   : undefined
//               }
//             />
//             {renderFieldError("dateOfBirth")}
//           </div>

//           <div className="md:col-span-2 xl:col-span-2">
//             <label className="mb-1 block text-sm font-medium text-slate-700">
//               Social Links
//             </label>
//             <input
//               className={getInputClass("socialMediaLinks")}
//               placeholder="https://facebook.com/example, https://linkedin.com/in/example"
//               value={form.socialMediaLinks}
//               onBlur={() => handleFieldBlur("socialMediaLinks")}
//               onChange={(e) =>
//                 handleFieldChange("socialMediaLinks", e.target.value)
//               }
//               aria-invalid={Boolean(fieldErrors.socialMediaLinks?.length)}
//               aria-describedby={
//                 fieldErrors.socialMediaLinks?.length
//                   ? "socialMediaLinks-error"
//                   : undefined
//               }
//             />
//             {renderFieldError("socialMediaLinks")}
//           </div>

//           <div className="flex flex-wrap items-end gap-3 md:col-span-2 xl:col-span-3">
//             <button
//               type="submit"
//               disabled={loading}
//               className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
//             >
//               {loading
//                 ? isEditing
//                   ? "Updating..."
//                   : "Adding..."
//                 : isEditing
//                   ? "Update Patient"
//                   : "Add Patient"}
//             </button>

//             {isEditing ? (
//               <button
//                 type="button"
//                 onClick={handleCancelEdit}
//                 disabled={loading}
//                 className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
//               >
//                 Cancel Edit
//               </button>
//             ) : null}
//           </div>
//         </form>
//       </section>

//       <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
//         <div className="border-b border-slate-200 p-5">
//           <h2 className="text-lg font-semibold text-slate-950">
//             Patient List
//           </h2>
//           <p className="text-sm text-slate-500">
//             Data is loaded from backend patient API.
//           </p>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[900px] text-left text-sm">
//             <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
//               <tr>
//                 <th className="px-5 py-3">Unique ID</th>
//                 <th className="px-5 py-3">Name</th>
//                 <th className="px-5 py-3">Email</th>
//                 <th className="px-5 py-3">Date of Birth</th>
//                 <th className="px-5 py-3">Age</th>
//                 <th className="px-5 py-3">Social Links</th>
//                 <th className="px-5 py-3">Created</th>
//                 <th className="px-5 py-3">Status</th>
//                 <th className="px-5 py-3">Actions</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-slate-100">
//               {pageLoading ? (
//                 <tr>
//                   <td
//                     colSpan={9}
//                     className="px-5 py-8 text-center text-slate-500"
//                   >
//                     Loading patients...
//                   </td>
//                 </tr>
//               ) : null}

//               {!pageLoading &&
//                 patients.map((patient) => (
//                   <tr key={patient.id} className="hover:bg-slate-50">
//                     <td className="px-5 py-4 text-slate-700">
//                       {patient.uniqueId || "N/A"}
//                     </td>

//                     <td className="px-5 py-4 font-semibold text-slate-900">
//                       {patient.name}
//                     </td>

//                     <td className="px-5 py-4 text-slate-700">
//                       {patient.email}
//                     </td>

//                     <td className="px-5 py-4 text-slate-700">
//                       {formatDate(patient.dateOfBirth)}
//                     </td>

//                     <td className="px-5 py-4 text-slate-700">
//                       {calculateAge(patient.dateOfBirth)}
//                     </td>

//                     <td className="max-w-xs truncate px-5 py-4 text-slate-700">
//                       {formatSocialLinks(patient.socialMediaLinks)}
//                     </td>

//                     <td className="px-5 py-4 text-slate-700">
//                       {formatDate(patient.createdAt)}
//                     </td>

//                     <td className="px-5 py-4">
//                       <StatusBadge status="Active" />
//                     </td>

//                     <td className="px-5 py-4">
//                       <div className="flex flex-wrap gap-2">
//                         <button
//                           type="button"
//                           onClick={() => handleEditPatient(patient)}
//                           className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
//                         >
//                           Edit
//                         </button>

//                         <button
//                           type="button"
//                           onClick={() => handleDeletePatient(patient.id)}
//                           className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}

//               {!pageLoading && patients.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={9}
//                     className="px-5 py-8 text-center text-slate-500"
//                   >
//                     No patients found.
//                   </td>
//                 </tr>
//               ) : null}
//             </tbody>
//           </table>
//         </div>
//       </section>
//     </div>
//   );
// }


// "use client";

// import { useEffect, useState, type FormEvent } from "react";
// import axios from "axios";
// import { PageHeader } from "@/components/admin/PageHeader";
// import { StatusBadge } from "@/components/admin/StatusBadge";

// type Patient = {
//   id: number;
//   uniqueId?: string;
//   name: string;
//   email: string;
//   dateOfBirth?: string;
//   socialMediaLinks?: string[];
//   createdAt?: string;
// };

// const initialForm = {
//   name: "",
//   email: "",
//   password: "",
//   dateOfBirth: "",
//   socialMediaLinks: "",
// };

// const API_ENDPOINT =
//   process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:4000";

// function getToken() {
//   if (typeof window === "undefined") {
//     return "";
//   }

//   return localStorage.getItem("hms_admin_token") || "";
// }

// function getAuthHeaders() {
//   const token = getToken();

//   return {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
// }

// function extractData<T>(response: { data: { data?: T } | T }): T {
//   if (
//     response.data &&
//     typeof response.data === "object" &&
//     "data" in response.data
//   ) {
//     return response.data.data as T;
//   }

//   return response.data as T;
// }

// function getErrorMessage(error: unknown) {
//   if (axios.isAxiosError(error)) {
//     const backendMessage = error.response?.data?.message;

//     if (Array.isArray(backendMessage)) {
//       return backendMessage.join(", ");
//     }

//     if (typeof backendMessage === "string") {
//       return backendMessage;
//     }

//     return error.message;
//   }

//   return "Something went wrong.";
// }

// function formatDate(dateValue?: string) {
//   if (!dateValue) {
//     return "N/A";
//   }

//   const date = new Date(dateValue);

//   if (Number.isNaN(date.getTime())) {
//     return dateValue;
//   }

//   return date.toLocaleDateString();
// }

// function calculateAge(dateValue?: string) {
//   if (!dateValue) {
//     return "N/A";
//   }

//   const birthDate = new Date(dateValue);

//   if (Number.isNaN(birthDate.getTime())) {
//     return "N/A";
//   }

//   const today = new Date();
//   let age = today.getFullYear() - birthDate.getFullYear();

//   const monthDifference = today.getMonth() - birthDate.getMonth();

//   if (
//     monthDifference < 0 ||
//     (monthDifference === 0 && today.getDate() < birthDate.getDate())
//   ) {
//     age--;
//   }

//   return String(age);
// }

// export default function PatientsPage() {
//   const [patients, setPatients] = useState<Patient[]>([]);
//   const [form, setForm] = useState(initialForm);

//   const [loading, setLoading] = useState(false);
//   const [pageLoading, setPageLoading] = useState(true);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     loadPatients();
//   }, []);

//   async function loadPatients() {
//     try {
//       setPageLoading(true);
//       setError("");

//       const response = await axios.get(
//         `${API_ENDPOINT}/admin/patients`,
//         getAuthHeaders()
//       );

//       const patientsData = extractData<Patient[]>(response);
//       setPatients(Array.isArray(patientsData) ? patientsData : []);
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setPageLoading(false);
//     }
//   }

//   async function handleSubmit(e: FormEvent<HTMLFormElement>) {
//     e.preventDefault();

//     if (!form.name || !form.email || !form.password || !form.dateOfBirth) {
//       setError("Name, email, password, and date of birth are required.");
//       return;
//     }

//     const patientPayload = {
//       name: form.name,
//       email: form.email,
//       password: form.password,
//       dateOfBirth: form.dateOfBirth,
//       socialMediaLinks: form.socialMediaLinks
//         ? form.socialMediaLinks
//             .split(",")
//             .map((link) => link.trim())
//             .filter(Boolean)
//         : [],
//     };

//     try {
//       setLoading(true);
//       setError("");
//       setMessage("");

//       await axios.post(
//         `${API_ENDPOINT}/admin/patients`,
//         patientPayload,
//         getAuthHeaders()
//       );

//       setForm(initialForm);
//       setMessage("Patient created successfully.");
//       await loadPatients();
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleDeletePatient(id: number) {
//     try {
//       setError("");
//       setMessage("");

//       await axios.delete(
//         `${API_ENDPOINT}/admin/patients/${id}`,
//         getAuthHeaders()
//       );

//       setMessage("Patient deleted successfully.");
//       await loadPatients();
//     } catch (err) {
//       setError(getErrorMessage(err));
//     }
//   }

//   return (
//     <div>
//       <PageHeader
//         title="Patients"
//         description="Manage patient profile information according to the backend patient module."
//         action={
//           <button
//             form="patient-form"
//             type="submit"
//             disabled={loading}
//             className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
//           >
//             {loading ? "Adding..." : "Add Patient"}
//           </button>
//         }
//       />

//       {message ? (
//         <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
//           {message}
//         </div>
//       ) : null}

//       {error ? (
//         <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
//           {error}
//         </div>
//       ) : null}

//       <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//         <h2 className="mb-4 text-lg font-semibold text-slate-950">
//           Patient Form
//         </h2>

//         <form
//           id="patient-form"
//           onSubmit={handleSubmit}
//           className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
//         >
//           <input
//             className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
//             placeholder="Patient Name"
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}

//           />

//           <input
//             className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
//             placeholder="Email"
//             type="email"
//             value={form.email}
//             onChange={(e) => setForm({ ...form, email: e.target.value })}

//           />

//           <input
//             className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
//             placeholder="Password"
//             type="password"
//             value={form.password}
//             onChange={(e) => setForm({ ...form, password: e.target.value })}

//           />

//           <input
//             className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
//             type="date"
//             value={form.dateOfBirth}
//             onChange={(e) =>
//               setForm({ ...form, dateOfBirth: e.target.value })
//             }

//           />

//           <input
//             className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500"
//             placeholder="Phone not available in backend"
//             disabled
//           />

//           <input
//             className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500"
//             placeholder="Age calculated from date of birth"
//             disabled
//           />

//           <select
//             className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500"
//             disabled
//           >
//             <option>Gender not available in backend</option>
//           </select>

//           <input
//             className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500"
//             placeholder="Blood Group not available in backend"
//             disabled
//           />

//           <input
//             className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500"
//             placeholder="Emergency Contact not available in backend"
//             disabled
//           />

//           <input
//             className="rounded-xl border border-slate-200 px-4 py-3 text-sm xl:col-span-2"
//             placeholder="Social Links separated by comma"
//             value={form.socialMediaLinks}
//             onChange={(e) =>
//               setForm({ ...form, socialMediaLinks: e.target.value })
//             }
//           />

//           <input
//             className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500"
//             placeholder="Address not available in backend"
//             disabled
//           />
//         </form>
//       </section>

//       <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
//         <div className="border-b border-slate-200 p-5">
//           <h2 className="text-lg font-semibold text-slate-950">
//             Patient List
//           </h2>
//           <p className="text-sm text-slate-500">
//             Data is loaded from backend patient API.
//           </p>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[1200px] text-left text-sm">
//             <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
//               <tr>
//                 <th className="px-5 py-3">Name</th>
//                 <th className="px-5 py-3">Email</th>
//                 <th className="px-5 py-3">Phone</th>
//                 <th className="px-5 py-3">Age</th>
//                 <th className="px-5 py-3">Gender</th>
//                 <th className="px-5 py-3">Blood</th>
//                 <th className="px-5 py-3">Address</th>
//                 <th className="px-5 py-3">Emergency Contact</th>
//                 <th className="px-5 py-3">Created</th>
//                 <th className="px-5 py-3">Status</th>
//                 <th className="px-5 py-3">Actions</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-slate-100">
//               {pageLoading ? (
//                 <tr>
//                   <td
//                     colSpan={11}
//                     className="px-5 py-8 text-center text-slate-500"
//                   >
//                     Loading patients...
//                   </td>
//                 </tr>
//               ) : null}

//               {!pageLoading &&
//                 patients.map((patient) => (
//                   <tr key={patient.id} className="hover:bg-slate-50">
//                     <td className="px-5 py-4 font-semibold text-slate-900">
//                       {patient.name}
//                     </td>

//                     <td className="px-5 py-4 text-slate-700">
//                       {patient.email}
//                     </td>

//                     <td className="px-5 py-4 text-slate-700">N/A</td>

//                     <td className="px-5 py-4 text-slate-700">
//                       {calculateAge(patient.dateOfBirth)}
//                     </td>

//                     <td className="px-5 py-4 text-slate-700">N/A</td>

//                     <td className="px-5 py-4 text-slate-700">N/A</td>

//                     <td className="px-5 py-4 text-slate-700">N/A</td>

//                     <td className="px-5 py-4 text-slate-700">N/A</td>

//                     <td className="px-5 py-4 text-slate-700">
//                       {formatDate(patient.createdAt)}
//                     </td>

//                     <td className="px-5 py-4">
//                       <StatusBadge status="Active" />
//                     </td>

//                     <td className="px-5 py-4">
//                       <button
//                         type="button"
//                         onClick={() => handleDeletePatient(patient.id)}
//                         className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}

//               {!pageLoading && patients.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={11}
//                     className="px-5 py-8 text-center text-slate-500"
//                   >
//                     No patients found.
//                   </td>
//                 </tr>
//               ) : null}
//             </tbody>
//           </table>
//         </div>
//       </section>
//     </div>
//   );
// }