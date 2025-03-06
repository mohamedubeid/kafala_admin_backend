import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './rel-child-kafeel.reducer';

export const RelChildKafeelDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const relChildKafeelEntity = useAppSelector(state => state.relChildKafeel.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="relChildKafeelDetailsHeading">
          <Translate contentKey="kafalaApp.relChildKafeel.detail.title">RelChildKafeel</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{relChildKafeelEntity.id}</dd>
          <dt>
            <span id="duration">
              <Translate contentKey="kafalaApp.relChildKafeel.duration">Duration</Translate>
            </span>
          </dt>
          <dd>{relChildKafeelEntity.duration}</dd>
          <dt>
            <span id="cost">
              <Translate contentKey="kafalaApp.relChildKafeel.cost">Cost</Translate>
            </span>
          </dt>
          <dd>{relChildKafeelEntity.cost}</dd>
          <dt>
            <span id="expirationDate">
              <Translate contentKey="kafalaApp.relChildKafeel.expirationDate">Expiration Date</Translate>
            </span>
          </dt>
          <dd>
            {relChildKafeelEntity.expirationDate ? (
              <TextFormat value={relChildKafeelEntity.expirationDate} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="startDate">
              <Translate contentKey="kafalaApp.relChildKafeel.startDate">Start Date</Translate>
            </span>
          </dt>
          <dd>
            {relChildKafeelEntity.startDate ? (
              <TextFormat value={relChildKafeelEntity.startDate} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="status">
              <Translate contentKey="kafalaApp.relChildKafeel.status">Status</Translate>
            </span>
          </dt>
          <dd>{relChildKafeelEntity.status}</dd>
          <dt>
            <Translate contentKey="kafalaApp.relChildKafeel.child">Child</Translate>
          </dt>
          <dd>{relChildKafeelEntity.child ? relChildKafeelEntity.child.id : ''}</dd>
          <dt>
            <Translate contentKey="kafalaApp.relChildKafeel.kafeel">Kafeel</Translate>
          </dt>
          <dd>{relChildKafeelEntity.kafeel ? relChildKafeelEntity.kafeel.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/rel-child-kafeel" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/rel-child-kafeel/${relChildKafeelEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default RelChildKafeelDetail;
