import { Kafeel } from '../../domain/kafeel.entity';
import { KafeelDTO } from '../dto/kafeel.dto';

/**
 * A Kafeel mapper object.
 */
export class KafeelMapper {
  static fromDTOtoEntity(entityDTO: KafeelDTO): Kafeel {
    if (!entityDTO) {
      return;
    }
    let entity = new Kafeel();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Kafeel): KafeelDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new KafeelDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
