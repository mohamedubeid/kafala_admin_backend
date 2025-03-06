import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ChildPrticipationsDTO } from '../service/dto/child-prticipations.dto';
import { ChildPrticipationsMapper } from '../service/mapper/child-prticipations.mapper';
import { ChildPrticipationsRepository } from '../repository/child-prticipations.repository';

const relationshipNames = [];
relationshipNames.push('child');

@Injectable()
export class ChildPrticipationsService {
  logger = new Logger('ChildPrticipationsService');

  constructor(@InjectRepository(ChildPrticipationsRepository) private childPrticipationsRepository: ChildPrticipationsRepository) {}

  async findById(id: number): Promise<ChildPrticipationsDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.childPrticipationsRepository.findOne(id, options);
    return ChildPrticipationsMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<ChildPrticipationsDTO>): Promise<ChildPrticipationsDTO | undefined> {
    const result = await this.childPrticipationsRepository.findOne(options);
    return ChildPrticipationsMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<ChildPrticipationsDTO>): Promise<[ChildPrticipationsDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.childPrticipationsRepository.findAndCount(options);
    const childPrticipationsDTO: ChildPrticipationsDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(childPrticipations => childPrticipationsDTO.push(ChildPrticipationsMapper.fromEntityToDTO(childPrticipations)));
      resultList[0] = childPrticipationsDTO;
    }
    return resultList;
  }

  async save(childPrticipationsDTO: ChildPrticipationsDTO, creator?: string): Promise<ChildPrticipationsDTO | undefined> {
    const entity = ChildPrticipationsMapper.fromDTOtoEntity(childPrticipationsDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.childPrticipationsRepository.save(entity);
    return ChildPrticipationsMapper.fromEntityToDTO(result);
  }

  async update(childPrticipationsDTO: ChildPrticipationsDTO, updater?: string): Promise<ChildPrticipationsDTO | undefined> {
    const entity = ChildPrticipationsMapper.fromDTOtoEntity(childPrticipationsDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.childPrticipationsRepository.save(entity);
    return ChildPrticipationsMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.childPrticipationsRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
