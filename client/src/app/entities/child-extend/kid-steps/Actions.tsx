import React from 'react';
import { translate } from 'react-jhipster';
import { Button } from 'reactstrap';

type ActionsProps = {
  onClickNext: () => void;
  onClickBack: () => void;
  stepId: string;
  stepNumber: number;
  lastStep: number;
};
const Actions = ({ onClickNext, onClickBack, stepId, stepNumber, lastStep }: ActionsProps) => {
  return (
    <div className="mt-4 steps-actions d-flex gap-3 flex-wrap justify-content-end">
      {/* <Button onClick={onClickBack} className='main-form-outline-btn'>
            {
              stepNumber == 0 ? "إلغاء" : "العودة"
            }
        </Button> */}
      <Button type="submit" onClick={onClickNext} form={stepId} className="main-form-btn">
        {stepNumber != lastStep ? translate('kafalaApp.child.saveAndContinue') : translate('kafalaApp.child.saveAndFinish')}
      </Button>
    </div>
  );
};
export default Actions;
