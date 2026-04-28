import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { departments } from "@/lib/admin-data";

export default function DepartmentsPage() {
  return (
    <div>
      <PageHeader
        title="Departments"
        description="Temporary frontend module. Backend department entity/API can be added later."
        action={
          <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Add Department
          </button>
        }
      />

      <section className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h2 className="text-lg font-semibold text-amber-900">Backend Note</h2>
        <p className="mt-1 text-sm text-amber-800">
          Department is included in the frontend because your admin dashboard needs it, but this
          module should get its own backend entity, DTO, controller, and service later.
        </p>
      </section>

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-950">Department Form</h2>

        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Department Name" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Head Doctor" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Contact Number" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Location" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Total Doctors" type="number" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Total Rooms" type="number" />
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-950">Department List</h2>
          <p className="text-sm text-slate-500">Static placeholder data only.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Head Doctor</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3">Doctors</th>
                <th className="px-5 py-3">Rooms</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {departments.map((department) => (
                <tr key={department.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-semibold text-slate-900">
                    {department.departmentName}
                  </td>
                  <td className="px-5 py-4 text-slate-700">{department.headDoctor}</td>
                  <td className="px-5 py-4 text-slate-700">{department.contactNumber}</td>
                  <td className="px-5 py-4 text-slate-700">{department.location}</td>
                  <td className="px-5 py-4 text-slate-700">{department.totalDoctors}</td>
                  <td className="px-5 py-4 text-slate-700">{department.totalRooms}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={department.status} />
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