import React, { useRef } from 'react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next/pages';
import { useQuery } from '@apollo/client';
import { Stack, Box } from '@mui/material';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { LuArrowRight, LuArrowUpRight, LuCircleCheck, LuLoaderCircle, LuLock } from 'react-icons/lu';
import { GET_PROJECTS } from '../../../apollo/user/query';
import { localize } from '../../utils';
import { getSkillBrand } from '../../skillIcons';
import { Project } from '../../types/project/project';
import { ProjectStatus } from '../../enums/project.enum';
import { FALLBACK_PROJECTS } from '../../fallback';
import fixoraHome from '../../../public/img/projects/fixora-home.webp';
import carviaHome from '../../../public/img/projects/carvia-home.webp';
import gadgetStoreHome from '../../../public/img/projects/gadget-store-home.webp';

const EASE = [0.22, 1, 0.36, 1] as const;
const CARD_LIMIT = 4;
const CHIP_LIMIT = 5; // the rest of the stack is behind a "+N" chip

/** Home screenshots shipped with the site, used until the admin uploads a thumbnail. */
const DEFAULT_SHOTS: Record<string, StaticImageData> = {
	fixora: fixoraHome,
	carvia: carviaHome,
	'gadget-store': gadgetStoreHome,
	gadgetstore: gadgetStoreHome,
};

interface WorkCardProps {
	project: Project;
	index: number;
}

const WorkCard = (props: WorkCardProps) => {
	const { project, index } = props;
	const router = useRouter();
	const { t } = useTranslation('common');
	const reduceMotion = useReducedMotion();
	const cardRef = useRef<HTMLDivElement>(null);

	const inProgress = project.status === ProjectStatus.IN_PROGRESS;
	const thumbnail = project.media?.thumbnail;
	const shot = DEFAULT_SHOTS[project.slug];
	const accent = project.theme?.accent ?? undefined;
	// skills come back in database order: show them in the order the admin picked
	const order = project.skillIds ?? [];
	const skills = [...(project.skills ?? [])].sort((a, b) => order.indexOf(a._id) - order.indexOf(b._id));

	/** SCROLL MOTION: the device drifts slower than the card (depth) **/
	const { scrollYProgress } = useScroll({ target: cardRef, offset: ['start end', 'end start'] });
	const range = reduceMotion ? 0 : 1;
	const deviceY = useTransform(scrollYProgress, [0, 1], [40 * range, -40 * range]);

	return (
		<motion.article
			ref={cardRef}
			className={`work-card ${inProgress ? 'in-progress' : ''}`}
			style={accent ? ({ '--card-accent': accent } as React.CSSProperties) : undefined}
			initial={{ opacity: 0, y: reduceMotion ? 0 : 70, scale: reduceMotion ? 1 : 0.96 }}
			whileInView={{ opacity: 1, y: 0, scale: 1 }}
			viewport={{ once: true, amount: 0.25 }}
			transition={{ duration: 1, ease: EASE, delay: (index % 2) * 0.12 }}
		>
			<Link href={`/projects/${project.slug}`} className={'card-link'} aria-label={project.title} />

			<span className={'number'}>{String(index + 1).padStart(2, '0')}</span>
			<span className={`status ${inProgress ? 'progress' : 'live'}`}>
				{inProgress ? <LuLoaderCircle /> : <LuCircleCheck />}
				{inProgress ? t('home.work.inProgress') : t('home.work.live')}
			</span>

			<Stack className={'card-text'}>
				<h3 className={'title'}>{project.title}</h3>
				<strong className={'subtitle'}>{localize(project.subtitle, router.locale)}</strong>
				<p className={'summary'}>{localize(project.summary, router.locale)}</p>
			</Stack>

			<motion.div className={'device'} style={{ y: deviceY }} aria-hidden={'true'}>
				<div className={'laptop'}>
					<div className={'screen'}>
						{thumbnail?.url ? (
							<Image
								src={thumbnail.url}
								alt={''}
								fill
								sizes={'(max-width: 768px) 90vw, 30vw'}
								placeholder={thumbnail.blurDataUrl ? 'blur' : 'empty'}
								blurDataURL={thumbnail.blurDataUrl ?? undefined}
							/>
						) : shot ? (
							<Image src={shot} alt={''} fill sizes={'(max-width: 768px) 90vw, 30vw'} placeholder={'blur'} />
						) : null}
						{inProgress && (
							<span className={'coming-soon'}>
								<LuLock />
								<strong>{t('home.work.comingSoon')}</strong>
								<small>{t('home.work.inDevelopment')}</small>
							</span>
						)}
					</div>
					<div className={'base'} />
				</div>
			</motion.div>

			<Box className={'stack'}>
				{skills.slice(0, CHIP_LIMIT).map((item) => {
					const brand = getSkillBrand(item.icon, item.slug);
					const Icon = brand.icon;
					return (
						<span key={item._id} className={'tech'}>
							<Icon style={{ color: brand.color }} />
							{item.name}
						</span>
					);
				})}
				{skills.length > CHIP_LIMIT && (
					<span
						className={'tech more'}
						title={skills
							.slice(CHIP_LIMIT)
							.map((item) => item.name)
							.join(', ')}
					>
						+{skills.length - CHIP_LIMIT}
					</span>
				)}
			</Box>

			<span className={'case-study'}>
				<span className={'circle'}>
					<LuArrowRight />
				</span>
				<span className={'label'}>
					{t('home.work.caseStudy')}
					<LuArrowUpRight />
				</span>
			</span>
		</motion.article>
	);
};

