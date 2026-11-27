import React, { useRef } from 'react';
import Image, { StaticImageData } from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next/pages';
import { useQuery } from '@apollo/client';
import { Stack, Box } from '@mui/material';
import { motion, MotionValue, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { LuAward, LuCalendarCheck, LuCalendarRange, LuGraduationCap, LuLayers, LuMapPin } from 'react-icons/lu';
import { RiDoubleQuotesL } from 'react-icons/ri';
import { IconType } from 'react-icons';
import { GET_EDUCATIONS } from '../../../apollo/user/query';
import { localize } from '../../utils';
import { FALLBACK_EDUCATION } from '../../fallback';
import { Education as EducationItem } from '../../types/education/education';
import { DegreeType } from '../../enums/education.enum';
import useIsPast from '../../hooks/useIsPast';
import injePhoto from '../../../public/img/about/edu-inje.webp';
import tstuPhoto from '../../../public/img/about/edu-tstu.webp';
import ScrollRise from '../common/ScrollRise';
import ScrollRevealText from '../common/ScrollRevealText';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Campus photos shipped with the site, used until the admin uploads one. */
const DEFAULT_PHOTOS: Partial<Record<DegreeType, StaticImageData>> = {
	[DegreeType.MASTER]: injePhoto,
	[DegreeType.BACHELOR]: tstuPhoto,
};

/** "June 14, 2024" / "2024년 6월 14일" (UTC, so the server and the browser print the same). */
const formatDate = (date: string, locale: string | undefined, withDay: boolean) =>
	new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : 'en-US', {
		year: 'numeric',
		month: 'long',
		day: withDay ? 'numeric' : undefined,
		timeZone: 'UTC',
	}).format(new Date(date));

const year = (date?: string | null) => (date ? new Date(date).getUTCFullYear() : '');

interface EduCardProps {
	item: EducationItem;
	index: number;
	/** scroll progress of the card row (0 → 1) */
	progress: MotionValue<number>;
}

const EduCard = (props: EduCardProps) => {
	const { item, index, progress } = props;
	const router = useRouter();
	const { t } = useTranslation('common');
	const reduceMotion = useReducedMotion();
	// "in progress" turns into "completed" on its own once the end date has passed
	const done = useIsPast(item.endDate);
	const photo = item.image?.url ?? DEFAULT_PHOTOS[item.degree];
	const isMaster = item.degree === DegreeType.MASTER;

	/** SCROLL MOTION (MarketingLab "Our Process" style): each card rises in on its own slice of the scroll, one after another **/
	const range = reduceMotion ? 0 : 1;
	// strictly one after another: the bachelor's finishes (0 → 0.45) before the master's starts (0.5 → 0.95)
	const start = index * 0.5;
	const end = start + 0.45;
	const cardY = useTransform(progress, [start, end], [220 * range, 0]);
	const cardOpacity = useTransform(progress, [start, start + 0.25], [reduceMotion ? 1 : 0, 1]);
	const cardScale = useTransform(progress, [start, end], [1 - 0.06 * range, 1]);
	const cardRotate = useTransform(progress, [start, end], [(index % 2 ? 3 : -3) * range, 0]);

	const fields: { key: string; icon: IconType; label: string; value: string; note?: string }[] = [
		{
			key: 'major',
			icon: LuLayers,
			label: t('about.education.major'),
			value: localize(item.major ?? item.program, router.locale),
		},
		item.qualification
			? {
					key: 'qualification',
					icon: LuAward,
					label: t('about.education.qualification'),
					value: localize(item.qualification, router.locale),
				}
			: {
					key: 'period',
					icon: LuCalendarRange,
					label: t('about.education.period'),
					value: `${year(item.startDate)} – ${year(item.endDate)}`,
				},
		{
			key: 'end',
			icon: LuCalendarCheck,
			label: done ? t('about.education.graduated') : t('about.education.expected'),
			// the bachelor's has an exact day on the diploma; the master's only a month
			value: item.endDate ? formatDate(item.endDate, router.locale, !isMaster) : '',
		},
	];

	return (
		<motion.article
			className={`edu-card ${isMaster ? 'master' : 'bachelor'}`}
			style={{ y: cardY, opacity: cardOpacity, scale: cardScale, rotate: cardRotate }}
		>
			{photo && (
				<Box className={'edu-photo'}>
					<Image src={photo} alt={''} fill sizes={'(max-width: 1024px) 100vw, 30vw'} />
				</Box>
			)}

			<Stack className={'edu-body'}>
				<Stack className={'edu-top'}>
					<span className={'degree-pill'}>
						<LuGraduationCap />
						{isMaster ? t('about.education.master') : t('about.education.bachelor')}
					</span>
					<span className={`status-pill ${done ? 'done' : 'progress'}`}>
						<span className={'status-dot'} />
						{done ? t('about.education.completed') : t('about.education.inProgress')}
					</span>
				</Stack>

				<h3 className={'school'}>{localize(item.institution, router.locale)}</h3>
				{item.institutionNative && <span className={'school-native'}>{item.institutionNative}</span>}

				<Box className={'edu-fields'}>
					{fields.map((field) => {
						const Icon = field.icon;
						return (
							<Box key={field.key} className={'edu-field'}>
								<Icon className={'field-icon'} />
								<span>
									<small>{field.label}</small>
									<strong>{field.value}</strong>
								</span>
							</Box>
						);
					})}
				</Box>

				{item.location && (
					<span className={'location-pill'}>
						<LuMapPin />
						{localize(item.location, router.locale)}
					</span>
				)}
			</Stack>
		</motion.article>
	);
};

