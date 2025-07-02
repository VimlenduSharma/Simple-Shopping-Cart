export class ApiError extends Error {
  statusCode: number;

  /**
   * Construct a new ApiError
   * @param statusCode  HTTP status (defaults to 500)
   * @param message     Human-readable error message
   */
  constructor(statusCode = 500, message = 'Internal Server Error') {
    super(message);
    this.statusCode = statusCode;
    // Maintains proper stack trace (only on V8 engines)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/** 404 convenience class */
export class NotFoundError extends ApiError {
  constructor(message = 'Not Found') {
    super(404, message);
  }
}