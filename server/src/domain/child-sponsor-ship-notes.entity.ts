/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Notes } from './notes.entity';
import { ChildSponsorShip } from './child-sponsor-ship.entity';

/**
 * A ChildSponsorShipNotes.
 */
@Entity('child_sponsor_ship_notes')
export class ChildSponsorShipNotes extends BaseEntity {
  @OneToOne(type => Notes)
  @JoinColumn()
  notes: Notes;

  @ManyToOne(type => ChildSponsorShip)
  childSponsorShip: ChildSponsorShip;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
