import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  IsMongoId,
  IsPositive
} from 'class-validator';
import { Types } from 'mongoose';



//? in case the discount is a price not a precentage we can create a custom validator to check if the discount is less than the base price
// import {
//   Validate,
//   ValidationArguments,
//   ValidatorConstraint,
//   ValidatorConstraintInterface,
// } from 'class-validator';

// @ValidatorConstraint({ name: 'isDiscountValid', async: false })
// export class IsDiscountValid implements ValidatorConstraintInterface {
//   validate(discount: number, data: ValidationArguments) {
//     const basePrice = data.object['basePrice'];
//     return discount <= basePrice;
//   }
//   defaultMessage(): string {
//     return `Discount must be less than the base price`;
//   }
// }

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
  @Min(0)
  @Max(100)
  //@Validate(IsDiscountValid)
  discount: number;

  @IsNumber()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  stock: number;


  @IsMongoId()
  @Type(() => Types.ObjectId)
  categoryId: string;
}
