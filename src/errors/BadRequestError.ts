import CustomError from './CustomError';

class BadRequestError extends CustomError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

export default BadRequestError;
