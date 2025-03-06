import React, { useState } from 'react';
import { Translate, translate, ValidatedField } from 'react-jhipster';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert, Row, Col, Form } from 'reactstrap';
import { Link } from 'react-router-dom';
import { type FieldError, useForm } from 'react-hook-form';
import { useAppSelector } from 'app/config/store';


export interface ILoginProps {
    showModal: boolean;
    loginError: boolean;
    handleLogin: (username: string, password: string, rememberMe: boolean) => void;
    handleClose: () => void;
  }

const LoginForm = (props: ILoginProps) => {
    const login = ({ username, password, rememberMe }) => {
        props.handleLogin(username, password, rememberMe);
      };
   const currentLocale = useAppSelector(state => state.locale.currentLocale);

    const {
        handleSubmit,
        register,
        formState: { errors, touchedFields },
      } = useForm({ mode: 'onTouched' });

      const { loginError, handleClose } = props;

      const handleLoginSubmit = e => {
        handleSubmit(login)(e);
      };
      const [isPasswordVisible, setPasswordVisible] = useState(false);

      const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
      };
      return (
        <div>
          <div className="login-title">
            <Translate contentKey="login.title">Login To Dashboard</Translate>
          </div>

          <Form onSubmit={handleLoginSubmit}>

          <ModalBody>
            <Row>
              <Col md="12">
                {loginError ? (
                  <Alert color="danger" data-cy="loginError">
                    <Translate contentKey="login.messages.error.authentication">
                      <strong>Failed to sign in!</strong> Please check your credentials and try again.
                    </Translate>
                  </Alert>
                ) : null}
              </Col>
              <Col md="12">
  <ValidatedField
    name="username"
    label={translate('global.form.username.label')}
    placeholder={translate('global.form.username.placeholder')}
    required
    autoFocus
    data-cy="username"
    validate={{
      required: translate('global.form.cannotBeEmpty'),
      validate: value => value.trim() !== '' || translate('global.form.invalidData'),
    }}
    register={register}
    error={errors.username as FieldError}
    isTouched={touchedFields.username}
  />

  <div className="position-relative">
    <ValidatedField
      name="password"
      type={isPasswordVisible ? "text" : "password"}
      label={translate('login.form.password')}
      placeholder={translate('login.form.password.placeholder')}
      required
      data-cy="password"
      validate={{ required: translate('global.form.cannotBeEmpty') ,
      validate: value => value.trim() !== '' || translate('global.form.invalidData'),
      }}
      register={register}
      error={errors.password as FieldError}
      isTouched={touchedFields.password}
    />

    <div
      onClick={togglePasswordVisibility}
      className="password-icon-place"
      style={{ right: currentLocale === 'ar-ly' ? '89%' : '8%' }}
    >
      {isPasswordVisible ? (
         <img width={15} height={15} src="/content/images/eyeIcon.svg" alt="" />
      ) : (
        <img width={15} height={15} src="/content/images/unShowIcon.svg" alt="" />

      )}
    </div>
  </div>
</Col>

            </Row>
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <ValidatedField
                  name="rememberMe"
                  type="checkbox"
                  check
                  label={translate('login.form.rememberme')}
                  value={true}
                  register={register}
                />
                <Link className='forgot-password' to="/account/reset/request" data-cy="forgetYourPasswordSelector">
                  <Translate contentKey="login.password.forgot">Did you forget your password?</Translate>
                </Link>
            </div>

          </ModalBody>
          <ModalFooter className='mt-4'>
            {/* <Button color="secondary" onClick={handleClose} tabIndex={1}>
              <Translate contentKey="entity.action.cancel">Cancel</Translate>
            </Button>{' '} */}
            <Button className='main-btn login-btn' color="primary" type="submit" data-cy="submit">
              <Translate contentKey="login.form.button">Sign in</Translate>
            </Button>
          </ModalFooter>
          {/* <div className="noaccount mt-2 text-center">
          <span>
                <Translate contentKey="global.messages.info.register.noaccount">You don&apos;t have an account yet?</Translate>
              </span>{' '}
              <Link to="/account/register">
                <Translate contentKey="global.messages.info.register.link">Register a new account</Translate>
              </Link>
          </div> */}
        </Form>
        </div>
      );
}
export default LoginForm;
