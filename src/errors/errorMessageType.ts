export type ValidationErrorMessage = {
  message: string;
  prams: string;
};

export type ErrorMessage = {
  message: string;
  additional?: string;
};

export type CustomErrorMessage = ErrorMessage | ValidationErrorMessage[];
