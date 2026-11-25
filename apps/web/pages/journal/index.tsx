import { NextPage } from 'next';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import PagePlaceholder from '../../libs/components/common/PagePlaceholder';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Journal: NextPage = () => {
	return (
		<Stack className={'journal-page'}>
			<PagePlaceholder pageKey={'journal'} number={'06'} />
		</Stack>
	);
};

export default withLayoutBasic(Journal);
