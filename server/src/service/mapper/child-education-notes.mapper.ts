import { ChildEducationNotes } from '../../domain/child-education-notes.entity';
import { ChildEducationNotesDTO } from '../dto/child-education-notes.dto';

/**
 * A ChildEducationNotes mapper object.
 */
export class ChildEducationNotesMapper {
  static fromDTOtoEntity(entityDTO: ChildEducationNotesDTO): ChildEducationNotes {
    if (!entityDTO) {
      return;
    }
    let entity = new ChildEducationNotes();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: ChildEducationNotes): ChildEducationNotesDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new ChildEducationNotesDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
