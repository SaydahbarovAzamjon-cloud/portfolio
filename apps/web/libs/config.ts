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
