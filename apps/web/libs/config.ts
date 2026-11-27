import { PageType } from './enums/visitor.enum';

export const REACT_APP_API_URL = `${process.env.REACT_APP_API_URL}`;

/** Navbar / footer links, in mockup order (01 – 07). */
export const navLinks = [
	{ key: 'home', href: '/' },
	{ key: 'about', href: '/about' },
	{ key: 'projects', href: '/projects' },
	{ key: 'skills', href: '/skills' },
	{ key: 'experience', href: '/experience' },
	{ key: 'journal', href: '/journal' },
	{ key: 'contact', href: '/contact' },
];

/** Home page sections, top to bottom. Each one shows its place, e.g. "02 / 05". */
export const homeSections = ['hero', 'about', 'work', 'skills', 'contact'] as const;
export type HomeSection = (typeof homeSections)[number];

const twoDigits = (value: number): string => String(value).padStart(2, '0');
export const sectionTotal = twoDigits(homeSections.length);
export const sectionNumber = (key: HomeSection): string => twoDigits(homeSections.indexOf(key) + 1);
export const sectionCount = (key: HomeSection): string => `${sectionNumber(key)} / ${sectionTotal}`;

/** A page's place in the navbar, e.g. "02 / 07" for About. */
export const pageCount = (key: string): string =>
	`${twoDigits(navLinks.findIndex((link) => link.key === key) + 1)} / ${twoDigits(navLinks.length)}`;

/** Which page type a route is, for visit tracking. */
export const pageTypes: Record<string, PageType> = {
	'/': PageType.HOME,
	'/about': PageType.ABOUT,
	'/projects': PageType.PROJECTS,
	'/projects/[slug]': PageType.PROJECT,
	'/skills': PageType.SKILLS,
	'/experience': PageType.EXPERIENCE,
	'/journal': PageType.JOURNAL,
	'/journal/[slug]': PageType.ARTICLE,
	'/contact': PageType.CONTACT,
};

export const Messages = {
	error1: 'Something went wrong!',
	error2: 'Please login first!',
	error3: 'Please fulfill all inputs!',
	error4: 'Message is empty!',
	error5: 'Only images with jpeg, jpg, png, webp format allowed!',
};
