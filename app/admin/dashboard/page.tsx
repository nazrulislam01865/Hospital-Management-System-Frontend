"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { InfoPanel } from "@/components/admin/InfoPanel";
import { MetricCard } from "@/components/admin/MetricCard";
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

type Room = {
  id: number;
  uniqueId?: string;
  roomType: string;
  totalBeds: number;
  availableBeds: number;
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

type BillingReportSummary = {
  totalBills: number;
  paidBills: number;
  unpaidBills: number;
  totalBilledAmount: number;
  totalPaidAmount: number;
  totalOutstandingAmount: number;
};

type BillingReport = {
  message?: string;
  generatedFor?: string;
  filter?: {
    startDate?: string | null;
    endDate?: string | null;
  };
  summary?: BillingReportSummary;
  data?: Bill[];
};

type DashboardMetric = {
  title: string;
  value: string;
  helper: string;
};

const API_ENDPOINT =
  process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:4000";

const emptyBillingSummary: BillingReportSummary = {
  totalBills: 0,
  paidBills: 0,
  unpaidBills: 0,
  totalBilledAmount: 0,
  totalPaidAmount: 0,
  totalOutstandingAmount: 0,
};

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

function extractBillingReport(response: { data: unknown }): BillingReport {
  const payload = response.data as
    | BillingReport
    | { data?: BillingReport | Bill[] }
    | Bill[]
    | null
    | undefined;

  if (Array.isArray(payload)) {
    return { data: payload };
  }

  if (!payload || typeof payload !== "object") {
    return { data: [] };
  }

  if ("summary" in payload) {
    return payload as BillingReport;
  }

  const nestedData = "data" in payload ? payload.data : undefined;

  if (Array.isArray(nestedData)) {
    return { data: nestedData };
  }

  if (nestedData && typeof nestedData === "object" && "summary" in nestedData) {
    return nestedData as BillingReport;
  }

  return { data: [] };
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

  return "Something went wrong while loading dashboard data.";
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

function isPaidStatus(status?: string | null) {
  return String(status || "").toLowerCase() === "paid";
}

function getBillTotal(bill: Bill) {
  const serviceCharge = Number(bill.serviceCharge ?? 0);
  const roomCharge = Number(bill.roomCharge ?? 0);

  return (
    (Number.isNaN(serviceCharge) ? 0 : serviceCharge) +
    (Number.isNaN(roomCharge) ? 0 : roomCharge)
  );
}

function buildBillingSummary(bills: Bill[]): BillingReportSummary {
  return bills.reduce<BillingReportSummary>((summary, bill) => {
    const billTotal = getBillTotal(bill);
    const paid = isPaidStatus(bill.status);

    summary.totalBills += 1;
    summary.totalBilledAmount += billTotal;

    if (paid) {
      summary.paidBills += 1;
      summary.totalPaidAmount += billTotal;
    } else {
      summary.unpaidBills += 1;
      summary.totalOutstandingAmount += billTotal;
    }

    return summary;
  }, { ...emptyBillingSummary });
}

export default function AdminDashboardPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [billingReport, setBillingReport] = useState<BillingReport>({
    summary: emptyBillingSummary,
    data: [],
  });
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetric[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      setError("");

      const [
        patientsResponse,
        appointmentsResponse,
        roomsResponse,
        billsResponse,
        billingReportResponse,
      ] = await Promise.all([
        axios.get(`${API_ENDPOINT}/admin/patients`, getAuthHeaders()),
        axios.get(`${API_ENDPOINT}/admin/appointments`, getAuthHeaders()),
        axios.get(`${API_ENDPOINT}/admin/rooms`, getAuthHeaders()),
        axios.get(`${API_ENDPOINT}/admin/bills`, getAuthHeaders()),
        axios.get(`${API_ENDPOINT}/admin/billing-report`, getAuthHeaders()),
      ]);

      const patientsData = extractData<Patient[]>(patientsResponse);
      const appointmentsData =
        extractData<Appointment[]>(appointmentsResponse);
      const roomsData = extractData<Room[]>(roomsResponse);
      const billsData = extractData<Bill[]>(billsResponse);
      const billingReportData = extractBillingReport(billingReportResponse);

      const normalizedPatients = Array.isArray(patientsData) ? patientsData : [];
      const normalizedAppointments = Array.isArray(appointmentsData)
        ? appointmentsData
        : [];
      const normalizedRooms = Array.isArray(roomsData) ? roomsData : [];
      const normalizedBills = Array.isArray(billsData) ? billsData : [];
      const reportBills = Array.isArray(billingReportData.data)
        ? billingReportData.data
        : normalizedBills;
      const reportSummary = buildBillingSummary(reportBills);

      setPatients(normalizedPatients);
      setAppointments(normalizedAppointments);
      setRooms(normalizedRooms);
      setBills(normalizedBills);
      setBillingReport({
        ...billingReportData,
        summary: reportSummary,
        data: reportBills,
      });

      const availableRoomCount = normalizedRooms.filter(
        (room) => Number(room.availableBeds) > 0
      ).length;

      setDashboardMetrics([
        {
          title: "Patients",
          value: String(normalizedPatients.length),
          helper: "Total registered patients",
        },
        {
          title: "Appointments",
          value: String(normalizedAppointments.length),
          helper: "Total appointments",
        },
        {
          title: "Available Rooms",
          value: String(availableRoomCount),
          helper: "Rooms with available beds",
        },
        {
          title: "Total Bills",
          value: String(reportSummary.totalBills),
          helper: "Bills generated",
        },
        {
          title: "Paid Revenue",
          value: formatCurrency(reportSummary.totalPaidAmount),
          helper: `${reportSummary.paidBills} paid bills`,
        },
        {
          title: "Outstanding",
          value: formatCurrency(reportSummary.totalOutstandingAmount),
          helper: `${reportSummary.unpaidBills} unpaid bills`,
        },
      ]);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  const reportSummary = billingReport.summary ?? emptyBillingSummary;
  const reportBills = billingReport.data ?? bills;
  const latestReportBills = [...reportBills]
    .sort((a, b) => {
      const aTime = new Date(a.billingDate || a.createdAt || "").getTime();
      const bTime = new Date(b.billingDate || b.createdAt || "").getTime();

      return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
    })
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        description="Overview of patients, appointments, billing report, and room availability."
      />

      {error ? (
        <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-5 text-sm font-medium text-slate-600">
          Loading dashboard data...
        </div>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
            {dashboardMetrics.map((metric) => (
              <MetricCard
                key={metric.title}
                title={metric.title}
                value={metric.value}
                helper={metric.helper}
              />
            ))}
          </section>

          <section className="mt-6">
            <InfoPanel title="Billing Report">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Total Billed
                  </p>
                  <p className="mt-1 text-xl font-bold text-slate-950">
                    {formatCurrency(reportSummary.totalBilledAmount)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {reportSummary.totalBills} total bills
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Paid Amount
                  </p>
                  <p className="mt-1 text-xl font-bold text-slate-950">
                    {formatCurrency(reportSummary.totalPaidAmount)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {reportSummary.paidBills} paid bills
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Outstanding Amount
                  </p>
                  <p className="mt-1 text-xl font-bold text-slate-950">
                    {formatCurrency(reportSummary.totalOutstandingAmount)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {reportSummary.unpaidBills} unpaid bills
                  </p>
                </div>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="py-3 pr-4">Invoice</th>
                      <th className="py-3 pr-4">Patient</th>
                      <th className="py-3 pr-4">Service</th>
                      <th className="py-3 pr-4">Room</th>
                      <th className="py-3 pr-4">Total</th>
                      <th className="py-3 pr-4">Billing Date</th>
                      <th className="py-3 pr-4">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {latestReportBills.map((bill) => (
                      <tr key={bill.id}>
                        <td className="py-4 pr-4 font-semibold text-slate-900">
                          Invoice #{bill.id}
                        </td>

                        <td className="py-4 pr-4 text-slate-600">
                          {bill.patient?.name || bill.patientName || "N/A"}
                        </td>

                        <td className="py-4 pr-4 text-slate-600">
                          {formatCurrency(bill.serviceCharge)}
                        </td>

                        <td className="py-4 pr-4 text-slate-600">
                          {formatCurrency(bill.roomCharge)}
                        </td>

                        <td className="py-4 pr-4 font-semibold text-slate-900">
                          {formatCurrency(getBillTotal(bill))}
                        </td>

                        <td className="py-4 pr-4 text-slate-600">
                          {formatDate(bill.billingDate)}
                        </td>

                        <td className="py-4 pr-4">
                          <StatusBadge status={bill.status || "Unpaid"} />
                        </td>
                      </tr>
                    ))}

                    {latestReportBills.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-6 text-center text-slate-500"
                        >
                          No billing report data found.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </InfoPanel>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-2">
            <InfoPanel title="Recent Appointments">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="py-3 pr-4">Patient</th>
                      <th className="py-3 pr-4">Doctor</th>
                      <th className="py-3 pr-4">Date</th>
                      <th className="py-3 pr-4">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {appointments.slice(0, 5).map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="py-4 pr-4 font-semibold text-slate-900">
                          {appointment.patient?.name || "N/A"}
                        </td>

                        <td className="py-4 pr-4 text-slate-600">
                          {appointment.doctorName}
                        </td>

                        <td className="py-4 pr-4 text-slate-600">
                          {formatDateTime(appointment.appointmentDate)}
                        </td>

                        <td className="py-4 pr-4">
                          <StatusBadge status={appointment.status} />
                        </td>
                      </tr>
                    ))}

                    {appointments.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-6 text-center text-slate-500"
                        >
                          No appointments found.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </InfoPanel>

            <InfoPanel title="Room Availability">
              <div className="space-y-3">
                {rooms.slice(0, 5).map((room) => (
                  <div
                    key={room.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        Room #{room.id}
                      </p>

                      <p className="text-sm text-slate-500">
                        {room.roomType} · {room.availableBeds}/{room.totalBeds}{" "}
                        beds available
                      </p>
                    </div>

                    <StatusBadge
                      status={room.availableBeds > 0 ? "Available" : "Occupied"}
                    />
                  </div>
                ))}

                {rooms.length === 0 ? (
                  <p className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                    No rooms found.
                  </p>
                ) : null}
              </div>
            </InfoPanel>

            <InfoPanel title="Latest Bills">
              <div className="space-y-3">
                {bills.slice(0, 5).map((bill) => (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        Invoice #{bill.id}
                      </p>

                      <p className="text-sm text-slate-500">
                        {bill.patient?.name || bill.patientName} · {formatDate(bill.billingDate)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        {formatCurrency(getBillTotal(bill))}
                      </p>

                      <StatusBadge status={bill.status} />
                    </div>
                  </div>
                ))}

                {bills.length === 0 ? (
                  <p className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                    No bills found.
                  </p>
                ) : null}
              </div>
            </InfoPanel>

            <InfoPanel title="Recent Patients">
              <div className="space-y-3">
                {patients.slice(0, 5).map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {patient.name}
                      </p>

                      <p className="text-sm text-slate-500">
                        {patient.email} · {formatDate(patient.dateOfBirth)}
                      </p>
                    </div>

                    <StatusBadge status="Active" />
                  </div>
                ))}

                {patients.length === 0 ? (
                  <p className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                    No patients found.
                  </p>
                ) : null}
              </div>
            </InfoPanel>
          </section>
        </>
      )}
    </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { InfoPanel } from "@/components/admin/InfoPanel";
// import { MetricCard } from "@/components/admin/MetricCard";
// import { PageHeader } from "@/components/admin/PageHeader";
// import { StatusBadge } from "@/components/admin/StatusBadge";

// type Patient = {
//   id: number;
//   uniqueId?: string;
//   name: string;
//   email: string;
//   dateOfBirth?: string;
//   createdAt?: string;
// };

// type Appointment = {
//   id: number;
//   uniqueId?: string;
//   patient?: Patient | null;
//   doctorName: string;
//   appointmentDate: string;
//   status: string;
//   paymentStatus?: string;
//   createdAt?: string;
// };

// type Room = {
//   id: number;
//   uniqueId?: string;
//   roomType: string;
//   totalBeds: number;
//   availableBeds: number;
//   createdAt?: string;
// };

// type Bill = {
//   id: number;
//   patientName: string;
//   serviceCharge: number;
//   billingDate: string;
//   status: string;
//   paymentDate?: string | null;
//   createdAt?: string;
// };

// type DashboardMetric = {
//   title: string;
//   value: string;
//   helper: string;
// };

// const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

// function getAuthHeaders() {
//   const token = localStorage.getItem("hms_admin_token");

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

// function formatDateTime(dateValue?: string) {
//   if (!dateValue) {
//     return "N/A";
//   }

//   const date = new Date(dateValue);

//   if (Number.isNaN(date.getTime())) {
//     return dateValue;
//   }

//   return date.toLocaleString();
// }

// export default function AdminDashboardPage() {
//   const [patients, setPatients] = useState<Patient[]>([]);
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [rooms, setRooms] = useState<Room[]>([]);
//   const [bills, setBills] = useState<Bill[]>([]);
//   const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetric[]>(
//     []
//   );
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>("");

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   async function fetchDashboardData() {
//     try {
//       setLoading(true);
//       setError("");

//       const [patientsResponse, appointmentsResponse, roomsResponse, billsResponse] =
//         await Promise.all([
//           axios.get(`${API_ENDPOINT}/admin/patients`, getAuthHeaders()),
//           axios.get(`${API_ENDPOINT}/admin/appointments`, getAuthHeaders()),
//           axios.get(`${API_ENDPOINT}/admin/rooms`, getAuthHeaders()),
//           axios.get(`${API_ENDPOINT}/admin/bills`, getAuthHeaders()),
//         ]);

//       const patientsData = extractData<Patient[]>(patientsResponse);
//       const appointmentsData =
//         extractData<Appointment[]>(appointmentsResponse);
//       const roomsData = extractData<Room[]>(roomsResponse);
//       const billsData = extractData<Bill[]>(billsResponse);

//       setPatients(Array.isArray(patientsData) ? patientsData : []);
//       setAppointments(
//         Array.isArray(appointmentsData) ? appointmentsData : []
//       );
//       setRooms(Array.isArray(roomsData) ? roomsData : []);
//       setBills(Array.isArray(billsData) ? billsData : []);

//       const availableRoomCount = Array.isArray(roomsData)
//         ? roomsData.filter((room) => room.availableBeds > 0).length
//         : 0;

//       const unpaidBillCount = Array.isArray(billsData)
//         ? billsData.filter((bill) => bill.status === "Unpaid").length
//         : 0;

//       setDashboardMetrics([
//         {
//           title: "Patients",
//           value: String(Array.isArray(patientsData) ? patientsData.length : 0),
//           helper: "Total registered patients",
//         },
//         {
//           title: "Appointments",
//           value: String(
//             Array.isArray(appointmentsData) ? appointmentsData.length : 0
//           ),
//           helper: "Total appointments",
//         },
//         {
//           title: "Available Rooms",
//           value: String(availableRoomCount),
//           helper: "Rooms with available beds",
//         },
//         {
//           title: "Unpaid Bills",
//           value: String(unpaidBillCount),
//           helper: "Bills waiting for payment",
//         },
//       ]);
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         const backendMessage = error.response?.data?.message;

//         if (Array.isArray(backendMessage)) {
//           setError(backendMessage.join(", "));
//         } else if (typeof backendMessage === "string") {
//           setError(backendMessage);
//         } else {
//           setError("Failed to load dashboard data.");
//         }
//       } else {
//         setError("Something went wrong while loading dashboard data.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div>
//       <PageHeader
//         title="Admin Dashboard"
//         description="Overview of patients, appointments, billing, and room availability."
//       />

//       {error ? (
//         <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
//           {error}
//         </div>
//       ) : null}

//       {loading ? (
//         <div className="rounded-xl border border-slate-200 bg-white px-4 py-5 text-sm font-medium text-slate-600">
//           Loading dashboard data...
//         </div>
//       ) : (
//         <>
//           <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//             {dashboardMetrics.map((metric) => (
//               <MetricCard
//                 key={metric.title}
//                 title={metric.title}
//                 value={metric.value}
//                 helper={metric.helper}
//               />
//             ))}
//           </section>

//           <section className="mt-6 grid gap-6 xl:grid-cols-2">
//             <InfoPanel title="Recent Appointments">
//               <div className="overflow-x-auto">
//                 <table className="w-full min-w-[680px] text-left text-sm">
//                   <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
//                     <tr>
//                       <th className="py-3 pr-4">Patient</th>
//                       <th className="py-3 pr-4">Doctor</th>
//                       <th className="py-3 pr-4">Date</th>
//                       <th className="py-3 pr-4">Status</th>
//                     </tr>
//                   </thead>

//                   <tbody className="divide-y divide-slate-100">
//                     {appointments.slice(0, 5).map((appointment) => (
//                       <tr key={appointment.id}>
//                         <td className="py-4 pr-4 font-semibold text-slate-900">
//                           {appointment.patient?.name || "N/A"}
//                         </td>

//                         <td className="py-4 pr-4 text-slate-600">
//                           {appointment.doctorName}
//                         </td>

//                         <td className="py-4 pr-4 text-slate-600">
//                           {formatDateTime(appointment.appointmentDate)}
//                         </td>

//                         <td className="py-4 pr-4">
//                           <StatusBadge status={appointment.status} />
//                         </td>
//                       </tr>
//                     ))}

//                     {appointments.length === 0 ? (
//                       <tr>
//                         <td
//                           colSpan={4}
//                           className="py-6 text-center text-slate-500"
//                         >
//                           No appointments found.
//                         </td>
//                       </tr>
//                     ) : null}
//                   </tbody>
//                 </table>
//               </div>
//             </InfoPanel>

//             <InfoPanel title="Room Availability">
//               <div className="space-y-3">
//                 {rooms.slice(0, 5).map((room) => (
//                   <div
//                     key={room.id}
//                     className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
//                   >
//                     <div>
//                       <p className="font-semibold text-slate-900">
//                         Room #{room.id}
//                       </p>

//                       <p className="text-sm text-slate-500">
//                         {room.roomType} · {room.availableBeds}/{room.totalBeds}{" "}
//                         beds available
//                       </p>
//                     </div>

//                     <StatusBadge
//                       status={room.availableBeds > 0 ? "Available" : "Occupied"}
//                     />
//                   </div>
//                 ))}

//                 {rooms.length === 0 ? (
//                   <p className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-500">
//                     No rooms found.
//                   </p>
//                 ) : null}
//               </div>
//             </InfoPanel>

//             <InfoPanel title="Latest Bills">
//               <div className="space-y-3">
//                 {bills.slice(0, 5).map((bill) => (
//                   <div
//                     key={bill.id}
//                     className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
//                   >
//                     <div>
//                       <p className="font-semibold text-slate-900">
//                         Invoice #{bill.id}
//                       </p>

//                       <p className="text-sm text-slate-500">
//                         {bill.patientName} · {formatDate(bill.billingDate)}
//                       </p>
//                     </div>

//                     <div className="text-right">
//                       <p className="font-semibold text-slate-900">
//                         ৳ {bill.serviceCharge}
//                       </p>

//                       <StatusBadge status={bill.status} />
//                     </div>
//                   </div>
//                 ))}

//                 {bills.length === 0 ? (
//                   <p className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-500">
//                     No bills found.
//                   </p>
//                 ) : null}
//               </div>
//             </InfoPanel>

//             <InfoPanel title="Recent Patients">
//               <div className="space-y-3">
//                 {patients.slice(0, 5).map((patient) => (
//                   <div
//                     key={patient.id}
//                     className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
//                   >
//                     <div>
//                       <p className="font-semibold text-slate-900">
//                         {patient.name}
//                       </p>

//                       <p className="text-sm text-slate-500">
//                         {patient.email} · {formatDate(patient.dateOfBirth)}
//                       </p>
//                     </div>

//                     <StatusBadge status="Active" />
//                   </div>
//                 ))}

//                 {patients.length === 0 ? (
//                   <p className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-500">
//                     No patients found.
//                   </p>
//                 ) : null}
//               </div>
//             </InfoPanel>
//           </section>
//         </>
//       )}
//     </div>
//   );
// }