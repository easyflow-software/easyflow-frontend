'use client';
import { Check } from '@phosphor-icons/react';
import cx from 'classnames';
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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const stepChildren = Children.toArray(props.children).filter(child => child.type.name === 'Step');

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 flex w-full">
        {Children.map(stepChildren, (_, index) => (
          <div className={cx('flex', { 'w-full': index < Children.count(stepChildren) - 1 })}>
            <div className="flex flex-col items-center">
              <div
                key={index}
                className={cx(
                  'flex h-12 w-12 items-center justify-center rounded-full border-2 border-solid',
                  { 'border-primary bg-primary text-primary-foreground hover:cursor-pointer': index <= currentStep },
                  { 'border-content3 bg-transparent text-content3-foreground': index > currentStep },
                )}
                onClick={() => {
                  if (index <= currentStep) setCurrentStep(index);
                }}
              >
                {index <= currentStep - 1 ? <Check /> : <span>{index + 1}</span>}
              </div>
              <p className="mt-1 max-w-12 text-center text-sm">{props.titles[index]}</p>
            </div>
            {index < Children.count(stepChildren) - 1 && (
              <div className="relative mx-2 mt-6 flex h-0.5 w-full flex-grow">
                {index < Children.count(stepChildren) - 1 && (
                  <>
                    <span className="absolute h-0.5 w-full bg-content3" />
                    <span
                      className={cx('absolute h-0.5 w-0 bg-primary duration-[5s] ease-in-out transition-width', {
                        'w-full': index < currentStep,
                      })}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <>
        {Children.map(stepChildren, (child, i) => (
          <div className={cx('w-full', { block: i === currentStep, hidden: i !== currentStep })}>{child}</div>
        ))}
      </>
    </div>
  );
});

Stepper.displayName = 'Stepper';

export default Stepper;
