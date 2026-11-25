import { ProjectCategory } from '../../enums/project.enum';
import { LocalizedText, Media } from '../common';

export interface ProjectTheme {
	accent?: string | null;
	dark?: boolean | null;
}

export interface ProjectMedia {
	cover?: Media | null;
	thumbnail?: Media | null;
}

export interface Project {
	_id: string;
	slug: string;
	title: string;
	subtitle: LocalizedText;
	category: ProjectCategory;
	showOnHome: boolean;
	theme?: ProjectTheme | null;
	media?: ProjectMedia | null;
}
