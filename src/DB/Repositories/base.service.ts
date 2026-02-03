import {QueryFilter  , Model ,PopulateOptions} from 'mongoose';
interface IFindOneOption<TDocument> {
    filters: QueryFilter <TDocument>;
    select?:string,
    populateArray?: PopulateOptions[] 
}
interface IFindManyOption<TDocument> {
    filters?: QueryFilter <TDocument>;
    select?:string,
    populateArray?: PopulateOptions[]
}

export abstract class BaseService<TDocument> {
    constructor(protected readonly model: Model<TDocument>) {}

    async create(document: Partial<TDocument>): Promise<TDocument> {
        return await this.model.create(document);
    }

    async findOne({
        filters,
        select='',
        populateArray=[]
    }: IFindOneOption<TDocument>): Promise<TDocument | null> {
        return await this.model.findOne(filters,select).populate(populateArray);
    }

    async find({
        filters={},
        select='',
        populateArray=[]
    }: IFindManyOption<TDocument>): Promise<TDocument[]> {
        return await this.model.find(filters,select).populate(populateArray);
    }
}