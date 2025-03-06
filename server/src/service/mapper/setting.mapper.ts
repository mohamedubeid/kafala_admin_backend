import { Setting } from '../../domain/setting.entity';
import { SettingDTO } from '../dto/setting.dto';

/**
 * A Setting mapper object.
 */
export class SettingMapper {
  static fromDTOtoEntity(entityDTO: SettingDTO): Setting {
    if (!entityDTO) {
      return;
    }
    let entity = new Setting();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Setting): SettingDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new SettingDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
