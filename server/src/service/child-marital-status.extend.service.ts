import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChildMaritalStatusDTO } from '../service/dto/child-marital-status.dto';
import { ChildMaritalStatusMapper } from '../service/mapper/child-marital-status.mapper';
import { ChildMaritalStatusRepository } from '../repository/child-marital-status.repository';
import { FindManyOptions, FindOneOptions } from 'typeorm';

const relationshipNames = [];

@Injectable()
export class ChildMaritalStatusExtendedService {
  logger = new Logger('ChildMaritalStatusService');

  constructor(@InjectRepository(ChildMaritalStatusRepository) private childMaritalStatusRepository: ChildMaritalStatusRepository) {}

  async findByFields(options: FindOneOptions<ChildMaritalStatusDTO>): Promise<ChildMaritalStatusDTO | undefined> {
    const result = await this.childMaritalStatusRepository.findOne(options);
    return ChildMaritalStatusMapper.fromEntityToDTO(result);
  }
  async findById(id: number): Promise<ChildMaritalStatusDTO | undefined> {
    const options = { relations: ['childMaritalNotes','childMaritalNotes.notes'] };
    const result = await this.childMaritalStatusRepository.findOne(id, options);
    return ChildMaritalStatusMapper.fromEntityToDTO(result);
  }
  async save(childMaritalStatusDTO: ChildMaritalStatusDTO, creator?: string): Promise<ChildMaritalStatusDTO | undefined> {
    const entity = ChildMaritalStatusMapper.fromDTOtoEntity(childMaritalStatusDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.childMaritalStatusRepository.save(entity);
    return ChildMaritalStatusMapper.fromEntityToDTO(result);
  }


  async findAndCount(options: FindManyOptions<ChildMaritalStatusDTO>): Promise<[ChildMaritalStatusDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.childMaritalStatusRepository.findAndCount(options);
    const childMaritalStatusDTO: ChildMaritalStatusDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(childMaritalStatus => childMaritalStatusDTO.push(ChildMaritalStatusMapper.fromEntityToDTO(childMaritalStatus)));
      resultList[0] = childMaritalStatusDTO;
    }
    return resultList;
  }
  async deleteById(id: number): Promise<void | undefined> {
    await this.childMaritalStatusRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
