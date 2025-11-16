export interface User {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
  isAdmin?: boolean;
  driver?: {
    id: string;
    phone?: string;
    vehicle?: {
      make?: string;
      model?: string;
      regNo?: string;
    };
    balance?: number; // cents
  } | null;
  createdAt?: string;
}
