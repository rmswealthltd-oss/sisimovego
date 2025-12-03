export enum VerificationStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

export enum TripStatusEnum {
  REQUESTING = "REQUESTING",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface User {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  role: string;
  suspended: boolean;
  governmentIdStatus: VerificationStatus;
  driverLicenseStatus: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number; // Stored in cents
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  reference?: string | null;
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  origin: string;
  destination: string;
  departureTime: string;
  status: string;
}
