import { Module } from '@nestjs/common';
import { SubCategoryService } from './Services/subcategory.service';
import { SubCategoryController } from './Controllers/subcategory.controller';
import {
  BrandRepository,
  CategoryRepository,
  ProductRepository,
  SubCategoryRepository,
} from 'src/DB/Repositories';
import {
  BrandModel,
  CategoryModel,
  ProductModel,
  SubCategoryModel,
} from 'src/DB/Models';
import { CloudUploadFilesService } from 'src/Common/Services/';

@Module({
  imports: [CategoryModel, ProductModel, SubCategoryModel, BrandModel],
  controllers: [SubCategoryController],
  providers: [
    SubCategoryService,
    CategoryRepository,
    CloudUploadFilesService,
    ProductRepository,
    SubCategoryRepository,
    BrandRepository,
  ],
})
export class SubCategoryModule {}
