import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { PageRequest } from 'src/domain/base/pagination.entity';
import { ChildTransactionReportsRepository } from '../repository/child-transaction-reports.repository';
import { ChildTransactionReportsDTO } from './dto/child-transaction-reports.dto';
import { ChildTransactionReportsMapper } from './mapper/child-transaction-reports.mapper';

const relationshipNames = [];
relationshipNames.push('child');

@Injectable()
export class ChildTransactionReportsExtendedService {
  logger = new Logger('ChildTransactionReportsService');

  constructor(@InjectRepository(ChildTransactionReportsRepository) private childTransactionReportsRepository: ChildTransactionReportsRepository) {}
  async save(childTransactionReportsDTO: ChildTransactionReportsDTO, creator?: string): Promise<ChildTransactionReportsDTO | undefined> {
    const entity = ChildTransactionReportsMapper.fromDTOtoEntity(childTransactionReportsDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.childTransactionReportsRepository.save(entity);
    return ChildTransactionReportsMapper.fromEntityToDTO(result);
  }
  async findAndCount(options: FindManyOptions<ChildTransactionReportsDTO>): Promise<[ChildTransactionReportsDTO[], number]> {
    options.relations = [];
    const resultList = await this.childTransactionReportsRepository.findAndCount(options);
    const childTransactionReportsDTO: ChildTransactionReportsDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(childTransactionReports => childTransactionReportsDTO.push(ChildTransactionReportsMapper.fromEntityToDTO(childTransactionReports)));
      resultList[0] = childTransactionReportsDTO;
    }
    return resultList;
  }

  async findById(id: number): Promise<ChildTransactionReportsDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.childTransactionReportsRepository.findOne(id, options);
    return ChildTransactionReportsMapper.fromEntityToDTO(result);
  }
  async deleteById(id: number): Promise<void | undefined> {
    await this.childTransactionReportsRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
  async childTransactionReports(pageRequest: PageRequest, childId: number) {
    const queryBuilder = this.childTransactionReportsRepository
      .createQueryBuilder('child-transaction-reports')
      .where('child-transaction-reports.childId = :childId', { childId });
    if (!isNaN(pageRequest.size) && pageRequest.size > 0) {
      queryBuilder.skip(pageRequest.page * pageRequest.size).take(pageRequest.size);
    }

    const [childTransactionReports, count] = await queryBuilder.getManyAndCount();

    return { childTransactionReports, count };
  }

  async findByFields(options: FindOneOptions<ChildTransactionReportsDTO>): Promise<ChildTransactionReportsDTO | undefined> {
    const result = await this.childTransactionReportsRepository.findOne(options);
    return ChildTransactionReportsMapper.fromEntityToDTO(result);
  }
}
