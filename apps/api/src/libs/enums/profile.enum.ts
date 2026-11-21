import { registerEnumType } from '@nestjs/graphql';

export enum SocialPlatform {
  GITHUB = 'GITHUB',
  LINKEDIN = 'LINKEDIN',
  TELEGRAM = 'TELEGRAM',
  INSTAGRAM = 'INSTAGRAM',
  X = 'X',
  OTHER = 'OTHER',
}
registerEnumType(SocialPlatform, { name: 'SocialPlatform' });
