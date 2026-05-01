// import { PageHeader } from "@/components/admin/PageHeader";
// import { StatusBadge } from "@/components/admin/StatusBadge";
// import { rooms } from "@/lib/admin-data";

// export default function RoomsPage() {
//   return (
//     <div>
//       <PageHeader
//         title="Rooms & Beds"
//         description="Manage room number, room type, floor, bed number, daily charge, and occupancy."
//         action={
//           <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
//             Add Room
//           </button>
//         }
//       />

//       <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//         <h2 className="mb-4 text-lg font-semibold text-slate-950">Room Form</h2>

//         <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Room Number" />
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Room Type" />
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Floor Number" />
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Bed Number" />
//           <input className="rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Daily Charge" type="number" />
//           <select className="rounded-xl border border-slate-200 px-4 py-3 text-sm">
//             <option>Available</option>
//             <option>Occupied</option>
//             <option>Maintenance</option>
//           </select>
//         </form>
//       </section>

//       <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
//         <div className="border-b border-slate-200 p-5">
//           <h2 className="text-lg font-semibold text-slate-950">Room List</h2>
//           <p className="text-sm text-slate-500">Mock room data prepared for backend room service later.</p>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[900px] text-left text-sm">
//             <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
//               <tr>
//                 <th className="px-5 py-3">Room Number</th>
//                 <th className="px-5 py-3">Room Type</th>
//                 <th className="px-5 py-3">Floor</th>
//                 <th className="px-5 py-3">Bed</th>
//                 <th className="px-5 py-3">Assigned Patient</th>
//                 <th className="px-5 py-3">Daily Charge</th>
//                 <th className="px-5 py-3">Status</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-slate-100">
//               {rooms.map((room) => (
//                 <tr key={room.id} className="hover:bg-slate-50">
//                   <td className="px-5 py-4 font-semibold text-slate-900">{room.roomNumber}</td>
//                   <td className="px-5 py-4 text-slate-700">{room.roomType}</td>
//                   <td className="px-5 py-4 text-slate-700">{room.floorNumber}</td>
//                   <td className="px-5 py-4 text-slate-700">{room.bedNumber}</td>
//                   <td className="px-5 py-4 text-slate-700">{room.assignedPatient}</td>
//                   <td className="px-5 py-4 text-slate-700">৳ {room.dailyCharge}</td>
//                   <td className="px-5 py-4">
//                     <StatusBadge status={room.status} />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </section>
//     </div>
//   );
// }


"use client";

import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";

type Room = {
  id: number;
  uniqueId?: string;
  roomType: string;
  totalBeds: number;
  availableBeds: number;
  createdAt?: string;
};

const initialForm = {
  roomType: "",
  totalBeds: "",
};

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

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

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadRooms();
  }, []);

  async function loadRooms() {
    try {
      setPageLoading(true);
      setError("");

      const response = await axios.get(
        `${API_ENDPOINT}/admin/rooms`,
        getAuthHeaders()
      );

      const roomsData = extractData<Room[]>(response);
      setRooms(Array.isArray(roomsData) ? roomsData : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPageLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.roomType || !form.totalBeds) {
      setError("Room type and total beds are required.");
      return;
    }

    const roomPayload = {
      roomType: form.roomType,
      totalBeds: Number(form.totalBeds),
    };

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await axios.post(
        `${API_ENDPOINT}/admin/rooms`,
        roomPayload,
        getAuthHeaders()
      );

      setForm(initialForm);
      setMessage("Room created successfully.");
      await loadRooms();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleAssignBed(id: number) {
    try {
      setError("");
      setMessage("");

      await axios.patch(
        `${API_ENDPOINT}/admin/rooms/${id}/assign-bed`,
        {},
        getAuthHeaders()
      );

      setMessage("Bed assigned successfully.");
      await loadRooms();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleReleaseBed(id: number) {
    try {
      setError("");
      setMessage("");

      await axios.patch(
        `${API_ENDPOINT}/admin/rooms/${id}/release-bed`,
        {},
        getAuthHeaders()
      );

      setMessage("Bed released successfully.");
      await loadRooms();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleDelete(id: number) {
    try {
      setError("");
      setMessage("");

      await axios.delete(
        `${API_ENDPOINT}/admin/rooms/${id}`,
        getAuthHeaders()
      );

      setMessage("Room deleted successfully.");
      await loadRooms();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div>
      <PageHeader
        title="Rooms & Beds"
        description="Manage room type, total beds, and occupancy."
        action={
          <button
            form="room-form"
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Adding..." : "Add Room"}
          </button>
        }
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
        <h2 className="mb-4 text-lg font-semibold text-slate-950">
          Room Form
        </h2>

        <form
          id="room-form"
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500"
            placeholder="Room Number auto generated by backend"
            disabled
          />

          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
            placeholder="Room Type"
            value={form.roomType}
            onChange={(e) => setForm({ ...form, roomType: e.target.value })}
            required
          />

          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500"
            placeholder="Floor Number not available in backend"
            disabled
          />

          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
            placeholder="Total Beds"
            type="number"
            min={1}
            value={form.totalBeds}
            onChange={(e) => setForm({ ...form, totalBeds: e.target.value })}
            required
          />

          <input
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500"
            placeholder="Daily Charge not available in backend"
            type="number"
            disabled
          />

          <select
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500"
            disabled
          >
            <option>Status handled by available beds</option>
          </select>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-950">Room List</h2>
          <p className="text-sm text-slate-500">
            Data is loaded from backend room API.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Room Number</th>
                <th className="px-5 py-3">Room Type</th>
                <th className="px-5 py-3">Floor</th>
                <th className="px-5 py-3">Bed</th>
                <th className="px-5 py-3">Assigned Patient</th>
                <th className="px-5 py-3">Daily Charge</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {pageLoading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-8 text-center text-slate-500"
                  >
                    Loading rooms...
                  </td>
                </tr>
              ) : null}

              {!pageLoading &&
                rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      Room #{room.id}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {room.roomType}
                    </td>

                    <td className="px-5 py-4 text-slate-700">N/A</td>

                    <td className="px-5 py-4 text-slate-700">
                      {room.availableBeds}/{room.totalBeds} beds available
                    </td>

                    <td className="px-5 py-4 text-slate-700">N/A</td>

                    <td className="px-5 py-4 text-slate-700">N/A</td>

                    <td className="px-5 py-4">
                      <StatusBadge
                        status={room.availableBeds > 0 ? "Available" : "Occupied"}
                      />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleAssignBed(room.id)}
                          className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                        >
                          Assign Bed
                        </button>

                        <button
                          type="button"
                          onClick={() => handleReleaseBed(room.id)}
                          className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-100"
                        >
                          Release Bed
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(room.id)}
                          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!pageLoading && rooms.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-8 text-center text-slate-500"
                  >
                    No rooms found.
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