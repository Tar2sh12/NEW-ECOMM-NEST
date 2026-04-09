import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CouponTypes } from 'src/Common/Types';
import { CouponRepository } from 'src/DB/Repositories';
import Stripe from 'stripe';

const secret = process.env.STRIPE_SECRET_KEY as string;

@Injectable()
export class StripeService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

  constructor(private readonly couponRepository: CouponRepository) {}

  async createCheckoutSession({
    line_items,
    discounts = [],
    customer_email,
    metadata,
    shipping_options = [],
  }: Stripe.Checkout.SessionCreateParams) {
    return await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url:
        process.env.STRIPE_SUCCESS_URL || 'http://localhost:4000/success',
      cancel_url:
        process.env.STRIPE_CANCEL_URL || 'http://localhost:4000/cancel',
      line_items,
      discounts,
      customer_email,
      metadata,
      shipping_options,
    });
  }

  async createStripeCoupon(couponId: Types.ObjectId) {
    const findCoupon = await this.couponRepository.findOne({
      filters: { _id: couponId },
    });
    if (!findCoupon) {
      throw new Error('Coupon not found');
    }
    let couponObject = {};
    if (findCoupon.couponType == CouponTypes.AMOUNT) {
      couponObject = {
        name: findCoupon.couponCode,
        amount_off: findCoupon.couponAmount * 100,
        currency: 'egp',
      };
    } else if (findCoupon.couponType == CouponTypes.PERCENTAGE) {
      couponObject = {
        name: findCoupon.couponCode,
        percent_off: findCoupon.couponAmount,
      };
    }
    const stripeCoupon = await this.stripe.coupons.create(couponObject);
    return stripeCoupon;
  }

  async refundPaymentIntent({ payment_intent, reason }) {
    return await this.stripe.refunds.create({
      payment_intent,
      reason,
    });
  }
}
