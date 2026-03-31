import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Res,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { BrandService } from '../Service/brand.service';
import { CreateBrandDto } from '../dto/create-brand.dto';
import { UpdateBrandDto } from '../dto/update-brand.dto';
import { IAuthUser, SystemRoles } from 'src/Common/Types';
import { Auth } from 'src/Common/Guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileOptions } from 'src/Common/Utils';
import { ImageMimeTypes } from 'src/Common/Constants/constants';
import { User } from 'src/Common/Decorators';
import { Response } from 'express';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}


  @Post('create')
  @Auth([SystemRoles.ADMIN])
  @UseInterceptors(
    FileInterceptor(
      'logo',
      UploadFileOptions({
        path: 'Brands',
        allowedFileTypes: ImageMimeTypes,
      }),
    ),
  )
  async create(
    @Body() createBrandDto: CreateBrandDto,
    @User() loggedInUser: IAuthUser,
    @Res() res: Response,
    @UploadedFile() logo?: Express.Multer.File,
  ) {
    const result = await this.brandService.create(
      createBrandDto,
      loggedInUser,
      logo,
    );
    return res.status(201).json(result);
  }

  @Get('get-all-brands')
  async findAll(@Query() query: any, @Res() res: Response) {
    const result = await this.brandService.findAll(query);
    return res.status(200).json(result);
  }

  @Get('get-brand/:id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result= await this.brandService.getBrandById(id);
    return res.status(200).json(result);
  }

  // @Patch(':id')
  // async update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto, @Res() res: Response) {
  //   return this.brandService.update(+id, updateBrandDto);
  // }

  @Delete('delete-brand/:id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const result = await this.brandService.deleteBrandById(id);
    return res.status(200).json(result);
  }
}
