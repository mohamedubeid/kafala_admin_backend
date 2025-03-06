import { RelChildKafeel } from '../../domain/rel-child-kafeel.entity';
import { RelChildKafeelDTO } from '../dto/rel-child-kafeel.dto';

/**
 * A RelChildKafeel mapper object.
 */
export class RelChildKafeelMapper {
  static fromDTOtoEntity(entityDTO: RelChildKafeelDTO): RelChildKafeel {
    if (!entityDTO) {
      return;
    }
    let entity = new RelChildKafeel();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: RelChildKafeel): RelChildKafeelDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new RelChildKafeelDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
