import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { INotes } from 'app/shared/model/notes.model';
import { getEntities as getNotes } from 'app/entities/notes/notes.reducer';
import { IChildEducationStatus } from 'app/shared/model/child-education-status.model';
import { getEntities as getChildEducationStatuses } from 'app/entities/child-education-status/child-education-status.reducer';
import { IChildEducationNotes } from 'app/shared/model/child-education-notes.model';
import { getEntity, updateEntity, createEntity, reset } from './child-education-notes.reducer';

export const ChildEducationNotesUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const notes = useAppSelector(state => state.notes.entities);
  const childEducationStatuses = useAppSelector(state => state.childEducationStatus.entities);
  const childEducationNotesEntity = useAppSelector(state => state.childEducationNotes.entity);
  const loading = useAppSelector(state => state.childEducationNotes.loading);
  const updating = useAppSelector(state => state.childEducationNotes.updating);
  const updateSuccess = useAppSelector(state => state.childEducationNotes.updateSuccess);

  const handleClose = () => {
    navigate('/child-education-notes');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getNotes({}));
    dispatch(getChildEducationStatuses({}));
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
      ...childEducationNotesEntity,
      ...values,
      notes: notes.find(it => it.id.toString() === values.notes?.toString()),
      childEducationStatus: childEducationStatuses.find(it => it.id.toString() === values.childEducationStatus?.toString()),
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
          ...childEducationNotesEntity,
          notes: childEducationNotesEntity?.notes?.id,
          childEducationStatus: childEducationNotesEntity?.childEducationStatus?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="kafalaApp.childEducationNotes.home.createOrEditLabel" data-cy="ChildEducationNotesCreateUpdateHeading">
            <Translate contentKey="kafalaApp.childEducationNotes.home.createOrEditLabel">Create or edit a ChildEducationNotes</Translate>
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
                  id="child-education-notes-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                id="child-education-notes-notes"
                name="notes"
                data-cy="notes"
                label={translate('kafalaApp.childEducationNotes.notes')}
                type="select"
              >
                <option value="" key="0" />
                {notes
                  ? notes.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="child-education-notes-childEducationStatus"
                name="childEducationStatus"
                data-cy="childEducationStatus"
                label={translate('kafalaApp.childEducationNotes.childEducationStatus')}
                type="select"
              >
                <option value="" key="0" />
                {childEducationStatuses
                  ? childEducationStatuses.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/child-education-notes" replace color="info">
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

export default ChildEducationNotesUpdate;
