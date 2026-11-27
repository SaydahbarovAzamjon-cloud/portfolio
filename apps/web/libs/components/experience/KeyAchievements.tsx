import React, { useRef } from 'react';
import { useTranslation } from 'next-i18next/pages';
import { Stack, Box } from '@mui/material';
import { useScroll } from 'motion/react';
import { LuBrainCircuit, LuCodeXml, LuGauge, LuTarget } from 'react-icons/lu';
import { IconType } from 'react-icons';
import ScrollRise from '../common/ScrollRise';
import ScrollRevealText from '../common/ScrollRevealText';
import RiseCard from '../common/RiseCard';
import CountUp from '../common/CountUp';

/** Real numbers from the CV / portfolio. Dark and light cards alternate, like the mockup. */
const STATS: {
	key: string;
	value: number;
	prefix?: string;
	suffix?: string;
	decimals?: number;
	icon: IconType;
	dark?: boolean;
}[] = [
	{ key: 'live', value: 4, icon: LuCodeXml, dark: true },
	{ key: 'ai', value: 3, icon: LuBrainCircuit },
	{ key: 'accuracy', value: 88.3, suffix: '%', decimals: 1, icon: LuTarget, dark: true },
	{ key: 'speed', value: 250, prefix: '~', suffix: 'ms', icon: LuGauge },
];

const KeyAchievements = () => {
	const { t } = useTranslation('common');
	const gridRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({ target: gridRef, offset: ['start end', 'start 0.45'] });

	return (
		<Stack component={'section'} id={'key-achievements'} className={'key-achievements'}>
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
							className={`achievement-card ${stat.dark ? 'dark' : ''}`}
							index={index}
							total={STATS.length}
							progress={scrollYProgress}
						>
							<span className={'achievement-icon'}>
								<Icon />
							</span>
							<strong className={'achievement-value'}>
								{stat.prefix}
								<CountUp value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
							</strong>
							<span className={'achievement-label'}>{t(`experience.achievements.${stat.key}Label`)}</span>
							<small className={'achievement-note'}>{t(`experience.achievements.${stat.key}Note`)}</small>
						</RiseCard>
					);
				})}
			</Box>
		</Stack>
	);
};

export default KeyAchievements;
