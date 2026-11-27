import React, { useRef } from 'react';
import Image, { StaticImageData } from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next/pages';
import { useQuery } from '@apollo/client';
import { Stack, Box } from '@mui/material';
import { motion, MotionValue, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { LuBookOpen, LuDumbbell, LuGlobe, LuMountainSnow, LuPlane, LuMapPin } from 'react-icons/lu';
import { FaFutbol, FaRunning } from 'react-icons/fa';
import { GiBoxingGlove } from 'react-icons/gi';
import { IconType } from 'react-icons';
import { RiDoubleQuotesL } from 'react-icons/ri';
import { GET_PROFILE } from '../../../apollo/user/query';
import { localize } from '../../utils';
import { Profile } from '../../types/profile/profile';
import ScrollRise from '../common/ScrollRise';
import ScrollRevealText from '../common/ScrollRevealText';
import koreaPhoto from '../../../public/img/about/beyond-korea.webp';
import learningPhoto from '../../../public/img/about/beyond-learning.webp';
import fitnessPhoto from '../../../public/img/about/beyond-fitness.webp';
import footballPhoto from '../../../public/img/about/beyond-football.webp';
import travelPhoto from '../../../public/img/about/beyond-travel.webp';

/** The four interest cards (text in the locale files: about.beyond.<key>Title / <key>Text). */
const INTERESTS: { key: string; icon: IconType }[] = [
	{ key: 'sports', icon: FaRunning },
	{ key: 'reading', icon: LuBookOpen },
	{ key: 'languages', icon: LuGlobe },
	{ key: 'travel', icon: LuPlane },
];

const SPORTS: { key: string; icon: IconType }[] = [
	{ key: 'fitness', icon: LuDumbbell },
	{ key: 'football', icon: FaFutbol },
	{ key: 'martial', icon: GiBoxingGlove },
];
const TOPICS = ['business', 'finance', 'technology', 'growth'];
/** Language level as a share of the bar: native = full, C1 = 85% (from the CV). */
const LANGUAGES: { key: string; level: number }[] = [
	{ key: 'uz', level: 100 },
	{ key: 'en', level: 85 },
	{ key: 'ko', level: 85 },
	{ key: 'ru', level: 85 },
];

/** The small picture at the bottom of each interest card. */
const InterestVisual = (props: { interestKey: string }) => {
	const { t } = useTranslation('common');
	const reduceMotion = useReducedMotion();

	if (props.interestKey === 'sports') {
		return (
			<span className={'visual sport-tiles'}>
				{SPORTS.map((sport) => {
					const SportIcon = sport.icon;
					return (
						<span key={sport.key} className={'sport-tile'}>
							<SportIcon />
							{t(`about.beyond.chip_${sport.key}`)}
						</span>
					);
				})}
			</span>
		);
	}
	if (props.interestKey === 'reading') {
		return (
			<span className={'visual topic-tags'}>
				{TOPICS.map((topic) => (
					<span key={topic} className={'topic-tag'}>
						#{t(`about.beyond.topic_${topic}`)}
					</span>
				))}
			</span>
		);
	}
	if (props.interestKey === 'languages') {
		return (
			<span className={'visual lang-meters'}>
				{LANGUAGES.map((language, index) => (
					<span key={language.key} className={'lang-row'}>
						<b>{language.key.toUpperCase()}</b>
						<span className={'meter'}>
							<motion.span
								className={'meter-fill'}
								initial={{ width: reduceMotion ? `${language.level}%` : '0%' }}
								whileInView={{ width: `${language.level}%` }}
								viewport={{ once: true, amount: 1 }}
								transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 + index * 0.12 }}
							/>
						</span>
						<small>{t(`about.beyond.chip_${language.key}`)}</small>
					</span>
				))}
			</span>
		);
	}
	// travel: where I studied → where I live now, with a plane flying the route
	return (
		<span className={'visual route'}>
			<span className={'route-point'}>
				<i />
				<b>{t('about.beyond.routeFrom')}</b>
				<small>{t('about.beyond.routeFromCity')}</small>
			</span>
			<span className={'route-line'}>
				<LuPlane className={'route-plane'} />
			</span>
			<span className={'route-point end'}>
				<i />
				<b>{t('about.beyond.routeTo')}</b>
				<small>{t('about.beyond.routeToCity')}</small>
			</span>
		</span>
	);
};

/** Photos shipped with the site; an admin "moment" in the same position replaces one. */
const DEFAULT_PHOTOS: Record<string, StaticImageData> = {
	korea: koreaPhoto,
	learning: learningPhoto,
	fitness: fitnessPhoto,
	football: footballPhoto,
	travel: travelPhoto,
};

/** Photo slots, stacked in this order. Photos come from the profile's "moments" (admin). */
const SLOTS: { key: string; icon: IconType }[] = [
	{ key: 'korea', icon: LuMapPin },
	{ key: 'learning', icon: LuBookOpen },
	{ key: 'fitness', icon: LuDumbbell },
	{ key: 'football', icon: FaFutbol },
	{ key: 'travel', icon: LuMountainSnow },
];

interface PhotoTileProps {
	slot: (typeof SLOTS)[number];
	index: number;
	total: number;
	/** scroll progress through the whole photo stack (0 → 1) */
	progress: MotionValue<number>;
	image?: string | StaticImageData;
	label: string;
}

