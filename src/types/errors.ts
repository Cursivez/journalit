

import { ErrorContext } from '../utils/errorHandler';


export class ApiError extends Error {
  statusCode?: number;
  context?: ErrorContext;

  constructor(message: string, statusCode?: number, context?: ErrorContext) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.context = context;
  }
}
