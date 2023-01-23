import { CustomErrorMessage, ErrorMessage } from './errorMessageType';

class CustomError extends Error {
  statusCode: number;
  additional?: string;
  constructor(
    message = 'opps something went wrong!',
    statusCode?: number,
    additional?: string,
  ) {
    super(message);
    this.statusCode = statusCode ? statusCode : 500;
    if (additional) this.additional = additional;
  }
  serializeError(): CustomErrorMessage {
    const errorMessage: ErrorMessage = {
      message: this.message,
    };
    if (this.additional) errorMessage.additional = this.additional;
    return errorMessage;
  }
}

export default CustomError;
