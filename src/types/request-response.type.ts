import { ErrorCode } from '@src/enums/error-codes.enum';

export type RequestResponse<T> =
  | {
      success: false;
      errorCode: ErrorCode;
    }
  | {
      success: true;
      data: T;
    };
