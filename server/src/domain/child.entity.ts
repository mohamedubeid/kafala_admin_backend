/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { ChildNotes } from './child-notes.entity';
import { RelChildKafeel } from './rel-child-kafeel.entity';
import { ChildPrticipations } from './child-prticipations.entity';
import { ChildHealthStatus } from './child-health-status.entity';
import { ChildMaritalStatus } from './child-marital-status.entity';
import { ChildEducationStatus } from './child-education-status.entity';
import { ChildSponsorShip } from './child-sponsor-ship.entity';
import { Gender } from './enumeration/gender';

import { User } from './user.entity';
import { ChildStatus } from './enumeration/child-status';

/**
 * A Child.
 */
@Entity('child')
export class Child extends BaseEntity {
  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @Column({ name: 'national_id', nullable: true })
  nationalId: string;

  @Column({ name: 'national_image', nullable: true })
  nationalImage: string;

  @Column({ name: 'birth_certificate', nullable: true })
  birthCertificate: string;

  @Column({ name: 'email', nullable: true })
  email: string;

  @Column({ name: 'father_name', nullable: true })
  fatherName: string;

  @Column({ name: 'father_phone', nullable: true })
  fatherPhone: string;

  @Column({ name: 'brother_code', nullable: true })
  brotherCode: string;

  @Column({ name: 'mother_name', nullable: true })
  motherName: string;

  @Column({ name: 'family_name', nullable: true })
  familyName: string;

  @Column({ type: 'simple-enum', name: 'gender', enum: Gender })
  gender: Gender;

  @Column({ type: 'integer', name: 'age', nullable: true })
  age: number;

  @Column({ name: 'vedio', nullable: true })
  vedio: string;

  @Column({ type: 'blob', name: 'description', nullable: true })
  description: any;

  @Column({ name: 'address', nullable: true })
  address: string;

  @Column({ type: 'float', name: 'score', nullable: true })
  score: number;

  @Column({ type: 'simple-enum', name: 'status', enum: ChildStatus })
  status: ChildStatus;

  @OneToOne(type => User)
  @JoinColumn()
  user: User;

  @OneToMany(type => ChildNotes, other => other.child)
  childNotes: ChildNotes[];

  @OneToMany(type => RelChildKafeel, other => other.child)
  relChildKafeels: RelChildKafeel[];

  @OneToMany(type => ChildPrticipations, other => other.child)
  childPrticipations: ChildPrticipations[];

  @OneToOne(() => ChildHealthStatus, childHealthStatus => childHealthStatus.child)
  childHealthStatus: ChildHealthStatus;

  @OneToOne(type => ChildMaritalStatus, childMaritalStatus => childMaritalStatus.child)
  childMaritalStatus: ChildMaritalStatus;

  @OneToOne(type => ChildEducationStatus, childEducationStatus => childEducationStatus.child)
  childEducationStatus: ChildEducationStatus;

  @OneToOne(type => ChildSponsorShip, childSponsorShip => childSponsorShip.child)
  childSponsorShip: ChildSponsorShip;
  totalCost?: number;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
