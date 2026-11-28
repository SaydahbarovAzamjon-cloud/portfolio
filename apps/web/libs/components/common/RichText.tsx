import React from 'react';

interface RichTextProps {
	/** Plain text: *words in stars* are emphasised (<em>), _words_ are underlined. Same markers as ScrollRevealText. */
	text: string;
	className?: string;
	as?: 'p' | 'span';
}

/** Static text with the site's emphasis markers, for short texts that don't need the scroll fill. */
const RichText = ({ text, className, as = 'p' }: RichTextProps) => {
	const Tag = as;
	// split into plain runs and marked runs: "*a*" → em, "_a_" → underline
	const parts = text.split(/(\*[^*]+\*|_[^_]+_)/g).filter(Boolean);
	return (
		<Tag className={`rich-text ${className ?? ''}`}>
			{parts.map((part, index) => {
				if (part.startsWith('*') && part.endsWith('*')) return <em key={index}>{part.slice(1, -1)}</em>;
				if (part.startsWith('_') && part.endsWith('_'))
					return (
						<span key={index} className={'underlined'}>
							{part.slice(1, -1)}
						</span>
					);
				return <React.Fragment key={index}>{part}</React.Fragment>;
			})}
		</Tag>
	);
};

export default RichText;
