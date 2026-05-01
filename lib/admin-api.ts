import { api } from "@/lib/api";

export type ApiResponse<T> = {
  message: string;
  data: T;
};

export type Admin = {
  adminId: number;
  name: string;
  email: string;
  dateOfBirth?: string;
  socialMediaLinks?: string;
};

export type Patient = {
  id: number;
  uniqueId: string;
  name: string;
  email: string;
  dateOfBirth: string;
  socialMediaLinks?: string[];
  createdAt: string;
};

export type Appointment = {
  id: number;
  uniqueId: string;
  patient?: Patient;
  doctorName: string;
  appointmentDate: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

export type Room = {
  id: number;
  uniqueId: string;
  roomType: string;
  totalBeds: number;
  availableBeds: number;
  createdAt: string;
};

export type Bill = {
  id: number;
  patientName: string;
  serviceCharge: number;
  billingDate: string;
  status: string;
  paymentDate?: string | null;
  createdAt: string;
  appointment?: {
    patient?: {
      id: number;
      name: string;
      email: string;
    } | null;
    doctorName?: string;
    appointmentDate?: string;
    status?: string;
    paymentStatus?: string;
  } | null;
};

export type CreatePatientPayload = {
  name: string;
  email: string;
  password: string;
  dateOfBirth: string;
  socialMediaLinks?: string[];
};

export type CreateAppointmentPayload = {
  patientId: number;
  doctorName: string;
  appointmentDate: string;
};

export type CreateRoomPayload = {
  roomType: string;
  totalBeds: number;
};

export type CreateBillPayload = {
  patientName: string;
  serviceCharge: number;
  billingDate: string;
  appointmentId?: number;
};

export type CreateAdminPayload = {
  name: string;
  uname: string;
  email: string;
  password: string;
  dateOfBirth?: string;
  socialMediaLinks?: string;
};

export const adminApi = {
  getProfile: async () => {
    const response = await api.get("/admin/profile");
    return response.data;
  },

  getAdmins: async () => {
    const response = await api.get<ApiResponse<Admin[]>>("/admin/admins");
    return response.data.data;
  },

  createAdmin: async (payload: CreateAdminPayload) => {
    const response = await api.post("/admin/admins", payload);
    return response.data;
  },

  deleteAdmin: async (id: number) => {
    const response = await api.delete(`/admin/admins/${id}`);
    return response.data;
  },

  getPatients: async () => {
    const response = await api.get<ApiResponse<Patient[]>>("/admin/patients");
    return response.data.data;
  },

  createPatient: async (payload: CreatePatientPayload) => {
    const response = await api.post("/admin/patients", payload);
    return response.data;
  },

  deletePatient: async (id: number) => {
    const response = await api.delete(`/admin/patients/${id}`);
    return response.data;
  },

  getAppointments: async () => {
    const response = await api.get<ApiResponse<Appointment[]>>(
      "/admin/appointments"
    );
    return response.data.data;
  },

  createAppointment: async (
    adminId: number,
    payload: CreateAppointmentPayload
  ) => {
    const response = await api.post(`/admin/${adminId}/appointment`, payload);
    return response.data;
  },

  approveAppointment: async (id: number) => {
    const response = await api.patch(`/admin/appointments/${id}/approve`);
    return response.data;
  },

  cancelAppointment: async (id: number) => {
    const response = await api.patch(`/admin/appointments/${id}/cancel`);
    return response.data;
  },

  deleteAppointment: async (id: number) => {
    const response = await api.delete(`/admin/appointments/${id}`);
    return response.data;
  },

  getRooms: async () => {
    const response = await api.get<ApiResponse<Room[]>>("/admin/rooms");
    return response.data.data;
  },

  createRoom: async (payload: CreateRoomPayload) => {
    const response = await api.post("/admin/rooms", payload);
    return response.data;
  },

  assignBed: async (id: number) => {
    const response = await api.patch(`/admin/rooms/${id}/assign-bed`);
    return response.data;
  },

  releaseBed: async (id: number) => {
    const response = await api.patch(`/admin/rooms/${id}/release-bed`);
    return response.data;
  },

  deleteRoom: async (id: number) => {
    const response = await api.delete(`/admin/rooms/${id}`);
    return response.data;
  },

  getBills: async () => {
    const response = await api.get<ApiResponse<Bill[]>>("/admin/bills");
    return response.data.data;
  },

  createBill: async (payload: CreateBillPayload) => {
    const response = await api.post("/admin/bills", payload);
    return response.data;
  },

  payBill: async (id: number) => {
    const response = await api.patch(`/admin/bills/${id}/pay`);
    return response.data;
  },

  deleteBill: async (id: number) => {
    const response = await api.delete(`/admin/bills/${id}`);
    return response.data;
  },
};