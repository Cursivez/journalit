

import {
  SetupData,
  SetupRule,
  SetupRuleCategory,
  SetupRuleGroup,
  SetupStatus,
} from './types';
import { isLabelColor } from '../../types/labelColor';

interface ValidationError {
  field: string;
  message: string;
}


export function validateSetupData(data: SetupData): ValidationError[] {
  const errors: ValidationError[] = [];

  
  if (!data.name?.trim()) {
    errors.push({
      field: 'name',
      message: 'Name is required',
    });
  }

  
  if (data.name && data.name.trim().length > 100) {
    errors.push({
      field: 'name',
      message: 'Name must be 100 characters or fewer',
    });
  }

  if (data.color && !isLabelColor(data.color)) {
    errors.push({
      field: 'color',
      message: 'Color must be a valid hex color code (for example, #7c3aed)',
    });
  }

  if (data.status && !isSetupStatus(data.status)) {
    errors.push({
      field: 'status',
      message: 'Status must be testing, active, or archived',
    });
  }

  
  if (
    data.order !== undefined &&
    (!Number.isInteger(data.order) || data.order < 0)
  ) {
    errors.push({
      field: 'order',
      message: 'Order must be a non-negative integer',
    });
  }

  if (Array.isArray(data.rules)) {
    data.rules.forEach((rule, index) => {
      errors.push(...validateSetupRule(rule, `rules.${index}`));
    });
  }

  if (Array.isArray(data.ruleGroups)) {
    data.ruleGroups.forEach((group, index) => {
      errors.push(...validateSetupRuleGroup(group, `ruleGroups.${index}`));
    });

    if (data.ruleGroups.length > 0 && Array.isArray(data.rules)) {
      const groupIds = new Set(data.ruleGroups.map((group) => group.id));
      data.rules.forEach((rule, index) => {
        if (!rule.groupId) {
          errors.push({
            field: `rules.${index}.groupId`,
            message: 'Rule group ID is required when rule groups are provided',
          });
        } else if (!groupIds.has(rule.groupId)) {
          errors.push({
            field: `rules.${index}.groupId`,
            message: 'Rule group ID must reference a provided rule group',
          });
        }
      });
    }
  }

  return errors;
}

function isSetupStatus(status: string): status is SetupStatus {
  return ['testing', 'active', 'archived'].includes(status);
}

function isSetupRuleCategory(category: string): category is SetupRuleCategory {
  return [
    'context',
    'entry',
    'exit',
    'risk',
    'management',
    'invalidation',
    'psychology',
  ].includes(category);
}

function validateSetupRule(
  rule: SetupRule,
  fieldPrefix: string
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!rule.id?.trim()) {
    errors.push({ field: `${fieldPrefix}.id`, message: 'Rule ID is required' });
  } else if (!/^rule_[a-z0-9_]{1,64}$/.test(rule.id)) {
    errors.push({
      field: `${fieldPrefix}.id`,
      message:
        'Rule ID must start with "rule_" and contain lowercase letters, numbers, or underscores',
    });
  }

  if (!rule.label?.trim()) {
    errors.push({
      field: `${fieldPrefix}.label`,
      message: 'Rule label is required',
    });
  }

  if (!isSetupRuleCategory(rule.category)) {
    errors.push({
      field: `${fieldPrefix}.category`,
      message: 'Rule category is invalid',
    });
  }

  if (!Number.isInteger(rule.order) || rule.order < 0) {
    errors.push({
      field: `${fieldPrefix}.order`,
      message: 'Rule order must be a non-negative integer',
    });
  }

  return errors;
}

function validateSetupRuleGroup(
  group: SetupRuleGroup,
  fieldPrefix: string
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!group.id?.trim()) {
    errors.push({
      field: `${fieldPrefix}.id`,
      message: 'Group ID is required',
    });
  } else if (!/^group_[a-z0-9_]{1,64}$/.test(group.id)) {
    errors.push({
      field: `${fieldPrefix}.id`,
      message:
        'Group ID must start with "group_" and contain lowercase letters, numbers, or underscores',
    });
  }

  if (!group.name?.trim()) {
    errors.push({
      field: `${fieldPrefix}.name`,
      message: 'Group name is required',
    });
  }

  if (!Number.isInteger(group.order) || group.order < 0) {
    errors.push({
      field: `${fieldPrefix}.order`,
      message: 'Group order must be a non-negative integer',
    });
  }

  return errors;
}


export function validateSetupId(id: string): void {
  if (!id.trim()) {
    throw new Error('Setup ID is required');
  }
}
