export interface PaymobWebhookBody {
  obj: {
    id: number;
    success: boolean;
    pending: boolean;
    amount_cents: number;
    currency: string;
    created_at: string;
    error_occured: boolean;
    has_parent_transaction: boolean;
    integration_id: number;
    is_3d_secure: boolean;
    is_auth: boolean;
    is_capture: boolean;
    is_refunded: boolean;
    is_standalone_payment: boolean;
    is_voided: boolean;
    owner: number;
    order: {
      id: number;
      merchant_order_id: string; // YOUR internal order ID
    };
    source_data: {
      pan: string;
      sub_type: string;
      type: string;
    };
  };
}

// ─── Flat query params from Paymob GET redirect ───
export interface PaymobRedirectQuery {
  id: string;
  pending: string;
  amount_cents: string;
  success: string;
  is_auth: string;
  is_capture: string;
  is_standalone_payment: string;
  is_voided: string;
  is_refunded: string;
  is_3d_secure: string;
  integration_id: string;
  has_parent_transaction: string;
  order: string;
  created_at: string;
  currency: string;
  error_occured: string;
  is_void: string;
  is_refund: string;
  owner: string;
  merchant_order_id: string;
  'source_data.type': string;
  'source_data.pan': string;
  'source_data.sub_type': string;
  hmac: string;
}

// ─── Mapper: flat query → your existing PaymobWebhookBody shape ───
export function mapRedirectQueryToWebhookBody(
  q: PaymobRedirectQuery,
): PaymobWebhookBody {
  return {
    obj: {
      id: Number(q.id),
      success: q.success === 'true',
      pending: q.pending === 'true',
      amount_cents: Number(q.amount_cents),
      currency: q.currency,
      created_at: q.created_at,
      error_occured: q.error_occured === 'true',
      has_parent_transaction: q.has_parent_transaction === 'true',
      integration_id: Number(q.integration_id),
      is_3d_secure: q.is_3d_secure === 'true',
      is_auth: q.is_auth === 'true',
      is_capture: q.is_capture === 'true',
      is_refunded: q.is_refunded === 'true',
      is_standalone_payment: q.is_standalone_payment === 'true',
      is_voided: q.is_voided === 'true',
      owner: Number(q.owner),
      order: {
        id: Number(q.order),
        merchant_order_id: q.merchant_order_id,
      },
      source_data: {
        pan: q['source_data.pan'],
        sub_type: q['source_data.sub_type'],
        type: q['source_data.type'],
      },
    },
  };
}