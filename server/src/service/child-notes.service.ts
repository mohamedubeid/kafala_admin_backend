import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ChildNotesDTO } from '../service/dto/child-notes.dto';
import { ChildNotesMapper } from '../service/mapper/child-notes.mapper';
import { ChildNotesRepository } from '../repository/child-notes.repository';

const relationshipNames = [];
relationshipNames.push('child');

@Injectable()
export class ChildNotesService {
  logger = new Logger('ChildNotesService');

  constructor(@InjectRepository(ChildNotesRepository) private childNotesRepository: ChildNotesRepository) {}

  async findById(id: number): Promise<ChildNotesDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.childNotesRepository.findOne(id, options);
    return ChildNotesMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<ChildNotesDTO>): Promise<ChildNotesDTO | undefined> {
    const result = await this.childNotesRepository.findOne(options);
    return ChildNotesMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<ChildNotesDTO>): Promise<[ChildNotesDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.childNotesRepository.findAndCount(options);
    const childNotesDTO: ChildNotesDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(childNotes => childNotesDTO.push(ChildNotesMapper.fromEntityToDTO(childNotes)));
      resultList[0] = childNotesDTO;
    }
    return resultList;
  }

  async save(childNotesDTO: ChildNotesDTO, creator?: string): Promise<ChildNotesDTO | undefined> {
    const entity = ChildNotesMapper.fromDTOtoEntity(childNotesDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.childNotesRepository.save(entity);
    return ChildNotesMapper.fromEntityToDTO(result);
  }

  async update(childNotesDTO: ChildNotesDTO, updater?: string): Promise<ChildNotesDTO | undefined> {
    const entity = ChildNotesMapper.fromDTOtoEntity(childNotesDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.childNotesRepository.save(entity);
    return ChildNotesMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.childNotesRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
