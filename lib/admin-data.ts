export type UserStatus = "Active" | "Inactive" | "Blocked";
export type AppointmentStatus = "Pending" | "Approved" | "Completed" | "Cancelled";
export type RoomStatus = "Available" | "Occupied" | "Maintenance";
export type BillStatus = "Paid" | "Unpaid" | "Partial";
export type Gender = "Male" | "Female" | "Other";

export type Admin = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "Super Admin" | "Admin";
  status: UserStatus;
  createdAt: string;
};

export type Patient = {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: Gender;
  bloodGroup: string;
  address: string;
  emergencyContact: string;
  status: UserStatus;
  createdAt: string;
};

export type Appointment = {
  id: number;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  departmentName: string;
  appointmentDate: string;
  appointmentTime: string;
  problem: string;
  status: AppointmentStatus;
  createdAt: string;
};

export type Room = {
  id: number;
  roomNumber: string;
  roomType: string;
  floorNumber: string;
  bedNumber: string;
  dailyCharge: number;
  status: RoomStatus;
  assignedPatient: string;
};

export type Bill = {
  id: number;
  invoiceNumber: string;
  patientName: string;
  patientPhone: string;
  appointmentId: number;
  roomNumber: string;
  doctorCharge: number;
  roomCharge: number;
  serviceCharge: number;
  medicineCharge: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentMethod: "Cash" | "Card" | "Bkash" | "Nagad" | "Bank Transfer";
  status: BillStatus;
  createdAt: string;
};

export type Department = {
  id: number;
  departmentName: string;
  headDoctor: string;
  contactNumber: string;
  location: string;
  totalDoctors: number;
  totalRooms: number;
  status: "Active" | "Inactive";
};

export const admins: Admin[] = [
  {
    id: 1,
    name: "Main Admin",
    email: "admin@hospital.com",
    phone: "01710000001",
    role: "Super Admin",
    status: "Active",
    createdAt: "2026-04-28",
  },
  {
    id: 2,
    name: "Hospital Manager",
    email: "manager@hospital.com",
    phone: "01710000002",
    role: "Admin",
    status: "Active",
    createdAt: "2026-04-20",
  },
];

export const patients: Patient[] = [
  {
    id: 1,
    name: "Rahim Uddin",
    email: "rahim@example.com",
    phone: "01711111111",
    age: 42,
    gender: "Male",
    bloodGroup: "B+",
    address: "Mirpur, Dhaka",
    emergencyContact: "01811111111",
    status: "Active",
    createdAt: "2026-04-22",
  },
  {
    id: 2,
    name: "Nusrat Jahan",
    email: "nusrat@example.com",
    phone: "01822222222",
    age: 29,
    gender: "Female",
    bloodGroup: "O+",
    address: "Uttara, Dhaka",
    emergencyContact: "01922222222",
    status: "Active",
    createdAt: "2026-04-24",
  },
  {
    id: 3,
    name: "Tanvir Ahmed",
    email: "tanvir@example.com",
    phone: "01933333333",
    age: 35,
    gender: "Male",
    bloodGroup: "A+",
    address: "Dhanmondi, Dhaka",
    emergencyContact: "01733333333",
    status: "Inactive",
    createdAt: "2026-04-25",
  },
];

export const appointments: Appointment[] = [
  {
    id: 1,
    patientName: "Rahim Uddin",
    patientPhone: "01711111111",
    doctorName: "Dr. Sabrina Akter",
    departmentName: "Cardiology",
    appointmentDate: "2026-04-28",
    appointmentTime: "10:30 AM",
    problem: "Chest pain and breathing issue",
    status: "Approved",
    createdAt: "2026-04-27",
  },
  {
    id: 2,
    patientName: "Nusrat Jahan",
    patientPhone: "01822222222",
    doctorName: "Dr. Kamrul Hasan",
    departmentName: "Neurology",
    appointmentDate: "2026-04-28",
    appointmentTime: "12:00 PM",
    problem: "Migraine follow-up",
    status: "Pending",
    createdAt: "2026-04-27",
  },
  {
    id: 3,
    patientName: "Tanvir Ahmed",
    patientPhone: "01933333333",
    doctorName: "Dr. Farhana Islam",
    departmentName: "Medicine",
    appointmentDate: "2026-04-29",
    appointmentTime: "09:00 AM",
    problem: "Regular health checkup",
    status: "Completed",
    createdAt: "2026-04-26",
  },
];

