import { User } from '../entities';

export interface IUserServiceInterface {
  validateUserById(id: string): Promise<User | undefined>;
}
