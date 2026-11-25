import React from 'react';
import { useTranslation } from 'next-i18next/pages';
import { Stack } from '@mui/material';

interface PagePlaceholderProps {
	pageKey: string;
	number: string;
}

/** Temporary page body until the section is built from its mockup. */
const PagePlaceholder = (props: PagePlaceholderProps) => {
	const { pageKey, number } = props;
	const { t } = useTranslation('common');

	return (
		<Stack className={'page-placeholder'}>
			<Stack className={'container'}>
				<span className={'number'}>{number} / 07</span>
				<h1>{t(`nav.${pageKey}`)}</h1>
				<p>{t('placeholder')}</p>
			</Stack>
		</Stack>
	);
};

export default PagePlaceholder;
