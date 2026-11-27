import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import fixoraHome from '../../../public/img/projects/fixora-home.webp';
import carviaHome from '../../../public/img/projects/carvia-home.webp';
import gadgetStoreHome from '../../../public/img/projects/gadget-store-home.webp';

/** The delivered projects' home pages, shown one after another. */
const SLIDES = [
	{ name: 'Fixora', image: fixoraHome },
	{ name: 'CarVia', image: carviaHome },
	{ name: 'GadgetStore', image: gadgetStoreHome },
];
const INTERVAL = 4200;

/** Cross-fading project screenshots; each one drifts slowly left → right while it is on screen. */
const ProjectSlideshow = () => {
	const reduceMotion = useReducedMotion();
	const [current, setCurrent] = useState(0);

	/** LIFECYCLES **/
	useEffect(() => {
		if (reduceMotion) return;
		const timer = setInterval(() => setCurrent((index) => (index + 1) % SLIDES.length), INTERVAL);
		return () => clearInterval(timer);
	}, [reduceMotion]);

	const slide = SLIDES[current];

	return (
		<span className={'project-slideshow'}>
			<AnimatePresence initial={false}>
				<motion.span
					key={slide.name}
					className={'slide'}
					initial={{ opacity: 0, scale: 1.12, x: '-4%' }}
					animate={{ opacity: 1, scale: 1.12, x: '4%' }}
					exit={{ opacity: 0 }}
					transition={{
						opacity: { duration: 1.1, ease: 'easeInOut' },
						x: { duration: (INTERVAL + 1100) / 1000, ease: 'linear' },
					}}
				>
					<Image src={slide.image} alt={''} fill sizes={'(max-width: 768px) 90vw, 25vw'} />
				</motion.span>
			</AnimatePresence>
			{/* which project is showing */}
			<span className={'slide-name'}>{slide.name}</span>
		</span>
	);
};

export default ProjectSlideshow;
