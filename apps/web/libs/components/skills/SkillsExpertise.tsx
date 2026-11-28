import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import { useTranslation } from 'next-i18next/pages';
import { Stack, Box } from '@mui/material';
import { AnimatePresence, motion, useReducedMotion, useScroll } from 'motion/react';
import { LuArrowUpRight, LuMousePointerClick } from 'react-icons/lu';
import ScrollRise from '../common/ScrollRise';
import ScrollRevealText from '../common/ScrollRevealText';
import RichText from '../common/RichText';
import RiseCard from '../common/RiseCard';
import LiveMenu from '../common/LiveMenu';
import { getSkillBrand } from '../../skillIcons';
import frontendImage from '../../../public/img/skills/expertise-frontend.webp';
import backendImage from '../../../public/img/skills/expertise-backend.webp';
import aiImage from '../../../public/img/skills/expertise-ai.webp';
import devopsImage from '../../../public/img/skills/expertise-devops.webp';
import mountains from '../../../public/img/experience-hero-bg.webp';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Projects from the CV; anything else in `usedIn` is a company. */
const PROJECTS = ['Fixora', 'CarVia', 'GadgetStore', 'FoodAI', 'Lumora'];

interface Tool {
	name: string;
	/** where the CV says it was used: project stacks and company stacks only */
	usedIn: string[];
}

/** Four areas (text in skills.expertise.<key>Title / <key>Text) with every CV tool behind them. */
const AREAS: { key: string; image: StaticImageData; tools: Tool[] }[] = [
	{
		key: 'frontend',
		image: frontendImage,
		tools: [
			{ name: 'Next.js', usedIn: ['Fixora', 'CarVia', 'Lumora', 'NGroup', 'ITC Global'] },
			{ name: 'React', usedIn: ['GadgetStore', 'ITC Global'] },
			{ name: 'TypeScript', usedIn: ['GadgetStore', 'NGroup', 'ITC Global'] },
			{ name: 'Redux Toolkit', usedIn: ['GadgetStore'] },
			{ name: 'Vite', usedIn: ['GadgetStore'] },
			{ name: 'Apollo Client', usedIn: [] },
			{ name: 'Material UI', usedIn: [] },
			{ name: 'Tailwind CSS', usedIn: [] },
			{ name: 'SCSS', usedIn: [] },
		],
	},
	{
		key: 'backend',
		image: backendImage,
		tools: [
			{ name: 'NestJS', usedIn: ['Fixora', 'NGroup', 'ITC Global'] },
			{ name: 'GraphQL', usedIn: ['Fixora', 'NGroup', 'ITC Global'] },
			{ name: 'MongoDB', usedIn: ['Fixora', 'GadgetStore', 'NGroup', 'ITC Global'] },
			{ name: 'Express.js', usedIn: ['GadgetStore', 'ITC Global'] },
			{ name: 'WebSocket', usedIn: ['Fixora', 'NGroup'] },
			{ name: 'Socket.IO', usedIn: ['GadgetStore'] },
			{ name: 'JWT', usedIn: ['GadgetStore', 'NGroup', 'ITC Global'] },
			{ name: 'Mongoose', usedIn: ['ITC Global'] },
			{ name: 'REST APIs', usedIn: ['GadgetStore', 'ITC Global'] },
			{ name: 'OAuth', usedIn: [] },
			{ name: '2FA', usedIn: [] },
		],
	},
	{
		key: 'ai',
		image: aiImage,
		tools: [
			{ name: 'Python', usedIn: ['CarVia', 'FoodAI', 'NGroup'] },
			{ name: 'PyTorch', usedIn: ['CarVia', 'FoodAI', 'Lumora', 'NGroup'] },
			{ name: 'torchvision', usedIn: ['CarVia', 'FoodAI', 'NGroup'] },
			{ name: 'OpenCV', usedIn: ['CarVia', 'Lumora', 'NGroup'] },
			{ name: 'FastAPI', usedIn: ['FoodAI', 'CarVia', 'Lumora', 'NGroup'] },
			{ name: 'Gemini API', usedIn: ['Fixora', 'NGroup'] },
			{ name: 'ConvNeXt-Tiny', usedIn: ['CarVia'] },
			{ name: 'MobileNetV2', usedIn: ['FoodAI'] },
			{ name: 'NumPy', usedIn: [] },
			{ name: 'Pandas', usedIn: [] },
			{ name: 'RAG', usedIn: [] },
		],
	},
	{
		key: 'devops',
		image: devopsImage,
		tools: [
			{ name: 'Docker', usedIn: ['Fixora', 'NGroup'] },
			{ name: 'NGINX', usedIn: ['Fixora', 'NGroup', 'ITC Global'] },
			{ name: 'Ubuntu', usedIn: ['Fixora', 'NGroup'] },
			{ name: 'PM2', usedIn: ['GadgetStore', 'ITC Global'] },
			{ name: 'Docker Compose', usedIn: [] },
			{ name: 'SSL', usedIn: [] },
			{ name: 'VPS deployment', usedIn: ['Fixora', 'CarVia', 'ITC Global'] },
		],
	},
];

