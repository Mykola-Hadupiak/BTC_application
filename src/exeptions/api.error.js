export class ApiError extends Error {
  constructor({ message, status, errors = {} }) {
    super(message);

    this.status = status;
    this.errors = errors;
  }

  static badRequest(message, errors) {
    return new ApiError({
      message,
      errors,
      status: 400,
    });
  }

  static exist(errors) {
    return new ApiError({
      message: 'Email already exists',
      errors,
      status: 409,
    });
  }

  static notFound(message, errors) {
    return new ApiError({
      message,
      errors,
      status: 404,
    });
  }

  static cannotPost(message) {
    return new ApiError({
      message,
      status: 404,
    });
  }
}
