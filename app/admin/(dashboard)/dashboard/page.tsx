import { InfoPanel } from "@/components/admin/InfoPanel";
import { MetricCard } from "@/components/admin/MetricCard";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  appointments,
  bills,
  dashboardMetrics,
  patients,
  rooms,
} from "@/lib/admin-data";

export default function AdminDashboardPage() {
  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        description="Overview of patients, appointments, billing, and room availability."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            helper={metric.helper}
          />
        ))}
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
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="py-4 pr-4 font-semibold text-slate-900">
                      {appointment.patientName}
                    </td>
                    <td className="py-4 pr-4 text-slate-600">{appointment.doctorName}</td>
                    <td className="py-4 pr-4 text-slate-600">
                      {appointment.appointmentDate}
                    </td>
                    <td className="py-4 pr-4">
                      <StatusBadge status={appointment.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </InfoPanel>

        <InfoPanel title="Room Availability">
          <div className="space-y-3">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-slate-900">{room.roomNumber}</p>
                  <p className="text-sm text-slate-500">
                    {room.roomType} · {room.floorNumber} · {room.bedNumber}
                  </p>
                </div>
                <StatusBadge status={room.status} />
              </div>
            ))}
          </div>
        </InfoPanel>

        <InfoPanel title="Latest Bills">
          <div className="space-y-3">
            {bills.map((bill) => (
              <div
                key={bill.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-slate-900">{bill.invoiceNumber}</p>
                  <p className="text-sm text-slate-500">{bill.patientName}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">৳ {bill.totalAmount}</p>
                  <StatusBadge status={bill.status} />
                </div>
              </div>
            ))}
          </div>
        </InfoPanel>

        <InfoPanel title="Recent Patients">
          <div className="space-y-3">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-slate-900">{patient.name}</p>
                  <p className="text-sm text-slate-500">
                    {patient.phone} · {patient.bloodGroup}
                  </p>
                </div>
                <StatusBadge status={patient.status} />
              </div>
            ))}
          </div>
        </InfoPanel>
      </section>
    </div>
  );
}