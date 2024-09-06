import { User } from '../../auth/entities';

export interface RequestWithUser extends Request {
  user: User;
}
