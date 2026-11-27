import { Project } from './types/project/project';
import { ProjectCategory, ProjectStatus } from './enums/project.enum';
import { Education } from './types/education/education';
import { Experience } from './types/experience/experience';
import { DegreeType, EducationStatus } from './enums/education.enum';

/**
 * What the site shows while the database is still empty (before the admin fills it in).
 * Every fact here comes from the CV / portfolio.
 */

export const FALLBACK_CONTACT = {
	email: 'saydahbarovazamjon@gmail.com',
	github: 'https://github.com/SaydahbarovAzamjon-cloud',
	linkedin: 'https://www.linkedin.com/in/azamjon-saydahbarov',
};

/** A skill stub built from its name ("Next.js" → slug "nextjs"). */
const skill = (name: string) => ({ _id: name, name, slug: name.toLowerCase().replace(/[^a-z0-9]/g, ''), icon: '' });

/** Home / footer projects, in the order the mockup shows them. */
export const FALLBACK_PROJECTS: Project[] = [
	{
		_id: 'fixora',
		slug: 'fixora',
		title: 'Fixora',
		subtitle: { en: 'AI-assisted Apple device repair marketplace', ko: 'AI 기반 Apple 기기 수리 마켓플레이스' },
		summary: {
			en: 'Connects customers, technicians and admins for iPhone, MacBook, iPad and Apple Watch repairs, with bookings, real-time chat and Gemini-based issue classification.',
			ko: '고객, 수리기사, 관리자를 연결하는 Apple 기기 수리 마켓플레이스로, 예약 시스템, 실시간 채팅, AI 기반 수리 문제 분석 및 분류 기능을 구현했습니다.',
		},
		category: ProjectCategory.FULL_STACK,
		status: ProjectStatus.COMPLETED,
		showOnHome: true,
		skills: ['Next.js', 'NestJS', 'GraphQL', 'MongoDB', 'WebSocket', 'Gemini API', 'Docker', 'NGINX', 'Kakao Maps'].map(
			skill,
		),
	},
	{
		_id: 'carvia',
		slug: 'carvia',
		title: 'CarVia',
		subtitle: { en: 'AI vehicle image classification', ko: 'AI 차량 이미지 분류' },
		summary: {
			en: 'A fine-tuned ConvNeXt-Tiny model that recognises 37 vehicle classes from a single photo and returns the Top-5 predictions with confidence.',
			ko: 'ConvNeXt-Tiny를 파인튜닝해 사진 한 장으로 37개 차량 클래스를 인식하고, 신뢰도와 함께 Top-5 예측을 반환합니다.',
		},
		category: ProjectCategory.AI_ML,
		status: ProjectStatus.COMPLETED,
		showOnHome: true,
		skills: ['Python', 'PyTorch', 'torchvision', 'OpenCV', 'ConvNeXt-Tiny', 'FastAPI', 'Next.js'].map(skill),
	},
	{
		_id: 'gadget-store',
		slug: 'gadget-store',
		title: 'GadgetStore',
		subtitle: { en: 'Full-stack e-commerce platform', ko: '풀스택 이커머스 플랫폼' },
		summary: {
			en: 'An online gadget store with product discovery, cart, checkout and orders, plus a separate admin dashboard and real-time updates.',
			ko: '상품 탐색, 장바구니, 결제, 주문 기능과 별도의 관리자 대시보드, 실시간 업데이트를 갖춘 가젯 온라인 스토어입니다.',
		},
		category: ProjectCategory.FULL_STACK,
		status: ProjectStatus.COMPLETED,
		showOnHome: true,
		skills: [
			'React',
			'TypeScript',
			'Node.js',
			'Express.js',
			'MongoDB',
			'Vite',
			'Redux Toolkit',
			'Socket.IO',
			'JWT',
			'PM2',
		].map(skill),
	},
	{
		_id: 'lumora',
		slug: 'lumora',
		title: 'Lumora',
		subtitle: { en: 'AI personal stylist', ko: 'AI 퍼스널 스타일리스트' },
		summary: {
			en: 'An AI stylist that combines computer vision and recommendations to suggest outfits. Currently in development.',
			ko: '컴퓨터 비전과 추천 기능을 결합해 스타일을 제안하는 AI 스타일리스트입니다. 현재 개발 중입니다.',
		},
		category: ProjectCategory.AI_ML,
		status: ProjectStatus.IN_PROGRESS,
		showOnHome: true,
		theme: { accent: '#8b5cf6' },
		skills: ['Next.js', 'FastAPI', 'OpenCV', 'PyTorch'].map(skill),
	},
];

