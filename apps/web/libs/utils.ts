import { LocalizedText } from './types/common';

/** Picks the text for the current language; Korean falls back to English. */
export const localize = (text: LocalizedText | null | undefined, locale: string | undefined): string => {
	if (!text) return '';
	if (locale === 'ko' && text.ko) return text.ko;
	return text.en;
};
