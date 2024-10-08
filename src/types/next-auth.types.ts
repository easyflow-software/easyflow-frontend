import { CredentialsSignin } from 'next-auth';

export class InvalidSignin extends CredentialsSignin {
  static code: string;
  constructor(message: string) {
    super();

    this.code = message;
  }
}
