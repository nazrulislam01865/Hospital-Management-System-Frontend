"use client";

import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";

type Patient = {
  id: number;
  uniqueId?: string;
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

type RoomAssignment = {
  id: number;
  status?: string;
  releasedAt?: string | null;
  patient?: Patient | null;
};

type Room = {
  id: number;
  roomType?: string;
  assignments?: RoomAssignment[];
};

type Bill = {
  id: number;
  patientId?: number | null;
  patient?: Patient | null;
  patientName: string;
  serviceCharge: number;
  roomCharge?: number | string | null;
  billingDate: string;
  status: string;
  paymentDate?: string | null;
  createdAt?: string;
  appointment?: Appointment | number | null;
};

const ROOM_CHARGE = 3000;

const initialForm = {
  patientId: "",
  patientName: "",
  serviceCharge: "",
  billingDate: "",
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

function isActiveRoomAssignment(assignment: RoomAssignment, patientId: number) {
  const status = String(assignment.status || "").toLowerCase();

  return (
    assignment.patient?.id === patientId &&
    status === "assigned" &&
    !assignment.releasedAt
  );
}

function hasAssignedRoom(rooms: Room[], patientId: number) {
  return rooms.some((room) =>
    room.assignments?.some((assignment) =>
      isActiveRoomAssignment(assignment, patientId)
    )
  );
}

function getBillPatientId(bill: Bill) {
  if (bill.patientId) {
    return bill.patientId;
  }

  if (bill.patient?.id) {
    return bill.patient.id;
  }

  if (
    bill.appointment &&
    typeof bill.appointment === "object" &&
    bill.appointment.patient?.id
  ) {
    return bill.appointment.patient.id;
  }

  return null;
}

function getBillPatientName(bill: Bill) {
  return bill.patient?.name || bill.patientName || "N/A";
}

function getBillRoomCharge(bill: Bill) {
  const roomCharge = Number(bill.roomCharge ?? 0);

  if (Number.isNaN(roomCharge)) {
    return 0;
  }

  return roomCharge;
}

function getBillBaseServiceCharge(bill: Bill) {
  const totalCharge = Number(bill.serviceCharge ?? 0);
  const roomCharge = getBillRoomCharge(bill);

  if (Number.isNaN(totalCharge)) {
    return 0;
  }

  return Math.max(0, totalCharge - roomCharge);
}

export default function BillingPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingBillId, setEditingBillId] = useState<number | null>(null);
  const [patientRoomCharge, setPatientRoomCharge] = useState(0);
  const [patientLookupLoading, setPatientLookupLoading] = useState(false);
  const [patientLookupError, setPatientLookupError] = useState("");
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

  useEffect(() => {
    const patientIdValue = form.patientId.trim();

    if (!patientIdValue) {
      setPatientLookupError("");
      setPatientRoomCharge(0);

      if (editingBillId === null) {
        setForm((prev) => ({ ...prev, patientName: "" }));
      }

      return;
    }

    const patientId = Number(patientIdValue);

    if (!Number.isInteger(patientId) || patientId <= 0) {
      setPatientLookupError("Please enter a valid patient ID.");
      setPatientRoomCharge(0);
      return;
    }

    let cancelled = false;

    const timer = window.setTimeout(async () => {
      try {
        setPatientLookupLoading(true);
        setPatientLookupError("");

        const [patientResponse, roomsResponse] = await Promise.all([
          axios.get(
            `${API_ENDPOINT}/admin/patients/${patientId}`,
            getAuthHeaders()
          ),
          axios.get(`${API_ENDPOINT}/admin/rooms`, getAuthHeaders()),
        ]);

        if (cancelled) {
          return;
        }

        const patient = extractData<Patient>(patientResponse);
        const roomsData = extractData<Room[]>(roomsResponse);
        const rooms = Array.isArray(roomsData) ? roomsData : [];
        const activeRoomCharge = hasAssignedRoom(rooms, patientId)
          ? ROOM_CHARGE
          : 0;

        setForm((prev) => ({
          ...prev,
          patientName: patient.name || "",
        }));
        setPatientRoomCharge(activeRoomCharge);
      } catch (err) {
        if (!cancelled) {
          setPatientLookupError(getErrorMessage(err));
          setPatientRoomCharge(0);
          setForm((prev) => ({ ...prev, patientName: "" }));
        }
      } finally {
        if (!cancelled) {
          setPatientLookupLoading(false);
        }
      }
    }, 400);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [form.patientId, editingBillId]);

  async function loadPageData() {
    try {
      setPageLoading(true);
      setError("");

      const billsResponse = await axios.get(
        `${API_ENDPOINT}/admin/bills`,
        getAuthHeaders()
      );

      const billsData = extractData<Bill[]>(billsResponse);
      const normalizedBills = Array.isArray(billsData) ? billsData : [];

      setBills(normalizedBills);
      setServiceChargeEdits(
        normalizedBills.reduce<Record<number, string>>((acc, bill) => {
          acc[bill.id] = String(getBillBaseServiceCharge(bill));
          return acc;
        }, {})
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPageLoading(false);
    }
  }

  function getFormBaseServiceCharge() {
    const baseServiceCharge = Number(form.serviceCharge || 0);

    if (Number.isNaN(baseServiceCharge)) {
      return 0;
    }

    return baseServiceCharge;
  }

  function getFormTotalCharge() {
    return getFormBaseServiceCharge() + patientRoomCharge;
  }

  function handleEditBill(bill: Bill) {
    if (isPaidStatus(bill.status)) {
      setError("Paid bill cannot be updated.");
      setMessage("");
      return;
    }

    const billPatientId = getBillPatientId(bill);
    const billRoomCharge = getBillRoomCharge(bill);

    setError("");
    setMessage("");
    setPatientLookupError("");
    setPatientRoomCharge(billRoomCharge);
    setEditingBillId(bill.id);
    setForm({
      patientId: billPatientId ? String(billPatientId) : "",
      patientName: getBillPatientName(bill),
      serviceCharge: String(getBillBaseServiceCharge(bill)),
      billingDate: formatDateForInput(bill.billingDate),
    });
  }

  function handleCancelEdit() {
    setEditingBillId(null);
    setPatientRoomCharge(0);
    setPatientLookupError("");
    setForm(initialForm);
    setError("");
    setMessage("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (editingBillId === null && !form.patientId) {
      setError("Patient ID is required.");
      return;
    }

    if (!form.patientName || !form.serviceCharge || !form.billingDate) {
      setError("Patient name, service charge, and billing date are required.");
      return;
    }

    const baseServiceCharge = Number(form.serviceCharge);

    if (Number.isNaN(baseServiceCharge) || baseServiceCharge < 0) {
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
      patientId: form.patientId ? Number(form.patientId) : undefined,
      patientName: form.patientName,
      serviceCharge: baseServiceCharge + patientRoomCharge,
      roomCharge: patientRoomCharge,
      billingDate: form.billingDate,
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
      setPatientRoomCharge(0);
      setPatientLookupError("");
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

    const nextBaseServiceCharge = Number(serviceChargeEdits[bill.id]);
    const roomCharge = getBillRoomCharge(bill);

    if (Number.isNaN(nextBaseServiceCharge) || nextBaseServiceCharge < 0) {
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
        {
          serviceCharge: nextBaseServiceCharge + roomCharge,
          roomCharge,
        },
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
        setPatientRoomCharge(0);
      }

      setMessage("Bill deleted successfully.");
      await loadPageData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  const isEditing = editingBillId !== null;
  const formBaseServiceCharge = getFormBaseServiceCharge();
  const formTotalCharge = getFormTotalCharge();

  return (
    <div>
      <PageHeader
        title="Billing"
        description="Create bills by patient ID. Patient name and assigned room charge are loaded automatically."
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
            {isEditing ? `Update Bill #${editingBillId}` : "Create Bill"}
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
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          <div>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              placeholder="Patient ID"
              type="number"
              min={1}
              value={form.patientId}
              onChange={(e) =>
                setForm({ ...form, patientId: e.target.value })
              }
              required={!isEditing}
            />
            {patientLookupLoading ? (
              <p className="mt-1 text-xs text-slate-500">Loading patient...</p>
            ) : null}
            {patientLookupError ? (
              <p className="mt-1 text-xs font-medium text-red-600">
                {patientLookupError}
              </p>
            ) : null}
          </div>

          <input
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            placeholder="Patient Name"
            value={form.patientName}
            readOnly
            required
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
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
            value={`Room Charge: ${formatCurrency(patientRoomCharge)}`}
            readOnly
          />

          <input
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900"
            value={`Total: ${formatCurrency(formBaseServiceCharge + patientRoomCharge)}`}
            readOnly
          />

          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
            type="date"
            value={form.billingDate}
            onChange={(e) => setForm({ ...form, billingDate: e.target.value })}
            required
          />

          <div className="flex justify-end gap-2 md:col-span-2 xl:col-span-3">
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
              disabled={loading || patientLookupLoading || !form.patientName}
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

        {patientRoomCharge > 0 ? (
          <p className="mt-3 text-sm font-medium text-green-700">
            This patient has an assigned room. ৳ 3000 room charge is added to
            the bill total automatically.
          </p>
        ) : null}

        {form.serviceCharge ? (
          <p className="mt-2 text-sm text-slate-500">
            Service charge {formatCurrency(formBaseServiceCharge)} + room charge{" "}
            {formatCurrency(patientRoomCharge)} = total bill{" "}
            {formatCurrency(formTotalCharge)}.
          </p>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-950">
            Billing Records
          </h2>
          <p className="text-sm text-slate-500">
            Paid bills are locked and cannot be updated.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Invoice</th>
                <th className="px-5 py-3">Patient ID</th>
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3">Service Charge</th>
                <th className="px-5 py-3">Room Charge</th>
                <th className="px-5 py-3">Total</th>
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
                    colSpan={10}
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
                  const roomCharge = getBillRoomCharge(bill);
                  const baseServiceCharge = getBillBaseServiceCharge(bill);
                  const billPatientId = getBillPatientId(bill);

                  return (
                    <tr key={bill.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        Invoice #{bill.id}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {billPatientId ? `#${billPatientId}` : "N/A"}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {getBillPatientName(bill)}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {formatCurrency(baseServiceCharge)}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {formatCurrency(roomCharge)}
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-900">
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
                                String(baseServiceCharge)
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
                    colSpan={10}
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


// "use client";

// import { useEffect, useState, type FormEvent } from "react";
// import axios from "axios";
// import { PageHeader } from "@/components/admin/PageHeader";
// import { StatusBadge } from "@/components/admin/StatusBadge";

// type Patient = {
//   id: number;
//   name: string;
//   email?: string;
// };

// type Appointment = {
//   id?: number;
//   patient?: Patient | null;
//   doctorName?: string;
//   appointmentDate?: string;
//   status?: string;
//   paymentStatus?: string;
// };

// type Bill = {
//   id: number;
//   patientName: string;
//   serviceCharge: number;
//   billingDate: string;
//   status: string;
//   paymentDate?: string | null;
//   createdAt?: string;
//   appointment?: Appointment | number | null;
// };

// const initialForm = {
//   patientName: "",
//   serviceCharge: "",
//   billingDate: "",
//   appointmentId: "",
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

// function formatDate(dateValue?: string | null) {
//   if (!dateValue) {
//     return "N/A";
//   }

//   const date = new Date(dateValue);

//   if (Number.isNaN(date.getTime())) {
//     return dateValue;
//   }

//   return date.toLocaleDateString();
// }

// function formatDateForInput(dateValue?: string | null) {
//   if (!dateValue) {
//     return "";
//   }

//   if (/^\d{4}-\d{2}-\d{2}/.test(dateValue)) {
//     return dateValue.slice(0, 10);
//   }

//   const date = new Date(dateValue);

//   if (Number.isNaN(date.getTime())) {
//     return "";
//   }

//   return date.toISOString().slice(0, 10);
// }

// function formatCurrency(value?: number | string | null) {
//   const amount = Number(value ?? 0);

//   if (Number.isNaN(amount)) {
//     return "৳ 0.00";
//   }

//   return `৳ ${amount.toFixed(2)}`;
// }

// function isPaidStatus(status?: string | null) {
//   return String(status || "").toLowerCase() === "paid";
// }

// function getAppointmentLabel(appointment?: Appointment | number | null) {
//   if (!appointment) {
//     return "N/A";
//   }

//   if (typeof appointment === "number") {
//     return `#${appointment}`;
//   }

//   if (appointment.id) {
//     return `#${appointment.id}`;
//   }

//   if (appointment.patient?.name) {
//     return appointment.patient.name;
//   }

//   if (appointment.appointmentDate) {
//     return formatDate(appointment.appointmentDate);
//   }

//   return "Linked";
// }

// function getAppointmentId(appointment?: Appointment | number | null) {
//   if (!appointment) {
//     return "";
//   }

//   if (typeof appointment === "number") {
//     return String(appointment);
//   }

//   return appointment.id ? String(appointment.id) : "";
// }

// export default function BillingPage() {
//   const [bills, setBills] = useState<Bill[]>([]);
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [form, setForm] = useState(initialForm);
//   const [editingBillId, setEditingBillId] = useState<number | null>(null);
//   const [serviceChargeEdits, setServiceChargeEdits] = useState<
//     Record<number, string>
//   >({});

//   const [loading, setLoading] = useState(false);
//   const [pageLoading, setPageLoading] = useState(true);
//   const [payingBillId, setPayingBillId] = useState<number | null>(null);
//   const [updatingChargeBillId, setUpdatingChargeBillId] = useState<
//     number | null
//   >(null);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     loadPageData();
//   }, []);

//   async function loadPageData() {
//     try {
//       setPageLoading(true);
//       setError("");

//       const [billsResponse, appointmentsResponse] = await Promise.all([
//         axios.get(`${API_ENDPOINT}/admin/bills`, getAuthHeaders()),
//         axios.get(`${API_ENDPOINT}/admin/appointments`, getAuthHeaders()),
//       ]);

//       const billsData = extractData<Bill[]>(billsResponse);
//       const appointmentsData =
//         extractData<Appointment[]>(appointmentsResponse);

//       const normalizedBills = Array.isArray(billsData) ? billsData : [];

//       setBills(normalizedBills);
//       setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
//       setServiceChargeEdits(
//         normalizedBills.reduce<Record<number, string>>((acc, bill) => {
//           acc[bill.id] = String(bill.serviceCharge ?? "");
//           return acc;
//         }, {})
//       );
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setPageLoading(false);
//     }
//   }

//   function handleAppointmentChange(appointmentId: string) {
//     const selectedAppointment = appointments.find(
//       (appointment) => String(appointment.id) === appointmentId
//     );

//     setForm((prev) => ({
//       ...prev,
//       appointmentId,
//       patientName: selectedAppointment?.patient?.name || prev.patientName,
//     }));
//   }

//   function handleEditBill(bill: Bill) {
//     if (isPaidStatus(bill.status)) {
//       setError("Paid bill cannot be updated.");
//       setMessage("");
//       return;
//     }

//     setError("");
//     setMessage("");
//     setEditingBillId(bill.id);
//     setForm({
//       patientName: bill.patientName || "",
//       serviceCharge: String(bill.serviceCharge ?? ""),
//       billingDate: formatDateForInput(bill.billingDate),
//       appointmentId: getAppointmentId(bill.appointment),
//     });
//   }

//   function handleCancelEdit() {
//     setEditingBillId(null);
//     setForm(initialForm);
//     setError("");
//     setMessage("");
//   }

//   async function handleSubmit(e: FormEvent<HTMLFormElement>) {
//     e.preventDefault();

//     if (!form.patientName || !form.serviceCharge || !form.billingDate) {
//       setError("Patient name, service charge, and billing date are required.");
//       return;
//     }

//     const serviceCharge = Number(form.serviceCharge);

//     if (Number.isNaN(serviceCharge) || serviceCharge < 0) {
//       setError("Service charge must be a valid non-negative number.");
//       return;
//     }

//     if (editingBillId !== null) {
//       const selectedBill = bills.find((bill) => bill.id === editingBillId);

//       if (selectedBill && isPaidStatus(selectedBill.status)) {
//         setError("Paid bill cannot be updated.");
//         return;
//       }
//     }

//     const billPayload = {
//       patientName: form.patientName,
//       serviceCharge,
//       billingDate: form.billingDate,
//       appointmentId: form.appointmentId ? Number(form.appointmentId) : undefined,
//     };

//     try {
//       setLoading(true);
//       setError("");
//       setMessage("");

//       if (editingBillId !== null) {
//         await axios.patch(
//           `${API_ENDPOINT}/admin/bills/${editingBillId}`,
//           billPayload,
//           getAuthHeaders()
//         );

//         setMessage("Bill updated successfully.");
//       } else {
//         await axios.post(
//           `${API_ENDPOINT}/admin/bills`,
//           billPayload,
//           getAuthHeaders()
//         );

//         setMessage("Bill created successfully.");
//       }

//       setForm(initialForm);
//       setEditingBillId(null);
//       await loadPageData();
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleUpdateServiceCharge(bill: Bill) {
//     if (isPaidStatus(bill.status)) {
//       setError("Paid bill service charge cannot be updated.");
//       setMessage("");
//       return;
//     }

//     const nextServiceCharge = Number(serviceChargeEdits[bill.id]);

//     if (Number.isNaN(nextServiceCharge) || nextServiceCharge < 0) {
//       setError("Service charge must be a valid non-negative number.");
//       setMessage("");
//       return;
//     }

//     try {
//       setUpdatingChargeBillId(bill.id);
//       setError("");
//       setMessage("");

//       await axios.patch(
//         `${API_ENDPOINT}/admin/bills/${bill.id}/service-charge`,
//         { serviceCharge: nextServiceCharge },
//         getAuthHeaders()
//       );

//       setMessage("Service charge updated successfully.");
//       await loadPageData();
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setUpdatingChargeBillId(null);
//     }
//   }

//   async function handlePayBill(bill: Bill) {
//     if (isPaidStatus(bill.status)) {
//       setError("This bill is already paid.");
//       setMessage("");
//       return;
//     }

//     try {
//       setPayingBillId(bill.id);
//       setError("");
//       setMessage("");

//       await axios.patch(
//         `${API_ENDPOINT}/admin/bills/${bill.id}/pay`,
//         {},
//         getAuthHeaders()
//       );

//       setMessage("Bill marked as paid successfully.");
//       await loadPageData();
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setPayingBillId(null);
//     }
//   }

//   async function handleDeleteBill(id: number) {
//     try {
//       setError("");
//       setMessage("");

//       await axios.delete(`${API_ENDPOINT}/admin/bills/${id}`, getAuthHeaders());

//       if (editingBillId === id) {
//         setEditingBillId(null);
//         setForm(initialForm);
//       }

//       setMessage("Bill deleted successfully.");
//       await loadPageData();
//     } catch (err) {
//       setError(getErrorMessage(err));
//     }
//   }

//   const isEditing = editingBillId !== null;

//   return (
//     <div>
//       <PageHeader
//         title="Billing"
//         description="Manage patient invoices using the fields supported by the backend bill API."
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
//         <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
//           <h2 className="text-lg font-semibold text-slate-950">
//             {isEditing ? `Update Bill #${editingBillId}` : "Billing Form"}
//           </h2>

//           {isEditing ? (
//             <button
//               type="button"
//               onClick={handleCancelEdit}
//               className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
//             >
//               Cancel Update
//             </button>
//           ) : null}
//         </div>

//         <form
//           id="billing-form"
//           onSubmit={handleSubmit}
//           className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
//         >
//           <input
//             className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
//             placeholder="Patient Name"
//             value={form.patientName}
//             onChange={(e) => setForm({ ...form, patientName: e.target.value })}
//             required
//           />

//           <select
//             className="rounded-xl border border-slate-200 px-4 py-3 text-sm disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
//             value={form.appointmentId}
//             onChange={(e) => handleAppointmentChange(e.target.value)}
//             disabled={isEditing}
//           >
//             <option value="">No Appointment</option>
//             {appointments.map((appointment) => (
//               <option key={appointment.id} value={appointment.id}>
//                 Appointment #{appointment.id} —{" "}
//                 {appointment.patient?.name || "N/A"}
//               </option>
//             ))}
//           </select>

//           <input
//             className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
//             placeholder="Service Charge"
//             type="number"
//             min={0}
//             value={form.serviceCharge}
//             onChange={(e) =>
//               setForm({ ...form, serviceCharge: e.target.value })
//             }
//             required
//           />

//           <input
//             className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
//             type="date"
//             value={form.billingDate}
//             onChange={(e) => setForm({ ...form, billingDate: e.target.value })}
//             required
//           />

//           <div className="flex justify-end gap-2 md:col-span-2 xl:col-span-4">
//             {isEditing ? (
//               <button
//                 type="button"
//                 onClick={handleCancelEdit}
//                 className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
//               >
//                 Cancel
//               </button>
//             ) : null}

//             <button
//               type="submit"
//               disabled={loading}
//               className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
//             >
//               {loading
//                 ? isEditing
//                   ? "Updating..."
//                   : "Creating..."
//                 : isEditing
//                   ? "Update Bill"
//                   : "Create Bill"}
//             </button>
//           </div>
//         </form>
//       </section>

//       <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
//         <div className="border-b border-slate-200 p-5">
//           <h2 className="text-lg font-semibold text-slate-950">
//             Billing Records
//           </h2>
//           <p className="text-sm text-slate-500">
//             Data is loaded from backend bill API.
//           </p>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[1200px] text-left text-sm">
//             <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
//               <tr>
//                 <th className="px-5 py-3">Invoice</th>
//                 <th className="px-5 py-3">Patient</th>
//                 <th className="px-5 py-3">Appointment</th>
//                 <th className="px-5 py-3">Service Charge</th>
//                 <th className="px-5 py-3">Billing Date</th>
//                 <th className="px-5 py-3">Payment Date</th>
//                 <th className="px-5 py-3">Status</th>
//                 <th className="px-5 py-3">Actions</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-slate-100">
//               {pageLoading ? (
//                 <tr>
//                   <td
//                     colSpan={8}
//                     className="px-5 py-8 text-center text-slate-500"
//                   >
//                     Loading bills...
//                   </td>
//                 </tr>
//               ) : null}

//               {!pageLoading &&
//                 bills.map((bill) => {
//                   const paid = isPaidStatus(bill.status);
//                   const updatingCharge = updatingChargeBillId === bill.id;
//                   const paying = payingBillId === bill.id;

//                   return (
//                     <tr key={bill.id} className="hover:bg-slate-50">
//                       <td className="px-5 py-4 font-semibold text-slate-900">
//                         Invoice #{bill.id}
//                       </td>

//                       <td className="px-5 py-4 text-slate-700">
//                         {bill.patientName}
//                       </td>

//                       <td className="px-5 py-4 text-slate-700">
//                         {getAppointmentLabel(bill.appointment)}
//                       </td>

//                       <td className="px-5 py-4 text-slate-700">
//                         {formatCurrency(bill.serviceCharge)}
//                       </td>

//                       <td className="px-5 py-4 text-slate-700">
//                         {formatDate(bill.billingDate)}
//                       </td>

//                       <td className="px-5 py-4 text-slate-700">
//                         {formatDate(bill.paymentDate)}
//                       </td>

//                       <td className="px-5 py-4">
//                         <StatusBadge status={bill.status || "Unpaid"} />
//                       </td>

//                       <td className="px-5 py-4">
//                         <div className="flex flex-wrap items-center gap-2">
//                           <button
//                             type="button"
//                             onClick={() => handleEditBill(bill)}
//                             disabled={paid}
//                             className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
//                           >
//                             Update Bill
//                           </button>

//                           <div className="flex items-center gap-2">
//                             <input
//                               type="number"
//                               min={0}
//                               value={
//                                 serviceChargeEdits[bill.id] ??
//                                 String(bill.serviceCharge ?? "")
//                               }
//                               onChange={(e) =>
//                                 setServiceChargeEdits((prev) => ({
//                                   ...prev,
//                                   [bill.id]: e.target.value,
//                                 }))
//                               }
//                               disabled={paid || updatingCharge}
//                               className="w-28 rounded-lg border border-slate-200 px-3 py-2 text-xs disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
//                             />

//                             <button
//                               type="button"
//                               onClick={() => handleUpdateServiceCharge(bill)}
//                               disabled={paid || updatingCharge}
//                               className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
//                             >
//                               {updatingCharge ? "Updating..." : "Update Charge"}
//                             </button>
//                           </div>

//                           <button
//                             type="button"
//                             onClick={() => handlePayBill(bill)}
//                             disabled={paid || paying}
//                             className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
//                           >
//                             {paid ? "Paid" : paying ? "Paying..." : "Pay"}
//                           </button>

//                           <button
//                             type="button"
//                             onClick={() => handleDeleteBill(bill.id)}
//                             className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}

//               {!pageLoading && bills.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={8}
//                     className="px-5 py-8 text-center text-slate-500"
//                   >
//                     No bills found.
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

