import { ChildMaritalStatus } from '../../domain/child-marital-status.entity';
import { ChildMaritalStatusDTO } from '../dto/child-marital-status.dto';

/**
 * A ChildMaritalStatus mapper object.
 */
export class ChildMaritalStatusMapper {
  static fromDTOtoEntity(entityDTO: ChildMaritalStatusDTO): ChildMaritalStatus {
    if (!entityDTO) {
      return;
    }
    let entity = new ChildMaritalStatus();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: ChildMaritalStatus): ChildMaritalStatusDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new ChildMaritalStatusDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