/** One point on the line under the cards: bachelor's (left) → master's (right). */
const DegreePoint = (props: { item: EducationItem }) => {
	const { t } = useTranslation('common');
	const done = useIsPast(props.item.endDate);
	const isMaster = props.item.degree === DegreeType.MASTER;
	return (
		<span className={`degree-point ${done ? 'done' : 'progress'}`}>
			<span className={'point-pin'} />
			<span className={'point-label'}>
				{isMaster ? t('about.education.master') : t('about.education.bachelor')}
				<small>{done ? t('about.education.completed') : t('about.education.inProgress')}</small>
			</span>
		</span>
	);
};

const Education = () => {
	const { t } = useTranslation('common');
	const reduceMotion = useReducedMotion();
	const gridRef = useRef<HTMLDivElement>(null);
	// 0 when the card row enters the bottom of the screen, 1 when its top reaches 15% from the top
	const { scrollYProgress: cardsProgress } = useScroll({ target: gridRef, offset: ['start end', 'start 0.15'] });

	/** APOLLO REQUESTS **/
	const { data: getEducationsData } = useQuery<{ getEducations: EducationItem[] }>(GET_EDUCATIONS, {
		fetchPolicy: 'cache-first',
	});
	const loaded = getEducationsData?.getEducations ?? [];
	const items = loaded.length ? loaded : FALLBACK_EDUCATION;
	// cards show oldest first (bachelor's, then master's), like the line under them
	const ordered = [...items].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

	const reveal = (delay: number, y: number = 30) => ({
		initial: { opacity: 0, y: reduceMotion ? 0 : y },
		whileInView: { opacity: 1, y: 0 },
		viewport: { once: true, amount: 0.3 },
		transition: { duration: 0.9, ease: EASE, delay },
	});

	return (
		<Stack component={'section'} id={'education'} className={'education'}>
			<Stack className={'education-head'}>
				<Stack>
					<ScrollRise className={'eyebrow'} order={0}>
						<span className={'dot'} />
						<span className={'label'}>{t('about.education.eyebrow')}</span>
						<span className={'line'} />
					</ScrollRise>
					<ScrollRise order={1}>
						<motion.h2
							className={'title'}
							initial={'hidden'}
							whileInView={'show'}
							viewport={{ once: true, amount: 0.5 }}
						>
							<span className={'title-mask'}>
								<motion.span
									className={'title-line'}
									variants={{ hidden: { y: reduceMotion ? '0%' : '105%' }, show: { y: '0%' } }}
									transition={{ duration: 1, ease: EASE }}
								>
									{t('about.education.title1')}
									<span className={'accent'}>{t('about.education.title2')}</span>
								</motion.span>
							</span>
						</motion.h2>
					</ScrollRise>
				</Stack>
				<ScrollRise order={2}>
					<ScrollRevealText
						className={'head-text'}
						text={`${t('about.education.intro1')} *${t('about.education.intro2')}* ${t('about.education.intro3')}`}
					/>
				</ScrollRise>
			</Stack>

			<Box className={'edu-grid'} ref={gridRef}>
				{ordered.map((item, index) => (
					<EduCard key={item._id} item={item} index={index} progress={cardsProgress} />
				))}
			</Box>

			<motion.div className={'degree-line'} {...reveal(0.1, 20)}>
				<svg className={'degree-track'} viewBox={'0 0 1000 20'} preserveAspectRatio={'none'} aria-hidden={'true'}>
					<motion.path
						d={'M 0 10 L 990 10'}
						initial={{ pathLength: reduceMotion ? 1 : 0 }}
						whileInView={{ pathLength: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
					/>
					<path className={'arrow-head'} d={'M 978 3 L 992 10 L 978 17'} />
				</svg>
				{ordered.map((item) => (
					<DegreePoint key={item._id} item={item} />
				))}
			</motion.div>

			<motion.div className={'education-quote'} {...reveal(0.2, 24)}>
				<RiDoubleQuotesL className={'quote-mark'} />
				<ScrollRevealText
					text={`${t('about.education.quote1')} *${t('about.education.quote2')}* ${t('about.education.quote3')} *_${t('about.education.quote4')}_*`}
				/>
			</motion.div>
		</Stack>
	);
};

export default Education;
