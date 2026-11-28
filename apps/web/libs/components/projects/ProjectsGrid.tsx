import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next/pages';
import { Stack } from '@mui/material';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { LuArrowUpRight, LuSparkles } from 'react-icons/lu';
import { localize } from '../../utils';
import { getSkillBrand } from '../../skillIcons';
import { ProjectCategory, ProjectStatus } from '../../enums/project.enum';
import { FLAGSHIP_SLUG, PROJECT_EXTRAS } from '../../projectExtras';
import useProjects from '../../hooks/useProjects';
import ScrollRise from '../common/ScrollRise';
import ProjectLinks from './ProjectLinks';

const EASE = [0.22, 1, 0.36, 1] as const;

type CategoryFilter = 'all' | ProjectCategory.FULL_STACK | ProjectCategory.AI_ML;
type StatusFilter = 'all' | 'live' | 'progress';

const CATEGORIES: CategoryFilter[] = ['all', ProjectCategory.FULL_STACK, ProjectCategory.AI_ML];
const STATUSES: StatusFilter[] = ['live', 'progress'];

const ProjectsGrid = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const reduceMotion = useReducedMotion();
	const allProjects = useProjects();
	const [category, setCategory] = useState<CategoryFilter>('all');
	// a status tab toggles: click it again to show every status
	const [status, setStatus] = useState<StatusFilter>('all');

	// with no filter the flagship has its own block above; with a filter it joins the grid
	const filtering = category !== 'all' || status !== 'all';
	const projects = filtering ? allProjects : allProjects.filter((project) => project.slug !== FLAGSHIP_SLUG);
	// flagship first, finished work next, things still being built last
	const rank = (slug: string, inProgress: boolean) => (slug === FLAGSHIP_SLUG ? -1 : Number(inProgress));
	const ordered = [...projects].sort(
		(a, b) =>
			rank(a.slug, a.status === ProjectStatus.IN_PROGRESS) - rank(b.slug, b.status === ProjectStatus.IN_PROGRESS),
	);
	const visible = ordered.filter((project) => {
		const inProgress = project.status === ProjectStatus.IN_PROGRESS;
		const tags = PROJECT_EXTRAS[project.slug]?.tags ?? [project.category];
		if (category !== 'all' && !tags.includes(category)) return false;
		if (status === 'live' && inProgress) return false;
		if (status === 'progress' && !inProgress) return false;
		return true;
	});

	return (
		<Stack component={'section'} className={'projects-list'} id={'all-projects'}>
			<ScrollRise className={'projects-filter'} order={0}>
				<span className={'filter-group'} role={'tablist'}>
					{CATEGORIES.map((item) => (
						<button
							key={item}
							type={'button'}
							role={'tab'}
							aria-selected={category === item}
							className={category === item ? 'active' : ''}
							onClick={() => setCategory(item)}
						>
							{t(`projects.filter.${item}`)}
						</button>
					))}
				</span>
				<span className={'filter-group'}>
					{STATUSES.map((item) => (
						<button
							key={item}
							type={'button'}
							aria-pressed={status === item}
							className={status === item ? 'active' : ''}
							onClick={() => setStatus((current) => (current === item ? 'all' : item))}
						>
							{t(`projects.filter.${item}`)}
						</button>
					))}
				</span>
			</ScrollRise>

			<motion.div className={'projects-grid'} layout>
				<AnimatePresence mode={'popLayout'}>
					{visible.map((project, index) => {
						const extra = PROJECT_EXTRAS[project.slug];
						const inProgress = project.status === ProjectStatus.IN_PROGRESS;
						return (
							<motion.article
								key={project._id}
								layout
								className={'project-card'}
								initial={{ opacity: 0, y: reduceMotion ? 0 : 50, scale: reduceMotion ? 1 : 0.97 }}
								whileInView={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
								viewport={{ once: true, amount: 0.25 }}
								transition={{ duration: 0.7, ease: EASE, delay: (index % 2) * 0.12 }}
							>
								<Link href={`/projects/${project.slug}`} className={'project-shot'} aria-label={project.title}>
									{extra?.cover ? (
										<Image src={extra.cover} alt={''} fill sizes={'(max-width: 1024px) 90vw, 22vw'} />
									) : (
										// nothing to show yet: a warm placeholder that says so
										<span className={'shot-placeholder'}>
											<LuSparkles />
											{t('projects.card.soon')}
										</span>
									)}
								</Link>

								<Stack className={'project-body'}>
									<span className={'project-head'}>
										<strong>{project.title}</strong>
										{inProgress && <span className={'status-badge'}>{t('projects.filter.progress')}</span>}
									</span>
									<span className={'project-subtitle'}>{localize(project.subtitle, router.locale)}</span>

									<span className={'project-metric'}>
										{extra?.metricValue && <b>{extra.metricValue}</b>}
										{t(`projects.metric.${project.slug}`)}
									</span>

									<span className={'project-stack'}>
										{(project.skills ?? []).slice(0, 3).map((skill) => {
											const brand = getSkillBrand(skill.icon, skill.slug || skill.name);
											const Icon = brand.icon;
											return (
												<span key={skill._id} className={'stack-chip'}>
													<Icon style={{ color: brand.color }} />
													{skill.name}
												</span>
											);
										})}
									</span>

									<ProjectLinks slug={project.slug} links={project.links} />
								</Stack>
							</motion.article>
						);
					})}
				</AnimatePresence>
			</motion.div>
			{!visible.length && <p className={'projects-empty'}>{t('projects.filter.empty')}</p>}

			{/* closing call to action */}
			<ScrollRise className={'projects-cta'} order={1}>
				<span>
					<strong>
						{t('projects.cta.title1')} <span className={'accent'}>{t('projects.cta.title2')}</span>
					</strong>
					<small>{t('projects.cta.text')}</small>
				</span>
				<Link href={'/contact'} className={'cta-button'}>
					{t('projects.cta.button')}
					<LuArrowUpRight />
				</Link>
			</ScrollRise>
		</Stack>
	);
};

export default ProjectsGrid;
