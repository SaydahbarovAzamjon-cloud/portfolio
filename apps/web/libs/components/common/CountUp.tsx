import React, { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';

const EASE = [0.22, 1, 0.36, 1] as const;

interface CountUpProps {
	value: number;
	suffix?: string;
}

/** Counts up from 0 the first time it is on screen. */
const CountUp = (props: CountUpProps) => {
	const ref = useRef<HTMLSpanElement>(null);
	const inView = useInView(ref, { once: true, amount: 0.6 });
	const reduceMotion = useReducedMotion();
	const [shown, setShown] = useState<number>(0);

	/** LIFECYCLES **/
	useEffect(() => {
		if (!inView) return;
		const controls = animate(0, props.value, {
			duration: reduceMotion ? 0 : 1.4,
			ease: EASE,
			onUpdate: (latest) => setShown(Math.round(latest)),
		});
		return () => controls.stop();
	}, [inView, reduceMotion, props.value]);

	return (
		<span ref={ref}>
			{shown}
			{props.suffix}
		</span>
	);
};

export default CountUp;
