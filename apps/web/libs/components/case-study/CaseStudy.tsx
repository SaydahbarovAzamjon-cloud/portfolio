import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next/pages';
import { Stack, Box } from '@mui/material';
import { motion, useReducedMotion } from 'motion/react';
import { LuArrowRight, LuArrowUpRight, LuChevronRight, LuHouse } from 'react-icons/lu';
import { SiGithub } from 'react-icons/si';
import { localize } from '../../utils';
import { getSkillBrand } from '../../skillIcons';
import { PROJECT_EXTRAS } from '../../projectExtras';
import { ProjectStatus } from '../../enums/project.enum';
import useProjects from '../../hooks/useProjects';
import RichText from '../common/RichText';
import ScrollRise from '../common/ScrollRise';
import FixoraCaseStudy from './FixoraCaseStudy';
import peaks from '../../../public/img/experience-hero-bg.webp';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Projects with a full write-up; the others get the short version (hero, summary, screens, stack). */
const FULL_STUDIES: Record<string, () => React.ReactElement> = {
	fixora: () => <FixoraCaseStudy />,
};

const CaseStudy = ({ slug }: { slug: string }) => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const reduceMotion = useReducedMotion();
	const projects = useProjects();
	const index = projects.findIndex((project) => project.slug === slug);
	const project = projects[index];
	if (!project) {
		return (
			<Stack className={'case-missing'}>
				<p>{t('caseStudy.common.missing')}</p>
				<Link href={'/projects'}>{t('caseStudy.common.back')}</Link>
			</Stack>
		);
	}

	const extra = PROJECT_EXTRAS[project.slug];
	const next = projects[(index + 1) % projects.length];
	const nextExtra = PROJECT_EXTRAS[next.slug];
	const full = FULL_STUDIES[project.slug];
	const badges = t(`caseStudy.${project.slug}.badges`, { returnObjects: true, defaultValue: [] }) as string[];

	const rise = (delay: number, y: number = 30) => ({
		initial: { opacity: 0, y: reduceMotion ? 0 : y },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.9, ease: EASE, delay },
	});

	return (
		<>
			{/* hero: breadcrumb, badges, title, links and the main screen */}
			<Box component={'section'} className={'case-hero'}>
				<Box className={'case-hero-bg'} aria-hidden={'true'}>
					<Image src={peaks} alt={''} fill priority sizes={'60vw'} placeholder={'blur'} />
				</Box>
				<Stack className={'case-hero-text'}>
					<motion.nav className={'breadcrumb'} aria-label={'breadcrumb'} {...rise(0.05, 10)}>
						<Link href={'/'} aria-label={'Home'}>
							<LuHouse />
						</Link>
						<LuChevronRight />
						<Link href={'/projects'}>{t('nav.projects')}</Link>
						<LuChevronRight />
						<span>{project.title}</span>
					</motion.nav>
					{Array.isArray(badges) && badges.length > 0 && (
						<motion.div className={'case-badges'} {...rise(0.12, 10)}>
							{badges.map((badge, badgeIndex) => (
								<span key={badge} className={badgeIndex === 0 ? 'live' : ''}>
									{badgeIndex === 0 && <i />}
									{badge}
								</span>
							))}
						</motion.div>
					)}
					<motion.h1 className={'case-title'} {...rise(0.2, 40)}>
						{project.title}
					</motion.h1>
					<motion.p className={'case-subtitle'} {...rise(0.3)}>
						{localize(project.subtitle, router.locale)}
						{project.status === ProjectStatus.IN_PROGRESS && <b>{t('projects.filter.progress')}</b>}
					</motion.p>
					<motion.div className={'case-links'} {...rise(0.4, 16)}>
						{project.links?.live && (
							<a href={project.links.live} target={'_blank'} rel={'noreferrer'} className={'link-live'}>
								{t('projects.links.live')}
								<LuArrowUpRight />
							</a>
						)}
						{project.links?.github && (
							<a href={project.links.github} target={'_blank'} rel={'noreferrer'} className={'link-github'}>
								<SiGithub />
								{t('projects.links.github')}
							</a>
						)}
					</motion.div>
				</Stack>
				{extra?.cover && (
					<motion.span className={'case-hero-shot'} {...rise(0.3, 60)}>
						<Image src={extra.cover} alt={project.title} fill priority sizes={'(max-width: 1024px) 90vw, 55vw'} />
					</motion.span>
				)}
			</Box>

			{full ? (
				full()
			) : (
				// the short version: summary, stack and every screen we have
				<Stack className={'case-body'}>
					<ScrollRise className={'case-card case-summary'} order={0}>
						<RichText text={localize(project.summary, router.locale)} />
						<span className={'case-stack'}>
							{(project.skills ?? []).map((skill) => {
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
						<small className={'case-soon'}>{t('caseStudy.common.soon')}</small>
					</ScrollRise>
					{extra?.gallery.length ? (
						<Box className={'case-gallery'}>
							{extra.gallery.map((image, imageIndex) => (
								<ScrollRise key={imageIndex} className={'case-shot'} order={imageIndex % 2}>
									<Image src={image} alt={''} sizes={'(max-width: 1024px) 90vw, 45vw'} />
								</ScrollRise>
							))}
						</Box>
					) : null}
				</Stack>
			)}

			{/* next project + call to action */}
			<Box component={'section'} className={'case-footer'}>
				<Link href={`/projects/${next.slug}`} className={'case-next'}>
					<span className={'next-thumb'}>
						{nextExtra?.cover && <Image src={nextExtra.cover} alt={''} fill sizes={'240px'} />}
					</span>
					<span className={'next-text'}>
						<strong>
							{t('caseStudy.common.next')} {next.title}
							<LuArrowRight />
						</strong>
						<small>{localize(next.subtitle, router.locale)}</small>
					</span>
				</Link>
				<Box className={'case-cta'}>
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
				</Box>
			</Box>
		</>
	);
};

export default CaseStudy;
