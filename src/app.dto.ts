import {IsEnum, IsString, IsNotEmpty, IsNumber,IsStrongPassword, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, validate, Validate, ValidateIf} from "class-validator";
@ValidatorConstraint({ name: "Password-matcher", async: false })
export class PasswordMatcherConstraint implements ValidatorConstraintInterface{
    validate(confirmPassword: any, validationArguments: ValidationArguments): boolean{ 
        const password = validationArguments.object['password'];
        return password === confirmPassword;
    }
    defaultMessage() {
        return 'Password and Confirm Password do not match';
    }
}

export class AppBodyDto {
    @IsString()
    @IsNotEmpty()
    password: string;
    
    @ValidateIf((args)=>args.password) //only validate if password is present
    @Validate(PasswordMatcherConstraint)
    confirmPassword: string;
}