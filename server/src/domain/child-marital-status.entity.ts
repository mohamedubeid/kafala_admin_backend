/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Child } from './child.entity';
import { ChildMaritalNotes } from './child-marital-notes.entity';
import { OrphanClassification } from './enumeration/orphan-classification';

/**
 * A ChildMaritalStatus.
 */
@Entity('child_marital_status')
export class ChildMaritalStatus extends BaseEntity {
  @Column({ type: 'simple-enum', name: 'orphan_classification', enum: OrphanClassification })
  orphanClassification: OrphanClassification;

  @Column({ type: 'date', name: 'father_date_of_death', nullable: true })
  fatherDateOfDeath: any;

  @Column({ name: 'guardian_name', nullable: true })
  guardianName: string;

  @Column({ name: 'guardian_national_id', nullable: true })
  guardianNationalID: string;

  @Column({ name: 'guardian_relationship', nullable: true })
  guardianRelationship: string;

  @Column({ name: 'guardian_document', nullable: true })
  guardianDocument: string;

  @Column({ name: 'date_of_beath_image', nullable: true })
  dateOfBeathImage: string;

  @Column({ type: 'integer', name: 'num_of_sibiling', nullable: true })
  numOfSibiling: number;

  @Column({ type: 'boolean', name: 'lost_housing', nullable: true })
  lostHousing: boolean;

  @Column({ type: 'boolean', name: 'lost_limbs', nullable: true })
  lostLimbs: boolean;

  @Column({ type: 'boolean', name: 'lost_sight', nullable: true })
  lostSight: boolean;

  @Column({ type: 'boolean', name: 'losthearorspeak', nullable: true })
  losthearorspeak: boolean;

  @Column({ type: 'boolean', name: 'has_chronic_diseases', nullable: true })
  hasChronicDiseases: boolean;

  @OneToOne(type => Child)
  @JoinColumn()
  child: Child;

  @OneToMany(type => ChildMaritalNotes, other => other.childMaritalStatus)
  childMaritalNotes: ChildMaritalNotes[];

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
