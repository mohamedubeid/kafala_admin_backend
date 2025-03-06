import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { Translate, translate, ValidatedField, ValidatedForm, isEmail } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';

import { locales, languages } from 'app/config/translation';
import { getUser, getRoles, updateUser, createUser, reset, getUsersAsAdmin } from './user-management.reducer';
import { useAppDispatch, useAppSelector } from 'app/config/store';

export const UserManagementUpdate = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { login } = useParams<'login'>();
  const isNew = login === undefined;
  const currentLocale = useAppSelector(state => state.locale.currentLocale);

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getUser(login));
    }
    dispatch(getRoles());
    return () => {
      dispatch(reset());
    };
  }, [login]);

  const handleClose = () => {
    navigate('/admin/user-management');
  };

  const saveUser = async values => {
    if (isNew) {
      values.id = null;
      try {
        const result = await dispatch(createUser(values)).unwrap();
        if (result) {
          await dispatch(
            getUsersAsAdmin({
              page: 0,
              size: 20,
              sort: 'id,asc',
            }),
          );
          handleClose();
        }
      } catch (err) {
        toast.error(err?.response?.data?.message ? translate('error.emailexists') : translate('userManagement.error'));
      }
    } else {
      try {
        if (!values.authorities || values.authorities.length === 0) {
          values.authorities = user.authorities;
        }
        const result = await dispatch(updateUser(values)).unwrap();
        if (result) {
          await dispatch(
            getUsersAsAdmin({
              page: 0,
              size: 20,
              sort: 'id,asc',
            }),
          );
          handleClose();
        }
      } catch (err) {
        toast.error(err?.response?.data?.message ? translate('error.emailexists') : translate('userManagement.error'));
      }
    }
  };

  const user = useAppSelector(state => state.userManagement.user);
  const loading = useAppSelector(state => state.userManagement.loading);
  const updating = useAppSelector(state => state.userManagement.updating);
  const authorities = useAppSelector(state => state.userManagement.authorities);

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h1>
            <Translate contentKey="userManagement.home.createOrEditLabel">Create or edit a User</Translate>
          </h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm onSubmit={saveUser} defaultValues={user}>
              {user.id ? (
                <ValidatedField
                  type="text"
                  name="id"
                  required
                  readOnly
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              {/* <ValidatedField
                type="text"
                name="login"
                label={translate('userManagement.login')}
                validate={{
                  required: {
                    value: true,
                    message: translate('global.messages.validate.fieldRequired'),
                  },
                  validate: {
                    noSpacesOnly: value => {
                      const trimmedValue = value?.trim();
                      return trimmedValue && trimmedValue.length > 0 ? true : translate('global.messages.validate.textInputs');
                    },
                    startsWithLetter: value => {
                      const trimmedValue = value?.trim();
                      const regex = /^[\p{L}]/u;
                      return regex.test(trimmedValue) ? true : translate('global.messages.validate.textInputs');
                    },
                  },
                }}
              /> */}
              <ValidatedField
                name="email"
                label={translate('global.form.email.label')}
                type="email"
                className="text-start"
                style={{
                  direction: currentLocale === 'ar-ly' ? 'rtl' : 'ltr',
                }}
                validate={{
                  required: {
                    value: true,
                    message: translate('global.messages.validate.emailRequired'),
                  },
                  validate: {
                    email: v => isEmail(v) || translate('global.messages.validate.emailInvalid'),
                    noSpaces: value => {
                      if (value && /\s/.test(value)) {
                        return translate('global.messages.validate.noSpacesAllowed');
                      }
                      return true;
                    },
                  },
                }}
                data-cy="email"
              />
              <ValidatedField
                type="text"
                name="firstName"
                label={translate('userManagement.firstName')}
                validate={{
                  required: {
                    value: true,
                    message: translate('global.messages.validate.fieldRequired'),
                  },
                  validate: {
                    noSpacesOnly: value => {
                      const trimmedValue = value?.trim();
                      return trimmedValue && trimmedValue.length > 0 ? true : translate('global.messages.validate.textInputs');
                    },
                    startsWithLetter: value => {
                      const trimmedValue = value?.trim();
                      // Regex to allow Arabic, English letters, and ensure it starts with a letter
                      const regex = /^[\p{L}]/u; // Unicode property escapes for letters
                      return regex.test(trimmedValue) ? true : translate('global.messages.validate.textInputs');
                    },
                  },
                }}
              />
              <ValidatedField
                type="text"
                name="lastName"
                label={translate('userManagement.lastName')}
                validate={{
                  required: {
                    value: true,
                    message: translate('global.messages.validate.fieldRequired'),
                  },
                  validate: {
                    noSpacesOnly: value => {
                      const trimmedValue = value?.trim();
                      return trimmedValue && trimmedValue.length > 0 ? true : translate('global.messages.validate.textInputs');
                    },
                    startsWithLetter: value => {
                      const trimmedValue = value?.trim();
                      // Regex to allow Arabic, English letters, and ensure it starts with a letter
                      const regex = /^[\p{L}]/u; // Unicode property escapes for letters
                      return regex.test(trimmedValue) ? true : translate('global.messages.validate.textInputs');
                    },
                  },
                }}
              />
              {/* <FormText>This field cannot be longer than 50 characters.</FormText> */}
              <ValidatedField
                type="checkbox"
                name="activated"
                check
                value={true}
                disabled={!user.id}
                label={translate('userManagement.activated')}
              />
              <ValidatedField type="select" name="langKey" label={translate('userManagement.langKey')}>
                {locales.map(locale => (
                  <option value={locale} key={locale}>
                    {languages[locale].name}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField type="select" name="authorities" multiple label={translate('userManagement.profiles')}>
                {authorities.map(role => (
                  <option value={role} key={role}>
                    {role}
                  </option>
                ))}
              </ValidatedField>
              <Button tag={Link} to="/admin/user-management" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" type="submit" disabled={updating}>
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

export default UserManagementUpdate;
