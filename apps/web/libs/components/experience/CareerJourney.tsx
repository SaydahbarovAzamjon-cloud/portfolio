import React, { useRef } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next/pages';
import Image from 'next/image';
import { Stack, Box } from '@mui/material';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { LuBuilding2, LuCalendarDays, LuCodeXml, LuLayers, LuShoppingBag } from 'react-icons/lu';
import { localize, formatMonth } from '../../utils';
import useDuration from '../../hooks/useDuration';
import useExperiences from '../../hooks/useExperiences';
import ScrollRise from '../common/ScrollRise';
import ScrollRevealText from '../common/ScrollRevealText';
import mountains from '../../../public/img/experience-hero-bg.webp';
import gadgetStoreHome from '../../../public/img/projects/gadget-store-home.webp';

const EASE = [0.22, 1, 0.36, 1] as const;

/** The wavy road (viewBox 1000 x 160); pins sit at 28% (lower) and 72% (higher). */
const ROAD =
	'M 0 140 C 120 130, 200 100, 280 100 C 380 100, 440 120, 520 110 C 600 98, 660 70, 720 68 C 820 64, 900 40, 1000 30';
const PIN_X = [28, 72];
const PIN_Y = [62, 42];

const CareerJourney = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const reduceMotion = useReducedMotion();
	const experiences = useExperiences();
	const duration = useDuration();
	const roadRef = useRef<HTMLDivElement>(null);

	/** SCROLL MOTION: the road draws itself left to right; each pin and card arrives when the road reaches it **/
	const { scrollYProgress } = useScroll({ target: roadRef, offset: ['start 0.95', 'start 0.35'] });
	const roadLength = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 1 : 0, 1]);

	return (
		<Stack component={'section'} id={'career-journey'} className={'career-journey'}>
			<Stack className={'section-head'}>
				<Stack>
					<ScrollRise className={'eyebrow'} order={0}>
						<span className={'label'}>{t('experience.journey.eyebrow')}</span>
						<span className={'line'} />
					</ScrollRise>
					<ScrollRise order={1}>
						<h2 className={'title'}>
							{t('experience.journey.title1')} <span className={'accent'}>{t('experience.journey.title2')}</span>
						</h2>
					</ScrollRise>
				</Stack>
				<ScrollRise order={2}>
					<ScrollRevealText className={'head-text'} text={t('experience.journey.intro')} />
				</ScrollRise>
			</Stack>

			{/* misty mountains behind the road, drifting slowly */}
			<Box className={'journey-bg'} aria-hidden={'true'}>
				<Image src={mountains} alt={''} fill sizes={'100vw'} placeholder={'blur'} />
			</Box>

			<Box className={'journey-road'} ref={roadRef}>
				<svg className={'road-line'} viewBox={'0 0 1000 160'} preserveAspectRatio={'none'} aria-hidden={'true'}>
					<path className={'road-base'} d={ROAD} />
					<motion.path className={'road-fill'} d={ROAD} style={{ pathLength: roadLength }} />
				</svg>

				{experiences.slice(0, 2).map((experience, index) => {
					return (
						<React.Fragment key={experience._id}>
							<motion.div
								className={`road-card card-${index}`}
								style={{ left: `${PIN_X[index]}%` }}
								initial={{ opacity: 0, y: reduceMotion ? 0 : 40 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.6 }}
								transition={{ duration: 0.9, ease: EASE, delay: 0.2 + index * 0.35 }}
							>
								<span className={'card-logo'}>
									<LuBuilding2 />
								</span>
								<span className={'card-body'}>
									<strong>{experience.company}</strong>
									<span className={'role'}>{localize(experience.role, router.locale)}</span>
									<span className={'card-meta'}>
										<LuCalendarDays />
										{formatMonth(experience.startDate, router.locale)} –{' '}
										{experience.endDate ? formatMonth(experience.endDate, router.locale) : t('experience.present')}
										<span className={'duration'}>{duration(experience.startDate, experience.endDate)}</span>
									</span>
								</span>
								{index === 0 ? (
									// ITC Global: the Gadget Store project on a small laptop, with a shopping bag
									<span className={'card-art laptop-art'}>
										<span className={'laptop-screen'}>
											<Image src={gadgetStoreHome} alt={''} fill sizes={'200px'} />
										</span>
										<span className={'laptop-base'} />
										<span className={'bag-tile'}>
											<LuShoppingBag />
										</span>
									</span>
								) : (
									// NGroup: a glossy AI chip on stacked plates
									<span className={'card-art chip-art'}>
										<span className={'chip-plate plate-1'} />
										<span className={'chip-plate plate-2'} />
										<span className={'chip-face'}>
											<b>{'AI'}</b>
										</span>
									</span>
								)}
							</motion.div>
							<span className={'road-pin'} style={{ left: `${PIN_X[index]}%`, top: `${PIN_Y[index]}%` }}>
								<i />
								<b>{String(index + 1).padStart(2, '0')}</b>
							</span>
						</React.Fragment>
					);
				})}
			</Box>

			<ScrollRise className={'journey-stats'} order={1}>
				<span className={'journey-stat'}>
					<span className={'icon'}>
						<LuCalendarDays />
					</span>
					<span>
						<strong>{t('experience.hero.yearsValue')}</strong>
						<small>{t('experience.hero.yearsLabel')}</small>
					</span>
				</span>
				<span className={'journey-stat'}>
					<span className={'icon'}>
						<LuLayers />
					</span>
					<strong>{t('experience.hero.companies', { count: experiences.length })}</strong>
				</span>
				<span className={'journey-stat'}>
					<span className={'icon'}>
						<LuCodeXml />
					</span>
					<strong>{t('experience.hero.projects')}</strong>
				</span>
			</ScrollRise>
		</Stack>
	);
};

export default CareerJourney;
