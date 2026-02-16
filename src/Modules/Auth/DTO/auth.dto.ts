import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { GenderEnum, SystemRoles } from 'src/Common/Types';
import { DateTime } from "luxon";
export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;


  @IsNotEmpty()
  @IsStrongPassword()
  password: string;


  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  firstName: string;


  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  lastName: string;


   @IsNotEmpty()
  @IsString()
  @MinLength(3)
  phone: string;
  @IsNotEmpty()
  @IsNumber()
  age: number;


  @IsString()
  @IsNotEmpty()
  @IsEnum(SystemRoles)
  role: SystemRoles;


  @IsString()
  @IsNotEmpty()
  @IsEnum(GenderEnum)
  gender: GenderEnum;


  @IsDate()
  @Type(() => Date)//used to convert string to date
  @IsNotEmpty()
  DOB: Date;
}


export class LoginBodyDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;


  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

}