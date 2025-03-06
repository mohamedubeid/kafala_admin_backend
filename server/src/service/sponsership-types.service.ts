import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { SponsershipTypesDTO } from '../service/dto/sponsership-types.dto';
import { SponsershipTypesMapper } from '../service/mapper/sponsership-types.mapper';
import { SponsershipTypesRepository } from '../repository/sponsership-types.repository';

const relationshipNames = [];

@Injectable()
export class SponsershipTypesService {
  logger = new Logger('SponsershipTypesService');

  constructor(@InjectRepository(SponsershipTypesRepository) private sponsershipTypesRepository: SponsershipTypesRepository) {}

  async findById(id: number): Promise<SponsershipTypesDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.sponsershipTypesRepository.findOne(id, options);
    return SponsershipTypesMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<SponsershipTypesDTO>): Promise<SponsershipTypesDTO | undefined> {
    const result = await this.sponsershipTypesRepository.findOne(options);
    return SponsershipTypesMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<SponsershipTypesDTO>): Promise<[SponsershipTypesDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.sponsershipTypesRepository.findAndCount(options);
    const sponsershipTypesDTO: SponsershipTypesDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(sponsershipTypes => sponsershipTypesDTO.push(SponsershipTypesMapper.fromEntityToDTO(sponsershipTypes)));
      resultList[0] = sponsershipTypesDTO;
    }
    return resultList;
  }

  async save(sponsershipTypesDTO: SponsershipTypesDTO, creator?: string): Promise<SponsershipTypesDTO | undefined> {
    const entity = SponsershipTypesMapper.fromDTOtoEntity(sponsershipTypesDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.sponsershipTypesRepository.save(entity);
    return SponsershipTypesMapper.fromEntityToDTO(result);
  }

  async update(sponsershipTypesDTO: SponsershipTypesDTO, updater?: string): Promise<SponsershipTypesDTO | undefined> {
    const entity = SponsershipTypesMapper.fromDTOtoEntity(sponsershipTypesDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.sponsershipTypesRepository.save(entity);
    return SponsershipTypesMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.sponsershipTypesRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
