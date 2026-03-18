import { Module } from '@nestjs/common';
import { BrandService } from './Service/brand.service';
import { BrandController } from './Controller/brand.controller';
import { BrandModel, CategoryModel, ProductModel, SubCategoryModel } from 'src/DB/Models';
import {
  CategoryRepository,
  SubCategoryRepository,
  BrandRepository,
  ProductRepository,
} from 'src/DB/Repositories';
import { CloudUploadFilesService } from 'src/Common/Services';

@Module({
  imports: [BrandModel, CategoryModel, SubCategoryModel,ProductModel],
  controllers: [BrandController],
  providers: [
    BrandService,
    BrandRepository,
    CategoryRepository,
    SubCategoryRepository,
    CloudUploadFilesService,
    ProductRepository,
  ],
})
export class BrandModule {}
