import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import useLocalTime from '../../hooks/useLocalTime';

const EASE = [0.22, 1, 0.36, 1] as const;

interface LiveClockProps {
	timeZone?: string;
}

/**
 * Live "HH:MM:SS" clock. Only the digits that change move: the old digit rolls up and blurs away
 * while the new one rises from below (an odometer). The seconds are tinted with the accent colour.
 */
const LiveClock = (props: LiveClockProps) => {
	const time = useLocalTime(props.timeZone);
	const reduceMotion = useReducedMotion();

	if (!time) return <span className={'live-clock'} />;

	return (
		<span className={'live-clock'} role={'timer'} aria-label={time}>
			{time.split('').map((char, index) => {
				if (char === ':') {
					return (
						<span key={`colon-${index}`} className={'colon'} aria-hidden={'true'}>
							:
						</span>
					);
				}
				return (
					<span key={`slot-${index}`} className={`digit-slot ${index >= 6 ? 'seconds' : ''}`} aria-hidden={'true'}>
						<AnimatePresence mode={'popLayout'} initial={false}>
							<motion.span
								key={char}
								className={'digit'}
								initial={reduceMotion ? { opacity: 0 } : { y: '100%', opacity: 0, filter: 'blur(4px)' }}
								animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
								exit={reduceMotion ? { opacity: 0 } : { y: '-100%', opacity: 0, filter: 'blur(4px)' }}
								transition={{ duration: 0.45, ease: EASE }}
							>
								{char}
							</motion.span>
						</AnimatePresence>
					</span>
				);
			})}
		</span>
	);
};

export default LiveClock;
