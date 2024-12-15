import { AuthError } from 'firebase/auth';
import { AUTH_ERROR_MESSAGES } from './constants';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleAuthError = (error: AuthError): AppError => {
  const errorCode = error?.code || 'default';
  const message = AUTH_ERROR_MESSAGES[errorCode as keyof typeof AUTH_ERROR_MESSAGES] || 
                 AUTH_ERROR_MESSAGES.default;
  
  return new AppError(message, errorCode, error);
};

export const handleNetworkError = (error: Error): AppError => {
  return new AppError(
    'A network error occurred. Please check your connection.',
    'network_error',
    error
  );
};

export const handleUnexpectedError = (error: Error): AppError => {
  return new AppError(
    'An unexpected error occurred. Please try again.',
    'unexpected_error',
    error
  );
};