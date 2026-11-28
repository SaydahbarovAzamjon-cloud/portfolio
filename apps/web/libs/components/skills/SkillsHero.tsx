import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next/pages';
import { Stack, Box } from '@mui/material';
import { useQuery } from '@apollo/client';
import { motion, useReducedMotion } from 'motion/react';
import { IconType } from 'react-icons';
import {
	LuArrowUpRight,
	LuBadgeCheck,
	LuBrainCircuit,
	LuCloudUpload,
	LuCodeXml,
	LuDownload,
	LuLayers,
	LuRocket,
	LuTarget,
	LuZap,
} from 'react-icons/lu';
import { GET_PROFILE, GET_SKILLS } from '../../../apollo/user/query';
import { Profile } from '../../types/profile/profile';
import { SkillCategory } from '../../types/skill/skill';
import { pageCount } from '../../config';
import { getSkillBrand } from '../../skillIcons';
import DownloadMenu from '../common/DownloadMenu';
import ScrollRevealText from '../common/ScrollRevealText';
import RichText from '../common/RichText';
import ContributionArt, { ContributionArtKind } from '../experience/ContributionArt';
import peaks from '../../../public/img/experience-hero-bg.webp';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Four capabilities, each backed by the tools from the CV (text in skills.hero.<key>Title / <key>Text). */
const CAPABILITIES: { key: string; icon: IconType; art: ContributionArtKind; tools: string[] }[] = [
	{ key: 'fullstack', icon: LuCodeXml, art: 'fullstack', tools: ['Next.js', 'NestJS', 'GraphQL', 'MongoDB'] },
	{ key: 'ai', icon: LuBrainCircuit, art: 'ai', tools: ['PyTorch', 'FastAPI', 'OpenCV', 'Gemini API'] },
	{ key: 'devops', icon: LuCloudUpload, art: 'deploy', tools: ['Docker', 'NGINX', 'PM2', 'Ubuntu VPS'] },
	{ key: 'realtime', icon: LuZap, art: 'realtime', tools: ['WebSocket', 'Socket.IO', 'JWT', 'RBAC'] },
];

/** The core stack, scrolling in the dark bar (icon keys from skillIcons). */
const CORE_STACK = [
	'nextjs',
	'react',
	'typescript',
	'nestjs',
	'graphql',
	'mongodb',
	'nodejs',
	'python',
	'pytorch',
	'fastapi',
	'opencv',
	'geminiapi',
	'docker',
	'nginx',
	'ubuntu',
	'socketio',
];
/** Skills listed in the CV, used when the database has none yet. */
const CV_SKILL_COUNT = 47;

