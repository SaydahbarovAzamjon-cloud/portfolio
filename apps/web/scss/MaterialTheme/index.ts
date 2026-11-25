import { createTheme } from '@mui/material/styles';

/** MUI is used for layout primitives (Stack, Box); colours and fonts come from the SCSS variables. */
export const light = createTheme({
	palette: {
		mode: 'light',
		primary: { main: '#ff3d00' },
		text: { primary: '#0d0d0d' },
	},
	typography: {
		fontFamily: 'var(--font-body), sans-serif',
	},
});
