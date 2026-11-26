import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next/pages';
import { useQuery } from '@apollo/client';
import { Stack, Box } from '@mui/material';
import { HiArrowUpRight } from 'react-icons/hi2';
import { RiMenu4Line, RiCloseLine } from 'react-icons/ri';
import { GET_PROFILE } from '../../apollo/user/query';
import { navLinks } from '../config';
import { localize } from '../utils';
import LiveClock from './common/LiveClock';
import { Profile } from '../types/profile/profile';

const Top = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const [colorChange, setColorChange] = useState<boolean>(false);
	const [menuOpen, setMenuOpen] = useState<boolean>(false);

	/** APOLLO REQUESTS **/
	const { data: getProfileData } = useQuery<{ getProfile: Profile }>(GET_PROFILE, {
		fetchPolicy: 'cache-first',
	});
	const profile = getProfileData?.getProfile;
	const country = localize(profile?.location?.country, router.locale) || t('top.country');

	/** LIFECYCLES **/
	useEffect(() => {
		const changeNavbarColor = () => setColorChange(window.scrollY >= 50);
		changeNavbarColor();
		window.addEventListener('scroll', changeNavbarColor, { passive: true });
		return () => window.removeEventListener('scroll', changeNavbarColor);
	}, []);

	useEffect(() => {
		const closeMenu = () => setMenuOpen(false);
		router.events.on('routeChangeStart', closeMenu);
		return () => router.events.off('routeChangeStart', closeMenu);
	}, [router.events]);

	useEffect(() => {
		document.body.style.overflow = menuOpen ? 'hidden' : '';
	}, [menuOpen]);

	/** HANDLERS **/
	const isActive = (href: string) => (href === '/' ? router.pathname === '/' : router.pathname.startsWith(href));

	const langChoice = async (locale: string) => {
		await router.push(router.asPath, router.asPath, { locale, scroll: false });
	};

	return (
		<Stack className={`navbar ${colorChange || menuOpen ? 'scrolled' : ''}`}>
			<Stack className={'navbar-main'}>
				<Stack className={'container'}>
					<Box className={'local-time'}>
						<span className={'dot'} />
						<span className={'country'}>{country}</span>
						<span className={'divider'}>•</span>
						<LiveClock timeZone={profile?.location?.timezone} />
					</Box>

					<Box component={'nav'} className={'router-box'}>
						{navLinks.map((link, index) => (
							<Link
								key={link.key}
								href={link.href}
								className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
							>
								<span className={'label'}>{t(`nav.${link.key}`)}</span>
								<sup className={'number'}>{String(index + 1).padStart(2, '0')}</sup>
							</Link>
						))}
					</Box>

					<Stack className={'user-box'}>
						<Box className={'lang-box'}>
							{['en', 'ko'].map((locale) => (
								<button
									key={locale}
									type={'button'}
									className={router.locale === locale ? 'active' : ''}
									onClick={() => langChoice(locale)}
								>
									{locale.toUpperCase()}
								</button>
							))}
						</Box>
						<Link href={'/contact'} className={'cta-button'}>
							{t('top.cta')}
							<HiArrowUpRight />
						</Link>
						<button
							type={'button'}
							className={'menu-button'}
							aria-label={t('top.menu')}
							aria-expanded={menuOpen}
							onClick={() => setMenuOpen(!menuOpen)}
						>
							{menuOpen ? <RiCloseLine /> : <RiMenu4Line />}
						</button>
					</Stack>
				</Stack>
			</Stack>

			<Stack className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
				{navLinks.map((link, index) => (
					<Link key={link.key} href={link.href} className={isActive(link.href) ? 'active' : ''}>
						<sup>{String(index + 1).padStart(2, '0')}</sup>
						{t(`nav.${link.key}`)}
					</Link>
				))}
			</Stack>
		</Stack>
	);
};

export default Top;
