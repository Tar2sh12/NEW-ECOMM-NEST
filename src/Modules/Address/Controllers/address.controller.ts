import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  Put,
} from '@nestjs/common';
import { AddressService } from '../Services/address.service';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { Auth } from 'src/Common/Guards';
import { IAuthUser, SystemRoles } from 'src/Common/Types';
import { User } from 'src/Common/Decorators';
import { ResponseInterceptor } from 'src/Interceptors';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post('create')
  @Auth([SystemRoles.USER])
  @UseInterceptors(new ResponseInterceptor('Address created successfully'))
  create(@Body() createAddressDto: CreateAddressDto, @User() user: IAuthUser) {
    return this.addressService.create(createAddressDto, user);
  }

  @Get('availableCities')
  @Auth([SystemRoles.USER])
  @UseInterceptors(new ResponseInterceptor('cities for selected country'))
  availableCities(@Body('country') country: string) {
    return this.addressService.availableCities(country);
  }

  @Get('get-my-addresses')
  @Auth([SystemRoles.USER])
  @UseInterceptors(new ResponseInterceptor('addresses retrieved successfully'))
  getMyAddresses(@User() user: IAuthUser) {
    return this.addressService.getMyAddresses(user);
  }

  @Put('update/:id')
  @Auth([SystemRoles.USER])
  @UseInterceptors(new ResponseInterceptor('address updated successfully'))
  update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @User() user: IAuthUser,
  ) {
    return this.addressService.update(id, updateAddressDto, user);
  }

  @Put('delete/:id')
  @Auth([SystemRoles.USER])
  @UseInterceptors(new ResponseInterceptor('Address deleted successfully'))
  softDelete(@Param('id') id: string, @User() user: IAuthUser) {
    return this.addressService.softDelete(id, user);
  }
}
