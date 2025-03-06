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
import { IChild } from 'app/shared/model/child.model';
import { getEntities as getChildren } from 'app/entities/child/child.reducer';
import { IChildNotes } from 'app/shared/model/child-notes.model';
import { getEntity, updateEntity, createEntity, reset } from './child-notes.reducer';

export const ChildNotesUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const notes = useAppSelector(state => state.notes.entities);
  const children = useAppSelector(state => state.child.entities);
  const childNotesEntity = useAppSelector(state => state.childNotes.entity);
  const loading = useAppSelector(state => state.childNotes.loading);
  const updating = useAppSelector(state => state.childNotes.updating);
  const updateSuccess = useAppSelector(state => state.childNotes.updateSuccess);

  const handleClose = () => {
    navigate('/child-notes');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getNotes({}));
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
      ...childNotesEntity,
      ...values,
      notes: notes.find(it => it.id.toString() === values.notes?.toString()),
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
          ...childNotesEntity,
          notes: childNotesEntity?.notes?.id,
          child: childNotesEntity?.child?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="kafalaApp.childNotes.home.createOrEditLabel" data-cy="ChildNotesCreateUpdateHeading">
            <Translate contentKey="kafalaApp.childNotes.home.createOrEditLabel">Create or edit a ChildNotes</Translate>
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
                  id="child-notes-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                id="child-notes-notes"
                name="notes"
                data-cy="notes"
                label={translate('kafalaApp.childNotes.notes')}
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
                id="child-notes-child"
                name="child"
                data-cy="child"
                label={translate('kafalaApp.childNotes.child')}
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
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/child-notes" replace color="info">
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

export default ChildNotesUpdate;
