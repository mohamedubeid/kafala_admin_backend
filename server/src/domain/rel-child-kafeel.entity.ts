/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Child } from './child.entity';
import { Kafeel } from './kafeel.entity';
import { SponsershipDuration } from './enumeration/sponsership-duration';
import { RelChildKafeelStatus } from './enumeration/rel-child-kafeel-status';

/**
 * A RelChildKafeel.
 */
@Entity('rel_child_kafeel')
export class RelChildKafeel extends BaseEntity {
  @Column({ type: 'simple-enum', name: 'duration', enum: SponsershipDuration })
  duration: SponsershipDuration;

  @Column({ type: 'float', name: 'cost', nullable: true })
  cost: number;

  @Column({ type: 'date', name: 'expiration_date', nullable: true })
  expirationDate: any;

  @Column({ type: 'date', name: 'start_date', nullable: true })
  startDate: any;

  @Column({ type: 'simple-enum', name: 'status', enum: RelChildKafeelStatus })
  status: RelChildKafeelStatus;

  @ManyToOne(type => Child)
  child: Child;

  @ManyToOne(type => Kafeel)
  kafeel: Kafeel;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
