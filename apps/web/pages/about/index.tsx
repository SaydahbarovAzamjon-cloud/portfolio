import { NextPage } from 'next';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import AboutHero from '../../libs/components/about/AboutHero';
import WhoIAm from '../../libs/components/about/WhoIAm';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const About: NextPage = () => {
	return (
		<Stack className={'about-page'}>
			<AboutHero />
			<WhoIAm />
		</Stack>
	);
};

export default withLayoutBasic(About);
