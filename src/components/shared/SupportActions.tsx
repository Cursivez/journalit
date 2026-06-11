import React from 'react';
import { Copy, MessagesSquare, Info } from './icons/ObsidianIcon';
import { Button } from '../ui';

type SupportActionVariant = 'primary' | 'secondary';

interface SupportActionRenderProps {
  variant: SupportActionVariant;
  onClick: () => void;
  content: React.ReactNode;
}

interface SupportActionsProps {
  onCopy: () => void;
  copied: boolean;
  copyLabel: string;
  copiedLabel: string;
  discordLabel: string;
  note?: string;
  onDiscord?: () => void;
  actionsClassName?: string;
  helpClassName?: string;
  helpContentClassName?: string;
  noteIconClassName?: string;
  renderButton?: (props: SupportActionRenderProps) => React.ReactNode;
  iconSize?: number;
  noteIconSize?: number;
}

const defaultRenderButton = ({
  variant,
  onClick,
  content,
}: SupportActionRenderProps) => (
  <Button variant={variant} onClick={onClick}>
    {content}
  </Button>
);

const mergeClassNames = (...classNames: Array<string | undefined>): string =>
  classNames.filter(Boolean).join(' ');

export const SupportActions: React.FC<SupportActionsProps> = ({
  onCopy,
  copied,
  copyLabel,
  copiedLabel,
  discordLabel,
  note,
  onDiscord,
  actionsClassName,
  helpClassName,
  helpContentClassName,
  noteIconClassName,
  renderButton,
  iconSize = 14,
  noteIconSize = 14,
}) => {
  const render = renderButton ?? defaultRenderButton;
  const copyContent = (
    <span className="journalit-support-actions__button-content">
      <Copy size={iconSize} />
      <span>{copied ? copiedLabel : copyLabel}</span>
    </span>
  );
  const discordContent = (
    <span className="journalit-support-actions__button-content">
      <MessagesSquare size={iconSize} />
      <span>{discordLabel}</span>
    </span>
  );

  return (
    <>
      <div
        className={mergeClassNames(
          'journalit-support-actions__actions',
          actionsClassName
        )}
      >
        {render({ variant: 'primary', onClick: onCopy, content: copyContent })}
        {onDiscord &&
          render({
            variant: 'secondary',
            onClick: onDiscord,
            content: discordContent,
          })}
      </div>
      {note && (
        <div
          className={mergeClassNames(
            'journalit-support-actions__help',
            helpClassName
          )}
        >
          {helpContentClassName ? (
            <div
              className={mergeClassNames(
                'journalit-support-actions__help-content',
                helpContentClassName
              )}
            >
              <Info
                size={noteIconSize}
                className={mergeClassNames(
                  'journalit-support-actions__help-icon',
                  noteIconClassName
                )}
              />
              <span>{note}</span>
            </div>
          ) : (
            <>
              <Info
                size={noteIconSize}
                className={mergeClassNames(
                  'journalit-support-actions__help-icon',
                  noteIconClassName
                )}
              />
              <span>{note}</span>
            </>
          )}
        </div>
      )}
    </>
  );
};
