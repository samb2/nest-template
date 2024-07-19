import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'files' })
export class File {
  @PrimaryGeneratedColumn('uuid') // Specify 'uuid' type for the primary key
  id: string;

  @Column()
  name: string;

  @Column()
  mimeType: string;

  @Column()
  size: number;

  @Column({ unique: true })
  key: string;

  @Column()
  bucket: string;

  @Column()
  path: string;

  @Column({ name: 'uploaded_by' })
  uploadedBy: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
