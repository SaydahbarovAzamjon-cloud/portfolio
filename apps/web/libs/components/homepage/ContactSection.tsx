import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next/pages';
import { useQuery } from '@apollo/client';
import { Stack, Box } from '@mui/material';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import {
	LuArrowUpRight,
	LuBriefcaseBusiness,
	LuDownload,
	LuFileText,
	LuLightbulb,
	LuMail,
	LuMapPin,
	LuUsers,
} from 'react-icons/lu';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { GET_PROFILE } from '../../../apollo/user/query';
import { localize } from '../../utils';
import { Profile } from '../../types/profile/profile';
import { SocialPlatform } from '../../enums/profile.enum';
import { FALLBACK_CONTACT } from '../../fallback';
import DownloadMenu from '../common/DownloadMenu';
import defaultPortrait from '../../../public/img/home/hero-portrait.webp';
import sceneImage from '../../../public/img/home/contact-bg.webp';
import { sectionCount } from '../../config';

const EASE = [0.22, 1, 0.36, 1] as const;

const FEATURES = [
	{ key: 'career', icon: LuBriefcaseBusiness },
	{ key: 'collaborate', icon: LuUsers },
	{ key: 'impact', icon: LuLightbulb },
];

const shortUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

const ContactSection = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const reduceMotion = useReducedMotion();
	const sectionRef = useRef<HTMLElement>(null);

	/** APOLLO REQUESTS **/
	const { data: getProfileData } = useQuery<{ getProfile: Profile }>(GET_PROFILE, {
		fetchPolicy: 'cache-first',
	});
	const profile = getProfileData?.getProfile;
	const portrait = profile?.images?.contactPortrait;
	const country = localize(profile?.location?.country, router.locale) || t('top.country');
	const city = localize(profile?.location?.city, router.locale);
	const email = profile?.contactEmail || FALLBACK_CONTACT.email;
	const github = profile?.socials?.find((social) => social.platform === SocialPlatform.GITHUB);
	const linkedin = profile?.socials?.find((social) => social.platform === SocialPlatform.LINKEDIN);
	const githubUrl = github?.url ?? FALLBACK_CONTACT.github;
	const linkedinUrl = linkedin?.url ?? FALLBACK_CONTACT.linkedin;

	/** SCROLL MOTION: the portrait rises, the city behind drifts slower (depth), the chip floats faster **/
	const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
	const range = reduceMotion ? 0 : 1;
	const portraitY = useTransform(scrollYProgress, [0, 0.6], [70 * range, 0]);
	const chipY = useTransform(scrollYProgress, [0, 1], [90 * range, -90 * range]);
	const sceneY = useTransform(scrollYProgress, [0, 1], [-40 * range, 40 * range]);
	const sceneScale = useTransform(scrollYProgress, [0, 0.7], [1 + 0.08 * range, 1]);

	const reveal = (delay: number, y: number = 30) => ({
		initial: { opacity: 0, y: reduceMotion ? 0 : y },
		whileInView: { opacity: 1, y: 0 },
		viewport: { once: true, amount: 0.3 },
		transition: { duration: 0.9, ease: EASE, delay },
	});

	const links = [
		{
			key: 'email',
			icon: <LuMail />,
			tone: 'orange',
			label: t('home.contact.email'),
			value: email,
			href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`,
		},
		{
			key: 'github',
			icon: <FaGithub />,
			tone: 'plain',
			label: 'GitHub',
			value: github?.handle ?? shortUrl(githubUrl),
			href: githubUrl,
		},
		{
			key: 'linkedin',
			icon: <FaLinkedin />,
			tone: 'linkedin',
			label: 'LinkedIn',
			value: linkedin?.handle ?? shortUrl(linkedinUrl),
			href: linkedinUrl,
		},
	];

	return (
		<Stack component={'section'} ref={sectionRef} id={'contact-preview'} className={'contact-preview'}>
			<Box className={'cta-panel'}>
				<svg className={'cta-arc'} viewBox={'0 0 1900 520'} preserveAspectRatio={'none'} aria-hidden={'true'}>
					<path d={'M 900 520 C 980 250, 1200 40, 1500 0'} />
					<path d={'M 1580 -40 C 1700 -10, 1790 50, 1840 90'} />
				</svg>
				<span className={'cta-dot dot-1'} aria-hidden={'true'} />
				<span className={'cta-dot dot-2'} aria-hidden={'true'} />

				{/* left: heading + buttons */}
				<Stack className={'cta-content'}>
					<motion.div className={'eyebrow'} {...reveal(0, 20)}>
						<span className={'dot'} />
						<span className={'label'}>{t('home.contact.eyebrow')}</span>
						<span className={'line'} />
						<span className={'count'}>{sectionCount('contact')}</span>
					</motion.div>

					<motion.h2
						className={'title'}
						initial={'hidden'}
						whileInView={'show'}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
					>
						{[t('home.contact.title1'), t('home.contact.title2')].map((line, index) => (
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
						{t('home.contact.text')}
					</motion.p>

					<motion.div className={'buttons'} {...reveal(0.45, 20)}>
						<Link href={'/contact'} className={'button button-dark'}>
							{t('home.contact.touch')}
							<LuArrowUpRight />
						</Link>
						<DownloadMenu resume={profile?.resume} portfolio={profile?.portfolio} placement={'top'}>
							<span className={'button button-outline'}>
								{t('home.contact.download')}
								<LuDownload />
							</span>
						</DownloadMenu>
					</motion.div>
				</Stack>

				{/* middle: what I am open to */}
				<Stack className={'cta-features'}>
					{FEATURES.map((feature, index) => {
						const Icon = feature.icon;
						return (
							<motion.div
								key={feature.key}
								className={'feature'}
								initial={{ opacity: 0, x: reduceMotion ? 0 : -30 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true, amount: 0.5 }}
								transition={{ duration: 0.8, ease: EASE, delay: 0.3 + index * 0.12 }}
							>
								<span className={'icon'}>
									<Icon />
								</span>
								<span className={'feature-text'}>
									<strong>{t(`home.contact.${feature.key}Title`)}</strong>
									<small>{t(`home.contact.${feature.key}Text`)}</small>
								</span>
							</motion.div>
						);
					})}
				</Stack>

				{/* right: portrait in front of Seoul at sunset */}
				<Box className={'cta-visual'}>
					<motion.div className={'scene'} style={{ y: sceneY, scale: sceneScale }} aria-hidden={'true'}>
						<Image src={sceneImage} alt={''} fill sizes={'(max-width: 1024px) 100vw, 45vw'} placeholder={'blur'} />
					</motion.div>

					<motion.div className={'portrait'} style={{ y: portraitY }}>
						{portrait?.url ? (
							<Image
								src={portrait.url}
								alt={profile?.name ?? ''}
								fill
								sizes={'(max-width: 1024px) 80vw, 30vw'}
								placeholder={portrait.blurDataUrl ? 'blur' : 'empty'}
								blurDataURL={portrait.blurDataUrl ?? undefined}
							/>
						) : (
							<Image
								src={defaultPortrait}
								alt={profile?.name ?? 'Azamjon'}
								fill
								sizes={'(max-width: 1024px) 80vw, 30vw'}
								placeholder={'blur'}
							/>
						)}
					</motion.div>

					<motion.div className={'location-chip'} style={{ y: chipY }}>
						<LuMapPin className={'pin'} />
						<span>
							<small>{t('home.contact.basedIn')}</small>
							<strong>{city ? `${country}, ${city}` : country}</strong>
						</span>
					</motion.div>
				</Box>
			</Box>

			{/* bottom: every way to reach me */}
			<Box className={'contact-bar'}>
				{links.map((link, index) => (
					<motion.a
						key={link.key}
						href={link.href}
						target={'_blank'}
						rel={'noopener noreferrer'}
						className={'contact-link'}
						{...reveal(0.1 + index * 0.08, 20)}
					>
						<span className={`link-icon ${link.tone}`}>{link.icon}</span>
						<span className={'link-text'}>
							<strong>{link.label}</strong>
							<small>{link.value}</small>
						</span>
						<LuArrowUpRight className={'link-arrow'} />
					</motion.a>
				))}
				<motion.div className={'contact-link resume-link'} {...reveal(0.34, 20)}>
					<DownloadMenu resume={profile?.resume} portfolio={profile?.portfolio} placement={'top'}>
						<span className={'resume-trigger'}>
							<span className={'link-icon orange'}>
								<LuFileText />
							</span>
							<span className={'link-text'}>
								<strong>{t('home.contact.resume')}</strong>
								<small>{t('home.contact.resumeText')}</small>
							</span>
							<LuArrowUpRight className={'link-arrow'} />
						</span>
					</DownloadMenu>
				</motion.div>
			</Box>
		</Stack>
	);
};

export default ContactSection;
