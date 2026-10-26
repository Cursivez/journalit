

import React from 'react';
import { Button } from '../../../components/ui/Button';

interface FieldsListHeaderProps {
  title: string;
  description: string;
  addLabel: string;
  showAdd: boolean;
  onAdd: () => void;
}

export const FieldsListHeader: React.FC<FieldsListHeaderProps> = ({
  title,
  description,
  addLabel,
  showAdd,
  onAdd,
}) => (
  <div className="custom-fields-list-header">
    <div>
      <div className="custom-fields-list-title">{title}</div>
      <div className="custom-fields-list-description">{description}</div>
    </div>
    <div className="custom-fields-list-header-actions">
      {showAdd && (
        <Button variant="primary" size="sm" onClick={onAdd}>
          {addLabel}
        </Button>
      )}
    </div>
  </div>
);
