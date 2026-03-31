import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { CouponService } from '../Services/coupon.service';
import { CreateCouponDto } from '../dto/create-coupon.dto';
import { UpdateCouponDto } from '../dto/update-coupon.dto';
import { Auth } from 'src/Common/Guards';
import { IAuthUser, SystemRoles } from 'src/Common/Types';
import { User } from 'src/Common/Decorators';

@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post('create')
  @Auth([SystemRoles.ADMIN])
  create(@Body() createCouponDto: CreateCouponDto,@User() user: IAuthUser) {
    return this.couponService.create(createCouponDto, user);
  }

  @Get('')
  @Auth([SystemRoles.ADMIN])
  findAll(
    @Query() isEnable: string,
  ) {
    return this.couponService.findAll(isEnable);
  }

  @Get('details/:id')
  @Auth([SystemRoles.ADMIN])
  findOne(@Param('id') id: string) {
    return this.couponService.findOne(id);
  }

  @Patch('update/:id')
  @Auth([SystemRoles.ADMIN])
  update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
    return this.couponService.update(id, updateCouponDto);
  }



  @Put('disable-enable/:id')
  @Auth([SystemRoles.ADMIN])
  toggleEnable(@Param('id') id: string, @Body() body: {enable: boolean}) {
    return this.couponService.toggleEnable(id, body.enable);
  }
}
