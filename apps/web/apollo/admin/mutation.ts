import { gql } from '@apollo/client';

/**************************
 *          AUTH          *
 *************************/

export const LOGIN = gql`
	mutation Login($input: LoginInput!) {
		login(input: $input) {
			message
			accessTokenExpiresAt
			admin {
				_id
				email
				role
				lastLoginAt
			}
		}
	}
`;

export const LOGOUT = gql`
	mutation Logout {
		logout
	}
`;
