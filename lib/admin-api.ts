// import { api } from "@/lib/api";

// export type ApiResponse<T> = {
//   message: string;
//   data: T;
// };

// export type Admin = {
//   adminId: number;
//   name: string;
//   email: string;
//   dateOfBirth?: string;
//   socialMediaLinks?: string;
// };

// export type Patient = {
//   id: number;
//   uniqueId: string;
//   name: string;
//   email: string;
//   dateOfBirth: string;
//   socialMediaLinks?: string[];
//   createdAt: string;
// };

// export type Appointment = {
//   id: number;
//   uniqueId: string;
//   patient?: Patient;
//   doctorName: string;
//   appointmentDate: string;
//   status: string;
//   paymentStatus: string;
//   createdAt: string;
// };

// export type Room = {
//   id: number;
//   uniqueId: string;
//   roomType: string;
//   totalBeds: number;
//   availableBeds: number;
//   createdAt: string;
// };

// export type Bill = {
//   id: number;
//   patientName: string;
//   serviceCharge: number;
//   billingDate: string;
//   status: string;
//   paymentDate?: string | null;
//   createdAt: string;
//   appointment?: {
//     patient?: {
//       id: number;
//       name: string;
//       email: string;
//     } | null;
//     doctorName?: string;
//     appointmentDate?: string;
//     status?: string;
//     paymentStatus?: string;
//   } | null;
// };

// export type CreatePatientPayload = {
//   name: string;
//   email: string;
//   password: string;
//   dateOfBirth: string;
//   socialMediaLinks?: string[];
// };

// export type CreateAppointmentPayload = {
//   patientId: number;
//   doctorName: string;
//   appointmentDate: string;
// };

// export type CreateRoomPayload = {
//   roomType: string;
//   totalBeds: number;
// };

// export type CreateBillPayload = {
//   patientName: string;
//   serviceCharge: number;
//   billingDate: string;
//   appointmentId?: number;
// };

// export type CreateAdminPayload = {
//   name: string;
//   uname: string;
//   email: string;
//   password: string;
//   dateOfBirth?: string;
//   socialMediaLinks?: string;
// };

// export const adminApi = {
//   getProfile: async () => {
//     const response = await api.get("/admin/profile");
//     return response.data;
//   },

//   getAdmins: async () => {
//     const response = await api.get<ApiResponse<Admin[]>>("/admin/admins");
//     return response.data.data;
//   },

//   createAdmin: async (payload: CreateAdminPayload) => {
//     const response = await api.post("/admin/admins", payload);
//     return response.data;
//   },

//   deleteAdmin: async (id: number) => {
//     const response = await api.delete(`/admin/admins/${id}`);
//     return response.data;
//   },

//   getPatients: async () => {
//     const response = await api.get<ApiResponse<Patient[]>>("/admin/patients");
//     return response.data.data;
//   },

//   createPatient: async (payload: CreatePatientPayload) => {
//     const response = await api.post("/admin/patients", payload);
//     return response.data;
//   },

//   deletePatient: async (id: number) => {
//     const response = await api.delete(`/admin/patients/${id}`);
//     return response.data;
//   },

//   getAppointments: async () => {
//     const response = await api.get<ApiResponse<Appointment[]>>(
//       "/admin/appointments"
//     );
//     return response.data.data;
//   },

//   createAppointment: async (
//     adminId: number,
//     payload: CreateAppointmentPayload
//   ) => {
//     const response = await api.post(`/admin/${adminId}/appointment`, payload);
//     return response.data;
//   },

//   approveAppointment: async (id: number) => {
//     const response = await api.patch(`/admin/appointments/${id}/approve`);
//     return response.data;
//   },

//   cancelAppointment: async (id: number) => {
//     const response = await api.patch(`/admin/appointments/${id}/cancel`);
//     return response.data;
//   },

//   deleteAppointment: async (id: number) => {
//     const response = await api.delete(`/admin/appointments/${id}`);
//     return response.data;
//   },

//   getRooms: async () => {
//     const response = await api.get<ApiResponse<Room[]>>("/admin/rooms");
//     return response.data.data;
//   },

//   createRoom: async (payload: CreateRoomPayload) => {
//     const response = await api.post("/admin/rooms", payload);
//     return response.data;
//   },

//   assignBed: async (id: number) => {
//     const response = await api.patch(`/admin/rooms/${id}/assign-bed`);
//     return response.data;
//   },

//   releaseBed: async (id: number) => {
//     const response = await api.patch(`/admin/rooms/${id}/release-bed`);
//     return response.data;
//   },

//   deleteRoom: async (id: number) => {
//     const response = await api.delete(`/admin/rooms/${id}`);
//     return response.data;
//   },

//   getBills: async () => {
//     const response = await api.get<ApiResponse<Bill[]>>("/admin/bills");
//     return response.data.data;
//   },

//   createBill: async (payload: CreateBillPayload) => {
//     const response = await api.post("/admin/bills", payload);
//     return response.data;
//   },

//   payBill: async (id: number) => {
//     const response = await api.patch(`/admin/bills/${id}/pay`);
//     return response.data;
//   },

//   deleteBill: async (id: number) => {
//     const response = await api.delete(`/admin/bills/${id}`);
//     return response.data;
//   },
// };

import { api } from "@/lib/api";

export type ApiResponse<T> = {
  message: string;
  data: T;
};

export type ProfileResponse = {
  message: string;
  data: {
    email: string;
    sub: number;
    role: string;
    iat?: number;
    exp?: number;
  };
};

