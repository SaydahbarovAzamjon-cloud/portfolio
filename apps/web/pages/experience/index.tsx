import { NextPage } from 'next';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import ExperienceHero from '../../libs/components/experience/ExperienceHero';
import CareerJourney from '../../libs/components/experience/CareerJourney';
import ExperienceDetails from '../../libs/components/experience/ExperienceDetails';
import KeyContributions from '../../libs/components/experience/KeyContributions';
import KeyAchievements from '../../libs/components/experience/KeyAchievements';
import ExperienceConnect from '../../libs/components/experience/ExperienceConnect';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Experience: NextPage = () => {
	return (
		<Stack className={'experience-page'}>
			<ExperienceHero />
			<CareerJourney />
			<ExperienceDetails />
			<KeyContributions />
			<KeyAchievements />
			<ExperienceConnect />
		</Stack>
	);
};

export default withLayoutBasic(Experience);