const SelectedWork = () => {
	const { t } = useTranslation('common');
	const reduceMotion = useReducedMotion();
	const sectionRef = useRef<HTMLElement>(null);

	/** APOLLO REQUESTS **/
	const { data: getProjectsData } = useQuery<{ getProjects: Project[] }>(GET_PROJECTS, {
		fetchPolicy: 'cache-first',
		variables: { input: { showOnHome: true } },
	});
	const loaded = getProjectsData?.getProjects ?? [];
	const projects = (loaded.length ? loaded : FALLBACK_PROJECTS).slice(0, CARD_LIMIT);

	/** SCROLL MOTION: the arc draws itself, the mountain sinks slowly **/
	const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
	const arcLength = useTransform(scrollYProgress, [0.05, 0.55], [reduceMotion ? 1 : 0, 1]);
	const mountainY = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 0 : 80, reduceMotion ? 0 : -40]);

	return (
		<Stack component={'section'} ref={sectionRef} id={'selected-work'} className={'selected-work'}>
			<svg className={'work-arc'} viewBox={'0 0 1795 876'} preserveAspectRatio={'none'} aria-hidden={'true'}>
				<motion.path d={'M 800 0 C 600 60, 450 180, 400 300 S 300 520, 170 620'} style={{ pathLength: arcLength }} />
			</svg>

			<motion.div className={'mountain'} style={{ y: mountainY }} aria-hidden={'true'}>
				<svg viewBox={'0 0 600 420'} preserveAspectRatio={'xMinYMax slice'}>
					<defs>
						<linearGradient id={'work-peak'} x1={'0'} y1={'0'} x2={'0'} y2={'1'}>
							<stop offset={'0%'} stopColor={'#f08a3c'} />
							<stop offset={'55%'} stopColor={'#d9642a'} />
							<stop offset={'100%'} stopColor={'#fbd9bd'} />
						</linearGradient>
						<linearGradient id={'work-shade'} x1={'0'} y1={'0'} x2={'1'} y2={'1'}>
							<stop offset={'0%'} stopColor={'#8f3a17'} stopOpacity={'0.75'} />
							<stop offset={'100%'} stopColor={'#8f3a17'} stopOpacity={'0'} />
						</linearGradient>
						<linearGradient id={'work-snow'} x1={'0'} y1={'0'} x2={'0'} y2={'1'}>
							<stop offset={'0%'} stopColor={'#fff6ee'} />
							<stop offset={'100%'} stopColor={'#fff6ee'} stopOpacity={'0'} />
						</linearGradient>
						<radialGradient id={'work-mist'} cx={'50%'} cy={'100%'} r={'70%'}>
							<stop offset={'0%'} stopColor={'#fff4ea'} />
							<stop offset={'100%'} stopColor={'#fff4ea'} stopOpacity={'0'} />
						</radialGradient>
					</defs>
					<path
						d={'M -20 420 L 30 340 L 80 320 L 130 280 L 170 300 L 220 240 L 260 262 L 310 200 L 360 250 L 640 420 Z'}
						fill={'#f6b88f'}
						opacity={'0.6'}
					/>
					<path
						d={
							'M 0 420 L 70 340 L 120 345 L 190 262 L 232 240 L 268 180 L 300 118 L 336 160 L 362 150 L 392 182 L 432 222 L 478 252 L 540 318 L 620 420 Z'
						}
						fill={'url(#work-peak)'}
					/>
					<path
						d={
							'M 300 118 L 288 168 L 262 214 L 246 262 L 214 316 L 176 372 L 140 420 L 70 420 L 150 340 L 196 282 L 232 240 L 268 180 Z'
						}
						fill={'url(#work-shade)'}
					/>
					<path
						d={
							'M 362 150 L 356 196 L 336 240 L 326 300 L 306 360 L 296 420 L 268 420 L 290 340 L 312 262 L 330 196 L 336 160 Z'
						}
						fill={'url(#work-shade)'}
						opacity={'0.7'}
					/>
					<path
						d={'M 432 222 L 420 262 L 404 310 L 396 372 L 380 420 L 360 420 L 384 330 L 400 262 Z'}
						fill={'url(#work-shade)'}
						opacity={'0.5'}
					/>
					<path
						d={'M 300 118 L 322 146 L 312 152 L 318 176 L 302 166 L 296 186 L 288 168 L 280 178 L 284 150 Z'}
						fill={'url(#work-snow)'}
					/>
					<path
						d={'M 362 150 L 384 172 L 370 176 L 364 196 L 356 180 L 348 184 L 352 162 Z'}
						fill={'url(#work-snow)'}
					/>
					<path
						d={'M 300 118 L 336 160 L 362 150 L 392 182 L 432 222 L 478 252'}
						fill={'none'}
						stroke={'#fff3e6'}
						strokeWidth={'1.5'}
						opacity={'0.7'}
					/>
					<rect x={'-20'} y={'250'} width={'640'} height={'170'} fill={'url(#work-mist)'} />
				</svg>
			</motion.div>

			<Stack className={'work-main'}>
				<Stack className={'work-intro'}>
					<motion.div
						className={'eyebrow'}
						initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.8, ease: EASE }}
					>
						<span className={'dot'} />
						<span className={'label'}>{t('home.work.eyebrow')}</span>
						<span className={'sep'}>·</span>
						<span className={'years'}>{t('home.work.years')}</span>
					</motion.div>

					<motion.h2
						className={'title'}
						initial={'hidden'}
						whileInView={'show'}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
					>
						{[t('home.work.title1'), t('home.work.title2')].map((line, index) => (
							<span key={line} className={'title-mask'}>
								<motion.span
									className={`title-line ${index === 1 ? 'accent' : ''}`}
									variants={{ hidden: { y: reduceMotion ? '0%' : '105%' }, show: { y: '0%' } }}
									transition={{ duration: 1, ease: EASE }}
								>
									{line}
								</motion.span>
							</span>
						))}
					</motion.h2>

					<motion.p
						className={'text'}
						initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
					>
						{t('home.work.text1')}
						<br />
						{t('home.work.text2')}
					</motion.p>

					<motion.div
						initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.6 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.8, ease: EASE, delay: 0.45 }}
					>
						<Link href={'/projects'} className={'all-button'} aria-label={t('home.work.all')}>
							<LuArrowRight />
						</Link>
					</motion.div>
				</Stack>

				<Box className={'work-grid'}>
					{projects.map((project, index) => (
						<WorkCard key={project._id} project={project} index={index} />
					))}
				</Box>
			</Stack>
		</Stack>
	);
};

export default SelectedWork;
