import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from './base.service';
import {  Coupon, CouponType } from '../Models';
import { Model } from 'mongoose';

@Injectable()
export class CouponRepository extends BaseService<CouponType> {
  constructor(
    @InjectModel(Coupon.name) private readonly couponModel: Model<CouponType>,
  ) {
    super(couponModel);
  }
}
