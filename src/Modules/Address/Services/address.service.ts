import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { IAuthUser } from 'src/Common/Types';
import axios from 'axios';
import { AddressRepository } from 'src/DB/Repositories/address.repository';

@Injectable()
export class AddressService {
  constructor(private readonly addressRepository: AddressRepository) {}

  async create(createAddressDto: CreateAddressDto, user: IAuthUser) {
    const userId = user.user._id;
    const {
      country,
      city,
      postalCode,
      buildingNumber,
      floorNumber,
      addressLabel,
      setAsDefault,
    } = createAddressDto;
    // todo : cities validation
    const countryInfo = await axios.get(
      `https://api.api-ninjas.com/v1/country?name=${country}`,
      {
        headers: {
          'X-Api-Key': process.env.CITY_API_KEY,
        },
      },
    );
    //console.log(countryInfo);

    if (countryInfo.data.length === 0) {
      return new NotFoundException('Country not found');
    }
    const validCountry = countryInfo.data[0].iso2;

    const cities = await axios.post(
      'https://countriesnow.space/api/v0.1/countries/cities',
      {
        country: countryInfo.data[0].name, // use full name
      },
    );

    if (cities.data.error) {
      throw new NotFoundException('Country not found');
    }

    const isCityExist = cities.data.data.find((c) => c === city);
    if (!isCityExist) {
      return new NotFoundException('City not found');
    }
    const address = await this.addressRepository.create({
      country: validCountry,
      city,
      postalCode,
      buildingNumber,
      floorNumber,
      addressLabel,
      userId,
      isDefault: [true, false].includes(setAsDefault) ? setAsDefault : false,
    });
    // if the new address is default , update all other default addresses to false
    if (setAsDefault) {
      await this.addressRepository.updateMany({
        filters: { userId, isDefault: true, _id: { $ne: address._id } },
        update: { isDefault: false },
      });
    }
    return address;
  }

  findAll() {
    return `This action returns all address`;
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  async update(
    id: string,
    updateAddressDto: UpdateAddressDto,
    user: IAuthUser,
  ) {
    const {
      country,
      city,
      postalCode,
      buildingNumber,
      floorNumber,
      addressLabel,
      setAsDefault,
    } = updateAddressDto;
    const userId = user.user._id;
    const isAddressExist = await this.addressRepository.findOne({
      filters: { _id: id, userId, isMarkedAsDeleted: false },
    });
    if (!isAddressExist) {
      return new NotFoundException('Address not found');
    }
    if (country) isAddressExist.country = country;
    if (city) isAddressExist.city = city;
    if (postalCode) isAddressExist.postalCode = postalCode;
    if (buildingNumber) isAddressExist.buildingNumber = buildingNumber;
    if (floorNumber) isAddressExist.floorNumber = floorNumber;
    if (addressLabel) isAddressExist.addressLabel = addressLabel;
    if ([true, false].includes(setAsDefault)) {
      isAddressExist.isDefault = setAsDefault;
      if (setAsDefault && !isAddressExist.isDefault) {
        await this.addressRepository.updateMany({
          filters: {
            userId,
            isDefault: true,
            _id: { $ne: isAddressExist._id },
          },
          update: { isDefault: false },
        });
      }
    }
    await this.addressRepository.save(isAddressExist);
    return isAddressExist;
  }

  async availableCities(country: string) {
    const countryInfo = await axios.get(
      `https://api.api-ninjas.com/v1/country?name=${country}`,
      {
        headers: {
          'X-Api-Key': process.env.CITY_API_KEY,
        },
      },
    );
    

    if (countryInfo.data.length === 0) {
      return new NotFoundException('Country not found');
    }
    

    const cities = await axios.post(
      'https://countriesnow.space/api/v0.1/countries/cities',
      {
        country: countryInfo.data[0].name,
      },
    );

    if (cities.data.error) {
      throw new NotFoundException('Country not found');
    }

    return cities.data.data;
  }

  async getMyAddresses(user: IAuthUser) {
    const userId = user.user._id;
    const addresses = await this.addressRepository.find({
      filters: { userId, isMarkedAsDeleted: false },
    });
    return addresses;
  }

  async softDelete(id: string, user: IAuthUser) {
    const userId = user.user._id;
    const isAddressExist = await this.addressRepository.findOne({
      filters: { _id: id, userId, isMarkedAsDeleted: false },
    });
    if (!isAddressExist) {
      return new NotFoundException('Address not found');
    }
    isAddressExist.isMarkedAsDeleted = true;
    await this.addressRepository.save(isAddressExist);
    return isAddressExist;
  }
}
