/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { NotesDTO } from './notes.dto';
import { ChildHealthStatusDTO } from './child-health-status.dto';

/**
 * A ChildHealthNotesDTO object.
 */
export class ChildHealthNotesDTO extends BaseDTO {
  @ApiProperty({ type: () => NotesDTO, description: 'notes relationship' })
  notes: NotesDTO;

  @ApiProperty({ type: () => ChildHealthStatusDTO, description: 'childHealthStatus relationship' })
  childHealthStatus: ChildHealthStatusDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
