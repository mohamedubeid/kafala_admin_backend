/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { NotesDTO } from './notes.dto';
import { ChildDTO } from './child.dto';

/**
 * A ChildNotesDTO object.
 */
export class ChildNotesDTO extends BaseDTO {
  @ApiProperty({ type: () => NotesDTO, description: 'notes relationship' })
  notes: NotesDTO;

  @ApiProperty({ type: () => ChildDTO, description: 'child relationship' })
  child: ChildDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
