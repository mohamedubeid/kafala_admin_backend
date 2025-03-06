/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { SponsershipTypes } from './sponsership-types.entity';
import { ChildSponsorShip } from './child-sponsor-ship.entity';

/**
 * A RelSponsershipTypes.
 */
@Entity('rel_sponsership_types')
export class RelSponsershipTypes extends BaseEntity {
  @ManyToOne(type => SponsershipTypes)
  sponsershipType: SponsershipTypes;

  @ManyToOne(type => ChildSponsorShip)
  childSponsorShip: ChildSponsorShip;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
