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

type Patient = {
  id: number;
  uniqueId?: string;
  name?: string;
  email?: string;
};

type Admin = {
  id: number;
  uniqueId?: string;
  name?: string;
  email?: string;
};

type RoomAssignment = {
  id: number;
  uniqueId?: string;
  patient?: Patient | null;
  assignedBy?: Admin | null;
  status?: string;
  assignedAt?: string;
  releasedAt?: string | null;
};

type Room = {
  id: number;
  uniqueId?: string;
  roomType: string;
  totalBeds: number;
  availableBeds: number;
  assignments?: RoomAssignment[];
  createdAt?: string;
};

const initialForm = {
  roomType: "",
  totalBeds: "",
};

type RoomForm = typeof initialForm;
type RoomFormField = keyof RoomForm;
type FormErrors = Partial<Record<RoomFormField, string>>;

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

function getBackendMessages(error: unknown) {
  if (axios.isAxiosError(error)) {
    const backendMessage = error.response?.data?.message;

    if (Array.isArray(backendMessage)) {
      return backendMessage.map(String);
    }

    if (typeof backendMessage === "string") {
      return [backendMessage];
    }

    return [error.message];
  }

  return ["Something went wrong."];
}

function getErrorMessage(error: unknown) {
  return getBackendMessages(error).join(", ");
}

function validateForm(values: RoomForm) {
  const errors: FormErrors = {};
  const totalBeds = Number(values.totalBeds);

  if (!values.roomType.trim()) {
    errors.roomType = "Room type is required.";
  }

  if (!values.totalBeds) {
    errors.totalBeds = "Total beds is required.";
  } else if (!Number.isInteger(totalBeds) || totalBeds < 1) {
    errors.totalBeds = "Total beds must be an integer number greater than 0.";
  }

  return errors;
}

function mapBackendMessagesToFields(messages: string[]) {
  const errors: FormErrors = {};

  messages.forEach((message) => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("room")) {
      errors.roomType = message;
      return;
    }

    if (lowerMessage.includes("bed")) {
      errors.totalBeds = message;
    }
  });

  return errors;
}

