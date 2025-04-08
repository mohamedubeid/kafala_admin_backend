import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { RelChildKafeelDTO } from '../service/dto/rel-child-kafeel.dto';
import { RelChildKafeelMapper } from '../service/mapper/rel-child-kafeel.mapper';
import { RelChildKafeelRepository } from '../repository/rel-child-kafeel.repository';
import { ChildCertificateDTO } from './dto/childParticipation.dto';
import { ChildSponsoredDTO } from './dto/childSponsored.dto';
import { RelChildKafeelStatus } from '../domain/enumeration/rel-child-kafeel-status';

const relationshipNames = [];
relationshipNames.push('child');
relationshipNames.push('kafeel');
relationshipNames.push('kafeel.user');
@Injectable()
export class RelChildKafeelExtendedService {
  logger = new Logger('RelChildKafeelService');

  constructor(@InjectRepository(RelChildKafeelRepository) private relChildKafeelRepository: RelChildKafeelRepository) {}

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
  async findById(id: number): Promise<RelChildKafeelDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.relChildKafeelRepository.findOne(id, options);
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

  async getChildsIdByKafeelId(kafeelId: number): Promise<number[]> {
    const date = new Date();
    const data = await this.relChildKafeelRepository
      .createQueryBuilder('rel-child-kafeel')
      .select('rel-child-kafeel.childId', 'childId')
      .where('rel-child-kafeel.kafeelId = :kafeelId', { kafeelId })
      .andWhere('rel-child-kafeel.expirationDate >= :date', { date })
      .getRawMany();
    return data.map(row => row.childId);
  }

  async getFirstPendingSubscriptionByKafeelAndChildId(kafeelId: number, childId: number): Promise<RelChildKafeelDTO | null> {
    const data = await this.relChildKafeelRepository
      .createQueryBuilder('relChildKafeel')
      .where('relChildKafeel.kafeelId = :kafeelId', { kafeelId })
      .andWhere('relChildKafeel.childId = :childId', { childId }) // Add childId filter
      .andWhere('relChildKafeel.status = :status', { status: RelChildKafeelStatus.PENDING }) // Ensure only PENDING status
      .orderBy('relChildKafeel.expirationDate', 'ASC') // Get the earliest expirationDate
      .getOne();

    return data || null; // Return null if no record is found
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
  async getKafeelChildCertificate(kafeelId: number): Promise<ChildCertificateDTO[]> {
    const result = await this.relChildKafeelRepository
      .createQueryBuilder('rel-child-kafeel')
      .leftJoinAndSelect('rel-child-kafeel.child', 'child')
      .leftJoinAndSelect('child.childPrticipations', 'childPrticipations')
      .where('rel-child-kafeel.kafeelId = :kafeelId', { kafeelId })
      .andWhere('childPrticipations.id IS NOT NULL')
      .select('child.first_name', 'firstName')
      .addSelect('child.father_name', 'fatherName')
      .addSelect('child.familyName', 'familyName')
      .addSelect('child.image_url', 'imageUrl')
      .addSelect('childPrticipations.createdDate', 'createdDate')
      .addSelect('childPrticipations.image', 'certificateImage')
      .addSelect('childPrticipations.desceription', 'description')
      .orderBy('childPrticipations.createdDate', 'DESC')
      .getRawMany();

    return result;
  }

  async getChildTransactions(childId: number): Promise<ChildSponsoredDTO[]> {
    const result = await this.relChildKafeelRepository
      .createQueryBuilder('rel-child-kafeel')
      .leftJoinAndSelect('rel-child-kafeel.child', 'child')
      .leftJoinAndSelect('rel-child-kafeel.kafeel', 'kafeel')
      .leftJoinAndSelect('kafeel.user', 'user')
      .leftJoin('child_sponsor_ship', 'sponsorship', 'sponsorship.childId = rel-child-kafeel.childId')
      .where('rel-child-kafeel.childId = :childId', { childId })
      .select('child.first_name', 'firstName')
      .addSelect('child.father_name', 'fatherName')
      .addSelect('child.familyName', 'familyName')
      .addSelect('child.image_url', 'imageUrl')
      .addSelect('rel-child-kafeel.start_date', 'startDate')
      .addSelect('rel-child-kafeel.expiration_date', 'expirationDate')
      .addSelect('rel-child-kafeel.cost', 'cost')
      .addSelect('rel-child-kafeel.duration', 'duration')
      .addSelect('user.firstName', 'kafeelFirstName')
      .addSelect('user.lastName', 'kafeelLastName')
      .addSelect('sponsorship.minimum_cost', 'minimumCost')
      .andWhere('rel-child-kafeel.status = "ACCEPTED"')
      .orderBy('rel-child-kafeel.expiration_date', 'ASC')
      .getRawMany();
    return result;
  }

  async getKafeelChilds(kafeelId: number): Promise<ChildSponsoredDTO[]> {
    const result = await this.relChildKafeelRepository
      .createQueryBuilder('rel-child-kafeel')
      .leftJoinAndSelect('rel-child-kafeel.child', 'child')
      .where('rel-child-kafeel.kafeelId = :kafeelId', { kafeelId })
      .select('child.first_name', 'firstName')
      .addSelect('child.father_name', 'fatherName')
      .addSelect('child.familyName', 'familyName')
      .addSelect('child.image_url', 'imageUrl')
      .addSelect('child.id', 'childId')
      .addSelect('rel-child-kafeel.start_date', 'startDate')
      .addSelect('rel-child-kafeel.expiration_date', 'expirationDate')
      .addSelect('rel-child-kafeel.cost', 'cost')
      .addSelect('rel-child-kafeel.duration', 'duration')
      .andWhere('rel-child-kafeel.status = "ACCEPTED"')
      .orderBy('rel-child-kafeel.expiration_date', 'ASC')
      .getRawMany();
    return result;
  }
  async getTotalChildSponsored(): Promise<number> {
    const result = await this.relChildKafeelRepository
      .createQueryBuilder('relChildKafeel')
      .leftJoin('relChildKafeel.child', 'child')
      .select('COUNT(DISTINCT relChildKafeel.childId)', 'count')
      .getRawOne();

    return parseInt(result.count, 10);
  }
}
