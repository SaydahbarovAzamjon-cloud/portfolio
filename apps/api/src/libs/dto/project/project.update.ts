import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { ProjectInput } from './project.input';

/**
 * Same fields as ProjectInput, all optional. Only the fields you send are changed.
 * A group you send (links, media, theme, caseStudy, period) replaces the saved group.
 */
@InputType()
export class ProjectUpdate extends PartialType(ProjectInput) {
  @IsNotEmpty()
  @IsMongoId()
  @Field(() => String)
  _id: string;
}
