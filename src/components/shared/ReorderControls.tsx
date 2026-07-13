

import React from 'react';
import { t } from '../../lang/helpers';
import { Button } from '../ui/Button';

interface ReorderControlsProps {
  label: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  className?: string;
  buttonClassName?: string;
}

export const ReorderControls: React.FC<ReorderControlsProps> = ({
  label,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  className = '',
  buttonClassName = '',
}) => (
  <div className={`journalit-reorder-controls ${className}`.trim()}>
    <Button
      variant="outline"
      size="sm"
      onClick={onMoveUp}
      disabled={!canMoveUp}
      aria-label={`${t('button.move-up')}: ${label}`}
      className={`journalit-reorder-button ${buttonClassName}`.trim()}
    >
      ↑
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={onMoveDown}
      disabled={!canMoveDown}
      aria-label={`${t('button.move-down')}: ${label}`}
      className={`journalit-reorder-button ${buttonClassName}`.trim()}
    >
      ↓
    </Button>
  </div>
);
