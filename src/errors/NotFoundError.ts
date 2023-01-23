import CustomError from './CustomError';

class NotFoundError extends CustomError {
  constructor() {
    super('Not Found', 404);
  }
}

export default NotFoundError;
