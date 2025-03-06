import { EntityRepository, Repository } from 'typeorm';
import { Setting } from '../domain/setting.entity';

@EntityRepository(Setting)
export class SettingRepository extends Repository<Setting> {}
