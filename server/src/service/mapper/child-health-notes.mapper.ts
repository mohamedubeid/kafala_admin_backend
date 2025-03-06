import { ChildHealthNotes } from '../../domain/child-health-notes.entity';
import { ChildHealthNotesDTO } from '../dto/child-health-notes.dto';

/**
 * A ChildHealthNotes mapper object.
 */
export class ChildHealthNotesMapper {
  static fromDTOtoEntity(entityDTO: ChildHealthNotesDTO): ChildHealthNotes {
    if (!entityDTO) {
      return;
    }
    let entity = new ChildHealthNotes();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: ChildHealthNotes): ChildHealthNotesDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new ChildHealthNotesDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
