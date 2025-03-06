import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ChildPrticipationsDTO } from '../service/dto/child-prticipations.dto';
import { ChildPrticipationsMapper } from '../service/mapper/child-prticipations.mapper';
import { ChildPrticipationsRepository } from '../repository/child-prticipations.repository';
import { PageRequest } from 'src/domain/base/pagination.entity';

const relationshipNames = [];
relationshipNames.push('child');

@Injectable()
export class ChildPrticipationsExtendedService {
  logger = new Logger('ChildPrticipationsService');

  constructor(@InjectRepository(ChildPrticipationsRepository) private childPrticipationsRepository: ChildPrticipationsRepository) {}
  async save(childPrticipationsDTO: ChildPrticipationsDTO, creator?: string): Promise<ChildPrticipationsDTO | undefined> {
    const entity = ChildPrticipationsMapper.fromDTOtoEntity(childPrticipationsDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.childPrticipationsRepository.save(entity);
    return ChildPrticipationsMapper.fromEntityToDTO(result);
  }
  async findAndCount(options: FindManyOptions<ChildPrticipationsDTO>): Promise<[ChildPrticipationsDTO[], number]> {
    options.relations = [];
    const resultList = await this.childPrticipationsRepository.findAndCount(options);
    const childPrticipationsDTO: ChildPrticipationsDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(childPrticipations => childPrticipationsDTO.push(ChildPrticipationsMapper.fromEntityToDTO(childPrticipations)));
      resultList[0] = childPrticipationsDTO;
    }
    return resultList;
  }

  async findById(id: number): Promise<ChildPrticipationsDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.childPrticipationsRepository.findOne(id, options);
    return ChildPrticipationsMapper.fromEntityToDTO(result);
  }
  async deleteById(id: number): Promise<void | undefined> {
    await this.childPrticipationsRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
  async childParticipations(pageRequest: PageRequest, childId: number) {
    const queryBuilder = this.childPrticipationsRepository
      .createQueryBuilder('child-participations')
      .where('child-participations.childId = :childId', { childId });
    if (!isNaN(pageRequest.size) && pageRequest.size > 0) {
      queryBuilder.skip(pageRequest.page * pageRequest.size).take(pageRequest.size);
    }

    const [childParticipations, count] = await queryBuilder.getManyAndCount();

    return { childParticipations, count };
  }

  async findByFields(options: FindOneOptions<ChildPrticipationsDTO>): Promise<ChildPrticipationsDTO | undefined> {
    const result = await this.childPrticipationsRepository.findOne(options);
    return ChildPrticipationsMapper.fromEntityToDTO(result);
  }
}
