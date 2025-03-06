import { ChildSponsorShip } from '../../domain/child-sponsor-ship.entity';
import { ChildSponsorShipDTO } from '../dto/child-sponsor-ship.dto';

/**
 * A ChildSponsorShip mapper object.
 */
export class ChildSponsorShipMapper {
  static fromDTOtoEntity(entityDTO: ChildSponsorShipDTO): ChildSponsorShip {
    if (!entityDTO) {
      return;
    }
    let entity = new ChildSponsorShip();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: ChildSponsorShip): ChildSponsorShipDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new ChildSponsorShipDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
