// permission.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RedisService } from '../../redis';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(RedisService)
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Retrieve the permission metadata set on the route handler
    const permission: string = this.reflector.get<string>(
      'permission',
      context.getHandler(),
    );

    // If no permission is set, allow access
    if (!permission) {
      return true;
    }

    // Retrieve the request object
    const req = context.switchToHttp().getRequest();

    // Allow access for super admin
    if (req.user.superAdmin) {
      return true;
    }

    // Retrieve permissions from Redis for each role asynchronously
    const promises: Promise<string>[] = req.roles.map((role: number) => {
      const key: string = this.redisService.generateRoleKey(role.toString());
      return this.redisService.get(key);
    });
    const redisPermissions: string[] = await Promise.all(promises);

    // Parse Redis permissions and add them to the userPermissions array
    const permissions: any[] = redisPermissions.map((redisPermission: string) =>
      JSON.parse(redisPermission),
    );
    const userPermissions: string[] = permissions.flat();

    // Extract the access name from the permission and check for manage permission
    const accessName: string = permission.split('_')[1];
    const manage: string = `manage_${accessName}`;

    // Allow access if the user has the manage permission or the specific permission
    return (
      userPermissions.includes(manage) || userPermissions.includes(permission)
    );
  }
}
