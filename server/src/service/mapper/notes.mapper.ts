import { Notes } from '../../domain/notes.entity';
import { NotesDTO } from '../dto/notes.dto';

/**
 * A Notes mapper object.
 */
export class NotesMapper {
  static fromDTOtoEntity(entityDTO: NotesDTO): Notes {
    if (!entityDTO) {
      return;
    }
    let entity = new Notes();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: Notes): NotesDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new NotesDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
