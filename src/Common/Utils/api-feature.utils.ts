import { Injectable } from '@nestjs/common';
import mongoose, { Model, Types } from 'mongoose';

function isValidDateString(value: any): boolean {
  if (typeof value !== 'string') return false;
  const parsed = Date.parse(value);
  return !Number.isNaN(parsed);
}

function isBooleanString(value: any): boolean {
  if (typeof value !== 'string') return false;
  const lower = value.toLowerCase();
  return lower === 'true' || lower === 'false';
}

export class ApiFeatures {
  private filterObject: any = {};
  private paginationObject: any = {};
  private mongooseQuery: any;
  
  constructor(
    private readonly model: any,
    private readonly query: any,
    private readonly populate: any[] = [],
    private readonly select?: string,
  ) {}

  // ================= PAGINATION =================
  pagination() {
    const { page = 1, limit = 10 } = this.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const skip = (pageNumber - 1) * limitNumber;

    this.paginationObject = {
      limit: limitNumber,
      skip,
      page: pageNumber,
      select: this.select || '-__v -createdAt -updatedAt',
    };

    this.applyQuery();
    return this;
  }

  // ================= SORT =================
  sort() {
    const { sort } = this.query;

    if (sort) {
      this.paginationObject.sort =
        typeof sort === 'string' ? JSON.parse(sort) : sort;
    }

    this.applyQuery();
    return this;
  }

  // ================= FILTER =================
  filters() {
    const { page, limit, sort, ...filters } = this.query;

    const filtersAsString = JSON.stringify(filters);

    const replacedFilters = filtersAsString.replace(
      /"((?:lt|lte|gt|gte|regex|eq))":/g,
      (_, operator) => `"$${operator}":`,
    );

    let parsedFilters = JSON.parse(replacedFilters);

    const processFilters = (obj: any) => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          // regex options
          if ('$regex' in obj[key]) {
            obj[key]['$options'] = 'i';
          }

          // eq handling
          if ('$eq' in obj[key]) {
            const val = obj[key]['$eq'];

            if (val === 'null' || val === null) {
              obj[key]['$eq'] = null;
            } else if (Types.ObjectId.isValid(val)) {
              obj[key]['$eq'] = new mongoose.Types.ObjectId(val);
            } else if (isValidDateString(val)) {
              obj[key]['$eq'] = new Date(val);
            } else if (!isNaN(val)) {
              obj[key]['$eq'] = parseFloat(val);
            } else if (isBooleanString(val)) {
              obj[key]['$eq'] = val.toLowerCase() === 'true';
            } else {
              obj[key]['$eq'] = val;
            }
          }

          processFilters(obj[key]); // recursion
        }
      }
    };

    processFilters(parsedFilters);

    this.filterObject = parsedFilters;

    this.applyQuery();
    return this;
  }

  // ================= POPULATE =================
  populateFields() {
    this.applyQuery();
    return this;
  }

  // ================= APPLY QUERY =================
  private applyQuery() {
    this.mongooseQuery = this.model.paginate(this.filterObject, {
      ...this.paginationObject,
      populate: this.populate,
    });

    return this;
  }

  // ================= EXECUTE =================
  async exec() {
    return await this.mongooseQuery;
  }
}