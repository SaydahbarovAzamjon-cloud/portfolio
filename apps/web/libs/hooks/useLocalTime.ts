import { useEffect, useState } from 'react';

/**
 * "20:14:37" in the given time zone, updated every second.
 * Empty until mounted, so the server HTML and the browser never disagree.
 */
const useLocalTime = (timeZone: string = 'Asia/Seoul'): string => {
	const [time, setTime] = useState<string>('');

	/** LIFECYCLES **/
	useEffect(() => {
		const format = new Intl.DateTimeFormat('en-GB', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false,
			timeZone,
		});
		const update = () => setTime(format.format(new Date()));
		update();

		// start on the next full second, then tick every second
		let timer: ReturnType<typeof setInterval> | undefined;
		const align = setTimeout(() => {
			update();
			timer = setInterval(update, 1000);
		}, 1000 - (Date.now() % 1000));

		return () => {
			clearTimeout(align);
			if (timer) clearInterval(timer);
		};
	}, [timeZone]);

	return time;
};

export default useLocalTime;