const SkillsExpertise = () => {
	const { t } = useTranslation('common');
	const reduceMotion = useReducedMotion();
	const listRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({ target: listRef, offset: ['start end', 'start 0.35'] });
	// which area the stack panel shows (hover, focus or tap on a card)
	const [active, setActive] = useState(0);

	const area = AREAS[active];
	const projectCount = new Set(area.tools.flatMap((tool) => tool.usedIn.filter((place) => PROJECTS.includes(place))))
		.size;

	return (
		<Stack component={'section'} id={'core-expertise'} className={'skills-expertise'}>
			{/* misty ridges along the bottom edge */}
			<Box className={'expertise-ridges'} aria-hidden={'true'}>
				<Image src={mountains} alt={''} fill sizes={'100vw'} />
			</Box>

			{/* left: the pitch */}
			<Stack className={'expertise-intro'}>
				<ScrollRise className={'eyebrow'} order={0}>
					<span className={'number'}>{'02'}</span>
					<span className={'line'} />
					<span className={'label'}>{t('skills.expertise.eyebrow')}</span>
				</ScrollRise>
				<ScrollRise order={1}>
					<h2 className={'title'}>
						<span>{t('skills.expertise.title1')}</span>
						<span className={'accent'}>{t('skills.expertise.title2')}</span>
					</h2>
				</ScrollRise>
				<ScrollRise order={2}>
					<ScrollRevealText className={'intro-text'} text={t('skills.expertise.intro')} />
				</ScrollRise>
				<ScrollRise className={'expertise-buttons'} order={3}>
					<Link href={'/projects'} className={'button button-dark'}>
						{t('skills.expertise.explore')}
						<LuArrowUpRight />
					</Link>
					<LiveMenu />
				</ScrollRise>
			</Stack>

			{/* middle: the stack panel for the chosen area */}
			<Box className={'stack-panel-col'}>
				<ScrollRise className={'stack-panel-wrap'} order={1}>
					<Box className={'stack-panel'}>
						<AnimatePresence mode={'wait'} initial={false}>
							<motion.div
								key={area.key}
								className={'stack-panel-inner'}
								initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
								transition={{ duration: 0.35, ease: EASE }}
							>
								<span className={'panel-head'}>
									<span className={'panel-number'}>{String(active + 1).padStart(2, '0')}</span>
									<strong>{t(`skills.expertise.${area.key}Title`)}</strong>
								</span>
								<span className={'panel-counts'}>
									<span>
										<b>{area.tools.length}</b> {t('skills.expertise.tools')}
									</span>
									<span>
										<b>{projectCount}</b> {t('skills.expertise.projects')}
									</span>
								</span>

								<ul className={'tool-list'}>
									{area.tools.map((tool, index) => {
										const brand = getSkillBrand(tool.name);
										const Icon = brand.icon;
										return (
											<motion.li
												key={tool.name}
												initial={{ opacity: 0, x: reduceMotion ? 0 : -10 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ duration: 0.35, ease: EASE, delay: 0.05 + index * 0.035 }}
											>
												<span className={'tool-icon'}>
													<Icon style={{ color: brand.color }} />
												</span>
												<span className={'tool-name'}>{tool.name}</span>
												<span className={'tool-places'}>
													{tool.usedIn.map((place) => (
														<span key={place} className={PROJECTS.includes(place) ? 'project' : 'company'}>
															{place}
														</span>
													))}
												</span>
											</motion.li>
										);
									})}
								</ul>
								<span className={'panel-legend'}>
									<span className={'project'}>{t('skills.expertise.legendProject')}</span>
									<span className={'company'}>{t('skills.expertise.legendCompany')}</span>
								</span>
							</motion.div>
						</AnimatePresence>
					</Box>
					<span className={'panel-hint'}>
						<LuMousePointerClick />
						{t('skills.expertise.hint')}
					</span>
				</ScrollRise>
			</Box>

			{/* right: the four areas; they drive the panel */}
			<Box className={'expertise-list'} ref={listRef}>
				{AREAS.map((item, index) => (
					<RiseCard
						key={item.key}
						className={`expertise-card ${index === active ? 'active' : ''}`}
						index={index}
						total={AREAS.length}
						progress={scrollYProgress}
					>
						<button
							type={'button'}
							className={'expertise-select'}
							aria-pressed={index === active}
							onMouseEnter={() => setActive(index)}
							onFocus={() => setActive(index)}
							onClick={() => setActive(index)}
						>
							<span className={'expertise-thumb'}>
								<Image src={item.image} alt={''} fill sizes={'200px'} />
							</span>
							<span className={'expertise-body'}>
								<span className={'expertise-number'}>
									{String(index + 1).padStart(2, '0')}
									<i />
								</span>
								<strong>{t(`skills.expertise.${item.key}Title`)}</strong>
								<RichText as={'span'} className={'expertise-text'} text={t(`skills.expertise.${item.key}Text`)} />
							</span>
						</button>
					</RiseCard>
				))}
			</Box>
		</Stack>
	);
};

export default SkillsExpertise;
