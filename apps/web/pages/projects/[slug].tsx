import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { FALLBACK_PROJECTS } from '../../libs/fallback';
import CaseStudy from '../../libs/components/case-study/CaseStudy';

interface ProjectPageProps {
	slug: string;
}

/** Every known project in every language is built ahead; a project that only exists in the database is built on its first visit. */
export const getStaticPaths: GetStaticPaths = async ({ locales = ['en'] }) => ({
	paths: FALLBACK_PROJECTS.flatMap((project) => locales.map((locale) => ({ params: { slug: project.slug }, locale }))),
	fallback: 'blocking',
});

export const getStaticProps: GetStaticProps<ProjectPageProps> = async ({ locale = 'en', params }) => ({
	props: {
		slug: String(params?.slug ?? ''),
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ProjectPage: NextPage<ProjectPageProps> = ({ slug }) => {
	return (
		<Stack className={'case-page'}>
			<CaseStudy slug={slug} />
		</Stack>
	);
};

export default withLayoutBasic(ProjectPage);
