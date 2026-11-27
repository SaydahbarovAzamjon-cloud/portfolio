import React from 'react';
import { motion, MotionValue, useReducedMotion, useTransform } from 'motion/react';

interface RiseCardProps {
	className?: string;
	index: number;
	total: number;
	/** scroll progress of the whole card row (0 → 1) */
	progress: MotionValue<number>;
	children: React.ReactNode;
}

/**
 * A card that rises on its own slice of the row's scroll, strictly one after another
 * (the first one lands before the next one starts). Scrolling back reverses it.
 */
const RiseCard = (props: RiseCardProps) => {
	const reduceMotion = useReducedMotion();
	const range = reduceMotion ? 0 : 1;
	const slice = 1 / props.total;
	const start = props.index * slice;
	const end = start + slice * 0.9;
	const y = useTransform(props.progress, [start, end], [180 * range, 0]);
	const opacity = useTransform(props.progress, [start, start + slice * 0.5], [reduceMotion ? 1 : 0, 1]);
	const scale = useTransform(props.progress, [start, end], [1 - 0.06 * range, 1]);
	const rotate = useTransform(props.progress, [start, end], [(props.index % 2 ? 3 : -3) * range, 0]);
	return (
		<motion.article className={props.className} style={{ y, opacity, scale, rotate }}>
			{props.children}
		</motion.article>
	);
};

export default RiseCard;
