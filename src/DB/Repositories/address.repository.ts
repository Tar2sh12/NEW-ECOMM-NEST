import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from './base.service';
import { Address, AddressType } from '../Models';
import { Model } from 'mongoose';

@Injectable()
export class AddressRepository extends BaseService<AddressType> {
  constructor(
    @InjectModel(Address.name) private readonly addressModel: Model<AddressType>,
  ) {
    super(addressModel);
  }
}
