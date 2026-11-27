import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next/pages';
import { useQuery } from '@apollo/client';
import { Stack, Box } from '@mui/material';
import { motion, useReducedMotion } from 'motion/react';
import { LuArrowDownRight, LuBuilding2, LuCalendarDays, LuDownload, LuLayers } from 'react-icons/lu';
import { GET_PROFILE } from '../../../apollo/user/query';
import { formatMonth } from '../../utils';
import { Profile } from '../../types/profile/profile';
import useExperiences from '../../hooks/useExperiences';
import DownloadMenu from '../common/DownloadMenu';
import heroBackground from '../../../public/img/experience-hero-bg.webp';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The background photo is 1921 x 819. The trail and the pins use the same coordinates, and both the photo
 * and the SVG are scaled the same way (cover, anchored bottom-right), so the trail always lies on the mountain.
 */
const PHOTO = { width: 1921, height: 819 };
const TRAIL =
	'M 830 819 C 858 806, 947 764, 1000 738 C 1053 712, 1100 684, 1150 662 C 1200 640, 1252 624, 1300 605 C 1348 586, 1403 569, 1440 550 C 1477 531, 1499 512, 1520 490 C 1541 468, 1551 445, 1565 420 C 1579 395, 1598 353, 1605 340';
const PINS = [
	{ x: 1150, y: 662 },
	{ x: 1605, y: 340 },
];

const ExperienceHero = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const reduceMotion = useReducedMotion();
	const experiences = useExperiences();
	const sceneRef = useRef<HTMLDivElement>(null);
	// where each pin lands on screen, so the company cards can sit right above it
	const [pinSpots, setPinSpots] = useState<{ x: number; y: number }[]>([]);

	/** LIFECYCLES **/
	useEffect(() => {
		const scene = sceneRef.current;
		if (!scene) return;
		// same maths as "cover, bottom-right": scale to fill, then line the photo up with the right and bottom edges
		const observer = new ResizeObserver(([entry]) => {
			const { width, height } = entry.contentRect;
			const scale = Math.max(width / PHOTO.width, height / PHOTO.height);
			const offsetX = width - PHOTO.width * scale;
			const offsetY = height - PHOTO.height * scale;
			setPinSpots(PINS.map((pin) => ({ x: offsetX + pin.x * scale, y: offsetY + pin.y * scale })));
		});
		observer.observe(scene);
		return () => observer.disconnect();
	}, []);

	/** APOLLO REQUESTS **/
	const { data: getProfileData } = useQuery<{ getProfile: Profile }>(GET_PROFILE, { fetchPolicy: 'cache-first' });
	const profile = getProfileData?.getProfile;

	const rise = (delay: number, y: number = 30) => ({
		initial: { opacity: 0, y: reduceMotion ? 0 : y },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.9, ease: EASE, delay },
	});

	return (
		<Stack component={'section'} className={'experience-hero'}>
			{/* background: the mountain photo, the glowing trail and the company pins on top of it */}
			<Box className={'exp-hero-scene'} ref={sceneRef} aria-hidden={'true'}>
				<Image
					src={heroBackground}
					alt={''}
					fill
					priority
					sizes={'100vw'}
					placeholder={'blur'}
					className={'scene-photo'}
				/>
				<svg
					className={'scene-trail'}
					viewBox={`0 0 ${PHOTO.width} ${PHOTO.height}`}
					preserveAspectRatio={'xMaxYMax slice'}
				>
					<defs>
						<filter id={'exp-glow'} x={'-20%'} y={'-20%'} width={'140%'} height={'140%'}>
							<feGaussianBlur stdDeviation={'7'} result={'blur'} />
							<feMerge>
								<feMergeNode in={'blur'} />
								<feMergeNode in={'SourceGraphic'} />
							</feMerge>
						</filter>
					</defs>
					<motion.path
						className={'trail'}
						d={TRAIL}
						filter={'url(#exp-glow)'}
						initial={{ pathLength: reduceMotion ? 1 : 0 }}
						animate={{ pathLength: 1 }}
						transition={{ duration: 2.2, ease: EASE, delay: 0.6 }}
					/>
					{/* one pin per company (at most two) */}
					{PINS.slice(0, experiences.length).map((pin, index) => (
						<motion.circle
							key={index}
							className={'trail-pin'}
							cx={pin.x}
							cy={pin.y}
							r={11}
							initial={{ opacity: 0, scale: reduceMotion ? 1 : 0 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5, ease: EASE, delay: 1.2 + index * 1 }}
						/>
					))}
				</svg>

				{pinSpots.length > 0 &&
					experiences.slice(0, 2).map((experience, index) => (
						<motion.div
							key={experience._id}
							className={'trail-card'}
							style={{ left: pinSpots[index].x, top: pinSpots[index].y }}
							initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, ease: EASE, delay: 1.4 + index * 1 }}
						>
							<span className={'icon'}>
								<LuBuilding2 />
							</span>
							<span>
								<strong>{experience.company}</strong>
								<small>
									{formatMonth(experience.startDate, router.locale)} –{' '}
									{experience.endDate ? formatMonth(experience.endDate, router.locale) : t('experience.present')}
								</small>
							</span>
						</motion.div>
					))}
			</Box>

			<Stack className={'exp-hero-main'}>
				<Stack className={'exp-hero-content'}>
					<motion.div className={'eyebrow'} {...rise(0.1, 20)}>
						<span className={'label'}>{t('experience.hero.eyebrow')}</span>
						<span className={'line'} />
					</motion.div>

					<motion.h1
						className={'title'}
						initial={'hidden'}
						animate={'show'}
						transition={{ staggerChildren: 0.14, delayChildren: 0.2 }}
					>
						{[t('experience.hero.title1'), t('experience.hero.title2')].map((line, index) => (
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

					<motion.p className={'text'} {...rise(0.55)}>
						{t('experience.hero.text')}
					</motion.p>

					<motion.div className={'hero-stats'} {...rise(0.7, 20)}>
						<span className={'hero-stat'}>
							<span className={'icon'}>
								<LuCalendarDays />
							</span>
							<span>
								<strong>{t('experience.hero.yearsValue')}</strong>
								<small>{t('experience.hero.yearsLabel')}</small>
							</span>
						</span>
						<span className={'hero-stat'}>
							<span className={'icon'}>
								<LuLayers />
							</span>
							<span>
								<strong>{t('experience.hero.companies', { count: experiences.length })}</strong>
								<small>{t('experience.hero.projects')}</small>
							</span>
						</span>
					</motion.div>

					<motion.div className={'buttons'} {...rise(0.85, 20)}>
						<a href={'#career-journey'} className={'button button-accent'}>
							{t('experience.hero.journey')}
							<LuArrowDownRight />
						</a>
						<DownloadMenu resume={profile?.resume} portfolio={profile?.portfolio} placement={'top'}>
							<span className={'button button-outline'}>
								<LuDownload />
								{t('experience.hero.download')}
							</span>
						</DownloadMenu>
					</motion.div>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default ExperienceHero;
