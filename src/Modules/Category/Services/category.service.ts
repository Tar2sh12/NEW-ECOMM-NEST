import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { IAuthUser } from 'src/Common/Types';
import { CategoryRepository } from 'src/DB/Repositories';
import { CloudUploadFilesService } from 'src/Common/Services/';
import { nanoid } from 'nanoid';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly cloudUploadFilesService: CloudUploadFilesService,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    loggedInUser: IAuthUser,
    image: Express.Multer.File,
  ) {
    //check if the category name already exists
    const categoryNameExists = await this.categoryRepository.findOne({
      filters: { name: createCategoryDto.name },
    });
    if (categoryNameExists) {
      throw new ConflictException('Category name already exists');
    }

    const category ={
      ...createCategoryDto,
      addedBy: loggedInUser.user._id
    }
    if (image) {
      //create a unique folder in cloudinary for each category using nanoid
      const folderId = nanoid(4);
      //upload the image to cloudinary
      const imageResult = await this.cloudUploadFilesService.uploadFile(
        image.path,
        { folder: `${process.env.CLOUDINARY_UPLOADS_FOLDER}/${folderId}` },
      );
      category['image'] = {
        secure_url: imageResult.secure_url,
        public_id: imageResult.public_id,
      };
      category['folderId'] = folderId;
    }

    //create the category in the database
    return await this.categoryRepository.create(category);
  }

  findAll() {
    return `This action returns all category`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
