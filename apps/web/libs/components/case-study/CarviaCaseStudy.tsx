import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next/pages';
import { Stack, Box } from '@mui/material';
import { motion, useReducedMotion } from 'motion/react';
import { IconType } from 'react-icons';
import {
	LuArrowRight,
	LuBadgeCheck,
	LuBookOpenCheck,
	LuCamera,
	LuChartColumn,
	LuCircleAlert,
	LuCircleCheck,
	LuCircleUser,
	LuCpu,
	LuDatabase,
	LuFileJson,
	LuFlame,
	LuGauge,
	LuGitCompareArrows,
	LuImage,
	LuLayers,
	LuLightbulb,
	LuListChecks,
	LuScanSearch,
	LuServer,
	LuShieldCheck,
	LuSlidersHorizontal,
	LuTarget,
	LuThermometer,
} from 'react-icons/lu';
import ScrollRise from '../common/ScrollRise';
import RichText from '../common/RichText';
import CountUp from '../common/CountUp';
import { CodeLink, Heading, useCaseList } from './shared';
import resultShot from '../../../public/img/projects/carvia/screen.webp';
import devicesShot from '../../../public/img/projects/carvia/devices.webp';

const EASE = [0.22, 1, 0.36, 1] as const;
const K = 'caseStudy.carvia';

/** Proof in the public repo. */
const REPO = 'https://github.com/SaydahbarovAzamjon-cloud/carvia/blob/main';
const CODE = {
	gate: `${REPO}/backend/services/decision.py`,
	config: `${REPO}/models/decision_config.json`,
	uncertainty: `${REPO}/ml/evaluate_uncertainty.py`,
	audit: `${REPO}/ml/audit_dataset.py`,
	auditReport: `${REPO}/ml/metrics/final_dataset_audit.json`,
	testReport: `${REPO}/ml/metrics/final_test_report.json`,
	train: `${REPO}/ml/train_convnext.py`,
	explain: `${REPO}/ml/pipeline/explain.py`,
	api: `${REPO}/backend/routes/predict.py`,
};

const TLDR_ICONS: IconType[] = [LuTarget, LuCircleUser, LuLayers, LuChartColumn];
const PROBLEM_ICONS: IconType[] = [LuCamera, LuGitCompareArrows, LuGauge, LuServer];
const STEP_ICONS: IconType[] = [LuImage, LuSlidersHorizontal, LuCpu, LuShieldCheck, LuCircleCheck, LuFileJson];
/** Test-set results from ml/metrics/final_test_report.json. */
const RESULTS = [
	{ key: 'top1', value: 71.1, suffix: '%', decimals: 1 },
	{ key: 'top3', value: 83.6, suffix: '%', decimals: 1 },
	{ key: 'top5', value: 88.3, suffix: '%', decimals: 1, highlight: true },
	{ key: 'f1', value: 0.696, decimals: 3 },
];
/** Dataset split from ml/metrics/final_dataset_audit.json. */
const SPLIT = [
	{ key: 'train', value: 3808 },
	{ key: 'val', value: 803 },
	{ key: 'test', value: 855 },
];
const SPLIT_TOTAL = SPLIT.reduce((sum, part) => sum + part.value, 0);
const EXPLAIN_ICONS: IconType[] = [LuFlame, LuListChecks, LuCamera];

/** Per-class test results (ml/metrics/final_test_report.json): the five best and the five hardest classes by F1. */
interface ClassScore {
	name: string;
	f1: number;
	precision: number;
	recall: number;
	support: number;
}
const BEST: ClassScore[] = [
	{ name: 'Kia Sportage', f1: 0.906, precision: 0.857, recall: 0.96, support: 25 },
	{ name: 'Hyundai Tucson', f1: 0.889, precision: 0.923, recall: 0.857, support: 28 },
	{ name: 'Genesis G90', f1: 0.857, precision: 0.789, recall: 0.938, support: 16 },
	{ name: 'Kia Sorento', f1: 0.83, precision: 0.846, recall: 0.815, support: 27 },
	{ name: 'Lexus RX', f1: 0.821, precision: 0.793, recall: 0.852, support: 27 },
];
const HARDEST: ClassScore[] = [
	{ name: 'Hyundai Santa Fe', f1: 0.558, precision: 0.706, recall: 0.462, support: 26 },
	{ name: 'Genesis G80', f1: 0.545, precision: 0.75, recall: 0.429, support: 7 },
	{ name: 'Mercedes-Benz S-Class', f1: 0.545, precision: 0.536, recall: 0.556, support: 27 },
	{ name: 'Tesla Model 3', f1: 0.5, precision: 0.5, recall: 0.5, support: 4 },
	{ name: 'Kia K5', f1: 0.364, precision: 0.5, recall: 0.286, support: 7 },
];
/** Most frequent mistakes in the confusion matrix: [true class, predicted as, count]. */
const CONFUSIONS: [string, string, number][] = [
	['Mercedes E-Class', 'C-Class', 5],
	['BMW X5', 'X3', 5],
	['Mercedes GLC', 'S-Class', 4],
	['BMW 5 Series', 'X3', 4],
	['Mercedes S-Class', 'E-Class', 3],
];
const DECISION_ICONS: IconType[] = [LuCpu, LuShieldCheck, LuDatabase, LuServer];
const DECISION_CODE = [CODE.train, CODE.gate, CODE.audit, CODE.api];

