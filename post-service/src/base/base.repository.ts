import { EventEmitter } from 'events';

import { classToPlain } from 'class-transformer';
import { IPaginationMeta, IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import {
  DeepPartial,
  DeleteResult,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  Repository,
  SelectQueryBuilder,
  UpdateResult
} from 'typeorm';

import { LIMIT } from 'src/constants/base.constant';
import { BaseTable } from './base.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class BaseRepository<Model extends BaseTable> extends EventEmitter {
  constructor(protected readonly model: Repository<Model>) {
    super();
    this.model = model;
  }

  async create(entity: DeepPartial<Model>): Promise<Model> {
    return classToPlain(await this.model.save(entity)) as Model;
  }

  async createMultipleEntities(entities?: DeepPartial<Model>[]): Promise<Array<Model>> {
    return classToPlain(await this.model.save(entities)) as Array<Model>;
  }

  async findById(id: number, opts?: FindOneOptions<Model>): Promise<Model> {
    return classToPlain(await this.model.findOne(id, { ...opts })) as Model;
  }

  async findRaw(options: FindOneOptions<Model>): Promise<Model> {
    return await this.model.findOne(options);
  }

  async findOneRaw(conditions: FindConditions<Model>, options?: FindOneOptions<Model>): Promise<Model> {
    return this.findRaw({ where: conditions, ...options });
  }

  async findOne(conditions: FindConditions<Model>, options?: FindOneOptions<Model>): Promise<Model> {
    return classToPlain(this.findOneRaw(conditions, options)) as Model;
  }

  async findByIds(ids: any[], options?: FindManyOptions<Model>): Promise<Model[]> {
    return classToPlain(await this.model.findByIds(ids, options)) as Model[];
  }

  async findAndCount(options?: FindManyOptions<Model>): Promise<[Model[], number]> {
    const [items, count] = await this.model.findAndCount(options);
    return [classToPlain(items) as Model[], count];
  }

  async count(options?: FindManyOptions<Model>): Promise<Number> {
    const count = await this.model.count(options);
    return classToPlain(count) as Number;
  }

  async find(conditions: FindConditions<Model>, options?: FindManyOptions<Model>): Promise<Model[]> {
    return classToPlain(await this.model.find({ where: conditions, ...options })) as Model[];
  }

  async findWithPagination(
    conditions: FindConditions<Model>,
    options?: FindManyOptions<Model>,
  ): Promise<{ totalPage: number; payload: Model[] }> {
    const results = classToPlain(await this.model.findAndCount({ where: conditions, ...options }));
    return {
      totalPage: Math.ceil(results[1] / (options.take ?? LIMIT)),
      payload: results[0],
    };
  }

  async updateItem(entity: DeepPartial<Model>): Promise<Model> {
    return classToPlain(await this.model.save(entity)) as Model;
  }
  async update(id: number, entity: QueryDeepPartialEntity<Model>): Promise<Model> {
    return classToPlain(await this.model.update(id, entity)) as Model;
  }
  merge(oldEntity: Model, entity: DeepPartial<Model>): Model {
    return classToPlain(this.model.merge(oldEntity, entity)) as Model;
  }
  async preload(entity: DeepPartial<Model>): Promise<Model> {
    return classToPlain(await this.model.preload(entity)) as Model;
  }
  async save(entity: DeepPartial<Model>): Promise<Model> {
    return classToPlain(await this.model.save(entity)) as Model;
  }

  async removeItem(
    criteria: string | string[] | number | number[] | Date | Date[] | FindConditions<Model>,
  ): Promise<DeleteResult> {
    return this.model.delete(criteria);
  }

  async softDeleteItem(entity: FindConditions<Model>): Promise<UpdateResult> {
    return this.model.softDelete(entity);
  }

  async paginationRepository(
    repository: Repository<Model>,
    options: IPaginationOptions,
    searchOptions?: FindConditions<Model> | FindManyOptions<Model>,
  ): Promise<Pagination<Model, IPaginationMeta>> {
    const pgResult = await paginate(repository, options, searchOptions);
    return {
      ...pgResult,
      items: classToPlain(pgResult.items) as any,
    };
  }

  async paginationQueryBuilder(
    queryBuilder: SelectQueryBuilder<Model>,
    options: IPaginationOptions,
  ): Promise<Pagination<Model, IPaginationMeta>> {
    const pgResult = await paginate(queryBuilder, options);
    return {
      ...pgResult,
      items: classToPlain(pgResult.items) as any,
    };
  }

  getModel(): Repository<Model> {
    return this.model;
  }
}