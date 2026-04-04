export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  timestamp?: string;
  path?: string;
}

export class ApiRequestError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}
