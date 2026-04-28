import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { appointments } from "@/lib/admin-data";

export default function AppointmentsPage() {
  return (
    <div>
      <PageHeader
        title="Appointments"
        description="Manage appointment date, time, patient, doctor, problem, and status."
        action={
          <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Add Appointment
          </button>
        }
      />

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-950">Appointment Form</h2>

        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Patient Name" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Patient Phone" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Doctor Name" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Department Name" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" type="date" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" type="time" />
          <textarea
            className="min-h-24 rounded-xl border border-slate-200 px-4 py-3 text-sm md:col-span-2 xl:col-span-3"
            placeholder="Patient Problem"
          />
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-950">Appointment List</h2>
          <p className="text-sm text-slate-500">Frontend data is prepared for backend appointment API later.</p>
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
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-semibold text-slate-900">{appointment.patientName}</td>
                  <td className="px-5 py-4 text-slate-700">{appointment.patientPhone}</td>
                  <td className="px-5 py-4 text-slate-700">{appointment.doctorName}</td>
                  <td className="px-5 py-4 text-slate-700">{appointment.departmentName}</td>
                  <td className="px-5 py-4 text-slate-700">{appointment.appointmentDate}</td>
                  <td className="px-5 py-4 text-slate-700">{appointment.appointmentTime}</td>
                  <td className="px-5 py-4 text-slate-700">{appointment.problem}</td>
                  <td className="px-5 py-4 text-slate-700">{appointment.createdAt}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={appointment.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}