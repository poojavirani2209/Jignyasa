class ApiError extends Error {
  statusCode: number;
}

export class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Resource not accessible") {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = 403;
  }
}

export class ConflictError extends ApiError {
  constructor(message = "Action cant be performed") {
    super(message);
    this.name = "ConflictError";
    this.statusCode = 409;
  }
}

export class UnProcessabilityEntityError extends ApiError {
  constructor(message = "Entity cannot be processed") {
    super(message);
    this.name = "UnProcessabilityEntityError";
    this.statusCode = 422;
  }
}

export class BadRequestError extends ApiError {
  constructor(message = "Bad request") {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = 400;
  }
}

export class UnAuthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}
