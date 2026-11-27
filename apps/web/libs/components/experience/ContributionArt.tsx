import React, { useId } from 'react';

export type ContributionArtKind = 'fullstack' | 'ai' | 'backend' | 'deploy' | 'realtime' | 'plates';

/**
 * Glossy orange 3D-style illustrations (laptop, AI chip, server, cloud, live chat),
 * each standing on two soft plates. Drawn in SVG so they stay sharp at any size.
 */
const ContributionArt = ({ kind }: { kind: ContributionArtKind }) => {
	// unique gradient ids, so several illustrations can share one page
	const id = useId().replace(/:/g, '');
	const body = `url(#${id}-body)`;
	const light = `url(#${id}-light)`;
	const plate = `url(#${id}-plate)`;
	const glow = `url(#${id}-glow)`;

	return (
		<svg className={'contribution-art'} viewBox={'0 0 200 160'} aria-hidden={'true'}>
			<defs>
				<linearGradient id={`${id}-body`} x1={'0'} y1={'0'} x2={'0.4'} y2={'1'}>
					<stop offset={'0%'} stopColor={'#ffb27a'} />
					<stop offset={'55%'} stopColor={'#ff7a2a'} />
					<stop offset={'100%'} stopColor={'#f05a10'} />
				</linearGradient>
				<linearGradient id={`${id}-light`} x1={'0'} y1={'0'} x2={'0'} y2={'1'}>
					<stop offset={'0%'} stopColor={'#ffe4cf'} />
					<stop offset={'100%'} stopColor={'#ffb88a'} />
				</linearGradient>
				<linearGradient id={`${id}-plate`} x1={'0'} y1={'0'} x2={'1'} y2={'1'}>
					<stop offset={'0%'} stopColor={'#fff1e6'} />
					<stop offset={'100%'} stopColor={'#ffc9a3'} />
				</linearGradient>
				<linearGradient id={`${id}-glow`} x1={'0'} y1={'0'} x2={'0'} y2={'1'}>
					<stop offset={'0%'} stopColor={'#fff6c8'} />
					<stop offset={'100%'} stopColor={'#ffc23d'} />
				</linearGradient>
			</defs>

			{/* the two plates the object stands on */}
			<g className={'art-plates'}>
				<path
					d={'M 24 132 L 100 112 L 176 132 L 100 152 Z'}
					fill={'#ffc29a'}
					stroke={'#ffc29a'}
					strokeWidth={10}
					strokeLinejoin={'round'}
					transform={'translate(0 6)'}
				/>
				<path
					d={'M 24 132 L 100 112 L 176 132 L 100 152 Z'}
					fill={plate}
					stroke={'#ffe2cc'}
					strokeWidth={10}
					strokeLinejoin={'round'}
				/>
				<path
					d={'M 40 122 L 100 106 L 160 122 L 100 138 Z'}
					fill={'#ffb88a'}
					stroke={'#ffb88a'}
					strokeWidth={8}
					strokeLinejoin={'round'}
					transform={'translate(0 5)'}
				/>
				<path
					d={'M 40 122 L 100 106 L 160 122 L 100 138 Z'}
					fill={light}
					stroke={'#ffe8d6'}
					strokeWidth={8}
					strokeLinejoin={'round'}
				/>
			</g>

			<g className={'art-object'}>
				{kind === 'fullstack' && (
					<>
						{/* keyboard deck */}
						<path
							d={'M 46 112 L 70 92 L 150 92 L 158 112 Z'}
							fill={light}
							stroke={'#ffd2b0'}
							strokeWidth={4}
							strokeLinejoin={'round'}
						/>
						<path
							d={'M 62 106 L 76 96 L 144 96 L 150 106 Z'}
							fill={'none'}
							stroke={'#ff9a5a'}
							strokeWidth={1.5}
							strokeDasharray={'4 3'}
						/>
						{/* screen */}
						<rect x={68} y={26} width={82} height={64} rx={9} fill={body} />
						<rect x={75} y={33} width={68} height={50} rx={5} fill={'#ff8a3d'} stroke={'#ffd0ad'} strokeWidth={2} />
						<path d={'M 75 34 L 143 34 L 143 50 Q 110 44 75 58 Z'} fill={'#fff'} opacity={0.18} />
						<text x={109} y={66} textAnchor={'middle'} fontSize={22} fontWeight={800} fill={'#fff'}>
							{'</>'}
						</text>
					</>
				)}

				{kind === 'ai' && (
					<>
						{/* pins on all four sides */}
						{[0, 1, 2, 3, 4].map((pin) => (
							<React.Fragment key={pin}>
								<rect x={72 + pin * 12} y={22} width={6} height={14} rx={3} fill={'#ffa24d'} />
								<rect x={72 + pin * 12} y={100} width={6} height={14} rx={3} fill={'#ffa24d'} />
								<rect x={56} y={40 + pin * 12} width={14} height={6} rx={3} fill={'#ffa24d'} />
								<rect x={130} y={40 + pin * 12} width={14} height={6} rx={3} fill={'#ffa24d'} />
							</React.Fragment>
						))}
						<rect x={66} y={32} width={68} height={72} rx={14} fill={body} />
						<rect x={76} y={43} width={48} height={50} rx={8} fill={'none'} stroke={'#ffe0c6'} strokeWidth={2.5} />
						<path d={'M 66 46 Q 66 32 80 32 L 120 32 Q 100 42 66 66 Z'} fill={'#fff'} opacity={0.22} />
						<text x={100} y={77} textAnchor={'middle'} fontSize={24} fontWeight={800} fill={'#fff'}>
							{'AI'}
						</text>
					</>
				)}

				{kind === 'backend' && (
					<>
						{[0, 1].map((row) => {
							const y = 30 + row * 40;
							return (
								<g key={row}>
									{/* top face, then the front face of each server unit */}
									<path d={`M 60 ${y + 8} L 76 ${y} L 148 ${y} L 140 ${y + 8} Z`} fill={'#ffd2b0'} />
									<rect x={60} y={y + 8} width={80} height={28} rx={7} fill={body} />
									<path d={`M 140 ${y + 8} L 148 ${y} L 148 ${y + 28} L 140 ${y + 36} Z`} fill={'#e8560f'} />
									<circle cx={74} cy={y + 22} r={4.5} fill={'#fff'} />
									<circle cx={88} cy={y + 22} r={4.5} fill={'#fff'} opacity={0.85} />
									<rect x={102} y={y + 19} width={28} height={6} rx={3} fill={'#ffe0c6'} />
								</g>
							);
						})}
					</>
				)}

				{kind === 'deploy' && (
					<>
						<path
							d={'M 62 98 Q 42 98 44 80 Q 46 64 64 64 Q 66 40 92 38 Q 116 36 124 56 Q 148 52 154 74 Q 158 98 134 98 Z'}
							fill={body}
						/>
						<path d={'M 64 66 Q 68 44 92 42 Q 110 41 118 54 Q 96 50 76 70 Z'} fill={'#fff'} opacity={0.25} />
						{/* the upload arrow */}
						<path
							d={'M 100 50 L 118 72 L 107 72 L 107 104 L 93 104 L 93 72 L 82 72 Z'}
							fill={glow}
							stroke={'#fff3d6'}
							strokeWidth={2}
							strokeLinejoin={'round'}
						/>
					</>
				)}

				{kind === 'realtime' && (
					<>
						{/* back bubble (reply), then the front bubble with typing dots */}
						<path
							d={
								'M 104 40 L 146 40 Q 156 40 156 50 L 156 72 Q 156 82 146 82 L 142 82 L 146 94 L 130 82 L 104 82 Q 94 82 94 72 L 94 50 Q 94 40 104 40 Z'
							}
							fill={light}
							stroke={'#ffe8d6'}
							strokeWidth={2}
						/>
						<path
							d={
								'M 56 58 L 112 58 Q 124 58 124 70 L 124 94 Q 124 106 112 106 L 76 106 L 60 118 L 64 106 L 56 106 Q 44 106 44 94 L 44 70 Q 44 58 56 58 Z'
							}
							fill={body}
						/>
						<path d={'M 46 70 Q 48 60 58 60 L 104 60 Q 76 66 46 86 Z'} fill={'#fff'} opacity={0.22} />
						{[66, 84, 102].map((cx, dot) => (
							<circle key={cx} className={`typing-dot dot-${dot}`} cx={cx} cy={83} r={5.5} fill={'#fff'} />
						))}
						{/* the live bolt */}
						<path
							d={'M 136 18 L 122 44 L 134 44 L 128 64 L 148 34 L 136 34 L 142 18 Z'}
							fill={glow}
							stroke={'#fff3d6'}
							strokeWidth={2}
							strokeLinejoin={'round'}
						/>
					</>
				)}
			</g>
		</svg>
	);
};

export default ContributionArt;
