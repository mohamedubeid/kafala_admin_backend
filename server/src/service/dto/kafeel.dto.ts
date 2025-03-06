/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { RelChildKafeelDTO } from './rel-child-kafeel.dto';

import { UserDTO } from './user.dto';

/**
 * A KafeelDTO object.
 */
export class KafeelDTO extends BaseDTO {
  @ApiProperty({ type: () => UserDTO, description: 'user relationship' })
  user: UserDTO;

  @ApiProperty({ type: () => RelChildKafeelDTO, isArray: true, description: 'relChildKafeels relationship' })
  relChildKafeels: RelChildKafeelDTO[];

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
