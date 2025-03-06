import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ChildSponsorShipNotesDTO } from '../service/dto/child-sponsor-ship-notes.dto';
import { ChildSponsorShipNotesMapper } from '../service/mapper/child-sponsor-ship-notes.mapper';
import { ChildSponsorShipNotesRepository } from '../repository/child-sponsor-ship-notes.repository';

const relationshipNames = [];
relationshipNames.push('childSponsorShip');

@Injectable()
export class ChildSponsorShipNotesExtendedService {
  logger = new Logger('ChildSponsorShipNotesService');

  constructor(
    @InjectRepository(ChildSponsorShipNotesRepository) private childSponsorShipNotesRepository: ChildSponsorShipNotesRepository,
  ) {}

  async findAllNotesBySponsorship(childSponsorShipId: number): Promise<ChildSponsorShipNotesDTO[]> {
    return await this.childSponsorShipNotesRepository
      .createQueryBuilder('childSponsorShipNotes')
      .leftJoinAndSelect('childSponsorShipNotes.notes', 'notes')
      .where('childSponsorShipNotes.childSponsorShipId = :childSponsorShipId', { childSponsorShipId })
      .getMany();
  }
  async findById(id: number): Promise<ChildSponsorShipNotesDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.childSponsorShipNotesRepository.findOne(id, options);
    return ChildSponsorShipNotesMapper.fromEntityToDTO(result);
  }

}
