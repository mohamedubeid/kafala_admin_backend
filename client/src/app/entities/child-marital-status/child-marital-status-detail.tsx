import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './child-marital-status.reducer';

export const ChildMaritalStatusDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const childMaritalStatusEntity = useAppSelector(state => state.childMaritalStatus.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="childMaritalStatusDetailsHeading">
          <Translate contentKey="kafalaApp.childMaritalStatus.detail.title">ChildMaritalStatus</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{childMaritalStatusEntity.id}</dd>
          <dt>
            <span id="orphanClassification">
              <Translate contentKey="kafalaApp.childMaritalStatus.orphanClassification">Orphan Classification</Translate>
            </span>
          </dt>
          <dd>{childMaritalStatusEntity.orphanClassification}</dd>
          <dt>
            <span id="fatherDateOfDeath">
              <Translate contentKey="kafalaApp.childMaritalStatus.fatherDateOfDeath">Father Date Of Death</Translate>
            </span>
          </dt>
          <dd>
            {childMaritalStatusEntity.fatherDateOfDeath ? (
              <TextFormat value={childMaritalStatusEntity.fatherDateOfDeath} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="guardianName">
              <Translate contentKey="kafalaApp.childMaritalStatus.guardianName">Guardian Name</Translate>
            </span>
          </dt>
          <dd>{childMaritalStatusEntity.guardianName}</dd>
          <dt>
            <span id="guardianNationalID">
              <Translate contentKey="kafalaApp.childMaritalStatus.guardianNationalID">Guardian National ID</Translate>
            </span>
          </dt>
          <dd>{childMaritalStatusEntity.guardianNationalID}</dd>
          <dt>
            <span id="guardianRelationship">
              <Translate contentKey="kafalaApp.childMaritalStatus.guardianRelationship">Guardian Relationship</Translate>
            </span>
          </dt>
          <dd>{childMaritalStatusEntity.guardianRelationship}</dd>
          <dt>
            <span id="guardianDocument">
              <Translate contentKey="kafalaApp.childMaritalStatus.guardianDocument">Guardian Document</Translate>
            </span>
          </dt>
          <dd>{childMaritalStatusEntity.guardianDocument}</dd>
          <dt>
            <span id="dateOfBeathImage">
              <Translate contentKey="kafalaApp.childMaritalStatus.dateOfBeathImage">Date Of Beath Image</Translate>
            </span>
          </dt>
          <dd>{childMaritalStatusEntity.dateOfBeathImage}</dd>
          <dt>
            <span id="numOfSibiling">
              <Translate contentKey="kafalaApp.childMaritalStatus.numOfSibiling">Num Of Sibiling</Translate>
            </span>
          </dt>
          <dd>{childMaritalStatusEntity.numOfSibiling}</dd>
          <dt>
            <span id="lostHousing">
              <Translate contentKey="kafalaApp.childMaritalStatus.lostHousing">Lost Housing</Translate>
            </span>
          </dt>
          <dd>{childMaritalStatusEntity.lostHousing ? 'true' : 'false'}</dd>
          <dt>
            <span id="lostLimbs">
              <Translate contentKey="kafalaApp.childMaritalStatus.lostLimbs">Lost Limbs</Translate>
            </span>
          </dt>
          <dd>{childMaritalStatusEntity.lostLimbs ? 'true' : 'false'}</dd>
          <dt>
            <span id="lostSight">
              <Translate contentKey="kafalaApp.childMaritalStatus.lostSight">Lost Sight</Translate>
            </span>
          </dt>
          <dd>{childMaritalStatusEntity.lostSight ? 'true' : 'false'}</dd>
          <dt>
            <span id="losthearorspeak">
              <Translate contentKey="kafalaApp.childMaritalStatus.losthearorspeak">Losthearorspeak</Translate>
            </span>
          </dt>
          <dd>{childMaritalStatusEntity.losthearorspeak ? 'true' : 'false'}</dd>
          <dt>
            <span id="hasChronicDiseases">
              <Translate contentKey="kafalaApp.childMaritalStatus.hasChronicDiseases">Has Chronic Diseases</Translate>
            </span>
          </dt>
          <dd>{childMaritalStatusEntity.hasChronicDiseases ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="kafalaApp.childMaritalStatus.child">Child</Translate>
          </dt>
          <dd>{childMaritalStatusEntity.child ? childMaritalStatusEntity.child.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/child-marital-status" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/child-marital-status/${childMaritalStatusEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ChildMaritalStatusDetail;
