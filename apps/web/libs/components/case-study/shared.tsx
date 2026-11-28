import React from 'react';
import { useTranslation } from 'next-i18next/pages';
import { IconType } from 'react-icons';
import { LuArrowUpRight, LuCodeXml } from 'react-icons/lu';

/** Building blocks shared by every case study. */

/** A small "view the code" link with the file name: the proof behind a claim. */
export const CodeLink = ({ href, label }: { href: string; label: string }) => (
	<a href={href} target={'_blank'} rel={'noreferrer'} className={'code-link'}>
		<LuCodeXml />
		{label}
		<LuArrowUpRight />
	</a>
);

/** A section title with an icon. */
export const Heading = ({ icon: Icon, text }: { icon: IconType; text: string }) => (
	<h2 className={'case-heading'}>
		<span className={'heading-icon'}>
			<Icon />
		</span>
		{text}
	</h2>
);

/** Reads list texts (arrays) from caseStudy.<project>.<key>. */
export const useCaseList = (prefix: string) => {
	const { t } = useTranslation('common');
	return (key: string): string[] => {
		const value = t(`${prefix}.${key}`, { returnObjects: true });
		return Array.isArray(value) ? (value as string[]) : [];
	};
};
