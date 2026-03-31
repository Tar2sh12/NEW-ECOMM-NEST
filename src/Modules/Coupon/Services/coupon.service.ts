import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCouponDto } from '../dto/create-coupon.dto';
import { UpdateCouponDto } from '../dto/update-coupon.dto';
import { CouponRepository, UserRepository } from 'src/DB/Repositories';
import { IAuthUser } from 'src/Common/Types';
import { DateTime } from 'luxon';
@Injectable()
export class CouponService {
  constructor(
    private readonly couponRepository: CouponRepository,
    private readonly userRepository: UserRepository,
  ) {}

  // ================= CREATE =================
  async create(createCouponDto: CreateCouponDto, user: IAuthUser) {
    const { couponCode, Users } = createCouponDto;

    // check coupon code
    const isCouponExist = await this.couponRepository.findOne({
      filters: { couponCode },
    });
    if (isCouponExist) {
      throw new BadRequestException('coupon code already exist');
    }

    // validate users
    if (Users?.length) {
      const userIds = Users.map((user) => user.userId);

      const validUsers = await this.userRepository.find({
        filters: { _id: { $in: userIds } },
      });

      if (validUsers.length !== userIds.length) {
        throw new BadRequestException('invalid users');
      }
    }
    const newCoupon = await this.couponRepository.create({
      couponCode: createCouponDto.couponCode,
      couponAmount: createCouponDto.couponAmount,
      couponType: createCouponDto.couponType,
      from: DateTime.fromJSDate(createCouponDto.from),
      till: DateTime.fromJSDate(createCouponDto.till),
      Users: createCouponDto.Users || [],
      isEnable: createCouponDto.isEnable,
      createdBy: user.user._id,
    });

    return {
      message: 'coupon created successfully',
      data: newCoupon,
    };
  }

  // ================= FIND ALL =================
  async findAll(isEnable?: string) {
    const filters: any = {};

    if (isEnable !== undefined) {
      filters.isEnable = isEnable === 'true';
    }

    const coupons = await this.couponRepository.find({ filters });

    return {
      message: 'coupons found',
      data: coupons,
    };
  }

  // ================= FIND ONE =================
  async findOne(couponId: string) {
    const coupon = await this.couponRepository.findOne({
      filters: { _id: couponId },
    });

    if (!coupon) {
      throw new NotFoundException('coupon not found');
    }

    return {
      message: 'coupon found',
      data: coupon,
    };
  }

  // ================= UPDATE =================
  async update(couponId: string, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.couponRepository.findOne({
      filters: { _id: couponId },
    });

    if (!coupon) {
      throw new NotFoundException('coupon not found');
    }

    // couponCode
    if (updateCouponDto.couponCode) {
      const isExist = await this.couponRepository.findOne({
        filters: { couponCode: updateCouponDto.couponCode },
      });

      if (isExist) {
        throw new BadRequestException('coupon code already exist');
      }

      coupon.couponCode = updateCouponDto.couponCode;
    }

    // from
    if (updateCouponDto.from) {
      coupon.from = updateCouponDto.from;
    }

    // till
    if (updateCouponDto.till) {
      coupon.till = updateCouponDto.till;
    }

    // amount
    if (updateCouponDto.couponAmount) {
      coupon.couponAmount = updateCouponDto.couponAmount;
    }

    // type
    if (updateCouponDto.couponType) {
      coupon.couponType = updateCouponDto.couponType;
    }
    if(updateCouponDto.Users){
      const userIds = updateCouponDto.Users.map((user) => user.userId);
      const validUsers = await this.userRepository.find({
        filters: { _id: { $in: userIds } },
      });
      if (validUsers.length !== userIds.length) {
        throw new BadRequestException('invalid users');
      }
      coupon.Users = updateCouponDto.Users;
    }

    await this.couponRepository.save(coupon);

    // await this.couponChangeLogRepository.create(logUpdatedObject);

    return {
      message: 'coupon updated successfully',
      data: coupon,
    };
  }

  // ================= ENABLE / DISABLE =================
  async toggleEnable(couponId: string, enable: boolean) {
    const coupon = await this.couponRepository.findOne({
      filters: { _id: couponId },
    });

    if (!coupon) {
      throw new NotFoundException('coupon not found');
    }

    coupon.isEnable = enable;

    await this.couponRepository.save(coupon);

    return {
      message: 'coupon updated successfully',
      data: coupon,
    };
  }
}
