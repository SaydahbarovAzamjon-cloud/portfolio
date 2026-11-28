import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next/pages';
import { Stack, Box } from '@mui/material';
import { motion, useReducedMotion } from 'motion/react';
import { IconType } from 'react-icons';
import {
	LuArrowRight,
	LuBadgeCheck,
	LuBell,
	LuBookOpenCheck,
	LuBrainCircuit,
	LuCalendarCheck,
	LuCircleAlert,
	LuCircleCheck,
	LuCircleUser,
	LuClock,
	LuCodeXml,
	LuCreditCard,
	LuDatabase,
	LuFileText,
	LuFlag,
	LuKeyRound,
	LuLayers,
	LuLightbulb,
	LuLink,
	LuLock,
	LuMapPin,
	LuNewspaper,
	LuRadio,
	LuSearch,
	LuStar,
	LuMail,
	LuMessagesSquare,
	LuPuzzle,
	LuSend,
	LuServer,
	LuShieldCheck,
	LuSmartphone,
	LuTarget,
	LuUser,
	LuWrench,
	LuX,
} from 'react-icons/lu';
import ScrollRise from '../common/ScrollRise';
import RichText from '../common/RichText';
import { CodeLink, Heading, useCaseList } from './shared';
import searchShot from '../../../public/img/projects/fixora/search.webp';
import chatShot from '../../../public/img/projects/fixora/chat.webp';
import signinShot from '../../../public/img/projects/fixora/signin.webp';
import technicianShot from '../../../public/img/projects/fixora/technician.webp';
import adminShot from '../../../public/img/projects/fixora/admin.webp';
import mobileShot from '../../../public/img/projects/fixora/mobile.webp';

const EASE = [0.22, 1, 0.36, 1] as const;
const K = 'caseStudy.fixora';

/** Proof in the public repo: each claim links to the file that implements it. */
const REPO = 'https://github.com/SaydahbarovAzamjon-cloud/Fixora';
const CODE = {
	schema: `${REPO}/blob/develop/apps/fixora-api/src/graphql/schema.gql`,
	fallback: `${REPO}/tree/develop/apps/fixora-api/src/components/ai/classification/providers`,
	deposit: `${REPO}/blob/develop/apps/fixora-api/src/components/booking/booking.service.ts#L532`,
	gateway: `${REPO}/blob/develop/apps/fixora-api/src/components/payment/gateways/payment-gateway.factory.ts`,
	score: `${REPO}/blob/develop/apps/fixora-api/src/components/ai/matching/matching-score.ts`,
	socket: `${REPO}/blob/develop/apps/fixora-api/src/socket/socket.gateway.ts`,
	decisions: `${REPO}/blob/develop/docs/DECISIONS.md`,
	runbook: `${REPO}/blob/develop/docs/DEPLOY_RUNBOOK.md`,
};
const DECISION_CODE = [CODE.schema, CODE.fallback, CODE.deposit, CODE.gateway];

const TLDR_ICONS: IconType[] = [LuTarget, LuCircleUser, LuLayers, LuServer];
const ROLE_ICONS: IconType[] = [LuUser, LuWrench, LuShieldCheck];
const STATUS_STEPS = ['pending', 'accepted', 'progress', 'completed'];
const STATUS_ICONS: IconType[] = [LuClock, LuCircleCheck, LuWrench, LuBadgeCheck];
const AI_FIELDS_ICONS: IconType[] = [LuSmartphone, LuLayers, LuPuzzle, LuTarget, LuFileText];
const SCORE = [
	{ key: 'rating', value: 40 },
	{ key: 'jobs', value: 25 },
	{ key: 'reviews', value: 15 },
	{ key: 'activity', value: 10 },
	{ key: 'specialty', value: 10 },
];
const CHANNELS: { key: string; icon: IconType }[] = [
	{ key: 'inapp', icon: LuBell },
	{ key: 'email', icon: LuMail },
	{ key: 'telegram', icon: LuSend },
	{ key: 'push', icon: LuSmartphone },
];
const AUTH_ICONS: IconType[] = [LuKeyRound, LuLink, LuLock, LuShieldCheck];
const DECISION_ICONS: IconType[] = [LuCodeXml, LuBrainCircuit, LuCreditCard, LuPuzzle];
/** Entities around the user (positions in a 300 x 200 box), from the portfolio's data model page. */
const MODEL_NODES: { key: string; icon: IconType; x: number; y: number }[] = [
	{ key: 'device', icon: LuSmartphone, x: 45, y: 35 },
	{ key: 'booking', icon: LuCalendarCheck, x: 150, y: 18 },
	{ key: 'payment', icon: LuCreditCard, x: 255, y: 35 },
	{ key: 'message', icon: LuMessagesSquare, x: 45, y: 165 },
	{ key: 'notification', icon: LuBell, x: 150, y: 182 },
	{ key: 'review', icon: LuStar, x: 255, y: 165 },
];
/** Key features (text in caseStudy.fixora.features: "title|text"). */
const FEATURE_ICONS: IconType[] = [LuMapPin, LuSearch, LuMessagesSquare, LuRadio, LuStar, LuNewspaper];

