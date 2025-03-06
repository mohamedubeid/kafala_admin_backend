/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { RelSponsershipTypes } from './rel-sponsership-types.entity';

/**
 * A SponsershipTypes.
 */
@Entity('sponsership_types')
export class SponsershipTypes extends BaseEntity {
  @Column({ name: 'type', nullable: true })
  type: string;

  @OneToMany(type => RelSponsershipTypes, other => other.sponsershipType)
  relSponsershipTypes: RelSponsershipTypes[];

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
