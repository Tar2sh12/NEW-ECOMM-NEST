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
  Res,
  Query,
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
import { Response } from 'express';

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

  @Get('get-all-products')
  async findAll(@Query() query: any, @Res() res: Response) {
    const result = await this.productService.findAll(query);
    return res.status(200).json(result);
  }

  @Get('get-product/:id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.productService.findOne(id);
    return res.status(200).json(result);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return this.productService.update(+id, updateProductDto);
  // }

  @Delete('delete-product/:id')
  @Auth([SystemRoles.ADMIN])
  async remove(@Param('id') id: string, @Res() res: Response) {
    const result = await this.productService.deleteProductById(id);
    return res.status(200).json(result);
  }
}
