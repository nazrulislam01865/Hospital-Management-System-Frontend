"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "axios";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";

type Patient = {
  id: number;
  uniqueId?: string;
  name: string;
  email: string;
  dateOfBirth?: string | null;
  socialMediaLinks?: string[] | string | null;
  createdAt?: string | null;
};

type Appointment = {
  id: number;
  uniqueId?: string;
  patient?: Patient | null;
  doctorName?: string;
  appointmentDate?: string;
  status?: string;
  paymentStatus?: string;
  createdAt?: string;
};

type Bill = {
  id: number;
  patientId?: number | null;
  patientName: string;
  serviceCharge: number | string;
  roomCharge?: number | string | null;
  billingDate: string;
  status: string;
  paymentDate?: string | null;
  createdAt?: string;
  patient?: Patient | null;
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

function formatCurrency(value?: number | string | null) {
  const amount = Number(value ?? 0);

  if (Number.isNaN(amount)) {
    return "৳ 0.00";
  }

  return `৳ ${amount.toFixed(2)}`;
}

function getBillTotal(bill: Bill) {
  return Number(bill.serviceCharge ?? 0) + Number(bill.roomCharge ?? 0);
}

function normalizeSocialLinks(value?: string[] | string | null) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function PatientDetailsPage() {
  const params = useParams<{ id: string }>();
  const patientId = Number(params.id);

  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const socialLinks = useMemo(
    () => normalizeSocialLinks(patient?.socialMediaLinks),
    [patient?.socialMediaLinks]
  );

  const totalBilled = useMemo(
    () => bills.reduce((total, bill) => total + getBillTotal(bill), 0),
    [bills]
  );

  const totalPaid = useMemo(
    () =>
      bills.reduce((total, bill) => {
        if (String(bill.status).toLowerCase() === "paid") {
          return total + getBillTotal(bill);
        }

        return total;
      }, 0),
    [bills]
  );

  const totalOutstanding = totalBilled - totalPaid;

  useEffect(() => {
    if (!Number.isNaN(patientId) && patientId > 0) {
      loadPatientDetails();
    } else {
      setError("Invalid patient ID.");
      setLoading(false);
    }
  }, [patientId]);

  async function loadPatientDetails() {
    try {
      setLoading(true);
      setError("");

      const [patientResponse, appointmentsResponse, billsResponse] =
        await Promise.all([
          axios.get(
            `${API_ENDPOINT}/admin/patients/${patientId}`,
            getAuthHeaders()
          ),
          axios.get(`${API_ENDPOINT}/admin/appointments`, getAuthHeaders()),
          axios.get(`${API_ENDPOINT}/admin/bills`, getAuthHeaders()),
        ]);

      const patientData = extractData<Patient>(patientResponse);
      const appointmentsData =
        extractData<Appointment[]>(appointmentsResponse);
      const billsData = extractData<Bill[]>(billsResponse);

      const filteredAppointments = Array.isArray(appointmentsData)
        ? appointmentsData.filter(
            (appointment) => appointment.patient?.id === patientId
          )
        : [];

      const filteredBills = Array.isArray(billsData)
        ? billsData.filter((bill) => {
            if (bill.patientId === patientId) {
              return true;
            }

            if (bill.patient?.id === patientId) {
              return true;
            }

            return bill.patientName === patientData.name;
          })
        : [];

      setPatient(patientData);
      setAppointments(filteredAppointments);
      setBills(filteredBills);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Patient Details"
        description="Dynamic route page for individual patient information, appointments, and billing records."
        action={
          <Link
            href="/admin/dashboard/patients"
            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            Back to Patients
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
          Loading patient details...
        </div>
      ) : null}

      {!loading && patient ? (
        <>
          <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Patient ID</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950">
                #{patient.id}
              </h3>
              <p className="mt-1 text-xsmt-1 text-slate-500">
                Unique ID: {patient.uniqueId || "N/A"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Appointments</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950">
                {appointments.length}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Total appointments for this patient
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Total Billed</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950">
                {formatCurrency(totalBilled)}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Service charge + room charge
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Outstanding</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950">
                {formatCurrency(totalOutstanding)}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Paid: {formatCurrency(totalPaid)}
              </p>
            </div>
          </section>

          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-950">
              Basic Information
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Name
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {patient.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Email
                </p>
                <p className="mt-1 text-slate-700">{patient.email}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Date of Birth
                </p>
                <p className="mt-1 text-slate-700">
                  {formatDate(patient.dateOfBirth)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Created At
                </p>
                <p className="mt-1 text-slate-700">
                  {formatDateTime(patient.createdAt)}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Social Media Links
                </p>

                {socialLinks.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {socialLinks.map((link) => (
                      <a
                        key={link}
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1 text-slate-700">N/A</p>
                )}
              </div>
            </div>
          </section>

          <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h2 className="text-lg font-semibold text-slate-950">
                Patient Appointments
              </h2>
              <p className="text-sm text-slate-500">
                Appointments filtered by patient ID.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Appointment</th>
                    <th className="px-5 py-3">Doctor</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Payment</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        #{appointment.id}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {appointment.doctorName || "N/A"}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {formatDateTime(appointment.appointmentDate)}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={appointment.status || "Pending"} />
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge
                          status={appointment.paymentStatus || "Unpaid"}
                        />
                      </td>
                    </tr>
                  ))}

                  {appointments.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-8 text-center text-slate-500"
                      >
                        No appointments found for this patient.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h2 className="text-lg font-semibold text-slate-950">
                Patient Bills
              </h2>
              <p className="text-sm text-slate-500">
                Billing records filtered by patient ID or patient name.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Invoice</th>
                    <th className="px-5 py-3">Service Charge</th>
                    <th className="px-5 py-3">Room Charge</th>
                    <th className="px-5 py-3">Total</th>
                    <th className="px-5 py-3">Billing Date</th>
                    <th className="px-5 py-3">Payment Date</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {bills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        Invoice #{bill.id}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {formatCurrency(bill.serviceCharge)}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {formatCurrency(bill.roomCharge)}
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-900">
                        {formatCurrency(getBillTotal(bill))}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {formatDate(bill.billingDate)}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {formatDateTime(bill.paymentDate)}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={bill.status || "Unpaid"} />
                      </td>
                    </tr>
                  ))}

                  {bills.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-8 text-center text-slate-500"
                      >
                        No bills found for this patient.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}