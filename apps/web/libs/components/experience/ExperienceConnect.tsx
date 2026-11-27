import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next/pages';
import { useMutation, useQuery } from '@apollo/client';
import { Stack, Box } from '@mui/material';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';
import { LuArrowUpRight, LuCalendarCheck, LuMail, LuMessageSquare, LuSend, LuTag, LuUser } from 'react-icons/lu';
import { GET_PROFILE } from '../../../apollo/user/query';
import { SEND_CONTACT_MESSAGE } from '../../../apollo/user/mutation';
import { Profile } from '../../types/profile/profile';
import { SocialPlatform } from '../../enums/profile.enum';
import { FALLBACK_CONTACT } from '../../fallback';
import ScrollRise from '../common/ScrollRise';
import ScrollRevealText from '../common/ScrollRevealText';

const EASE = [0.22, 1, 0.36, 1] as const;
const EMPTY_FORM = { name: '', email: '', subject: '', message: '', website: '' };

const shortUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

/** "Let's connect": contact links on the left, a message form (sends to the API) on the right. */
const ExperienceConnect = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const reduceMotion = useReducedMotion();
	const [form, setForm] = useState(EMPTY_FORM);
	const [status, setStatus] = useState<{ kind: 'idle' | 'sent' | 'error'; text: string }>({ kind: 'idle', text: '' });

	/** APOLLO REQUESTS **/
	const { data: getProfileData } = useQuery<{ getProfile: Profile }>(GET_PROFILE, { fetchPolicy: 'cache-first' });
	const [sendMessage, { loading }] = useMutation(SEND_CONTACT_MESSAGE);
	const profile = getProfileData?.getProfile;
	const email = profile?.contactEmail || FALLBACK_CONTACT.email;
	const github =
		profile?.socials?.find((social) => social.platform === SocialPlatform.GITHUB)?.url ?? FALLBACK_CONTACT.github;
	const linkedin =
		profile?.socials?.find((social) => social.platform === SocialPlatform.LINKEDIN)?.url ?? FALLBACK_CONTACT.linkedin;

	const links = [
		{
			key: 'email',
			icon: <SiGmail style={{ color: '#ea4335' }} />,
			label: t('experience.connect.email'),
			value: email,
			href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`,
		},
		{
			key: 'linkedin',
			icon: <FaLinkedin style={{ color: '#0a66c2' }} />,
			label: 'LinkedIn',
			value: shortUrl(linkedin).replace('linkedin.com', ''),
			href: linkedin,
		},
		{
			key: 'github',
			icon: <FaGithub />,
			label: 'GitHub',
			value: shortUrl(github).replace('github.com', ''),
			href: github,
		},
	];

	/** HANDLERS **/
	const changeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setForm({ ...form, [event.target.name]: event.target.value });
		if (status.kind !== 'idle') setStatus({ kind: 'idle', text: '' });
	};

	const submitHandler = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			const result = await sendMessage({
				variables: {
					input: {
						name: form.name.trim(),
						email: form.email.trim(),
						subject: form.subject.trim(),
						message: form.message.trim(),
						locale: router.locale === 'ko' ? 'KO' : 'EN',
						website: form.website,
					},
				},
			});
			setStatus({ kind: 'sent', text: result.data?.sendContactMessage?.message ?? t('experience.connect.sent') });
			setForm(EMPTY_FORM);
		} catch (err) {
			setStatus({ kind: 'error', text: err instanceof Error ? err.message : t('experience.connect.failed') });
		}
	};

	return (
		<Stack component={'section'} id={'lets-connect'} className={'experience-connect'}>
			<Stack className={'connect-main'}>
				<Stack className={'connect-left'}>
					<ScrollRise className={'eyebrow'} order={0}>
						<span className={'label'}>{t('experience.connect.eyebrow')}</span>
						<span className={'line'} />
					</ScrollRise>
					<ScrollRise order={1}>
						<h2 className={'title'}>
							{t('experience.connect.title1')}
							<br />
							<span className={'accent'}>{t('experience.connect.title2')}</span>
						</h2>
					</ScrollRise>
					<ScrollRise order={2}>
						<ScrollRevealText className={'intro'} text={t('experience.connect.intro')} />
					</ScrollRise>

					<Box className={'connect-links'}>
						{links.map((link, index) => (
							<motion.a
								key={link.key}
								href={link.href}
								target={'_blank'}
								rel={'noopener noreferrer'}
								className={'connect-link'}
								initial={{ opacity: 0, y: reduceMotion ? 0 : 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.5 }}
								transition={{ duration: 0.8, ease: EASE, delay: index * 0.1 }}
							>
								<span className={'link-icon'}>{link.icon}</span>
								<span className={'link-text'}>
									<strong>{link.label}</strong>
									<small>{link.value}</small>
								</span>
								<LuArrowUpRight className={'link-arrow'} />
							</motion.a>
						))}
					</Box>

					<motion.div
						className={'availability'}
						initial={{ opacity: 0, y: reduceMotion ? 0 : 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
					>
						<span className={'availability-icon'}>
							<LuCalendarCheck />
						</span>
						<span>
							<strong>
								<i className={'live-dot'} />
								{t('experience.connect.available')}
							</strong>
							<small>{t('experience.connect.availableText')}</small>
						</span>
					</motion.div>
				</Stack>

				<motion.form
					className={'message-card'}
					onSubmit={submitHandler}
					initial={{ opacity: 0, y: reduceMotion ? 0 : 60 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.2 }}
					transition={{ duration: 1, ease: EASE }}
				>
					<Stack className={'form-head'}>
						<span className={'form-icon'}>
							<LuMail />
						</span>
						<span>
							<strong>{t('experience.connect.formTitle')}</strong>
							<small>{t('experience.connect.formText')}</small>
						</span>
					</Stack>

					<Box className={'form-row'}>
						<label className={'field'}>
							<span>
								{t('experience.connect.name')} <b>*</b>
							</span>
							<span className={'input'}>
								<LuUser />
								<input
									name={'name'}
									value={form.name}
									onChange={changeHandler}
									placeholder={t('experience.connect.namePh')}
									required
									maxLength={100}
								/>
							</span>
						</label>
						<label className={'field'}>
							<span>
								{t('experience.connect.emailLabel')} <b>*</b>
							</span>
							<span className={'input'}>
								<LuMail />
								<input
									name={'email'}
									type={'email'}
									value={form.email}
									onChange={changeHandler}
									placeholder={'you@email.com'}
									required
									maxLength={254}
								/>
							</span>
						</label>
					</Box>
					<label className={'field'}>
						<span>
							{t('experience.connect.subject')} <b>*</b>
						</span>
						<span className={'input'}>
							<LuTag />
							<input
								name={'subject'}
								value={form.subject}
								onChange={changeHandler}
								placeholder={t('experience.connect.subjectPh')}
								required
								maxLength={150}
							/>
						</span>
					</label>
					<label className={'field'}>
						<span>
							{t('experience.connect.message')} <b>*</b>
						</span>
						<span className={'input textarea'}>
							<LuMessageSquare />
							<textarea
								name={'message'}
								value={form.message}
								onChange={changeHandler}
								placeholder={t('experience.connect.messagePh')}
								required
								minLength={10}
								maxLength={5000}
								rows={4}
							/>
						</span>
					</label>
					{/* anti-spam trap: hidden from people, bots fill it in */}
					<input
						className={'trap'}
						name={'website'}
						value={form.website}
						onChange={changeHandler}
						tabIndex={-1}
						autoComplete={'off'}
						aria-hidden={'true'}
					/>

					<Stack className={'form-foot'}>
						<button type={'submit'} className={'send-button'} disabled={loading}>
							<LuSend />
							{loading ? t('experience.connect.sending') : t('experience.connect.send')}
						</button>
						<AnimatePresence>
							{status.kind !== 'idle' && (
								<motion.span
									className={`form-status ${status.kind}`}
									initial={{ opacity: 0, y: 8 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0 }}
									role={'status'}
								>
									{status.text}
								</motion.span>
							)}
						</AnimatePresence>
					</Stack>
				</motion.form>
			</Stack>
		</Stack>
	);
};

export default ExperienceConnect;
