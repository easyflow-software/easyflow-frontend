'use client';

import { CheckCircle, XCircle } from '@phosphor-icons/react';
import { FunctionComponent, ReactElement } from 'react';

interface PasswordRequirementProps {
  regex: RegExp;
  password?: string;
  requirementText: string;
}

const PasswordRequirement: FunctionComponent<PasswordRequirementProps> = ({
  regex,
  password,
  requirementText,
}): ReactElement => {
  return (
    <div className={`mb-1 flex items-center ${regex.test(password ?? '') ? 'text-success' : 'text-danger'}`}>
      {regex.test(password ?? '') ? <CheckCircle size={24} /> : <XCircle size={24} />}
      <span className="ml-1">{requirementText}</span>
    </div>
  );
};

export default PasswordRequirement;
