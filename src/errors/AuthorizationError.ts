import CustomError from './CustomError';

class AuthorizationError extends CustomError {
  constructor() {
    super('Not Authorized', 401);
  }
}

export default AuthorizationError;
