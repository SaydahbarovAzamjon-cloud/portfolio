import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next/pages';
import { useQuery } from '@apollo/client';
import { Stack, Box } from '@mui/material';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { HiArrowUpRight, HiArrowDown } from 'react-icons/hi2';
import { GET_PROFILE } from '../../../apollo/user/query';
import { localize } from '../../utils';
import { Profile } from '../../types/profile/profile';
import defaultPortrait from '../../../public/img/home/hero-portrait.webp';
import { sectionNumber, sectionTotal } from '../../config';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Arc around the portrait, drawn in the hero's own coordinates (mockup size 1795 × 876). */
const ARC_PATH = 'M 1235 108 A 470 470 0 0 1 1560 720';

const HeroSection = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const reduceMotion = useReducedMotion();
	const sectionRef = useRef<HTMLElement>(null);
	const arcRef = useRef<SVGPathElement>(null);
	const [dot, setDot] = useState<{ left: string; top: string } | null>(null);

	/** APOLLO REQUESTS **/
	const { data: getProfileData } = useQuery<{ getProfile: Profile }>(GET_PROFILE, {
		fetchPolicy: 'cache-first',
	});
	const profile = getProfileData?.getProfile;

	const name = (profile?.name ?? 'Azamjon').toUpperCase();
	const headline = localize(profile?.headline, router.locale);
	const eyebrow = headline ? headline.split(/\s*[•|]\s*/) : [t('home.hero.eyebrow1'), t('home.hero.eyebrow2')];
	const tagline = localize(profile?.tagline, router.locale) || t('home.hero.tagline');
	const country = localize(profile?.location?.country, router.locale) || t('top.country');
	const orbit = profile?.heroOrbitLabels?.length
		? profile.heroOrbitLabels.map((label) => localize(label, router.locale))
		: [t('home.hero.orbit1'), t('home.hero.orbit2'), t('home.hero.orbit3')];
	const portrait = profile?.images?.heroPortrait;

	/** SCROLL MOTION: the hero drifts and fades while the next section slides over it **/
	const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
	const nameY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -140]);
	const portraitY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 90]);
	const bgScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.12]);
	const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduceMotion ? 1 : 0]);

	/** LIFECYCLES **/
	useEffect(() => {
		// put the dot one third along the arc
		const path = arcRef.current;
		if (!path) return;
		const point = path.getPointAtLength(path.getTotalLength() * 0.36);
		setDot({ left: `${(point.x / 1795) * 100}%`, top: `${(point.y / 876) * 100}%` });
	}, []);

	const rise = (delay: number) => ({
		initial: { opacity: 0, y: reduceMotion ? 0 : 28 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.9, ease: EASE, delay },
	});

	return (
		<Stack component={'section'} ref={sectionRef} className={'hero-section'}>
			<motion.div className={'hero-bg'} style={{ scale: bgScale }} />

			<motion.div className={'hero-portrait'} style={{ y: portraitY }}>
				<motion.div
					className={'portrait-inner'}
					initial={{ opacity: 0, y: reduceMotion ? 0 : 60, scale: reduceMotion ? 1 : 1.04 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{ duration: 1.4, ease: EASE, delay: 0.35 }}
				>
					{portrait?.url ? (
						<Image
							src={portrait.url}
							alt={localize(portrait.alt, router.locale) || name}
							width={portrait.width ?? 1200}
							height={portrait.height ?? 1500}
							priority
							placeholder={portrait.blurDataUrl ? 'blur' : 'empty'}
							blurDataURL={portrait.blurDataUrl ?? undefined}
						/>
					) : (
						<Image src={defaultPortrait} alt={name} priority placeholder={'blur'} sizes={'40vw'} />
					)}
				</motion.div>
			</motion.div>

			<svg className={'hero-arc'} viewBox={'0 0 1795 876'} preserveAspectRatio={'none'} aria-hidden={'true'}>
				<motion.path
					ref={arcRef}
					d={ARC_PATH}
					fill={'none'}
					vectorEffect={'non-scaling-stroke'}
					initial={{ pathLength: reduceMotion ? 1 : 0 }}
					animate={{ pathLength: 1 }}
					transition={{ duration: 1.8, ease: EASE, delay: 0.6 }}
				/>
			</svg>
			{dot && (
				<motion.span
					className={'hero-arc-dot'}
					style={dot}
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ duration: 0.5, ease: EASE, delay: 1.6 }}
				/>
			)}

			<Box className={'hero-orbit'}>
				{orbit.map((label, index) => (
					<motion.span
						key={label}
						className={`orbit-label orbit-${index + 1}`}
						initial={{ opacity: 0, x: reduceMotion ? 0 : 24 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, ease: EASE, delay: 1.4 + index * 0.15 }}
					>
						{label}
					</motion.span>
				))}
			</Box>

			<motion.div className={'hero-content'} style={{ opacity: contentOpacity }}>
				<Stack className={'container'}>
					<motion.div className={'eyebrow'} {...rise(0.1)}>
						{eyebrow.map((part, index) => (
							<React.Fragment key={part}>
								{index > 0 && <span className={'separator'}>•</span>}
								<span>{part}</span>
							</React.Fragment>
						))}
					</motion.div>

					<motion.h1 className={'hero-name'} style={{ y: nameY }} aria-label={name}>
						{name.split('').map((letter, index) => (
							<span key={`${letter}-${index}`} className={'letter-mask'} aria-hidden={'true'}>
								<motion.span
									className={'letter'}
									initial={{ y: reduceMotion ? '0%' : '105%' }}
									animate={{ y: '0%' }}
									transition={{ duration: 1.1, ease: EASE, delay: 0.2 + index * 0.06 }}
								>
									{letter}
								</motion.span>
							</span>
						))}
					</motion.h1>

					<motion.p className={'tagline'} {...rise(0.7)}>
						{tagline}
					</motion.p>

					<motion.div className={'buttons'} {...rise(0.85)}>
						<Link href={'/projects'} className={'button button-dark'}>
							{t('home.hero.explore')}
							<HiArrowUpRight />
						</Link>
						<Link href={'/contact'} className={'button button-outline'}>
							{t('home.hero.together')}
							<HiArrowUpRight />
						</Link>
					</motion.div>

					<motion.div className={'based-in'} {...rise(1)}>
						<span className={'pin'} />
						<span>
							{t('home.hero.basedIn')}
							<br />
							{country}
						</span>
					</motion.div>
				</Stack>
			</motion.div>

			<motion.a href={'#next'} className={'scroll-hint'} {...rise(1.2)}>
				{t('home.hero.scroll')}
				<HiArrowDown />
			</motion.a>

			<motion.div className={'section-counter'} {...rise(1.2)}>
				<span>{sectionNumber('hero')}</span>
				<span className={'line'} />
				<span>{sectionTotal}</span>
			</motion.div>
		</Stack>
	);
};

export default HeroSection;
