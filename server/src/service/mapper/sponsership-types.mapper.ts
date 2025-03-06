import { SponsershipTypes } from '../../domain/sponsership-types.entity';
import { SponsershipTypesDTO } from '../dto/sponsership-types.dto';

/**
 * A SponsershipTypes mapper object.
 */
export class SponsershipTypesMapper {
  static fromDTOtoEntity(entityDTO: SponsershipTypesDTO): SponsershipTypes {
    if (!entityDTO) {
      return;
    }
    let entity = new SponsershipTypes();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: SponsershipTypes): SponsershipTypesDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new SponsershipTypesDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
