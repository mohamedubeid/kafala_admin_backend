/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

/**
 * A SettingDTO object.
 */
export class SettingDTO extends BaseDTO {
  @ApiProperty({ description: 'key field', required: false })
  key: string;

  @ApiProperty({ description: 'value field', required: false })
  value: any;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
