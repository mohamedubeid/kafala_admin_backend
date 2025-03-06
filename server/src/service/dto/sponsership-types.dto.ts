/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { RelSponsershipTypesDTO } from './rel-sponsership-types.dto';

/**
 * A SponsershipTypesDTO object.
 */
export class SponsershipTypesDTO extends BaseDTO {
  @ApiProperty({ description: 'type field', required: false })
  type: string;

  @ApiProperty({ type: () => RelSponsershipTypesDTO, isArray: true, description: 'relSponsershipTypes relationship' })
  relSponsershipTypes: RelSponsershipTypesDTO[];

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
