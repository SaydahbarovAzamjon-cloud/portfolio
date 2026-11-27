import React, { useRef } from 'react';
import { useTranslation } from 'next-i18next/pages';
import { Stack, Box } from '@mui/material';
import { motion, MotionValue, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { LuChartNoAxesColumnIncreasing, LuCodeXml, LuLayers, LuTarget } from 'react-icons/lu';
import { RiDoubleQuotesL } from 'react-icons/ri';
import { IconType } from 'react-icons';
import ScrollRise from '../common/ScrollRise';
import ScrollRevealText from '../common/ScrollRevealText';

/** The four principles, top to bottom (text in about.philosophy.<key>Title / <key>Text). */
const PRINCIPLES: { key: string; icon: IconType }[] = [
	{ key: 'problem', icon: LuTarget },
	{ key: 'purpose', icon: LuLayers },
	{ key: 'endToEnd', icon: LuCodeXml },
	{ key: 'learning', icon: LuChartNoAxesColumnIncreasing },
];

interface StepProps {
	index: number;
	total: number;
	progress: MotionValue<number>;
	icon: IconType;
	title: string;
	text: string;
}

/**
 * One row of the process line. It "switches on" when the filling line reaches its pin:
 * the soft panel behind the row fades in, the icon tile fills with orange, the pin starts to glow.
 * Rows that have been passed stay on.
 */
const Step = (props: StepProps) => {
	const reduceMotion = useReducedMotion();
	const { index, total, progress } = props;
	// the pin of this row sits at the middle of its slice of the line
	const at = (index + 0.5) / total;
	const on = useTransform(progress, [at - 0.06, at + 0.02], [reduceMotion ? 1 : 0, 1]);
	const panelScale = useTransform(on, [0, 1], [0.96, 1]);
	const iconColor = useTransform(on, [0, 1], ['#ff3d00', '#ffffff']);
	const Icon = props.icon;
	const flipped = index % 2 === 1;

	const iconSide = (
		<Box className={'step-side step-icon-side'}>
			<span className={'step-tile'}>
				<motion.span className={'tile-fill'} style={{ opacity: on }} />
				<motion.span className={'tile-icon'} style={{ color: iconColor }}>
					<Icon />
				</motion.span>
			</span>
			<span className={'step-number'}>{String(index + 1).padStart(2, '0')}</span>
		</Box>
	);
	const textSide = (
		<Box className={'step-side step-text-side'}>
			<h3>{props.title}</h3>
			<p>{props.text}</p>
		</Box>
	);

	return (
		<Box className={`step-row ${flipped ? 'flipped' : ''}`}>
			<motion.span className={'step-panel'} style={{ opacity: on, scale: panelScale }} />
			{flipped ? textSide : iconSide}
			<span className={'step-pin'}>
				<motion.span className={'pin-glow'} style={{ opacity: on }} />
				<span className={'pin-dot'} />
			</span>
			{flipped ? iconSide : textSide}
		</Box>
	);
};

const Philosophy = () => {
	const { t } = useTranslation('common');
	const listRef = useRef<HTMLDivElement>(null);

	/** SCROLL MOTION: the centre line fills from top to bottom while the list passes the middle of the screen **/
	const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 0.6', 'end 0.6'] });
	const lineFill = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

	return (
		<Stack component={'section'} id={'philosophy'} className={'philosophy'}>
			<Stack className={'philosophy-head'}>
				<Stack>
					<ScrollRise className={'eyebrow'} order={0}>
						<span className={'dot'} />
						<span className={'label'}>{t('about.philosophy.eyebrow')}</span>
						<span className={'line'} />
					</ScrollRise>
					<ScrollRise order={1}>
						<h2 className={'title'}>
							{t('about.philosophy.title1')} <span className={'accent'}>{t('about.philosophy.title2')}</span>
						</h2>
					</ScrollRise>
				</Stack>
				<ScrollRise order={2}>
					<ScrollRevealText className={'head-text'} text={t('about.philosophy.intro')} />
				</ScrollRise>
			</Stack>

			<Box className={'philosophy-steps'} ref={listRef}>
				{/* the centre line: a faint track and the part already filled */}
				<span className={'centre-track'} aria-hidden={'true'}>
					<motion.span className={'centre-fill'} style={{ height: lineFill }} />
				</span>
				{PRINCIPLES.map((principle, index) => (
					<Step
						key={principle.key}
						index={index}
						total={PRINCIPLES.length}
						progress={scrollYProgress}
						icon={principle.icon}
						title={t(`about.philosophy.${principle.key}Title`)}
						text={t(`about.philosophy.${principle.key}Text`)}
					/>
				))}
			</Box>

			<ScrollRise className={'philosophy-quote'} order={0}>
				<RiDoubleQuotesL className={'quote-mark'} />
				<ScrollRevealText text={`${t('about.philosophy.quote1')} *_${t('about.philosophy.quote2')}_*`} />
			</ScrollRise>
		</Stack>
	);
};

export default Philosophy;
