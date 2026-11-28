import { NextPage } from 'next';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import SkillsHero from '../../libs/components/skills/SkillsHero';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Skills: NextPage = () => {
	return (
		<Stack className={'skills-page'}>
			<SkillsHero />
		</Stack>
	);
};

export default withLayoutBasic(Skills);
