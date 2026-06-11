

import React from 'react';
import { FormSectionProps } from './types';


export const FormSection: React.FC<FormSectionProps> = ({
  title: _title,
  children,
  description: _description,
}) => {
  return (
    <div className="formSection">
      
      <div className="sectionContent">{children}</div>
    </div>
  );
};
