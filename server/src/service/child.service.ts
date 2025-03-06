import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ChildDTO } from '../service/dto/child.dto';
import { ChildMapper } from '../service/mapper/child.mapper';
import { ChildRepository } from '../repository/child.repository';

const relationshipNames = [];

@Injectable()
export class ChildService {
  logger = new Logger('ChildService');

  constructor(@InjectRepository(ChildRepository) private childRepository: ChildRepository) {}

  async findById(id: number): Promise<ChildDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.childRepository.findOne(id, options);
    return ChildMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<ChildDTO>): Promise<ChildDTO | undefined> {
    const result = await this.childRepository.findOne(options);
    return ChildMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<ChildDTO>): Promise<[ChildDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.childRepository.findAndCount(options);
    const childDTO: ChildDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(child => childDTO.push(ChildMapper.fromEntityToDTO(child)));
      resultList[0] = childDTO;
    }
    return resultList;
  }

  async save(childDTO: ChildDTO, creator?: string): Promise<ChildDTO | undefined> {
    const entity = ChildMapper.fromDTOtoEntity(childDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.childRepository.save(entity);
    return ChildMapper.fromEntityToDTO(result);
  }

  async update(childDTO: ChildDTO, updater?: string): Promise<ChildDTO | undefined> {
    const entity = ChildMapper.fromDTOtoEntity(childDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.childRepository.save(entity);
    return ChildMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.childRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
