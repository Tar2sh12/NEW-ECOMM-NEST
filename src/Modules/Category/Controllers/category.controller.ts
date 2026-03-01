import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseInterceptors,
  UploadedFile,
  //UploadedFiles,
} from '@nestjs/common';
import { CategoryService } from '../Services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { User } from 'src/Common/Decorators/User-data.custom.decorator';
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

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  @Auth([SystemRoles.ADMIN])
  @UseInterceptors(
    FileInterceptor(
      'image',
      UploadFileOptions({
        path: 'Categories',
        allowedFileTypes: ImageMimeTypes,
      }),
    ),
  )
  //@UseInterceptors(FilesInterceptor('image', 2,UploadFileOptions({path:'Categories', allowedFileTypes:ImageMimeTypes})))
  //@UseInterceptors(FileFieldsInterceptor([{name:"image",maxCount:2}],UploadFileOptions({path:'Categories', allowedFileTypes:ImageMimeTypes})))
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @User() loggedInUser: IAuthUser,
    @Res() res: Response,
    @UploadedFile() image?: Express.Multer.File,
    //@UploadedFiles() images: Express.Multer.File[]
  ) {
    console.log(createCategoryDto);
    console.log(image);
    const result = await this.categoryService.create(
      createCategoryDto,
      loggedInUser,
      image,
    );
    return res.status(201).json(result);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
