import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ChildHealthNotesDTO } from '../service/dto/child-health-notes.dto';
import { ChildHealthNotesMapper } from '../service/mapper/child-health-notes.mapper';
import { ChildHealthNotesRepository } from '../repository/child-health-notes.repository';

const relationshipNames = [];
relationshipNames.push('childHealthStatus');

@Injectable()
export class ChildHealthNotesService {
  logger = new Logger('ChildHealthNotesService');

  constructor(@InjectRepository(ChildHealthNotesRepository) private childHealthNotesRepository: ChildHealthNotesRepository) {}

  async findById(id: number): Promise<ChildHealthNotesDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.childHealthNotesRepository.findOne(id, options);
    return ChildHealthNotesMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<ChildHealthNotesDTO>): Promise<ChildHealthNotesDTO | undefined> {
    const result = await this.childHealthNotesRepository.findOne(options);
    return ChildHealthNotesMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<ChildHealthNotesDTO>): Promise<[ChildHealthNotesDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.childHealthNotesRepository.findAndCount(options);
    const childHealthNotesDTO: ChildHealthNotesDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(childHealthNotes => childHealthNotesDTO.push(ChildHealthNotesMapper.fromEntityToDTO(childHealthNotes)));
      resultList[0] = childHealthNotesDTO;
    }
    return resultList;
  }

  async save(childHealthNotesDTO: ChildHealthNotesDTO, creator?: string): Promise<ChildHealthNotesDTO | undefined> {
    const entity = ChildHealthNotesMapper.fromDTOtoEntity(childHealthNotesDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.childHealthNotesRepository.save(entity);
    return ChildHealthNotesMapper.fromEntityToDTO(result);
  }

  async update(childHealthNotesDTO: ChildHealthNotesDTO, updater?: string): Promise<ChildHealthNotesDTO | undefined> {
    const entity = ChildHealthNotesMapper.fromDTOtoEntity(childHealthNotesDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.childHealthNotesRepository.save(entity);
    return ChildHealthNotesMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.childHealthNotesRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
