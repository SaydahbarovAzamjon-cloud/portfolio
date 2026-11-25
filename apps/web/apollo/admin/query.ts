import { gql } from '@apollo/client';

/**************************
 *          AUTH          *
 *************************/

export const GET_ME = gql`
	query Me {
		me {
			_id
			email
			role
			lastLoginAt
		}
	}
`;
