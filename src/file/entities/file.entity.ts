import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
