import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './child.reducer';

export const ChildDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const childEntity = useAppSelector(state => state.child.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="childDetailsHeading">
          <Translate contentKey="kafalaApp.child.detail.title">Child</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{childEntity.id}</dd>
          <dt>
            <span id="firstName">
              <Translate contentKey="kafalaApp.child.firstName">First Name</Translate>
            </span>
          </dt>
          <dd>{childEntity.firstName}</dd>
          <dt>
            <span id="imageUrl">
              <Translate contentKey="kafalaApp.child.imageUrl">Image Url</Translate>
            </span>
          </dt>
          <dd>{childEntity.imageUrl}</dd>
          <dt>
            <span id="nationalId">
              <Translate contentKey="kafalaApp.child.nationalId">National Id</Translate>
            </span>
          </dt>
          <dd>{childEntity.nationalId}</dd>
          <dt>
            <span id="nationalImage">
              <Translate contentKey="kafalaApp.child.nationalImage">National Image</Translate>
            </span>
          </dt>
          <dd>{childEntity.nationalImage}</dd>
          <dt>
            <span id="birthCertificate">
              <Translate contentKey="kafalaApp.child.birthCertificate">Birth Certificate</Translate>
            </span>
          </dt>
          <dd>{childEntity.birthCertificate}</dd>
          <dt>
            <span id="email">
              <Translate contentKey="kafalaApp.child.email">Email</Translate>
            </span>
          </dt>
          <dd>{childEntity.email}</dd>
          <dt>
            <span id="fatherName">
              <Translate contentKey="kafalaApp.child.fatherName">Father Name</Translate>
            </span>
          </dt>
          <dd>{childEntity.fatherName}</dd>
          <dt>
            <span id="fatherPhone">
              <Translate contentKey="kafalaApp.child.fatherPhone">Father Phone</Translate>
            </span>
          </dt>
          <dd>{childEntity.fatherPhone}</dd>
          <dt>
            <span id="brotherCode">
              <Translate contentKey="kafalaApp.child.brotherCode">Brother Code</Translate>
            </span>
          </dt>
          <dd>{childEntity.brotherCode}</dd>
          <dt>
            <span id="motherName">
              <Translate contentKey="kafalaApp.child.motherName">Mother Name</Translate>
            </span>
          </dt>
          <dd>{childEntity.motherName}</dd>
          <dt>
            <span id="familyName">
              <Translate contentKey="kafalaApp.child.familyName">Family Name</Translate>
            </span>
          </dt>
          <dd>{childEntity.familyName}</dd>
          <dt>
            <span id="gender">
              <Translate contentKey="kafalaApp.child.gender">Gender</Translate>
            </span>
          </dt>
          <dd>{childEntity.gender}</dd>
          <dt>
            <span id="age">
              <Translate contentKey="kafalaApp.child.age">Age</Translate>
            </span>
          </dt>
          <dd>{childEntity.age}</dd>
          <dt>
            <span id="vedio">
              <Translate contentKey="kafalaApp.child.vedio">Vedio</Translate>
            </span>
          </dt>
          <dd>{childEntity.vedio}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="kafalaApp.child.description">Description</Translate>
            </span>
          </dt>
          <dd>{childEntity.description}</dd>
          <dt>
            <span id="address">
              <Translate contentKey="kafalaApp.child.address">Address</Translate>
            </span>
          </dt>
          <dd>{childEntity.address}</dd>
          <dt>
            <span id="score">
              <Translate contentKey="kafalaApp.child.score">Score</Translate>
            </span>
          </dt>
          <dd>{childEntity.score}</dd>
          <dt>
            <Translate contentKey="kafalaApp.child.user">User</Translate>
          </dt>
          <dd>{childEntity.user ? childEntity.user.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/child" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/child/${childEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ChildDetail;
