import React, { useRef } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next/pages';
import { Box, Stack } from '@mui/material';
import { motion, useReducedMotion, useScroll } from 'motion/react';
import { LuArrowUpRight, LuBadgeCheck, LuLanguages, LuTrendingUp } from 'react-icons/lu';
import RiseCard from '../common/RiseCard';
import devexCertificate from '../../../public/img/about/cert-devex.webp';

const EASE = [0.22, 1, 0.36, 1] as const;
/** KIIP (사회통합프로그램) runs from stage 0 to stage 5; the current stage is 4. */
const KIIP_LEVEL = 4;
const KIIP_STAGES = [0, 1, 2, 3, 4, 5];

/** Certificates and language tests, shown inside the Education section. */
const Certifications = () => {
	const { t } = useTranslation('common');
	const reduceMotion = useReducedMotion();
	const gridRef = useRef<HTMLDivElement>(null);
	// 0 when the card row enters the bottom of the screen, 1 when its top reaches 15% from the top
	const { scrollYProgress } = useScroll({ target: gridRef, offset: ['start end', 'start 0.15'] });

	const card = (index: number) => ({
		initial: { opacity: 0, y: reduceMotion ? 0 : 50 },
		whileInView: { opacity: 1, y: 0 },
		viewport: { once: true, amount: 0.3 },
		transition: { duration: 0.9, ease: EASE, delay: index * 0.12 },
	});

	return (
		<Stack className={'certifications'}>
			<motion.div className={'cert-head'} {...card(0)}>
				<span className={'dot'} />
				<span className={'label'}>{t('about.certs.title')}</span>
				<span className={'line'} />
			</motion.div>

			<Box className={'cert-grid'} ref={gridRef}>
				{/* Devex Academy: the certificate itself, opens full size */}
				<RiseCard className={'cert-card cert-devex'} index={0} total={3} progress={scrollYProgress}>
					<a
						className={'cert-thumb'}
						href={devexCertificate.src}
						target={'_blank'}
						rel={'noopener noreferrer'}
						aria-label={t('about.certs.view')}
					>
						<Image src={devexCertificate} alt={t('about.certs.devexAlt')} fill sizes={'160px'} placeholder={'blur'} />
					</a>
					<Stack className={'cert-body'}>
						<span className={'cert-issuer'}>
							<LuBadgeCheck />
							{t('about.certs.devexIssuer')}
						</span>
						<strong>{t('about.certs.devexTitle')}</strong>
						<small>{t('about.certs.devexProgram')}</small>
						<span className={'cert-id'}>ID · DCFAE-2026-1477-0008</span>
						<a className={'cert-link'} href={devexCertificate.src} target={'_blank'} rel={'noopener noreferrer'}>
							{t('about.certs.view')}
							<LuArrowUpRight />
						</a>
					</Stack>
				</RiseCard>

				{/* IELTS: the score is the hero */}
				<RiseCard className={'cert-card cert-score'} index={1} total={3} progress={scrollYProgress}>
					<span className={'cert-issuer'}>
						<LuLanguages />
						{t('about.certs.ieltsIssuer')}
					</span>
					<span className={'score'}>
						6.5
						<small>{t('about.certs.ieltsOverall')}</small>
					</span>
					<span className={'cert-meta'}>{t('about.certs.ieltsMeta')}</span>
					<span className={'improving'}>
						<LuTrendingUp />
						{t('about.certs.improving')}
					</span>
				</RiseCard>

				{/* KIIP: stage 4 on the 0 – 5 scale */}
				<RiseCard className={'cert-card cert-score'} index={2} total={3} progress={scrollYProgress}>
					<span className={'cert-issuer'}>
						<LuLanguages />
						{t('about.certs.kiipIssuer')}
					</span>
					<span className={'score'}>
						{t('about.certs.kiipLevel')}
						<small>{t('about.certs.kiipScale')}</small>
					</span>
					<span className={'levels'} aria-label={`${KIIP_LEVEL} / ${KIIP_STAGES.length - 1}`}>
						{KIIP_STAGES.map((stage, index) => (
							<span key={stage} className={'level-step'}>
								<motion.i
									className={stage <= KIIP_LEVEL ? 'on' : ''}
									initial={{ scaleY: reduceMotion ? 1 : 0.2 }}
									whileInView={{ scaleY: 1 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, ease: EASE, delay: 0.3 + index * 0.08 }}
								/>
								<small>{stage}</small>
							</span>
						))}
					</span>
					<span className={'cert-meta'}>{t('about.certs.kiipMeta')}</span>
					<span className={'improving'}>
						<LuTrendingUp />
						{t('about.certs.improving')}
					</span>
				</RiseCard>
			</Box>
		</Stack>
	);
};

export default Certifications;
