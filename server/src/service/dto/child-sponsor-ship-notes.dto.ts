/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { NotesDTO } from './notes.dto';
import { ChildSponsorShipDTO } from './child-sponsor-ship.dto';

/**
 * A ChildSponsorShipNotesDTO object.
 */
export class ChildSponsorShipNotesDTO extends BaseDTO {
  @ApiProperty({ type: () => NotesDTO, description: 'notes relationship' })
  notes: NotesDTO;

  @ApiProperty({ type: () => ChildSponsorShipDTO, description: 'childSponsorShip relationship' })
  childSponsorShip: ChildSponsorShipDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
