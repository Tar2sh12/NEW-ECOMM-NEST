import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from './base.service';
import { Otp, OtpType } from '../Models';
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { OTPTypes } from 'src/Common/Types';
import { Hash } from 'src/Common/Security';

export interface ICreateOtp {
  userId: Types.ObjectId;
  otp: string;
  otpType: OTPTypes;
  expiryTime?: Date;
}

@Injectable()
export class OTPRepository extends BaseService<OtpType> {
  constructor(
    @InjectModel(Otp.name) private readonly otpModel: Model<OtpType>,
  ) {
    super(otpModel);
  }
  override async create({
    userId,
    otp,
    otpType,
    expiryTime,
  }: ICreateOtp): Promise<OtpType> {
    return await this.model.create({
      userId,
      otp: Hash(otp, +process.env.SALT_ROUNDS),
      otpType,
      expireTime: expiryTime || new Date(Date.now() + 1000 * 60 * 10), // 10 minutes    
    });
  }
}
