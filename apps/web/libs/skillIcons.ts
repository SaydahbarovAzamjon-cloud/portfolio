import { IconType } from 'react-icons';
import { LuBrain, LuCode, LuDatabaseZap, LuKeyRound, LuLock, LuServer, LuShieldCheck, LuZap } from 'react-icons/lu';
import {
	SiApollographql,
	SiDocker,
	SiExpress,
	SiFastapi,
	SiFigma,
	SiGit,
	SiGooglegemini,
	SiGraphql,
	SiJsonwebtokens,
	SiKakao,
	SiMongodb,
	SiMongoose,
	SiEjs,
	SiMui,
	SiNestjs,
	SiNextdotjs,
	SiNginx,
	SiNodedotjs,
	SiNumpy,
	SiOpencv,
	SiPandas,
	SiPm2,
	SiPostgresql,
	SiPostman,
	SiPython,
	SiPytorch,
	SiReact,
	SiRedux,
	SiSass,
	SiSocketdotio,
	SiTailwindcss,
	SiTypescript,
	SiUbuntu,
	SiVite,
} from 'react-icons/si';

export interface SkillBrand {
	icon: IconType;
	color: string;
}

/** Brand icon + colour for a skill, keyed by its icon name or slug (lowercase, no dots or dashes). */
export const SKILL_ICONS: Record<string, SkillBrand> = {
	nextjs: { icon: SiNextdotjs, color: '#000000' },
	react: { icon: SiReact, color: '#149eca' },
	typescript: { icon: SiTypescript, color: '#3178c6' },
	vite: { icon: SiVite, color: '#646cff' },
	reduxtoolkit: { icon: SiRedux, color: '#764abc' },
	redux: { icon: SiRedux, color: '#764abc' },
	apolloclient: { icon: SiApollographql, color: '#311c87' },
	mui: { icon: SiMui, color: '#007fff' },
	materialui: { icon: SiMui, color: '#007fff' },
	tailwindcss: { icon: SiTailwindcss, color: '#06b6d4' },
	scss: { icon: SiSass, color: '#cc6699' },
	nestjs: { icon: SiNestjs, color: '#e0234e' },
	nodejs: { icon: SiNodedotjs, color: '#5fa04e' },
	express: { icon: SiExpress, color: '#000000' },
	expressjs: { icon: SiExpress, color: '#000000' },
	graphql: { icon: SiGraphql, color: '#e10098' },
	mongodb: { icon: SiMongodb, color: '#47a248' },
	mongoose: { icon: SiMongoose, color: '#880000' },
	ejs: { icon: SiEjs, color: '#b4ca65' },
	postgresql: { icon: SiPostgresql, color: '#4169e1' },
	websocket: { icon: LuZap, color: '#ff6a00' },
	socketio: { icon: SiSocketdotio, color: '#010101' },
	jwt: { icon: SiJsonwebtokens, color: '#d63aff' },
	python: { icon: SiPython, color: '#3776ab' },
	fastapi: { icon: SiFastapi, color: '#009688' },
	pytorch: { icon: SiPytorch, color: '#ee4c2c' },
	torchvision: { icon: SiPytorch, color: '#ee4c2c' },
	opencv: { icon: SiOpencv, color: '#5c3ee8' },
	numpy: { icon: SiNumpy, color: '#4d77cf' },
	pandas: { icon: SiPandas, color: '#150458' },
	convnexttiny: { icon: LuBrain, color: '#ff6a00' },
	mobilenetv2: { icon: LuBrain, color: '#ff6a00' },
	geminiapi: { icon: SiGooglegemini, color: '#8e75b2' },
	gemini: { icon: SiGooglegemini, color: '#8e75b2' },
	docker: { icon: SiDocker, color: '#2496ed' },
	dockercompose: { icon: SiDocker, color: '#2496ed' },
	vpsdeployment: { icon: LuServer, color: '#ff6a00' },
	ssl: { icon: LuLock, color: '#2e7d32' },
	oauth: { icon: LuKeyRound, color: '#ff6a00' },
	refreshtokens: { icon: LuKeyRound, color: '#ff6a00' },
	bcrypt: { icon: LuLock, color: '#ff6a00' },
	'2fa': { icon: LuShieldCheck, color: '#2e7d32' },
	restapis: { icon: LuServer, color: '#ff6a00' },
	rag: { icon: LuDatabaseZap, color: '#ff6a00' },
	nginx: { icon: SiNginx, color: '#009639' },
	ubuntu: { icon: SiUbuntu, color: '#e95420' },
	ubuntulinux: { icon: SiUbuntu, color: '#e95420' },
	pm2: { icon: SiPm2, color: '#2b037a' },
	kakaomaps: { icon: SiKakao, color: '#e5b800' },
	git: { icon: SiGit, color: '#f05032' },
	postman: { icon: SiPostman, color: '#ff6c37' },
	figma: { icon: SiFigma, color: '#f24e1e' },
};

const FALLBACK: SkillBrand = { icon: LuCode, color: '#ff3d00' };

/** "Next.js" → "nextjs", "Kakao Maps" → "kakaomaps". */
export const skillKey = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]/g, '');

export const getSkillBrand = (icon?: string | null, slugOrName?: string | null): SkillBrand =>
	SKILL_ICONS[skillKey(icon ?? '')] ?? SKILL_ICONS[skillKey(slugOrName ?? '')] ?? FALLBACK;
