import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next/pages';
import { AnimatePresence, motion } from 'motion/react';
import { LuArrowUpRight, LuExternalLink } from 'react-icons/lu';

const EASE = [0.22, 1, 0.36, 1] as const;

/** The live products from the CV (text in live.<key>). */
const LIVE_PROJECTS = [
	{ key: 'fixora', name: 'Fixora', url: 'https://fixoranext.com' },
	{ key: 'carvia', name: 'CarVia', url: 'https://carvia.ai' },
	{ key: 'gadgetstore', name: 'GadgetStore', url: 'https://gadjetstore.uz' },
	{ key: 'foodai', name: 'FoodAI', url: 'https://foodtype.ai' },
];

/** "See It Live" button that opens a small menu of every live project. */
const LiveMenu = ({ className }: { className?: string }) => {
	const { t } = useTranslation('common');
	const [open, setOpen] = useState<boolean>(false);
	const boxRef = useRef<HTMLDivElement>(null);

	/** LIFECYCLES **/
	useEffect(() => {
		if (!open) return;
		// close on a click outside or Escape
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

	return (
		<div className={`live-menu ${className ?? ''}`} ref={boxRef}>
			<button type={'button'} className={'live-link'} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
				<span className={'live-icon'}>
					<LuExternalLink />
				</span>
				{t('live.button')}
			</button>
			<AnimatePresence>
				{open && (
					<motion.ul
						className={'live-list'}
						initial={{ opacity: 0, y: 10, scale: 0.97 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 6, scale: 0.98 }}
						transition={{ duration: 0.25, ease: EASE }}
					>
						{LIVE_PROJECTS.map((project) => (
							<li key={project.key}>
								<a href={project.url} target={'_blank'} rel={'noreferrer'} onClick={() => setOpen(false)}>
									<span className={'live-dot'} />
									<span className={'live-text'}>
										<strong>{project.name}</strong>
										<small>{t(`live.${project.key}`)}</small>
									</span>
									<LuArrowUpRight className={'live-arrow'} />
								</a>
							</li>
						))}
					</motion.ul>
				)}
			</AnimatePresence>
		</div>
	);
};

export default LiveMenu;
