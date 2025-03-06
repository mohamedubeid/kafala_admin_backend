import React from 'react';
import { Button } from 'reactstrap';

type ActionsProps = {
  stepId: string;
};

const Actions = ({ stepId }: ActionsProps) => {
  const submitData = () => {
    const stepForm = document.getElementById(stepId) as HTMLFormElement;
    if (stepForm) {
      stepForm.submit();
    }
  };

  return (
    <div className='mt-4 steps-actions d-flex gap-3 flex-wrap justify-content-end'>
      <Button className='main-form-outline-btn'>
        إلغاء
      </Button>
      <Button type='submit' form={stepId} className='main-form-btn'>
        التالي
      </Button>
    </div>
  );
};

export default Actions;
