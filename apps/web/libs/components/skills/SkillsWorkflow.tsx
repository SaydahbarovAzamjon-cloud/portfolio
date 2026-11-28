import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next/pages';
import { Stack, Box } from '@mui/material';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { IconType } from 'react-icons';
import { LuCodeXml, LuFlaskConical, LuLightbulb, LuRefreshCw, LuRocket } from 'react-icons/lu';
import { SiCursor, SiDocker, SiFigma, SiGit, SiGithub, SiPostman } from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';
import ScrollRise from '../common/ScrollRise';
import ScrollRevealText from '../common/ScrollRevealText';
import RichText from '../common/RichText';
import mountains from '../../../public/img/experience-hero-bg.webp';

const EASE = [0.22, 1, 0.36, 1] as const;
/** How long each step stays highlighted when nobody is pointing at one. */
const STEP_MS = 2600;

/** Five steps (text in skills.workflow.<key>Title / <key>Text); each card is turned and lifted to form an arc. */
const STEPS: { key: string; icon: IconType; tilt: number; lift: number }[] = [
	{ key: 'plan', icon: LuLightbulb, tilt: -5, lift: 70 },
	{ key: 'develop', icon: LuCodeXml, tilt: -2.5, lift: 25 },
	{ key: 'test', icon: LuFlaskConical, tilt: 0, lift: 0 },
	{ key: 'deploy', icon: LuRocket, tilt: 2.5, lift: 25 },
	{ key: 'iterate', icon: LuRefreshCw, tilt: 5, lift: 70 },
];

/** The everyday tools listed in the CV. */
const TOOLS: { name: string; icon: IconType; color: string }[] = [
	{ name: 'Git', icon: SiGit, color: '#f05032' },
	{ name: 'GitHub', icon: SiGithub, color: '#181717' },
	{ name: 'VS Code', icon: VscVscode, color: '#007acc' },
	{ name: 'Cursor', icon: SiCursor, color: '#000000' },
	{ name: 'Postman', icon: SiPostman, color: '#ff6c37' },
	{ name: 'Docker', icon: SiDocker, color: '#2496ed' },
	{ name: 'Figma', icon: SiFigma, color: '#f24e1e' },
];

/** The glowing wave that links the cards (viewBox 1000 x 300, stretched to the row). */
const WAVE =
	'M 0 230 C 120 250, 160 140, 300 150 C 420 160, 420 70, 500 60 C 580 50, 600 170, 700 160 C 820 150, 880 260, 1000 230';

const SkillsWorkflow = () => {
	const { t } = useTranslation('common');
	const reduceMotion = useReducedMotion();
	const rowRef = useRef<HTMLDivElement>(null);
	// the highlighted step walks along the process on its own; pointing at a card takes over
	const [active, setActive] = useState(2);
	const [paused, setPaused] = useState(false);

	/** SCROLL MOTION: the wave draws itself as the row comes into view **/
	const { scrollYProgress } = useScroll({ target: rowRef, offset: ['start 0.9', 'start 0.35'] });
	const waveLength = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 1 : 0, 1]);

	/** LIFECYCLES **/
	useEffect(() => {
		if (paused || reduceMotion) return;
		const timer = setInterval(() => setActive((step) => (step + 1) % STEPS.length), STEP_MS);
		return () => clearInterval(timer);
	}, [paused, reduceMotion]);

	return (
		<Stack component={'section'} id={'workflow'} className={'skills-workflow'}>
			{/* snowy peaks behind the heading and along the bottom */}
			<Box className={'workflow-peaks'} aria-hidden={'true'}>
				<Image src={mountains} alt={''} fill sizes={'60vw'} />
			</Box>
			<Box className={'workflow-ridges'} aria-hidden={'true'}>
				<Image src={mountains} alt={''} fill sizes={'100vw'} />
			</Box>

			<Stack className={'workflow-head'}>
				<ScrollRise className={'eyebrow'} order={0}>
					<span className={'number'}>{'03 /'}</span>
					<span className={'label'}>{t('skills.workflow.eyebrow')}</span>
					<span className={'line'} />
				</ScrollRise>
				<ScrollRise order={1}>
					<h2 className={'title'}>
						{t('skills.workflow.title1')} <span className={'accent'}>{t('skills.workflow.title2')}</span>
					</h2>
				</ScrollRise>
				<ScrollRise order={2}>
					<ScrollRevealText className={'intro-text'} text={t('skills.workflow.intro')} />
				</ScrollRise>
			</Stack>

			<Box className={'workflow-row'} ref={rowRef} onMouseLeave={() => setPaused(false)}>
				<svg className={'workflow-wave'} viewBox={'0 0 1000 300'} preserveAspectRatio={'none'} aria-hidden={'true'}>
					<path className={'wave-base'} d={WAVE} />
					<motion.path className={'wave-glow'} d={WAVE} style={{ pathLength: waveLength }} />
				</svg>

				{STEPS.map((step, index) => {
					const Icon = step.icon;
					return (
						<motion.article
							key={step.key}
							className={`workflow-card ${index === active ? 'active' : ''}`}
							style={{ '--tilt': `${step.tilt}deg`, '--lift': `${step.lift}px` } as React.CSSProperties}
							initial={{ opacity: 0, y: reduceMotion ? 0 : 60 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.4 }}
							transition={{ duration: 0.9, ease: EASE, delay: index * 0.12 }}
							onMouseEnter={() => {
								setPaused(true);
								setActive(index);
							}}
						>
							<span className={'workflow-icon'}>
								<Icon />
							</span>
							<strong>{t(`skills.workflow.${step.key}Title`)}</strong>
							<RichText className={'workflow-text'} text={t(`skills.workflow.${step.key}Text`)} />
							<span className={'workflow-number'}>{String(index + 1).padStart(2, '0')}</span>
						</motion.article>
					);
				})}
			</Box>

			<ScrollRise className={'tools-bar'} order={1}>
				<span className={'tools-title'}>{t('skills.workflow.tools')}</span>
				<span className={'tools-list'}>
					{TOOLS.map((tool) => {
						const Icon = tool.icon;
						return (
							<span key={tool.name} className={'tool-chip'} title={tool.name}>
								<Icon style={{ color: tool.color }} />
								<small>{tool.name}</small>
							</span>
						);
					})}
				</span>
			</ScrollRise>
		</Stack>
	);
};

export default SkillsWorkflow;
