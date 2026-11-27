import React, { useRef } from 'react';
import { useTranslation } from 'next-i18next/pages';
import { Stack, Box } from '@mui/material';
import { useScroll } from 'motion/react';
import ScrollRise from '../common/ScrollRise';
import ScrollRevealText from '../common/ScrollRevealText';
import RiseCard from '../common/RiseCard';
import ContributionArt, { ContributionArtKind } from './ContributionArt';

/**
 * Five areas of contribution (text in experience.contributions.<key>Title / <key>Text),
 * each with the projects from the CV where that work was done.
 */
const AREAS: { key: ContributionArtKind; projects: string[] }[] = [
	{ key: 'fullstack', projects: ['Fixora', 'GadgetStore'] },
	{ key: 'ai', projects: ['CarVia', 'FoodAI', 'Fixora'] },
	{ key: 'backend', projects: ['Fixora', 'GadgetStore'] },
	{ key: 'deploy', projects: ['Fixora', 'CarVia', 'GadgetStore'] },
	{ key: 'realtime', projects: ['Fixora', 'GadgetStore'] },
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
				{AREAS.map((area, index) => (
					<RiseCard
						key={area.key}
						className={'contribution-card'}
						index={index}
						total={AREAS.length}
						progress={scrollYProgress}
					>
						{/* a glossy 3D-style illustration standing on soft plates */}
						<span className={'tile-3d'}>
							<ContributionArt kind={area.key} />
						</span>
						<strong>{t(`experience.contributions.${area.key}Title`)}</strong>
						<p>{t(`experience.contributions.${area.key}Text`)}</p>
						<span className={'project-tags'}>
							{area.projects.map((project) => (
								<span key={project} className={'project-tag'}>
									{project}
								</span>
							))}
						</span>
					</RiseCard>
				))}
			</Box>
		</Stack>
	);
};

export default KeyContributions;