function formatDateTime(dateValue?: string) {
  if (!dateValue) {
    return "N/A";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleString();
}

function getActiveAssignments(room: Room) {
  return (room.assignments || []).filter(
    (assignment) => assignment.status?.toLowerCase() === "assigned"
  );
}

function getUniqueAssignedBy(assignments: RoomAssignment[]) {
  const admins = new Map<number, Admin>();

  assignments.forEach((assignment) => {
    const assignedBy = assignment.assignedBy;

    if (assignedBy?.id) {
      admins.set(assignedBy.id, assignedBy);
    }
  });

  return Array.from(admins.values());
}

function formatPatientSummary(patient?: Patient | null) {
  if (!patient) {
    return "N/A";
  }

  return [
    `ID: ${patient.id}`,
    patient.uniqueId ? `Unique ID: ${patient.uniqueId}` : null,
    patient.name ? `Name: ${patient.name}` : null,
  ]
    .filter(Boolean)
    .join(" | ");
}

function formatAdminSummary(admin?: Admin | null) {
  if (!admin) {
    return "N/A";
  }

  return [
    `ID: ${admin.id}`,
    admin.uniqueId ? `Unique ID: ${admin.uniqueId}` : null,
    admin.name ? `Name: ${admin.name}` : null,
  ]
    .filter(Boolean)
    .join(" | ");
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [form, setForm] = useState<RoomForm>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<number | null>(null);
  const [assignPatientIds, setAssignPatientIds] = useState<Record<number, string>>(
    {}
  );

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

  function handleFieldChange(field: RoomFormField, value: string) {
    const nextForm = { ...form, [field]: value };
    setForm(nextForm);
    setMessage("");

    if (formSubmitted || fieldErrors[field]) {
      const nextErrors = validateForm(nextForm);
      setFieldErrors((previousErrors) => ({
        ...previousErrors,
        [field]: nextErrors[field],
      }));
    }
  }

  function handleFieldBlur(field: RoomFormField) {
    const nextErrors = validateForm(form);
    setFieldErrors((previousErrors) => ({
      ...previousErrors,
      [field]: nextErrors[field],
    }));
  }

  function getInputClass(field: RoomFormField) {
    const hasError = Boolean(fieldErrors[field]);

    return [
      "w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2",
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
        : "border-slate-200 focus:border-blue-500 focus:ring-blue-100",
    ].join(" ");
  }

  function renderFieldError(field: RoomFormField) {
    if (!fieldErrors[field]) {
      return null;
    }

    return (
      <p id={`${field}-error`} className="mt-1 text-xs font-medium text-red-600">
        {fieldErrors[field]}
      </p>
    );
  }

  function resetForm() {
    setForm(initialForm);
    setFieldErrors({});
    setFormSubmitted(false);
    setEditingRoomId(null);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormSubmitted(true);

    const nextErrors = validateForm(form);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setError("Please fix the highlighted fields.");
      return;
    }

    const roomPayload = {
      roomType: form.roomType.trim(),
      totalBeds: Number(form.totalBeds),
    };

    try {
      setLoading(true);
      setError("");
      setMessage("");
      setFieldErrors({});

      if (editingRoomId) {
        await axios.put(
          `${API_ENDPOINT}/admin/rooms/${editingRoomId}`,
          roomPayload,
          getAuthHeaders()
        );
        setMessage("Room updated successfully.");
      } else {
        await axios.post(
          `${API_ENDPOINT}/admin/rooms`,
          roomPayload,
          getAuthHeaders()
        );
        setMessage("Room created successfully.");
      }

      resetForm();
      await loadRooms();
    } catch (err) {
      const backendMessages = getBackendMessages(err);
      const backendFieldErrors = mapBackendMessagesToFields(backendMessages);

      setFieldErrors((previousErrors) => ({
        ...previousErrors,
        ...backendFieldErrors,
      }));
      setError(backendMessages.join(", "));
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(room: Room) {
    setEditingRoomId(room.id);
    setForm({
      roomType: room.roomType || "",
      totalBeds: String(room.totalBeds || ""),
    });
    setFieldErrors({});
    setFormSubmitted(false);
    setError("");
    setMessage("");

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleAssignBed(room: Room) {
    const patientId = assignPatientIds[room.id];

    if (!patientId) {
      setError("Patient ID is required before assigning a room.");
      return;
    }

    if (room.availableBeds <= 0) {
      setError("No beds are available in this room.");
      return;
    }

    try {
      setError("");
      setMessage("");

      await axios.patch(
        `${API_ENDPOINT}/admin/rooms/${room.id}/assign-bed`,
        { patientId: Number(patientId) },
        getAuthHeaders()
      );

      setAssignPatientIds((previous) => ({ ...previous, [room.id]: "" }));
      setMessage("Room assigned successfully.");
      await loadRooms();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleReleaseBed(roomId: number, patientId?: number) {
    try {
      setError("");
      setMessage("");

      await axios.patch(
        `${API_ENDPOINT}/admin/rooms/${roomId}/release-bed`,
        patientId ? { patientId } : {},
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

      if (editingRoomId === id) {
        resetForm();
      }

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
        description="Manage backend-supported room fields and assign rooms to patients."
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
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-950">
            {editingRoomId ? `Update Room #${editingRoomId}` : "Room Form"}
          </h2>
          <p className="text-sm text-slate-500">
            Only backend-supported room fields are shown here.
          </p>
        </div>

        <form
          id="room-form"
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          noValidate
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Room Type
            </label>
            <input
              className={getInputClass("roomType")}
              placeholder="Room Type"
              value={form.roomType}
              onBlur={() => handleFieldBlur("roomType")}
              onChange={(e) => handleFieldChange("roomType", e.target.value)}
              aria-invalid={Boolean(fieldErrors.roomType)}
              aria-describedby={
                fieldErrors.roomType ? "roomType-error" : undefined
              }
            />
            {renderFieldError("roomType")}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Total Beds
            </label>
            <input
              className={getInputClass("totalBeds")}
              placeholder="Total Beds"
              type="number"
              min={1}
              value={form.totalBeds}
              onBlur={() => handleFieldBlur("totalBeds")}
              onChange={(e) => handleFieldChange("totalBeds", e.target.value)}
              aria-invalid={Boolean(fieldErrors.totalBeds)}
              aria-describedby={
                fieldErrors.totalBeds ? "totalBeds-error" : undefined
              }
            />
            {renderFieldError("totalBeds")}
          </div>

          <div className="flex items-end gap-2 md:col-span-2 xl:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading
                ? editingRoomId
                  ? "Updating..."
                  : "Adding..."
                : editingRoomId
                  ? "Update Room"
                  : "Add Room"}
            </button>

            {editingRoomId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-950">Room List</h2>
          <p className="text-sm text-slate-500">
            Assigning a room now requires a patient ID and records the admin who assigned it.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Room ID</th>
                <th className="px-5 py-3">Unique ID</th>
                <th className="px-5 py-3">Room Type</th>
                <th className="px-5 py-3">Beds</th>
                <th className="px-5 py-3">Assigned Patients</th>
                <th className="px-5 py-3">Assigned By</th>
                <th className="px-5 py-3">Created</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {pageLoading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-8 text-center text-slate-500"
                  >
                    Loading rooms...
                  </td>
                </tr>
              ) : null}

              {!pageLoading &&
                rooms.map((room) => {
                  const activeAssignments = getActiveAssignments(room);
                  const assignedAdmins = getUniqueAssignedBy(activeAssignments);
                  const isFull = room.availableBeds <= 0;

                  return (
                    <tr key={room.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        {room.id}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {room.uniqueId || "N/A"}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {room.roomType}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {room.availableBeds}/{room.totalBeds} beds available
                      </td>

                      <td className="min-w-72 px-5 py-4 text-slate-700">
                        {activeAssignments.length > 0 ? (
                          <div className="space-y-2">
                            {activeAssignments.map((assignment) => (
                              <div
                                key={assignment.id}
                                className="rounded-lg bg-slate-50 p-2"
                              >
                                <p className="text-xs font-medium text-slate-700">
                                  {formatPatientSummary(assignment.patient)}
                                </p>
                                <p className="mt-1 text-[11px] text-slate-500">
                                  Assigned: {formatDateTime(assignment.assignedAt)}
                                </p>
                                {assignment.patient?.id ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleReleaseBed(
                                        room.id,
                                        assignment.patient?.id
                                      )
                                    }
                                    className="mt-2 rounded-md bg-green-50 px-2 py-1 text-[11px] font-semibold text-green-700 hover:bg-green-100"
                                  >
                                    Release This Patient
                                  </button>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </td>

                      <td className="min-w-64 px-5 py-4 text-slate-700">
                        {assignedAdmins.length > 0 ? (
                          <div className="space-y-2">
                            {assignedAdmins.map((admin) => (
                              <p
                                key={admin.id}
                                className="rounded-lg bg-slate-50 p-2 text-xs font-medium text-slate-700"
                              >
                                {formatAdminSummary(admin)}
                              </p>
                            ))}
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {formatDateTime(room.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={isFull ? "Occupied" : "Available"} />
                      </td>

                      <td className="min-w-80 px-5 py-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(room)}
                              className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                            >
                              Edit
                            </button>

                            {activeAssignments.length > 0 ? (
                              <button
                                type="button"
                                onClick={() => handleReleaseBed(room.id)}
                                className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-100"
                              >
                                Release Latest
                              </button>
                            ) : null}

                            <button
                              type="button"
                              onClick={() => handleDelete(room.id)}
                              className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <input
                              className="w-32 rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                              placeholder="Patient ID"
                              type="number"
                              min={1}
                              value={assignPatientIds[room.id] || ""}
                              disabled={isFull}
                              onChange={(e) =>
                                setAssignPatientIds((previous) => ({
                                  ...previous,
                                  [room.id]: e.target.value,
                                }))
                              }
                            />

                            <button
                              type="button"
                              disabled={isFull}
                              onClick={() => handleAssignBed(room)}
                              className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Assign Room
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}

              {!pageLoading && rooms.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
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
