import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { RelSponsershipTypesDTO } from '../service/dto/rel-sponsership-types.dto';
import { RelSponsershipTypesMapper } from '../service/mapper/rel-sponsership-types.mapper';
import { RelSponsershipTypesRepository } from '../repository/rel-sponsership-types.repository';

const relationshipNames = [];
relationshipNames.push('sponsershipType');
relationshipNames.push('childSponsorShip');

@Injectable()
export class RelSponsershipTypesService {
  logger = new Logger('RelSponsershipTypesService');

  constructor(@InjectRepository(RelSponsershipTypesRepository) private relSponsershipTypesRepository: RelSponsershipTypesRepository) {}

  async findById(id: number): Promise<RelSponsershipTypesDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.relSponsershipTypesRepository.findOne(id, options);
    return RelSponsershipTypesMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<RelSponsershipTypesDTO>): Promise<RelSponsershipTypesDTO | undefined> {
    const result = await this.relSponsershipTypesRepository.findOne(options);
    return RelSponsershipTypesMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<RelSponsershipTypesDTO>): Promise<[RelSponsershipTypesDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.relSponsershipTypesRepository.findAndCount(options);
    const relSponsershipTypesDTO: RelSponsershipTypesDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(relSponsershipTypes =>
        relSponsershipTypesDTO.push(RelSponsershipTypesMapper.fromEntityToDTO(relSponsershipTypes)),
      );
      resultList[0] = relSponsershipTypesDTO;
    }
    return resultList;
  }

  async save(relSponsershipTypesDTO: RelSponsershipTypesDTO, creator?: string): Promise<RelSponsershipTypesDTO | undefined> {
    const entity = RelSponsershipTypesMapper.fromDTOtoEntity(relSponsershipTypesDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.relSponsershipTypesRepository.save(entity);
    return RelSponsershipTypesMapper.fromEntityToDTO(result);
  }

  async update(relSponsershipTypesDTO: RelSponsershipTypesDTO, updater?: string): Promise<RelSponsershipTypesDTO | undefined> {
    const entity = RelSponsershipTypesMapper.fromDTOtoEntity(relSponsershipTypesDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.relSponsershipTypesRepository.save(entity);
    return RelSponsershipTypesMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.relSponsershipTypesRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
