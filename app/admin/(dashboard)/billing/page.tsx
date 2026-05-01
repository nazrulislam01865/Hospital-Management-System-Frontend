// import { PageHeader } from "@/components/admin/PageHeader";
// import { StatusBadge } from "@/components/admin/StatusBadge";
// import { bills } from "@/lib/admin-data";

// export default function BillingPage() {
//   return (
//     <div>
//       <PageHeader
//         title="Billing"
//         description="Manage patient invoices, service charges, room charges, payments, and due amounts."
//         action={
//           <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
//             Create Bill
//           </button>
//         }
//       />

//       <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//         <h2 className="mb-4 text-lg font-semibold text-slate-950">Billing Form</h2>

//         <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Patient Name" />
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Patient Phone" />
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Appointment ID" type="number" />
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Room Number" />
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Doctor Charge" type="number" />
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Room Charge" type="number" />
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Service Charge" type="number" />
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Medicine Charge" type="number" />
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Discount" type="number" />
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Paid Amount" type="number" />
//           <select className="rounded-xl border border-slate-200 px-4 py-3 text-sm">
//             <option>Payment Method</option>
//             <option>Cash</option>
//             <option>Card</option>
//             <option>Bkash</option>
//             <option>Nagad</option>
//             <option>Bank Transfer</option>
//           </select>
//           <select className="rounded-xl border border-slate-200 px-4 py-3 text-sm">
//             <option>Payment Status</option>
//             <option>Paid</option>
//             <option>Unpaid</option>
//             <option>Partial</option>
//           </select>
//         </form>
//       </section>

//       <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
//         <div className="border-b border-slate-200 p-5">
//           <h2 className="text-lg font-semibold text-slate-950">Billing Records</h2>
//           <p className="text-sm text-slate-500">This billing UI is ready for backend bill APIs later.</p>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[1300px] text-left text-sm">
//             <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
//               <tr>
//                 <th className="px-5 py-3">Invoice</th>
//                 <th className="px-5 py-3">Patient</th>
//                 <th className="px-5 py-3">Phone</th>
//                 <th className="px-5 py-3">Appointment</th>
//                 <th className="px-5 py-3">Room</th>
//                 <th className="px-5 py-3">Doctor</th>
//                 <th className="px-5 py-3">Room Charge</th>
//                 <th className="px-5 py-3">Service</th>
//                 <th className="px-5 py-3">Medicine</th>
//                 <th className="px-5 py-3">Discount</th>
//                 <th className="px-5 py-3">Total</th>
//                 <th className="px-5 py-3">Paid</th>
//                 <th className="px-5 py-3">Due</th>
//                 <th className="px-5 py-3">Method</th>
//                 <th className="px-5 py-3">Status</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-slate-100">
//               {bills.map((bill) => (
//                 <tr key={bill.id} className="hover:bg-slate-50">
//                   <td className="px-5 py-4 font-semibold text-slate-900">{bill.invoiceNumber}</td>
//                   <td className="px-5 py-4 text-slate-700">{bill.patientName}</td>
//                   <td className="px-5 py-4 text-slate-700">{bill.patientPhone}</td>
//                   <td className="px-5 py-4 text-slate-700">#{bill.appointmentId}</td>
//                   <td className="px-5 py-4 text-slate-700">{bill.roomNumber}</td>
//                   <td className="px-5 py-4 text-slate-700">৳ {bill.doctorCharge}</td>
//                   <td className="px-5 py-4 text-slate-700">৳ {bill.roomCharge}</td>
//                   <td className="px-5 py-4 text-slate-700">৳ {bill.serviceCharge}</td>
//                   <td className="px-5 py-4 text-slate-700">৳ {bill.medicineCharge}</td>
//                   <td className="px-5 py-4 text-slate-700">৳ {bill.discount}</td>
//                   <td className="px-5 py-4 font-semibold text-slate-900">৳ {bill.totalAmount}</td>
//                   <td className="px-5 py-4 text-slate-700">৳ {bill.paidAmount}</td>
//                   <td className="px-5 py-4 text-slate-700">৳ {bill.dueAmount}</td>
//                   <td className="px-5 py-4 text-slate-700">{bill.paymentMethod}</td>
//                   <td className="px-5 py-4">
//                     <StatusBadge status={bill.status} />
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
  name: string;
  email?: string;
};

