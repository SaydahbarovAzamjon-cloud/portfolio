import { registerEnumType } from '@nestjs/graphql';

export enum ProjectCategory {
  FULL_STACK = 'FULL_STACK',
  AI_ML = 'AI_ML',
  WEB = 'WEB',
  MOBILE = 'MOBILE',
  OTHER = 'OTHER',
}
registerEnumType(ProjectCategory, { name: 'ProjectCategory' });

export enum ProjectStatus {
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
}
registerEnumType(ProjectStatus, { name: 'ProjectStatus' });
