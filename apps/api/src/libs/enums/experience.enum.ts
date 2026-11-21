import { registerEnumType } from '@nestjs/graphql';

export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  FREELANCE = 'FREELANCE',
  INTERNSHIP = 'INTERNSHIP',
}
registerEnumType(EmploymentType, { name: 'EmploymentType' });
