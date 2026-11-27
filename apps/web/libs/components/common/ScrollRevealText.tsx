import React, { useRef } from 'react';
import { motion, MotionValue, useReducedMotion, useScroll, useTransform } from 'motion/react';

interface ScrollRevealTextProps {
	/** Plain text. "\n" starts a new line; *words in stars* are emphasised (<em>); _words_ are underlined. */
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

interface Word {
	text: string;
	em: boolean;
	underline: boolean;
	lineBreak: boolean;
	start: number;
}

const Letter = (props: LetterProps) => {
	const opacity = useTransform(props.progress, props.range, [props.dim, 1]);
	return <motion.span style={{ opacity }}>{props.char}</motion.span>;
};

/** Splits the text into words, remembering emphasis, underline, line breaks and where each word starts. */
const toWords = (text: string): Word[] => {
	const words: Word[] = [];
	let em = false;
	let underline = false;
	let start = 0;
	text.split('\n').forEach((line, lineIndex) => {
		line
			.split(' ')
			.filter(Boolean)
			.forEach((raw, wordIndex) => {
				// markers may stack: *_word_* or _*word*_
				const core = raw.replace(/^[*_]+/, '');
				const lead = raw.slice(0, raw.length - core.length);
				// closing markers may be followed by punctuation: "engineer*," → text "engineer,", closes "*"
				const closing = core.match(/^(.*?)([*_]+)([.,;:!?)'"]*)$/);
				const clean = closing ? closing[1] + closing[3] : core;
				const trail = closing ? closing[2] : '';
				if (lead.includes('*')) em = true;
				if (lead.includes('_')) underline = true;
				words.push({ text: clean, em, underline, lineBreak: lineIndex > 0 && wordIndex === 0, start });
				start += clean.length + 1;
				if (trail.includes('*')) em = false;
				if (trail.includes('_')) underline = false;
			});
	});
	return words;
};

/**
 * Paragraph that "fills in" while you scroll: letters start faded and turn solid one by one,
 * from the first to the last, as the paragraph moves up the screen.
 */
const ScrollRevealText = (props: ScrollRevealTextProps) => {
	const ref = useRef<HTMLParagraphElement>(null);
	const reduceMotion = useReducedMotion();
	const dim = props.dim ?? 0.22;
	const plain = props.text.replace(/[*_]/g, '').replace(/\n/g, ' ');

	/** the fill starts when the paragraph enters the lower part of the screen and ends near the middle **/
	const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] });

	const words = toWords(props.text);
	const total = Math.max(1, plain.length);

	if (reduceMotion) {
		return (
			<p className={props.className}>
				{words.map((word, index) => {
					const Tag = word.em ? 'em' : 'span';
					return (
						<React.Fragment key={index}>
							{word.lineBreak && <br />}
							<Tag className={word.underline ? 'underlined' : undefined}>{word.text}</Tag>
							{index < words.length - 1 ? ' ' : ''}
						</React.Fragment>
					);
				})}
			</p>
		);
	}

	return (
		<p ref={ref} className={props.className} aria-label={plain}>
			{words.map((word, wordIndex) => {
				const Tag = word.em ? 'em' : 'span';
				return (
					// words stay unbroken (the space sits outside so lines can wrap); each letter has its own slice of the scroll
					<React.Fragment key={`${word.text}-${wordIndex}`}>
						{word.lineBreak && <br />}
						<Tag className={`reveal-word ${word.underline ? 'underlined' : ''}`} aria-hidden={'true'}>
							{word.text.split('').map((char, charIndex) => {
								const at = (word.start + charIndex) / total;
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
						</Tag>
						{wordIndex < words.length - 1 ? ' ' : ''}
					</React.Fragment>
				);
			})}
		</p>
	);
};

export default ScrollRevealText;