/** Degrees, newest first (from the diploma and the CV). The status shown on the site comes from endDate. */
export const FALLBACK_EDUCATION: Education[] = [
	{
		_id: 'inje',
		degree: DegreeType.MASTER,
		institution: { en: 'Inje University', ko: '인제대학교' },
		institutionNative: '인제대학교',
		program: { en: 'Global MBA', ko: '글로벌 MBA' },
		major: { en: 'Financial Management', ko: '재무관리' },
		location: { en: 'Gimhae, South Korea', ko: '대한민국 김해' },
		startDate: '2025-03-01',
		endDate: '2027-02-28',
		status: EducationStatus.IN_PROGRESS,
	},
	{
		_id: 'tstu',
		degree: DegreeType.BACHELOR,
		institution: { en: 'Tashkent State Transport University', ko: '타슈켄트 국립교통대학교' },
		institutionNative: 'Toshkent davlat transport universiteti',
		major: {
			en: 'Electrical Engineering, Electromechanics and Electrical Technology (Railway Transport)',
			ko: '전기공학·전기기계·전기기술 (철도 운송)',
		},
		qualification: { en: 'Electromechanical Engineer', ko: '전기기계 엔지니어' },
		location: { en: 'Tashkent, Uzbekistan', ko: '우즈베키스탄 타슈켄트' },
		startDate: '2020-09-01',
		endDate: '2024-06-14',
		status: EducationStatus.COMPLETED,
	},
];

/** Work experience, newest first: every bullet and every stack item is taken from the CV. */
export const FALLBACK_EXPERIENCE: Experience[] = [
	{
		_id: 'ngroup',
		company: 'NGroup',
		role: { en: 'Remote Full-Stack & AI Developer', ko: '원격 풀스택 & AI 개발자' },
		startDate: '2025-01-01',
		endDate: '2026-07-31',
		responsibilities: [
			{
				en: 'Built full-stack web apps: Next.js, React and TypeScript frontends with NestJS and GraphQL backends.',
				ko: 'Next.js·React·TypeScript 프론트엔드와 NestJS·GraphQL 백엔드로 풀스택 웹 앱을 개발했습니다.',
			},
			{
				en: 'Implemented JWT authentication, role-based access control and separate user and admin interfaces.',
				ko: 'JWT 인증, 역할 기반 접근 제어, 사용자·관리자 화면 분리를 구현했습니다.',
			},
			{
				en: 'Designed MongoDB schemas and data-processing logic exposed through GraphQL.',
				ko: 'MongoDB 스키마와 GraphQL로 제공되는 데이터 처리 로직을 설계했습니다.',
			},
			{ en: 'Built real-time features with WebSocket.', ko: 'WebSocket으로 실시간 기능을 구현했습니다.' },
			{
				en: 'Fine-tuned pretrained models (PyTorch, torchvision) for image classification and evaluated them.',
				ko: '사전 학습 모델(PyTorch, torchvision)을 이미지 분류용으로 파인튜닝하고 평가했습니다.',
			},
			{
				en: 'Connected the models to the backend through FastAPI inference APIs and integrated the Gemini API for AI analysis and classification.',
				ko: 'FastAPI 추론 API로 모델을 백엔드에 연결하고, AI 분석·분류를 위해 Gemini API를 연동했습니다.',
			},
			{
				en: 'Set up Docker environments and deployed web and AI services on Ubuntu with NGINX.',
				ko: 'Docker 환경을 구성하고 NGINX로 Ubuntu에 웹·AI 서비스를 배포했습니다.',
			},
		],
		skills: [
			'Next.js',
			'TypeScript',
			'NestJS',
			'GraphQL',
			'MongoDB',
			'Python',
			'PyTorch',
			'torchvision',
			'OpenCV',
			'FastAPI',
			'Gemini API',
			'Docker',
			'Ubuntu',
			'NGINX',
		].map(skill),
	},
	{
		_id: 'itc',
		company: 'ITC Global',
		role: { en: 'Remote Full-Stack Developer', ko: '원격 풀스택 개발자' },
		startDate: '2023-06-01',
		endDate: '2024-12-31',
		responsibilities: [
			{
				en: 'Built Next.js and TypeScript frontends with NestJS backends.',
				ko: 'Next.js·TypeScript 프론트엔드와 NestJS 백엔드를 개발했습니다.',
			},
			{
				en: 'Designed and implemented REST and GraphQL APIs and integrated them with the frontends.',
				ko: 'REST·GraphQL API를 설계·구현하고 프론트엔드와 연동했습니다.',
			},
			{
				en: 'Implemented JWT authentication and authorization, and Mongoose data models.',
				ko: 'JWT 인증·인가와 Mongoose 데이터 모델을 구현했습니다.',
			},
			{
				en: 'Analyzed frontend–backend API and data issues and improved response structures and data handling for consistency.',
				ko: '프론트엔드–백엔드 간 API·데이터 문제를 분석하고, 일관성을 위해 응답 구조와 데이터 처리를 개선했습니다.',
			},
			{
				en: 'Managed processes with PM2, set up an NGINX reverse proxy and wrote deployment scripts on Linux VPS.',
				ko: 'PM2로 프로세스를 관리하고 NGINX 리버스 프록시와 Linux VPS 배포 스크립트를 구성했습니다.',
			},
		],
		skills: [
			'React',
			'Next.js',
			'TypeScript',
			'Node.js',
			'NestJS',
			'Express.js',
			'GraphQL',
			'MongoDB',
			'Mongoose',
			'EJS',
			'JWT',
			'PM2',
			'NGINX',
		].map(skill),
	},
];
