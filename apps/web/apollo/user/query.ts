import { gql } from '@apollo/client';

/**************************
 *         PROFILE        *
 *************************/

export const GET_PROFILE = gql`
	query GetProfile {
		getProfile {
			_id
			name
			fullName {
				en
				ko
			}
			headline {
				en
				ko
			}
			tagline {
				en
				ko
			}
			contactEmail
			location {
				city {
					en
					ko
				}
				country {
					en
					ko
				}
				timezone
			}
			availability {
				isAvailable
				label {
					en
					ko
				}
			}
			socials {
				platform
				url
				handle
			}
			resume {
				en {
					url
				}
				ko {
					url
				}
			}
			heroOrbitLabels {
				en
				ko
			}
			images {
				heroPortrait {
					url
					width
					height
					blurDataUrl
					alt {
						en
						ko
					}
				}
			}
		}
	}
`;

/**************************
 *         PROJECT        *
 *************************/

export const GET_PROJECTS = gql`
	query GetProjects($input: ProjectsInquiry) {
		getProjects(input: $input) {
			_id
			slug
			title
			subtitle {
				en
				ko
			}
			category
			showOnHome
			theme {
				accent
				dark
			}
			media {
				thumbnail {
					url
				}
			}
		}
	}
`;