const CarviaCaseStudy = () => {
	const { t } = useTranslation('common');
	const list = useCaseList(K);
	const reduceMotion = useReducedMotion();
	const gateRows = list('gateRows');

	return (
		<Stack className={'case-body'}>
			{/* TL;DR */}
			<ScrollRise className={'case-card case-tldr'} order={0}>
				{list('tldr').map((item, index) => {
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
					<Box className={'problem-chips'}>
						{list('problems').map((item, index) => {
							const Icon = PROBLEM_ICONS[index];
							return (
								<span key={item} className={'problem-chip'}>
									<Icon />
									{item}
								</span>
							);
						})}
					</Box>
				</ScrollRise>
				<ScrollRise className={'case-card solution'} order={1}>
					<Heading icon={LuLightbulb} text={t(`${K}.solutionTitle`)} />
					<strong className={'solution-lead'}>{t(`${K}.solutionLead`)}</strong>
					<RichText text={t(`${K}.solution`)} />
				</ScrollRise>
			</Box>

			{/* how it works: six steps from photo to answer */}
			<ScrollRise className={'case-card case-pipeline'} order={0}>
				<Heading icon={LuScanSearch} text={t(`${K}.howTitle`)} />
				<Box className={'pipeline-row'}>
					<Box className={'pipeline-steps'}>
						{list('steps').map((item, index) => {
							const Icon = STEP_ICONS[index];
							const [title, text] = item.split('|');
							return (
								<React.Fragment key={title}>
									{index > 0 && <LuArrowRight className={'flow-arrow'} />}
									<motion.span
										className={'pipeline-step'}
										initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true, amount: 0.6 }}
										transition={{ duration: 0.5, ease: EASE, delay: index * 0.1 }}
									>
										<b>{String(index + 1).padStart(2, '0')}</b>
										<strong>{title}</strong>
										<Icon className={'step-icon'} />
										<small>{text}</small>
									</motion.span>
								</React.Fragment>
							);
						})}
					</Box>
					<span className={'case-shot framed pipeline-shot'}>
						<Image src={resultShot} alt={t(`${K}.resultAlt`)} sizes={'(max-width: 1024px) 90vw, 24vw'} />
					</span>
				</Box>
			</ScrollRise>

			{/* data + results */}
			<Box className={'case-row two'}>
				<ScrollRise className={'case-card case-data'} order={0}>
					<Heading icon={LuDatabase} text={t(`${K}.dataTitle`)} />
					<RichText text={t(`${K}.dataLead`)} />
					<span className={'split-bar'}>
						{SPLIT.map((part, index) => (
							<motion.span
								key={part.key}
								className={`split-part part-${part.key}`}
								initial={{ flexGrow: reduceMotion ? part.value : 0.001 }}
								whileInView={{ flexGrow: part.value }}
								viewport={{ once: true, amount: 0.8 }}
								transition={{ duration: 0.9, ease: EASE, delay: index * 0.12 }}
							>
								<strong>{t(`${K}.split_${part.key}`)}</strong>
								<small>
									{part.value.toLocaleString('en-US')} ({((part.value / SPLIT_TOTAL) * 100).toFixed(1)}%)
								</small>
							</motion.span>
						))}
					</span>
					<span className={'check-row'}>
						{list('dataChecks').map((item) => (
							<span key={item} className={'check-pill'}>
								<LuCircleCheck />
								{item}
							</span>
						))}
					</span>
					<small className={'case-caption'}>{t(`${K}.dataCaption`)}</small>
					<CodeLink href={CODE.auditReport} label={'final_dataset_audit.json'} />
				</ScrollRise>

				<ScrollRise className={'case-card case-results'} order={1}>
					<Heading icon={LuChartColumn} text={t(`${K}.resultsTitle`)} />
					<Box className={'result-tiles'}>
						{RESULTS.map((result) => (
							<span key={result.key} className={`result-tile ${result.highlight ? 'highlight' : ''}`}>
								<small>{t(`${K}.result_${result.key}`)}</small>
								<strong>
									<CountUp value={result.value} suffix={result.suffix} decimals={result.decimals} />
								</strong>
							</span>
						))}
					</Box>
					<span className={'result-note'}>
						<LuCircleAlert />
						{t(`${K}.resultsNote`)}
					</span>
					<span className={'result-note warm'}>
						<LuTarget />
						<RichText as={'span'} text={t(`${K}.hardPairs`)} />
					</span>
					<CodeLink href={CODE.testReport} label={'final_test_report.json'} />
				</ScrollRise>
			</Box>

			{/* where the model struggles: honest per-class results */}
			<ScrollRise className={'case-card case-classes'} order={0}>
				<Heading icon={LuChartColumn} text={t(`${K}.classesTitle`)} />
				<RichText text={t(`${K}.classesLead`)} />
				<Box className={'classes-grid'}>
					{[
						{ key: 'best', rows: BEST },
						{ key: 'hardest', rows: HARDEST },
					].map((group) => (
						<Box key={group.key} className={`class-group ${group.key}`}>
							<strong className={'class-group-title'}>{t(`${K}.classes_${group.key}`)}</strong>
							{group.rows.map((row, index) => (
								<span key={row.name} className={'class-row'} tabIndex={0}>
									<span className={'class-name'}>{row.name}</span>
									<span className={'class-track'}>
										<motion.span
											className={'class-bar'}
											initial={{ width: reduceMotion ? `${row.f1 * 100}%` : 0 }}
											whileInView={{ width: `${row.f1 * 100}%` }}
											viewport={{ once: true, amount: 0.8 }}
											transition={{ duration: 0.8, ease: EASE, delay: index * 0.08 }}
										/>
									</span>
									<b>{row.f1.toFixed(2)}</b>
									{/* hover / focus details */}
									<span className={'class-tip'}>
										{t(`${K}.tipPrecision`)} {Math.round(row.precision * 100)}% · {t(`${K}.tipRecall`)}{' '}
										{Math.round(row.recall * 100)}% · {t(`${K}.tipImages`, { count: row.support })}
									</span>
								</span>
							))}
						</Box>
					))}
					<Box className={'class-confusions'}>
						<strong className={'class-group-title'}>{t(`${K}.confusionsTitle`)}</strong>
						{CONFUSIONS.map(([actual, predicted, count]) => (
							<span key={`${actual}-${predicted}`} className={'confusion-row'}>
								<span>{actual}</span>
								<LuArrowRight className={'flow-arrow'} />
								<span>{predicted}</span>
								<b>{t(`${K}.confusionTimes`, { count })}</b>
							</span>
						))}
					</Box>
				</Box>
				<span className={'result-note warm'}>
					<LuCircleAlert />
					<RichText as={'span'} text={t(`${K}.classesNote`)} />
				</span>
				<CodeLink href={CODE.testReport} label={'final_test_report.json'} />
			</ScrollRise>

			{/* the calibration gate: the key decision */}
			<ScrollRise className={'case-card case-gate'} order={0}>
				<Heading icon={LuGauge} text={t(`${K}.gateTitle`)} />
				<Box className={'gate-grid'}>
					<Box className={'gate-gauge'}>
						<svg viewBox={'0 0 200 120'} aria-hidden={'true'}>
							<path className={'gauge-track'} d={'M 20 105 A 80 80 0 0 1 180 105'} />
							<motion.path
								className={'gauge-fill'}
								d={'M 20 105 A 80 80 0 0 1 180 105'}
								initial={{ pathLength: reduceMotion ? 0.45 : 0 }}
								whileInView={{ pathLength: 0.45 }}
								viewport={{ once: true, amount: 0.8 }}
								transition={{ duration: 1.2, ease: EASE }}
							/>
						</svg>
						<strong>{'45%'}</strong>
						<small>{t(`${K}.gaugeLabel`)}</small>
						<span className={'gate-thresholds'}>
							<span>
								<b>{'≥ 45%'}</b>
								{t(`${K}.thresholdConfidence`)}
							</span>
							<span>
								<b>{'≥ 8%'}</b>
								{t(`${K}.thresholdMargin`)}
							</span>
						</span>
					</Box>

					<Box className={'gate-table-wrap'}>
						<table className={'gate-table'}>
							<thead>
								<tr>
									{list('gateHead').map((cell) => (
										<th key={cell}>{cell}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{gateRows.map((row, index) => (
									<tr key={row} className={index === 1 ? 'chosen' : ''}>
										{row.split('|').map((cell, cellIndex) => (
											<td key={cellIndex}>{cell}</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
						<span className={'gate-result'}>
							<LuBadgeCheck />
							<RichText as={'span'} text={t(`${K}.gateResult`)} />
						</span>
						<span className={'gate-quote'}>
							<RichText as={'span'} text={t(`${K}.gateQuote`)} />
						</span>
						<span className={'gate-links'}>
							<CodeLink href={CODE.gate} label={'decision.py'} />
							<CodeLink href={CODE.config} label={'decision_config.json'} />
						</span>
					</Box>

					<Box className={'gate-temperature'}>
						<LuThermometer className={'temp-icon'} />
						<strong>{t(`${K}.tempTitle`)}</strong>
						<RichText as={'span'} text={t(`${K}.tempText`)} />
						<span className={'confidence-bars'}>
							<span>
								<small>{t(`${K}.tempRight`)}</small>
								<i style={{ width: '74%' }} />
								<b>{'74%'}</b>
							</span>
							<span className={'wrong'}>
								<small>{t(`${K}.tempWrong`)}</small>
								<i style={{ width: '36%' }} />
								<b>{'36%'}</b>
							</span>
						</span>
						<CodeLink href={CODE.uncertainty} label={'evaluate_uncertainty.py'} />
					</Box>
				</Box>
			</ScrollRise>

			{/* explainability & UX */}
			<ScrollRise className={'case-card'} order={0}>
				<Heading icon={LuFlame} text={t(`${K}.explainTitle`)} />
				<Box className={'explain-grid'}>
					{list('explain').map((item, index) => {
						const Icon = EXPLAIN_ICONS[index];
						const [title, text] = item.split('|');
						return (
							<span key={title} className={'feature-card'}>
								<span className={'feature-icon'}>
									<Icon />
								</span>
								<strong>{title}</strong>
								<RichText as={'span'} text={text} />
								{index === 0 && <CodeLink href={CODE.explain} label={'explain.py'} />}
							</span>
						);
					})}
					<span className={'case-shot framed explain-shot'}>
						<Image src={devicesShot} alt={t(`${K}.devicesAlt`)} sizes={'(max-width: 1024px) 90vw, 26vw'} />
					</span>
				</Box>
			</ScrollRise>

			{/* challenges → solutions + architecture */}
			<Box className={'case-row two'}>
				<ScrollRise className={'case-card'} order={0}>
					<Heading icon={LuGitCompareArrows} text={t(`${K}.challengesTitle`)} />
					<ul className={'solve-list'}>
						{list('challenges').map((item) => {
							const [problem, solution] = item.split('|');
							return (
								<li key={problem}>
									<strong>{problem}</strong>
									<LuArrowRight className={'flow-arrow'} />
									<RichText as={'span'} text={solution} />
								</li>
							);
						})}
					</ul>
				</ScrollRise>
				<ScrollRise className={'case-card case-architecture'} order={1}>
					<Heading icon={LuServer} text={t(`${K}.archTitle`)} />
					<Box className={'arch-flow'}>
						{list('arch').map((item, index) => {
							const [title, text] = item.split('|');
							return (
								<React.Fragment key={title}>
									{index > 0 && <LuArrowRight className={'flow-arrow'} />}
									<span className={`arch-node ${index === 2 ? 'primary' : ''}`}>
										<strong>{title}</strong>
										<small>{text}</small>
									</span>
								</React.Fragment>
							);
						})}
					</Box>
					<span className={'arch-infra'}>{t(`${K}.archInfra`)}</span>
					<small className={'case-caption'}>{t(`${K}.archTraining`)}</small>
				</ScrollRise>
			</Box>

			{/* engineering decisions */}
			<ScrollRise className={'case-card'} order={0}>
				<Heading icon={LuBookOpenCheck} text={t(`${K}.decisionsTitle`)} />
				<Box className={'decision-grid'}>
					{list('decisions').map((item, index) => {
						const Icon = DECISION_ICONS[index];
						const [title, text] = item.split('|');
						return (
							<span key={title} className={'decision-card'}>
								<Icon />
								<strong>{title}</strong>
								<RichText as={'span'} text={text} />
								<CodeLink href={DECISION_CODE[index]} label={t('caseStudy.fixora.viewCode')} />
							</span>
						);
					})}
				</Box>
			</ScrollRise>

			{/* quality */}
			<ScrollRise className={'case-card case-quality'} order={0}>
				<Heading icon={LuShieldCheck} text={t(`${K}.qualityTitle`)} />
				{list('quality').map((item) => (
					<span key={item} className={'quality-item'}>
						<LuCircleCheck />
						{item}
					</span>
				))}
				<span className={'quality-links'}>
					<CodeLink href={CODE.auditReport} label={'audit'} />
					<CodeLink href={CODE.testReport} label={'test report'} />
					<CodeLink href={CODE.api} label={'/health'} />
				</span>
			</ScrollRise>
		</Stack>
	);
};

export default CarviaCaseStudy;
