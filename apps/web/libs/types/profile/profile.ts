import { SocialPlatform } from '../../enums/profile.enum';
import { LocalizedText, Media } from '../common';

export interface IconCard {
	icon: string;
	title: LocalizedText;
	description?: LocalizedText | null;
}

export interface Stat {
	value: string;
	label: LocalizedText;
}

export interface Moment {
	image: Media;
	caption?: LocalizedText | null;
}

export interface SocialLink {
	platform: SocialPlatform;
	url: string;
	handle?: string | null;
}

export interface Location {
	city: LocalizedText;
	country: LocalizedText;
	timezone: string;
}

export interface Availability {
	isAvailable: boolean;
	label?: LocalizedText | null;
}

export interface Resume {
	en?: Media | null;
	ko?: Media | null;
}

export interface ProfileImages {
	heroPortrait?: Media | null;
	aboutPortrait?: Media | null;
}

export interface Profile {
	_id: string;
	name: string;
	fullName: LocalizedText;
	headline: LocalizedText;
	tagline?: LocalizedText | null;
	contactEmail: string;
	location: Location;
	availability: Availability;
	socials: SocialLink[];
	resume?: Resume | null;
	heroOrbitLabels?: LocalizedText[];
	bioShort?: LocalizedText | null;
	focusAreas?: IconCard[];
	manualStats?: Stat[];
	moments?: Moment[];
	images?: ProfileImages | null;
}
