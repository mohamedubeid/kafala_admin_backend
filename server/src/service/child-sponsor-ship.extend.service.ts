import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ChildSponsorShipDTO } from '../service/dto/child-sponsor-ship.dto';
import { ChildSponsorShipMapper } from '../service/mapper/child-sponsor-ship.mapper';
import { ChildSponsorShipRepository } from '../repository/child-sponsor-ship.repository';
import { PageRequest } from 'src/domain/base/pagination.entity';

const relationshipNames = [];

@Injectable()
export class ChildSponsorShipExtendedService {
  logger = new Logger('ChildSponsorShipService');

  constructor(@InjectRepository(ChildSponsorShipRepository) private childSponsorShipRepository: ChildSponsorShipRepository) {}

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
  async findByFields(options: FindOneOptions<ChildSponsorShipDTO>): Promise<ChildSponsorShipDTO | undefined> {
    const result = await this.childSponsorShipRepository.findOne(options);
    return ChildSponsorShipMapper.fromEntityToDTO(result);
  }
  async findById(id: number): Promise<ChildSponsorShipDTO | undefined> {
    const options = { relations: ['childSponsorShipNotes','childSponsorShipNotes.notes','relSponsershipTypes','relSponsershipTypes.sponsershipType'] };
    const result = await this.childSponsorShipRepository.findOne(id, options);
    return ChildSponsorShipMapper.fromEntityToDTO(result);
  }

  async getChilds(pageRequest: PageRequest, name?: string) {
    const query = this.childSponsorShipRepository
      .createQueryBuilder('child_sponsor_ship')
      .leftJoin('child_sponsor_ship.child', 'child')
      .leftJoin('child.user', 'user')
      .leftJoin('child_sponsor_ship.relSponsershipTypes', 'relSponsershipTypes')
      .leftJoin('relSponsershipTypes.sponsershipType', 'sponsershipType')
      .select([
        'child_sponsor_ship.id',
        'child_sponsor_ship.minimumCost',
        'child.description',
        'child.address',
        'child.id',
        'user.id',
        'user.firstName',
        'user.imageUrl',
        'relSponsershipTypes.id',
        'sponsershipType.type',
      ]);
    if (name) {
      query.where('LOWER(user.firstName) LIKE :name', {
        name: `%${name.toLowerCase()}%`,
      });
    }

    if (!isNaN(pageRequest.size) && pageRequest.size && pageRequest.size >= 0) {
      query.skip(pageRequest.page * pageRequest.size).take(pageRequest.size);
    }
    const [data, count] = await query.getManyAndCount();
    return { data, count };
  }

  async getSingleChild(id: number) {
    const query = this.childSponsorShipRepository
      .createQueryBuilder('child_sponsor_ship')
      .leftJoin('child_sponsor_ship.child', 'child')
      .leftJoin('child.user', 'user')
      .leftJoin('child_sponsor_ship.relSponsershipTypes', 'relSponsershipTypes')
      .leftJoin('relSponsershipTypes.sponsershipType', 'sponsershipType')
      .select([
        'child_sponsor_ship.id',
        'child_sponsor_ship.minimumCost',
        'child.description',
        'child.address',
        'child.fatherName',
        'child.age',
        'child.id',
        'user.id',
        'user.firstName',
        'user.imageUrl',
        'relSponsershipTypes.id',
        'sponsershipType.type',
      ])
      .where('child.id = :id', {
        id,
      });
    const data = await query.getOne();
    return data;
  }

  async update(childSponsorShipDTO: ChildSponsorShipDTO, updater?: string): Promise<ChildSponsorShipDTO | undefined> {
    const entity = ChildSponsorShipMapper.fromDTOtoEntity(childSponsorShipDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.childSponsorShipRepository.save(entity);
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
}
