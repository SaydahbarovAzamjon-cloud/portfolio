import { useTranslation } from 'next-i18next/pages';
import { monthsBetween } from '../utils';

/** Returns a formatter: (start, end) → "1 year 7 months" / "1년 7개월". */
const useDuration = () => {
	const { t } = useTranslation('common');
	return (start: string, end?: string | null): string => {
		const months = monthsBetween(start, end);
		const years = Math.floor(months / 12);
		const rest = months % 12;
		const parts: string[] = [];
		if (years) parts.push(t('experience.years', { count: years }));
		if (rest) parts.push(t('experience.months', { count: rest }));
		return parts.join(' ');
	};
};

export default useDuration;
