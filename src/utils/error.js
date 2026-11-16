export class NotFoundError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export class ConflictError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export class InternalServerError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export class BadRequestError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
