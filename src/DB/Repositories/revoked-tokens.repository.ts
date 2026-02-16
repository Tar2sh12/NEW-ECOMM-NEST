import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseService } from "./base.service";
import { RevokedTokens,RevokedTokensType } from "../Models";
import { Model } from "mongoose";

@Injectable()
export class RevokedTokensRepository extends BaseService<RevokedTokensType> {
    constructor(@InjectModel(RevokedTokens.name) private readonly revokedTokensModel: Model<RevokedTokensType>) {
        super(revokedTokensModel);
    }
}