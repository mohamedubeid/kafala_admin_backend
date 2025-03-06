import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { SettingDTO } from '../service/dto/setting.dto';
import { SettingMapper } from '../service/mapper/setting.mapper';
import { SettingRepository } from '../repository/setting.repository';

const relationshipNames = [];

@Injectable()
export class SettingExtendedService {
  logger = new Logger('SettingService');

  constructor(@InjectRepository(SettingRepository) private settingRepository: SettingRepository) {}

  async findByFields(options: FindOneOptions<SettingDTO>): Promise<SettingDTO | undefined> {
    const result = await this.settingRepository.findOne(options);
    return SettingMapper.fromEntityToDTO(result);
  }
  async findAndCount(options: FindManyOptions<SettingDTO>): Promise<[SettingDTO[], number]> {
    options.relations = relationshipNames;
    const resultList = await this.settingRepository.findAndCount(options);
    const settingDTO: SettingDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(setting => settingDTO.push(SettingMapper.fromEntityToDTO(setting)));
      resultList[0] = settingDTO;
    }
    return resultList;
  }
  async findById(id: number): Promise<SettingDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.settingRepository.findOne(id, options);
    return SettingMapper.fromEntityToDTO(result);
  }
  async update(settingDTO: SettingDTO, updater?: string): Promise<SettingDTO | undefined> {
    const entity = SettingMapper.fromDTOtoEntity(settingDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    const result = await this.settingRepository.save(entity);
    return SettingMapper.fromEntityToDTO(result);
  }
}
