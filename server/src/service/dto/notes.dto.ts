/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { ChildHealthNotesDTO } from './child-health-notes.dto';
import { ChildMaritalNotesDTO } from './child-marital-notes.dto';
import { ChildEducationNotesDTO } from './child-education-notes.dto';
import { ChildSponsorShipNotesDTO } from './child-sponsor-ship-notes.dto';
import { ChildNotesDTO } from './child-notes.dto';

/**
 * A NotesDTO object.
 */
export class NotesDTO extends BaseDTO {
  @ApiProperty({ description: 'note field', required: false })
  note: any;

  @ApiProperty({ type: () => ChildHealthNotesDTO, description: 'childHealthNotes relationship' })
  childHealthNotes: ChildHealthNotesDTO;

  @ApiProperty({ type: () => ChildMaritalNotesDTO, description: 'childMaritalNotes relationship' })
  childMaritalNotes: ChildMaritalNotesDTO;

  @ApiProperty({ type: () => ChildEducationNotesDTO, description: 'childEducationNotes relationship' })
  childEducationNotes: ChildEducationNotesDTO;

  @ApiProperty({ type: () => ChildSponsorShipNotesDTO, description: 'childSponsorShipNotes relationship' })
  childSponsorShipNotes: ChildSponsorShipNotesDTO;

  @ApiProperty({ type: () => ChildNotesDTO, description: 'childNotes relationship' })
  childNotes: ChildNotesDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
