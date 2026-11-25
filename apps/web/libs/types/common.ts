export interface T {
	[key: string]: unknown;
}

/** Text in both languages; `ko` falls back to `en`. */
export interface LocalizedText {
	en: string;
	ko?: string | null;
}

export interface Media {
	url: string;
	alt?: LocalizedText | null;
	width?: number | null;
	height?: number | null;
	blurDataUrl?: string | null;
}

export interface TotalCounter {
	total: number;
}
