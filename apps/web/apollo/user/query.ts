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
			portfolio {
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
			bioShort {
				en
				ko
			}
			focusAreas {
				icon
				title {
					en
					ko
				}
			}
			manualStats {
				value
				label {
					en
					ko
				}
			}
			moments {
				image {
					url
					width
					height
					blurDataUrl
				}
				caption {
					en
					ko
				}
			}
			images {
				contactPortrait {
					url
					width
					height
					blurDataUrl
				}
				aboutPortrait {
					url
					width
					height
					blurDataUrl
				}
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
			summary {
				en
				ko
			}
			category
			status
			order
			showOnHome
			links {
				live
				github
			}
			skillIds
			skills {
				_id
				name
				slug
				icon
			}
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

/**************************
 *         SKILLS         *
 *************************/

export const GET_SKILLS = gql`
	query GetSkills {
		getSkills {
			_id
			key
			title {
				en
				ko
			}
			description {
				en
				ko
			}
			icon
			order
			skills {
				_id
				name
				slug
				icon
				featured
				order
			}
		}
	}
`;
