import { Module } from '@nestjs/common';
import { SubCategoryService } from './Services/subcategory.service';
import { SubCategoryController } from './Controllers/subcategory.controller';
import { CategoryRepository, ProductRepository, SubCategoryRepository } from 'src/DB/Repositories';
import { CategoryModel, ProductModel, SubCategoryModel } from 'src/DB/Models';
import { CloudUploadFilesService } from 'src/Common/Services/';

@Module({
  imports: [CategoryModel,ProductModel, SubCategoryModel],
  controllers: [SubCategoryController],
  providers: [SubCategoryService,CategoryRepository,CloudUploadFilesService, ProductRepository,SubCategoryRepository],
})
export class SubCategoryModule {}
