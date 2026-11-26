import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next/pages';
import { useQuery } from '@apollo/client';
import { Stack, Box } from '@mui/material';
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import {
	LuArrowRight,
	LuArrowUpRight,
	LuAward,
	LuBookOpen,
	LuBrain,
	LuChartNoAxesColumnIncreasing,
	LuCodeXml,
	LuDatabase,
	LuLayers,
	LuServer,
	LuSparkles,
	LuZap,
} from 'react-icons/lu';
import { IconType } from 'react-icons';
import { GET_SKILLS } from '../../../apollo/user/query';
import { localize } from '../../utils';
import { getSkillBrand } from '../../skillIcons';
import { Skill, SkillCategory } from '../../types/skill/skill';
import { sectionCount } from '../../config';

const EASE = [0.22, 1, 0.36, 1] as const;
const CARD_LIMIT = 4;
const TILE_LIMIT = 3;

/** Icon names an admin can choose for a skill category. */
const CATEGORY_ICONS: Record<string, IconType> = {
	code: LuCodeXml,
	database: LuDatabase,
	server: LuServer,
	brain: LuBrain,
	layers: LuLayers,
};

const toSkills = (names: string[]): Skill[] =>
	names.map((name, index) => ({ _id: name, name, slug: name, icon: '', featured: index < TILE_LIMIT, order: index }));

/** Shown while the database has no skills yet. Every skill here comes from the CV. */
const FALLBACK_CATEGORIES: SkillCategory[] = [
	{
		_id: 'frontend',
		key: 'frontend',
		icon: 'code',
		title: { en: 'Frontend Development', ko: '프론트엔드 개발' },
		description: {
			en: 'Responsive interfaces with Next.js, TypeScript and Redux Toolkit.',
			ko: 'Next.js, TypeScript, Redux Toolkit으로 반응형 인터페이스를 만듭니다.',
		},
		skills: toSkills([
			'Next.js',
			'React',
			'TypeScript',
			'Redux Toolkit',
			'Apollo Client',
			'Material UI',
			'Tailwind CSS',
			'Vite',
			'SCSS',
		]),
	},
	{
		_id: 'backend',
		key: 'backend',
		icon: 'database',
		title: { en: 'Backend Development', ko: '백엔드 개발' },
		description: {
			en: 'NestJS and GraphQL APIs on MongoDB, with JWT auth and real-time WebSocket.',
			ko: 'MongoDB 기반 NestJS·GraphQL API와 JWT 인증, WebSocket 실시간 기능을 구현합니다.',
		},
		skills: toSkills([
			'NestJS',
			'GraphQL',
			'MongoDB',
			'Node.js',
			'Express.js',
			'Socket.IO',
			'REST APIs',
			'WebSocket',
			'Mongoose',
			'JWT',
			'OAuth',
			'2FA',
		]),
	},
	{
		_id: 'ai',
		key: 'ai',
		icon: 'brain',
		title: { en: 'AI & Machine Learning', ko: 'AI & 머신러닝' },
		description: {
			en: 'Fine-tuning image classifiers and serving them through FastAPI.',
			ko: '이미지 분류 모델을 파인튜닝하고 FastAPI로 서비스에 연결합니다.',
		},
		skills: toSkills([
			'Python',
			'PyTorch',
			'OpenCV',
			'FastAPI',
			'Gemini API',
			'RAG',
			'Image Classification',
			'Transfer Learning',
			'torchvision',
			'ConvNeXt-Tiny',
			'MobileNetV2',
			'Model Evaluation & Optimization',
			'NumPy',
			'Pandas',
		]),
	},
	{
		_id: 'devops',
		key: 'devops',
		icon: 'layers',
		title: { en: 'Infrastructure & Deployment', ko: '인프라 & 배포' },
		description: {
			en: 'Docker, NGINX and PM2 deployments on an Ubuntu VPS with SSL.',
			ko: 'Ubuntu VPS에 Docker, NGINX, PM2로 배포하고 SSL을 설정합니다.',
		},
		skills: toSkills(['Docker', 'NGINX', 'Ubuntu Linux', 'Docker Compose', 'PM2', 'VPS Deployment', 'SSL']),
	},
];

