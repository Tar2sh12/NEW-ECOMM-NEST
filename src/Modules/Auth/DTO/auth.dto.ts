import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { SystemRoles } from 'src/Common/Types';

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
  username: string;


  @IsNotEmpty()
  @IsNumber()
  age: number;


  @IsString()
  @IsNotEmpty()
  @IsEnum(SystemRoles)
  role: string;
}


export class LoginBodyDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;


  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

}