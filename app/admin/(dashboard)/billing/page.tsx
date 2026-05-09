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
  id?: number;
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

function formatDateForInput(dateValue?: string | null) {
  if (!dateValue) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(dateValue)) {
    return dateValue.slice(0, 10);
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

function formatCurrency(value?: number | string | null) {
  const amount = Number(value ?? 0);

  if (Number.isNaN(amount)) {
    return "৳ 0.00";
  }

  return `৳ ${amount.toFixed(2)}`;
}

function isPaidStatus(status?: string | null) {
  return String(status || "").toLowerCase() === "paid";
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

  if (appointment.patient?.name) {
    return appointment.patient.name;
  }

  if (appointment.appointmentDate) {
    return formatDate(appointment.appointmentDate);
  }

  return "Linked";
}

function getAppointmentId(appointment?: Appointment | number | null) {
  if (!appointment) {
    return "";
  }

  if (typeof appointment === "number") {
    return String(appointment);
  }

  return appointment.id ? String(appointment.id) : "";
}

export default function BillingPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingBillId, setEditingBillId] = useState<number | null>(null);
  const [serviceChargeEdits, setServiceChargeEdits] = useState<
    Record<number, string>
  >({});

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [payingBillId, setPayingBillId] = useState<number | null>(null);
  const [updatingChargeBillId, setUpdatingChargeBillId] = useState<
    number | null
  >(null);
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

      const normalizedBills = Array.isArray(billsData) ? billsData : [];

      setBills(normalizedBills);
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      setServiceChargeEdits(
        normalizedBills.reduce<Record<number, string>>((acc, bill) => {
          acc[bill.id] = String(bill.serviceCharge ?? "");
          return acc;
        }, {})
      );
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

  function handleEditBill(bill: Bill) {
    if (isPaidStatus(bill.status)) {
      setError("Paid bill cannot be updated.");
      setMessage("");
      return;
    }

    setError("");
    setMessage("");
    setEditingBillId(bill.id);
    setForm({
      patientName: bill.patientName || "",
      serviceCharge: String(bill.serviceCharge ?? ""),
      billingDate: formatDateForInput(bill.billingDate),
      appointmentId: getAppointmentId(bill.appointment),
    });
  }

  function handleCancelEdit() {
    setEditingBillId(null);
    setForm(initialForm);
    setError("");
    setMessage("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.patientName || !form.serviceCharge || !form.billingDate) {
      setError("Patient name, service charge, and billing date are required.");
      return;
    }

    const serviceCharge = Number(form.serviceCharge);

    if (Number.isNaN(serviceCharge) || serviceCharge < 0) {
      setError("Service charge must be a valid non-negative number.");
      return;
    }

    if (editingBillId !== null) {
      const selectedBill = bills.find((bill) => bill.id === editingBillId);

      if (selectedBill && isPaidStatus(selectedBill.status)) {
        setError("Paid bill cannot be updated.");
        return;
      }
    }

    const billPayload = {
      patientName: form.patientName,
      serviceCharge,
      billingDate: form.billingDate,
      appointmentId: form.appointmentId ? Number(form.appointmentId) : undefined,
    };

    try {
      setLoading(true);
      setError("");
      setMessage("");

      if (editingBillId !== null) {
        await axios.patch(
          `${API_ENDPOINT}/admin/bills/${editingBillId}`,
          billPayload,
          getAuthHeaders()
        );

        setMessage("Bill updated successfully.");
      } else {
        await axios.post(
          `${API_ENDPOINT}/admin/bills`,
          billPayload,
          getAuthHeaders()
        );

        setMessage("Bill created successfully.");
      }

      setForm(initialForm);
      setEditingBillId(null);
      await loadPageData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateServiceCharge(bill: Bill) {
    if (isPaidStatus(bill.status)) {
      setError("Paid bill service charge cannot be updated.");
      setMessage("");
      return;
    }

    const nextServiceCharge = Number(serviceChargeEdits[bill.id]);

    if (Number.isNaN(nextServiceCharge) || nextServiceCharge < 0) {
      setError("Service charge must be a valid non-negative number.");
      setMessage("");
      return;
    }

    try {
      setUpdatingChargeBillId(bill.id);
      setError("");
      setMessage("");

      await axios.patch(
        `${API_ENDPOINT}/admin/bills/${bill.id}/service-charge`,
        { serviceCharge: nextServiceCharge },
        getAuthHeaders()
      );

      setMessage("Service charge updated successfully.");
      await loadPageData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdatingChargeBillId(null);
    }
  }

  async function handlePayBill(bill: Bill) {
    if (isPaidStatus(bill.status)) {
      setError("This bill is already paid.");
      setMessage("");
      return;
    }

    try {
      setPayingBillId(bill.id);
      setError("");
      setMessage("");

      await axios.patch(
        `${API_ENDPOINT}/admin/bills/${bill.id}/pay`,
        {},
        getAuthHeaders()
      );

      setMessage("Bill marked as paid successfully.");
      await loadPageData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPayingBillId(null);
    }
  }

  async function handleDeleteBill(id: number) {
    try {
      setError("");
      setMessage("");

      await axios.delete(`${API_ENDPOINT}/admin/bills/${id}`, getAuthHeaders());

      if (editingBillId === id) {
        setEditingBillId(null);
        setForm(initialForm);
      }

      setMessage("Bill deleted successfully.");
      await loadPageData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  const isEditing = editingBillId !== null;

  return (
    <div>
      <PageHeader
        title="Billing"
        description="Manage patient invoices using the fields supported by the backend bill API."
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
          <h2 className="text-lg font-semibold text-slate-950">
            {isEditing ? `Update Bill #${editingBillId}` : "Billing Form"}
          </h2>

          {isEditing ? (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel Update
            </button>
          ) : null}
        </div>

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

          <select
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
            value={form.appointmentId}
            onChange={(e) => handleAppointmentChange(e.target.value)}
            disabled={isEditing}
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
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
            type="date"
            value={form.billingDate}
            onChange={(e) => setForm({ ...form, billingDate: e.target.value })}
            required
          />

          <div className="flex justify-end gap-2 md:col-span-2 xl:col-span-4">
            {isEditing ? (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                  ? "Update Bill"
                  : "Create Bill"}
            </button>
          </div>
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
          <table className="w-full min-w-[1200px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Invoice</th>
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3">Appointment</th>
                <th className="px-5 py-3">Service Charge</th>
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
                    colSpan={8}
                    className="px-5 py-8 text-center text-slate-500"
                  >
                    Loading bills...
                  </td>
                </tr>
              ) : null}

              {!pageLoading &&
                bills.map((bill) => {
                  const paid = isPaidStatus(bill.status);
                  const updatingCharge = updatingChargeBillId === bill.id;
                  const paying = payingBillId === bill.id;

                  return (
                    <tr key={bill.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        Invoice #{bill.id}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {bill.patientName}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {getAppointmentLabel(bill.appointment)}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {formatCurrency(bill.serviceCharge)}
                      </td>

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
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditBill(bill)}
                            disabled={paid}
                            className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Update Bill
                          </button>

                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={0}
                              value={
                                serviceChargeEdits[bill.id] ??
                                String(bill.serviceCharge ?? "")
                              }
                              onChange={(e) =>
                                setServiceChargeEdits((prev) => ({
                                  ...prev,
                                  [bill.id]: e.target.value,
                                }))
                              }
                              disabled={paid || updatingCharge}
                              className="w-28 rounded-lg border border-slate-200 px-3 py-2 text-xs disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                            />

                            <button
                              type="button"
                              onClick={() => handleUpdateServiceCharge(bill)}
                              disabled={paid || updatingCharge}
                              className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {updatingCharge ? "Updating..." : "Update Charge"}
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handlePayBill(bill)}
                            disabled={paid || paying}
                            className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {paid ? "Paid" : paying ? "Paying..." : "Pay"}
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
                  );
                })}

              {!pageLoading && bills.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
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

