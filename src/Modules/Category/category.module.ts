import { Module } from '@nestjs/common';
import { CategoryService } from './Services/category.service';
import { CategoryController } from './Controllers/category.controller';
import { CategoryRepository } from 'src/DB/Repositories';
import { CategoryModel } from 'src/DB/Models';
import { CloudUploadFilesService } from 'src/Common/Services/';

@Module({
  imports: [CategoryModel],
  controllers: [CategoryController],
  providers: [CategoryService,CategoryRepository,CloudUploadFilesService],
})
export class CategoryModule {}
