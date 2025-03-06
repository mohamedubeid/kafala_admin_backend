import { ChildNotes } from '../../domain/child-notes.entity';
import { ChildNotesDTO } from '../dto/child-notes.dto';

/**
 * A ChildNotes mapper object.
 */
export class ChildNotesMapper {
  static fromDTOtoEntity(entityDTO: ChildNotesDTO): ChildNotes {
    if (!entityDTO) {
      return;
    }
    let entity = new ChildNotes();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: ChildNotes): ChildNotesDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new ChildNotesDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
