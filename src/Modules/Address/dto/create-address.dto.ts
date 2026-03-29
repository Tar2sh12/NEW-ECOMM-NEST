import { IsNotEmpty ,IsString, IsNumber } from 'class-validator';

export class CreateAddressDto {
    @IsNotEmpty()
    @IsString()
    country: string;

    @IsNotEmpty()
    @IsString()
    city: string;

    @IsNotEmpty()
    @IsNumber()
    postalCode: number;

    @IsNotEmpty()
    @IsString()
    buildingNumber: string;

    @IsNotEmpty()
    @IsNumber()
    floorNumber: number;

    @IsString()
    addressLabel: string;

    @IsNotEmpty()
    setAsDefault: boolean;

}
