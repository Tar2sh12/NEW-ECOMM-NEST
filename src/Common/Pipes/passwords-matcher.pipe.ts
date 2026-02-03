import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class PasswordsMatcherPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if(value.password !== value.confirmPassword){
      throw new BadRequestException('Password and confirm password do not match');
    }
    return value;//return true value if validation is successful and returns false or throw error if validation fails
  }
}
