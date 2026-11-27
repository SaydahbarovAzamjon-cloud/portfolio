import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next/pages';
import { useQuery } from '@apollo/client';
import { Stack, Box } from '@mui/material';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { LuArrowUpRight, LuCodeXml, LuDownload, LuGraduationCap, LuMapPin } from 'react-icons/lu';
import { GET_EDUCATIONS, GET_PROFILE } from '../../../apollo/user/query';
import { dunePath, localize } from '../../utils';
import { pageCount } from '../../config';
import { Profile } from '../../types/profile/profile';
import { Education } from '../../types/education/education';
import { DegreeType, EducationStatus } from '../../enums/education.enum';
import { FALLBACK_EDUCATION } from '../../fallback';
import DownloadMenu from '../common/DownloadMenu';
import defaultPortrait from '../../../public/img/about/about-hero-portrait.webp';

const EASE = [0.22, 1, 0.36, 1] as const;
const ROLE_KEYS = ['role1', 'role2', 'role3', 'role4'];

const HILL_FAR = dunePath(
	70,
	[
		[26, 2, 0.6],
		[10, 5, 2.1],
	],
	200,
);
const HILL_NEAR = dunePath(
	128,
	[
		[20, 3, 1.4],
		[8, 7, 0.3],
	],
	200,
);

