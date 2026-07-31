import React from 'react';
import { ReorderControls } from '../../../components/shared/ReorderControls';
import {
  Edit,
  Plus,
  Trash,
} from '../../../components/shared/icons/ObsidianIcon';
import { Button } from '../../../components/ui/Button';
import { t } from '../../../lang/helpers';
import type { CustomReviewFieldGroup } from '../../../types/reviewCustomFields';

interface ReviewFieldGroupHeaderProps {
  group: CustomReviewFieldGroup | null;
  fieldCount: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveGroup: (groupId: string, direction: 'up' | 'down') => void;
  onRenameGroup: (group: CustomReviewFieldGroup) => void;
  onDeleteGroup: (group: CustomReviewFieldGroup) => void;
  onAddField: (groupId: string) => void;
}

export const ReviewFieldGroupHeader: React.FC<ReviewFieldGroupHeaderProps> = ({
  group,
  fieldCount,
  canMoveUp,
  canMoveDown,
  onMoveGroup,
  onRenameGroup,
  onDeleteGroup,
  onAddField,
}) => (
  <div className="custom-review-field-group-header">
    <div className="setting-item-info">
      <div className="setting-item-name">
        {group?.name ||
          t('settings.customization.review-fields.groups.ungrouped')}
      </div>
      <div className="setting-item-description">
        {group?.description ||
          t('settings.customization.review-fields.groups.field-count', {
            count: String(fieldCount),
          })}
      </div>
    </div>
    {group && (
      <div className="setting-item-control">
        <div className="custom-fields-field-actions">
          <ReorderControls
            label={group.name}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            onMoveUp={() => onMoveGroup(group.id, 'up')}
            onMoveDown={() => onMoveGroup(group.id, 'down')}
            className="custom-fields-reorder-controls"
            buttonClassName="custom-fields-reorder-button"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRenameGroup(group)}
            aria-label={`${t('validation.edit')}: ${group.name}`}
            className="custom-review-field-group-icon-button"
          >
            <Edit size={14} aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeleteGroup(group)}
            aria-label={`${t('button.delete')}: ${group.name}`}
            className="custom-review-field-group-icon-button"
          >
            <Trash size={14} aria-hidden="true" />
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onAddField(group.id)}
            aria-label={`${t(
              'settings.customization.review-fields.add-button'
            )}: ${group.name}`}
            className="custom-review-field-group-icon-button custom-review-field-group-add-button"
          >
            <Plus size={14} aria-hidden="true" />
          </Button>
        </div>
      </div>
    )}
  </div>
);
