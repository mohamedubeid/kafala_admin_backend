import { ChildEducationStatus } from '../../domain/child-education-status.entity';
import { ChildEducationStatusDTO } from '../dto/child-education-status.dto';

/**
 * A ChildEducationStatus mapper object.
 */
export class ChildEducationStatusMapper {
  static fromDTOtoEntity(entityDTO: ChildEducationStatusDTO): ChildEducationStatus {
    if (!entityDTO) {
      return;
    }
    let entity = new ChildEducationStatus();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: ChildEducationStatus): ChildEducationStatusDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new ChildEducationStatusDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
