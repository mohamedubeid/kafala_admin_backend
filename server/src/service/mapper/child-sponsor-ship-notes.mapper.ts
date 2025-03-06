import { ChildSponsorShipNotes } from '../../domain/child-sponsor-ship-notes.entity';
import { ChildSponsorShipNotesDTO } from '../dto/child-sponsor-ship-notes.dto';

/**
 * A ChildSponsorShipNotes mapper object.
 */
export class ChildSponsorShipNotesMapper {
  static fromDTOtoEntity(entityDTO: ChildSponsorShipNotesDTO): ChildSponsorShipNotes {
    if (!entityDTO) {
      return;
    }
    let entity = new ChildSponsorShipNotes();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: ChildSponsorShipNotes): ChildSponsorShipNotesDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new ChildSponsorShipNotesDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
