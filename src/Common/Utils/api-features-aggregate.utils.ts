import { Types } from 'mongoose';
import mongoose from 'mongoose';

function isBooleanString(value) {
  if (typeof value !== 'string') return false;
  const lower = value.toLowerCase();
  return lower === 'true' || lower === 'false';
}

function isValidDateString(value) {
  if (typeof value !== 'string') return false;
  const parsed = Date.parse(value);
  return !Number.isNaN(parsed);
}

import { PipelineStage } from 'mongoose';

interface PopulateOption {
  from: string;
  localField: string;
  foreignField: string;
  as: string;
  pipeline?: [];
  let?: any;
  details?: Record<string, any>;
  remove?: Record<string, any>;
}

interface SelectOption {
  [key: string]: 0 | 1;
}

interface PaginationObject {
  page?: number;
  limit?: number;
  skip?: number;
  totalPages?: number;
  totalDocuments?: number;
}

export class ApiAggregateFeature {
  private model: any;
  private query: Record<string, any>;
  private populate: PopulateOption[];
  private filterObject: Record<string, any>;
  private paginationObject: PaginationObject;
  private mongooseQuery: any;
  private pipeline: PipelineStage[];
  private select: SelectOption;

  constructor(
    model: any,
    query: Record<string, any>,
    populate: PopulateOption[],
    select: SelectOption = { __v: 0 },
  ) {
    this.model = model;
    this.query = query;
    this.populate = populate;
    this.filterObject = {};
    this.paginationObject = {};
    this.mongooseQuery = this.model.aggregate([]);
    this.pipeline = [];
    this.select = select;
  }

  // Pagination
  pagination() {
    const { page = 1, limit = 10 } = this.query;
    const skip = (page - 1) * limit;

    this.paginationObject = {
      limit: parseInt(limit),
      skip,
      page: parseInt(page),
    };
    return this;
  }

  // Sorting
  sort() {
    const { sort } = this.query;
    if (sort) {
      const parsedSort = JSON.parse(sort); //for example { createdAt: "-1" }
      let sortObj = {};

      for (const key in parsedSort) {
        const val = parsedSort[key];
        // Convert string "-1"/"1" to number -1/1
        sortObj[key] = typeof val === 'string' ? parseInt(val, 10) : val;
      }

      this.pipeline.push({ $sort: sortObj });
    }
    this.mongooseQuery = this.model.aggregate(this.pipeline);
    return this;
  }

  // Filtering
  // Supports query parameters in the format: field[operator]=value
  // Supported operators:
  //   - eq: equal to (e.g., length[eq]=5)
  //   - gt: greater than (e.g., quantity[gt]=10)
  //   - gte: greater than or equal (e.g., quantity[gte]=10)
  //   - lt: less than (e.g., quantity[lt]=5)
  //   - lte: less than or equal (e.g., quantity[lte]=5)
  //   - regex: regex match for strings (e.g., notes[regex]=search)
  filters() {
    const { page = 1, limit = 2, sort, ...filters } = this.query;

    const filtersAsString = JSON.stringify(filters);
    // Convert operator keys (lt, lte, gt, gte, eq, regex) to MongoDB operators ($lt, $lte, $gt, $gte, $eq, $regex)
    // Example: {"length":{"gt":"5"}} becomes {"length":{"$gt":"5"}}
    // Use quote context to avoid matching operators inside field names like "length"
    // Match operators that appear as keys in JSON: "operator":
    const replacedFilters = filtersAsString.replace(
      /"((?:lt|lte|gt|gte|regex|eq))":/g,
      (match, operator) => `"$${operator}":`,
    );
    let parsedFilters = JSON.parse(replacedFilters);

    // Process filter operators and convert values to appropriate types
    function addRegexOptions(obj) {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          // Add case-insensitive option to regex filters
          if ('$regex' in obj[key]) {
            obj[key]['$options'] = 'i';
          }
          // Convert string comparison values to numbers for numeric operators
          // This ensures proper numeric comparison (e.g., "10" becomes 10 for >, >=, <, <=)
          for (const op of ['$gt', '$gte', '$lt', '$lte']) {
            if (op in obj[key]) {
              const val = obj[key][op];
              if (isValidDateString(val)) {
                obj[key][op] = new Date(val);
              } else if (!isNaN(val)) {
                obj[key][op] = parseFloat(val);
              }
            }
          }
          // Handle $eq operator with type conversion
          // Supports ObjectId, numbers, booleans, and strings
          for (const op of ['$eq']) {
            if (op in obj[key]) {
              const val = obj[key][op];
              // Handle null string as actual null value
              if (val === 'null' || val === null) {
                obj[key][op] = null;
              } else {
                const isValid = Types.ObjectId.isValid(val);
                if (isValid) {
                  obj[key][op] = new mongoose.Types.ObjectId(val);
                } else if (isValidDateString(val)) {
                  obj[key][op] = new Date(val);
                } else if (!isNaN(val)) {
                  // Convert numeric strings to numbers for proper comparison
                  obj[key][op] = parseFloat(val);
                } else if (isBooleanString(val)) {
                  obj[key][op] = val.toLowerCase() === 'true' ? true : false;
                } else {
                  obj[key][op] = val;
                }
              }
            }
          }
          // Recurse for nested objects
          addRegexOptions(obj[key]);
        }
      }
    }

    addRegexOptions(parsedFilters);
    this.filterObject = parsedFilters;

    this.pipeline.push({
      $match: this.filterObject,
    });

    // Create the mongoose query with the filter object
    this.mongooseQuery = this.model.aggregate(this.pipeline);
    return this;
  }
  // Populate fields
  populateFields() {
    if (!this.pipeline) {
      this.pipeline = [];
    }

    if (this.populate && Array.isArray(this.populate)) {
      this.populate.forEach((pop) => {
        if (pop.pipeline) {
          this.pipeline.push({
            $lookup: {
              from: pop.from,
              let: pop.let,
              pipeline: pop.pipeline,
              as: pop.as,
            },
          });
        } else {
          this.pipeline.push({
            $lookup: {
              from: pop.from,
              localField: pop.localField,
              foreignField: pop.foreignField,
              as: pop.as,
            },
          });
        }

        if (pop.details != null || pop.details != undefined) {
          this.pipeline.push({
            $addFields: pop.details,
          });
        }
        if (pop.remove != null || pop.remove != undefined) {
          this.pipeline.push({
            $project: pop.remove,
          });
        }

        this.pipeline.push({
          $unwind: {
            path: `$${pop.as}`,
            preserveNullAndEmptyArrays: true,
          },
        });
      });
    }

    // for deselecting or selecting fields
    if (this.select) {
      this.pipeline.push({
        $project: this.select,
      });
    }
    this.mongooseQuery = this.model.aggregate(this.pipeline);

    return this;
  }

  async execute() {
    const list = await this.model.aggregatePaginate(this.mongooseQuery, {
      ...this.paginationObject,
    });
    return list;
  }
}
