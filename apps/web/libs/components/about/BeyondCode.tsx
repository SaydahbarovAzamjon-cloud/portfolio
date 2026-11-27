import React, { useRef } from 'react';
import Image from 'next/image';
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

/** The four interest cards (text in the locale files: about.beyond.<key>Title / <key>Text). */
const INTERESTS: { key: string; icon: IconType; chips?: { key: string; icon?: IconType }[] }[] = [
	{
		key: 'sports',
		icon: FaRunning,
		chips: [
			{ key: 'fitness', icon: LuDumbbell },
			{ key: 'football', icon: FaFutbol },
			{ key: 'martial', icon: GiBoxingGlove },
		],
	},
	{ key: 'reading', icon: LuBookOpen },
	{ key: 'languages', icon: LuGlobe, chips: [{ key: 'uz' }, { key: 'en' }, { key: 'ko' }, { key: 'ru' }] },
	{ key: 'travel', icon: LuPlane },
];

/** Photo collage slots, in the mockup's layout. Photos come from the profile's "moments" (admin). */
const SLOTS: { key: string; icon: IconType; speed: number }[] = [
	{ key: 'korea', icon: LuMapPin, speed: 50 },
	{ key: 'learning', icon: LuBookOpen, speed: 90 },
	{ key: 'fitness', icon: LuDumbbell, speed: 130 },
	{ key: 'football', icon: FaFutbol, speed: 70 },
	{ key: 'travel', icon: LuMountainSnow, speed: 110 },
];

interface PhotoTileProps {
	slot: (typeof SLOTS)[number];
	index: number;
	progress: MotionValue<number>;
	image?: string;
	label: string;
}

/** One collage photo: floats at its own speed while scrolling; until a photo exists it shows a soft placeholder. */
const PhotoTile = (props: PhotoTileProps) => {
	const reduceMotion = useReducedMotion();
	const range = reduceMotion ? 0 : 1;
	const y = useTransform(props.progress, [0, 1], [props.slot.speed * range, -props.slot.speed * range]);
	const Icon = props.slot.icon;
	return (
		<motion.figure
			className={`photo-tile tile-${props.slot.key} ${props.image ? '' : 'empty'}`}
			style={{ y }}
			initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.9 }}
			whileInView={{ opacity: 1, scale: 1 }}
			viewport={{ once: true, amount: 0.3 }}
			transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: props.index * 0.08 }}
		>
			{props.image ? (
				<Image src={props.image} alt={props.label} fill sizes={'(max-width: 1024px) 50vw, 18vw'} />
			) : (
				<Icon className={'placeholder-icon'} aria-hidden={'true'} />
			)}
			<figcaption className={'tile-label'}>{props.label}</figcaption>
		</motion.figure>
	);
};

const BeyondCode = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const collageRef = useRef<HTMLDivElement>(null);

	/** APOLLO REQUESTS **/
	const { data: getProfileData } = useQuery<{ getProfile: Profile }>(GET_PROFILE, {
		fetchPolicy: 'cache-first',
	});
	const moments = getProfileData?.getProfile?.moments ?? [];

	/** SCROLL MOTION: the photos drift at different speeds (depth) **/
	const { scrollYProgress } = useScroll({ target: collageRef, offset: ['start end', 'end start'] });

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
								<ScrollRise key={interest.key} className={'interest'} order={index + 1}>
									<span className={'interest-icon'}>
										<Icon />
									</span>
									<span className={'interest-text'}>
										<strong>{t(`about.beyond.${interest.key}Title`)}</strong>
										<span>{t(`about.beyond.${interest.key}Text`)}</span>
									</span>
									{interest.chips && (
										<span className={'chips'}>
											{interest.chips.map((chip) => {
												const ChipIcon = chip.icon;
												return (
													<span key={chip.key} className={'chip'}>
														{ChipIcon ? <ChipIcon /> : <b>{chip.key.toUpperCase()}</b>}
														{t(`about.beyond.chip_${chip.key}`)}
													</span>
												);
											})}
										</span>
									)}
								</ScrollRise>
							);
						})}
					</Box>

					<ScrollRise className={'beyond-quote'} order={1}>
						<RiDoubleQuotesL className={'quote-mark'} />
						<ScrollRevealText
							text={`${t('about.beyond.quote1')} *${t('about.beyond.quote2')}* ${t('about.beyond.quote3')} *_${t('about.beyond.quote4')}_*`}
						/>
					</ScrollRise>
				</Stack>

				{/* right: photo collage */}
				<Box className={'collage'} ref={collageRef}>
					{SLOTS.map((slot, index) => {
						const moment = moments[index];
						return (
							<PhotoTile
								key={slot.key}
								slot={slot}
								index={index}
								progress={scrollYProgress}
								image={moment?.image?.url}
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
