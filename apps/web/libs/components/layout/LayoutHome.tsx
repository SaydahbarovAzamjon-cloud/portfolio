import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next/pages';
import { Stack } from '@mui/material';
import Top from '../Top';
import Footer from '../Footer';
import useTrackVisit from '../../hooks/useTrackVisit';

/** Home page: the navbar floats over the full-screen hero. */
const withLayoutHome = <P extends object>(Component: React.ComponentType<P>) => {
	const LayoutHome = (props: P) => {
		const { t } = useTranslation('common');
		useTrackVisit();

		return (
			<>
				<Head>
					<title>{t('meta.title')}</title>
					<meta name={'description'} content={t('meta.description')} />
				</Head>
				<Stack id={'pc-wrap'} className={'home'}>
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

	return LayoutHome;
};

export default withLayoutHome;
