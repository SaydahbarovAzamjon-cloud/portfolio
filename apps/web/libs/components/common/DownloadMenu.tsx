import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next/pages';
import { AnimatePresence, motion } from 'motion/react';
import { LuDownload, LuFileText } from 'react-icons/lu';
import { Resume } from '../../types/profile/profile';

const EASE = [0.22, 1, 0.36, 1] as const;
const FILE_PREFIX = 'Azamjon-Saydahbarov';

interface DownloadMenuProps {
	resume?: Resume | null;
	portfolio?: Resume | null;
	/** The button that opens the menu. */
	children: React.ReactNode;
	className?: string;
	/** Which way the menu opens from the button. */
	placement?: 'bottom' | 'top';
}

interface DownloadItem {
	key: string;
	url: string;
	fileName: string;
	language: string;
}

/**
 * Resume + portfolio in English and Korean. The file is fetched and saved with a readable name;
 * if the browser cannot fetch it, it simply opens in a new tab.
 */
const DownloadMenu = (props: DownloadMenuProps) => {
	const { t } = useTranslation('common');
	const [open, setOpen] = useState<boolean>(false);
	const [busy, setBusy] = useState<string>('');
	const boxRef = useRef<HTMLDivElement>(null);

	const build = (kind: string, files?: Resume | null): DownloadItem[] =>
		(['en', 'ko'] as const)
			.filter((lang) => files?.[lang]?.url)
			.map((lang) => ({
				key: `${kind}-${lang}`,
				url: files?.[lang]?.url ?? '',
				fileName: `${FILE_PREFIX}-${kind === 'resume' ? 'CV' : 'Portfolio'}-${lang.toUpperCase()}.pdf`,
				language: t(`download.${lang}`),
			}));

	const groups = [
		{ key: 'resume', title: t('download.resume'), items: build('resume', props.resume) },
		{ key: 'portfolio', title: t('download.portfolio'), items: build('portfolio', props.portfolio) },
	].filter((group) => group.items.length);

	/** LIFECYCLES **/
	useEffect(() => {
		if (!open) return;
		const close = (event: MouseEvent | KeyboardEvent) => {
			if (event instanceof KeyboardEvent ? event.key === 'Escape' : !boxRef.current?.contains(event.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', close);
		document.addEventListener('keydown', close);
		return () => {
			document.removeEventListener('mousedown', close);
			document.removeEventListener('keydown', close);
		};
	}, [open]);

	/** HANDLERS **/
	const downloadHandler = async (item: DownloadItem) => {
		setBusy(item.key);
		try {
			const response = await fetch(item.url);
			if (!response.ok) throw new Error(String(response.status));
			const href = URL.createObjectURL(await response.blob());
			const link = document.createElement('a');
			link.href = href;
			link.download = item.fileName;
			link.click();
			URL.revokeObjectURL(href);
		} catch {
			window.open(item.url, '_blank', 'noopener');
		} finally {
			setBusy('');
			setOpen(false);
		}
	};

	return (
		<div ref={boxRef} className={`download-menu ${props.placement ?? 'bottom'} ${props.className ?? ''}`}>
			<div
				role={'button'}
				tabIndex={0}
				className={'download-trigger'}
				aria-haspopup={'menu'}
				aria-expanded={open}
				onClick={() => setOpen(!open)}
				onKeyDown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						event.preventDefault();
						setOpen(!open);
					}
				}}
			>
				{props.children}
			</div>

			<AnimatePresence>
				{open && (
					<motion.div
						role={'menu'}
						className={'download-panel'}
						initial={{ opacity: 0, y: props.placement === 'top' ? 10 : -10, scale: 0.96 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: props.placement === 'top' ? 10 : -10, scale: 0.96 }}
						transition={{ duration: 0.25, ease: EASE }}
					>
						{groups.length === 0 && <p className={'download-empty'}>{t('download.empty')}</p>}
						{groups.map((group) => (
							<div key={group.key} className={'download-group'}>
								<span className={'group-title'}>{group.title}</span>
								{group.items.map((item) => (
									<button
										key={item.key}
										type={'button'}
										role={'menuitem'}
										className={'download-item'}
										disabled={busy === item.key}
										onClick={() => downloadHandler(item)}
									>
										<LuFileText className={'file-icon'} />
										<span className={'item-text'}>
											<strong>{item.language}</strong>
											<small>PDF</small>
										</span>
										<LuDownload className={`down-icon ${busy === item.key ? 'busy' : ''}`} />
									</button>
								))}
							</div>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default DownloadMenu;
