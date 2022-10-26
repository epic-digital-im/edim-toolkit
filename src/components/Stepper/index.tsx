import React from 'react';

import {
  Flex,
  Button,
} from "@chakra-ui/react";

import { Step, Steps, useSteps } from 'chakra-ui-steps';

export interface StepProps {
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  setStep: (step: number) => void;
  activeStep: number;
}

export interface StepType {
  label: string;
  Content: React.FC<StepProps>;
}

export interface StepperProps {
  steps: StepType[];
  showNav?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export const Stepper: React.FC<StepperProps> = ({ steps, showNav, orientation }) => {
  const stepState = useSteps({
    initialStep: 0,
  });

  const { nextStep, prevStep, reset, activeStep } = stepState;

  return (
    <Flex flexDir="column" width="100%">
      <Steps activeStep={activeStep} mb={5} orientation={orientation}>
        {steps.map(({ label, Content }) => (
          <Step label={label} key={label}>
            <Content {...stepState} />
          </Step>
        ))}
      </Steps>
      {showNav && <Flex>
        {activeStep === steps.length ? (
          <Flex p={4}>
            <Button mx="auto" size="sm" onClick={reset}>
              Reset
            </Button>
          </Flex>
        ) : (
          <Flex width="100%" justify="flex-end">
            <Button
              isDisabled={activeStep === 0}
              mr={4}
              onClick={prevStep}
              size="sm"
              variant="ghost"
            >
              Prev
            </Button>
            <Button size="sm" onClick={nextStep}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Flex>
        )}
      </Flex>}
    </Flex>
  );
};