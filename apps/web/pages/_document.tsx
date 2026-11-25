import { Html, Head, Main, NextScript, DocumentProps, DocumentContext } from 'next/document';
import { DocumentHeadTags, DocumentHeadTagsProps, documentGetInitialProps } from '@mui/material-nextjs/v16-pagesRouter';

export default function Document(props: DocumentProps & DocumentHeadTagsProps) {
	return (
		<Html lang={props.locale ?? 'en'}>
			<Head>
				<DocumentHeadTags {...props} />
				<meta name={'robots'} content={'index,follow'} />
				<meta name={'theme-color'} content={'#ff3d00'} />
				<link rel={'icon'} type={'image/svg+xml'} href={'/favicon.svg'} />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}

Document.getInitialProps = async (ctx: DocumentContext) => {
	return await documentGetInitialProps(ctx);
};
