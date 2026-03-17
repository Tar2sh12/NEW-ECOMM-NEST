import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseService } from "./base.service";
import { Category,CategoryType } from "../Models";
import { Model } from "mongoose";
import { ProductRepository } from "./product.repository";
import { CloudUploadFilesService } from "src/Common/Services";

@Injectable()
export class CategoryRepository extends BaseService<CategoryType> {
    constructor(@InjectModel(Category.name) private readonly categoryModel: Model<CategoryType>,
    private readonly productRepository: ProductRepository,
    private readonly cloudUploadFilesService: CloudUploadFilesService
) {
        super(categoryModel);
    }

    async deleteCategoryById(id: string) : Promise<CategoryType> {
        const deletedCategory = await this.categoryModel.findByIdAndDelete(id);

        if(!deletedCategory) throw new NotFoundException('Category not found');

        const products = await this.productRepository.deleteMany({filters: {categoryId: deletedCategory._id}});

        if(deletedCategory.image){
            await this.cloudUploadFilesService.deleteFolderByFolderPrefix(`${process.env.CLOUDINARY_UPLOADS_FOLDER}/Categories/${deletedCategory.folderId}`);
        }

        return deletedCategory;
    }
}