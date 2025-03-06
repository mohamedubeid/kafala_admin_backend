/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { NotesDTO } from './notes.dto';
import { ChildMaritalStatusDTO } from './child-marital-status.dto';

/**
 * A ChildMaritalNotesDTO object.
 */
export class ChildMaritalNotesDTO extends BaseDTO {
  @ApiProperty({ type: () => NotesDTO, description: 'notes relationship' })
  notes: NotesDTO;

  @ApiProperty({ type: () => ChildMaritalStatusDTO, description: 'childMaritalStatus relationship' })
  childMaritalStatus: ChildMaritalStatusDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