export type Admin = {
  adminId: number;
  name: string;
  email: string;
  uname?: string;
  dateOfBirth?: string;
  socialMediaLinks?: string;
};

export type Patient = {
  id: number;
  uniqueId: string;
  name: string;
  email: string;
  password?: string;
  dateOfBirth?: string;
  socialMediaLinks?: string[];
  createdAt?: string;
};

export type Appointment = {
  id: number;
  uniqueId: string;
  patient?: Patient | null;
  doctorName: string;
  appointmentDate: string;
  status: string;
  paymentStatus: string;
  createdAt?: string;
};

export type Room = {
  id: number;
  uniqueId: string;
  roomType: string;
  totalBeds: number;
  availableBeds: number;
  createdAt?: string;
};

export type Bill = {
  id: number;
  uniqueId?: string;
  patientName: string;
  serviceCharge: number | string;
  billingDate: string;
  status: string;
  paymentDate?: string | null;
  createdAt?: string;
  appointment?: {
    id?: number;
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

export type AdminPayload = {
  name: string;
  uname: string;
  email: string;
  password: string;
  dateOfBirth?: string;
  socialMediaLinks?: string;
};

export type PatientPayload = {
  name: string;
  email: string;
  password: string;
  dateOfBirth?: string;
  socialMediaLinks?: string[];
};

export type AppointmentPayload = {
  patientId: number;
  doctorName: string;
  appointmentDate?: string;
};

export type RoomPayload = {
  roomType: string;
  totalBeds: number;
};

export type BillPayload = {
  patientName: string;
  serviceCharge: number;
  billingDate: string;
  appointmentId?: number;
};

export type ServiceChargePayload = {
  serviceCharge: number;
};

export type BillingReportResponse = {
  message: string;
  generatedFor: string;
  filter: {
    startDate: string | null;
    endDate: string | null;
  };
  summary: {
    totalBills: number;
    paidBills: number;
    unpaidBills: number;
    totalBilledAmount: number;
    totalPaidAmount: number;
    totalOutstandingAmount: number;
  };
  data: Bill[];
};

export const adminApi = {
  getProfile: async () => {
    const response = await api.get<ProfileResponse>("/admin/profile");
    return response.data;
  },

  getAdmins: async () => {
    const response = await api.get<ApiResponse<Admin[]>>("/admin/admins");
    return response.data.data;
  },

  getAdminById: async (id: number) => {
    const response = await api.get<ApiResponse<Admin>>(`/admin/admins/${id}`);
    return response.data.data;
  },

  createAdmin: async (payload: AdminPayload) => {
    const response = await api.post("/admin/admins", payload);
    return response.data;
  },

  updateAdmin: async (id: number, payload: AdminPayload) => {
    const response = await api.put(`/admin/admins/${id}`, payload);
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

  getPatientById: async (id: number) => {
    const response = await api.get<ApiResponse<Patient>>(
      `/admin/patients/${id}`
    );
    return response.data.data;
  },

  createPatient: async (payload: PatientPayload) => {
    const response = await api.post("/admin/patients", payload);
    return response.data;
  },

  updatePatient: async (id: number, payload: PatientPayload) => {
    const response = await api.put(`/admin/patients/${id}`, payload);
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

  getAppointmentById: async (id: number) => {
    const response = await api.get<ApiResponse<Appointment>>(
      `/admin/appointments/${id}`
    );
    return response.data.data;
  },

  createAppointment: async (
    adminId: number,
    payload: AppointmentPayload
  ) => {
    const response = await api.post(`/admin/${adminId}/appointment`, payload);
    return response.data;
  },

  updateAppointment: async (id: number, payload: AppointmentPayload) => {
    const response = await api.put(`/admin/appointments/${id}`, payload);
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

  getAppointmentsByDate: async (date: string) => {
    const response = await api.get<ApiResponse<Appointment[]>>(
      `/admin/appointment/date/${date}`
    );
    return response.data.data;
  },

  getRooms: async () => {
    const response = await api.get<ApiResponse<Room[]>>("/admin/rooms");
    return response.data.data;
  },

  getRoomById: async (id: number) => {
    const response = await api.get<ApiResponse<Room>>(`/admin/rooms/${id}`);
    return response.data.data;
  },

  createRoom: async (payload: RoomPayload) => {
    const response = await api.post("/admin/rooms", payload);
    return response.data;
  },

  updateRoom: async (id: number, payload: RoomPayload) => {
    const response = await api.put(`/admin/rooms/${id}`, payload);
    return response.data;
  },

  deleteRoom: async (id: number) => {
    const response = await api.delete(`/admin/rooms/${id}`);
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

  getBills: async () => {
    const response = await api.get<ApiResponse<Bill[]>>("/admin/bills");
    return response.data.data;
  },

  getBillById: async (id: number) => {
    const response = await api.get<ApiResponse<Bill>>(`/admin/bills/${id}`);
    return response.data.data;
  },

  createBill: async (payload: BillPayload) => {
    const response = await api.post("/admin/bills", payload);
    return response.data;
  },

  updateBill: async (id: number, payload: BillPayload) => {
    const response = await api.patch(`/admin/bills/${id}`, payload);
    return response.data;
  },

  updateServiceCharge: async (
    id: number,
    payload: ServiceChargePayload
  ) => {
    const response = await api.patch(
      `/admin/bills/${id}/service-charge`,
      payload
    );
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

  getBillingReport: async (startDate?: string, endDate?: string) => {
    const response = await api.get<BillingReportResponse>(
      "/admin/billing-report",
      {
        params: {
          startDate,
          endDate,
        },
      }
    );

    return response.data;
  },
};