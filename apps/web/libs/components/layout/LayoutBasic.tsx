import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next/pages';
import { Stack } from '@mui/material';
import Top from '../Top';
import Footer from '../Footer';
import useTrackVisit from '../../hooks/useTrackVisit';

/** Inner pages (About, Projects, ...): navbar, page, footer. */
const withLayoutBasic = <P extends object>(Component: React.ComponentType<P>) => {
	const LayoutBasic = (props: P) => {
		const router = useRouter();
		const { t } = useTranslation('common');
		useTrackVisit();

		const memoizedValues = useMemo(() => {
			const key = router.pathname.split('/')[1] || 'home';
			return { title: `${t(`nav.${key}`)} — ${t('meta.title')}` };
		}, [router.pathname, t]);

		return (
			<>
				<Head>
					<title>{memoizedValues.title}</title>
					<meta name={'description'} content={t('meta.description')} />
				</Head>
				<Stack id={'pc-wrap'}>
					<Stack id={'top'}>
						<Top />
					</Stack>

					<Stack id={'main'}>
						<Component {...props} />
					</Stack>

					<Stack id={'footer'}>
						<Footer />
					</Stack>
				</Stack>
			</>
		);
	};

	return LayoutBasic;
};

export default withLayoutBasic;
