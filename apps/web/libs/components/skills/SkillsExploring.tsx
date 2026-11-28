import React, { useRef } from 'react';
import { useTranslation } from 'next-i18next/pages';
import { Stack, Box } from '@mui/material';
import { useScroll } from 'motion/react';
import { IconType } from 'react-icons';
import { LuBot, LuLayers, LuShirt } from 'react-icons/lu';
import ScrollRise from '../common/ScrollRise';
import ScrollRevealText from '../common/ScrollRevealText';
import RichText from '../common/RichText';
import RiseCard from '../common/RiseCard';

/**
 * What I am learning or building right now (text in skills.exploring.<key>*).
 * Only things backed by the CV or the repos: Lumora (in progress), RAG + agentic AI (CV skill, Devex program),
 * Redis + BullMQ background jobs (planned in the Lumora backend, so shown as "next", never as done).
 */
const TOPICS: { key: string; icon: IconType; status: 'building' | 'learning' | 'next'; tools: string[] }[] = [
	{ key: 'lumora', icon: LuShirt, status: 'building', tools: ['Next.js', 'FastAPI', 'PyTorch', 'OpenCV'] },
	{ key: 'agents', icon: LuBot, status: 'learning', tools: ['RAG', 'Gemini API', 'Agentic workflows'] },
	{ key: 'queues', icon: LuLayers, status: 'next', tools: ['Redis', 'BullMQ', 'NestJS'] },
];

const SkillsExploring = () => {
	const { t } = useTranslation('common');
	const gridRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({ target: gridRef, offset: ['start end', 'start 0.4'] });

	return (
		<Stack component={'section'} id={'exploring'} className={'skills-exploring'}>
			<Stack className={'exploring-head'}>
				<Stack>
					<ScrollRise className={'eyebrow'} order={0}>
						<span className={'number'}>{'04 /'}</span>
						<span className={'label'}>{t('skills.exploring.eyebrow')}</span>
						<span className={'line'} />
					</ScrollRise>
					<ScrollRise order={1}>
						<h2 className={'title'}>
							{t('skills.exploring.title1')} <span className={'accent'}>{t('skills.exploring.title2')}</span>
						</h2>
					</ScrollRise>
				</Stack>
				<ScrollRise order={2}>
					<ScrollRevealText className={'intro-text'} text={t('skills.exploring.intro')} />
				</ScrollRise>
			</Stack>

			<Box className={'exploring-grid'} ref={gridRef}>
				{TOPICS.map((topic, index) => {
					const Icon = topic.icon;
					return (
						<RiseCard
							key={topic.key}
							className={`exploring-card status-${topic.status}`}
							index={index}
							total={TOPICS.length}
							progress={scrollYProgress}
						>
							<span className={'exploring-top'}>
								<span className={'exploring-icon'}>
									<Icon />
								</span>
								<span className={'exploring-status'}>
									<i />
									{t(`skills.exploring.status_${topic.status}`)}
								</span>
							</span>
							<strong>{t(`skills.exploring.${topic.key}Title`)}</strong>
							<RichText className={'exploring-text'} text={t(`skills.exploring.${topic.key}Text`)} />
							<span className={'exploring-next'}>
								<b>{t('skills.exploring.nextLabel')}</b>
								{t(`skills.exploring.${topic.key}Next`)}
							</span>
							<span className={'exploring-tools'}>
								{topic.tools.map((tool) => (
									<span key={tool}>{tool}</span>
								))}
							</span>
						</RiseCard>
					);
				})}
			</Box>

			<ScrollRise className={'exploring-quote'} order={1}>
				<RichText as={'span'} text={t('skills.exploring.quote')} />
			</ScrollRise>
		</Stack>
	);
};

export default SkillsExploring;
