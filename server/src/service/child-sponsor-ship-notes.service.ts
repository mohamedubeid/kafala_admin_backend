import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ChildSponsorShipNotesDTO } from '../service/dto/child-sponsor-ship-notes.dto';
import { ChildSponsorShipNotesMapper } from '../service/mapper/child-sponsor-ship-notes.mapper';
import { ChildSponsorShipNotesRepository } from '../repository/child-sponsor-ship-notes.repository';

const relationshipNames = [];
relationshipNames.push('childSponsorShip');

@Injectable()
export class ChildSponsorShipNotesService {
  logger = new Logger('ChildSponsorShipNotesService');

  constructor(
    @InjectRepository(ChildSponsorShipNotesRepository) private childSponsorShipNotesRepository: ChildSponsorShipNotesRepository,
  ) {}

  async findById(id: number): Promise<ChildSponsorShipNotesDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.childSponsorShipNotesRepository.findOne(id, options);
    return ChildSponsorShipNotesMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<ChildSponsorShipNotesDTO>): Promise<ChildSponsorShipNotesDTO | undefined> {
    const result = await this.childSponsorShipNotesRepository.findOne(options);
    return ChildSponsorShipNotesMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<ChildSponsorShipNotesDTO>): Promise<[ChildSponsorShipNotesDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.childSponsorShipNotesRepository.findAndCount(options);
    const childSponsorShipNotesDTO: ChildSponsorShipNotesDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(childSponsorShipNotes =>
        childSponsorShipNotesDTO.push(ChildSponsorShipNotesMapper.fromEntityToDTO(childSponsorShipNotes)),
      );
      resultList[0] = childSponsorShipNotesDTO;
    }
    return resultList;
  }

  async save(childSponsorShipNotesDTO: ChildSponsorShipNotesDTO, creator?: string): Promise<ChildSponsorShipNotesDTO | undefined> {
    const entity = ChildSponsorShipNotesMapper.fromDTOtoEntity(childSponsorShipNotesDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.childSponsorShipNotesRepository.save(entity);
    return ChildSponsorShipNotesMapper.fromEntityToDTO(result);
  }

  async update(childSponsorShipNotesDTO: ChildSponsorShipNotesDTO, updater?: string): Promise<ChildSponsorShipNotesDTO | undefined> {
    const entity = ChildSponsorShipNotesMapper.fromDTOtoEntity(childSponsorShipNotesDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.childSponsorShipNotesRepository.save(entity);
    return ChildSponsorShipNotesMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number): Promise<void | undefined> {
    await this.childSponsorShipNotesRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