export const rooms: Room[] = [
  {
    id: 1,
    roomNumber: "ICU-201",
    roomType: "ICU",
    floorNumber: "2nd Floor",
    bedNumber: "B-01",
    dailyCharge: 7500,
    status: "Available",
    assignedPatient: "N/A",
  },
  {
    id: 2,
    roomNumber: "CAB-305",
    roomType: "Cabin",
    floorNumber: "3rd Floor",
    bedNumber: "B-12",
    dailyCharge: 3500,
    status: "Occupied",
    assignedPatient: "Rahim Uddin",
  },
  {
    id: 3,
    roomNumber: "WRD-110",
    roomType: "General Ward",
    floorNumber: "1st Floor",
    bedNumber: "B-22",
    dailyCharge: 1200,
    status: "Maintenance",
    assignedPatient: "N/A",
  },
];

export const bills: Bill[] = [
  {
    id: 1,
    invoiceNumber: "INV-2026-001",
    patientName: "Rahim Uddin",
    patientPhone: "01711111111",
    appointmentId: 1,
    roomNumber: "CAB-305",
    doctorCharge: 800,
    roomCharge: 3500,
    serviceCharge: 500,
    medicineCharge: 1200,
    discount: 300,
    totalAmount: 5700,
    paidAmount: 5700,
    dueAmount: 0,
    paymentMethod: "Cash",
    status: "Paid",
    createdAt: "2026-04-28",
  },
  {
    id: 2,
    invoiceNumber: "INV-2026-002",
    patientName: "Nusrat Jahan",
    patientPhone: "01822222222",
    appointmentId: 2,
    roomNumber: "N/A",
    doctorCharge: 1000,
    roomCharge: 0,
    serviceCharge: 250,
    medicineCharge: 0,
    discount: 0,
    totalAmount: 1250,
    paidAmount: 500,
    dueAmount: 750,
    paymentMethod: "Bkash",
    status: "Partial",
    createdAt: "2026-04-28",
  },
];

export const departments: Department[] = [
  {
    id: 1,
    departmentName: "Cardiology",
    headDoctor: "Dr. Sabrina Akter",
    contactNumber: "01744444444",
    location: "Building A, 2nd Floor",
    totalDoctors: 8,
    totalRooms: 12,
    status: "Active",
  },
  {
    id: 2,
    departmentName: "Neurology",
    headDoctor: "Dr. Kamrul Hasan",
    contactNumber: "01755555555",
    location: "Building B, 3rd Floor",
    totalDoctors: 5,
    totalRooms: 8,
    status: "Active",
  },
  {
    id: 3,
    departmentName: "Radiology",
    headDoctor: "Dr. Mahmud Rahman",
    contactNumber: "01766666666",
    location: "Building C, Ground Floor",
    totalDoctors: 4,
    totalRooms: 6,
    status: "Inactive",
  },
];

export const dashboardMetrics = [
  {
    title: "Total Patients",
    value: patients.length.toString(),
    helper: "Registered patients",
  },
  {
    title: "Appointments",
    value: appointments.length.toString(),
    helper: "Current appointment records",
  },
  {
    title: "Available Rooms",
    value: rooms.filter((room) => room.status === "Available").length.toString(),
    helper: "Ready for admission",
  },
  {
    title: "Total Revenue",
    value: `৳ ${bills.reduce((sum, bill) => sum + bill.paidAmount, 0).toLocaleString()}`,
    helper: "Collected payment",
  },
];