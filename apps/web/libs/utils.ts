import { LocalizedText } from './types/common';

/** Picks the text for the current language; Korean falls back to English. */
export const localize = (text: LocalizedText | null | undefined, locale: string | undefined): string => {
	if (!text) return '';
	if (locale === 'ko' && text.ko) return text.ko;
	return text.en;
};

/** One dune period is 2100 units wide (the SVG viewBox width the dunes are drawn in). */
export const DUNE_PERIOD = 2100;

/**
 * Dune outline drawn twice side by side (0 → 4200), built from sine waves that repeat exactly
 * every 2100 units, so sliding it left by 2100 loops forever without a seam.
 * `bottom` is the viewBox height the shape is closed at.
 */
export const dunePath = (
	base: number,
	waves: [amplitude: number, cycles: number, phase: number][],
	bottom: number = 260,
): string => {
	const points: string[] = [];
	for (let x = 0; x <= DUNE_PERIOD * 2; x += 20) {
		const y = waves.reduce(
			(sum, [amplitude, cycles, phase]) => sum + amplitude * Math.sin((2 * Math.PI * cycles * x) / DUNE_PERIOD + phase),
			base,
		);
		points.push(`${x} ${y.toFixed(1)}`);
	}
	return `M${points.join(' L')} V ${bottom} H 0 Z`;
};

/** Whole months between two dates, counting both the first and the last month (Jun 2023 – Dec 2024 = 19). */
export const monthsBetween = (start: string, end?: string | null): number => {
	const from = new Date(start);
	const to = end ? new Date(end) : new Date();
	return (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + to.getUTCMonth() - from.getUTCMonth() + 1;
};

/** "Jun 2023" / "2023.06" (UTC, so the server and the browser print the same). */
export const formatMonth = (date: string, locale: string | undefined): string => {
	const value = new Date(date);
	if (locale === 'ko') return `${value.getUTCFullYear()}.${String(value.getUTCMonth() + 1).padStart(2, '0')}`;
	return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(value);
};
