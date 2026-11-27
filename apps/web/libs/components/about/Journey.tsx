import React, { useRef } from 'react';
import { useTranslation } from 'next-i18next/pages';
import { Stack, Box } from '@mui/material';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { LuCpu, LuGraduationCap, LuLayers, LuRocket, LuZap } from 'react-icons/lu';
import { RiDoubleQuotesL } from 'react-icons/ri';
import { IconType } from 'react-icons';
import { dunePath } from '../../utils';
import CountUp from '../common/CountUp';
import ScrollRise from '../common/ScrollRise';
import ScrollRevealText from '../common/ScrollRevealText';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Timeline steps, left to right. Text lives in the locale files (about.journey.<key>...). */
const STEPS: { key: string; icon: IconType; bullets: number; future?: boolean }[] = [
	{ key: 'bachelor', icon: LuZap, bullets: 2 },
	{ key: 'itc', icon: LuLayers, bullets: 3 },
	{ key: 'ngroup', icon: LuCpu, bullets: 3 },
	{ key: 'inje', icon: LuGraduationCap, bullets: 2 },
	{ key: 'future', icon: LuRocket, bullets: 2, future: true },
];

/** The rising timeline curve (viewBox 1000 x 120): one function draws the line and places the pins. */
const curveY = (x: number) => 104 - 66 * Math.sin((x / 1000) * (Math.PI / 2));
const CURVE = Array.from({ length: 51 }, (_, index) => {
	const x = index * 20;
	return `${index === 0 ? 'M' : 'L'} ${x} ${curveY(x).toFixed(1)}`;
}).join(' ');
const PIN_X = STEPS.map((_, index) => 100 + index * 200);

const STATS = [
	{ key: 'years', value: 3, suffix: '+' },
	{ key: 'companies', value: 2 },
	{ key: 'projects', value: 4 },
];

const WAVE_FAR = dunePath(
	60,
	[
		[22, 2, 0.9],
		[9, 5, 2.4],
	],
	160,
);
const WAVE_NEAR = dunePath(
	104,
	[
		[16, 3, 0.2],
		[7, 6, 1.1],
	],
	160,
);

const Journey = () => {
	const { t } = useTranslation('common');
	const reduceMotion = useReducedMotion();
	const trackRef = useRef<HTMLDivElement>(null);

	/** SCROLL MOTION: the line draws itself from left to right as the timeline comes up **/
	const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start 0.9', 'start 0.35'] });
	const lineLength = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 1 : 0, 1]);

	const reveal = (delay: number, y: number = 30) => ({
		initial: { opacity: 0, y: reduceMotion ? 0 : y },
		whileInView: { opacity: 1, y: 0 },
		viewport: { once: true, amount: 0.3 },
		transition: { duration: 0.9, ease: EASE, delay },
	});

	return (
		<Stack component={'section'} id={'journey'} className={'journey'}>
			<Stack className={'journey-head'}>
				<Stack className={'head-left'}>
					<ScrollRise className={'eyebrow'} order={0}>
						<span className={'dot'} />
						<span className={'label'}>{t('about.journey.eyebrow')}</span>
						<span className={'line'} />
					</ScrollRise>
					<ScrollRise order={1}>
						<motion.h2
							className={'title'}
							initial={'hidden'}
							whileInView={'show'}
							viewport={{ once: true, amount: 0.5 }}
							transition={{ staggerChildren: 0.1 }}
						>
							{[t('about.journey.title1'), t('about.journey.title2')].map((word, index) => (
								<span key={word} className={'title-mask'}>
									<motion.span
										className={`title-line ${index === 1 ? 'accent' : ''}`}
										variants={{ hidden: { y: reduceMotion ? '0%' : '105%' }, show: { y: '0%' } }}
										transition={{ duration: 1, ease: EASE }}
									>
										{word}
									</motion.span>
								</span>
							))}
						</motion.h2>
					</ScrollRise>
				</Stack>
				<ScrollRise order={2}>
					<ScrollRevealText className={'head-text'} text={t('about.journey.intro')} />
				</ScrollRise>
			</Stack>

			{/* rising line with a pin and a date above every step */}
			<Box className={'timeline-track'} ref={trackRef}>
				<svg className={'track-line'} viewBox={'0 0 1000 120'} preserveAspectRatio={'none'} aria-hidden={'true'}>
					<path className={'track-base'} d={CURVE} />
					<motion.path className={'track-fill'} d={CURVE} style={{ pathLength: lineLength }} />
				</svg>
				{STEPS.map((step, index) => (
					<motion.span
						key={step.key}
						className={`pin ${step.future ? 'future' : ''}`}
						style={{ left: `${PIN_X[index] / 10}%`, top: `${(curveY(PIN_X[index]) / 120) * 100}%` }}
						initial={{ opacity: 0, scale: reduceMotion ? 1 : 0 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true, amount: 1 }}
						transition={{ duration: 0.6, ease: EASE, delay: 0.25 + index * 0.18 }}
					/>
				))}
			</Box>

			<Box className={'timeline-steps'}>
				{STEPS.map((step, index) => {
					const Icon = step.icon;
					return (
						<motion.article
							key={step.key}
							className={`step ${step.future ? 'future' : ''}`}
							initial={{ opacity: 0, y: reduceMotion ? 0 : 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.25 }}
							transition={{ duration: 0.9, ease: EASE, delay: 0.1 + index * 0.12 }}
						>
							<span className={'date'}>{t(`about.journey.${step.key}Date`)}</span>
							<span className={'icon'}>
								<Icon />
							</span>
							<h3 className={'step-title'}>{t(`about.journey.${step.key}Title`)}</h3>
							<strong className={'step-role'}>{t(`about.journey.${step.key}Role`)}</strong>
							<ul className={'step-list'}>
								{Array.from({ length: step.bullets }, (_, bullet) => (
									<li key={bullet}>{t(`about.journey.${step.key}Point${bullet + 1}`)}</li>
								))}
							</ul>
						</motion.article>
					);
				})}
			</Box>

			<Box className={'journey-stats'}>
				{STATS.map((stat, index) => (
					<motion.div key={stat.key} className={'stat'} {...reveal(0.1 + index * 0.1, 24)}>
						<strong>
							<CountUp value={stat.value} suffix={stat.suffix} />
							<span>{t(`about.journey.${stat.key}Label`)}</span>
						</strong>
						<small>{t(`about.journey.${stat.key}Text`)}</small>
					</motion.div>
				))}
				<motion.div className={'journey-quote'} {...reveal(0.4, 24)}>
					<RiDoubleQuotesL className={'quote-mark'} />
					<ScrollRevealText text={`${t('about.journey.quote1')} *${t('about.journey.quote2')}*`} />
					<svg className={'quote-swoosh'} viewBox={'0 0 300 20'} preserveAspectRatio={'none'} aria-hidden={'true'}>
						<motion.path
							d={'M 4 14 C 80 4, 200 2, 296 10'}
							initial={{ pathLength: reduceMotion ? 1 : 0 }}
							whileInView={{ pathLength: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 1.2, ease: EASE, delay: 0.7 }}
						/>
					</svg>
				</motion.div>
			</Box>

			{/* waves along the bottom, drifting like the footer dunes */}
			<svg className={'journey-waves'} viewBox={'0 0 2100 160'} preserveAspectRatio={'none'} aria-hidden={'true'}>
				<path className={'dune wave-far'} d={WAVE_FAR} />
				<path className={'dune wave-near'} d={WAVE_NEAR} />
			</svg>
		</Stack>
	);
};

export default Journey;
