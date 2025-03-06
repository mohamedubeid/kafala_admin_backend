/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Child } from './child.entity';
import { ChildSponsorShipNotes } from './child-sponsor-ship-notes.entity';
import { RelSponsershipTypes } from './rel-sponsership-types.entity';
import { SponserConnection } from './enumeration/sponser-connection';
import { SponsershipParty } from './enumeration/sponsership-party';
import { SponsershipDuration } from './enumeration/sponsership-duration';

/**
 * A ChildSponsorShip.
 */
@Entity('child_sponsor_ship')
export class ChildSponsorShip extends BaseEntity {
  @Column({ name: 'name', nullable: true })
  name: string;

  @Column({ type: 'simple-enum', name: 'sponser_connection', enum: SponserConnection })
  sponserConnection: SponserConnection;

  @Column({ type: 'simple-enum', name: 'sponsership_party', enum: SponsershipParty })
  sponsershipParty: SponsershipParty;

  @Column({ type: 'simple-enum', name: 'sponsership_duration', enum: SponsershipDuration })
  sponsershipDuration: SponsershipDuration;

  @Column({ type: 'float', name: 'minimum_cost', nullable: true })
  minimumCost: number;

  @OneToOne(type => Child)
  @JoinColumn()
  child: Child;

  @OneToMany(type => ChildSponsorShipNotes, other => other.childSponsorShip)
  childSponsorShipNotes: ChildSponsorShipNotes[];

  @OneToMany(type => RelSponsershipTypes, other => other.childSponsorShip)
  relSponsershipTypes: RelSponsershipTypes[];

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
