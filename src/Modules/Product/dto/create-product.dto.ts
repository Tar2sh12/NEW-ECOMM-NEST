import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsMongoId,
  IsPositive,
  IsEnum,
} from 'class-validator';
import { Types } from 'mongoose';

//? in case the discount is a price not a precentage we can create a custom validator to check if the discount is less than the base price
import {
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DiscountType } from 'src/Common/Types';

@ValidatorConstraint({ name: 'isDiscountValid', async: false })
export class IsDiscountValid implements ValidatorConstraintInterface {
  private message: string = '';
  validate(discount: number, data: ValidationArguments) {
    if (!data.object['discountType']) {
      this.message =
        'You should send the discount type when you send the discount value';
      return false;
    }
    if (data.object['discountType'] === DiscountType.PERCENTAGE) {
      if (discount < 0 || discount > 100) {
        this.message =
          'In case of percentage discount, the discount value must be between 0 and 100';
        return false;
      }
    }

    if (data.object['discountType'] === DiscountType.AMOUNT) {
      const basePrice = data.object['basePrice'];
      if (discount >= basePrice) {
        this.message =
          'In case of amount discount, the discount value must be less than the base price';
        return false;
      }
    }

    return true;
  }
  defaultMessage(): string {
    return this.message;
  }
}

export class CreateProductDto {
  //title, description, basePrice, categoryId , discount , stock
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  basePrice: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Validate(IsDiscountValid)
  discount: number;

  @IsString()
  @IsOptional()
  @IsEnum(DiscountType)
  discountType: string;

  @IsNumber()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  stock: number;

  @IsMongoId()
  @Type(() => Types.ObjectId)
  @IsNotEmpty()
  categoryId: string;

   @IsMongoId()
  @Type(() => Types.ObjectId)
  @IsNotEmpty()
  subcategoryId: string;

   @IsMongoId()
  @Type(() => Types.ObjectId)
  @IsNotEmpty()
  brandId: string;
}
