import React from "react";
import {
  StepsContainer,
  TrackWrapper,
  TrackLine,
  ProgressLine,
  StepItem,
  StepIcon,
  StepLabel,
} from "./style";

const CheckoutSteps = ({ currentStep }) => {
  // currentStep: 1 = Revisão, 2 = Entrega, 3 = Pagamento
  const progress = currentStep === 1 ? 0 : currentStep === 2 ? 50 : 100;

  const steps = [
    { id: 1, label: "Identificação" },
    { id: 2, label: "Entrega" },
    { id: 3, label: "Pagamento" },
  ];

  return (
    <StepsContainer>
      <TrackWrapper>
        <TrackLine />
        <ProgressLine $progress={progress} />
        {steps.map((step) => {
          let status = 'pending';
          if (step.id < currentStep) status = 'completed';
          if (step.id === currentStep) status = 'active';

          return (
            <StepItem key={step.id}>
              <StepIcon $status={status}>
                {status === 'completed' ? (
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check</span>
                ) : (
                  step.id
                )}
              </StepIcon>
              <StepLabel $status={status}>{step.label}</StepLabel>
            </StepItem>
          );
        })}
      </TrackWrapper>
    </StepsContainer>
  );
};

export default CheckoutSteps;
