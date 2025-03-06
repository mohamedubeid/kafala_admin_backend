import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { RelChildKafeelDTO } from '../service/dto/rel-child-kafeel.dto';
import { RelChildKafeelMapper } from '../service/mapper/rel-child-kafeel.mapper';
import { RelChildKafeelRepository } from '../repository/rel-child-kafeel.repository';

const relationshipNames = [];
relationshipNames.push('child');
relationshipNames.push('kafeel');

@Injectable()
export class RelChildKafeelService {
  logger = new Logger('RelChildKafeelService');

  constructor(@InjectRepository(RelChildKafeelRepository) private relChildKafeelRepository: RelChildKafeelRepository) {}

  async findById(id: number): Promise<RelChildKafeelDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.relChildKafeelRepository.findOne(id, options);
    return RelChildKafeelMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<RelChildKafeelDTO>): Promise<RelChildKafeelDTO | undefined> {
    const result = await this.relChildKafeelRepository.findOne(options);
    return RelChildKafeelMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<RelChildKafeelDTO>): Promise<[RelChildKafeelDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.relChildKafeelRepository.findAndCount(options);
    const relChildKafeelDTO: RelChildKafeelDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(relChildKafeel => relChildKafeelDTO.push(RelChildKafeelMapper.fromEntityToDTO(relChildKafeel)));
      resultList[0] = relChildKafeelDTO;
    }
    return resultList;
  }

  async save(relChildKafeelDTO: RelChildKafeelDTO, creator?: string): Promise<RelChildKafeelDTO | undefined> {
    const entity = RelChildKafeelMapper.fromDTOtoEntity(relChildKafeelDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.relChildKafeelRepository.save(entity);
    return RelChildKafeelMapper.fromEntityToDTO(result);
  }

  async update(relChildKafeelDTO: RelChildKafeelDTO, updater?: string): Promise<RelChildKafeelDTO | undefined> {
    const entity = RelChildKafeelMapper.fromDTOtoEntity(relChildKafeelDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.relChildKafeelRepository.save(entity);
    return RelChildKafeelMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.relChildKafeelRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
