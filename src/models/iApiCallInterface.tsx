/* eslint-disable @typescript-eslint/no-explicit-any */
import { FailedResponseDto } from "../dtos/FailedResponseDto";

export interface iApiCallInterface {
    data: unknown,
    afterAPISuccess: (res: any) => void,
    afterAPIFail: (res: FailedResponseDto) => void
}