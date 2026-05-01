// import { PageHeader } from "@/components/admin/PageHeader";
// import { StatusBadge } from "@/components/admin/StatusBadge";
// import { appointments } from "@/lib/admin-data";

// export default function AppointmentsPage() {
//   return (
//     <div>
//       <PageHeader
//         title="Appointments"
//         description="Manage appointment date, time, patient, doctor, problem, and status."
//         action={
//           <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
//             Add Appointment
//           </button>
//         }
//       />

//       <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//         <h2 className="mb-4 text-lg font-semibold text-slate-950">Appointment Form</h2>

//         <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Patient Name" />
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Patient Phone" />
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Doctor Name" />
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Department Name" />
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" type="date" />
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" type="time" />
//           <textarea
//             className="min-h-24 rounded-xl border border-slate-200 px-4 py-3 text-sm md:col-span-2 xl:col-span-3"
//             placeholder="Patient Problem"
//           />
//         </form>
//       </section>

//       <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
//         <div className="border-b border-slate-200 p-5">
//           <h2 className="text-lg font-semibold text-slate-950">Appointment List</h2>
//           <p className="text-sm text-slate-500">Frontend data is prepared for backend appointment API later.</p>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[1100px] text-left text-sm">
//             <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
//               <tr>
//                 <th className="px-5 py-3">Patient</th>
//                 <th className="px-5 py-3">Phone</th>
//                 <th className="px-5 py-3">Doctor</th>
//                 <th className="px-5 py-3">Department</th>
//                 <th className="px-5 py-3">Date</th>
//                 <th className="px-5 py-3">Time</th>
//                 <th className="px-5 py-3">Problem</th>
//                 <th className="px-5 py-3">Created</th>
//                 <th className="px-5 py-3">Status</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-slate-100">
//               {appointments.map((appointment) => (
//                 <tr key={appointment.id} className="hover:bg-slate-50">
//                   <td className="px-5 py-4 font-semibold text-slate-900">{appointment.patientName}</td>
//                   <td className="px-5 py-4 text-slate-700">{appointment.patientPhone}</td>
//                   <td className="px-5 py-4 text-slate-700">{appointment.doctorName}</td>
//                   <td className="px-5 py-4 text-slate-700">{appointment.departmentName}</td>
//                   <td className="px-5 py-4 text-slate-700">{appointment.appointmentDate}</td>
//                   <td className="px-5 py-4 text-slate-700">{appointment.appointmentTime}</td>
//                   <td className="px-5 py-4 text-slate-700">{appointment.problem}</td>
//                   <td className="px-5 py-4 text-slate-700">{appointment.createdAt}</td>
//                   <td className="px-5 py-4">
//                     <StatusBadge status={appointment.status} />
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
  createdAt?: string;
};

type Appointment = {
  id: number;
  uniqueId?: string;
  patient?: Patient | null;
  doctorName: string;
  appointmentDate: string;
  status: string;
  paymentStatus?: string;
  createdAt?: string;
};

const initialForm = {
  patientId: "",
  doctorName: "",
  appointmentDate: "",
  appointmentTime: "",
};

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

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

