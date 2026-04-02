import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from './base.service';
import { Coupon, CouponType } from '../Models';
import { Model, Types } from 'mongoose';
import { DateTime } from 'luxon';
import { DiscountType } from 'src/Common/Types';
@Injectable()
export class CouponRepository extends BaseService<CouponType> {
  constructor(
    @InjectModel(Coupon.name) private readonly couponModel: Model<CouponType>,
  ) {
    super(couponModel);
  }

  async validateCoupon(
    couponCode: string,
    userId: Types.ObjectId,
  ): Promise<boolean> {
    const coupon = await this.couponModel.findOne({ code: couponCode });
    if (!coupon) throw new BadRequestException('Invalid coupon code');
    //check if coupon is enable
    const now = DateTime.now();
    const till = DateTime.fromJSDate(coupon.till);
    if (!coupon.isEnable || now > till) {
      throw new BadRequestException('coupon is expired');
    }

    // not started yet
    const from = DateTime.fromJSDate(coupon.from);
    if (now < from) {
      throw new BadRequestException(
        `coupon not started yet , will start in ${from}`,
      );
    }

    //check if coupon is valid for user
    const isUserNotEligible = coupon.Users.some(
      (user) =>
        user.userId.toString() !== userId.toString() ||
        (user.userId.toString() === userId.toString() &&
          user.maxCount <= user.usageCount),
    );
    if (isUserNotEligible) {
      throw new BadRequestException('coupon is not valid for you');
    }

    return true;
  }

  applyCoupon(coupon: CouponType, subTotal: number): number {
    let total = 0;
    const { couponType, couponAmount } = coupon;
    if (couponType == DiscountType.PERCENTAGE) {
      total = subTotal - (subTotal * couponAmount) / 100;
    } else if (couponType == DiscountType.AMOUNT) {
      if (subTotal > couponAmount) {
        return total;
      }
      total = subTotal - couponAmount;
    }
    return total;
  }
}
