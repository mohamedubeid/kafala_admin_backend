/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { ChildDTO } from './child.dto';
import { ChildTransactionRreportsStatus } from '../../domain/enumeration/child-transaction-reports-status';

/**
 * A ChildTransactionReportsDTO object.
 */
export class ChildTransactionReportsDTO extends BaseDTO {

  @ApiProperty({ description: 'received amount field', required: false })
  amount_received: number;

  @ApiProperty({ description: 'image field', required: false })
  image: string;

  @ApiProperty({ description: 'Video field', required: false })
  video: string;

  @ApiProperty({ description: 'desceription field', required: false })
  desceription: string;

  @ApiProperty({ enum: ChildTransactionRreportsStatus, description: 'duration enum field', required: false })
  status: ChildTransactionRreportsStatus;

  @ApiProperty({ type: () => ChildDTO, description: 'child relationship' })
  child: ChildDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
