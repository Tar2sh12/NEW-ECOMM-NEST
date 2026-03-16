import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { IAuthUser } from 'src/Common/Types';
import { ProductRepository } from 'src/DB/Repositories/product.repository';
import { CloudUploadFilesService } from 'src/Common/Services';
import { CategoryService } from 'src/Modules/Category/Services/category.service';
import { nanoid } from 'nanoid';

export interface CreateProductServiceParams {
  createProductDto: CreateProductDto;
  authUser: IAuthUser;
  images: Express.Multer.File[];
}

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly cloudUploadFilesService: CloudUploadFilesService,
    private readonly categoryService: CategoryService,
  ) {}

  async create({
    createProductDto,
    authUser,
    images,
  }: CreateProductServiceParams) {
    const addedBy = authUser.user._id;
    const { title, description, basePrice, discount, stock, categoryId } =
      createProductDto;

    //check if the category exists
    const category = await this.categoryService.getCategoryById(categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const productObject = {
      title,
      description,
      basePrice,
      discount,
      stock,
      categoryId: category._id,
      addedBy,
    };

    if (!images?.length)
      throw new BadRequestException('At least one product image is required');

    const folderId = nanoid(4);
    const folderUrl = `${process.env.CLOUDINARY_UPLOADS_FOLDER}/Categories/${category.folderId}/Products/${folderId}`;
    const paths = images.map((image) => image.path);
    productObject['images'] = await this.cloudUploadFilesService.uploadFiles(
      paths,
      {
        folder: folderUrl,
      },
    );

    productObject['folderId'] = folderId;

    console.log(productObject);
    

    return await this.productRepository.create(productObject);
  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
