import { ErrorCode } from '../enums/error-codes.enum';

export type RequestResponse<T> =
  | {
      success: false;
      errorCode: ErrorCode;
    }
  | {
      success: true;
      data: T;
    };
