import { ChildTransactionReports } from '../../domain/child-transaction-reports.entity';
import { ChildTransactionReportsDTO } from '../dto/child-transaction-reports.dto';

/**
 * A ChildPrticipations mapper object.
 */
export class ChildTransactionReportsMapper {
  static fromDTOtoEntity(entityDTO: ChildTransactionReportsDTO): ChildTransactionReports {
    if (!entityDTO) {
      return;
    }
    let entity = new ChildTransactionReports();
    const fields = Object.getOwnPropertyNames(entityDTO);
    fields.forEach(field => {
      entity[field] = entityDTO[field];
    });
    return entity;
  }

  static fromEntityToDTO(entity: ChildTransactionReports): ChildTransactionReportsDTO {
    if (!entity) {
      return;
    }
    let entityDTO = new ChildTransactionReportsDTO();

    const fields = Object.getOwnPropertyNames(entity);

    fields.forEach(field => {
      entityDTO[field] = entity[field];
    });

    return entityDTO;
  }
}
