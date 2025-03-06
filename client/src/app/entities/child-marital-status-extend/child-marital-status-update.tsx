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
import { IChildMaritalStatus } from 'app/shared/model/child-marital-status.model';
import { OrphanClassification } from 'app/shared/model/enumerations/orphan-classification.model';
import { getEntity, updateEntity, createEntity, reset } from './child-marital-status.reducer';

export const ChildMaritalStatusUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const children = useAppSelector(state => state.child.entities);
  const childMaritalStatusEntity = useAppSelector(state => state.childMaritalStatus.entity);
  const loading = useAppSelector(state => state.childMaritalStatus.loading);
  const updating = useAppSelector(state => state.childMaritalStatus.updating);
  const updateSuccess = useAppSelector(state => state.childMaritalStatus.updateSuccess);
  const orphanClassificationValues = Object.keys(OrphanClassification);

  const handleClose = () => {
    navigate('/child-marital-status');
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
    if (values.numOfSibiling !== undefined && typeof values.numOfSibiling !== 'number') {
      values.numOfSibiling = Number(values.numOfSibiling);
    }

    const entity = {
      ...childMaritalStatusEntity,
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
          orphanClassification: 'FATHER_ORPHAN',
          ...childMaritalStatusEntity,
          child: childMaritalStatusEntity?.child?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="kafalaApp.childMaritalStatus.home.createOrEditLabel" data-cy="ChildMaritalStatusCreateUpdateHeading">
            <Translate contentKey="kafalaApp.childMaritalStatus.home.createOrEditLabel">Create or edit a ChildMaritalStatus</Translate>
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
                  id="child-marital-status-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('kafalaApp.childMaritalStatus.orphanClassification')}
                id="child-marital-status-orphanClassification"
                name="orphanClassification"
                data-cy="orphanClassification"
                type="select"
              >
                {orphanClassificationValues.map(orphanClassification => (
                  <option value={orphanClassification} key={orphanClassification}>
                    {translate('kafalaApp.OrphanClassification.' + orphanClassification)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('kafalaApp.childMaritalStatus.fatherDateOfDeath')}
                id="child-marital-status-fatherDateOfDeath"
                name="fatherDateOfDeath"
                data-cy="fatherDateOfDeath"
                type="date"
              />
              <ValidatedField
                label={translate('kafalaApp.childMaritalStatus.dateOfBeathImage')}
                id="child-marital-status-dateOfBeathImage"
                name="dateOfBeathImage"
                data-cy="dateOfBeathImage"
                type="text"
              />
              <ValidatedField
                label={translate('kafalaApp.childMaritalStatus.numOfSibiling')}
                id="child-marital-status-numOfSibiling"
                name="numOfSibiling"
                data-cy="numOfSibiling"
                type="text"
              />
              <ValidatedField
                id="child-marital-status-child"
                name="child"
                data-cy="child"
                label={translate('kafalaApp.childMaritalStatus.child')}
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
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/child-marital-status" replace color="info">
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

export default ChildMaritalStatusUpdate;
