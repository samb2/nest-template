import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RolePermission } from '../../role/entities';
import { PermissionEnum } from '../../common/enums';

@Entity({ name: 'permissions' })
export class Permission {
  @PrimaryGeneratedColumn('uuid') // Specify 'uuid' type for the primary key
  id: string;

  @Column({ type: 'enum', enum: PermissionEnum })
  access: PermissionEnum;

  @OneToMany(
    () => RolePermission,
    (rolePermission) => rolePermission.permission,
  )
  rolePermissions: RolePermission[];
}
