import { Child } from '../../domain/child.entity';
import { ChildDTO } from '../dto/child.dto';
import { ChildExtendedDTO } from '../dto/child.extend.dto';

/**
 * A Child mapper object.
 */
export class ChildExtendedMapper {
  static fromDTOtoEntity(entityDTO: ChildExtendedDTO): Child {
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

  static fromEntityToDTO(entity: Child): ChildExtendedDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new ChildExtendedDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
