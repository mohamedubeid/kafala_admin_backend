import { RelSponsershipTypes } from '../../domain/rel-sponsership-types.entity';
import { RelSponsershipTypesDTO } from '../dto/rel-sponsership-types.dto';

/**
 * A RelSponsershipTypes mapper object.
 */
export class RelSponsershipTypesMapper {
  static fromDTOtoEntity(entityDTO: RelSponsershipTypesDTO): RelSponsershipTypes {
    if (!entityDTO) {
      return;
    }
    let entity = new RelSponsershipTypes();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: RelSponsershipTypes): RelSponsershipTypesDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new RelSponsershipTypesDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
