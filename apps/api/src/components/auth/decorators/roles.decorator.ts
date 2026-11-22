import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../../libs/enums/user.enum';

export const ROLES_KEY = 'roles';

/** Used together with RolesGuard: @Roles(UserRole.ADMIN) */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
