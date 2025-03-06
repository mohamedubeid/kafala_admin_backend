import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ChildMaritalNotesDTO } from '../service/dto/child-marital-notes.dto';
import { ChildMaritalNotesMapper } from '../service/mapper/child-marital-notes.mapper';
import { ChildMaritalNotesRepository } from '../repository/child-marital-notes.repository';

const relationshipNames = [];
relationshipNames.push('childMaritalStatus');

@Injectable()
export class ChildMaritalNotesService {
  logger = new Logger('ChildMaritalNotesService');

  constructor(@InjectRepository(ChildMaritalNotesRepository) private childMaritalNotesRepository: ChildMaritalNotesRepository) {}

  async findById(id: number): Promise<ChildMaritalNotesDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.childMaritalNotesRepository.findOne(id, options);
    return ChildMaritalNotesMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<ChildMaritalNotesDTO>): Promise<ChildMaritalNotesDTO | undefined> {
    const result = await this.childMaritalNotesRepository.findOne(options);
    return ChildMaritalNotesMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<ChildMaritalNotesDTO>): Promise<[ChildMaritalNotesDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.childMaritalNotesRepository.findAndCount(options);
    const childMaritalNotesDTO: ChildMaritalNotesDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(childMaritalNotes => childMaritalNotesDTO.push(ChildMaritalNotesMapper.fromEntityToDTO(childMaritalNotes)));
      resultList[0] = childMaritalNotesDTO;
    }
    return resultList;
  }

  async save(childMaritalNotesDTO: ChildMaritalNotesDTO, creator?: string): Promise<ChildMaritalNotesDTO | undefined> {
    const entity = ChildMaritalNotesMapper.fromDTOtoEntity(childMaritalNotesDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.childMaritalNotesRepository.save(entity);
    return ChildMaritalNotesMapper.fromEntityToDTO(result);
  }

  async update(childMaritalNotesDTO: ChildMaritalNotesDTO, updater?: string): Promise<ChildMaritalNotesDTO | undefined> {
    const entity = ChildMaritalNotesMapper.fromDTOtoEntity(childMaritalNotesDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.childMaritalNotesRepository.save(entity);
    return ChildMaritalNotesMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.childMaritalNotesRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
