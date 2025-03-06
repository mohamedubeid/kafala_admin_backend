/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { ParticipationTypes } from '../../domain/enumeration/participation-types';
import { BaseDTO } from './base.dto';

import { ChildDTO } from './child.dto';

/**
 * A ChildPrticipationsDTO object.
 */
export class ChildPrticipationsDTO extends BaseDTO {
  @ApiProperty({ enum: ParticipationTypes, description: 'participationType enum field', required: false })
  participationType: ParticipationTypes;

  @ApiProperty({ description: 'image field', required: false })
  image: string;

  @ApiProperty({ description: 'desceription field', required: false })
  desceription: string;

  @ApiProperty({ type: () => ChildDTO, description: 'child relationship' })
  child: ChildDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
