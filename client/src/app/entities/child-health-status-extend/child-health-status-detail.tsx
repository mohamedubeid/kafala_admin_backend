import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './child-health-status.reducer';

export const ChildHealthStatusDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const childHealthStatusEntity = useAppSelector(state => state.childHealthStatus.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="childHealthStatusDetailsHeading">
          <Translate contentKey="kafalaApp.childHealthStatus.detail.title">ChildHealthStatus</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{childHealthStatusEntity.id}</dd>
          <dt>
            <span id="healthStatus">
              <Translate contentKey="kafalaApp.childHealthStatus.healthStatus">Health Status</Translate>
            </span>
          </dt>
          <dd>{childHealthStatusEntity.healthStatus}</dd>
          <dt>
            <span id="chronicDisease">
              <Translate contentKey="kafalaApp.childHealthStatus.chronicDisease">Chronic Disease</Translate>
            </span>
          </dt>
          <dd>{childHealthStatusEntity.chronicDisease ? 'true' : 'false'}</dd>
          <dt>
            <span id="hasDisability">
              <Translate contentKey="kafalaApp.childHealthStatus.hasDisability">Has Disability</Translate>
            </span>
          </dt>
          <dd>{childHealthStatusEntity.hasDisability ? 'true' : 'false'}</dd>
          <dt>
            <span id="disabilityType">
              <Translate contentKey="kafalaApp.childHealthStatus.disabilityType">Disability Type</Translate>
            </span>
          </dt>
          <dd>{childHealthStatusEntity.disabilityType}</dd>
          <dt>
            <span id="disabilityImage">
              <Translate contentKey="kafalaApp.childHealthStatus.disabilityImage">Disability Image</Translate>
            </span>
          </dt>
          <dd>{childHealthStatusEntity.disabilityImage}</dd>
          <dt>
            <span id="hasMentalIllness">
              <Translate contentKey="kafalaApp.childHealthStatus.hasMentalIllness">Has Mental Illness</Translate>
            </span>
          </dt>
          <dd>{childHealthStatusEntity.hasMentalIllness ? 'true' : 'false'}</dd>
          <dt>
            <span id="mentalIllnessType">
              <Translate contentKey="kafalaApp.childHealthStatus.mentalIllnessType">Mental Illness Type</Translate>
            </span>
          </dt>
          <dd>{childHealthStatusEntity.mentalIllnessType}</dd>
          <dt>
            <span id="mentalIllnessImage">
              <Translate contentKey="kafalaApp.childHealthStatus.mentalIllnessImage">Mental Illness Image</Translate>
            </span>
          </dt>
          <dd>{childHealthStatusEntity.mentalIllnessImage}</dd>
          <dt>
            <span id="sychologicalHealth">
              <Translate contentKey="kafalaApp.childHealthStatus.sychologicalHealth">Sychological Health</Translate>
            </span>
          </dt>
          <dd>{childHealthStatusEntity.sychologicalHealth ? 'true' : 'false'}</dd>
          <dt>
            <span id="sychologicalHealthType">
              <Translate contentKey="kafalaApp.childHealthStatus.sychologicalHealthType">Sychological Health Type</Translate>
            </span>
          </dt>
          <dd>{childHealthStatusEntity.sychologicalHealthType}</dd>
          <dt>
            <span id="sychologicalHealthImage">
              <Translate contentKey="kafalaApp.childHealthStatus.sychologicalHealthImage">Sychological Health Image</Translate>
            </span>
          </dt>
          <dd>{childHealthStatusEntity.sychologicalHealthImage}</dd>
          <dt>
            <span id="healthReport">
              <Translate contentKey="kafalaApp.childHealthStatus.healthReport">Health Report</Translate>
            </span>
          </dt>
          <dd>{childHealthStatusEntity.healthReport}</dd>
          <dt>
            <Translate contentKey="kafalaApp.childHealthStatus.child">Child</Translate>
          </dt>
          <dd>{childHealthStatusEntity.child ? childHealthStatusEntity.child.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/child-health-status" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/child-health-status/${childHealthStatusEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ChildHealthStatusDetail;
