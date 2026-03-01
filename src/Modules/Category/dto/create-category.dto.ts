import { Type } from 'class-transformer';
import {
//   IsDate,
//   IsEmail,
//   IsEnum,
  IsNotEmpty,
  //IsNumber,
  IsString,
//   IsStrongPassword,
//   MinLength,
} from 'class-validator';
export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
