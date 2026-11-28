import { NextPage } from 'next';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import ProjectsHero from '../../libs/components/projects/ProjectsHero';
import FlagshipProject from '../../libs/components/projects/FlagshipProject';
import ProjectsGrid from '../../libs/components/projects/ProjectsGrid';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Projects: NextPage = () => {
	return (
		<Stack className={'projects-page'}>
			<ProjectsHero />
			<FlagshipProject />
			<ProjectsGrid />
		</Stack>
	);
};

export default withLayoutBasic(Projects);
