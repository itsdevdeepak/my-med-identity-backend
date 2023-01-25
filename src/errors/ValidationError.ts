import CustomError from './CustomError';
import { ValidationError as Err } from 'express-validator';
import { ValidationErrorMessage } from './errorMessageType';

class ValidationError extends CustomError {
  private errors: Err[];
  constructor(errors: Err[]) {
    super('Validation Error');
    this.statusCode = 400;
    this.errors = errors;
  }

  public override serializeError(): ValidationErrorMessage[] {
    return this.errors.map(
      (err): ValidationErrorMessage => ({ message: err.msg, prams: err.param }),
    );
  }
}

export default ValidationError;
