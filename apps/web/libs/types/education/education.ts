import { DegreeType, EducationStatus } from '../../enums/education.enum';
import { LocalizedText } from '../common';

export interface Education {
	_id: string;
	degree: DegreeType;
	institution: LocalizedText;
	program?: LocalizedText | null;
	major?: LocalizedText | null;
	startDate: string;
	endDate?: string | null;
	status: EducationStatus;
	order?: number | null;
}
