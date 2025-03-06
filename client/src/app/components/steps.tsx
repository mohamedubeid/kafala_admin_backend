import { Stepper, Step, StepLabel, Box } from '@mui/material';
import React from 'react';
import '../css/steps.css';

type StepType = {
  number: number;
  formName: string;
  stepName: string;
  onClick: () => void;
};

type StepsProps = {
  steps: StepType[];
  isNew: boolean;
  setStepNumder: (step: number) => void;
  stepNumber: number;
  completedSteps: number[];
};
export const Steps = ({ steps, isNew, setStepNumder, stepNumber, completedSteps }: StepsProps) => {
  return (
    <div className="app-steps">
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={stepNumber} alternativeLabel>
          {steps.map((step, index) => (
            <Step
              key={step.formName}
              onClick={() => {
                if (completedSteps.includes(index) || index === 0) {
                  step.onClick();
                }
              }}
            >
              <StepLabel
                className={`text-center ${completedSteps.includes(index) ? 'completed' : ''}`}
                style={{ cursor: !isNew ? 'pointer' : 'not-allowed' }}
              >
                {step.stepName}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </div>
  );
};
