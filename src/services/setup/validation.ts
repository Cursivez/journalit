

import { SetupData } from './types';

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

  if (!data.description?.trim()) {
    errors.push({
      field: 'description',
      message: 'Description is required',
    });
  }

  
  if (data.name && !/^[\w\s-]{3,50}$/.test(data.name)) {
    errors.push({
      field: 'name',
      message:
        'Name must be 3-50 characters and contain only letters, numbers, spaces, and hyphens',
    });
  }

  
  if (data.color && !/^#[0-9A-Fa-f]{6}$/.test(data.color)) {
    errors.push({
      field: 'color',
      message: 'Color must be a valid hex color code (e.g. #FF0000)',
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

  return errors;
}


export function validateSetupId(id: string): void {
  if (!id.startsWith('setup-')) {
    throw new Error('Invalid setup ID format: must start with "setup-"');
  }

  if (!/^setup-[\w-]{1,50}$/.test(id)) {
    throw new Error(
      'Invalid setup ID format: must contain only letters, numbers, and hyphens'
    );
  }
}
