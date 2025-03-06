import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ChildEducationNotesDTO } from '../service/dto/child-education-notes.dto';
import { ChildEducationNotesMapper } from '../service/mapper/child-education-notes.mapper';
import { ChildEducationNotesRepository } from '../repository/child-education-notes.repository';

const relationshipNames = [];
relationshipNames.push('childEducationStatus');

@Injectable()
export class ChildEducationNotesService {
  logger = new Logger('ChildEducationNotesService');

  constructor(@InjectRepository(ChildEducationNotesRepository) private childEducationNotesRepository: ChildEducationNotesRepository) {}

  async findById(id: number): Promise<ChildEducationNotesDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.childEducationNotesRepository.findOne(id, options);
    return ChildEducationNotesMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<ChildEducationNotesDTO>): Promise<ChildEducationNotesDTO | undefined> {
    const result = await this.childEducationNotesRepository.findOne(options);
    return ChildEducationNotesMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<ChildEducationNotesDTO>): Promise<[ChildEducationNotesDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.childEducationNotesRepository.findAndCount(options);
    const childEducationNotesDTO: ChildEducationNotesDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(childEducationNotes =>
        childEducationNotesDTO.push(ChildEducationNotesMapper.fromEntityToDTO(childEducationNotes)),
      );
      resultList[0] = childEducationNotesDTO;
    }
    return resultList;
  }

  async save(childEducationNotesDTO: ChildEducationNotesDTO, creator?: string): Promise<ChildEducationNotesDTO | undefined> {
    const entity = ChildEducationNotesMapper.fromDTOtoEntity(childEducationNotesDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.childEducationNotesRepository.save(entity);
    return ChildEducationNotesMapper.fromEntityToDTO(result);
  }

  async update(childEducationNotesDTO: ChildEducationNotesDTO, updater?: string): Promise<ChildEducationNotesDTO | undefined> {
    const entity = ChildEducationNotesMapper.fromDTOtoEntity(childEducationNotesDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.childEducationNotesRepository.save(entity);
    return ChildEducationNotesMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.childEducationNotesRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
