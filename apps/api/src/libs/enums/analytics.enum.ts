import { registerEnumType } from '@nestjs/graphql';

export enum DeviceType {
  DESKTOP = 'DESKTOP',
  MOBILE = 'MOBILE',
  TABLET = 'TABLET',
  BOT = 'BOT',
  UNKNOWN = 'UNKNOWN',
}
registerEnumType(DeviceType, { name: 'DeviceType' });

export enum PageType {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  PROJECTS = 'PROJECTS',
  PROJECT = 'PROJECT',
  SKILLS = 'SKILLS',
  EXPERIENCE = 'EXPERIENCE',
  JOURNAL = 'JOURNAL',
  ARTICLE = 'ARTICLE',
  CONTACT = 'CONTACT',
  OTHER = 'OTHER',
}
registerEnumType(PageType, { name: 'PageType' });
