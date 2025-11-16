export interface User {
  id: string;
  name: string;
  email: string;

  // Phone number used for MPESA, SMS, login fallback
  phone?: string | null;

  // Profile info
  avatarUrl?: string | null;
  rating?: number | null;

  // System fields
  role: "PASSENGER" | "DRIVER" | "ADMIN";
  createdAt: string;
  updatedAt: string;

  // Driver-only extensions (optional for passengers)
  driverVerified?: boolean;
  driverLicenseNumber?: string | null;
  vehiclePlate?: string | null;
  vehicleModel?: string | null;
  vehicleColor?: string | null;

  // Push Notifications
  pushEnabled?: boolean;
}
