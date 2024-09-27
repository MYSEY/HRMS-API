const CODE_ERROR = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
const CODE_SU = {
  CREATED: 201,
};

class HttpError extends Error {
  constructor({ message, name, statusCode, data }) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.data = data;
    Error.captureStackTrace(this, HttpError);
  }
}

class HttpBadRequest extends HttpError {
  constructor(data, message = "Bad request") {
    super({
      message,
      name: "HttpBadRequest",
      statusCode: CODE_ERROR.BAD_REQUEST,
      data,
    });
  }
}

class HttpNotFound extends HttpError {
  constructor(data, message = "Not Found") {
    super({
      message,
      name: "HttpNotFound",
      statusCode: CODE_ERROR.NOT_FOUND,
      data,
    });
  }
}

class HttpInternalServerError extends HttpError {
  constructor(message = "Internal server error", data) {
    super({
      message,
      name: "HttpInternalServerError",
      statusCode: CODE_ERROR.INTERNAL_SERVER_ERROR,
      data,
    });
  }
}

class UnauthorizedError extends HttpError {
  constructor(data, message = "UnauthorizedError") {
    super({
      message,
      name: "Unauthorized",
      statusCode: 403,
      data,
    });
  }
}

export {
  HttpInternalServerError,
  HttpNotFound,
  HttpError,
  HttpBadRequest,
  UnauthorizedError,
  CODE_ERROR,
  CODE_SU,
};
