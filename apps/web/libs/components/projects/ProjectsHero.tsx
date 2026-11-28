import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next/pages';
import { Stack, Box } from '@mui/material';
import { motion, useReducedMotion } from 'motion/react';
import { LuBrainCircuit, LuFolderOpen, LuMessagesSquare, LuShieldCheck } from 'react-icons/lu';
import { pageCount } from '../../config';
import { ProjectStatus } from '../../enums/project.enum';
import useProjects from '../../hooks/useProjects';
import RichText from '../common/RichText';
import fixoraHero from '../../../public/img/projects/fixora/hero.webp';
import peaks from '../../../public/img/experience-hero-bg.webp';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Small facts floating around the flagship screenshot (text in projects.hero.float_<key>). */
const FLOATS = [
	{ key: 'ai', icon: LuBrainCircuit },
	{ key: 'realtime', icon: LuMessagesSquare },
	{ key: 'auth', icon: LuShieldCheck },
];

const ProjectsHero = () => {
	const { t } = useTranslation('common');
	const reduceMotion = useReducedMotion();
	const projects = useProjects();
	const live = projects.filter((project) => project.status !== ProjectStatus.IN_PROGRESS).length;

	const rise = (delay: number, y: number = 30) => ({
		initial: { opacity: 0, y: reduceMotion ? 0 : y },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.9, ease: EASE, delay },
	});

	return (
		<Stack component={'section'} className={'projects-hero'}>
			<Box className={'projects-hero-bg'} aria-hidden={'true'}>
				<Image src={peaks} alt={''} fill priority sizes={'60vw'} placeholder={'blur'} />
			</Box>

			<Stack className={'projects-hero-text'}>
				<motion.div className={'eyebrow'} {...rise(0.1, 16)}>
					<span className={'dot'} />
					<span>{t('projects.hero.eyebrow')}</span>
					<span className={'line'} />
					<span className={'count'}>{pageCount('projects')}</span>
				</motion.div>

				<motion.h1
					className={'title'}
					initial={'hidden'}
					animate={'show'}
					transition={{ staggerChildren: 0.14, delayChildren: 0.2 }}
				>
					{[t('projects.hero.title1'), t('projects.hero.title2')].map((line, index) => (
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
				</motion.h1>

				<motion.div {...rise(0.5)}>
					<RichText className={'text'} text={t('projects.hero.text')} />
				</motion.div>

				<motion.div className={'hero-pills'} {...rise(0.65, 16)}>
					<span>
						<LuFolderOpen />
						{t('projects.hero.projects', { count: projects.length })}
					</span>
					<span>
						<i className={'live-dot'} />
						{t('projects.hero.live', { count: live })}
					</span>
				</motion.div>
			</Stack>

			{/* the flagship on a laptop and a phone, floating, with three facts around it */}
			<motion.div className={'projects-hero-visual'} {...rise(0.35, 60)}>
				<span className={'hero-shot'}>
					<Image
						src={fixoraHero}
						alt={t('projects.hero.shotAlt')}
						fill
						priority
						sizes={'(max-width: 1024px) 90vw, 50vw'}
					/>
				</span>
				{FLOATS.map((item, index) => {
					const Icon = item.icon;
					return (
						<motion.span
							key={item.key}
							className={`hero-float float-${index}`}
							initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.7, ease: EASE, delay: 0.9 + index * 0.15 }}
						>
							<Icon />
							{t(`projects.hero.float_${item.key}`)}
						</motion.span>
					);
				})}
			</motion.div>
		</Stack>
	);
};

export default ProjectsHero;
