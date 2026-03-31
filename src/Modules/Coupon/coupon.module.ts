import { Module } from '@nestjs/common';
import { CouponService } from './Services/coupon.service';
import { CouponController } from './Controllers/coupon.controller';
import { CouponModel, UserModel } from 'src/DB/Models';
import { CouponRepository, UserRepository } from 'src/DB/Repositories';

@Module({
  imports: [CouponModel, UserModel],
  controllers: [CouponController],
  providers: [CouponService, CouponRepository, UserRepository],
})
export class CouponModule {}
