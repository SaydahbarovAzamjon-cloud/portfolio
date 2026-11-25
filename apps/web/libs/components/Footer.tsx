import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next/pages';
import { useQuery } from '@apollo/client';
import { Stack, Box } from '@mui/material';
import { HiArrowUpRight, HiArrowUp } from 'react-icons/hi2';
import { HiOutlineMail } from 'react-icons/hi';
import { FaLinkedinIn, FaGithub, FaHeart } from 'react-icons/fa';
import { SiNextdotjs, SiTypescript, SiReact, SiNodedotjs, SiPython } from 'react-icons/si';
import { GET_PROFILE, GET_PROJECTS } from '../../apollo/user/query';
import { navLinks } from '../config';
import { localize } from '../utils';
import { Profile } from '../types/profile/profile';
import { Project } from '../types/project/project';
import { SocialPlatform } from '../enums/profile.enum';

const FEATURED_LIMIT = 3;

const Footer = () => {
	const router = useRouter();
	const { t } = useTranslation('common');

	/** APOLLO REQUESTS **/
	const { data: getProfileData } = useQuery<{ getProfile: Profile }>(GET_PROFILE, {
		fetchPolicy: 'cache-first',
	});
	const { data: getProjectsData } = useQuery<{ getProjects: Project[] }>(GET_PROJECTS, {
		fetchPolicy: 'cache-first',
		variables: { input: { showOnHome: true } },
	});

	const profile = getProfileData?.getProfile;
	const projects = (getProjectsData?.getProjects ?? []).slice(0, FEATURED_LIMIT);
	const linkedin = profile?.socials?.find((social) => social.platform === SocialPlatform.LINKEDIN);
	const github = profile?.socials?.find((social) => social.platform === SocialPlatform.GITHUB);

	const connects = [
		profile?.contactEmail && {
			key: 'email',
			icon: <HiOutlineMail />,
			label: t('footer.email'),
			value: profile.contactEmail,
			href: `mailto:${profile.contactEmail}`,
		},
		linkedin && {
			key: 'linkedin',
			icon: <FaLinkedinIn />,
			label: 'LinkedIn',
			value: linkedin.handle ?? linkedin.url.replace(/^https?:\/\/(www\.)?/, ''),
			href: linkedin.url,
		},
		github && {
			key: 'github',
			icon: <FaGithub />,
			label: 'GitHub',
			value: github.handle ?? github.url.replace(/^https?:\/\/(www\.)?/, ''),
			href: github.url,
		},
	].filter(Boolean) as { key: string; icon: React.ReactNode; label: string; value: string; href: string }[];

	/** HANDLERS **/
	const backToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<Stack className={'footer-container'}>
			<Stack className={'container'}>
				<Stack className={'main'}>
					<Stack className={'brand-box'}>
						<span className={'eyebrow'}>{t('footer.eyebrow')}</span>
						<Box className={'brand'}>
							AZAM<span className={'accent'}>JON</span>
							<span className={'dot'}>.</span>
						</Box>
						<p className={'description'}>{t('footer.description')}</p>
						<Box className={'chips'}>
							{['web', 'ai', 'product', 'learning'].map((chip) => (
								<span key={chip} className={'chip'}>
									{t(`footer.chips.${chip}`)}
								</span>
							))}
						</Box>
					</Stack>

					<Stack className={'column nav-column'}>
						<strong>{t('footer.navigation')}</strong>
						{navLinks
							.filter((link) => link.key !== 'journal')
							.map((link) => (
								<Link key={link.key} href={link.href}>
									{t(`nav.${link.key}`)}
								</Link>
							))}
					</Stack>

					<Stack className={'column projects-column'}>
						<strong>{t('footer.featuredProjects')}</strong>
						{projects.map((project) => (
							<Link key={project._id} href={`/projects/${project.slug}`} className={'item'}>
								<Box
									className={'icon'}
									style={{ background: project.theme?.accent ?? undefined }}
								>
									{project.media?.thumbnail?.url ? (
										<Image src={project.media.thumbnail.url} alt={''} width={56} height={56} />
									) : (
										project.title.charAt(0)
									)}
								</Box>
								<Box className={'text'}>
									<span className={'title'}>{project.title}</span>
									<span className={'sub'}>{localize(project.subtitle, router.locale)}</span>
								</Box>
								<HiArrowUpRight className={'arrow'} />
							</Link>
						))}
					</Stack>

					<Stack className={'column connect-column'}>
						<strong>{t('footer.connect')}</strong>
						{connects.map((item) => (
							<a key={item.key} href={item.href} target={'_blank'} rel={'noreferrer'} className={'item'}>
								<Box className={'icon'}>{item.icon}</Box>
								<Box className={'text'}>
									<span className={'title'}>{item.label}</span>
									<span className={'sub'}>{item.value}</span>
								</Box>
								<HiArrowUpRight className={'arrow'} />
							</a>
						))}
					</Stack>
				</Stack>

				<Stack className={'bottom'}>
					<span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
					<span className={'built'}>
						{t('footer.builtWith')} <FaHeart className={'heart'} /> {t('footer.builtUsing')}
					</span>
					<Box className={'right'}>
						<Box className={'tech'}>
							<SiNextdotjs title={'Next.js'} />
							<SiTypescript title={'TypeScript'} className={'ts'} />
							<SiReact title={'React'} className={'react'} />
							<SiNodedotjs title={'Node.js'} className={'node'} />
							<SiPython title={'Python'} className={'python'} />
						</Box>
						<button type={'button'} className={'back-to-top'} onClick={backToTop}>
							{t('footer.backToTop')}
							<span className={'circle'}>
								<HiArrowUp />
							</span>
						</button>
					</Box>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Footer;
