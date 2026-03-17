import { Module } from '@nestjs/common';
import { BrandService } from './Service/brand.service';
import { BrandController } from './Controller/brand.controller';

@Module({
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
