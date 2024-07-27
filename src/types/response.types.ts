import { UserType } from './user.type';

export type UserResponse = UserType;

export type SignupResponse = {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
};
