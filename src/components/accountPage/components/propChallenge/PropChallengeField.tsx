import React, { useId } from 'react';
import { t } from '../../../../lang/helpers';
import { DropdownSelect } from '../../../shared/DropdownSelect';
import { HelpTooltipContent } from '../../../shared/HelpTooltipContent';
import { Tooltip } from '../../../shared/Tooltip';
import Checkbox from '../../../ui/Checkbox';

export function PropChallengeFieldHelp({
  title,
  description,
  labelId,
  descriptionId,
}: {
  title: string;
  description: string;
  labelId: string;
  descriptionId: string;
}) {
  return (
    <>
      <Tooltip
        content={<HelpTooltipContent title={title} description={description} />}
        disclosureLabel={t('account.prop-challenge.field.help-label', {
          field: title,
        })}
        ariaDescribedBy={descriptionId}
        triggerClassName="journalit-prop-challenge-field-help"
        preferredPosition="bottom"
        delay={200}
        instantHide
      >
        <span id={labelId}>{title}</span>
      </Tooltip>
      <span id={descriptionId} className="journalit-sr-only">
        {description}
      </span>
    </>
  );
}

export type PropChallengeFieldControlProps = {
  inline?: boolean;
} & (
  | {
      kind: 'input';
      children: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement>>;
    }
  | {
      kind: 'checkbox';
      children: React.ReactElement<React.ComponentProps<typeof Checkbox>>;
    }
  | {
      kind: 'dropdown';
      children: React.ReactElement<React.ComponentProps<typeof DropdownSelect>>;
    }
);

export function PropChallengeField(
  props: PropChallengeFieldControlProps & {
    translationKey: Parameters<typeof t>[0];
    description: string;
  }
) {
  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  
  const control = (() => {
    switch (props.kind) {
      case 'input':
        return React.cloneElement(props.children, {
          id,
          'aria-labelledby': labelId,
          'aria-describedby': descriptionId,
        });
      case 'checkbox':
      case 'dropdown':
        return React.cloneElement<
          Pick<
            React.ComponentProps<typeof Checkbox>,
            'id' | 'ariaLabelledBy' | 'ariaDescribedBy'
          >
        >(props.children, {
          id,
          ariaLabelledBy: labelId,
          ariaDescribedBy: descriptionId,
        });
      default: {
        const exhaustive: never = props;
        return exhaustive;
      }
    }
  })();
  const help = (
    <PropChallengeFieldHelp
      title={t(props.translationKey)}
      description={props.description}
      labelId={labelId}
      descriptionId={descriptionId}
    />
  );
  return (
    <div
      className={
        props.inline
          ? 'journalit-prop-challenge-checkbox'
          : 'journalit-prop-challenge-field'
      }
    >
      {props.inline ? (
        <>
          {control}
          {help}
        </>
      ) : (
        <>
          {help}
          {control}
        </>
      )}
    </div>
  );
}
