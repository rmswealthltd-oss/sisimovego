export interface FraudRule {
  id: string;
  name: string;
  description?: string;
  weight: number;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FraudCase {
  id: string;
  subject: string;
  score: number;
  status: "OPEN" | "CLOSED" | "INVESTIGATING";
  details?: string;
  createdAt: string;
}
