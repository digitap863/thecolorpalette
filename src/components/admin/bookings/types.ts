export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface BookingItem {
  id: string;
  name: string;
  phone: string;
  date: string;
  service: string;
  message?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface BookingFormData {
  name: string;
  phone: string;
  date: string;
  service: string;
  message: string;
  status: BookingStatus;
}
