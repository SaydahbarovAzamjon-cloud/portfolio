import { NextPage } from 'next';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import AboutHero from '../../libs/components/about/AboutHero';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const About: NextPage = () => {
	return (
		<Stack className={'about-page'}>
			<AboutHero />
		</Stack>
	);
};

export default withLayoutBasic(About);
