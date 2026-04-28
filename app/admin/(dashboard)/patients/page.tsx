import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { patients } from "@/lib/admin-data";

export default function PatientsPage() {
  return (
    <div>
      <PageHeader
        title="Patients"
        description="Manage patient profile information according to the backend patient module."
        action={
          <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Add Patient
          </button>
        }
      />

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-950">Patient Form</h2>

        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Patient Name" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Email" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Phone" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Age" type="number" />
          <select className="rounded-xl border border-slate-200 px-4 py-3 text-sm">
            <option>Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Blood Group" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Emergency Contact" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm xl:col-span-2" placeholder="Address" />
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-950">Patient List</h2>
          <p className="text-sm text-slate-500">Mock data only. Backend connection will be added later.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
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
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-semibold text-slate-900">{patient.name}</td>
                  <td className="px-5 py-4 text-slate-700">{patient.email}</td>
                  <td className="px-5 py-4 text-slate-700">{patient.phone}</td>
                  <td className="px-5 py-4 text-slate-700">{patient.age}</td>
                  <td className="px-5 py-4 text-slate-700">{patient.gender}</td>
                  <td className="px-5 py-4 text-slate-700">{patient.bloodGroup}</td>
                  <td className="px-5 py-4 text-slate-700">{patient.address}</td>
                  <td className="px-5 py-4 text-slate-700">{patient.emergencyContact}</td>
                  <td className="px-5 py-4 text-slate-700">{patient.createdAt}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={patient.status} />
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