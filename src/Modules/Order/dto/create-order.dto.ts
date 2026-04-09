import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsMongoId,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { paymentMethods } from 'src/Common/Types';
import { Types } from 'mongoose';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(paymentMethods)
  paymentMethod: paymentMethods;

  @IsMongoId()
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  addressId: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  contactNumber: string;

  @Type(() => Number)
  @IsNumber()
  shipingFee: number;

  @Type(() => Number)
  @IsNumber()
  VAT: number;

  @IsOptional()
  @IsString()
  couponCode?: string;
}

export class GetMyOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  orderId: Types.ObjectId;
}
