import { StatusAndErrorType } from "../models/SignInStatus.enum";

export interface FailedResponseDto {
    ok: boolean;
    status: StatusAndErrorType
}