import { Module } from '@nestjs/common';
import { CategoryService } from './Services/category.service';
import { CategoryController } from './Controllers/category.controller';
import { BrandRepository, CategoryRepository, ProductRepository, SubCategoryRepository } from 'src/DB/Repositories';
import { BrandModel, CategoryModel, ProductModel, SubCategoryModel } from 'src/DB/Models';
import { CloudUploadFilesService } from 'src/Common/Services/';

@Module({
  imports: [CategoryModel,ProductModel, SubCategoryModel,BrandModel],
  controllers: [CategoryController],
  providers: [CategoryService,CategoryRepository,CloudUploadFilesService, ProductRepository , SubCategoryRepository, BrandRepository],
})
export class CategoryModule {}
