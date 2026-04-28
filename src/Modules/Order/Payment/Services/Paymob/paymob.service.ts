import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';
import { CreatePaymentDto, PaymentIntetionDto, PaymobWebhookBody } from './Types';


@Injectable()
export class PaymobService {
  private readonly logger = new Logger(PaymobService.name);

  // Paymob base URL — all API calls go here
  private readonly BASE_URL =
    process.env.PAYMOB_EGY_URL || 'https://accept.paymob.com/';

  constructor(private readonly httpService: HttpService) {}

  //------------------------------------- first way of creating payment intention -------------------------------------

  // ─────────────────────────────────────────────
  //  STEP 1 — Get Auth Token
  //  Every Paymob operation needs a fresh token first.
  //  This token expires after a short time, so we always
  //  re-fetch it before any API call instead of caching it.
  // ─────────────────────────────────────────────
  private async getAuthToken(): Promise<string> {
    try {
      //? Older RxJS way — deprecated now
      // this.httpService.post(...).toPromise()
      //? Current correct way
      // firstValueFrom(this.httpService.post(...))

      /*
        * What the Observable Emits
        For HttpService.post(), the Observable emits a single AxiosResponse object:
        typescript{
        data: { ... },          // the actual response body from Paymob API
        status: 200,            // HTTP status code
        statusText: 'OK',
        headers: { ... },       // response headers
        config: { ... },        // the axios request config that was used
        request: { ... }        // the raw HTTP request object
        }
     */

      // * firstValueFrom
      // It's a utility from RxJS that converts an Observable into a Promise by taking the first emitted value and resolving with it.
      const { data } = await firstValueFrom(
        this.httpService.post(`${this.BASE_URL}api/auth/tokens`, {
          api_key: process.env.PAYMOB_API_KEY,
        }),
      );
      return data.token;
    } catch (error) {
      console.log(error);

      this.logger.error('Auth failed:', error);
      throw error;
    }
  }

