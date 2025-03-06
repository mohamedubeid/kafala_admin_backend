import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ChildSponsorShipDTO } from '../service/dto/child-sponsor-ship.dto';
import { ChildSponsorShipMapper } from '../service/mapper/child-sponsor-ship.mapper';
import { ChildSponsorShipRepository } from '../repository/child-sponsor-ship.repository';

const relationshipNames = [];

@Injectable()
export class ChildSponsorShipService {
  logger = new Logger('ChildSponsorShipService');

  constructor(@InjectRepository(ChildSponsorShipRepository) private childSponsorShipRepository: ChildSponsorShipRepository) {}

  async findById(id: number): Promise<ChildSponsorShipDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.childSponsorShipRepository.findOne(id, options);
    return ChildSponsorShipMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<ChildSponsorShipDTO>): Promise<ChildSponsorShipDTO | undefined> {
    const result = await this.childSponsorShipRepository.findOne(options);
    return ChildSponsorShipMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<ChildSponsorShipDTO>): Promise<[ChildSponsorShipDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.childSponsorShipRepository.findAndCount(options);
    const childSponsorShipDTO: ChildSponsorShipDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(childSponsorShip => childSponsorShipDTO.push(ChildSponsorShipMapper.fromEntityToDTO(childSponsorShip)));
      resultList[0] = childSponsorShipDTO;
    }
    return resultList;
  }

  async save(childSponsorShipDTO: ChildSponsorShipDTO, creator?: string): Promise<ChildSponsorShipDTO | undefined> {
    const entity = ChildSponsorShipMapper.fromDTOtoEntity(childSponsorShipDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.childSponsorShipRepository.save(entity);
    return ChildSponsorShipMapper.fromEntityToDTO(result);
  }

  async update(childSponsorShipDTO: ChildSponsorShipDTO, updater?: string): Promise<ChildSponsorShipDTO | undefined> {
    const entity = ChildSponsorShipMapper.fromDTOtoEntity(childSponsorShipDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.childSponsorShipRepository.save(entity);
    return ChildSponsorShipMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.childSponsorShipRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
