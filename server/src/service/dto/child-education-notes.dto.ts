/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { NotesDTO } from './notes.dto';
import { ChildEducationStatusDTO } from './child-education-status.dto';

/**
 * A ChildEducationNotesDTO object.
 */
export class ChildEducationNotesDTO extends BaseDTO {
  @ApiProperty({ type: () => NotesDTO, description: 'notes relationship' })
  notes: NotesDTO;

  @ApiProperty({ type: () => ChildEducationStatusDTO, description: 'childEducationStatus relationship' })
  childEducationStatus: ChildEducationStatusDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
