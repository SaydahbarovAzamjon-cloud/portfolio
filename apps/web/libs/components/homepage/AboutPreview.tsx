import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next/pages';
import { useQuery } from '@apollo/client';
import { Stack, Box } from '@mui/material';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import {
	// LuArrowRight, // moments strip (hidden for now)
	LuArrowUpRight,
	LuBrain,
	LuChartNoAxesColumnIncreasing,
	LuCodeXml,
	LuLayers,
	LuMapPin,
	LuRocket,
	LuSparkles,
	LuUsers,
} from 'react-icons/lu';
import { IconType } from 'react-icons';
import { GET_PROFILE } from '../../../apollo/user/query';
import { localize } from '../../utils';
import { Profile } from '../../types/profile/profile';
import defaultPortrait from '../../../public/img/home/about-portrait.webp';
import { sectionCount } from '../../config';

const EASE = [0.22, 1, 0.36, 1] as const;
// const MOMENT_SLOTS = 8; // moments strip (hidden for now)

/** Icon names an admin can choose for a focus area. */
const ICONS: Record<string, IconType> = {
	code: LuCodeXml,
	brain: LuBrain,
	layers: LuLayers,
	users: LuUsers,
	rocket: LuRocket,
	sparkles: LuSparkles,
};

const AboutPreview = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const reduceMotion = useReducedMotion();
	const sectionRef = useRef<HTMLElement>(null);
	// const stripRef = useRef<HTMLDivElement>(null); // moments strip (hidden for now)

	/** APOLLO REQUESTS **/
	const { data: getProfileData } = useQuery<{ getProfile: Profile }>(GET_PROFILE, {
		fetchPolicy: 'cache-first',
	});
	const profile = getProfileData?.getProfile;

	const text = localize(profile?.bioShort, router.locale) || t('home.about.text');
	const country = localize(profile?.location?.country, router.locale) || t('top.country');
	const stat = profile?.manualStats?.[0];
	const features = profile?.focusAreas?.length
		? profile.focusAreas.slice(0, 4).map((area) => ({ icon: area.icon, label: localize(area.title, router.locale) }))
		: [
				{ icon: 'code', label: t('home.about.feature1') },
				{ icon: 'brain', label: t('home.about.feature2') },
				{ icon: 'layers', label: t('home.about.feature3') },
				{ icon: 'rocket', label: t('home.about.feature4') },
			];
	const portrait = profile?.images?.aboutPortrait;
	// const moments = profile?.moments ?? []; // moments strip (hidden for now)

	/** SCROLL MOTION: the photo and the floating cards move at different speeds (depth) **/
	const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
	const range = reduceMotion ? 0 : 1;
	const cardY = useTransform(scrollYProgress, [0, 1], [60 * range, -60 * range]);
	const chipY = useTransform(scrollYProgress, [0, 1], [110 * range, -110 * range]);
	const statY = useTransform(scrollYProgress, [0, 1], [140 * range, -90 * range]);
	const ballY = useTransform(scrollYProgress, [0, 1], [180 * range, -160 * range]);

	/** HANDLERS **/
	// moments strip (hidden for now)
	// const scrollMoments = () => {
	// 	stripRef.current?.scrollBy({ left: stripRef.current.clientWidth * 0.6, behavior: 'smooth' });
	// };

	const reveal = (delay: number, y: number = 36) => ({
		initial: { opacity: 0, y: reduceMotion ? 0 : y },
		whileInView: { opacity: 1, y: 0 },
		viewport: { once: true, amount: 0.3 },
		transition: { duration: 0.9, ease: EASE, delay },
	});

	return (
		<Stack component={'section'} ref={sectionRef} id={'about-preview'} className={'about-preview'}>
			<svg className={'about-arc'} viewBox={'0 0 1795 876'} preserveAspectRatio={'none'} aria-hidden={'true'}>
				<path d={'M 1470 0 C 1700 120, 1780 380, 1700 640'} />
			</svg>
			<span className={'about-arc-dot'} aria-hidden={'true'} />

			<Stack className={'about-main'}>
				<Box className={'about-visual'}>
					<motion.span className={'glass-back'} style={{ y: cardY }} aria-hidden={'true'} />
					<motion.div
						className={'photo-card'}
						style={{ y: cardY }}
						initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.94, rotate: reduceMotion ? 0 : -2 }}
						whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 1.2, ease: EASE }}
					>
						{portrait?.url ? (
							<Image
								src={portrait.url}
								alt={profile?.name ?? ''}
								fill
								sizes={'(max-width: 1024px) 90vw, 36vw'}
								placeholder={portrait.blurDataUrl ? 'blur' : 'empty'}
								blurDataURL={portrait.blurDataUrl ?? undefined}
							/>
						) : (
							<Image
								src={defaultPortrait}
								alt={profile?.name ?? 'Azamjon'}
								fill
								sizes={'(max-width: 1024px) 90vw, 36vw'}
								placeholder={'blur'}
							/>
						)}
						<span className={'signature'} aria-hidden={'true'}>
							{profile?.name ?? 'Azamjon'}
						</span>
					</motion.div>

					<motion.span className={'glossy-ball'} style={{ y: ballY }} aria-hidden={'true'} />

					<motion.div className={'glass-chip based-chip'} style={{ y: chipY }}>
						<LuMapPin className={'pin'} />
						<span>
							{t('home.about.basedIn')}
							<strong>{country}</strong>
						</span>
						<span className={'mini-arrow'}>
							<LuArrowUpRight />
						</span>
					</motion.div>

					<motion.div className={'glass-chip stat-chip'} style={{ y: statY }}>
						<strong>{stat?.value ?? t('home.about.statValue')}</strong>
						<span>{stat ? localize(stat.label, router.locale) : t('home.about.statLabel')}</span>
						<LuChartNoAxesColumnIncreasing className={'bars'} />
					</motion.div>
				</Box>

				<Stack className={'about-content'}>
					<motion.div className={'eyebrow'} {...reveal(0)}>
						<span className={'dot'} />
						<span className={'label'}>{t('home.about.eyebrow')}</span>
						<span className={'line'} />
						<span className={'count'}>{sectionCount('about')}</span>
					</motion.div>

					{/* the heading (not the masked lines) watches the viewport: clipped lines never count as visible */}
					<motion.h2
						className={'title'}
						initial={'hidden'}
						whileInView={'show'}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
					>
						{[t('home.about.title1'), t('home.about.title2')].map((line, index) => (
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

					<motion.p className={'text'} {...reveal(0.35)}>
						{text}
					</motion.p>

					<Box className={'features'}>
						{features.map((feature, index) => {
							const Icon = ICONS[feature.icon] ?? LuSparkles;
							return (
								<motion.div key={feature.label} className={'feature'} {...reveal(0.45 + index * 0.08, 24)}>
									<span className={'icon'}>
										<Icon />
									</span>
									<span className={'label'}>{feature.label}</span>
								</motion.div>
							);
						})}
					</Box>

					<motion.div className={'buttons'} {...reveal(0.75, 24)}>
						<Link href={'/about'} className={'button button-dark'}>
							{t('home.about.more')}
							<LuArrowUpRight />
						</Link>
						<Link href={'/contact'} className={'button button-outline'}>
							{t('home.about.together')}
							<LuArrowUpRight />
						</Link>
					</motion.div>
				</Stack>
			</Stack>

			{/* MOMENTS / Beyond Coding strip: hidden for now, turn back on when the photos are ready
			<Stack className={'moments'}>
				<motion.div className={'moments-title'} {...reveal(0, 20)}>
					<span className={'eyebrow'}>{t('home.about.momentsEyebrow')}</span>
					<strong>{t('home.about.momentsTitle')}</strong>
					<span className={'underline'} />
				</motion.div>

				<Box className={'moments-strip'} ref={stripRef}>
					{(moments.length ? moments : Array.from({ length: MOMENT_SLOTS }, () => null)).map((moment, index) => (
						<motion.div
							key={moment?.image.url ?? `slot-${index}`}
							className={`moment ${index === 0 ? 'active' : ''} ${moment ? '' : 'empty'}`}
							initial={{ opacity: 0, x: reduceMotion ? 0 : 40 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true, amount: 0.2 }}
							transition={{ duration: 0.7, ease: EASE, delay: index * 0.06 }}
						>
							{moment ? (
								<Image
									src={moment.image.url}
									alt={localize(moment.caption, router.locale)}
									fill
									sizes={'180px'}
								/>
							) : (
								<span className={'empty-label'}>{t('home.about.photo')}</span>
							)}
						</motion.div>
					))}
				</Box>

				<button type={'button'} className={'moments-next'} aria-label={t('home.about.next')} onClick={scrollMoments}>
					<LuArrowRight />
				</button>
			</Stack>
			*/}
		</Stack>
	);
};

export default AboutPreview;
