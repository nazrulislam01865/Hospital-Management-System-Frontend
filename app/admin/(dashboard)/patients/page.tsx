// import { PageHeader } from "@/components/admin/PageHeader";
// import { StatusBadge } from "@/components/admin/StatusBadge";
// import { patients } from "@/lib/admin-data";

// export default function PatientsPage() {
//   return (
//     <div>
//       <PageHeader
//         title="Patients"
//         description="Manage patient profile information according to the backend patient module."
//         action={
//           <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
//             Add Patient
//           </button>
//         }
//       />

//       <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//         <h2 className="mb-4 text-lg font-semibold text-slate-950">Patient Form</h2>

//         <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Patient Name" />
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Email" />
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Phone" />
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Age" type="number" />
//           <select className="rounded-xl border border-slate-200 px-4 py-3 text-sm">
//             <option>Gender</option>
//             <option>Male</option>
//             <option>Female</option>
//             <option>Other</option>
//           </select>
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Blood Group" />
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Emergency Contact" />
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm xl:col-span-2" placeholder="Address" />
//         </form>
//       </section>

//       <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
//         <div className="border-b border-slate-200 p-5">
//           <h2 className="text-lg font-semibold text-slate-950">Patient List</h2>
//           <p className="text-sm text-slate-500">Mock data only. Backend connection will be added later.</p>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[1100px] text-left text-sm">
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
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-slate-100">
//               {patients.map((patient) => (
//                 <tr key={patient.id} className="hover:bg-slate-50">
//                   <td className="px-5 py-4 font-semibold text-slate-900">{patient.name}</td>
//                   <td className="px-5 py-4 text-slate-700">{patient.email}</td>
//                   <td className="px-5 py-4 text-slate-700">{patient.phone}</td>
//                   <td className="px-5 py-4 text-slate-700">{patient.age}</td>
//                   <td className="px-5 py-4 text-slate-700">{patient.gender}</td>
//                   <td className="px-5 py-4 text-slate-700">{patient.bloodGroup}</td>
//                   <td className="px-5 py-4 text-slate-700">{patient.address}</td>
//                   <td className="px-5 py-4 text-slate-700">{patient.emergencyContact}</td>
//                   <td className="px-5 py-4 text-slate-700">{patient.createdAt}</td>
//                   <td className="px-5 py-4">
//                     <StatusBadge status={patient.status} />
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

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    try {
      setPageLoading(true);
      setError("");

      const response = await axios.get(
        `${API_ENDPOINT}/admin/patients`,
        getAuthHeaders()
      );

      const patientsData = extractData<Patient[]>(response);
      setPatients(Array.isArray(patientsData) ? patientsData : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPageLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.dateOfBirth) {
      setError("Name, email, password, and date of birth are required.");
      return;
    }

    const patientPayload = {
      name: form.name,
      email: form.email,
      password: form.password,
      dateOfBirth: form.dateOfBirth,
      socialMediaLinks: form.socialMediaLinks
        ? form.socialMediaLinks
            .split(",")
            .map((link) => link.trim())
            .filter(Boolean)
        : [],
    };

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await axios.post(
        `${API_ENDPOINT}/admin/patients`,
        patientPayload,
        getAuthHeaders()
      );

      setForm(initialForm);
      setMessage("Patient created successfully.");
      await loadPatients();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePatient(id: number) {
    try {
      setError("");
      setMessage("");

      await axios.delete(
        `${API_ENDPOINT}/admin/patients/${id}`,
        getAuthHeaders()
      );

      setMessage("Patient deleted successfully.");
      await loadPatients();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div>
      <PageHeader
        title="Patients"
        description="Manage patient profile information according to the backend patient module."
        action={
          <button
            form="patient-form"
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Adding..." : "Add Patient"}
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
        <h2 className="mb-4 text-lg font-semibold text-slate-950">
          Patient Form
        </h2>

        <form
          id="patient-form"
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
            placeholder="Patient Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
            type="date"
            value={form.dateOfBirth}
            onChange={(e) =>
              setForm({ ...form, dateOfBirth: e.target.value })
            }
            required
          />

          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500"
            placeholder="Phone not available in backend"
            disabled
          />

          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500"
            placeholder="Age calculated from date of birth"
            disabled
          />

          <select
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500"
            disabled
          >
            <option>Gender not available in backend</option>
          </select>

          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500"
            placeholder="Blood Group not available in backend"
            disabled
          />

          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500"
            placeholder="Emergency Contact not available in backend"
            disabled
          />

          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm xl:col-span-2"
            placeholder="Social Links separated by comma"
            value={form.socialMediaLinks}
            onChange={(e) =>
              setForm({ ...form, socialMediaLinks: e.target.value })
            }
          />

          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500"
            placeholder="Address not available in backend"
            disabled
          />
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
          <table className="w-full min-w-[1200px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Age</th>
                <th className="px-5 py-3">Gender</th>
                <th className="px-5 py-3">Blood</th>
                <th className="px-5 py-3">Address</th>
                <th className="px-5 py-3">Emergency Contact</th>
                <th className="px-5 py-3">Created</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {pageLoading ? (
                <tr>
                  <td
                    colSpan={11}
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
                      {patient.name}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {patient.email}
                    </td>

                    <td className="px-5 py-4 text-slate-700">N/A</td>

                    <td className="px-5 py-4 text-slate-700">
                      {calculateAge(patient.dateOfBirth)}
                    </td>

                    <td className="px-5 py-4 text-slate-700">N/A</td>

                    <td className="px-5 py-4 text-slate-700">N/A</td>

                    <td className="px-5 py-4 text-slate-700">N/A</td>

                    <td className="px-5 py-4 text-slate-700">N/A</td>

                    <td className="px-5 py-4 text-slate-700">
                      {formatDate(patient.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status="Active" />
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => handleDeletePatient(patient.id)}
                        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

              {!pageLoading && patients.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
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