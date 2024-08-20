import { Socket } from 'socket.io';
import { User } from '../../auth/entities';

export interface CustomClient extends Socket {
  user: User;
}
