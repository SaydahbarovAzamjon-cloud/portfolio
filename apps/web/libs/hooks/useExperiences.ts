import { useQuery } from '@apollo/client';
import { GET_EXPERIENCES } from '../../apollo/user/query';
import { FALLBACK_EXPERIENCE } from '../fallback';
import { Experience } from '../types/experience/experience';

/** Work experience oldest first (the CV list while the database is still empty). */
const useExperiences = (): Experience[] => {
	const { data } = useQuery<{ getExperiences: Experience[] }>(GET_EXPERIENCES, { fetchPolicy: 'cache-first' });
	const loaded = data?.getExperiences ?? [];
	const items = loaded.length ? loaded : FALLBACK_EXPERIENCE;
	return [...items].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
};

export default useExperiences;
