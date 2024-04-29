import { User } from '../../auth/entities';

export class UserRegisteredEvent {
  user: User;
}
