/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { RelChildKafeel } from './rel-child-kafeel.entity';

import { User } from './user.entity';

/**
 * A Kafeel.
 */
@Entity('kafeel')
export class Kafeel extends BaseEntity {
  @OneToOne(type => User)
  @JoinColumn()
  user: User;

  @OneToMany(type => RelChildKafeel, other => other.kafeel)
  relChildKafeels: RelChildKafeel[];

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
