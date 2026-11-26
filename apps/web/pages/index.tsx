import { NextPage } from 'next';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';
import withLayoutHome from '../libs/components/layout/LayoutHome';
import HeroSection from '../libs/components/homepage/HeroSection';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	return (
		<Stack className={'home-page'}>
			<HeroSection />
			<Stack id={'next'} className={'home-next'} />
		</Stack>
	);
};

export default withLayoutHome(Home);