function formatDateTime(dateValue?: string) {
  if (!dateValue) {
    return "N/A";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleString();
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

function formatTime(dateValue?: string) {
  if (!dateValue) {
    return "N/A";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getAdminIdFromToken() {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payload));

    return (
      decodedPayload.sub ||
      decodedPayload.adminId ||
      decodedPayload.id ||
      null
    );
  } catch {
    return null;
  }
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [form, setForm] = useState(initialForm);
  const [adminId, setAdminId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadPageData();
  }, []);

  async function loadPageData() {
    try {
      setPageLoading(true);
      setError("");

      const tokenAdminId = getAdminIdFromToken();

      if (tokenAdminId) {
        setAdminId(Number(tokenAdminId));
      }

      const [patientsResponse, appointmentsResponse] = await Promise.all([
        axios.get(`${API_ENDPOINT}/admin/patients`, getAuthHeaders()),
        axios.get(`${API_ENDPOINT}/admin/appointments`, getAuthHeaders()),
      ]);

      const patientsData = extractData<Patient[]>(patientsResponse);
      const appointmentsData =
        extractData<Appointment[]>(appointmentsResponse);

      setPatients(Array.isArray(patientsData) ? patientsData : []);
      setAppointments(
        Array.isArray(appointmentsData) ? appointmentsData : []
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPageLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const loggedInAdminId = adminId || getAdminIdFromToken();

    if (!loggedInAdminId) {
      setError("Admin ID was not found. Please logout and login again.");
      return;
    }

    if (!form.patientId || !form.doctorName || !form.appointmentDate) {
      setError("Patient, doctor name, and appointment date are required.");
      return;
    }

    const appointmentDateTime = form.appointmentTime
      ? new Date(`${form.appointmentDate}T${form.appointmentTime}`).toISOString()
      : new Date(`${form.appointmentDate}T00:00`).toISOString();

    const appointmentPayload = {
      patientId: Number(form.patientId),
      doctorName: form.doctorName,
      appointmentDate: appointmentDateTime,
    };

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await axios.post(
        `${API_ENDPOINT}/admin/${loggedInAdminId}/appointment`,
        appointmentPayload,
        getAuthHeaders()
      );

      setForm(initialForm);
      setMessage("Appointment created successfully.");
      await loadPageData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id: number) {
    try {
      setError("");
      setMessage("");

      await axios.patch(
        `${API_ENDPOINT}/admin/appointments/${id}/approve`,
        {},
        getAuthHeaders()
      );

      setMessage("Appointment approved successfully.");
      await loadPageData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleCancel(id: number) {
    try {
      setError("");
      setMessage("");

      await axios.patch(
        `${API_ENDPOINT}/admin/appointments/${id}/cancel`,
        {},
        getAuthHeaders()
      );

      setMessage("Appointment cancelled successfully.");
      await loadPageData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleDelete(id: number) {
    try {
      setError("");
      setMessage("");

      await axios.delete(
        `${API_ENDPOINT}/admin/appointments/${id}`,
        getAuthHeaders()
      );

      setMessage("Appointment deleted successfully.");
      await loadPageData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div>
      <PageHeader
        title="Appointments"
        description="Manage appointment date, time, patient, doctor, and status."
        action={
          <button
            form="appointment-form"
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Adding..." : "Add Appointment"}
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
          Appointment Form
        </h2>

        <form
          id="appointment-form"
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          <select
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
            value={form.patientId}
            onChange={(e) => setForm({ ...form, patientId: e.target.value })}
            required
          >
            <option value="">Select Patient</option>

            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name} — ID: {patient.id}
              </option>
            ))}
          </select>

          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
            placeholder="Doctor Name"
            value={form.doctorName}
            onChange={(e) => setForm({ ...form, doctorName: e.target.value })}
            required
          />

          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
            type="date"
            value={form.appointmentDate}
            onChange={(e) =>
              setForm({ ...form, appointmentDate: e.target.value })
            }
            required
          />

          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
            type="time"
            value={form.appointmentTime}
            onChange={(e) =>
              setForm({ ...form, appointmentTime: e.target.value })
            }
          />

          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500"
            placeholder="Patient Phone is not available in backend"
            disabled
          />

          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500"
            placeholder="Department is not available in backend"
            disabled
          />

          <textarea
            className="min-h-24 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500 md:col-span-2 xl:col-span-3"
            placeholder="Problem field is not available in backend"
            disabled
          />
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-950">
            Appointment List
          </h2>
          <p className="text-sm text-slate-500">
            Data is loaded from backend appointment API.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Doctor</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Time</th>
                <th className="px-5 py-3">Problem</th>
                <th className="px-5 py-3">Created</th>
                <th className="px-5 py-3">Payment</th>
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
                    Loading appointments...
                  </td>
                </tr>
              ) : null}

              {!pageLoading &&
                appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {appointment.patient?.name || "N/A"}
                    </td>

                    <td className="px-5 py-4 text-slate-700">N/A</td>

                    <td className="px-5 py-4 text-slate-700">
                      {appointment.doctorName}
                    </td>

                    <td className="px-5 py-4 text-slate-700">N/A</td>

                    <td className="px-5 py-4 text-slate-700">
                      {formatDate(appointment.appointmentDate)}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {formatTime(appointment.appointmentDate)}
                    </td>

                    <td className="px-5 py-4 text-slate-700">N/A</td>

                    <td className="px-5 py-4 text-slate-700">
                      {formatDate(appointment.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge
                        status={appointment.paymentStatus || "Unpaid"}
                      />
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={appointment.status} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleApprove(appointment.id)}
                          className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-100"
                        >
                          Approve
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCancel(appointment.id)}
                          className="rounded-lg bg-yellow-50 px-3 py-2 text-xs font-semibold text-yellow-700 hover:bg-yellow-100"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(appointment.id)}
                          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!pageLoading && appointments.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="px-5 py-8 text-center text-slate-500"
                  >
                    No appointments found.
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