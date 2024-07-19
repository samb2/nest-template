import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'reset_password' })
export class ResetPassword {
  @PrimaryGeneratedColumn('uuid') // Specify 'uuid' type for the primary key
  id: string;

  @ManyToOne(() => User, (user) => user.resetPassword, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  token: string;

  @Column({ default: false })
  use: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
