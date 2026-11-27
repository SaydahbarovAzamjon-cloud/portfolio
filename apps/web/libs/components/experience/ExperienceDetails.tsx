import React, { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import { useTranslation } from 'next-i18next/pages';
import { Stack, Box } from '@mui/material';
import { motion, useReducedMotion, useScroll } from 'motion/react';
import { IconType } from 'react-icons';
import { LuArrowUpRight, LuCalendarDays, LuCar, LuLayers, LuShoppingCart, LuUtensils, LuWrench } from 'react-icons/lu';
import { localize, formatMonth } from '../../utils';
import { getSkillBrand } from '../../skillIcons';
import useExperiences from '../../hooks/useExperiences';
import useDuration from '../../hooks/useDuration';
import ScrollRise from '../common/ScrollRise';
import ScrollRevealText from '../common/ScrollRevealText';
import RiseCard from '../common/RiseCard';
import itcGlobalImage from '../../../public/img/experience/itc-global.webp';
import ngroupImage from '../../../public/img/experience/ngroup.webp';

const EASE = [0.22, 1, 0.36, 1] as const;

/** How many responsibilities show before "show all". */
const VISIBLE = 4;

/** Per-company look and the projects built there (names from the CV; text in experience.details.project_<key>). */
const COMPANIES: Record<
	string,
	{ image: StaticImageData; logo?: IconType; projects: { key: string; name: string; icon: IconType }[] }
> = {
	'ITC Global': {
		image: itcGlobalImage,
		logo: LuLayers,
		projects: [{ key: 'gadgetstore', name: 'GadgetStore', icon: LuShoppingCart }],
	},
	NGroup: {
		image: ngroupImage,
		projects: [
			{ key: 'fixora', name: 'Fixora', icon: LuWrench },
			{ key: 'carvia', name: 'CarVia', icon: LuCar },
			{ key: 'foodai', name: 'FoodAI', icon: LuUtensils },
		],
	},
};

const ExperienceDetails = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const experiences = useExperiences();
	const duration = useDuration();
	const gridRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({ target: gridRef, offset: ['start end', 'start 0.3'] });
	const reduceMotion = useReducedMotion();

	/** SCROLL MOTION: inner text arrives line by line once the card is on screen **/
	const reveal = (delay: number, from: { y?: number; x?: number; scale?: number } = { y: 18 }) => ({
		initial: reduceMotion ? false : { opacity: 0, filter: 'blur(6px)', ...from },
		whileInView: { opacity: 1, filter: 'blur(0px)', y: 0, x: 0, scale: 1 },
		viewport: { once: true, amount: 0.6 },
		transition: { duration: 0.7, ease: EASE, delay },
	});
	// a block title: the text slides in, the orange bar under it draws itself
	const blockTitle = (text: string) => (
		<motion.span className={'block-title'} {...reveal(0, { x: -16 })}>
			{text}
			<motion.i
				className={'title-bar'}
				initial={reduceMotion ? false : { scaleX: 0 }}
				whileInView={{ scaleX: 1 }}
				viewport={{ once: true, amount: 0.6 }}
				transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
			/>
		</motion.span>
	);

	// which cards have their full list of responsibilities open
	const [expanded, setExpanded] = useState<Record<string, boolean>>({});

	return (
		<Stack component={'section'} id={'experience-details'} className={'experience-details'}>
			<Stack className={'section-head'}>
				<Stack>
					<ScrollRise className={'eyebrow'} order={0}>
						<span className={'label'}>{t('experience.details.eyebrow')}</span>
						<span className={'line'} />
					</ScrollRise>
					<ScrollRise order={1}>
						<h2 className={'title'}>
							{t('experience.details.title1')} <span className={'accent'}>{t('experience.details.title2')}</span>
						</h2>
					</ScrollRise>
				</Stack>
				<ScrollRise order={2}>
					<ScrollRevealText className={'head-text'} text={t('experience.details.intro')} />
				</ScrollRise>
			</Stack>

			<Box className={'details-grid'} ref={gridRef}>
				{experiences.map((experience, index) => {
					const company = COMPANIES[experience.company];
					const Logo = company?.logo;
					const isOpen = expanded[experience._id] ?? false;
					const items = isOpen ? experience.responsibilities : experience.responsibilities.slice(0, VISIBLE);
					const hidden = experience.responsibilities.length - VISIBLE;

					return (
						<RiseCard
							key={experience._id}
							className={'role-card'}
							index={index}
							total={experiences.length}
							progress={scrollYProgress}
						>
							<Stack className={'role-head'}>
								<span className={`company-logo ${Logo ? 'outline' : ''}`}>
									{Logo ? <Logo /> : experience.company.charAt(0)}
								</span>
								<span className={'company'}>
									<strong>{experience.company}</strong>
									<small>{localize(experience.role, router.locale)}</small>
								</span>
								<span className={'role-dates'}>
									<span className={'date-pill'}>
										<LuCalendarDays />
										{formatMonth(experience.startDate, router.locale)} –{' '}
										{experience.endDate ? formatMonth(experience.endDate, router.locale) : t('experience.present')}
									</span>
									<span className={'duration-pill'}>{duration(experience.startDate, experience.endDate)}</span>
								</span>
							</Stack>

							<Box className={`role-body ${company ? '' : 'no-photo'}`}>
								{company && (
									<span className={'role-photo'}>
										<Image src={company.image} alt={experience.company} fill sizes={'(max-width: 768px) 90vw, 280px'} />
									</span>
								)}

								<Stack className={'role-content'}>
									{blockTitle(t('experience.details.responsibilities'))}
									<ul className={'responsibilities'}>
										{items.map((item, itemIndex) => (
											<motion.li key={itemIndex} {...reveal(0.1 + (itemIndex % VISIBLE) * 0.09)}>
												<i className={'dot'} />
												{localize(item, router.locale)}
											</motion.li>
										))}
									</ul>
									{hidden > 0 && (
										<button
											type={'button'}
											className={'show-more'}
											onClick={() => setExpanded((prev) => ({ ...prev, [experience._id]: !isOpen }))}
										>
											{isOpen ? t('experience.details.showLess') : t('experience.details.showMore', { count: hidden })}
										</button>
									)}

									{company && (
										<>
											{blockTitle(
												t(
													company.projects.length > 1
														? 'experience.details.mainProjects'
														: 'experience.details.mainProject',
												),
											)}
											<Box className={`project-tiles ${company.projects.length > 1 ? 'many' : ''}`}>
												{company.projects.map((project, projectIndex) => {
													const Icon = project.icon;
													return (
														<motion.div
															key={project.key}
															className={'project-tile-wrap'}
															{...reveal(0.1 + projectIndex * 0.12, { y: 24, scale: 0.94 })}
														>
															<Link href={'/projects'} className={'project-tile'}>
																<span className={'project-icon'}>
																	<Icon />
																</span>
																<span className={'project-text'}>
																	<strong>{project.name}</strong>
																	<small>{t(`experience.details.project_${project.key}`)}</small>
																</span>
																{company.projects.length === 1 && <LuArrowUpRight className={'project-arrow'} />}
															</Link>
														</motion.div>
													);
												})}
											</Box>
										</>
									)}
								</Stack>
							</Box>

							<Stack className={'role-stack'}>
								{blockTitle(t('experience.details.stack'))}
								<Box className={'stack-icons'}>
									{(experience.skills ?? []).map((skill, skillIndex) => {
										const brand = getSkillBrand(skill.icon, skill.slug || skill.name);
										const Icon = brand.icon;
										return (
											<motion.span
												key={skill._id}
												className={'stack-icon'}
												title={skill.name}
												initial={reduceMotion ? false : { opacity: 0, scale: 0.4, rotate: -20 }}
												whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
												viewport={{ once: true, amount: 0.8 }}
												transition={{ type: 'spring', stiffness: 260, damping: 18, delay: skillIndex * 0.05 }}
											>
												<Icon style={{ color: brand.color }} />
											</motion.span>
										);
									})}
								</Box>
							</Stack>
						</RiseCard>
					);
				})}
			</Box>
		</Stack>
	);
};

export default ExperienceDetails;
