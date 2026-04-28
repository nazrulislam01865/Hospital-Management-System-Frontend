import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { rooms } from "@/lib/admin-data";

export default function RoomsPage() {
  return (
    <div>
      <PageHeader
        title="Rooms & Beds"
        description="Manage room number, room type, floor, bed number, daily charge, and occupancy."
        action={
          <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Add Room
          </button>
        }
      />

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-950">Room Form</h2>

        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Room Number" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Room Type" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Floor Number" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Bed Number" />
          <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Daily Charge" type="number" />
          <select className="rounded-xl border border-slate-200 px-4 py-3 text-sm">
            <option>Available</option>
            <option>Occupied</option>
            <option>Maintenance</option>
          </select>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-950">Room List</h2>
          <p className="text-sm text-slate-500">Mock room data prepared for backend room service later.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Room Number</th>
                <th className="px-5 py-3">Room Type</th>
                <th className="px-5 py-3">Floor</th>
                <th className="px-5 py-3">Bed</th>
                <th className="px-5 py-3">Assigned Patient</th>
                <th className="px-5 py-3">Daily Charge</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-semibold text-slate-900">{room.roomNumber}</td>
                  <td className="px-5 py-4 text-slate-700">{room.roomType}</td>
                  <td className="px-5 py-4 text-slate-700">{room.floorNumber}</td>
                  <td className="px-5 py-4 text-slate-700">{room.bedNumber}</td>
                  <td className="px-5 py-4 text-slate-700">{room.assignedPatient}</td>
                  <td className="px-5 py-4 text-slate-700">৳ {room.dailyCharge}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={room.status} />
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