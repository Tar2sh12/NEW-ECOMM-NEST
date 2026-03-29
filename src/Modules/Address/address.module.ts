import { Module } from '@nestjs/common';
import { AddressService } from './Services/address.service';
import { AddressController } from './Controllers/address.controller';
import { AddressModel } from 'src/DB/Models';
import { AddressRepository } from 'src/DB/Repositories/address.repository';

@Module({
  imports:[AddressModel],
  controllers: [AddressController],
  providers: [AddressService,AddressRepository],
})
export class AddressModule {}