const AboutHero = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const reduceMotion = useReducedMotion();
	const sectionRef = useRef<HTMLElement>(null);

	/** APOLLO REQUESTS **/
	const { data: getProfileData } = useQuery<{ getProfile: Profile }>(GET_PROFILE, {
		fetchPolicy: 'cache-first',
	});
	const { data: getEducationsData } = useQuery<{ getEducations: Education[] }>(GET_EDUCATIONS, {
		fetchPolicy: 'cache-first',
	});
	const profile = getProfileData?.getProfile;
	const loadedEducations = getEducationsData?.getEducations ?? [];
	const educations = loadedEducations.length ? loadedEducations : FALLBACK_EDUCATION;
	// the degree in progress (the master's), otherwise the first one
	const education = educations.find((item) => item.status === EducationStatus.IN_PROGRESS) ?? educations[0];
	const school = education ? localize(education.institution, router.locale) : t('about.hero.school');
	const bachelor = educations.find((item) => item.degree === DegreeType.BACHELOR);
	// "Master's, Financial Management" / "재무관리 석사"
	const degree = education
		? t('about.hero.masterOf', { major: localize(education.major ?? education.program, router.locale) })
		: t('about.hero.degree');
	const country = localize(profile?.location?.country, router.locale) || t('top.country');
	const city = localize(profile?.location?.city, router.locale);
	const stat = profile?.manualStats?.[0];

	/** SCROLL MOTION: city behind drifts slowest, the portrait a little, the cards fastest (depth) **/
	const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
	const range = reduceMotion ? 0 : 1;
	const sceneY = useTransform(scrollYProgress, [0, 1], [0, 40 * range]);
	const portraitY = useTransform(scrollYProgress, [0, 1], [0, 30 * range]);
	const cardsY = useTransform(scrollYProgress, [0, 1], [0, -70 * range]);
	const hillsY = useTransform(scrollYProgress, [0, 1], [0, 40 * range]);

	const rise = (delay: number, y: number = 30) => ({
		initial: { opacity: 0, y: reduceMotion ? 0 : y },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.9, ease: EASE, delay },
	});

	return (
		<Stack component={'section'} ref={sectionRef} className={'about-hero'}>
			<svg className={'about-hero-arcs'} viewBox={'0 0 1983 793'} preserveAspectRatio={'none'} aria-hidden={'true'}>
				<path d={'M 980 620 C 1060 300, 1300 110, 1700 40'} />
				<path d={'M 1380 160 C 1500 60, 1700 20, 1890 40'} />
				<path d={'M 1800 380 C 1880 430, 1940 470, 1960 560'} />
			</svg>
			<span className={'arc-dot dot-1'} aria-hidden={'true'} />
			<span className={'arc-dot dot-2'} aria-hidden={'true'} />
			<span className={'arc-dot dot-3'} aria-hidden={'true'} />

			{/* hills along the bottom, drifting slowly like the footer dunes */}
			<motion.svg
				className={'about-hills'}
				viewBox={'0 0 2100 200'}
				preserveAspectRatio={'none'}
				style={{ y: hillsY }}
				aria-hidden={'true'}
			>
				<path className={'dune hill-far'} d={HILL_FAR} />
				<path className={'dune hill-near'} d={HILL_NEAR} />
			</motion.svg>

			<Stack className={'about-hero-main'}>
				{/* left: heading */}
				<Stack className={'hero-content'}>
					<motion.div className={'eyebrow'} {...rise(0.1, 20)}>
						<span className={'dot'} />
						<span className={'label'}>{t('about.hero.eyebrow')}</span>
						<span className={'line'} />
						<span className={'count'}>{pageCount('about')}</span>
					</motion.div>

					<motion.h1
						className={'title'}
						initial={'hidden'}
						animate={'show'}
						transition={{ staggerChildren: 0.14, delayChildren: 0.2 }}
					>
						{[t('about.hero.title1'), t('about.hero.title2')].map((line, index) => (
							<span key={line} className={'title-mask'}>
								<motion.span
									className={`title-line ${index === 1 ? 'accent' : ''}`}
									variants={{ hidden: { y: reduceMotion ? '0%' : '105%' }, show: { y: '0%' } }}
									transition={{ duration: 1.1, ease: EASE }}
								>
									{line}
								</motion.span>
							</span>
						))}
					</motion.h1>

					<motion.p className={'text'} {...rise(0.55)}>
						{t('about.hero.text')}
					</motion.p>

					<motion.div className={'buttons'} {...rise(0.7, 20)}>
						<Link href={'/experience'} className={'button button-dark'}>
							{t('about.hero.journey')}
							<LuArrowUpRight />
						</Link>
						<DownloadMenu resume={profile?.resume} portfolio={profile?.portfolio} placement={'top'}>
							<span className={'button button-outline'}>
								{t('about.hero.download')}
								<LuDownload />
							</span>
						</DownloadMenu>
					</motion.div>
				</Stack>

				{/* right: a warm glow with soft rings and waves behind the portrait */}
				<Box className={'hero-visual'}>
					<motion.div
						className={'backdrop'}
						initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.85 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
						aria-hidden={'true'}
					>
						<motion.span className={'halo'} style={{ y: sceneY }} />
						<span className={'ring ring-1'} />
						<span className={'ring ring-2'} />
						<span className={'ring ring-3'} />
					</motion.div>
					<svg className={'side-waves'} viewBox={'0 0 1000 600'} preserveAspectRatio={'none'} aria-hidden={'true'}>
						<path d={'M 0 330 C 120 300, 220 330, 300 400 C 360 450, 420 470, 520 480 L 520 600 L 0 600 Z'} />
						<path d={'M 1000 260 C 880 270, 800 330, 740 400 C 690 460, 620 490, 560 500 L 1000 600 Z'} />
						<path d={'M 0 450 C 140 420, 260 450, 360 520 L 360 600 L 0 600 Z'} />
						<path d={'M 1000 380 C 900 400, 830 450, 780 520 L 780 600 L 1000 600 Z'} />
					</svg>

					<motion.div className={'portrait'} style={{ y: portraitY }}>
						<motion.div
							className={'portrait-inner'}
							initial={{ opacity: 0, y: reduceMotion ? 0 : 60 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}
						>
							<Image
								src={defaultPortrait}
								alt={profile?.name ?? 'Azamjon'}
								fill
								priority
								sizes={'(max-width: 1024px) 80vw, 34vw'}
								placeholder={'blur'}
							/>
						</motion.div>
					</motion.div>

					{/* top right: script place name + roles */}
					<motion.div className={'roles'} {...rise(0.9, 20)}>
						<span className={'script'}>{t('about.hero.script')}</span>
						<svg className={'script-arrow'} viewBox={'0 0 60 70'} aria-hidden={'true'}>
							<path d={'M 50 6 C 30 20, 20 40, 14 62 M 14 62 L 6 50 M 14 62 L 24 54'} />
						</svg>
						<ul>
							{ROLE_KEYS.map((key) => (
								<li key={key}>{t(`about.hero.${key}`)}</li>
							))}
						</ul>
						<span className={'roles-line'} />
					</motion.div>

					{/* floating info cards */}
					<motion.div className={'info-cards'} style={{ y: cardsY }}>
						<motion.div className={'info-card'} {...rise(1, 24)}>
							<span className={'icon'}>
								<LuGraduationCap />
							</span>
							<span className={'info-text'}>
								<strong>{school}</strong>
								<small>{degree}</small>
							</span>
						</motion.div>
						{bachelor && (
							<motion.div className={'info-card'} {...rise(1.12, 24)}>
								<span className={'icon'}>
									<LuGraduationCap />
								</span>
								<span className={'info-text'}>
									<strong>{localize(bachelor.institution, router.locale)}</strong>
									<small>{t('about.hero.bachelorDegree')}</small>
								</span>
							</motion.div>
						)}
					</motion.div>

					{/* right side: experience and location (two cards on each side of the photo) */}
					<motion.div className={'info-cards right'} style={{ y: cardsY }}>
						<motion.div className={'info-card'} {...rise(1.24, 24)}>
							<span className={'icon'}>
								<LuCodeXml />
							</span>
							<span className={'info-text'}>
								<strong>{stat ? stat.value : t('about.hero.expValue')}</strong>
								<small>{stat ? localize(stat.label, router.locale) : t('about.hero.expLabel')}</small>
							</span>
						</motion.div>
						<motion.div className={'based-card'} {...rise(1.36, 24)}>
							<span className={'icon'}>
								<LuMapPin />
							</span>
							<span className={'info-text'}>
								<small>{t('about.hero.basedIn')}</small>
								<strong>{city ? `${city}, ${country}` : country}</strong>
							</span>
						</motion.div>
					</motion.div>
				</Box>
			</Stack>
		</Stack>
	);
};

export default AboutHero;
