import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next/pages';
import { Stack, Box } from '@mui/material';
import { motion, useReducedMotion } from 'motion/react';
import { IconType } from 'react-icons';
import { LuBrainCircuit, LuKeyRound, LuMessagesSquare, LuUsers } from 'react-icons/lu';
import { localize } from '../../utils';
import { getSkillBrand } from '../../skillIcons';
import { FLAGSHIP_SLUG, PROJECT_EXTRAS } from '../../projectExtras';
import useProjects from '../../hooks/useProjects';
import RichText from '../common/RichText';
import ScrollRise from '../common/ScrollRise';
import ProjectLinks from './ProjectLinks';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Four facts about the flagship (text in projects.flagship.fact_<key>), checked against the CV and the repo. */
const FACTS: { key: string; icon: IconType }[] = [
	{ key: 'roles', icon: LuUsers },
	{ key: 'realtime', icon: LuMessagesSquare },
	{ key: 'ai', icon: LuBrainCircuit },
	{ key: 'auth', icon: LuKeyRound },
];

const FlagshipProject = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const reduceMotion = useReducedMotion();
	const project = useProjects().find((item) => item.slug === FLAGSHIP_SLUG);
	const extra = PROJECT_EXTRAS[FLAGSHIP_SLUG];
	if (!project) return null;

	return (
		<ScrollRise className={'flagship-wrap'} order={0}>
			<Box component={'section'} className={'flagship'} id={'flagship'}>
				{/* a fan of real screens; hovering spreads them out */}
				<Box className={'flagship-screens'}>
					{extra.gallery.slice(0, 4).map((image, index) => (
						<motion.span
							key={index}
							className={`flagship-screen screen-${index}`}
							initial={{ opacity: 0, y: reduceMotion ? 0 : 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.8, ease: EASE, delay: 0.1 + index * 0.12 }}
						>
							<Image src={image} alt={''} fill sizes={'(max-width: 1024px) 70vw, 30vw'} />
						</motion.span>
					))}
				</Box>

				<Stack className={'flagship-info'}>
					<span className={'flagship-badge'}>{t('projects.flagship.badge')}</span>
					<h2 className={'flagship-title'}>
						{project.title} <span>— {localize(project.subtitle, router.locale)}</span>
					</h2>
					<RichText className={'flagship-text'} text={t('projects.flagship.text')} />

					<ul className={'flagship-facts'}>
						{FACTS.map((fact) => {
							const Icon = fact.icon;
							return (
								<li key={fact.key}>
									<span className={'fact-icon'}>
										<Icon />
									</span>
									{t(`projects.flagship.fact_${fact.key}`)}
								</li>
							);
						})}
					</ul>

					<span className={'flagship-stack-title'}>{t('projects.flagship.stack')}</span>
					<span className={'flagship-stack'}>
						{(project.skills ?? []).slice(0, 7).map((skill) => {
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

					<ProjectLinks slug={project.slug} links={project.links} size={'large'} />
				</Stack>
			</Box>
		</ScrollRise>
	);
};

export default FlagshipProject;
