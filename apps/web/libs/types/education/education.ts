import { DegreeType, EducationStatus } from '../../enums/education.enum';
import { LocalizedText, Media } from '../common';

export interface Education {
	_id: string;
	degree: DegreeType;
	institution: LocalizedText;
	institutionNative?: string | null;
	program?: LocalizedText | null;
	major?: LocalizedText | null;
	qualification?: LocalizedText | null;
	location?: LocalizedText | null;
	startDate: string;
	endDate?: string | null;
	status: EducationStatus;
	order?: number | null;
	image?: Media | null;
}
