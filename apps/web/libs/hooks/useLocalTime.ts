import { useEffect, useState } from 'react';

/** "20:14" in the given time zone, updated every 30 s. Empty until mounted (no hydration mismatch). */
const useLocalTime = (timeZone: string = 'Asia/Seoul'): string => {
	const [time, setTime] = useState<string>('');

	/** LIFECYCLES **/
	useEffect(() => {
		const update = () =>
			setTime(
				new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone }).format(
					new Date(),
				),
			);
		update();
		const timer = setInterval(update, 30_000);
		return () => clearInterval(timer);
	}, [timeZone]);

	return time;
};

export default useLocalTime;