const FixoraCaseStudy = () => {
	const { t } = useTranslation('common');
	const list = useCaseList(K);
	const reduceMotion = useReducedMotion();
	const tldr = list('tldr');
	const roles = list('roles');
	const aiFields = list('aiFields');
	const authItems = list('auth');
	const decisions = list('decisions');
	const quality = list('quality');
	const challenges = list('challenges');
	const nextSteps = list('nextSteps');

	return (
		<Stack className={'case-body'}>
			{/* TL;DR for recruiters: what, my role, stack, size of the build */}
			<ScrollRise className={'case-card case-tldr'} order={0}>
				{tldr.map((item, index) => {
					const Icon = TLDR_ICONS[index];
					const [title, text] = item.split('|');
					return (
						<span key={title} className={'tldr-item'}>
							<Icon />
							<strong>{title}</strong>
							<RichText as={'span'} text={text} />
						</span>
					);
				})}
			</ScrollRise>

			{/* problem → solution */}
			<Box className={'case-row two'}>
				<ScrollRise className={'case-card problem'} order={0}>
					<Heading icon={LuCircleAlert} text={t(`${K}.problemTitle`)} />
					<RichText text={t(`${K}.problem`)} />
				</ScrollRise>
				<ScrollRise className={'case-card solution'} order={1}>
					<Heading icon={LuLightbulb} text={t(`${K}.solutionTitle`)} />
					<RichText text={t(`${K}.solution`)} />
					<span className={'solution-flow'} aria-hidden={'true'}>
						{[LuUser, LuCalendarCheck, LuMessagesSquare, LuCircleCheck].map((Icon, index) => (
							<React.Fragment key={index}>
								{index > 0 && <LuArrowRight className={'flow-arrow'} />}
								<span className={`flow-dot ${index === 3 ? 'done' : ''}`}>
									<Icon />
								</span>
							</React.Fragment>
						))}
					</span>
				</ScrollRise>
			</Box>

			{/* who uses it */}
			<ScrollRise className={'case-card'} order={0}>
				<Heading icon={LuCircleUser} text={t(`${K}.rolesTitle`)} />
				<Box className={'role-grid'}>
					{roles.map((item, index) => {
						const Icon = ROLE_ICONS[index];
						const [title, text] = item.split('|');
						return (
							<span key={title} className={'role-card'}>
								<span className={'role-icon'}>
									<Icon />
								</span>
								<span>
									<strong>
										<b>{String(index + 1).padStart(2, '0')}</b> {title}
									</strong>
									<RichText as={'span'} text={text} />
								</span>
							</span>
						);
					})}
				</Box>
			</ScrollRise>

			{/* how the data connects: the user in the middle, the booking as the source of truth */}
			<ScrollRise className={'case-card case-model'} order={0}>
				<Box className={'model-diagram'} aria-hidden={'true'}>
					<svg className={'model-lines'} viewBox={'0 0 300 200'} preserveAspectRatio={'none'}>
						{MODEL_NODES.map((node) => (
							<line key={node.key} x1={150} y1={100} x2={node.x} y2={node.y} />
						))}
					</svg>
					<span className={'model-node center'} style={{ left: '50%', top: '50%' }}>
						<LuUser />
						{t(`${K}.model_user`)}
					</span>
					{MODEL_NODES.map((node) => {
						const Icon = node.icon;
						return (
							<span
								key={node.key}
								className={`model-node ${node.key === 'booking' ? 'core' : ''}`}
								style={{ left: `${(node.x / 300) * 100}%`, top: `${(node.y / 200) * 100}%` }}
							>
								<Icon />
								{t(`${K}.model_${node.key}`)}
							</span>
						);
					})}
				</Box>
				<Box className={'model-text'}>
					<Heading icon={LuDatabase} text={t(`${K}.modelTitle`)} />
					<ul className={'dot-list'}>
						{list('model').map((item) => (
							<li key={item}>
								<RichText as={'span'} text={item} />
							</li>
						))}
					</ul>
				</Box>
			</ScrollRise>

			{/* booking & payment lifecycle */}
			<ScrollRise className={'case-card case-lifecycle'} order={0}>
				<Box className={'lifecycle-flow'}>
					<Heading icon={LuCalendarCheck} text={t(`${K}.lifecycleTitle`)} />
					<span className={'status-row'}>
						{STATUS_STEPS.map((step, index) => {
							const Icon = STATUS_ICONS[index];
							return (
								<React.Fragment key={step}>
									{index > 0 && <LuArrowRight className={'flow-arrow'} />}
									<motion.span
										className={`status-pill ${step}`}
										initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true, amount: 0.8 }}
										transition={{ duration: 0.5, ease: EASE, delay: index * 0.15 }}
									>
										<Icon />
										{t(`${K}.status_${step}`)}
									</motion.span>
								</React.Fragment>
							);
						})}
					</span>
					<span className={'status-row branches'}>
						<span className={'status-pill muted'}>
							<LuX />
							{t(`${K}.status_rejected`)}
						</span>
						<span className={'status-pill muted'}>
							<LuX />
							{t(`${K}.status_cancelled`)}
						</span>
					</span>
				</Box>
				<Box className={'lifecycle-payment'}>
					<Heading icon={LuCreditCard} text={t(`${K}.paymentTitle`)} />
					<span className={'payment-row'}>
						<span className={'payment-pill'}>
							<strong>{t(`${K}.deposit`)}</strong>
							<small>{t(`${K}.depositMethods`)}</small>
						</span>
						<span className={'payment-pill'}>
							<strong>{t(`${K}.final`)}</strong>
							<small>{t(`${K}.finalMethods`)}</small>
						</span>
					</span>
					<ul className={'rule-list'}>
						<li>{t(`${K}.ruleDeposit`)}</li>
						<li>{t(`${K}.rulePhone`)}</li>
					</ul>
				</Box>
			</ScrollRise>

			{/* AI matching with Gemini and a safe fallback */}
			<ScrollRise className={'case-card case-ai'} order={0}>
				<Heading icon={LuBrainCircuit} text={t(`${K}.aiTitle`)} />
				<Box className={'ai-grid'}>
					<Box className={'ai-flow'}>
						<span className={'ai-node'}>
							<LuFileText />
							{t(`${K}.aiInput`)}
						</span>
						<LuArrowRight className={'flow-arrow'} />
						<span className={'ai-node primary'}>
							<LuBrainCircuit />
							{'Gemini'}
						</span>
						<LuArrowRight className={'flow-arrow'} />
						<ul className={'ai-fields'}>
							{aiFields.map((field, index) => {
								const Icon = AI_FIELDS_ICONS[index];
								return (
									<li key={field}>
										<Icon />
										{field}
									</li>
								);
							})}
						</ul>
						<span className={'ai-fallback'}>
							<span className={'ai-node muted'}>{t(`${K}.aiDown`)}</span>
							<span className={'dash'} />
							<span className={'ai-node'}>
								<LuPuzzle />
								{t(`${K}.aiRules`)}
							</span>
							<span className={'dash'} />
							<small>{t(`${K}.aiStill`)}</small>
						</span>
						<CodeLink href={CODE.fallback} label={'classification/providers'} />
					</Box>
					<Box className={'ai-score'}>
						<strong>{t(`${K}.scoreTitle`)}</strong>
						{SCORE.map((row, index) => (
							<span key={row.key} className={'score-row'}>
								<small>{t(`${K}.score_${row.key}`)}</small>
								<span className={'score-track'}>
									<motion.span
										className={'score-bar'}
										initial={{ width: reduceMotion ? `${row.value * 2.5}%` : 0 }}
										whileInView={{ width: `${row.value * 2.5}%` }}
										viewport={{ once: true, amount: 0.6 }}
										transition={{ duration: 0.9, ease: EASE, delay: 0.1 + index * 0.1 }}
									/>
								</span>
								<b>{row.value}%</b>
							</span>
						))}
						<CodeLink href={CODE.score} label={'matching-score.ts'} />
						<span className={'ai-note'}>
							<LuCircleAlert />
							{t(`${K}.aiNote`)}
						</span>
					</Box>
					<span className={'case-shot framed'}>
						<Image src={searchShot} alt={t(`${K}.searchAlt`)} sizes={'(max-width: 1024px) 90vw, 30vw'} />
					</span>
				</Box>
			</ScrollRise>

			{/* key features */}
			<ScrollRise className={'case-card'} order={0}>
				<Heading icon={LuBadgeCheck} text={t(`${K}.featuresTitle`)} />
				<Box className={'feature-grid'}>
					{list('features').map((item, index) => {
						const Icon = FEATURE_ICONS[index];
						const [title, text] = item.split('|');
						return (
							<motion.span
								key={title}
								className={'feature-card'}
								initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.5 }}
								transition={{ duration: 0.6, ease: EASE, delay: (index % 3) * 0.1 }}
							>
								<span className={'feature-icon'}>
									<Icon />
								</span>
								<strong>{title}</strong>
								<RichText as={'span'} text={text} />
							</motion.span>
						);
					})}
				</Box>
			</ScrollRise>

			{/* real-time chat + notification channels */}
			<Box className={'case-row two'}>
				<ScrollRise className={'case-card case-realtime'} order={0}>
					<Heading icon={LuMessagesSquare} text={t(`${K}.realtimeTitle`)} />
					<span className={'case-shot framed'}>
						<Image src={chatShot} alt={t(`${K}.chatAlt`)} sizes={'(max-width: 1024px) 90vw, 30vw'} />
					</span>
					<RichText text={t(`${K}.realtime`)} />
					<CodeLink href={CODE.socket} label={'socket.gateway.ts'} />
				</ScrollRise>
				<ScrollRise className={'case-card case-auth'} order={1}>
					<Heading icon={LuShieldCheck} text={t(`${K}.authTitle`)} />
					<Box className={'auth-grid'}>
						<Box className={'auth-tiles'}>
							{authItems.map((item, index) => {
								const Icon = AUTH_ICONS[index];
								return (
									<span key={item} className={'auth-tile'}>
										<Icon />
										{item}
									</span>
								);
							})}
						</Box>
						<span className={'phone-shot'}>
							<Image src={signinShot} alt={t(`${K}.signinAlt`)} sizes={'220px'} />
						</span>
					</Box>
					<span className={'channels'}>
						<strong>{t(`${K}.channelsTitle`)}</strong>
						{CHANNELS.map((channel) => {
							const Icon = channel.icon;
							return (
								<span key={channel.key} className={'channel-chip'}>
									<Icon />
									{t(`${K}.channel_${channel.key}`)}
								</span>
							);
						})}
						<small>{t(`${K}.channelsRetry`)}</small>
					</span>
				</ScrollRise>
			</Box>

			{/* dashboards + the mobile app */}
			<ScrollRise className={'case-card'} order={0}>
				<Heading icon={LuLayers} text={t(`${K}.dashboardsTitle`)} />
				<Box className={'dashboard-grid'}>
					{[
						{ image: technicianShot, label: t(`${K}.dashTechnician`) },
						{ image: adminShot, label: t(`${K}.dashAdmin`) },
						{ image: mobileShot, label: t(`${K}.dashMobile`) },
					].map((shot) => (
						<figure key={shot.label} className={'dashboard-item'}>
							<span className={'case-shot framed'}>
								<Image src={shot.image} alt={shot.label} sizes={'(max-width: 1024px) 90vw, 30vw'} />
							</span>
							<figcaption>{shot.label}</figcaption>
						</figure>
					))}
				</Box>
			</ScrollRise>

			{/* architecture */}
			<ScrollRise className={'case-card case-architecture'} order={0}>
				<Heading icon={LuServer} text={t(`${K}.archTitle`)} />
				<Box className={'arch-flow'}>
					<span className={'arch-node'}>
						<strong>{t(`${K}.archFrontTitle`)}</strong>
						<small>{t(`${K}.archFront`)}</small>
					</span>
					<LuArrowRight className={'flow-arrow'} />
					<span className={'arch-node primary'}>
						<strong>{t(`${K}.archApiTitle`)}</strong>
						<small>{t(`${K}.archApi`)}</small>
					</span>
					<LuArrowRight className={'flow-arrow'} />
					<span className={'arch-node'}>
						<strong>
							<LuDatabase /> {t(`${K}.archDataTitle`)}
						</strong>
						<small>{t(`${K}.archData`)}</small>
					</span>
					<span className={'arch-node batch'}>
						<strong>{t(`${K}.archBatchTitle`)}</strong>
						<ul>
							{list('archBatch').map((job) => (
								<li key={job}>{job}</li>
							))}
						</ul>
					</span>
				</Box>
				<span className={'arch-infra'}>{t(`${K}.archInfra`)}</span>
			</ScrollRise>

			{/* engineering decisions */}
			<ScrollRise className={'case-card'} order={0}>
				<Heading icon={LuBookOpenCheck} text={t(`${K}.decisionsTitle`)} />
				<Box className={'decision-grid'}>
					{decisions.map((item, index) => {
						const Icon = DECISION_ICONS[index];
						const [title, text] = item.split('|');
						return (
							<span key={title} className={'decision-card'}>
								<Icon />
								<strong>{title}</strong>
								<RichText as={'span'} text={text} />
								<CodeLink href={DECISION_CODE[index]} label={t(`${K}.viewCode`)} />
							</span>
						);
					})}
				</Box>
				<span className={'decision-note'}>
					{t(`${K}.decisionsNote`)}
					<CodeLink href={CODE.decisions} label={'DECISIONS.md'} />
				</span>
			</ScrollRise>

			{/* quality strip */}
			<ScrollRise className={'case-card case-quality'} order={0}>
				<Heading icon={LuShieldCheck} text={t(`${K}.qualityTitle`)} />
				{quality.map((item) => (
					<span key={item} className={'quality-item'}>
						<LuCircleCheck />
						{item}
					</span>
				))}
				<span className={'quality-links'}>
					<CodeLink href={CODE.decisions} label={'DECISIONS.md'} />
					<CodeLink href={CODE.runbook} label={'DEPLOY_RUNBOOK.md'} />
				</span>
			</ScrollRise>

			{/* challenges and what comes next */}
			<Box className={'case-row two'}>
				<ScrollRise className={'case-card'} order={0}>
					<Heading icon={LuFlag} text={t(`${K}.challengesTitle`)} />
					<ul className={'dot-list'}>
						{challenges.map((item) => (
							<li key={item}>
								<RichText as={'span'} text={item} />
							</li>
						))}
					</ul>
				</ScrollRise>
				<ScrollRise className={'case-card'} order={1}>
					<Heading icon={LuTarget} text={t(`${K}.nextTitle`)} />
					<ul className={'dot-list'}>
						{nextSteps.map((item) => (
							<li key={item}>
								<RichText as={'span'} text={item} />
							</li>
						))}
					</ul>
				</ScrollRise>
			</Box>
		</Stack>
	);
};

export default FixoraCaseStudy;
