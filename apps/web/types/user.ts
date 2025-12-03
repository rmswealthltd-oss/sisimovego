// apps/web/types/user.ts

// ------------------------------
// SHARED ENUM TYPES
// ------------------------------
export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export type Role = "USER" | "DRIVER" | "PASSENGER" | "ADMIN" | "SUPERADMIN";

// ------------------------------
// CANONICAL USER TYPE (API aligned)
// ------------------------------
export interface User {
  id: string;

  firstName: string;
  middleName?: string | null;
  lastName: string;

  fullName?: string; // optional convenience

  phone: string;
  email?: string | null;

  role: Role;

  governmentIdStatus: VerificationStatus;
  driverLicenseStatus: VerificationStatus;
}

// For UI — identical for now, but extendable later
export type UserView = User;
