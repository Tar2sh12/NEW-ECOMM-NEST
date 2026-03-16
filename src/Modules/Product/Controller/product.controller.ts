import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProductService } from '../Services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Auth } from 'src/Common/Guards';
import { IAuthUser, SystemRoles } from 'src/Common/Types';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadFileOptions } from 'src/Common/Utils';
import { ImageMimeTypes } from 'src/Common/Constants/constants';
import { User } from 'src/Common/Decorators/User-data.custom.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @Auth([SystemRoles.ADMIN])
  @UseInterceptors(
    FilesInterceptor(
      'images',
      3,
      UploadFileOptions({ path: 'product', allowedFileTypes: ImageMimeTypes }),
    ),
  )
  create(
    @Body() createProductDto: CreateProductDto,
    @User() authUser: IAuthUser,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.productService.create({ createProductDto, authUser, images });
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
