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
import { IChildEducationStatus } from 'app/shared/model/child-education-status.model';
import { LastLevelOfEducation } from 'app/shared/model/enumerations/last-level-of-education.model';
import { getEntity, updateEntity, createEntity, reset } from './child-education-status.reducer';

export const ChildEducationStatusUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const children = useAppSelector(state => state.child.entities);
  const childEducationStatusEntity = useAppSelector(state => state.childEducationStatus.entity);
  const loading = useAppSelector(state => state.childEducationStatus.loading);
  const updating = useAppSelector(state => state.childEducationStatus.updating);
  const updateSuccess = useAppSelector(state => state.childEducationStatus.updateSuccess);
  const lastLevelOfEducationValues = Object.keys(LastLevelOfEducation);

  const handleClose = () => {
    navigate('/child-education-status');
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
      ...childEducationStatusEntity,
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
          lastLevelOfEducation: 'PRIMARY',
          ...childEducationStatusEntity,
          child: childEducationStatusEntity?.child?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="kafalaApp.childEducationStatus.home.createOrEditLabel" data-cy="ChildEducationStatusCreateUpdateHeading">
            <Translate contentKey="kafalaApp.childEducationStatus.home.createOrEditLabel">Create or edit a ChildEducationStatus</Translate>
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
                  id="child-education-status-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('kafalaApp.childEducationStatus.lastLevelOfEducation')}
                id="child-education-status-lastLevelOfEducation"
                name="lastLevelOfEducation"
                data-cy="lastLevelOfEducation"
                type="select"
              >
                {lastLevelOfEducationValues.map(lastLevelOfEducation => (
                  <option value={lastLevelOfEducation} key={lastLevelOfEducation}>
                    {translate('kafalaApp.LastLevelOfEducation.' + lastLevelOfEducation)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('kafalaApp.childEducationStatus.hoppy')}
                id="child-education-status-hoppy"
                name="hoppy"
                data-cy="hoppy"
                type="text"
              />
              <ValidatedField
                label={translate('kafalaApp.childEducationStatus.lastLevelOfEducationImage')}
                id="child-education-status-lastLevelOfEducationImage"
                name="lastLevelOfEducationImage"
                data-cy="lastLevelOfEducationImage"
                type="text"
              />
              <ValidatedField
                id="child-education-status-child"
                name="child"
                data-cy="child"
                label={translate('kafalaApp.childEducationStatus.child')}
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
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/child-education-status" replace color="info">
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

export default ChildEducationStatusUpdate;
