import { ApiRequestError } from "../types/errors";

const ERROR_MESSAGES: Record<number, string> = {
  400: "Invalid data. Please check your input.",
  401: "Please sign in to continue.",
  403: "You don't have permission to do that.",
  404: "The requested resource was not found.",
  409: "A conflict occurred. Please try again.",
  422: "The request could not be processed.",
  429: "Too many requests. Please slow down.",
  500: "Something went wrong. Please try again.",
  502: "Service temporarily unavailable. Please try again.",
  503: "Service temporarily unavailable. Please try again later.",
};

const DEFAULT_MESSAGE = "An unexpected error occurred. Please try again.";

export function mapError(error: unknown): string {
  if (error instanceof ApiRequestError) {
    return ERROR_MESSAGES[error.statusCode] || getDefaultMessage(error);
  }

  if (error instanceof Error) {
    // Network errors
    if (error.name === "TypeError" || error.message.includes("fetch")) {
      return "Unable to connect. Please check your internet connection.";
    }
    return error.message || DEFAULT_MESSAGE;
  }

  return DEFAULT_MESSAGE;
}

function getDefaultMessage(error: ApiRequestError): string {
  if (error.code === "TIMEOUT") {
    return "The request took too long. Please try again.";
  }
  if (error.code === "AUTH_ERROR") {
    return "Please sign in to continue.";
  }
  return ERROR_MESSAGES[error.statusCode] || DEFAULT_MESSAGE;
}

export function getErrorCode(error: unknown): string | undefined {
  if (error instanceof ApiRequestError) {
    return error.code;
  }
  return undefined;
}

export function isAuthError(error: unknown): boolean {
  if (error instanceof ApiRequestError) {
    return error.statusCode === 401 || error.statusCode === 403;
  }
  return false;
}
