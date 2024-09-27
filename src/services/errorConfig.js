import {
  CODE_ERROR,
  HttpNotFound,
  HttpInternalServerError,
  HttpBadRequest,
  HttpError,
} from "./error.js";
import { ValidationError } from "express-validation";
import { ErrorResponse } from "../validation/Response";

const AttachResponder = (req, res, next) => {
  res.respond = createResponder(req, res, next);
  next();
};
const ErrorHandler = async (error, req, res, next) => {
  if (error instanceof HttpError) {
    console.log("Debugging HttpError");
    return res.status(error.statusCode).json(new ErrorResponse(error.data, error));
  } else if (error.name == "CastError") {
    let msg = error.message;
    return res.status(400).json(new ErrorResponse(msg, error));
    
  } else if (error instanceof ValidationError) {
    console.log("Debugging ValidationError");
    let { body } = error.details;
    let msg = body.map((o) => o.message).join(`\n`);
    return res.status(error.statusCode).json(new ErrorResponse(msg, error));
  } else if (typeof error === "string") {
    return res.status(CODE_ERROR.INTERNAL_SERVER_ERROR).json(new ErrorResponse(error));
  } else {
    return res
      .status(CODE_ERROR.INTERNAL_SERVER_ERROR)
      .json(new ErrorResponse("Connection Fail", error));
  }
};
/*
 *  for handling all recieved error
 * */
const ErrorHandler2 = (error, req, res, next) => {
  console.log("Debugging Different log");
  console.log(typeof error);
  console.log(error);

  if (error instanceof HttpError) {
    console.log("Debugging HttpError");
    return res.status(error.statusCode).json(new ErrorResponse(error.data, error));
  } else if (error instanceof ValidationError) {
    console.log("Debugging ValidationError");
    return res.status(error.statusCode).json(new ErrorResponse(error.message, error));

  } else if (typeof error === "string") {
    console.log("Debugging string");
    return res.status(CODE_ERROR.INTERNAL_SERVER_ERROR).json(new ErrorResponse(error));
  } else {
    console.log("Debugging else");
    return res
      .status(CODE_ERROR.INTERNAL_SERVER_ERROR)
      .json(new ErrorResponse("Unexpected Error Occur", error));
  }
};
function createResponder(req, res, next) {
  const responder = {
    _forwardError(error, ErrorClass = Error, data) {
      const errorMessage = error instanceof Error ? error.message : error;
      const errorToForward = new ErrorClass(errorMessage, data);
      // forwards error to an error handler middleware
      console.log(errorToForward, "hello");
      next(errorToForward);
    },

    badRequest(error, data) {
      return responder._forwardError(error, HttpBadRequest, data);
    },
    notFound(error, data) {
      return responder._forwardError(error, HttpNotFound, data);
    },
    internalServerError(error, data) {
      return responder._forwardError(error, HttpInternalServerError, data);
    },
  };

  return responder;
}

export { ErrorHandler, AttachResponder };
