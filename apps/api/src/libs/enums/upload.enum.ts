import { registerEnumType } from '@nestjs/graphql';

/** Where a file belongs (also its folder on disk). */
export enum UploadFolder {
  PROFILE = 'profile',
  PROJECTS = 'projects',
  ARTICLES = 'articles',
  EXPERIENCE = 'experience',
  EDUCATION = 'education',
  SKILLS = 'skills',
  OTHER = 'other',
}
registerEnumType(UploadFolder, { name: 'UploadFolder' });
