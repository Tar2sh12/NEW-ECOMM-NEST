import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubCategoryDto } from '../dto/create-subcategory.dto';
import { UpdateSubCategoryDto } from '../dto/update-subcategory.dto';
import { IAuthUser } from 'src/Common/Types';
import { CategoryRepository, SubCategoryRepository } from 'src/DB/Repositories';
import { CloudUploadFilesService } from 'src/Common/Services/';
import { nanoid } from 'nanoid';
import slugify from 'slugify';

@Injectable()
export class SubCategoryService {
  constructor(
    private readonly subCategoryRepository: SubCategoryRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly cloudUploadFilesService: CloudUploadFilesService,
  ) {}

  async create(
    createSubCategoryDto: CreateSubCategoryDto,
    loggedInUser: IAuthUser,
    image: Express.Multer.File,
  ) {
    //check if the category name already exists
    const subcategoryNameExists = await this.subCategoryRepository.findOne({
      filters: { name: createSubCategoryDto.name },
    });
    if (subcategoryNameExists) {
      throw new ConflictException('Category name already exists');
    }

    const categoryExists = await this.categoryRepository.findOne({
      filters: { _id: createSubCategoryDto.categoryId },
    });
    if (!categoryExists) {
      throw new NotFoundException('Category not found');
    }
    const subcategory = {
      ...createSubCategoryDto,
      addedBy: loggedInUser.user._id,
      categoryId: categoryExists._id,
    };
    if (image) {
      //create a unique folder in cloudinary for each category using nanoid
      const folderId = nanoid(4);
      //upload the image to cloudinary
      const imageResult = await this.cloudUploadFilesService.uploadFile(
        image.path,
        {
          folder: `${process.env.CLOUDINARY_UPLOADS_FOLDER}/Categories/${categoryExists.folderId}/SubCategories/${folderId}`,
        },
      );
      subcategory['image'] = {
        secure_url: imageResult.secure_url,
        public_id: imageResult.public_id,
      };
      subcategory['folderId'] = folderId;
    }

    //create the subcategory in the database
    return await this.subCategoryRepository.create(subcategory);
  }

  findAll() {
    return `This action returns all subcategories`;
  }

  async getSubCategoryById(id: string) {
    return await this.subCategoryRepository.findOne({
      filters: { _id: id },
      populateArray: [{path:'categoryId', select:'_id name folderId'}]
    });
  }

  async updateSubCategory({ name, subcategoryId, loggedInUser, image }) {
    const subcategory = await this.getSubCategoryById(subcategoryId);
    if (!subcategory) {
      throw new NotFoundException('SubCategory not found');
    }

    // in case of updating category name
    if (name) {
      //check if the category name already exists
      const subcategoryNameExists = await this.subCategoryRepository.findOne({
        filters: { name },
        
      });
      if (subcategoryNameExists) {
        throw new ConflictException('SubCategory name already exists');
      }
      subcategory.name = name;
      subcategory.slug= slugify(name);
    }

    if (image) {
      //1st solution override the existing image in cloudinary with the new one using the same public_id
      const oldPublicId = subcategory.image['public_id'].split(
        `${subcategory.folderId}/`,
      )[1];
      
      const imageResult = await this.cloudUploadFilesService.uploadFile(image.path, {
        folder: `${process.env.CLOUDINARY_UPLOADS_FOLDER}/Categories/${subcategory.categoryId['folderId']}/SubCategories/${subcategory.folderId}`,
        public_id: oldPublicId // override the existing image with the new one
      });

      subcategory.image['secure_url']=imageResult.secure_url;
    }


    subcategory.updatedBy = loggedInUser.user._id;
    const updatedSubCategory = await this.subCategoryRepository.save(subcategory);
    return updatedSubCategory;
  }

  // async deleteSubCategoryById(id: string) {
  //   return await this.subCategoryRepository.deleteSubCategoryById(id);
  // }
}
