/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { LastLevelOfEducation } from '../../domain/enumeration/last-level-of-education';
import { BaseDTO } from './base.dto';

import { ChildDTO } from './child.dto';
import { ChildEducationNotesDTO } from './child-education-notes.dto';

/**
 * A ChildEducationStatusDTO object.
 */
export class ChildEducationStatusDTO extends BaseDTO {
  @ApiProperty({ enum: LastLevelOfEducation, description: 'lastLevelOfEducation enum field', required: false })
  lastLevelOfEducation: LastLevelOfEducation;

  @ApiProperty({ description: 'hoppy field', required: false })
  hoppy: string;

  @ApiProperty({ description: 'lastLevelOfEducationImage field', required: false })
  lastLevelOfEducationImage: string;

  @ApiProperty({ type: () => ChildDTO, description: 'child relationship' })
  child: ChildDTO;

  @ApiProperty({ type: () => ChildEducationNotesDTO, isArray: true, description: 'childEducationNotes relationship' })
  childEducationNotes: ChildEducationNotesDTO[];

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
