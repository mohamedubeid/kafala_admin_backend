import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './setting.reducer';

export const SettingDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const settingEntity = useAppSelector(state => state.setting.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="settingDetailsHeading">
          <Translate contentKey="kafalaApp.setting.detail.title">Setting</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{settingEntity.id}</dd>
          <dt>
            <span id="key">
              <Translate contentKey="kafalaApp.setting.key">Key</Translate>
            </span>
          </dt>
          <dd>{settingEntity.key}</dd>
          <dt>
            <span id="value">
              <Translate contentKey="kafalaApp.setting.value">Value</Translate>
            </span>
          </dt>
          <dd>{settingEntity.value}</dd>
        </dl>
        <Button tag={Link} to="/setting" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/setting/${settingEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default SettingDetail;