/** A real resolver from this site's API, typed out on the laptop. */
const CODE_FILE = 'project.resolver.ts';
const CODE_LINES = [
	'@Resolver(() => Project)',
	'export class ProjectResolver {',
	'  constructor(private readonly projectService: ProjectService) {}',
	'',
	'  @Query(() => [Project])',
	'  public async getProjects(',
	"    @Args('input') input: ProjectsInquiry,",
	'  ): Promise<Project[]> {',
	'    return await this.projectService.getProjects(input);',
	'  }',
	'',
	'  @Roles(UserRole.ADMIN)',
	'  @UseGuards(RolesGuard)',
	'  @Mutation(() => ProjectResult)',
	'  public async createProjectByAdmin(',
	"    @Args('input') input: ProjectInput,",
	'  ): Promise<ProjectResult> {',
	'    return await this.projectService.createProjectByAdmin(input);',
	'  }',
	'}',
];
const CODE_TREE = [
	'src',
	'components',
	'project',
	'project.module.ts',
	'project.resolver.ts',
	'project.service.ts',
	'libs',
	'schemas',
];
const TOKEN =
	/(@\w+|'[^']*'|\b(?:export|class|constructor|private|readonly|public|async|return|await)\b|\b[A-Z]\w*\b)/g;

/** Splits a line of TypeScript into coloured spans. */
const highlight = (line: string) =>
	line.split(TOKEN).map((part, index) => {
		if (!part) return null;
		let kind = '';
		if (part.startsWith('@')) kind = 'decorator';
		else if (part.startsWith("'")) kind = 'string';
		else if (/^(export|class|constructor|private|readonly|public|async|return|await)$/.test(part)) kind = 'keyword';
		else if (/^[A-Z]\w*$/.test(part)) kind = 'type';
		return (
			<span key={index} className={kind}>
				{part}
			</span>
		);
	});

/** Counts up from 0 the first time it is on screen. */
const CountUp = (props: { value: number; suffix?: string }) => {
	const ref = useRef<HTMLSpanElement>(null);
	const inView = useInView(ref, { once: true, amount: 0.6 });
	const reduceMotion = useReducedMotion();
	const [shown, setShown] = useState<number>(0);

	/** LIFECYCLES **/
	useEffect(() => {
		if (!inView) return;
		const controls = animate(0, props.value, {
			duration: reduceMotion ? 0 : 1.4,
			ease: EASE,
			onUpdate: (latest) => setShown(Math.round(latest)),
		});
		return () => controls.stop();
	}, [inView, reduceMotion, props.value]);

	return (
		<span ref={ref}>
			{shown}
			{props.suffix}
		</span>
	);
};

