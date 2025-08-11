import { MCPError } from '../types';

export class WordPressMCPError extends Error implements MCPError {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'WordPressMCPError';
    this.status = status;
    this.code = code;
  }
}

export class NetworkError extends WordPressMCPError {
  constructor(message: string) {
    super(message, undefined, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends WordPressMCPError {
  constructor(message: string = 'Request timeout') {
    super(message, undefined, 'TIMEOUT');
    this.name = 'TimeoutError';
  }
}

export class ValidationError extends WordPressMCPError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}