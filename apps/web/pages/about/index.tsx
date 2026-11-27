import { NextPage } from 'next';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import AboutHero from '../../libs/components/about/AboutHero';
import WhoIAm from '../../libs/components/about/WhoIAm';
import Journey from '../../libs/components/about/Journey';
import Education from '../../libs/components/about/Education';

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
			<Journey />
			<Education />
		</Stack>
	);
};

export default withLayoutBasic(About);
