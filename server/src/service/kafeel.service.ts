import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { KafeelDTO } from '../service/dto/kafeel.dto';
import { KafeelMapper } from '../service/mapper/kafeel.mapper';
import { KafeelRepository } from '../repository/kafeel.repository';

const relationshipNames = [];

@Injectable()
export class KafeelService {
  logger = new Logger('KafeelService');

  constructor(@InjectRepository(KafeelRepository) private kafeelRepository: KafeelRepository) {}

  async findById(id: number): Promise<KafeelDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.kafeelRepository.findOne(id, options);
    return KafeelMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<KafeelDTO>): Promise<KafeelDTO | undefined> {
    const result = await this.kafeelRepository.findOne(options);
    return KafeelMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<KafeelDTO>): Promise<[KafeelDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.kafeelRepository.findAndCount(options);
    const kafeelDTO: KafeelDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(kafeel => kafeelDTO.push(KafeelMapper.fromEntityToDTO(kafeel)));
      resultList[0] = kafeelDTO;
    }
    return resultList;
  }

  async save(kafeelDTO: KafeelDTO, creator?: string): Promise<KafeelDTO | undefined> {
    const entity = KafeelMapper.fromDTOtoEntity(kafeelDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.kafeelRepository.save(entity);
    return KafeelMapper.fromEntityToDTO(result);
  }

  async update(kafeelDTO: KafeelDTO, updater?: string): Promise<KafeelDTO | undefined> {
    const entity = KafeelMapper.fromDTOtoEntity(kafeelDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.kafeelRepository.save(entity);
    return KafeelMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.kafeelRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
