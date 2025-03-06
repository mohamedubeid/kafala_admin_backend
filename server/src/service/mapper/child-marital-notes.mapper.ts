import { ChildMaritalNotes } from '../../domain/child-marital-notes.entity';
import { ChildMaritalNotesDTO } from '../dto/child-marital-notes.dto';

/**
 * A ChildMaritalNotes mapper object.
 */
export class ChildMaritalNotesMapper {
  static fromDTOtoEntity(entityDTO: ChildMaritalNotesDTO): ChildMaritalNotes {
    if (!entityDTO) {
      return;
    }
    let entity = new ChildMaritalNotes();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: ChildMaritalNotes): ChildMaritalNotesDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new ChildMaritalNotesDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
