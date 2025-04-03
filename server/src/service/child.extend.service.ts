import { UserService } from './user.service';
import { ChildEducationStatusExtendedService } from './child-education-status.extend.service';
import { ChildSponsorShipExtendedService } from './child-sponsor-ship.extend.service';
import { ChildMaritalStatusExtendedService } from './child-marital-status.extend.service';
import { ChildHealthStatusExtendedService } from './child-health-status.extend.service';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChildRepository } from '../repository/child.repository';
import { ChildExtendedMapper } from './mapper/child.extend.mapper';
import { ChildExtendedDTO } from './dto/child.extend.dto';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ChildDTO } from './dto/child.dto';
import { ChildMapper } from './mapper/child.mapper';
import { PageRequest } from 'src/domain/base/pagination.entity';
import { SponsershipType } from '../domain/enumeration/sponsership-type';
import { OrphanClassification } from '../domain/enumeration/orphan-classification';
import { UserDTO } from './dto/user.dto';
import { ChildHealthStatusDTO } from './dto/child-health-status.dto';
import { ChildMaritalStatusDTO } from './dto/child-marital-status.dto';
import { ChildEducationStatusDTO } from './dto/child-education-status.dto';
import { ChildSponsorShipDTO } from './dto/child-sponsor-ship.dto';
import { Gender } from '../domain/enumeration/gender';
import { HealthStatus } from '../domain/enumeration/health-status';
import { DisabilityTypes } from '../domain/enumeration/disability-types';
import { MentalIllnessTypes } from '../domain/enumeration/mental-illness-types';
import { SychologicalHealthTypes } from '../domain/enumeration/sychological-health-types';
import { SponserConnection } from '../domain/enumeration/sponser-connection';
import { SponsershipParty } from '../domain/enumeration/sponsership-party';
import { SponsershipDuration } from '../domain/enumeration/sponsership-duration';
import { LastLevelOfEducation } from '../domain/enumeration/last-level-of-education';
import moment from 'moment';
import { SponsershipTypesRepository } from '../repository/sponsership-types.repository';
import { RelSponsershipTypesRepository } from '../repository/rel-sponsership-types.repository';

const Diseases = {
  lostHousing: 5,
  lostLimbs: 3,
  lostSight: 3,
  Lostabilitytohearorspeak: 2,
  chronicDiseases: 5,
};
const relationshipNames = [];

@Injectable()
export class ChildExtendedService {
  logger = new Logger('ChildService');

  constructor(
    @InjectRepository(ChildRepository) private childRepository: ChildRepository,
    private childHealthStatusExtendedService: ChildHealthStatusExtendedService,
    private childMaritalStatusExtendedService: ChildMaritalStatusExtendedService,
    private childSponsorShipExtendedService: ChildSponsorShipExtendedService,
    private childEducationStatusExtendedService: ChildEducationStatusExtendedService,
    private userService: UserService,
    private sponsershipTypesRepository: SponsershipTypesRepository,
    private relSponsershipTypesRepository: RelSponsershipTypesRepository,
  ) {}

