import type { AppProps } from 'next/app';
import React, { useEffect } from 'react';
import { Anton, Mrs_Saint_Delafield, Plus_Jakarta_Sans } from 'next/font/google';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from '@mui/material/styles';
import { AppCacheProvider } from '@mui/material-nextjs/v16-pagesRouter';
import { appWithTranslation } from 'next-i18next/pages';
import { light } from '../scss/MaterialTheme';
import { useApollo } from '../apollo/client';
import SmoothScroll from '../libs/components/common/SmoothScroll';

import '../scss/app.scss';
import '../scss/pc/main.scss';
import '../scss/mobile/main.scss';

const display = Anton({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-display' });
const body = Plus_Jakarta_Sans({ subsets: ['latin'], display: 'swap', variable: '--font-body' });
const script = Mrs_Saint_Delafield({ weight: '400', subsets: ['latin'], display: 'swap', variable: '--font-script' });
const fontVariables = `${display.variable} ${body.variable} ${script.variable}`;

const MainApp = appWithTranslation(({ Component, pageProps }: AppProps) => {
	const client = useApollo(pageProps.initialApolloState ?? null);

	/** LIFECYCLES **/
	useEffect(() => {
		// popups (alerts, menus) render outside the app root, so the font variables also go on <html>
		document.documentElement.classList.add(display.variable, body.variable, script.variable);
	}, []);

	return (
		<ApolloProvider client={client}>
			<ThemeProvider theme={light}>
				<SmoothScroll>
					<div className={fontVariables}>
						<Component {...pageProps} />
					</div>
				</SmoothScroll>
			</ThemeProvider>
		</ApolloProvider>
	);
});

/** The MUI style cache must wrap everything, so the server and the browser create the same class names. */
const App = (props: AppProps) => {
	return (
		<AppCacheProvider {...props}>
			<MainApp {...props} />
		</AppCacheProvider>
	);
};

export default App;
