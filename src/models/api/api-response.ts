export interface ResponsePayload {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  message?: string;
  errorCode?: string;
  errorDetails?: string;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  data: null;
  error: {
    code: string;
    details: string;
  };
}

export interface SuccessResponse {
  statusCode: number;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  error: null;
}

export type ApiResponse = SuccessResponse | ErrorResponse;
