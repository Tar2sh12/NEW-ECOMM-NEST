import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseService } from "./base.service";
import { SubCategory,SubCategoryType } from "../Models";
import { Model } from "mongoose";

@Injectable()
export class SubCategoryRepository extends BaseService<SubCategoryType> {
    constructor(@InjectModel(SubCategory.name) private readonly subCategoryModel: Model<SubCategoryType>) {
        super(subCategoryModel);
    }
}