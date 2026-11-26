import { LocalizedText } from '../common';

export interface Skill {
	_id: string;
	name: string;
	slug: string;
	icon: string;
	featured?: boolean | null;
	order?: number | null;
}

export interface SkillCategory {
	_id: string;
	key: string;
	title: LocalizedText;
	description?: LocalizedText | null;
	icon: string;
	order?: number | null;
	skills?: Skill[] | null;
}
