import { ProjectCategory, ProjectStatus } from '../../enums/project.enum';
import { LocalizedText, Media } from '../common';

export interface ProjectTheme {
	accent?: string | null;
	dark?: boolean | null;
}

export interface ProjectMedia {
	cover?: Media | null;
	thumbnail?: Media | null;
}

export interface ProjectLinks {
	live?: string | null;
	github?: string | null;
}

/** The parts of a skill a project card needs. */
export interface ProjectSkill {
	_id: string;
	name: string;
	slug: string;
	icon: string;
}

export interface Project {
	_id: string;
	slug: string;
	title: string;
	subtitle: LocalizedText;
	summary?: LocalizedText | null;
	category: ProjectCategory;
	status?: ProjectStatus | null;
	order?: number | null;
	showOnHome: boolean;
	links?: ProjectLinks | null;
	skillIds?: string[] | null;
	skills?: ProjectSkill[] | null;
	theme?: ProjectTheme | null;
	media?: ProjectMedia | null;
}
