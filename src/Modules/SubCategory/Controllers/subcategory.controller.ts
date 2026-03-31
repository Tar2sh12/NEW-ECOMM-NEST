import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Res,
  UseInterceptors,
  UploadedFile,
  Put,
  Delete,
  Query,
  //UploadedFiles,
} from '@nestjs/common';
import {  SubCategoryService } from '../Services/subcategory.service';
import { CreateSubCategoryDto } from '../dto/create-subcategory.dto';
// import { UpdateSubCategoryDto } from '../dto/update-subcategory.dto';
import { User } from 'src/Common/Decorators';
import { IAuthUser, SystemRoles } from 'src/Common/Types';
import { Auth } from 'src/Common/Guards';
import { Response } from 'express';
import {
  //FileFieldsInterceptor,
  FileInterceptor,
  //FilesInterceptor,
} from '@nestjs/platform-express';
import { UploadFileOptions } from 'src/Common/Utils';
import { ImageMimeTypes } from 'src/Common/Constants/constants';

@Controller('subcategory')
export class SubCategoryController {
  constructor(private readonly subcategoryService: SubCategoryService) {}

  @Post('create')
  @Auth([SystemRoles.ADMIN])
  @UseInterceptors(
    FileInterceptor(
      'image',
      UploadFileOptions({
        path: 'SubCategories',
        allowedFileTypes: ImageMimeTypes,
      }),
    ),
  )
  async create(
    @Body() createSubCategoryDto: CreateSubCategoryDto,
    @User() loggedInUser: IAuthUser,
    @Res() res: Response,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const result = await this.subcategoryService.create(
      createSubCategoryDto,
      loggedInUser,
      image,
    );
    return res.status(201).json(result);
  }

  @Get('get-all-subcategories')
  async findAll(@Query() query: any, @Res() res: Response) {
    const result = await this.subcategoryService.findAll(query);
    return res.status(200).json(result);
  }

  @Get('get-subcategory/:id')
  @Auth([SystemRoles.ADMIN, SystemRoles.USER])
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.subcategoryService.getSubCategoryById(id);
    return res.status(200).json(result);
  }

  @Put('update/:subcategoryId')
  @Auth([SystemRoles.ADMIN])
  @UseInterceptors(
    FileInterceptor(
      'image',
      UploadFileOptions({
        path: 'SubCategories',
        allowedFileTypes: ImageMimeTypes,
      }),
    ),
  )
  async update(
    @Param('subcategoryId') subcategoryId: string,
    @Body() { name }: { name: string },
    @User() loggedInUser: IAuthUser,
    @Res() res: Response,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const result = await this.subcategoryService.updateSubCategory({
      name,
      subcategoryId: subcategoryId,
      loggedInUser,
      image,
    });

    return res.status(200).json(result);
  }

  @Delete('delete-subcategory/:id')
  @Auth([SystemRoles.ADMIN])
  async remove(@Param('id') id: string, @Res() res: Response) {
    const result = await this.subcategoryService.deleteSubCategoryById(id);
    return res.status(200).json(result);
  }
}
