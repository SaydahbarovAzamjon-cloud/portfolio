import React, { useRef } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next/pages';
import { Stack } from '@mui/material';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { LuArrowRight } from 'react-icons/lu';
import ScrollRevealText from '../common/ScrollRevealText';
import photo from '../../../public/img/about/who-i-am.webp';
import ScrollRise from '../common/ScrollRise';

const EASE = [0.22, 1, 0.36, 1] as const;
/** The photo is an arch (round top, soft bottom corners); the reveal clip keeps the same shape. */
const ARCH_OPEN = 'inset(0% 0% 0% 0% round 999px 999px 36px 36px)';
const ARCH_CLOSED = 'inset(100% 0% 0% 0% round 999px 999px 36px 36px)';

const WhoIAm = () => {
	const { t } = useTranslation('common');
	const reduceMotion = useReducedMotion();
	const sectionRef = useRef<HTMLElement>(null);

	/** SCROLL MOTION: the photo slowly zooms out while the section passes **/
	const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
	const range = reduceMotion ? 0 : 1;
	const photoScale = useTransform(scrollYProgress, [0, 0.6], [1 + 0.12 * range, 1]);
	const chipY = useTransform(scrollYProgress, [0, 1], [60 * range, -60 * range]);

	const reveal = (delay: number, y: number = 30) => ({
		initial: { opacity: 0, y: reduceMotion ? 0 : y },
		whileInView: { opacity: 1, y: 0 },
		viewport: { once: true, amount: 0.3 },
		transition: { duration: 0.9, ease: EASE, delay },
	});

	return (
		<Stack component={'section'} ref={sectionRef} id={'who-i-am'} className={'who-i-am'}>
			<Stack className={'who-main'}>
				{/* left: photo */}
				<Stack className={'who-left'}>
					{/* the wrapper watches the viewport: a fully clipped photo never counts as visible */}
					<motion.div
						className={'who-visual'}
						initial={'hidden'}
						whileInView={'show'}
						viewport={{ once: true, amount: 0.3 }}
					>
						<motion.span
							className={'arch-outline'}
							aria-hidden={'true'}
							variants={{ hidden: { opacity: 0, x: 0, y: 0 }, show: { opacity: 1, x: 18, y: 18 } }}
							transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}
						/>
						<span className={'arch-glow'} aria-hidden={'true'} />
						<motion.div
							className={'photo-frame'}
							variants={{
								hidden: { clipPath: reduceMotion ? ARCH_OPEN : ARCH_CLOSED },
								show: { clipPath: ARCH_OPEN },
							}}
							transition={{ duration: 1.3, ease: EASE }}
						>
							<motion.div className={'photo'} style={{ scale: photoScale }}>
								<Image
									src={photo}
									alt={t('about.who.photoAlt')}
									fill
									sizes={'(max-width: 1024px) 90vw, 36vw'}
									placeholder={'blur'}
								/>
							</motion.div>
							<span className={'photo-shade'} />
						</motion.div>

						<motion.div className={'photo-chip'} style={{ y: chipY }}>
							<span className={'chip-dot'} />
							{t('about.who.chip')}
						</motion.div>
					</motion.div>
				</Stack>

				{/* right: story and what's next */}
				<Stack className={'who-content'}>
					<ScrollRise className={'eyebrow'} order={0}>
						<span className={'dot'} />
						<span className={'label'}>{t('about.who.eyebrow')}</span>
						<span className={'line'} />
					</ScrollRise>

					<ScrollRise order={1}>
						<motion.h2
							className={'title'}
							initial={'hidden'}
							whileInView={'show'}
							viewport={{ once: true, amount: 0.5 }}
							transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
						>
							{[t('about.who.title1'), t('about.who.title2')].map((line, index) => (
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
					</ScrollRise>

					<ScrollRise order={2}>
						<ScrollRevealText className={'story'} text={t('about.who.story1')} />
					</ScrollRise>
					<ScrollRise order={3}>
						<ScrollRevealText className={'story'} text={t('about.who.story2')} />
					</ScrollRise>

					<motion.div className={'next'} {...reveal(0.2, 24)}>
						<span className={'next-label'}>
							{t('about.who.nextTitle')}
							<LuArrowRight />
						</span>
						<ScrollRevealText text={t('about.who.nextText')} dim={0.3} />
					</motion.div>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default WhoIAm;
