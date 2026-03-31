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
  Put,
  Query,
  //UploadedFiles,
} from '@nestjs/common';
import { CategoryService } from '../Services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
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
    // console.log(createCategoryDto);
    // console.log(image);
    const result = await this.categoryService.create(
      createCategoryDto,
      loggedInUser,
      image,
    );
    return res.status(201).json(result);
  }

  @Get('get-all-categories')
  async findAll(
    @Res() res: Response,
    @Query() query: any,
  ) {
    const result =await  this.categoryService.findAll(query);
    return res.status(200).json(result);
  }

  @Get('get-category/:id')
  @Auth([SystemRoles.ADMIN, SystemRoles.USER])
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.categoryService.getCategoryById(id);
    return res.status(200).json(result);
  }

  @Put('update/:categoryId')
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
  async update(
    @Param('categoryId') categoryId: string,
    @Body() { name }: { name: string },
    @User() loggedInUser: IAuthUser,
    @Res() res: Response,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const result = await this.categoryService.updateCategory({
      name,
      categoryId,
      loggedInUser,
      image,
    });

    return res.status(200).json(result);
  }

  @Delete('delete-category/:id')
  @Auth([SystemRoles.ADMIN])
  remove(@Param('id') id: string) {
    return this.categoryService.deleteCategoryById(id);
  }
}
