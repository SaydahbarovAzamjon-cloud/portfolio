import { registerEnumType } from '@nestjs/graphql';

export enum ContactMessageStatus {
  NEW = 'NEW',
  READ = 'READ',
  REPLIED = 'REPLIED',
  ARCHIVED = 'ARCHIVED',
  SPAM = 'SPAM',
}
registerEnumType(ContactMessageStatus, { name: 'ContactMessageStatus' });
