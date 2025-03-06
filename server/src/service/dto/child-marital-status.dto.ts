/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { OrphanClassification } from '../../domain/enumeration/orphan-classification';
import { BaseDTO } from './base.dto';

import { ChildDTO } from './child.dto';
import { ChildMaritalNotesDTO } from './child-marital-notes.dto';

/**
 * A ChildMaritalStatusDTO object.
 */
export class ChildMaritalStatusDTO extends BaseDTO {
  @ApiProperty({ enum: OrphanClassification, description: 'orphanClassification enum field', required: false })
  orphanClassification: OrphanClassification;

  @ApiProperty({ description: 'fatherDateOfDeath field', required: false })
  fatherDateOfDeath: any;

  @ApiProperty({ description: 'guardianName field', required: false })
  guardianName: string;

  @ApiProperty({ description: 'guardianNationalID field', required: false })
  guardianNationalID: string;

  @ApiProperty({ description: 'guardianRelationship field', required: false })
  guardianRelationship: string;

  @ApiProperty({ description: 'guardianDocument field', required: false })
  guardianDocument: string;

  @ApiProperty({ description: 'dateOfBeathImage field', required: false })
  dateOfBeathImage: string;

  @ApiProperty({ description: 'numOfSibiling field', required: false })
  numOfSibiling: number;

  @ApiProperty({ description: 'lostHousing field', required: false })
  lostHousing: boolean;

  @ApiProperty({ description: 'lostLimbs field', required: false })
  lostLimbs: boolean;

  @ApiProperty({ description: 'lostSight field', required: false })
  lostSight: boolean;

  @ApiProperty({ description: 'losthearorspeak field', required: false })
  losthearorspeak: boolean;

  @ApiProperty({ description: 'hasChronicDiseases field', required: false })
  hasChronicDiseases: boolean;

  @ApiProperty({ type: () => ChildDTO, description: 'child relationship' })
  child: ChildDTO;

  @ApiProperty({ type: () => ChildMaritalNotesDTO, isArray: true, description: 'childMaritalNotes relationship' })
  childMaritalNotes: ChildMaritalNotesDTO[];

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
