import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { admins } from "@/lib/admin-data";

export default function AdminsPage() {
  return (
    <div>
      <PageHeader
        title="Admins"
        description="Manage admin users according to the backend admin authentication module."
        action={
          <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Add Admin
          </button>
        }
      />

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-950">Admin Form</h2>

        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Admin Name" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Email" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Phone" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Password" type="password" />
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-950">Admin List</h2>
          <p className="text-sm text-slate-500">Admin data is static until backend API connection is added.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Created</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-semibold text-slate-900">{admin.name}</td>
                  <td className="px-5 py-4 text-slate-700">{admin.email}</td>
                  <td className="px-5 py-4 text-slate-700">{admin.phone}</td>
                  <td className="px-5 py-4 text-slate-700">{admin.role}</td>
                  <td className="px-5 py-4 text-slate-700">{admin.createdAt}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={admin.status} />
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