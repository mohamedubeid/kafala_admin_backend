/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { SponserConnection } from '../../domain/enumeration/sponser-connection';
import { SponsershipParty } from '../../domain/enumeration/sponsership-party';
import { SponsershipDuration } from '../../domain/enumeration/sponsership-duration';
import { BaseDTO } from './base.dto';

import { ChildDTO } from './child.dto';
import { ChildSponsorShipNotesDTO } from './child-sponsor-ship-notes.dto';
import { RelSponsershipTypesDTO } from './rel-sponsership-types.dto';

/**
 * A ChildSponsorShipDTO object.
 */
export class ChildSponsorShipDTO extends BaseDTO {
  @ApiProperty({ description: 'name field', required: false })
  name: string;

  @ApiProperty({ enum: SponserConnection, description: 'sponserConnection enum field', required: false })
  sponserConnection: SponserConnection;

  @ApiProperty({ enum: SponsershipParty, description: 'sponsershipParty enum field', required: false })
  sponsershipParty: SponsershipParty;

  @ApiProperty({ enum: SponsershipDuration, description: 'sponsershipDuration enum field', required: false })
  sponsershipDuration: SponsershipDuration;

  @ApiProperty({ description: 'minimumCost field', required: false })
  minimumCost: number;

  @ApiProperty({ type: () => ChildDTO, description: 'child relationship' })
  child: ChildDTO;

  @ApiProperty({ type: () => ChildSponsorShipNotesDTO, isArray: true, description: 'childSponsorShipNotes relationship' })
  childSponsorShipNotes: ChildSponsorShipNotesDTO[];

  @ApiProperty({ type: () => RelSponsershipTypesDTO, isArray: true, description: 'relSponsershipTypes relationship' })
  relSponsershipTypes: RelSponsershipTypesDTO[];

  @ApiProperty({ type: () => RelSponsershipTypesDTO, isArray: true, description: 'relSponsershipTypes relationship' })
  sponsershipType?:[];

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
