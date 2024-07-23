'use client';
import { Check } from '@phosphor-icons/react';
import {
  Children,
  forwardRef,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
  useImperativeHandle,
  useState,
} from 'react';

interface StepperProps {
  titles: string[];
  children: ReactNode;
}

export interface StepperRef {
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
}

const Stepper: ForwardRefExoticComponent<StepperProps & RefAttributes<StepperRef>> = forwardRef<
  StepperRef,
  StepperProps
>((props, ref) => {
  const [currentStep, setCurrentStep] = useState(0);

  useImperativeHandle(ref, () => ({
    nextStep: () => {
      setCurrentStep(prevStep => Math.min(prevStep + 1, Children.count(props.children) - 1));
    },
    previousStep: () => {
      setCurrentStep(prevStep => Math.max(prevStep - 1, 0));
    },
    goToStep: (step: number) => {
      setCurrentStep(Math.max(0, Math.min(step, Children.count(props.children) - 1)));
    },
  }));

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex w-full">
        {Children.map(props.children, (_, index) => (
          <div className="flex w-full">
            <div className="flex flex-col items-center">
              <div
                key={index}
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-solid ${index <= currentStep ? 'cursor-pointer border-primary bg-primary text-primary-foreground' : 'border-content3 bg-transparent text-content3-foreground'}`}
                onClick={() => {
                  if (index <= currentStep) setCurrentStep(index);
                }}
              >
                {index <= currentStep - 1 ? <Check /> : <span>{index + 1}</span>}
              </div>
              <p className="mt-1 max-w-12 text-center text-sm">{props.titles[index]}</p>
            </div>
            <div className="relative mx-2 mt-6 flex h-0.5 w-full flex-grow">
              {index < Children.count(props.children) - 1 && (
                <>
                  <span className="absolute h-0.5 w-full bg-content3" />
                  <span
                    className={`${index < currentStep ? 'w-full' : 'w-0'} absolute h-0.5 bg-primary duration-[5s] ease-in-out transition-width`}
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <>
        {Children.map(props.children, (child, i) => (
          <div className={`w-full ${i === currentStep ? 'block' : 'hidden'}`}>{child}</div>
        ))}
      </>
    </div>
  );
});

Stepper.displayName = 'Stepper';

export default Stepper;