/**
 * One stacked photo: it pins near the top of the screen and the next one slides up over it.
 * While the later photos arrive it shrinks a little and dims, so the stack reads as depth.
 * Until a real photo exists it shows a soft placeholder.
 */
const PhotoTile = (props: PhotoTileProps) => {
	const reduceMotion = useReducedMotion();
	const { index, total } = props;
	const layersAbove = total - 1 - index;
	// this photo is fully in place once the stack reaches it; after that it only recedes
	const settled = index / total;
	const scale = useTransform(props.progress, [settled, 1], [1, reduceMotion ? 1 : 1 - layersAbove * 0.05]);
	const shade = useTransform(props.progress, [settled, 1], [0, reduceMotion ? 0 : layersAbove * 0.1]);
	const Icon = props.slot.icon;
	return (
		<motion.figure
			className={`photo-tile tile-${props.slot.key} ${props.image ? '' : 'empty'}`}
			style={{ scale, zIndex: index + 1, top: `calc(var(--stack-top) + ${index * 22}px)` }}
		>
			{/* full-bleed photo, dark fade at the bottom, glass number and a clean caption */}
			<span className={'tile-photo'}>
				{props.image ? (
					<Image
						src={props.image}
						alt={props.label}
						fill
						sizes={'(max-width: 1024px) 90vw, 45vw'}
						placeholder={typeof props.image === 'string' ? 'empty' : 'blur'}
					/>
				) : (
					<Icon className={'placeholder-icon'} aria-hidden={'true'} />
				)}
			</span>
			<span className={'tile-fade'} aria-hidden={'true'} />
			<span className={'tile-shine'} aria-hidden={'true'} />
			<span className={'tile-count'}>
				{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
			</span>
			<figcaption className={'tile-caption'}>
				<span className={'tile-icon'}>
					<Icon />
				</span>
				<span className={'tile-label'}>{props.label}</span>
			</figcaption>
			<motion.span className={'tile-shade'} style={{ opacity: shade }} />
		</motion.figure>
	);
};

const BeyondCode = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const reduceMotion = useReducedMotion();
	const collageRef = useRef<HTMLDivElement>(null);

	/** APOLLO REQUESTS **/
	const { data: getProfileData } = useQuery<{ getProfile: Profile }>(GET_PROFILE, {
		fetchPolicy: 'cache-first',
	});
	const moments = getProfileData?.getProfile?.moments ?? [];

	/** SCROLL MOTION: 0 when the photo stack reaches the top of the screen, 1 when the last photo has landed **/
	const { scrollYProgress } = useScroll({ target: collageRef, offset: ['start start', 'end end'] });

	return (
		<Stack component={'section'} id={'beyond-code'} className={'beyond-code'}>
			<Stack className={'beyond-main'}>
				{/* left: heading, interests, quote */}
				<Stack className={'beyond-content'}>
					<ScrollRise className={'eyebrow'} order={0}>
						<span className={'dot'} />
						<span className={'label'}>{t('about.beyond.eyebrow')}</span>
						<span className={'line'} />
					</ScrollRise>
					<ScrollRise order={1}>
						<h2 className={'title'}>
							{t('about.beyond.title1')} <span className={'accent'}>{t('about.beyond.title2')}</span>
						</h2>
					</ScrollRise>
					<ScrollRise order={2}>
						<ScrollRevealText className={'intro'} text={t('about.beyond.intro')} />
					</ScrollRise>

					<Box className={'interests'}>
						{INTERESTS.map((interest, index) => {
							const Icon = interest.icon;
							return (
								// the left column is sticky, so these use a one-time reveal (a scroll-linked one
								// would never finish while the column stays pinned in place)
								<motion.div
									key={interest.key}
									className={`interest interest-${interest.key}`}
									initial={{ opacity: 0, y: reduceMotion ? 0 : 50 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, amount: 0.3 }}
									transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
								>
									<span className={'interest-head'}>
										<span className={'interest-icon'}>
											<Icon />
										</span>
										<strong>{t(`about.beyond.${interest.key}Title`)}</strong>
									</span>
									<span className={'interest-text'}>{t(`about.beyond.${interest.key}Text`)}</span>
									<InterestVisual interestKey={interest.key} />
								</motion.div>
							);
						})}
					</Box>

					<motion.div
						className={'beyond-quote'}
						initial={{ opacity: 0, y: reduceMotion ? 0 : 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
					>
						<RiDoubleQuotesL className={'quote-mark'} />
						<ScrollRevealText
							text={`${t('about.beyond.quote1')} *${t('about.beyond.quote2')}* ${t('about.beyond.quote3')} *_${t('about.beyond.quote4')}_*`}
						/>
					</motion.div>
				</Stack>

				{/* right: photos stack one by one while the left column stays */}
				<Box className={'photo-stack'} ref={collageRef}>
					{SLOTS.map((slot, index) => {
						const moment = moments[index];
						return (
							<PhotoTile
								key={slot.key}
								slot={slot}
								index={index}
								total={SLOTS.length}
								progress={scrollYProgress}
								image={moment?.image?.url ?? DEFAULT_PHOTOS[slot.key]}
								label={moment?.caption ? localize(moment.caption, router.locale) : t(`about.beyond.photo_${slot.key}`)}
							/>
						);
					})}
				</Box>
			</Stack>
		</Stack>
	);
};

export default BeyondCode;