type Appointment = {
  id: number;
  patient?: Patient | null;
  doctorName?: string;
  appointmentDate?: string;
  status?: string;
  paymentStatus?: string;
};

type Bill = {
  id: number;
  patientName: string;
  serviceCharge: number;
  billingDate: string;
  status: string;
  paymentDate?: string | null;
  createdAt?: string;
  appointment?: Appointment | number | null;
};

const initialForm = {
  patientName: "",
  serviceCharge: "",
  billingDate: "",
  appointmentId: "",
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

function getAppointmentLabel(appointment?: Appointment | number | null) {
  if (!appointment) {
    return "N/A";
  }

  if (typeof appointment === "number") {
    return `#${appointment}`;
  }

  if (appointment.id) {
    return `#${appointment.id}`;
  }

  return "Linked";
}

export default function BillingPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [form, setForm] = useState(initialForm);

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

      const [billsResponse, appointmentsResponse] = await Promise.all([
        axios.get(`${API_ENDPOINT}/admin/bills`, getAuthHeaders()),
        axios.get(`${API_ENDPOINT}/admin/appointments`, getAuthHeaders()),
      ]);

      const billsData = extractData<Bill[]>(billsResponse);
      const appointmentsData =
        extractData<Appointment[]>(appointmentsResponse);

      setBills(Array.isArray(billsData) ? billsData : []);
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPageLoading(false);
    }
  }

  function handleAppointmentChange(appointmentId: string) {
    const selectedAppointment = appointments.find(
      (appointment) => String(appointment.id) === appointmentId
    );

    setForm((prev) => ({
      ...prev,
      appointmentId,
      patientName: selectedAppointment?.patient?.name || prev.patientName,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.patientName || !form.serviceCharge || !form.billingDate) {
      setError("Patient name, service charge, and billing date are required.");
      return;
    }

    const billPayload = {
      patientName: form.patientName,
      serviceCharge: Number(form.serviceCharge),
      billingDate: form.billingDate,
      appointmentId: form.appointmentId ? Number(form.appointmentId) : undefined,
    };

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await axios.post(
        `${API_ENDPOINT}/admin/bills`,
        billPayload,
        getAuthHeaders()
      );

      setForm(initialForm);
      setMessage("Bill created successfully.");
      await loadPageData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handlePayBill(id: number) {
    try {
      setError("");
      setMessage("");

      await axios.patch(
        `${API_ENDPOINT}/admin/bills/${id}/pay`,
        {},
        getAuthHeaders()
      );

      setMessage("Bill marked as paid successfully.");
      await loadPageData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleDeleteBill(id: number) {
    try {
      setError("");
      setMessage("");

      await axios.delete(`${API_ENDPOINT}/admin/bills/${id}`, getAuthHeaders());

      setMessage("Bill deleted successfully.");
      await loadPageData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div>
      <PageHeader
        title="Billing"
        description="Manage patient invoices, service charges, payment date, and payment status."
        action={
          <button
            form="billing-form"
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creating..." : "Create Bill"}
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
          Billing Form
        </h2>

        <form
          id="billing-form"
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
            placeholder="Patient Name"
            value={form.patientName}
            onChange={(e) => setForm({ ...form, patientName: e.target.value })}
            required
          />

          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500"
            placeholder="Patient Phone not available in backend"
            disabled
          />

          <select
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
            value={form.appointmentId}
            onChange={(e) => handleAppointmentChange(e.target.value)}
          >
            <option value="">No Appointment</option>
            {appointments.map((appointment) => (
              <option key={appointment.id} value={appointment.id}>
                Appointment #{appointment.id} —{" "}
                {appointment.patient?.name || "N/A"}
              </option>
            ))}
          </select>

          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500"
            placeholder="Room Number not available in backend"
            disabled
          />

          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500"
            placeholder="Doctor Charge not available in backend"
            type="number"
            disabled
          />

          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500"
            placeholder="Room Charge not available in backend"
            type="number"
            disabled
          />

          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
            placeholder="Service Charge"
            type="number"
            min={0}
            value={form.serviceCharge}
            onChange={(e) =>
              setForm({ ...form, serviceCharge: e.target.value })
            }
            required
          />

          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500"
            placeholder="Medicine Charge not available in backend"
            type="number"
            disabled
          />

          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500"
            placeholder="Discount not available in backend"
            type="number"
            disabled
          />

          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500"
            placeholder="Paid Amount handled by Pay button"
            type="number"
            disabled
          />

          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
            type="date"
            value={form.billingDate}
            onChange={(e) => setForm({ ...form, billingDate: e.target.value })}
            required
          />

          <select
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500"
            disabled
          >
            <option>Payment Method not available in backend</option>
          </select>

          <select
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500"
            disabled
          >
            <option>Status handled by backend</option>
          </select>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-950">
            Billing Records
          </h2>
          <p className="text-sm text-slate-500">
            Data is loaded from backend bill API.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1300px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Invoice</th>
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Appointment</th>
                <th className="px-5 py-3">Room</th>
                <th className="px-5 py-3">Doctor</th>
                <th className="px-5 py-3">Room Charge</th>
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3">Medicine</th>
                <th className="px-5 py-3">Discount</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Paid</th>
                <th className="px-5 py-3">Due</th>
                <th className="px-5 py-3">Method</th>
                <th className="px-5 py-3">Billing Date</th>
                <th className="px-5 py-3">Payment Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {pageLoading ? (
                <tr>
                  <td
                    colSpan={18}
                    className="px-5 py-8 text-center text-slate-500"
                  >
                    Loading bills...
                  </td>
                </tr>
              ) : null}

              {!pageLoading &&
                bills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      Invoice #{bill.id}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {bill.patientName}
                    </td>

                    <td className="px-5 py-4 text-slate-700">N/A</td>

                    <td className="px-5 py-4 text-slate-700">
                      {getAppointmentLabel(bill.appointment)}
                    </td>

                    <td className="px-5 py-4 text-slate-700">N/A</td>

                    <td className="px-5 py-4 text-slate-700">N/A</td>

                    <td className="px-5 py-4 text-slate-700">N/A</td>

                    <td className="px-5 py-4 text-slate-700">
                      ৳ {bill.serviceCharge}
                    </td>

                    <td className="px-5 py-4 text-slate-700">N/A</td>

                    <td className="px-5 py-4 text-slate-700">N/A</td>

                    <td className="px-5 py-4 font-semibold text-slate-900">
                      ৳ {bill.serviceCharge}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {bill.status === "Paid" ? `৳ ${bill.serviceCharge}` : "৳ 0"}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {bill.status === "Paid" ? "৳ 0" : `৳ ${bill.serviceCharge}`}
                    </td>

                    <td className="px-5 py-4 text-slate-700">N/A</td>

                    <td className="px-5 py-4 text-slate-700">
                      {formatDate(bill.billingDate)}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {formatDate(bill.paymentDate)}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={bill.status || "Unpaid"} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handlePayBill(bill.id)}
                          className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-100"
                        >
                          Pay
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteBill(bill.id)}
                          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!pageLoading && bills.length === 0 ? (
                <tr>
                  <td
                    colSpan={18}
                    className="px-5 py-8 text-center text-slate-500"
                  >
                    No bills found.
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