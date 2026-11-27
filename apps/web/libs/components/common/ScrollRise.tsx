import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

interface ScrollRiseProps {
	children: React.ReactNode;
	/** class for the moving element (keeps the old element's styles) */
	className?: string;
	/** 0, 1, 2 …: later items start later, so a header comes in piece by piece */
	order?: number;
}

/**
 * Scroll-linked rise (same feel as the Education cards): the block starts lower, a bit smaller and
 * faded, and settles into place while it scrolls up the screen. Scrolling back reverses it.
 * The outer box only measures (it never moves), so the scroll maths is not thrown off by the motion.
 */
const ScrollRise = (props: ScrollRiseProps) => {
	const ref = useRef<HTMLDivElement>(null);
	const reduceMotion = useReducedMotion();
	const order = props.order ?? 0;

	/** 0 when the block enters the bottom of the screen, 1 when its top reaches 55% from the top **/
	const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.55'] });
	const range = reduceMotion ? 0 : 1;
	const start = Math.min(order * 0.14, 0.5);
	const end = Math.min(start + 0.55, 1);
	const y = useTransform(scrollYProgress, [start, end], [110 * range, 0]);
	const opacity = useTransform(scrollYProgress, [start, start + 0.3], [reduceMotion ? 1 : 0, 1]);
	const scale = useTransform(scrollYProgress, [start, end], [1 - 0.04 * range, 1]);

	return (
		<div ref={ref} className={'scroll-rise'}>
			<motion.div className={props.className} style={{ y, opacity, scale }}>
				{props.children}
			</motion.div>
		</div>
	);
};

export default ScrollRise;
