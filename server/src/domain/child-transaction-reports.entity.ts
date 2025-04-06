/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Child } from './child.entity';
import { ChildTransactionRreportsStatus } from './enumeration/child-transaction-reports-status';

/**
 * A ChildTransactionReports.
 */
@Entity('child_transaction_report')
export class ChildTransactionReports extends BaseEntity {

  @Column({ type: 'float', name: 'amount_received', nullable: true })
  amount_received: number;

  @Column({ name: 'image', nullable: true })
  image: string;

  @Column({ name: 'video', nullable: true })
  video: string;

  @Column({ name: 'desceription', nullable: true })
  desceription: string;

  @Column({ type: 'simple-enum', name: 'status', enum: ChildTransactionRreportsStatus })
  status: ChildTransactionRreportsStatus;

  @ManyToOne(type => Child)
  child: Child;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
