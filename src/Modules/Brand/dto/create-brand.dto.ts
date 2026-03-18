import { Type } from 'class-transformer';
import {
  IsMongoId,
//   IsDate,
//   IsEmail,
//   IsEnum,
  IsNotEmpty,
  //IsNumber,
  IsString,
//   IsStrongPassword,
//   MinLength,
} from 'class-validator';
import { Types } from 'mongoose';
export class CreateBrandDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsMongoId()
    @Type(() => Types.ObjectId)
    @IsNotEmpty()
    categoryId: string;

    @IsMongoId()
    @Type(() => Types.ObjectId)
    @IsNotEmpty()
    subcategoryId: string;
}
