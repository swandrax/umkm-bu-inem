export interface Customer {
  id: number;
  name: string;
  phone?: string;
  address?: string;
  loyaltyPoints?: number;
  createdAt?: string;
}

export interface CustomerInput {
  name: string;
  phone?: string;
  address?: string;
}