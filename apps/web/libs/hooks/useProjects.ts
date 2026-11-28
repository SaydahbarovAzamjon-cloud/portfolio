import { useQuery } from '@apollo/client';
import { GET_PROJECTS } from '../../apollo/user/query';
import { Project } from '../types/project/project';
import { FALLBACK_PROJECTS } from '../fallback';

/** All projects from the database, or the CV ones while the database has none. Live links fall back to the CV too. */
const useProjects = (): Project[] => {
	const { data } = useQuery<{ getProjects: Project[] }>(GET_PROJECTS, { fetchPolicy: 'cache-first' });
	const loaded = data?.getProjects ?? [];
	if (!loaded.length) return FALLBACK_PROJECTS;
	return loaded.map((project) => {
		const known = FALLBACK_PROJECTS.find((item) => item.slug === project.slug);
		return {
			...project,
			links: { live: project.links?.live || known?.links?.live, github: project.links?.github || known?.links?.github },
		};
	});
};

export default useProjects;
