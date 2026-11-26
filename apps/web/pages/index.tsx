import { NextPage } from 'next';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';
import withLayoutHome from '../libs/components/layout/LayoutHome';
import HeroSection from '../libs/components/homepage/HeroSection';
import AboutPreview from '../libs/components/homepage/AboutPreview';
import SelectedWork from '../libs/components/homepage/SelectedWork';
import SkillsPreview from '../libs/components/homepage/SkillsPreview';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	return (
		<Stack className={'home-page'}>
			<HeroSection />
			<Stack id={'next'}>
				<AboutPreview />
				<SelectedWork />
				<SkillsPreview />
			</Stack>
		</Stack>
	);
};

export default withLayoutHome(Home);