const SkillsHero = () => {
	const { t } = useTranslation('common');
	const reduceMotion = useReducedMotion();

	/** APOLLO REQUESTS **/
	const { data: getProfileData } = useQuery<{ getProfile: Profile }>(GET_PROFILE, { fetchPolicy: 'cache-first' });
	const { data: getSkillsData } = useQuery<{ getSkills: SkillCategory[] }>(GET_SKILLS, { fetchPolicy: 'cache-first' });
	const profile = getProfileData?.getProfile;

	const counted = (getSkillsData?.getSkills ?? []).reduce((sum, category) => sum + (category.skills?.length ?? 0), 0);
	const total = counted || CV_SKILL_COUNT;
	// "47" → "40+": never claim more than there is
	const technologies = total >= 10 ? `${Math.floor(total / 10) * 10}+` : `${total}`;

	const rise = (delay: number, y: number = 30) => ({
		initial: { opacity: 0, y: reduceMotion ? 0 : y },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.9, ease: EASE, delay },
	});

	return (
		<Stack component={'section'} className={'skills-hero'}>
			<Box className={'skills-hero-bg'} aria-hidden={'true'}>
				<Image src={peaks} alt={''} fill priority sizes={'60vw'} placeholder={'blur'} />
			</Box>
			{/* a thin orbit line with a dot travelling along it */}
			<svg
				className={'skills-orbit'}
				viewBox={'0 0 600 800'}
				preserveAspectRatio={'xMinYMin slice'}
				aria-hidden={'true'}
			>
				<path id={'skills-orbit-path'} d={'M 40 800 C 80 520, 300 200, 600 -20'} />
				{!reduceMotion && (
					<circle r={8} fill={'#ff3d00'}>
						<animateMotion
							dur={'14s'}
							repeatCount={'indefinite'}
							keyPoints={'0;1;0'}
							keyTimes={'0;0.5;1'}
							calcMode={'linear'}
						>
							<mpath href={'#skills-orbit-path'} />
						</animateMotion>
					</circle>
				)}
			</svg>

			<Box className={'skills-hero-main'}>
				{/* left: the pitch */}
				<motion.div className={'skills-hero-intro'} {...rise(0, 40)}>
					<motion.div className={'eyebrow'} {...rise(0.15, 16)}>
						<span className={'dot'} />
						<span>{t('skills.hero.eyebrow')}</span>
						<span className={'line'} />
						<span className={'count'}>{pageCount('skills')}</span>
					</motion.div>

					<motion.h2
						className={'title'}
						initial={'hidden'}
						animate={'show'}
						transition={{ staggerChildren: 0.14, delayChildren: 0.25 }}
					>
						{[t('skills.hero.title1'), t('skills.hero.title2')].map((line, index) => (
							<span key={line} className={'title-mask'}>
								<motion.span
									className={`title-line ${index === 1 ? 'accent' : ''}`}
									variants={{ hidden: { y: reduceMotion ? '0%' : '105%' }, show: { y: '0%' } }}
									transition={{ duration: 1.1, ease: EASE }}
								>
									{line}
								</motion.span>
							</span>
						))}
					</motion.h2>

					<motion.div {...rise(0.55)}>
						<ScrollRevealText className={'text'} text={t('skills.hero.text')} dim={0.3} />
					</motion.div>

					{/* the proof a recruiter looks for first */}
					<motion.div className={'proof'} {...rise(0.7, 16)}>
						<span>
							<LuRocket />
							{t('skills.hero.proofLive')}
						</span>
						<span>
							<LuTarget />
							{t('skills.hero.proofAccuracy')}
						</span>
						<span>
							<LuBadgeCheck />
							{t('skills.hero.proofCert')}
						</span>
					</motion.div>

					<motion.div className={'buttons'} {...rise(0.85, 16)}>
						<Link href={'/projects'} className={'button button-dark'}>
							{t('skills.hero.projects')}
							<LuArrowUpRight />
						</Link>
						<DownloadMenu resume={profile?.resume} portfolio={profile?.portfolio} placement={'bottom'}>
							<span className={'button button-outline'}>
								{t('skills.hero.download')}
								<LuDownload />
							</span>
						</DownloadMenu>
					</motion.div>
				</motion.div>

				{/* right: four capabilities */}
				<Box className={'capability-grid'}>
					{CAPABILITIES.map((item, index) => {
						const Icon = item.icon;
						return (
							<motion.article
								key={item.key}
								className={'capability-card'}
								initial={{ opacity: 0, y: reduceMotion ? 0 : 50, scale: reduceMotion ? 1 : 0.95 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								transition={{ duration: 0.9, ease: EASE, delay: 0.35 + index * 0.12 }}
							>
								<span className={'capability-art'}>
									<ContributionArt kind={item.art} />
								</span>
								<span className={'capability-icon'}>
									<Icon />
								</span>
								<strong>{t(`skills.hero.${item.key}Title`)}</strong>
								<RichText className={'capability-text'} text={t(`skills.hero.${item.key}Text`)} />
								<span className={'capability-tools'}>
									{item.tools.map((tool) => (
										<span key={tool}>{tool}</span>
									))}
								</span>
							</motion.article>
						);
					})}
				</Box>
			</Box>

			{/* bottom: numbers and the core stack */}
			<motion.div className={'skills-bar'} {...rise(0.9, 40)}>
				<Box className={'bar-stats'}>
					<span className={'bar-stat'}>
						<LuCodeXml />
						<span>
							<strong>{t('skills.hero.liveValue')}</strong>
							<small>{t('skills.hero.liveLabel')}</small>
						</span>
					</span>
					<span className={'bar-stat'}>
						<LuRocket />
						<span>
							<strong>{t('skills.hero.yearsValue')}</strong>
							<small>{t('skills.hero.yearsLabel')}</small>
						</span>
					</span>
					<span className={'bar-stat'}>
						<LuLayers />
						<span>
							<strong>{technologies}</strong>
							<small>{t('skills.hero.techLabel')}</small>
						</span>
					</span>
				</Box>
				<Box className={'bar-marquee'}>
					<span className={'marquee-track'}>
						{/* the list twice, so sliding by half loops without a jump */}
						{[...CORE_STACK, ...CORE_STACK].map((key, index) => {
							const brand = getSkillBrand(key);
							const Icon = brand.icon;
							return (
								<span
									key={`${key}-${index}`}
									className={'marquee-icon'}
									title={key}
									aria-hidden={index >= CORE_STACK.length}
								>
									<Icon style={{ color: brand.color }} />
								</span>
							);
						})}
					</span>
				</Box>
			</motion.div>
		</Stack>
	);
};

export default SkillsHero;
