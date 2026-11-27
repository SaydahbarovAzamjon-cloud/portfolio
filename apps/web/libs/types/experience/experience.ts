import { LocalizedText } from '../common';
import { ProjectSkill } from '../project/project';

export interface Experience {
	_id: string;
	company: string;
	role: LocalizedText;
	location?: LocalizedText | null;
	startDate: string;
	endDate?: string | null;
	summary?: LocalizedText | null;
	responsibilities: LocalizedText[];
	achievements?: LocalizedText[];
	skills?: ProjectSkill[] | null;
	order?: number | null;
}
