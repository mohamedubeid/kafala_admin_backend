import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IChild } from 'app/shared/model/child.model';
import { getEntities as getChildren } from 'app/entities/child/child.reducer';
import { IKafeel } from 'app/shared/model/kafeel.model';
import { getEntities as getKafeels } from 'app/entities/kafeel/kafeel.reducer';
import { IRelChildKafeel } from 'app/shared/model/rel-child-kafeel.model';
import { SponsershipDuration } from 'app/shared/model/enumerations/sponsership-duration.model';
import { RelChildKafeelStatus } from 'app/shared/model/enumerations/rel-child-kafeel-status.model';
import { getEntity, updateEntity, createEntity, reset } from './rel-child-kafeel.reducer';

export const RelChildKafeelUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const children = useAppSelector(state => state.child.entities);
  const kafeels = useAppSelector(state => state.kafeel.entities);
  const relChildKafeelEntity = useAppSelector(state => state.relChildKafeel.entity);
  const loading = useAppSelector(state => state.relChildKafeel.loading);
  const updating = useAppSelector(state => state.relChildKafeel.updating);
  const updateSuccess = useAppSelector(state => state.relChildKafeel.updateSuccess);
  const sponsershipDurationValues = Object.keys(SponsershipDuration);
  const relChildKafeelStatusValues = Object.keys(RelChildKafeelStatus);

  const handleClose = () => {
    navigate('/rel-child-kafeel');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getChildren({}));
    dispatch(getKafeels({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  // eslint-disable-next-line complexity
  const saveEntity = values => {
    if (values.id !== undefined && typeof values.id !== 'number') {
      values.id = Number(values.id);
    }
    if (values.cost !== undefined && typeof values.cost !== 'number') {
      values.cost = Number(values.cost);
    }

    const entity = {
      ...relChildKafeelEntity,
      ...values,
      child: children.find(it => it.id.toString() === values.child?.toString()),
      kafeel: kafeels.find(it => it.id.toString() === values.kafeel?.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          duration: 'MONTHLY',
          status: 'PENDING',
          ...relChildKafeelEntity,
          child: relChildKafeelEntity?.child?.id,
          kafeel: relChildKafeelEntity?.kafeel?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="kafalaApp.relChildKafeel.home.createOrEditLabel" data-cy="RelChildKafeelCreateUpdateHeading">
            <Translate contentKey="kafalaApp.relChildKafeel.home.createOrEditLabel">Create or edit a RelChildKafeel</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="rel-child-kafeel-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('kafalaApp.relChildKafeel.duration')}
                id="rel-child-kafeel-duration"
                name="duration"
                data-cy="duration"
                type="select"
              >
                {sponsershipDurationValues.map(sponsershipDuration => (
                  <option value={sponsershipDuration} key={sponsershipDuration}>
                    {translate('kafalaApp.SponsershipDuration.' + sponsershipDuration)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('kafalaApp.relChildKafeel.cost')}
                id="rel-child-kafeel-cost"
                name="cost"
                data-cy="cost"
                type="text"
              />
              <ValidatedField
                label={translate('kafalaApp.relChildKafeel.expirationDate')}
                id="rel-child-kafeel-expirationDate"
                name="expirationDate"
                data-cy="expirationDate"
                type="date"
              />
              <ValidatedField
                label={translate('kafalaApp.relChildKafeel.startDate')}
                id="rel-child-kafeel-startDate"
                name="startDate"
                data-cy="startDate"
                type="date"
              />
              <ValidatedField
                label={translate('kafalaApp.relChildKafeel.status')}
                id="rel-child-kafeel-status"
                name="status"
                data-cy="status"
                type="select"
              >
                {relChildKafeelStatusValues.map(relChildKafeelStatus => (
                  <option value={relChildKafeelStatus} key={relChildKafeelStatus}>
                    {translate('kafalaApp.RelChildKafeelStatus.' + relChildKafeelStatus)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                id="rel-child-kafeel-child"
                name="child"
                data-cy="child"
                label={translate('kafalaApp.relChildKafeel.child')}
                type="select"
              >
                <option value="" key="0" />
                {children
                  ? children.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="rel-child-kafeel-kafeel"
                name="kafeel"
                data-cy="kafeel"
                label={translate('kafalaApp.relChildKafeel.kafeel')}
                type="select"
              >
                <option value="" key="0" />
                {kafeels
                  ? kafeels.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/rel-child-kafeel" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default RelChildKafeelUpdate;