const SkillsPreview = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const reduceMotion = useReducedMotion();
	const sectionRef = useRef<HTMLElement>(null);

	/** APOLLO REQUESTS **/
	const { data: getSkillsData } = useQuery<{ getSkills: SkillCategory[] }>(GET_SKILLS, {
		fetchPolicy: 'cache-first',
	});

	const loaded = (getSkillsData?.getSkills ?? []).filter((category) => category.skills?.length);
	const categories = loaded.length ? loaded : FALLBACK_CATEGORIES;
	const totalSkills = categories.reduce((sum, category) => sum + (category.skills?.length ?? 0), 0);
	// "41" → "40+": never claim more than there is
	const skillsRounded = totalSkills >= 10 ? Math.floor(totalSkills / 10) * 10 : totalSkills;

	/** SCROLL MOTION: the laptop drifts and turns a little, the badges float at their own speed **/
	const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
	const range = reduceMotion ? 0 : 1;
	const laptopY = useTransform(scrollYProgress, [0, 1], [80 * range, -60 * range]);
	const laptopTurn = useTransform(scrollYProgress, [0, 1], [-30 * range - 18, -18 + 6 * range]);
	const badgeY = useTransform(scrollYProgress, [0, 1], [120 * range, -120 * range]);
	const statY = useTransform(scrollYProgress, [0, 1], [160 * range, -80 * range]);

	const reveal = (delay: number, y: number = 30) => ({
		initial: { opacity: 0, y: reduceMotion ? 0 : y },
		whileInView: { opacity: 1, y: 0 },
		viewport: { once: true, amount: 0.3 },
		transition: { duration: 0.9, ease: EASE, delay },
	});

	return (
		<Stack component={'section'} ref={sectionRef} id={'skills-preview'} className={'skills-preview'}>
			<svg className={'skills-arcs'} viewBox={'0 0 1920 819'} preserveAspectRatio={'none'} aria-hidden={'true'}>
				<path d={'M 420 640 C 470 520, 560 450, 700 400'} />
				<path d={'M 1180 80 C 1350 -10, 1560 0, 1780 130'} />
			</svg>
			<span className={'skills-dot dot-1'} aria-hidden={'true'} />
			<span className={'skills-dot dot-2'} aria-hidden={'true'} />

			<Stack className={'skills-main'}>
				{/* left: heading */}
				<Stack className={'skills-intro'}>
					<motion.div className={'eyebrow'} {...reveal(0, 20)}>
						<span className={'dot'} />
						<span className={'label'}>{t('home.skills.eyebrow')}</span>
						<span className={'line'} />
						<span className={'count'}>{sectionCount('skills')}</span>
					</motion.div>

					<motion.h2
						className={'title'}
						initial={'hidden'}
						whileInView={'show'}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
					>
						{[t('home.skills.title1'), t('home.skills.title2')].map((line, index) => (
							<span key={line} className={'title-mask'}>
								<motion.span
									className={`title-line ${index === 1 ? 'accent' : ''}`}
									variants={{ hidden: { y: reduceMotion ? '0%' : '105%' }, show: { y: '0%' } }}
									transition={{ duration: 1, ease: EASE }}
								>
									{line}
								</motion.span>
							</span>
						))}
					</motion.h2>

					<motion.p className={'text'} {...reveal(0.3)}>
						{t('home.skills.text')}
					</motion.p>

					<motion.div {...reveal(0.45, 20)}>
						<Link href={'/skills'} className={'explore-button'}>
							{t('home.skills.explore')}
							<LuArrowUpRight />
						</Link>
					</motion.div>
				</Stack>

				{/* middle: one card per stack */}
				<Box className={'skills-grid'}>
					{categories.slice(0, CARD_LIMIT).map((category, index) => {
						const Icon = CATEGORY_ICONS[category.icon] ?? LuSparkles;
						const skills = [...(category.skills ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
						const featured = skills.filter((skill) => skill.featured);
						const tiles = (featured.length ? featured : skills).slice(0, TILE_LIMIT);
						return (
							<motion.article
								key={category._id}
								className={'stack-card'}
								initial={{ opacity: 0, y: reduceMotion ? 0 : 60, rotateX: reduceMotion ? 0 : 12 }}
								whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
								viewport={{ once: true, amount: 0.3 }}
								transition={{ duration: 1, ease: EASE, delay: index * 0.1 }}
							>
								<Link
									href={`/skills#${category.key}`}
									className={'card-link'}
									aria-label={localize(category.title, router.locale)}
								/>
								<Stack className={'card-head'}>
									<span className={'icon'}>
										<Icon />
									</span>
									<strong className={'title'}>{localize(category.title, router.locale)}</strong>
									<span className={'number'}>{String(index + 1).padStart(2, '0')}</span>
									<span className={'arrow'}>
										<LuArrowRight />
									</span>
								</Stack>
								<p className={'description'}>{localize(category.description, router.locale)}</p>
								<Box className={'tiles'}>
									{tiles.map((skill, tileIndex) => {
										const brand = getSkillBrand(skill.icon, skill.slug || skill.name);
										const SkillIcon = brand.icon;
										return (
											<motion.span
												key={skill._id}
												className={'tile'}
												initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.6 }}
												whileInView={{ opacity: 1, scale: 1 }}
												viewport={{ once: true, amount: 0.5 }}
												transition={{ duration: 0.6, ease: EASE, delay: 0.35 + index * 0.1 + tileIndex * 0.08 }}
											>
												<SkillIcon className={'tile-icon'} style={{ color: brand.color }} />
												<span className={'tile-name'}>{skill.name}</span>
											</motion.span>
										);
									})}
								</Box>
							</motion.article>
						);
					})}
				</Box>

				{/* right: a laptop typing real code from this site */}
				<Box className={'skills-visual'} aria-hidden={'true'}>
					<motion.div className={'laptop'} style={{ y: laptopY, rotateY: laptopTurn }}>
						<div className={'screen'}>
							<div className={'editor-bar'}>
								<span className={'lights'}>
									<i />
									<i />
									<i />
								</span>
								<span className={'tab'}>{CODE_FILE}</span>
							</div>
							<div className={'editor-body'}>
								<ul className={'tree'}>
									{CODE_TREE.map((item, index) => (
										<li
											key={item}
											className={item === CODE_FILE ? 'active' : ''}
											style={{ paddingLeft: `${Math.min(index, 3) * 8}px` }}
										>
											{item}
										</li>
									))}
								</ul>
								<motion.ol
									className={'code'}
									initial={'hidden'}
									whileInView={'show'}
									viewport={{ once: true, amount: 0.4 }}
									transition={{ staggerChildren: reduceMotion ? 0 : 0.09, delayChildren: 0.3 }}
								>
									{CODE_LINES.map((line, index) => (
										<motion.li
											key={index}
											variants={{
												hidden: { clipPath: reduceMotion ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)' },
												show: { clipPath: 'inset(0 0% 0 0)' },
											}}
											transition={{ duration: 0.35, ease: 'linear' }}
										>
											{highlight(line)}
											{index === CODE_LINES.length - 1 && <span className={'caret'} />}
										</motion.li>
									))}
								</motion.ol>
							</div>
							<div className={'editor-status'}>localhost:4000/graphql</div>
						</div>
						<div className={'base'} />
					</motion.div>

					<motion.div className={'float-badge code-badge'} style={{ y: badgeY }}>
						<LuCodeXml className={'badge-icon'} />
						<span>
							<strong>{t('home.skills.badge1')}</strong>
							{t('home.skills.badge2')}
						</span>
					</motion.div>
					<motion.div className={'float-badge ideas-badge'} style={{ y: statY }}>
						<LuChartNoAxesColumnIncreasing className={'badge-icon'} />
						<span>
							{t('home.skills.ideas1')}
							<br />
							{t('home.skills.ideas2')}
						</span>
					</motion.div>
				</Box>
			</Stack>

			{/* bottom strip */}
			<motion.div className={'skills-strip'} {...reveal(0.1, 40)}>
				<span className={'strip-dot'} />
				{/* certificate from the CV: backs up the "always learning" quote next to it */}
				<Box className={'cert-badge'}>
					<span className={'seal'}>
						<span className={'ring'} />
						<LuAward />
					</span>
					<span className={'cert-text'}>
						<small>{t('home.skills.certLabel')}</small>
						<strong>{t('home.skills.certIssuer')}</strong>
						<span>{t('home.skills.certTitle')}</span>
					</span>
				</Box>
				<p className={'quote'}>“ {t('home.skills.quote')} ”</p>
				<Box className={'stats'}>
					<span className={'stat'}>
						<LuBookOpen className={'stat-icon'} />
						<span>
							<strong>
								<CountUp value={Math.min(categories.length, CARD_LIMIT)} />
							</strong>
							{t('home.skills.mainStacks')}
						</span>
					</span>
					<span className={'stat'}>
						<LuChartNoAxesColumnIncreasing className={'stat-icon'} />
						<span>
							<strong>
								<CountUp value={skillsRounded} suffix={totalSkills > skillsRounded ? '+' : ''} />
							</strong>
							{t('home.skills.technologies')}
						</span>
					</span>
					<span className={'stat'}>
						<LuZap className={'stat-icon'} />
						<span>
							<strong>{t('home.skills.learning1')}</strong>
							{t('home.skills.learning2')}
						</span>
					</span>
				</Box>
				<Link href={'/skills'} className={'view-all'}>
					{t('home.skills.viewAll')}
					<LuArrowUpRight />
				</Link>
			</motion.div>
		</Stack>
	);
};

export default SkillsPreview;
