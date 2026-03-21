import { Module } from '@nestjs/common';
import { CartController } from './Controller/cart.controller';
import { CartService } from './Services/cart.service';
import { ProductRepository, CartRepository } from 'src/DB/Repositories';
import { CartModel, ProductModel } from 'src/DB/Models';
import { CloudUploadFilesService } from 'src/Common/Services';

@Module({
  imports: [CartModel, ProductModel],
  controllers: [CartController],
  providers: [CartRepository, ProductRepository, CartService, CloudUploadFilesService],
})
export class CartModule {}
