import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { IAuthUser } from 'src/Common/Types';
import { CategoryRepository } from 'src/DB/Repositories';
import { CloudUploadFilesService } from 'src/Common/Services/';
import { nanoid } from 'nanoid';
import slugify from 'slugify';

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

    const category = {
      ...createCategoryDto,
      addedBy: loggedInUser.user._id,
    };
    if (image) {
      //create a unique folder in cloudinary for each category using nanoid
      const folderId = nanoid(4);
      //upload the image to cloudinary
      const imageResult = await this.cloudUploadFilesService.uploadFile(
        image.path,
        {
          folder: `${process.env.CLOUDINARY_UPLOADS_FOLDER}/Categories/${folderId}`,
        },
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

  async findAll(query:any) {
    const result = await this.categoryRepository.findByAggregate([], query);
    return result;
  }

  async getCategoryById(id: string) {
    return await this.categoryRepository.findOne({
      filters: { _id: id },
    });
  }

  async updateCategory({ name, categoryId, loggedInUser, image }) {

    //console.log(name);
    //check if the category exists
    const category = await this.getCategoryById(categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // in case of updating category name
    if (name) {
      //check if the category name already exists
      const categoryNameExists = await this.categoryRepository.findOne({
        filters: { name },
      });
      if (categoryNameExists) {
        throw new ConflictException('Category name already exists');
      }
      category.name = name;
      category.slug= slugify(name);
    }

    if (image) {
      //1st solution override the existing image in cloudinary with the new one using the same public_id
      const oldPublicId = category.image['public_id'].split(
        `${category.folderId}/`,
      )[1];
      const imageResult = await this.cloudUploadFilesService.uploadFile(image.path, {
        folder: `${process.env.CLOUDINARY_UPLOADS_FOLDER}/Categories/${category.folderId}`,
        public_id: oldPublicId // override the existing image with the new one
      });

      category.image['secure_url']=imageResult.secure_url;


       //2nd solution delete the old image from cloudinary and upload the new one
      // await this.cloudUploadFilesService.deleteFileByPublicId(category.image['public_id']);
      // const imageResult2 = await this.cloudUploadFilesService.uploadFile(image.path, {
      //   folder: `${process.env.CLOUDINARY_UPLOADS_FOLDER}/Categories/${category.folderId}`,
      // });
      // category.image=imageResult2;
    }


    category.updatedBy = loggedInUser.user._id;
    const updatedCategory = await this.categoryRepository.save(category);
    return updatedCategory;
  }

  async deleteCategoryById(id: string) {
    return await this.categoryRepository.deleteCategoryById(id);
  }
}
