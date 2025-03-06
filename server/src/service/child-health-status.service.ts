import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ChildHealthStatusDTO } from '../service/dto/child-health-status.dto';
import { ChildHealthStatusMapper } from '../service/mapper/child-health-status.mapper';
import { ChildHealthStatusRepository } from '../repository/child-health-status.repository';

const relationshipNames = [];

@Injectable()
export class ChildHealthStatusService {
  logger = new Logger('ChildHealthStatusService');

  constructor(@InjectRepository(ChildHealthStatusRepository) private childHealthStatusRepository: ChildHealthStatusRepository) {}

  async findById(id: number): Promise<ChildHealthStatusDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.childHealthStatusRepository.findOne(id, options);
    return ChildHealthStatusMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<ChildHealthStatusDTO>): Promise<ChildHealthStatusDTO | undefined> {
    const result = await this.childHealthStatusRepository.findOne(options);
    return ChildHealthStatusMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<ChildHealthStatusDTO>): Promise<[ChildHealthStatusDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.childHealthStatusRepository.findAndCount(options);
    const childHealthStatusDTO: ChildHealthStatusDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(childHealthStatus => childHealthStatusDTO.push(ChildHealthStatusMapper.fromEntityToDTO(childHealthStatus)));
      resultList[0] = childHealthStatusDTO;
    }
    return resultList;
  }

  async save(childHealthStatusDTO: ChildHealthStatusDTO, creator?: string): Promise<ChildHealthStatusDTO | undefined> {
    const entity = ChildHealthStatusMapper.fromDTOtoEntity(childHealthStatusDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.childHealthStatusRepository.save(entity);
    return ChildHealthStatusMapper.fromEntityToDTO(result);
  }

  async update(childHealthStatusDTO: ChildHealthStatusDTO, updater?: string): Promise<ChildHealthStatusDTO | undefined> {
    const entity = ChildHealthStatusMapper.fromDTOtoEntity(childHealthStatusDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.childHealthStatusRepository.save(entity);
    return ChildHealthStatusMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.childHealthStatusRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
