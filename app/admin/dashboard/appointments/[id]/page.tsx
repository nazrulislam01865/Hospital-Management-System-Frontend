"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "axios";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";

type Patient = {
  id?: number;
  uniqueId?: string;
  name?: string;
  email?: string;
  dateOfBirth?: string | null;
  socialMediaLinks?: string[] | string | null;
  createdAt?: string | null;
};

type Admin = {
  id?: number;
  adminId?: number;
  name?: string;
  uname?: string;
  email?: string;
};

type Bill = {
  id?: number;
  patientName?: string;
  serviceCharge?: number | string;
  roomCharge?: number | string | null;
  billingDate?: string;
  status?: string;
  paymentDate?: string | null;
};

type Appointment = {
  id: number;
  uniqueId?: string;
  patient?: Patient | null;
  admin?: Admin | null;
  bill?: Bill | null;
  doctorName?: string;
  appointmentDate?: string;
  status?: string;
  paymentStatus?: string;
  createdAt?: string;
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

function formatCurrency(value?: number | string | null) {
  const amount = Number(value ?? 0);

  if (Number.isNaN(amount)) {
    return "৳ 0.00";
  }

  return `৳ ${amount.toFixed(2)}`;
}

function getBillTotal(bill?: Bill | null) {
  if (!bill) {
    return 0;
  }

  return Number(bill.serviceCharge ?? 0) + Number(bill.roomCharge ?? 0);
}

function normalizeAppointment(data: Appointment | unknown[]): Appointment | null {
  if (Array.isArray(data)) {
    return {
      id: Number(data[0]),
      patient: {
        name: typeof data[1] === "string" ? data[1] : "N/A",
      },
      doctorName: typeof data[2] === "string" ? data[2] : "N/A",
      appointmentDate: typeof data[3] === "string" ? data[3] : "",
      paymentStatus: typeof data[4] === "string" ? data[4] : "N/A",
      status: "N/A",
    };
  }

  if (data && typeof data === "object" && "id" in data) {
    return data as Appointment;
  }

  return null;
}

function findMatchingPatient(
  appointment: Appointment,
  patients: Patient[]
): Patient | null {
  const appointmentPatient = appointment.patient;

  if (!appointmentPatient) {
    return null;
  }

  if (appointmentPatient.id) {
    const matchById = patients.find(
      (patient) => Number(patient.id) === Number(appointmentPatient.id)
    );

    if (matchById) {
      return matchById;
    }
  }

  if (appointmentPatient.name) {
    const matchByName = patients.find(
      (patient) =>
        patient.name?.trim().toLowerCase() ===
        appointmentPatient.name?.trim().toLowerCase()
    );

    if (matchByName) {
      return matchByName;
    }
  }

  return appointmentPatient;
}

function mergePatientData(
  appointmentPatient?: Patient | null,
  matchedPatient?: Patient | null
): Patient | null {
  if (!appointmentPatient && !matchedPatient) {
    return null;
  }

  return {
    id: matchedPatient?.id ?? appointmentPatient?.id,
    uniqueId: matchedPatient?.uniqueId ?? appointmentPatient?.uniqueId,
    name: matchedPatient?.name ?? appointmentPatient?.name,
    email: matchedPatient?.email ?? appointmentPatient?.email,
    dateOfBirth: matchedPatient?.dateOfBirth ?? appointmentPatient?.dateOfBirth,
    socialMediaLinks:
      matchedPatient?.socialMediaLinks ?? appointmentPatient?.socialMediaLinks,
    createdAt: matchedPatient?.createdAt ?? appointmentPatient?.createdAt,
  };
}

export default function AppointmentDetailsPage() {
  const params = useParams<{ id: string }>();
  const appointmentId = Number(params.id);

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const hasPatientDetails = useMemo(() => {
    return Boolean(patient?.id || patient?.uniqueId || patient?.email);
  }, [patient]);

  useEffect(() => {
    if (!Number.isInteger(appointmentId) || appointmentId < 1) {
      setError("Invalid appointment ID.");
      setLoading(false);
      return;
    }

    loadAppointmentDetails();
  }, [appointmentId]);

  async function loadAppointmentDetails() {
    try {
      setLoading(true);
      setError("");

      const [appointmentResponse, patientsResponse] = await Promise.all([
        axios.get(
          `${API_ENDPOINT}/admin/appointments/${appointmentId}`,
          getAuthHeaders()
        ),
        axios.get(`${API_ENDPOINT}/admin/patients`, getAuthHeaders()),
      ]);

      const appointmentData = extractData<Appointment | unknown[]>(
        appointmentResponse
      );

      const patientsData = extractData<Patient[]>(patientsResponse);

      const normalizedAppointment = normalizeAppointment(appointmentData);

      if (!normalizedAppointment) {
        setError("Appointment data format is invalid.");
        return;
      }

      const patientsList = Array.isArray(patientsData) ? patientsData : [];
      const matchedPatient = findMatchingPatient(
        normalizedAppointment,
        patientsList
      );

      const fullPatient = mergePatientData(
        normalizedAppointment.patient,
        matchedPatient
      );

      setAppointment({
        ...normalizedAppointment,
        patient: fullPatient,
      });

      setPatient(fullPatient);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Appointment Details"
        description="Dynamic appointment details page."
        action={
          <Link
            href="/admin/dashboard/appointments"
            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            Back to Appointments
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
          Loading appointment details...
        </div>
      ) : null}

      {!loading && appointment ? (
        <>
          <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Appointment ID</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950">
                #{appointment.id}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Unique ID: {appointment.uniqueId || "N/A"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Patient</p>
              <h3 className="mt-2 text-xl font-bold text-slate-950">
                {patient?.name || "N/A"}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Patient ID: {patient?.id || "N/A"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Username / Unique ID: {patient?.uniqueId || "N/A"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Appointment Status</p>
              <div className="mt-3">
                <StatusBadge status={appointment.status || "N/A"} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Payment Status</p>
              <div className="mt-3">
                <StatusBadge status={appointment.paymentStatus || "Unpaid"} />
              </div>
            </div>
          </section>

          {!hasPatientDetails ? (
            <div className="mb-6 rounded-xl bg-yellow-50 px-4 py-3 text-sm font-medium text-yellow-700">
              Patient name was found, but patient ID, unique ID, and email were
              not returned by the appointment API. The page tried to match the
              patient from the patient list. If these values still show N/A,
              update the backend method shown below.
            </div>
          ) : null}

          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-950">
              Appointment Information
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Doctor Name
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {appointment.doctorName || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Appointment Date
                </p>
                <p className="mt-1 text-slate-700">
                  {formatDateTime(appointment.appointmentDate)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Created At
                </p>
                <p className="mt-1 text-slate-700">
                  {formatDateTime(appointment.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Created By Admin
                </p>
                <p className="mt-1 text-slate-700">
                  {appointment.admin?.name || appointment.admin?.email || "N/A"}
                </p>
              </div>
            </div>
          </section>

          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-950">
              Patient Information
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Patient ID
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {patient?.id || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Patient Username / Unique ID
                </p>
                <p className="mt-1 text-slate-700">
                  {patient?.uniqueId || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Patient Name
                </p>
                <p className="mt-1 text-slate-700">
                  {patient?.name || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Patient Email
                </p>
                <p className="mt-1 text-slate-700">
                  {patient?.email || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Date of Birth
                </p>
                <p className="mt-1 text-slate-700">
                  {formatDate(patient?.dateOfBirth)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Patient Created At
                </p>
                <p className="mt-1 text-slate-700">
                  {formatDateTime(patient?.createdAt)}
                </p>
              </div>
            </div>

            {patient?.id ? (
              <div className="mt-5">
                <Link
                  href={`/admin/dashboard/patients/${patient.id}`}
                  className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                >
                  View Patient Details
                </Link>
              </div>
            ) : null}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-950">
              Linked Bill
            </h2>

            {appointment.bill ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Invoice
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    #{appointment.bill.id}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Service Charge
                  </p>
                  <p className="mt-1 text-slate-700">
                    {formatCurrency(appointment.bill.serviceCharge)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Room Charge
                  </p>
                  <p className="mt-1 text-slate-700">
                    {formatCurrency(appointment.bill.roomCharge)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Total
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {formatCurrency(getBillTotal(appointment.bill))}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Billing Date
                  </p>
                  <p className="mt-1 text-slate-700">
                    {formatDate(appointment.bill.billingDate)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Payment Date
                  </p>
                  <p className="mt-1 text-slate-700">
                    {formatDateTime(appointment.bill.paymentDate)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Bill Status
                  </p>
                  <div className="mt-1">
                    <StatusBadge status={appointment.bill.status || "Unpaid"} />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No bill is linked with this appointment.
              </p>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}