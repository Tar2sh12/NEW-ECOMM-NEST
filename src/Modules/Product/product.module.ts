import { Module } from '@nestjs/common';
import { ProductService } from './Services/product.service';
import { ProductController } from './Controller/product.controller';
import { CategoryModel, ProductModel } from 'src/DB/Models';
import { CloudUploadFilesService } from 'src/Common/Services';
import {  CategoryRepository, ProductRepository } from 'src/DB/Repositories';
import { CategoryService } from '../Category/Services/category.service';

@Module({
  imports: [ProductModel,CategoryModel],
  controllers: [ProductController],
  providers: [ProductService,CloudUploadFilesService,ProductRepository,CategoryService,CategoryRepository],
})
export class ProductModule {}
