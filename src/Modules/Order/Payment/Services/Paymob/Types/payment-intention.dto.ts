import { BillingData } from "./billing-data.interface";

export interface PaymentIntetionDto {
  amount: number; // in cents, e.g. 10000 for 100 EGP
  currency: string; // e.g. 'EGP'
  //  payment_methods: number[]; // array of integration IDs, e.g. [4955972]
  items?: {
    name: string;
    amount: number; // in cents
    description?: string;
    quantity: number;
  }[];
  extras?: Record<string, any>; // optional extra data e.g. { ee: 22 } The validity duration of the payment intention, expressed in seconds. After expiration, the intention can no longer be paid.
  special_reference?: string; // optional unique reference for tracking
  // notification_url: string; // URL for Paymob to send payment status updates
  // redirection_url: string; // URL to redirect the user after payment (cards only)
  billing_data: BillingData;
}
