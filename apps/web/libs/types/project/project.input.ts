import { ProjectCategory } from '../../enums/project.enum';

export interface ProjectsInquiry {
	category?: ProjectCategory;
	showOnHome?: boolean;
}
