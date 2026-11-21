import { registerEnumType } from '@nestjs/graphql';

export enum DegreeType {
  BACHELOR = 'BACHELOR',
  MASTER = 'MASTER',
  OTHER = 'OTHER',
}
registerEnumType(DegreeType, { name: 'DegreeType' });

export enum EducationStatus {
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
}
registerEnumType(EducationStatus, { name: 'EducationStatus' });
