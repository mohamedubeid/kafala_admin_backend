import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity, updateEntity, createEntity, reset } from './child.reducer';

import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { Gender } from 'app/shared/model/enumerations/gender.model';
import { Steps } from 'app/components/steps';
import './css/steps-form.css';
import Actions from './kid-steps/Actions';
import StepOne from './kid-steps/StepOne';
import StepTwo from './kid-steps/StepTwo';
import StepThree from './kid-steps/StepThree';
import StepFour from './kid-steps/StepFour';
import { translate } from 'react-jhipster';
import StepFive from './kid-steps/StepFive';
import { IChild } from 'app/shared/model/child.model';
import StepSix from './kid-steps/StepSix';
import { toast } from 'react-toastify';
// import StepTwo from './kid-steps/StepTwo';
// import StepThree from './kid-steps/StepThree';
// import StepFour from './kid-steps/StepFour';

export const ChildUpdate = () => {
  const [stepNumber, setStepNumder] = useState<number>(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<'id'>();
  const users = useAppSelector(state => state.userManagement.users);
  const childEntity = useAppSelector(state => state.child.entity);

  const isNew = id === undefined;
  const loading = useAppSelector(state => state.child.loading);
  const updating = useAppSelector(state => state.child.updating);
  const updateSuccess = useAppSelector(state => state.child.updateSuccess);
  const genderValues = Object.keys(Gender);
  const [firstStepCompleted, setFirstStepCompleted] = useState(false);
  const handleStepClick = (stepIndex: number) => {
    if (!isNew && (completedSteps.includes(stepIndex) || stepIndex === 0)) {
      setStepNumder(stepIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (isNew) {
      toast.warning(translate('kafalaApp.child.steps.steps-locked'));
    }
  };

  const steps = [
    {
      number: 0,
      formName: 'profileForm',
      stepName: translate('kafalaApp.child.steps.profile'),
      onClick: !isNew ? () => handleStepClick(0) : undefined,
    },
    {
      number: 1,
      formName: 'healthStatusForm',
      stepName: translate('kafalaApp.child.steps.health-status'),
      onClick: !isNew ? () => handleStepClick(1) : undefined,
    },
    {
      number: 2,
      formName: 'maritalStatusForm',
      stepName: translate('kafalaApp.child.steps.social-status'),
      onClick: !isNew ? () => handleStepClick(2) : undefined,
    },
    {
      number: 3,
      formName: 'educationalForm',
      stepName: translate('kafalaApp.child.steps.education'),
      onClick: !isNew ? () => handleStepClick(3) : undefined,
    },
    {
      number: 4,
      formName: 'sponsorForm',
      stepName: translate('kafalaApp.child.steps.sponsorship'),
      onClick: !isNew ? () => handleStepClick(4) : undefined,
    },
    {
      number: 5,
      formName: 'HarmsForm',
      stepName: translate('kafalaApp.child.steps.harms'),
      onClick: !isNew ? () => handleStepClick(5) : undefined,
    },
  ];

  const [completedSteps, setCompletedSteps] = useState<number[]>(isNew ? [0] : steps.map((_, index) => index));

  const handleClose = () => {
    navigate('/child');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id ? id : childEntity?.id));
    }

    dispatch(getUsers({}));
  }, [dispatch, id, isNew]);

  // child health status....
  const children = useAppSelector(state => state.child.entities);
  const childHealthStatusEntity = useAppSelector(state => state.childHealthStatus.entity);
  const childHealthSubmit = values => {
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
          gender: 'MALE',
          ...childEntity,
          user: childEntity?.user?.id,
        };

  const handleNext = () => {
    if (stepNumber < steps.length - 1) {
      const nextStep = stepNumber + 1;
      setStepNumder(nextStep);

      setCompletedSteps(prevCompletedSteps => {
        if (isNew && stepNumber === 0) {
          setFirstStepCompleted(true);
        } else if (!prevCompletedSteps.includes(nextStep)) {
          return [...prevCompletedSteps, nextStep];
        }
        return prevCompletedSteps;
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (stepNumber > 0) setStepNumder(prevStepNumber => prevStepNumber - 1);
  };
  const handleSubmitSteps = () => {
    navigate('/child');
  };
  const handleFinish = () => {
    console.log('Finish Step');
  };
  const handleCancel = () => {
    console.log('Cancel');
  };

  return (
    <div>
      <Steps
        steps={steps.map(step => ({
          ...step,
          onClick: step.onClick ? step.onClick : () => {},
        }))}
        stepNumber={stepNumber}
        completedSteps={completedSteps}
        setStepNumder={setStepNumder}
        isNew={isNew}
      />
      <div className="stepsContainer">
        {stepNumber === 0 && <StepOne handleNext={handleNext} />}
        {stepNumber == 1 && <StepTwo handleNext={handleNext} child={childEntity} />}
        {stepNumber == 2 && <StepThree handleNext={handleNext} child={childEntity} />}
        {stepNumber == 3 && <StepFour handleNext={handleNext} child={childEntity} />}
        {stepNumber == 4 && <StepFive handleNext={handleNext} child={childEntity} />}
        {stepNumber == 5 && <StepSix handleNext={handleSubmitSteps} child={childEntity} />}

        <Actions
          lastStep={steps.length - 1}
          stepId={steps[stepNumber].formName}
          stepNumber={stepNumber}
          onClickNext={handleFinish}
          onClickBack={stepNumber != 0 ? handleBack : handleCancel}
        />
      </div>
    </div>
  );
};

export default ChildUpdate;
