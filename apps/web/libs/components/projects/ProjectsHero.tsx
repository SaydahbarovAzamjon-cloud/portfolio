import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { useTranslation } from 'next-i18next/pages';
import { Stack, Box } from '@mui/material';
import { motion, useReducedMotion } from 'motion/react';
import { IconType } from 'react-icons';
import {
	LuArrowDown,
	LuArrowUpRight,
	LuBrainCircuit,
	LuCar,
	LuCirclePlay,
	LuCodeXml,
	LuLayers,
	LuShoppingBag,
	LuWrench,
} from 'react-icons/lu';
import useProjects from '../../hooks/useProjects';
import RichText from '../common/RichText';
import fixoraScreen from '../../../public/img/projects/fixora/search.webp';
import carviaScreen from '../../../public/img/projects/carvia/screen.webp';
import gadgetScreen from '../../../public/img/projects/gadget-store/products.webp';
import peaks from '../../../public/img/experience-hero-bg.webp';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Three laptops in 3D: CarVia at the back, GadgetStore front-right, Fixora front-left. */
const LAPTOPS: { slug: string; screen: StaticImageData; className: string }[] = [
	{ slug: 'carvia', screen: carviaScreen, className: 'laptop-back' },
	{ slug: 'gadget-store', screen: gadgetScreen, className: 'laptop-right' },
	{ slug: 'fixora', screen: fixoraScreen, className: 'laptop-front' },
];

/** Floating labels that open the live sites (text in projects.hero.label_<slug>). */
const LABELS: { slug: string; name: string; icon: IconType; className: string }[] = [
	{ slug: 'carvia', name: 'CarVia', icon: LuCar, className: 'label-carvia' },
	{ slug: 'fixora', name: 'Fixora', icon: LuWrench, className: 'label-fixora' },
	{ slug: 'gadget-store', name: 'GadgetStore', icon: LuShoppingBag, className: 'label-gadget' },
];

const ProjectsHero = () => {
	const { t } = useTranslation('common');
	const reduceMotion = useReducedMotion();
	const projects = useProjects();

	const rise = (delay: number, y: number = 30) => ({
		initial: { opacity: 0, y: reduceMotion ? 0 : y },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.9, ease: EASE, delay },
	});

	/** three tiles: how many projects, and the two kinds of work */
	const stats: { icon: IconType; value: string; label: string }[] = [
		{ icon: LuLayers, value: String(projects.length).padStart(2, '0'), label: t('projects.hero.statProjects') },
		{ icon: LuCodeXml, value: t('projects.hero.statFullstack'), label: t('projects.hero.statFullstackLabel') },
		{ icon: LuBrainCircuit, value: t('projects.hero.statAi'), label: t('projects.hero.statAiLabel') },
	];

	return (
		<Stack component={'section'} className={'projects-hero'}>
			<Box className={'projects-hero-bg'} aria-hidden={'true'}>
				<Image src={peaks} alt={''} fill priority sizes={'100vw'} placeholder={'blur'} />
			</Box>
			<span className={'hero-arc arc-1'} aria-hidden={'true'} />
			<span className={'hero-arc arc-2'} aria-hidden={'true'} />

			<Stack className={'projects-hero-text'}>
				<motion.div className={'eyebrow'} {...rise(0.1, 16)}>
					<span>{t('projects.hero.eyebrow')}</span>
					<span className={'line'} />
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

				<motion.div className={'hero-stats'} {...rise(0.65, 20)}>
					{stats.map((stat) => {
						const Icon = stat.icon;
						return (
							<span key={stat.label} className={'hero-stat'}>
								<Icon />
								<strong>{stat.value}</strong>
								<small>{stat.label}</small>
							</span>
						);
					})}
				</motion.div>

				<motion.div className={'hero-buttons'} {...rise(0.8, 20)}>
					<a href={'#all-projects'} className={'button button-accent'}>
						{t('projects.hero.explore')}
						<LuArrowUpRight />
					</a>
					<a href={'#flagship'} className={'button button-outline'}>
						<LuCirclePlay />
						{t('projects.hero.cases')}
					</a>
				</motion.div>
			</Stack>

			{/* three laptops on a sunset rock; the two labels open the live sites */}
			<Box className={'projects-hero-visual'}>
				{LAPTOPS.map((laptop, index) => (
					<motion.span
						key={laptop.slug}
						className={`laptop ${laptop.className}`}
						aria-hidden={'true'}
						initial={{ opacity: 0, y: reduceMotion ? 0 : 80 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1.1, ease: EASE, delay: 0.3 + index * 0.18 }}
					>
						<span className={'laptop-body'}>
							<span className={'laptop-screen'}>
								<Image src={laptop.screen} alt={''} fill sizes={'(max-width: 1024px) 60vw, 30vw'} />
							</span>
							<span className={'laptop-base'} />
						</span>
					</motion.span>
				))}

				{LABELS.map((label, index) => {
					const Icon = label.icon;
					const live = projects.find((project) => project.slug === label.slug)?.links?.live;
					return (
						<motion.a
							key={label.slug}
							href={live ?? `/projects/${label.slug}`}
							target={live ? '_blank' : undefined}
							rel={live ? 'noreferrer' : undefined}
							className={`hero-label ${label.className}`}
							initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.85 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.7, ease: EASE, delay: 1.1 + index * 0.2 }}
						>
							<span className={'label-icon'}>
								<Icon />
							</span>
							<span className={'label-text'}>
								<strong>
									{label.name}
									<LuArrowUpRight />
								</strong>
								<small>{t(`projects.hero.label_${label.slug}`)}</small>
							</span>
						</motion.a>
					);
				})}
			</Box>

			<motion.a href={'#flagship'} className={'scroll-cue'} {...rise(1.2, 10)}>
				<span className={'cue-line'} />
				{t('projects.hero.scroll')}
				<LuArrowDown />
			</motion.a>
		</Stack>
	);
};

export default ProjectsHero;
