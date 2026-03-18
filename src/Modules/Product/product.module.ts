import { Module } from '@nestjs/common';
import { ProductService } from './Services/product.service';
import { ProductController } from './Controller/product.controller';
import {
  BrandModel,
  CategoryModel,
  ProductModel,
  SubCategoryModel,
} from 'src/DB/Models';
import { CloudUploadFilesService } from 'src/Common/Services';
import {
  BrandRepository,
  CategoryRepository,
  ProductRepository,
  SubCategoryRepository,
} from 'src/DB/Repositories';
import { CategoryService } from '../Category/Services/category.service';

@Module({
  imports: [ProductModel, CategoryModel, SubCategoryModel, BrandModel],
  controllers: [ProductController],
  providers: [
    ProductService,
    CloudUploadFilesService,
    ProductRepository,
    CategoryService,
    CategoryRepository,
    SubCategoryRepository,
    BrandRepository,
  ],
})
export class ProductModule {}
