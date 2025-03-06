import { ChildHealthStatus } from '../../domain/child-health-status.entity';
import { ChildHealthStatusDTO } from '../dto/child-health-status.dto';

/**
 * A ChildHealthStatus mapper object.
 */
export class ChildHealthStatusMapper {
  static fromDTOtoEntity(entityDTO: ChildHealthStatusDTO): ChildHealthStatus {
    if (!entityDTO) {
      return;
    }
    let entity = new ChildHealthStatus();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: ChildHealthStatus): ChildHealthStatusDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new ChildHealthStatusDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
