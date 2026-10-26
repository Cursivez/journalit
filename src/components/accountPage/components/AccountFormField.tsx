

import React, { useId } from 'react';
import { t } from '../../../lang/helpers';

type AccountFormFieldProps = {
  label: React.ReactNode;
  description?: React.ReactNode;
  optional?: boolean;
  className?: string;
} & (
  | {
      
      labelFor?: undefined;
      children: React.ReactNode;
    }
  | {
      
      labelFor: 'input';
      children: (controlId: string) => React.ReactNode;
    }
  | {
      
      labelFor: 'group';
      children: (labelId: string) => React.ReactNode;
    }
);

export function AccountFormField(props: AccountFormFieldProps) {
  const { label, description, optional = false, className } = props;
  const id = useId();
  const labelContent = (
    <>
      {label}
      {optional && (
        <>
          {' '}
          <span className="setting-item-name-optional">
            {t('form.field.optional')}
          </span>
        </>
      )}
    </>
  );

  let labelElement: React.ReactNode;
  let control: React.ReactNode;
  switch (props.labelFor) {
    case 'input':
      labelElement = (
        <label className="setting-item-name" htmlFor={id}>
          {labelContent}
        </label>
      );
      control = props.children(id);
      break;
    case 'group':
      labelElement = (
        <div className="setting-item-name" id={id}>
          {labelContent}
        </div>
      );
      control = props.children(id);
      break;
    default:
      labelElement = <div className="setting-item-name">{labelContent}</div>;
      control = props.children;
  }

  return (
    <div className={className ? `column ${className}` : 'column'}>
      <div className="setting-item-info">
        {labelElement}
        {description && (
          <div className="setting-item-description">{description}</div>
        )}
      </div>
      <div className="setting-item-control">{control}</div>
    </div>
  );
}
