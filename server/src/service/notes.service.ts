import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { NotesDTO } from '../service/dto/notes.dto';
import { NotesMapper } from '../service/mapper/notes.mapper';
import { NotesRepository } from '../repository/notes.repository';

const relationshipNames = [];

@Injectable()
export class NotesService {
  logger = new Logger('NotesService');

  constructor(@InjectRepository(NotesRepository) private notesRepository: NotesRepository) {}

  async findById(id: number): Promise<NotesDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.notesRepository.findOne(id, options);
    return NotesMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<NotesDTO>): Promise<NotesDTO | undefined> {
    const result = await this.notesRepository.findOne(options);
    return NotesMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<NotesDTO>): Promise<[NotesDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.notesRepository.findAndCount(options);
    const notesDTO: NotesDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(notes => notesDTO.push(NotesMapper.fromEntityToDTO(notes)));
      resultList[0] = notesDTO;
    }
    return resultList;
  }

  async save(notesDTO: NotesDTO, creator?: string): Promise<NotesDTO | undefined> {
    const entity = NotesMapper.fromDTOtoEntity(notesDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.notesRepository.save(entity);
    return NotesMapper.fromEntityToDTO(result);
  }

  async update(notesDTO: NotesDTO, updater?: string): Promise<NotesDTO | undefined> {
    const entity = NotesMapper.fromDTOtoEntity(notesDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.notesRepository.save(entity);
    return NotesMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.notesRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
