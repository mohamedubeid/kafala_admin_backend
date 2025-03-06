import { ChildPrticipations } from '../../domain/child-prticipations.entity';
import { ChildPrticipationsDTO } from '../dto/child-prticipations.dto';

/**
 * A ChildPrticipations mapper object.
 */
export class ChildPrticipationsMapper {
  static fromDTOtoEntity(entityDTO: ChildPrticipationsDTO): ChildPrticipations {
    if (!entityDTO) {
      return;
    }
    let entity = new ChildPrticipations();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: ChildPrticipations): ChildPrticipationsDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new ChildPrticipationsDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
