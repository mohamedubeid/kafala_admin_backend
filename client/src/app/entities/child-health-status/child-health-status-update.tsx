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
import { IChildHealthStatus } from 'app/shared/model/child-health-status.model';
import { HealthStatus } from 'app/shared/model/enumerations/health-status.model';
import { DisabilityTypes } from 'app/shared/model/enumerations/disability-types.model';
import { MentalIllnessTypes } from 'app/shared/model/enumerations/mental-illness-types.model';
import { SychologicalHealthTypes } from 'app/shared/model/enumerations/sychological-health-types.model';
import { getEntity, updateEntity, createEntity, reset } from './child-health-status.reducer';

export const ChildHealthStatusUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const children = useAppSelector(state => state.child.entities);
  const childHealthStatusEntity = useAppSelector(state => state.childHealthStatus.entity);
  const loading = useAppSelector(state => state.childHealthStatus.loading);
  const updating = useAppSelector(state => state.childHealthStatus.updating);
  const updateSuccess = useAppSelector(state => state.childHealthStatus.updateSuccess);
  const healthStatusValues = Object.keys(HealthStatus);
  const disabilityTypesValues = Object.keys(DisabilityTypes);
  const mentalIllnessTypesValues = Object.keys(MentalIllnessTypes);
  const sychologicalHealthTypesValues = Object.keys(SychologicalHealthTypes);

  const handleClose = () => {
    navigate('/child-health-status');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getChildren({}));
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

    const entity = {
      ...childHealthStatusEntity,
      ...values,
      child: children.find(it => it.id.toString() === values.child?.toString()),
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
          healthStatus: 'GOOD',
          disabilityType: 'PHYSICAL',
          mentalIllnessType: 'DEPRESSION',
          sychologicalHealthType: 'STABLE',
          ...childHealthStatusEntity,
          child: childHealthStatusEntity?.child?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="kafalaApp.childHealthStatus.home.createOrEditLabel" data-cy="ChildHealthStatusCreateUpdateHeading">
            <Translate contentKey="kafalaApp.childHealthStatus.home.createOrEditLabel">Create or edit a ChildHealthStatus</Translate>
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
                  id="child-health-status-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('kafalaApp.childHealthStatus.healthStatus')}
                id="child-health-status-healthStatus"
                name="healthStatus"
                data-cy="healthStatus"
                type="select"
              >
                {healthStatusValues.map(healthStatus => (
                  <option value={healthStatus} key={healthStatus}>
                    {translate('kafalaApp.HealthStatus.' + healthStatus)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('kafalaApp.childHealthStatus.chronicDisease')}
                id="child-health-status-chronicDisease"
                name="chronicDisease"
                data-cy="chronicDisease"
                check
                type="checkbox"
              />
              <ValidatedField
                label={translate('kafalaApp.childHealthStatus.hasDisability')}
                id="child-health-status-hasDisability"
                name="hasDisability"
                data-cy="hasDisability"
                check
                type="checkbox"
              />
              <ValidatedField
                label={translate('kafalaApp.childHealthStatus.disabilityType')}
                id="child-health-status-disabilityType"
                name="disabilityType"
                data-cy="disabilityType"
                type="select"
              >
                {disabilityTypesValues.map(disabilityTypes => (
                  <option value={disabilityTypes} key={disabilityTypes}>
                    {translate('kafalaApp.DisabilityTypes.' + disabilityTypes)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('kafalaApp.childHealthStatus.disabilityImage')}
                id="child-health-status-disabilityImage"
                name="disabilityImage"
                data-cy="disabilityImage"
                type="text"
              />
              <ValidatedField
                label={translate('kafalaApp.childHealthStatus.hasMentalIllness')}
                id="child-health-status-hasMentalIllness"
                name="hasMentalIllness"
                data-cy="hasMentalIllness"
                check
                type="checkbox"
              />
              <ValidatedField
                label={translate('kafalaApp.childHealthStatus.mentalIllnessType')}
                id="child-health-status-mentalIllnessType"
                name="mentalIllnessType"
                data-cy="mentalIllnessType"
                type="select"
              >
                {mentalIllnessTypesValues.map(mentalIllnessTypes => (
                  <option value={mentalIllnessTypes} key={mentalIllnessTypes}>
                    {translate('kafalaApp.MentalIllnessTypes.' + mentalIllnessTypes)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('kafalaApp.childHealthStatus.mentalIllnessImage')}
                id="child-health-status-mentalIllnessImage"
                name="mentalIllnessImage"
                data-cy="mentalIllnessImage"
                type="text"
              />
              <ValidatedField
                label={translate('kafalaApp.childHealthStatus.sychologicalHealth')}
                id="child-health-status-sychologicalHealth"
                name="sychologicalHealth"
                data-cy="sychologicalHealth"
                check
                type="checkbox"
              />
              <ValidatedField
                label={translate('kafalaApp.childHealthStatus.sychologicalHealthType')}
                id="child-health-status-sychologicalHealthType"
                name="sychologicalHealthType"
                data-cy="sychologicalHealthType"
                type="select"
              >
                {sychologicalHealthTypesValues.map(sychologicalHealthTypes => (
                  <option value={sychologicalHealthTypes} key={sychologicalHealthTypes}>
                    {translate('kafalaApp.SychologicalHealthTypes.' + sychologicalHealthTypes)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('kafalaApp.childHealthStatus.sychologicalHealthImage')}
                id="child-health-status-sychologicalHealthImage"
                name="sychologicalHealthImage"
                data-cy="sychologicalHealthImage"
                type="text"
              />
              <ValidatedField
                label={translate('kafalaApp.childHealthStatus.healthReport')}
                id="child-health-status-healthReport"
                name="healthReport"
                data-cy="healthReport"
                type="text"
              />
              <ValidatedField
                id="child-health-status-child"
                name="child"
                data-cy="child"
                label={translate('kafalaApp.childHealthStatus.child')}
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
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/child-health-status" replace color="info">
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

export default ChildHealthStatusUpdate;
