import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ChildEducationStatusDTO } from '../service/dto/child-education-status.dto';
import { ChildEducationStatusMapper } from '../service/mapper/child-education-status.mapper';
import { ChildEducationStatusRepository } from '../repository/child-education-status.repository';

const relationshipNames = [];

@Injectable()
export class ChildEducationStatusService {
  logger = new Logger('ChildEducationStatusService');

  constructor(@InjectRepository(ChildEducationStatusRepository) private childEducationStatusRepository: ChildEducationStatusRepository) {}

  async findById(id: number): Promise<ChildEducationStatusDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.childEducationStatusRepository.findOne(id, options);
    return ChildEducationStatusMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<ChildEducationStatusDTO>): Promise<ChildEducationStatusDTO | undefined> {
    const result = await this.childEducationStatusRepository.findOne(options);
    return ChildEducationStatusMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<ChildEducationStatusDTO>): Promise<[ChildEducationStatusDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.childEducationStatusRepository.findAndCount(options);
    const childEducationStatusDTO: ChildEducationStatusDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(childEducationStatus =>
        childEducationStatusDTO.push(ChildEducationStatusMapper.fromEntityToDTO(childEducationStatus)),
      );
      resultList[0] = childEducationStatusDTO;
    }
    return resultList;
  }

  async save(childEducationStatusDTO: ChildEducationStatusDTO, creator?: string): Promise<ChildEducationStatusDTO | undefined> {
    const entity = ChildEducationStatusMapper.fromDTOtoEntity(childEducationStatusDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.childEducationStatusRepository.save(entity);
    return ChildEducationStatusMapper.fromEntityToDTO(result);
  }

  async update(childEducationStatusDTO: ChildEducationStatusDTO, updater?: string): Promise<ChildEducationStatusDTO | undefined> {
    const entity = ChildEducationStatusMapper.fromDTOtoEntity(childEducationStatusDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.childEducationStatusRepository.save(entity);
    return ChildEducationStatusMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.childEducationStatusRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
