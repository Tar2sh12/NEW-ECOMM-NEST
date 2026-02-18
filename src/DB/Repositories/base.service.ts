import {QueryFilter  , Model ,PopulateOptions, Document, UpdateQuery} from 'mongoose';
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

export abstract class BaseService<TDocument extends Document> {

    constructor(protected readonly model: Model<TDocument>) {}


    async save(document: TDocument): Promise<TDocument> {
        return await document.save();
    }
    async create(document: Partial<TDocument>): Promise<TDocument> {
        return await this.model.create(document);
    }

    async findOne({
        filters,
        select='',
        populateArray=[]
    }: IFindOneOption<TDocument>): Promise<TDocument | null> {
        if(filters._id) return await this.model.findById(filters._id,select).populate(populateArray);
        return await this.model.findOne(filters,select).populate(populateArray);
    }

    async find({
        filters={},
        select='',
        populateArray=[]
    }: IFindManyOption<TDocument>): Promise<TDocument[]> {
        return await this.model.find(filters,select).populate(populateArray);
    }

    async deleteOne({ filters }: { filters: QueryFilter<TDocument> }): Promise<TDocument | null> {
        if(filters._id) return await this.model.findByIdAndDelete(filters._id);
        return await this.model.findOneAndDelete(filters);
    }

    async updateOne(
        filters: QueryFilter<TDocument>,
        update: UpdateQuery<TDocument>
    ): Promise<TDocument | null> {
        if(filters._id) return await this.model.findByIdAndUpdate(filters._id, update, { new: true });
        return await this.model.findOneAndUpdate(filters, update, { new: true });
    }
}