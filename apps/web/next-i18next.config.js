module.exports = {
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'ko'],
		localeDetection: false,
	},
	// development: re-read public/locales on every request, so edited texts show without a restart
	reloadOnPrerender: process.env.NODE_ENV === 'development',
};