  // ─────────────────────────────────────────────
  //  STEP 2 — Register Order on Paymob
  //  Before we can create a payment link, Paymob needs
  //  to know about the order (amount, currency, your internal ID).
  //  Returns the Paymob Order ID (different from your merchant_order_id).
  // ─────────────────────────────────────────────
  private async registerOrder(
    authToken: string,
    dto: CreatePaymentDto,
  ): Promise<number> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${this.BASE_URL}api/ecommerce/orders`, {
          auth_token: authToken,
          delivery_needed: false,
          amount_cents: dto.amountCents,
          currency: dto.currency,
          merchant_order_id: dto.merchantOrderId,
          items: dto.items ?? [],
        }),
      );
      return data.id;
    } catch (error) {
      // ✅ This is what you need — the actual Paymob error body
      console.log(error);

      console.log(
        'Paymob order error:',
        JSON.stringify(error['response']?.data, null, 2),
      );
      console.log(
        'Request body sent:',
        JSON.stringify(
          {
            auth_token: authToken,
            delivery_needed: false,
            amount_cents: dto.amountCents,
            currency: dto.currency,
            merchant_order_id: dto.merchantOrderId,
            items: dto.items ?? [],
          },
          null,
          2,
        ),
      );
      throw error;
    }
  }

  // ─────────────────────────────────────────────
  //  STEP 3 — Get Payment Key
  //  This key is a short-lived token (3 min) used to
  //  open the payment iframe or redirect the user.
  //  It encodes: amount + order + billing data + integration.
  // ─────────────────────────────────────────────
  private async getPaymentKey(
    authToken: string,
    paymobOrderId: number,
    dto: CreatePaymentDto,
  ): Promise<string> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${this.BASE_URL}api/acceptance/payment_keys`, {
          auth_token: authToken,
          amount_cents: dto.amountCents,
          expiration: 3600, // key valid for 1 hour
          order_id: paymobOrderId,
          billing_data: dto.billingData,
          currency: dto.currency,
          integration_id: Number(process.env.PAYMOB_INTEGRATION_ID), // from your Paymob dashboard
          lock_order_when_paid: false,
        }),
      );

      return data.token; // this is the payment_key token
    } catch (error) {
      console.log(error);

      this.logger.error('Payment key failed:', error);
      throw error;
    }
  }

  // ─────────────────────────────────────────────
  //  PUBLIC — Create Payment
  //  Orchestrates steps 1 → 2 → 3 and returns
  //  the iframe URL you send to your frontend.
  //  The user opens this URL to enter card details.
  // ─────────────────────────────────────────────
  async createPayment(
    dto: CreatePaymentDto,
  ): Promise<{ iframeUrl: string; paymentKey: string }> {
    try {
      this.logger.log(`Creating payment for order: ${dto.merchantOrderId}`);
      //console.log('Creating payment with DTO:', dto);
      // Step 1: Authenticate
      const authToken = await this.getAuthToken();
      //console.log('Auth token obtained', authToken);

      // Step 2: Register the order on Paymob
      const paymobOrderId = await this.registerOrder(authToken, dto);
      //console.log('Paymob order registered', paymobOrderId);
      // Step 3: Get a payment key
      const paymentKey = await this.getPaymentKey(
        authToken,
        paymobOrderId,
        dto,
      );
      //console.log('Payment key obtained', paymentKey);
      // The iframe URL is the URL your frontend opens in an iframe or redirects to.
      // PAYMOB_IFRAME_ID is the iframe ID from your Paymob dashboard integration.
      const iframeUrl = `${this.BASE_URL}api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;

      this.logger.log(`Payment iframe ready for order: ${dto.merchantOrderId}`);
      return { iframeUrl, paymentKey };
    } catch (error) {
      console.log(error);

      this.logger.error('Create payment failed:', error);
      throw error;
    }
  }

  //------------------------------------- second way of creating payment intention -------------------------------------

  async createPaymentIntention(dto: PaymentIntetionDto) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${this.BASE_URL}v1/intention/`,
          {
            amount: dto.amount,
            currency: dto.currency,
            payment_methods: [+process.env.PAYMOB_INTEGRATION_ID],
            items: dto.items,
            extras: dto.extras,
            special_reference: dto.special_reference,
            notification_url: process.env.NOTIFICATION_URL,
            redirection_url: process.env.REDIRECTION_URL,
            billing_data: dto.billing_data,
          },
          {
            headers: {
              Authorization: `Token ${process.env.PAYMOB_SECRET_KEY}`,
            },
          },
        ),
      );

      //{{BASE_URL}}/unifiedcheckout/?publicKey={{public_key}}&clientSecret={{client_secret}}
      const paymentUrl = `${this.BASE_URL}unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${data.client_secret}`;
      return { paymentUrl };
    } catch (error) {
      //console.log(error);
      this.logger.error('Create payment intention failed:', error);
      throw error;
    }
  }

  // ─────────────────────────────────────────────
  //  PUBLIC — Refund Transaction
  //  Call this when you want to refund a paid order.
  //  You need the Paymob transaction ID (from the webhook
  //  or from your DB where you saved it after payment).
  //  Amount can be partial or full.
  // ─────────────────────────────────────────────
  async refundTransaction(
    transactionId: number,
    amountCents: number,
  ): Promise<any> {
    try {
      this.logger.log(
        `Refunding transaction: ${transactionId}, amount: ${amountCents}`,
      );

      // Refund also needs a fresh auth token first
      const authToken = await this.getAuthToken();

      const { data } = await firstValueFrom(
        this.httpService.post(
          `${this.BASE_URL}api/acceptance/void_refund/refund`,
          {
            auth_token: authToken,
            transaction_id: transactionId,
            amount_cents: amountCents,
          },
        ),
      );

      this.logger.log(
        `Refund response for transaction ${transactionId}:`,
        data,
      );
      return data;
    } catch (error) {
      this.logger.error(
        `Refund failed for transaction ${transactionId}:`,
        error,
      );
    }
  }

  // ─────────────────────────────────────────────
  //  PUBLIC — Void Transaction
  //  Use this INSTEAD of refund if the transaction was
  //  NOT yet settled (captured). Void cancels it entirely.
  //  Only works same-day before settlement.
  // ─────────────────────────────────────────────
  async voidTransaction(transactionId: number): Promise<any> {
    this.logger.log(`Voiding transaction: ${transactionId}`);

    const authToken = await this.getAuthToken();

    const { data } = await firstValueFrom(
      this.httpService.post(`${this.BASE_URL}api/acceptance/void_refund/void`, {
        auth_token: authToken,
        transaction_id: transactionId,
      }),
    );

    return data;
  }

  // ─────────────────────────────────────────────
  //  PUBLIC — Verify Webhook HMAC
  //  Paymob sends a signed request to your webhook URL.
  //  You MUST verify the HMAC before trusting the payload.
  //  The hmac arrives as a query param: ?hmac=xxxx
  //  If this returns false → reject the request immediately.
  // ─────────────────────────────────────────────
  // verifyHmac(query: PaymobRedirectQuery) {
  verifyHmac(body: PaymobWebhookBody, receivedHmac: string) {
    const obj = body.obj;
    const { success, pending, order } = body.obj;
    const concatenatedString = [
      obj.amount_cents,
      obj.created_at,
      obj.currency,
      obj.error_occured,
      obj.has_parent_transaction,
      obj.id,
      obj.integration_id,
      obj.is_3d_secure,
      obj.is_auth,
      obj.is_capture,
      obj.is_refunded,
      obj.is_standalone_payment,
      obj.is_voided,
      obj.order?.id,
      obj.owner,
      obj.pending,
      obj.source_data?.pan,
      obj.source_data?.sub_type,
      obj.source_data?.type,
      obj.success,
    ].join('');

    const calculatedHmac = crypto
      .createHmac('sha512', process.env.PAYMOB_HMAC_KEY)
      .update(concatenatedString)
      .digest('hex');

    return {
      // validHmac: calculatedHmac === receivedHmac,
      //A naive calculatedHmac === receivedHmac string comparison short-circuits on the first mismatch,
      // leaking timing info that can help an attacker guess the HMAC byte by byte.
      // The fix is a constant-time comparison:
      validHmac: crypto.timingSafeEqual(
        Buffer.from(calculatedHmac),
        Buffer.from(receivedHmac),
      ),
      success,
      pending,
      order,
      body,
    };
  }
}
