import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './child-prticipations.reducer';

export const ChildPrticipationsDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const childPrticipationsEntity = useAppSelector(state => state.childPrticipations.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="childPrticipationsDetailsHeading">
          <Translate contentKey="kafalaApp.childPrticipations.detail.title">ChildPrticipations</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{childPrticipationsEntity.id}</dd>
          <dt>
            <span id="participationType">
              <Translate contentKey="kafalaApp.childPrticipations.participationType">Participation Type</Translate>
            </span>
          </dt>
          <dd>{childPrticipationsEntity.participationType}</dd>
          <dt>
            <span id="image">
              <Translate contentKey="kafalaApp.childPrticipations.image">Image</Translate>
            </span>
          </dt>
          <dd>{childPrticipationsEntity.image}</dd>
          <dt>
            <span id="desceription">
              <Translate contentKey="kafalaApp.childPrticipations.desceription">Desceription</Translate>
            </span>
          </dt>
          <dd>{childPrticipationsEntity.desceription}</dd>
          <dt>
            <Translate contentKey="kafalaApp.childPrticipations.child">Child</Translate>
          </dt>
          <dd>{childPrticipationsEntity.child ? childPrticipationsEntity.child.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/child-prticipations" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/child-prticipations/${childPrticipationsEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ChildPrticipationsDetail;
