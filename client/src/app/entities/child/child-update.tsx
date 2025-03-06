import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { IChild } from 'app/shared/model/child.model';
import { Gender } from 'app/shared/model/enumerations/gender.model';
import { getEntity, updateEntity, createEntity, reset } from './child.reducer';

export const ChildUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const users = useAppSelector(state => state.userManagement.users);
  const childEntity = useAppSelector(state => state.child.entity);
  const loading = useAppSelector(state => state.child.loading);
  const updating = useAppSelector(state => state.child.updating);
  const updateSuccess = useAppSelector(state => state.child.updateSuccess);
  const genderValues = Object.keys(Gender);

  const handleClose = () => {
    navigate('/child');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getUsers({}));
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
    if (values.age !== undefined && typeof values.age !== 'number') {
      values.age = Number(values.age);
    }
    if (values.score !== undefined && typeof values.score !== 'number') {
      values.score = Number(values.score);
    }

    const entity = {
      ...childEntity,
      ...values,
      user: users.find(it => it.id.toString() === values.user?.toString()),
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
          gender: 'MALE',
          ...childEntity,
          user: childEntity?.user?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="kafalaApp.child.home.createOrEditLabel" data-cy="ChildCreateUpdateHeading">
            <Translate contentKey="kafalaApp.child.home.createOrEditLabel">Create or edit a Child</Translate>
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
                  id="child-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('kafalaApp.child.firstName')}
                id="child-firstName"
                name="firstName"
                data-cy="firstName"
                type="text"
              />
              <ValidatedField
                label={translate('kafalaApp.child.imageUrl')}
                id="child-imageUrl"
                name="imageUrl"
                data-cy="imageUrl"
                type="text"
              />
              <ValidatedField
                label={translate('kafalaApp.child.nationalId')}
                id="child-nationalId"
                name="nationalId"
                data-cy="nationalId"
                type="text"
              />
              <ValidatedField
                label={translate('kafalaApp.child.nationalImage')}
                id="child-nationalImage"
                name="nationalImage"
                data-cy="nationalImage"
                type="text"
              />
              <ValidatedField
                label={translate('kafalaApp.child.birthCertificate')}
                id="child-birthCertificate"
                name="birthCertificate"
                data-cy="birthCertificate"
                type="text"
              />
              <ValidatedField label={translate('kafalaApp.child.email')} id="child-email" name="email" data-cy="email" type="text" />
              <ValidatedField
                label={translate('kafalaApp.child.fatherName')}
                id="child-fatherName"
                name="fatherName"
                data-cy="fatherName"
                type="text"
              />
              <ValidatedField
                label={translate('kafalaApp.child.fatherPhone')}
                id="child-fatherPhone"
                name="fatherPhone"
                data-cy="fatherPhone"
                type="text"
              />
              <ValidatedField
                label={translate('kafalaApp.child.brotherCode')}
                id="child-brotherCode"
                name="brotherCode"
                data-cy="brotherCode"
                type="text"
              />
              <ValidatedField
                label={translate('kafalaApp.child.motherName')}
                id="child-motherName"
                name="motherName"
                data-cy="motherName"
                type="text"
              />
              <ValidatedField
                label={translate('kafalaApp.child.familyName')}
                id="child-familyName"
                name="familyName"
                data-cy="familyName"
                type="text"
              />
              <ValidatedField label={translate('kafalaApp.child.gender')} id="child-gender" name="gender" data-cy="gender" type="select">
                {genderValues.map(gender => (
                  <option value={gender} key={gender}>
                    {translate('kafalaApp.Gender.' + gender)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField label={translate('kafalaApp.child.age')} id="child-age" name="age" data-cy="age" type="text" />
              <ValidatedField label={translate('kafalaApp.child.vedio')} id="child-vedio" name="vedio" data-cy="vedio" type="text" />
              <ValidatedField
                label={translate('kafalaApp.child.description')}
                id="child-description"
                name="description"
                data-cy="description"
                type="textarea"
              />
              <ValidatedField
                label={translate('kafalaApp.child.address')}
                id="child-address"
                name="address"
                data-cy="address"
                type="text"
              />
              <ValidatedField label={translate('kafalaApp.child.score')} id="child-score" name="score" data-cy="score" type="text" />
              <ValidatedField id="child-user" name="user" data-cy="user" label={translate('kafalaApp.child.user')} type="select">
                <option value="" key="0" />
                {users
                  ? users.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/child" replace color="info">
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

export default ChildUpdate;
