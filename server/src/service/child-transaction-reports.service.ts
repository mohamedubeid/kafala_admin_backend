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

  async childTransactions(childId: number): Promise<{ childTransactionReports: ChildTransactionReportsDTO[]; count: number }> {
    const queryBuilder = this.childTransactionReportsRepository
      .createQueryBuilder('child-transaction-report')
      .leftJoinAndSelect('child-transaction-report.child', 'child')
      .where('child-transaction-report.childId = :childId', { childId })
      .andWhere("child-transaction-report.status = 'APPROVED'");
    const [childTransactionReports, count] = await queryBuilder.getManyAndCount();
    return { childTransactionReports, count };
  }

  async childTransactionReports(
    pageRequest: PageRequest, 
    childId: number,
    dateFrom?: string,
    dateTo?: string,
    status?: 'PENDING' | 'APPROVED' | 'REJECTED'
  ) {
    const queryBuilder = this.childTransactionReportsRepository
      .createQueryBuilder('child-transaction-report')
      .where('child-transaction-report.childId = :childId', { childId });
    if (!isNaN(pageRequest.size) && pageRequest.size > 0) {
      queryBuilder.skip(pageRequest.page * pageRequest.size).take(pageRequest.size);
    }
    if (status) {
      queryBuilder.andWhere('child-transaction-report.status = :status', { status });
    }
    if (dateFrom && !isNaN(new Date(dateFrom).getTime())) {
      const start = new Date(dateFrom);
      start.setHours(0, 0, 0, 0);
      queryBuilder.andWhere('child-transaction-report.createdDate >= :dateFrom', { dateFrom: start });
    }

    if (dateTo && !isNaN(new Date(dateTo).getTime())) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      queryBuilder.andWhere('child-transaction-report.createdDate <= :dateTo', { dateTo: end });
    }
    const [childTransactionReports, count] = await queryBuilder.getManyAndCount();

    return { childTransactionReports, count };
  }

  async transactionReports(
    pageRequest: PageRequest, 
  ) {
    const queryBuilder = this.childTransactionReportsRepository
      .createQueryBuilder('child-transaction-report')
      .orderBy('child-transaction-report.id', 'DESC')
      .where("child-transaction-report.status = 'APPROVED'");
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
