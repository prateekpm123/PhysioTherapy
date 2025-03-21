import { StatusAndErrorType } from "../models/StatusAndErrorType.enum";

export interface FailedResponseDto {
  message: string
  statusCode: number;
  errorCode: StatusAndErrorType;
  errors: unknown;
}
