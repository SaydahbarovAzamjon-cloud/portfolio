/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// bundle MUI + Emotion on the server too, so both use one Emotion instance (same class names on server and client)
	transpilePackages: ['@mui/material', '@mui/system', '@mui/material-nextjs', '@emotion/react', '@emotion/styled', '@emotion/cache'],
	env: {
		REACT_APP_API_URL: process.env.REACT_APP_API_URL,
		REACT_APP_API_GRAPHQL_URL: process.env.REACT_APP_API_GRAPHQL_URL,
	},
	images: {
		remotePatterns: [
			{ protocol: 'http', hostname: 'localhost', port: '4000', pathname: '/uploads/**' },
		],
	},
};

const { i18n } = require('./next-i18next.config');
nextConfig.i18n = i18n;

module.exports = nextConfig;
