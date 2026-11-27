import React, { useRef } from 'react';
import { useTranslation } from 'next-i18next/pages';
import { Stack, Box } from '@mui/material';
import { useScroll } from 'motion/react';
import { LuBrainCircuit, LuCloudUpload, LuLaptop, LuServer, LuTarget } from 'react-icons/lu';
import { IconType } from 'react-icons';
import ScrollRise from '../common/ScrollRise';
import ScrollRevealText from '../common/ScrollRevealText';
import RiseCard from '../common/RiseCard';

/** Five areas of contribution (text in experience.contributions.<key>Title / <key>Text). */
const AREAS: { key: string; icon: IconType }[] = [
	{ key: 'fullstack', icon: LuLaptop },
	{ key: 'ai', icon: LuBrainCircuit },
	{ key: 'backend', icon: LuServer },
	{ key: 'deploy', icon: LuCloudUpload },
	{ key: 'problems', icon: LuTarget },
];

const KeyContributions = () => {
	const { t } = useTranslation('common');
	const gridRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({ target: gridRef, offset: ['start end', 'start 0.45'] });

	return (
		<Stack component={'section'} id={'key-contributions'} className={'key-contributions'}>
			<Stack className={'section-head'}>
				<Stack>
					<ScrollRise className={'eyebrow'} order={0}>
						<span className={'label'}>{t('experience.contributions.eyebrow')}</span>
						<span className={'line'} />
					</ScrollRise>
					<ScrollRise order={1}>
						<h2 className={'title'}>
							{t('experience.contributions.title1')}{' '}
							<span className={'accent'}>{t('experience.contributions.title2')}</span>
						</h2>
					</ScrollRise>
				</Stack>
				<ScrollRise order={2}>
					<ScrollRevealText className={'head-text'} text={t('experience.contributions.intro')} />
				</ScrollRise>
			</Stack>

			<Box className={'contribution-grid'} ref={gridRef}>
				{AREAS.map((area, index) => {
					const Icon = area.icon;
					return (
						<RiseCard
							key={area.key}
							className={'contribution-card'}
							index={index}
							total={AREAS.length}
							progress={scrollYProgress}
						>
							{/* a glossy 3D-looking tile: gradient block, top highlight and a soft base plate */}
							<span className={'tile-3d'}>
								<span className={'tile-base'} />
								<span className={'tile-face'}>
									<Icon />
								</span>
							</span>
							<strong>{t(`experience.contributions.${area.key}Title`)}</strong>
							<p>{t(`experience.contributions.${area.key}Text`)}</p>
						</RiseCard>
					);
				})}
			</Box>
		</Stack>
	);
};

export default KeyContributions;
