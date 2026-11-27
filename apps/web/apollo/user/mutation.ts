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

/**************************
 *         CONTACT        *
 *************************/

export const SEND_CONTACT_MESSAGE = gql`
	mutation SendContactMessage($input: ContactInput!) {
		sendContactMessage(input: $input) {
			message
		}
	}
`;
