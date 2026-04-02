import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDate,
  IsArray,
  ValidateNested,
  Min,
  Max,
  IsMongoId,
  IsEnum,
  ValidateIf,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CouponTypes } from 'src/Common/Types';
import { Types } from 'mongoose';

// ================= USERS DTO =================
class UserCouponDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: Types.ObjectId;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  maxCount: number;

  usageCount: number = 0;


}

// ================= CREATE DTO =================
export class CreateCouponDto {
  @IsNotEmpty()
  @IsString()
  couponCode: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ValidateIf((obj) => obj.couponType === CouponTypes.PERCENTAGE)
  @Max(100)
  couponAmount: number;

  @IsEnum(CouponTypes)
  couponType: CouponTypes;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  from: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  till: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserCouponDto)
  Users: UserCouponDto[];

  // schema default = false
  @IsOptional()
  @IsBoolean()
  isEnable?: boolean = false;
}