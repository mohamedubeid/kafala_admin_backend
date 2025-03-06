/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { SponsershipDuration } from '../../domain/enumeration/sponsership-duration';
import { BaseDTO } from './base.dto';

import { ChildDTO } from './child.dto';
import { KafeelDTO } from './kafeel.dto';
import { RelChildKafeelStatus } from '../../domain/enumeration/rel-child-kafeel-status';

/**
 * A RelChildKafeelDTO object.
 */
export class RelChildKafeelDTO extends BaseDTO {
  @ApiProperty({ enum: SponsershipDuration, description: 'duration enum field', required: false })
  duration: SponsershipDuration;

  @ApiProperty({ description: 'cost field', required: false })
  cost: number;

  @ApiProperty({ enum: RelChildKafeelStatus, description: 'duration enum field', required: false })
  status: RelChildKafeelStatus;

  @ApiProperty({ description: 'expirationDate field', required: false })
  expirationDate: any;

  @ApiProperty({ description: 'startDate field', required: false })
  startDate: any;

  @ApiProperty({ type: () => ChildDTO, description: 'child relationship' })
  child: ChildDTO;

  @ApiProperty({ type: () => KafeelDTO, description: 'kafeel relationship' })
  kafeel: KafeelDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
