import { NextPage } from 'next';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';
import withLayoutHome from '../libs/components/layout/LayoutHome';
import PagePlaceholder from '../libs/components/common/PagePlaceholder';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	return (
		<Stack className={'home-page'}>
			<PagePlaceholder pageKey={'home'} number={'01'} />
		</Stack>
	);
};

export default withLayoutHome(Home);
