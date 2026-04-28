import { BillingData } from "./billing-data.interface";

export interface CreatePaymentDto {
  amountCents: number; // e.g. 10000 = 100 EGP
  currency: string; // e.g. 'EGP'
  merchantOrderId: string; // YOUR internal order ID from your DB
  billingData: BillingData;
  items?: { name: string; amount_cents: number; quantity: number }[];
}
