import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

/** Smooth (inertia) scrolling for the whole site. Off when the visitor prefers reduced motion. */
const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();

	/** LIFECYCLES **/
	useEffect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		if (router.pathname.startsWith('/_admin')) return;

		// lower lerp = softer glide; wheelMultiplier < 1 = each wheel step travels less (slower, calmer pages)
		const lenis = new Lenis({ autoRaf: true, lerp: 0.07, wheelMultiplier: 0.8, anchors: true });
		return () => lenis.destroy();
	}, [router.pathname]);

	return <>{children}</>;
};

export default SmoothScroll;
