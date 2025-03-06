import { Child } from '../../domain/child.entity';
import { ChildDTO } from '../dto/child.dto';

/**
 * A Child mapper object.
 */
export class ChildMapper {
  static fromDTOtoEntity(entityDTO: ChildDTO): Child {
    if (!entityDTO) {
      return;
    }
    let entity = new Child();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Child): ChildDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new ChildDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
