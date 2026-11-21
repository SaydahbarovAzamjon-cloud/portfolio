import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  ADMIN = 'ADMIN',
}
registerEnumType(UserRole, { name: 'UserRole' });
