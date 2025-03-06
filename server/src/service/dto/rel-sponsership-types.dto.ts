/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { SponsershipTypesDTO } from './sponsership-types.dto';
import { ChildSponsorShipDTO } from './child-sponsor-ship.dto';

/**
 * A RelSponsershipTypesDTO object.
 */
export class RelSponsershipTypesDTO extends BaseDTO {
  @ApiProperty({ type: () => SponsershipTypesDTO, description: 'sponsershipType relationship' })
  sponsershipType: SponsershipTypesDTO;

  @ApiProperty({ type: () => ChildSponsorShipDTO, description: 'childSponsorShip relationship' })
  childSponsorShip: ChildSponsorShipDTO;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
