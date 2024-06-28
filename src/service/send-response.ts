import { FastifyReply } from "fastify";
import { ApiResponse, ResponsePayload } from "../models/api/api-response";


export function sendResponse(
  reply: FastifyReply,
  statusCode: number,
  payload: ResponsePayload = {}
): void {
  const {
    data = null,
    message = "",
    errorCode = "",
    errorDetails = "",
  } = payload;
  let response: ApiResponse;

  switch (statusCode) {
    case 200:
      response = {
        statusCode: 200,
        message: message || "Operation successful",
        data,
        error: null,
      };
      break;
    case 401:
      response = {
        statusCode: 401,
        message: message || "Unauthorized access",
        data: null,
        error: {
          code: errorCode || "AUTH_ERROR",
          details:
            errorDetails || "You are not authorized to access this resource.",
        },
      };
      break;
    case 404:
      response = {
        statusCode: 404,
        message: message || "Resource not found",
        data: null,
        error: {
          code: errorCode || "NOT_FOUND",
          details: errorDetails || "The requested resource could not be found.",
        },
      };
      break;
    case 500:
    default:
      response = {
        statusCode: 500,
        message: message || "Internal Server Error",
        data: null,
        error: {
          code: errorCode || "INTERNAL_ERROR",
          details: errorDetails || "An unexpected error occurred.",
        },
      };
      break;
  }

  reply.status(statusCode).send(response);
}
