import { Module } from '@nestjs/common';
import { CategoryService } from './Services/category.service';
import { CategoryController } from './Controllers/category.controller';
import { CategoryRepository, ProductRepository } from 'src/DB/Repositories';
import { CategoryModel, ProductModel } from 'src/DB/Models';
import { CloudUploadFilesService } from 'src/Common/Services/';

@Module({
  imports: [CategoryModel,ProductModel],
  controllers: [CategoryController],
  providers: [CategoryService,CategoryRepository,CloudUploadFilesService, ProductRepository],
})
export class CategoryModule {}
