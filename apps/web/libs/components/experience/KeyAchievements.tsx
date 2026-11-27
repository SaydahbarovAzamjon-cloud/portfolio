import React, { useRef } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next/pages';
import { Stack, Box } from '@mui/material';
import { useScroll } from 'motion/react';
import { LuBrainCircuit, LuCodeXml, LuGauge, LuTarget } from 'react-icons/lu';
import { IconType } from 'react-icons';
import ScrollRise from '../common/ScrollRise';
import ScrollRevealText from '../common/ScrollRevealText';
import RiseCard from '../common/RiseCard';
import CountUp from '../common/CountUp';
import ContributionArt from './ContributionArt';
import ProjectSlideshow from './ProjectSlideshow';
import mountains from '../../../public/img/experience-hero-bg.webp';

/**
 * The card silhouette from the reference (viewBox 400 x 220): the left side is lower, the top edge
 * flicks up toward the right corner and the right side is taller, like a sheet curling toward you.
 */
const CARD_SHAPE =
	'M 0 42 Q 0 10 34 10 L 270 9 C 310 8, 340 7, 364 6 Q 400 5 400 38 L 400 186 Q 400 218 366 217 L 36 212 Q 0 211 0 178 Z';

type Visual = 'photo' | 'chip' | 'globe' | 'plates';

/**
 * Real numbers from the CV / portfolio. Dark and light cards alternate like the mockup,
 */
const STATS: {
	key: string;
	value: number;
	prefix?: string;
	suffix?: string;
	decimals?: number;
	icon: IconType;
	visual: Visual;
	dark?: boolean;
}[] = [
	{ key: 'live', value: 4, suffix: '+', icon: LuCodeXml, visual: 'photo', dark: true },
	{ key: 'ai', value: 3, icon: LuBrainCircuit, visual: 'chip' },
	{ key: 'accuracy', value: 88.3, suffix: '%', decimals: 1, icon: LuTarget, visual: 'globe', dark: true },
	{ key: 'speed', value: 250, prefix: '~', suffix: 'ms', icon: LuGauge, visual: 'plates' },
];

/** Dots of a glowing globe (viewBox 200 x 200): latitude / longitude points on the front half, brighter near the light. */
const GLOBE_DOTS: { x: number; y: number; o: number }[] = [];
for (let lat = -78; lat <= 78; lat += 12) {
	for (let lon = -180; lon < 180; lon += 10) {
		const la = (lat * Math.PI) / 180;
		const lo = ((lon + 20) * Math.PI) / 180;
		const depth = Math.cos(la) * Math.cos(lo);
		if (depth <= 0.05) continue;
		const x = 100 + 92 * Math.cos(la) * Math.sin(lo);
		const y = 100 - 92 * Math.sin(la);
		const light = depth * (1 - Math.hypot(x - 70, y - 55) / 260);
		GLOBE_DOTS.push({
			x: Math.round(x * 10) / 10,
			y: Math.round(y * 10) / 10,
			o: Math.max(0.12, Math.min(1, light * 1.4)),
		});
	}
}

const KeyAchievements = () => {
	const { t } = useTranslation('common');
	const gridRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({ target: gridRef, offset: ['start end', 'start 0.45'] });

	return (
		<Stack component={'section'} id={'key-achievements'} className={'key-achievements'}>
			{/* the misty peak in the top-right corner */}
			<Box className={'achievements-bg'} aria-hidden={'true'}>
				<Image src={mountains} alt={''} fill sizes={'60vw'} placeholder={'blur'} />
			</Box>

			<Stack className={'section-head'}>
				<Stack>
					<ScrollRise className={'eyebrow'} order={0}>
						<span className={'label'}>{t('experience.achievements.eyebrow')}</span>
						<span className={'line'} />
					</ScrollRise>
					<ScrollRise order={1}>
						<h2 className={'title'}>
							{t('experience.achievements.title1')}{' '}
							<span className={'accent'}>{t('experience.achievements.title2')}</span>
						</h2>
					</ScrollRise>
				</Stack>
				<ScrollRise order={2}>
					<ScrollRevealText className={'head-text'} text={t('experience.achievements.intro')} />
				</ScrollRise>
			</Stack>

			<Box className={'achievement-grid'} ref={gridRef}>
				{STATS.map((stat, index) => {
					const Icon = stat.icon;
					return (
						<RiseCard
							key={stat.key}
							className={'achievement-card'}
							index={index}
							total={STATS.length}
							progress={scrollYProgress}
						>
							<div className={`achievement-inner visual-${stat.visual} ${stat.dark ? 'dark' : ''}`}>
								<svg className={'card-rim'} viewBox={'0 0 400 220'} preserveAspectRatio={'none'} aria-hidden={'true'}>
									<path d={CARD_SHAPE} />
								</svg>
								{stat.visual === 'photo' && (
									// the delivered projects themselves, changing one after another
									<span className={'achievement-photo'}>
										<ProjectSlideshow />
									</span>
								)}
								{stat.visual === 'chip' && (
									<span className={'achievement-art'}>
										<ContributionArt kind={'ai'} />
									</span>
								)}
								{stat.visual === 'globe' && (
									<svg className={'achievement-globe'} viewBox={'0 0 200 200'} aria-hidden={'true'}>
										{GLOBE_DOTS.map((dot) => (
											<circle key={`${dot.x}-${dot.y}`} cx={dot.x} cy={dot.y} r={1.9} opacity={dot.o} />
										))}
									</svg>
								)}
								{stat.visual === 'plates' && (
									<span className={'achievement-art plates'}>
										<ContributionArt kind={'plates'} />
									</span>
								)}

								{/* the same frosted glass tile on every card, with a warm gradient icon */}
								<span className={'achievement-icon'}>
									<Icon />
								</span>
								<span className={'achievement-text'}>
									<strong className={'achievement-value'}>
										{stat.prefix}
										<CountUp value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
									</strong>
									<span className={'achievement-label'}>{t(`experience.achievements.${stat.key}Label`)}</span>
									{stat.visual !== 'photo' && (
										<small className={'achievement-note'}>{t(`experience.achievements.${stat.key}Note`)}</small>
									)}
								</span>
							</div>
						</RiseCard>
					);
				})}
			</Box>
		</Stack>
	);
};

export default KeyAchievements;
