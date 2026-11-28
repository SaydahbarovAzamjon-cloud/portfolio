import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next/pages';
import { LuArrowRight, LuArrowUpRight } from 'react-icons/lu';
import { SiGithub } from 'react-icons/si';
import { ProjectLinks as Links } from '../../types/project/project';

interface ProjectLinksProps {
	slug: string;
	links?: Links | null;
	size?: 'large' | 'small';
}

/** Live site, GitHub and the case study, in that order; a missing link is simply left out. */
const ProjectLinks = ({ slug, links, size = 'small' }: ProjectLinksProps) => {
	const { t } = useTranslation('common');
	return (
		<span className={`project-links ${size}`}>
			{links?.live && (
				<a href={links.live} target={'_blank'} rel={'noreferrer'} className={'link-live'}>
					{t('projects.links.live')}
					<LuArrowUpRight />
				</a>
			)}
			{links?.github && (
				<a href={links.github} target={'_blank'} rel={'noreferrer'} className={'link-github'}>
					<SiGithub />
					{t('projects.links.github')}
				</a>
			)}
			<Link href={`/projects/${slug}`} className={'link-case'}>
				{t('projects.links.case')}
				<LuArrowRight />
			</Link>
		</span>
	);
};

export default ProjectLinks;
