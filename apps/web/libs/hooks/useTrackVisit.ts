import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { TRACK_VISIT } from '../../apollo/user/mutation';
import { pageTypes } from '../config';
import { PageType } from '../enums/visitor.enum';

/** Tells the API a page was opened (it alerts the owner on Telegram when a visit starts). */
const useTrackVisit = (entityId?: string) => {
	const router = useRouter();

	/** APOLLO REQUESTS **/
	const [trackVisit] = useMutation(TRACK_VISIT);

	/** LIFECYCLES **/
	useEffect(() => {
		if (!router.isReady) return;
		trackVisit({
			variables: {
				input: {
					path: router.asPath.split('?')[0],
					pageType: pageTypes[router.pathname] ?? PageType.OTHER,
					locale: router.locale === 'ko' ? 'KO' : 'EN',
					referrer: document.referrer || undefined,
					entityId,
				},
			},
		}).catch(() => {
			// tracking must never disturb the visitor
		});
	}, [router.isReady, router.asPath, router.pathname, router.locale, entityId, trackVisit]);
};

export default useTrackVisit;