  async findAndCount(options: FindManyOptions<ChildDTO>): Promise<[ChildDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.childRepository.findAndCount(options);
    const childDTO: ChildDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(child => childDTO.push(ChildMapper.fromEntityToDTO(child)));
      resultList[0] = childDTO;
    }
    return resultList;
  }

  async findByFields(options: FindOneOptions<ChildExtendedDTO>): Promise<ChildExtendedDTO | undefined> {
    const result = await this.childRepository.findOne(options);
    return ChildExtendedMapper.fromEntityToDTO(result);
  }
  async findById(id: number): Promise<ChildDTO | undefined> {
    const options = {
      relations: [
        'user',
        'childNotes',
        'childNotes.notes',
        'childHealthStatus',
        'childEducationStatus',
        'childMaritalStatus',
        'childSponsorShip',
      ],
    };
    const result = await this.childRepository.findOne(id, options);
    return ChildMapper.fromEntityToDTO(result);
  }
  async getChildTotalSponsored(childId: number) {
    const today = new Date().toISOString();
    return await this.childRepository
      .createQueryBuilder('child')
      .leftJoinAndSelect('child.relChildKafeels', 'relChildKafeels')
      .select(
        `SUM(
            CASE
              WHEN TIMESTAMPDIFF(YEAR, child.createdDate, :today) >= 1 THEN
                CASE
                  WHEN relChildKafeels.expirationDate BETWEEN
                       DATE_ADD(child.createdDate, INTERVAL TIMESTAMPDIFF(YEAR, child.createdDate, :today) YEAR)
                       AND
                       DATE_ADD(child.createdDate, INTERVAL (TIMESTAMPDIFF(YEAR, child.createdDate, :today) + 1) YEAR)
                       AND relChildKafeels.status = 'ACCEPTED'
                  THEN relChildKafeels.cost
                  ELSE 0
                END
              ELSE
                                       CASE
WHEN (relChildKafeels.expirationDate > :today
       OR relChildKafeels.expirationDate BETWEEN child.createdDate AND DATE_ADD(child.createdDate, INTERVAL 1 YEAR))
  AND relChildKafeels.status = 'ACCEPTED'
THEN relChildKafeels.cost
ELSE 0
END

            END
          ) AS totalCost`,
      )
      .where('relChildKafeels.childId = :childId', { childId })
      .setParameters({ today })
      .getRawOne();
  }
  async getUserIdByChildId(childId: number): Promise<number> {
    const result = await this.childRepository
      .createQueryBuilder('child')
      .select('child.userId')
      .where('child.id = :childId', { childId })
      .getRawOne();

    return result ? result.userId : null;
  }
  async getChildTotalSponsoredIds(
    pageRequest: PageRequest,
    name?: string,
    ageFrom?: number,
    ageTo?: number,
    sponsershipType?: SponsershipType,
    orphanClassification?: OrphanClassification,
    startDate?: string,
    endDate?: string,
    hasSponership?: string,
  ): Promise<number[]> {
    const today = new Date().toISOString();

    const queryBuilder = this.childRepository
      .createQueryBuilder('child')
      .leftJoin('child.childSponsorShip', 'childSponsorShip')
      .leftJoin('child.relChildKafeels', 'relChildKafeels')
      .leftJoin('child.childMaritalStatus', 'childMaritalStatus')
      .leftJoin('childSponsorShip.relSponsershipTypes', 'relSponsershipTypes')
      .leftJoin('relSponsershipTypes.sponsershipType', 'sponsershipType')
      .select('child.id', 'id')
      .addSelect('child.createdDate', 'createdDate')
      .addSelect(
        `SUM(CASE
                      WHEN DATEDIFF(:today, child.createdDate) > 365
                      THEN
                          CASE
                              WHEN relChildKafeels.expirationDate BETWEEN DATE_ADD(child.createdDate, INTERVAL TIMESTAMPDIFF(YEAR, child.createdDate, :today) YEAR)
                                  AND DATE_ADD(child.createdDate, INTERVAL TIMESTAMPDIFF(YEAR, child.createdDate, :today) + 1 YEAR)
                                  AND relChildKafeels.status = 'ACCEPTED'
                              THEN relChildKafeels.cost

                              ELSE 0
                          END
                      ELSE
                CASE
  WHEN (relChildKafeels.expirationDate > :today
         OR relChildKafeels.expirationDate BETWEEN child.createdDate AND DATE_ADD(child.createdDate, INTERVAL 1 YEAR))
    AND relChildKafeels.status = 'ACCEPTED'
  THEN relChildKafeels.cost
  ELSE 0
END

                  END)`,
        'totalCost',
      )
      .addSelect('childSponsorShip.minimumCost', 'minimumCost')
      .where('childMaritalStatus.orphanClassification = :orphanClassification', { orphanClassification })
      .groupBy('child.id')
      .addGroupBy('child.createdDate')
      .addGroupBy('childSponsorShip.minimumCost')
      .having('totalCost < minimumCost')
      .orderBy('child.score', 'DESC')
      .setParameters({ today });

    if (name) {
      queryBuilder.andWhere(
        'LOWER(child.firstName) LIKE :name OR LOWER(child.fatherName) LIKE :name OR LOWER(child.familyName) LIKE :name',
        { name: `%${name.toLowerCase()}%` },
      );
    }

    if (ageFrom !== undefined && ageTo !== undefined) {
      queryBuilder.andWhere('child.age BETWEEN :ageFrom AND :ageTo', { ageFrom, ageTo });
    }

    if (sponsershipType) {
      queryBuilder.andWhere('sponsershipType.type = :sponsershipType', { sponsershipType });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('child.createdDate BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    if (hasSponership) {
      if (hasSponership === 'true') {
        queryBuilder.andWhere('childSponsorShip.id IS NOT NULL');
      } else {
        queryBuilder.andWhere('childSponsorShip.id IS NULL');
      }
    }

    const page = !isNaN(pageRequest.page) && pageRequest.page >= 0 ? pageRequest.page : 0;
    const size = !isNaN(pageRequest.size) && pageRequest.size > 0 ? pageRequest.size : 10;

    queryBuilder.skip(page * size).take(size);

    const newResults = await queryBuilder.getRawMany();
    console.log('newResults', newResults);

    // Collect unique IDs from paginated results
    const ids = [...new Set(newResults.map(row => row.id))];
    return ids;

    // const newResults = await queryBuilder.getRawMany();
    // console.log('newResults', newResults);
    // let ids = newResults.map(row => row.id);
    // newResults.forEach(row => {
    //   if (!ids.includes(row.id)) {
    //     ids.push(row.id);
    //   }
    // });

    // return ids;
  }

  async getChilds(
    pageRequest: PageRequest,
    name?: string,
    ageFrom?: number,
    ageTo?: number,
    sponsershipType?: SponsershipType,
    orphanClassification?: OrphanClassification,
    startDate?: string,
    endDate?: string,
    hasSponership?: string,
  ) {
    const childIds = await this.getChildTotalSponsoredIds(
      pageRequest,
      name,
      ageFrom,
      ageTo,
      sponsershipType,
      orphanClassification,
      startDate,
      endDate,
      hasSponership,
    );
    const today = new Date().toISOString();

    if (childIds.length === 0) {
      return { data: [], count: 0 };
    }
    const query = this.childRepository
      .createQueryBuilder('child')
      .leftJoin('child.childSponsorShip', 'childSponsorShip')
      .leftJoin('child.user', 'user')
      .leftJoin('child.childMaritalStatus', 'childMaritalStatus')
      .leftJoin('childSponsorShip.relSponsershipTypes', 'relSponsershipTypes')
      .leftJoin('relSponsershipTypes.sponsershipType', 'sponsershipType')
      .leftJoin('child.relChildKafeels', 'relChildKafeels')
      .select([
        'child.id',
        'child.gender',
        'child.age',
        'child.description',
        'child.address',
        'child.fatherName',
        'child.familyName',
        'child.score',
        'childSponsorShip.id',
        'childSponsorShip.name',
        'childSponsorShip.minimumCost',
        'child.firstName',
        'child.imageUrl',
        'childMaritalStatus.id',
        'childMaritalStatus.orphanClassification',
        'relSponsershipTypes.id',
        'sponsershipType.type',
      ])

      .where('child.id IN (:...childIds)', { childIds })
      .andWhere('childMaritalStatus.orphanClassification = :orphanClassification', { orphanClassification })
      .groupBy('child.id')
      .addGroupBy('childSponsorShip.id')
      .addGroupBy('childMaritalStatus.id')
      .addGroupBy('relSponsershipTypes.id')
      .addGroupBy('sponsershipType.type')
      .orderBy('child.score', 'DESC');

    const page = !isNaN(pageRequest.page) && pageRequest.page >= 0 ? pageRequest.page : 0;
    const size = !isNaN(pageRequest.size) && pageRequest.size > 0 ? pageRequest.size : 10;

    query.skip(page * size).take(size);
    const [data, count] = await query.getManyAndCount();
    for (let i = 0; i < data.length; i++) {
      const totalCostResult = await this.childRepository
        .createQueryBuilder('child')
        .leftJoin('child.relChildKafeels', 'relChildKafeels')
        .select(
          `SUM(
              CASE
                WHEN TIMESTAMPDIFF(YEAR, child.createdDate, :today) >= 1 THEN
                  CASE
                    WHEN relChildKafeels.expirationDate BETWEEN
                         DATE_ADD(child.createdDate, INTERVAL TIMESTAMPDIFF(YEAR, child.createdDate, :today) YEAR)
                         AND
                         DATE_ADD(child.createdDate, INTERVAL (TIMESTAMPDIFF(YEAR, child.createdDate, :today) + 1) YEAR)
                         AND relChildKafeels.status = 'ACCEPTED'
                    THEN relChildKafeels.cost
                    ELSE 0
                  END
                ELSE
                  CASE
                    WHEN (relChildKafeels.expirationDate > :today
                          OR relChildKafeels.expirationDate BETWEEN child.createdDate AND DATE_ADD(child.createdDate, INTERVAL 1 YEAR))
                      AND relChildKafeels.status = 'ACCEPTED'
                    THEN relChildKafeels.cost
                    ELSE 0
                  END

                  END
            ) AS totalCost`,
        )
        .where('child.id = :childId', { childId: data[i].id })
        .setParameters({ today })
        .getRawOne();

      data[i].totalCost = parseFloat(totalCostResult.totalCost) || 0;
    }

    console.log('Final SQL Query:', query.getSql());

    return { data, count };
  }

  async getChildStatistics(): Promise<{ fatherOrphanCount: number | 0; motherOrphanCount: number | 0; fatherAndMotherCount: number | 0 }> {
    const fatherOrphanCount = await this.childRepository
      .createQueryBuilder('child')
      .leftJoinAndSelect('child.childMaritalStatus', 'childMaritalStatus')
      .where('childMaritalStatus.orphan_classification = "FATHER_ORPHAN"')
      .getCount();
    const motherOrphanCount = await this.childRepository
      .createQueryBuilder('child')
      .leftJoinAndSelect('child.childMaritalStatus', 'childMaritalStatus')
      .where('childMaritalStatus.orphan_classification = "MOTHER_ORPHAN"')
      .getCount();

    const fatherAndMotherCount = await this.childRepository
      .createQueryBuilder('child')
      .leftJoinAndSelect('child.childMaritalStatus', 'childMaritalStatus')
      .where('childMaritalStatus.orphan_classification = "OTHER"')
      .getCount();
    return { fatherOrphanCount, motherOrphanCount, fatherAndMotherCount };
  }

  async getAboutUsChildList() {
    const childsWithSponsorShip = await this.getSponsoredChild();
    const getChildsWithSponsorShipsCount = childsWithSponsorShip.length;
    const childWithoutSponsorShipLimit = 6 - (getChildsWithSponsorShipsCount || 0);
    const getChildsWithoutSponsorShips = await this.getChildrenWithoutSponsorship(childWithoutSponsorShipLimit);
    return { childsWithSponsorShip, getChildsWithoutSponsorShips };
  }

  async updateScore(childId: number, score: number) {
    const child = await this.findById(childId);
    child.score = score;
    await this.save(child);
  }
  private createBaseChildQuery() {
    return this.childRepository
      .createQueryBuilder('child')
      .select('child.firstName', 'name')
      .addSelect('child.id', 'id')
      .addSelect('child.fatherName', 'fatherName')
      .addSelect('child.familyName', 'familyName')
      .addSelect('child.imageUrl', 'imageUrl')
      .addSelect('child.createdDate', 'joiningDate')
      .orderBy('RAND()');
  }

  private async getSponsoredChild() {
    const today = new Date().toISOString();
    const query = this.createBaseChildQuery()
      .leftJoin('child.relChildKafeels', 'relChildKafeels')
      .where('relChildKafeels.expirationDate >= :today', { today })
      .andWhere('relChildKafeels.id IS NOT NULL')
      .limit(2);

    return await query.getRawMany();
  }

  private async getChildrenWithoutSponsorship(limit: number) {
    const query = this.createBaseChildQuery()
      .leftJoin('child.relChildKafeels', 'relChildKafeels')
      .andWhere('relChildKafeels.id IS NULL')
      .limit(limit);

    return await query.getRawMany();
  }
  async getAdminChilds(
    pageRequest: PageRequest,
    first_name?: string,
    ageFrom?: number,
    ageTo?: number,
    sponsershipType?: SponsershipType,
    orphanClassification?: OrphanClassification,
    startDate?: string,
    endDate?: string,
    createdBy?: string,
    status?: 'PENDING' | 'APPROVED' | 'REJECTED'
  ) {
    const today = new Date().toISOString();
    const query = this.childRepository
      .createQueryBuilder('child')
      .leftJoin('child.childSponsorShip', 'childSponsorShip')
      .leftJoin('child.user', 'user')
      .leftJoin('child.childMaritalStatus', 'childMaritalStatus')
      .leftJoin('childSponsorShip.relSponsershipTypes', 'relSponsershipTypes')
      .leftJoin('relSponsershipTypes.sponsershipType', 'sponsershipType')
      .leftJoin('child.relChildKafeels', 'relChildKafeels')
      .select([
        'child.id',
        'child.gender',
        'child.age',
        'child.description',
        'child.address',
        'child.score',
        'child.fatherName',
        'child.familyName',
        'child.createdDate',
        'child.status',
        'childSponsorShip.id',
        'childSponsorShip.name',
        'childSponsorShip.minimumCost',
        'child.firstName',
        'child.imageUrl',
        'childMaritalStatus.id',
        'childMaritalStatus.orphanClassification',
        'relSponsershipTypes.id',
        'sponsershipType.type',
      ])
      .groupBy('child.id')
      .addGroupBy('childSponsorShip.id')
      .addGroupBy('childMaritalStatus.id')
      .addGroupBy('relSponsershipTypes.id')
      .addGroupBy('sponsershipType.type')
      .orderBy('child.score', 'DESC');

    if (createdBy) {
      query.andWhere('child.createdBy = :createdBy', { createdBy });
    }

    if (status) {
      query.andWhere('child.status = :status', { status });
    }

    if (first_name) {
      const lowerName = first_name.toLowerCase();

      query.andWhere(`LOWER(CONCAT(child.firstName, ' ', child.fatherName, ' ', child.familyName)) LIKE :name`, { name: `%${lowerName}%` });
    }
    if (Number(ageTo) && (Number(ageFrom) || Number(ageFrom) == 0)) {
      query.andWhere('child.age >= :ageFrom', { ageFrom: Number(ageFrom) }).andWhere('child.age <= :ageTo', { ageTo: Number(ageTo) });
    }

    if (startDate && !isNaN(new Date(startDate).getTime())) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      query.andWhere('child.createdDate >= :startDate', { startDate: start });
    }

    if (endDate && !isNaN(new Date(endDate).getTime())) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.andWhere('child.createdDate <= :endDate', { endDate: end });
    }

    if (sponsershipType) {
      query.andWhere('sponsershipType.type =:sponsershipType', { sponsershipType });
    }
    if (!isNaN(pageRequest.size) && pageRequest.size && pageRequest.size >= 0) {
      query.skip(pageRequest.page * pageRequest.size).take(pageRequest.size);
    }
    if (orphanClassification) {
      query.andWhere('childMaritalStatus.orphanClassification =:orphanClassification', { orphanClassification });
    }
    query.andWhere('childSponsorShip.id IS NOT NULL');

    const [data, count] = await query.getManyAndCount();

    for (const child of data) {
      const totalCostResult = await this.childRepository
        .createQueryBuilder('child')
        .leftJoin('child.relChildKafeels', 'relChildKafeels')
        .select(
          `SUM(
              CASE
                WHEN TIMESTAMPDIFF(YEAR, child.createdDate, :today) >= 1 THEN
                  CASE
                    WHEN relChildKafeels.expirationDate BETWEEN
                         DATE_ADD(child.createdDate, INTERVAL TIMESTAMPDIFF(YEAR, child.createdDate, :today) YEAR)
                         AND
                         DATE_ADD(child.createdDate, INTERVAL (TIMESTAMPDIFF(YEAR, child.createdDate, :today) + 1) YEAR)
                         AND relChildKafeels.status = 'ACCEPTED'
                    THEN relChildKafeels.cost
                    ELSE 0
                  END
                ELSE
                  CASE
                    WHEN (relChildKafeels.expirationDate > :today
                          OR relChildKafeels.expirationDate BETWEEN child.createdDate AND DATE_ADD(child.createdDate, INTERVAL 1 YEAR))
                      AND relChildKafeels.status = 'ACCEPTED'
                    THEN relChildKafeels.cost
                    ELSE 0
                  END
              END
            ) AS totalCost`,
        )
        .where('child.id = :childId', { childId: child.id })
        .setParameters({ today })
        .getRawOne();

      child.totalCost = parseFloat(totalCostResult.totalCost) || 0;
    }

    return { data, count };
  }

  async save(childDTO: ChildExtendedDTO, creator?: string): Promise<ChildExtendedDTO | undefined> {
    const entity = ChildExtendedMapper.fromDTOtoEntity(childDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.childRepository.save(entity);
    return ChildExtendedMapper.fromEntityToDTO(result);
  }
  async update(childDTO: ChildExtendedDTO, updater?: string): Promise<ChildExtendedDTO | undefined> {
    const entity = ChildExtendedMapper.fromDTOtoEntity(childDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.childRepository.save(entity);
    return ChildExtendedMapper.fromEntityToDTO(result);
  }

  async importChilds(childsDTO: any): Promise<any> {
    const { validData, filteredInvalidData } = await this.checkInvalidData(childsDTO);
    for (const childDTO of validData) {
      const newChild = this.createChildDTO(childDTO);
      const createdChild = await this.childRepository.save(newChild);

      await this.saveChildHealthStatus(childDTO, createdChild);

      await this.saveChildMaritalStatus(childDTO, createdChild);
      await this.saveChildSponsorship(childDTO, createdChild);
      await this.saveChildEducationStatus(childDTO, createdChild);
    }
    return filteredInvalidData;
  }

  private async isDuplicatedInDatabase(field: string, value: any, repository: any, userService: any, userField: any): Promise<boolean> {
    const isExistingInRepo = await repository.findOne({ where: { [field]: value } });
    const isExistingInUserService = await userService.find({ where: { [userField]: value } });
    return !!(isExistingInRepo || isExistingInUserService);
  }

  private async isDuplicatedInSet(
    set: Set<string>,
    value: any,
    field: string,
    repository: any,
    userService: any,
    userField: any,
  ): Promise<boolean> {
    if (set.has(value)) {
      return true;
    }
    set.add(value);
    return await this.isDuplicatedInDatabase(field, value, repository, userService, userField);
  }

  private hasMissingRequiredFields(child: any): boolean {
    const requiredFields = [
      'name*',
      'nationalId*',
      'fatherName*',
      'motherName*',
      'familyName*',
      'gender*',
      'description*',
      'address*',
      'age*',
      'Health Status*',
      'Chronic Disease*',
      'Has Disability*',
      'Has Mental Illness*',
      'Sychological Health*',
      'Date of Death*',
      'Orphan Classfication*',
      'SponsorshipName*',
      'Sponser Connection*',
      //'Sponsership Party*',
      'Sponsership Type*',
      'Minimum Cost*',
    ];
    return requiredFields.some(field => child[field] === undefined || child[field] === null || child[field] === '');
  }

  private async checkInvalidData(childsDTO: any): Promise<{ filteredInvalidData: any[]; validData: any[] }> {
    const emailSet = new Set<string>();
    const nationalIdSet = new Set<string>();
    let dateOfDeath: string | null = null;
    const invalidData = await Promise.all(
      childsDTO.map(async child => {
        const hasMissingFields = this.hasMissingRequiredFields(child);
        // const isDuplicatedEmail = child['email']
        //   ? await this.isDuplicatedInSet(emailSet, child['email'], 'email', this.childRepository, this.userService, 'email')
        //   : false;
        const isDuplicatedNationalId = child['nationalId*']
          ? await this.isDuplicatedInSet(
              nationalIdSet,
              child['nationalId*'],
              'nationalId',
              this.childRepository,
              this.userService,
              'national_id',
            )
          : false;
        const dateOfDeathValue = child['Date of Death*'];
        if (dateOfDeathValue) {
          if (typeof dateOfDeathValue === 'number') {
            const excelBaseDate = new Date(1900, 0, 1);
            const jsDate = new Date(excelBaseDate.getTime() + (dateOfDeathValue - 2) * 86400000);
            dateOfDeath = moment(jsDate).format('YYYY-MM-DD');
          } else if (moment(dateOfDeathValue, 'D-M-YYYY', true).isValid()) {
            dateOfDeath = moment(dateOfDeathValue, 'D-M-YYYY').format('YYYY-MM-DD');
          }
        }
        child['Date of Death*'] = dateOfDeath;
        return hasMissingFields || isDuplicatedNationalId ? child : null;
      }),
    );
    const filteredInvalidData = invalidData.filter(data => data !== null);
    const validData = childsDTO.filter(child => !invalidData.includes(child));
    return { filteredInvalidData, validData };
  }
  private processImage(image: any): string | null {
    const trimmedImage = typeof image === 'string' ? image.trim() : '';
    return trimmedImage ? `${process.env.PRESIGNED_IMAGE_URL}${trimmedImage}` : null;
  }

  private createChildDTO(childsDTO: any): ChildDTO {
    return {
      firstName: childsDTO['name*'] || '',
      imageUrl: this.processImage(childsDTO['childImage']),
      nationalId: childsDTO['nationalId*'] || '',
      nationalImage: this.processImage(childsDTO['nationalImage']),
      birthCertificate: this.processImage(childsDTO['birthCertificate']),
      email: childsDTO['email'] || '',
      fatherName: childsDTO['fatherName*'] || '',
      fatherPhone: '',
      brotherCode: '',
      motherName: childsDTO['motherName*'] || '',
      familyName: childsDTO['familyName*'] || '',
      gender: childsDTO['gender*'] || Gender.MALE,
      age: childsDTO['age*'] || 0,
      score: childsDTO.score,
      vedio: this.processImage(childsDTO['childVedio']),
      description: childsDTO['description*'] || '',
      address: childsDTO['address*'] || '',
      user: new UserDTO(),
      childNotes: [],
      relChildKafeels: [],
      childPrticipations: [],
      childHealthStatus: new ChildHealthStatusDTO(),
      childMaritalStatus: new ChildMaritalStatusDTO(),
      childEducationStatus: new ChildEducationStatusDTO(),
      childSponsorShip: new ChildSponsorShipDTO(),
      status: childsDTO['status'],
    };
  }

  private async saveChildHealthStatus(childsDTO: any, createdChild: ChildDTO): Promise<void> {
    const childHealthStatus: ChildHealthStatusDTO = {
      healthStatus: childsDTO['Health Status*'],
      chronicDisease: childsDTO['Chronic Disease*'] || false,
      hasDisability: childsDTO['Has Disability*'] || false,
      disabilityType: childsDTO['DisabilityType'] || DisabilityTypes.OTHER,
      disabilityImage: this.processImage(childsDTO['DisabilityImage']),
      hasMentalIllness: childsDTO['Has Mental Illness*'] || false,
      mentalIllnessType: childsDTO['MentalIllnessType'] || MentalIllnessTypes.OTHER,
      mentalIllnessImage: this.processImage(childsDTO['MentalIllnessImage']),
      sychologicalHealth: childsDTO['Sychological Health*'] || false,
      sychologicalHealthType: childsDTO['SychologicalHealthType'] || SychologicalHealthTypes.OTHER,
      sychologicalHealthImage: this.processImage(childsDTO['SychologicalHealthImage']),
      healthReport: '',
      child: createdChild,
      childHealthNotes: [],
    };
    await this.childHealthStatusExtendedService.save(childHealthStatus);
  }

  private async saveChildMaritalStatus(childsDTO: any, createdChild: ChildDTO): Promise<void> {
    const orphanClassificationValue =
      childsDTO['Orphan Classfication*'] === 'MOTHER_AND_FATHER'
        ? OrphanClassification.OTHER
        : (childsDTO['Orphan Classfication*'] as OrphanClassification);

    let dateOfDeath: string | null = null;
    // const dateOfDeathValue = childsDTO['Date of Death*'];
    // if (dateOfDeathValue) {
    //   if (typeof dateOfDeathValue === 'number') {
    //     // Convert Excel serial date to a JavaScript date
    //     const excelBaseDate = new Date(1900, 0, 1); // January 1, 1900
    //     const jsDate = new Date(excelBaseDate.getTime() + (dateOfDeathValue - 2) * 86400000); // Adjust for Excel offset
    //     dateOfDeath = moment(jsDate).format('YYYY-MM-DD');
    //   } else if (moment(dateOfDeathValue, 'D-M-YYYY', true).isValid()) {
    //     dateOfDeath = moment(dateOfDeathValue, 'D-M-YYYY').format('YYYY-MM-DD');
    //   }
    // }
    let score = 0;
    if (childsDTO['lostHousing']) {
      score += Diseases.lostHousing;
    }
    if (childsDTO['lostLimbs']) {
      score += Diseases.lostLimbs;
    }
    if (childsDTO['lostSight']) {
      score += Diseases.lostSight;
    }

    if (childsDTO['losthearorspeak']) {
      score += Diseases.Lostabilitytohearorspeak;
    }
    if (childsDTO['hasChronicDiseases']) {
      score += Diseases.chronicDiseases;
    }
    await this.updateScore(createdChild?.id, score);
    const childMaritalStatus: ChildMaritalStatusDTO = {
      orphanClassification: orphanClassificationValue,
      fatherDateOfDeath: childsDTO['Date of Death*'],
      dateOfBeathImage: this.processImage(childsDTO['DateOfBeathImage']),
      numOfSibiling: childsDTO['NumOfSibiling'] || 0,
      child: createdChild,
      childMaritalNotes: [],
      guardianName: childsDTO['guardianName'] || '',
      guardianNationalID: childsDTO['guardianNationalID'] || '',
      guardianRelationship: childsDTO['guardianRelationship'] || '',
      guardianDocument: childsDTO['guardianDocument'] || '',
      lostHousing: childsDTO['lostHousing'] || false,
      lostLimbs: childsDTO['lostLimbs'] || false,
      lostSight: childsDTO['lostSight'] || false,
      losthearorspeak: childsDTO['losthearorspeak'] || false,
      hasChronicDiseases: childsDTO['hasChronicDiseases'] || false,
    };
    await this.childMaritalStatusExtendedService.save(childMaritalStatus);
  }

  private async saveChildSponsorship(childsDTO: any, createdChild: ChildDTO): Promise<void> {
    console.log("childsDTO['Sponser Connection*']", childsDTO['Sponser Connection*']);

    const sponsershipTypeValue = childsDTO['Sponsership Type*'];
    const sponsershipTypes = Array.isArray(sponsershipTypeValue)
      ? sponsershipTypeValue
      : typeof sponsershipTypeValue === 'string'
        ? sponsershipTypeValue
            .replace(/[\[\]]/g, '')
            .split(',')
            .map(type => type.trim())
        : [];
    const childSponsorShip: ChildSponsorShipDTO = {
      name: childsDTO['SponsorshipName*'] || 'Sponsor Name',
      sponserConnection: childsDTO['Sponser Connection*'],
      sponsershipParty: childsDTO['Sponsership Party*'],
      sponsershipDuration: SponsershipDuration.ANNUAL,
      minimumCost: childsDTO['Minimum Cost*'] * 12,
      child: createdChild,
      childSponsorShipNotes: null,
      relSponsershipTypes: [],
      sponsershipType: childsDTO['Sponsership Type*'] || [],
    };
    const savedChildSponsorShip = await this.childSponsorShipExtendedService.save(childSponsorShip);
    const relSponsershipTypes = await Promise.all(
      sponsershipTypes?.map(async type => {
        const typeFound = await this.sponsershipTypesRepository.findOne({ where: { type: type } });
        return this.relSponsershipTypesRepository.save({
          sponsershipType: typeFound,
          childSponsorShip: savedChildSponsorShip,
        });
      }),
    );
    await this.relSponsershipTypesRepository.save(relSponsershipTypes);
  }

  private async saveChildEducationStatus(childsDTO: any, createdChild: ChildDTO): Promise<void> {
    const childEducationStatus: ChildEducationStatusDTO = {
      lastLevelOfEducation: childsDTO['LastLevelOfEducation'] || LastLevelOfEducation.NONE,
      hoppy: childsDTO['Hoppy'] || '',
      lastLevelOfEducationImage: this.processImage(childsDTO['LastLevelOfEducationImage']),
      child: createdChild,
      childEducationNotes: [],
    };
    await this.childEducationStatusExtendedService.save(childEducationStatus);
  }
  async deleteById(id: number): Promise<void | undefined> {
    await this.childRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
