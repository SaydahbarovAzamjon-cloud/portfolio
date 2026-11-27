import React, { useRef } from 'react';
import { motion, MotionValue, useReducedMotion, useScroll, useTransform } from 'motion/react';

interface ScrollRevealTextProps {
	text: string;
	className?: string;
	/** How faded the not-yet-read letters are (0 – 1). */
	dim?: number;
}

interface LetterProps {
	char: string;
	progress: MotionValue<number>;
	range: [number, number];
	dim: number;
}

const Letter = (props: LetterProps) => {
	const opacity = useTransform(props.progress, props.range, [props.dim, 1]);
	return <motion.span style={{ opacity }}>{props.char}</motion.span>;
};

/**
 * Paragraph that "fills in" while you scroll: letters start faded and turn solid one by one,
 * from the first to the last, as the paragraph moves up the screen.
 */
const ScrollRevealText = (props: ScrollRevealTextProps) => {
	const ref = useRef<HTMLParagraphElement>(null);
	const reduceMotion = useReducedMotion();
	const dim = props.dim ?? 0.22;

	/** the fill starts when the paragraph enters the lower part of the screen and ends near the middle **/
	const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] });

	if (reduceMotion) return <p className={props.className}>{props.text}</p>;

	const words = props.text.split(' ');
	const total = props.text.length;
	// where each word starts in the whole text (letters + spaces before it)
	const starts = words.map((_, index) => words.slice(0, index).reduce((sum, word) => sum + word.length + 1, 0));

	return (
		<p ref={ref} className={props.className} aria-label={props.text}>
			{words.map((word, wordIndex) => {
				const start = starts[wordIndex];
				return (
					// words stay unbroken (the space sits outside so lines can wrap); each letter has its own slice of the scroll
					<React.Fragment key={`${word}-${wordIndex}`}>
						<span className={'reveal-word'} aria-hidden={'true'}>
							{word.split('').map((char, charIndex) => {
								const at = (start + charIndex) / total;
								return (
									<Letter
										key={charIndex}
										char={char}
										progress={scrollYProgress}
										range={[at, Math.min(1, at + 1 / total + 0.02)]}
										dim={dim}
									/>
								);
							})}
						</span>
						{wordIndex < words.length - 1 ? ' ' : ''}
					</React.Fragment>
				);
			})}
		</p>
	);
};

export default ScrollRevealText;
