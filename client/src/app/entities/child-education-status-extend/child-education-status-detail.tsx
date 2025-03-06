import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './child-education-status.reducer';

export const ChildEducationStatusDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const childEducationStatusEntity = useAppSelector(state => state.childEducationStatus.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="childEducationStatusDetailsHeading">
          <Translate contentKey="kafalaApp.childEducationStatus.detail.title">ChildEducationStatus</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{childEducationStatusEntity.id}</dd>
          <dt>
            <span id="lastLevelOfEducation">
              <Translate contentKey="kafalaApp.childEducationStatus.lastLevelOfEducation">Last Level Of Education</Translate>
            </span>
          </dt>
          <dd>{childEducationStatusEntity.lastLevelOfEducation}</dd>
          <dt>
            <span id="hoppy">
              <Translate contentKey="kafalaApp.childEducationStatus.hoppy">Hoppy</Translate>
            </span>
          </dt>
          <dd>{childEducationStatusEntity.hoppy}</dd>
          <dt>
            <span id="lastLevelOfEducationImage">
              <Translate contentKey="kafalaApp.childEducationStatus.lastLevelOfEducationImage">Last Level Of Education Image</Translate>
            </span>
          </dt>
          <dd>{childEducationStatusEntity.lastLevelOfEducationImage}</dd>
          <dt>
            <Translate contentKey="kafalaApp.childEducationStatus.child">Child</Translate>
          </dt>
          <dd>{childEducationStatusEntity.child ? childEducationStatusEntity.child.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/child-education-status" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/child-education-status/${childEducationStatusEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ChildEducationStatusDetail;
