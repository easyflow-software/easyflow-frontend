import { User } from './user.type';

export type UserResponse = User;

export type SignupResponse = {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
};
