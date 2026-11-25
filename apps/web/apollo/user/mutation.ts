import { gql } from '@apollo/client';

/**************************
 *         VISITOR        *
 *************************/

export const TRACK_VISIT = gql`
	mutation TrackVisit($input: TrackVisitInput!) {
		trackVisit(input: $input) {
			message
		}
	}
`;
