import { useEffect, useState } from 'react';

/**
 * True once the given date has passed (checked in the browser, so the server HTML and the
 * first browser render always agree). Used for "in progress" → "completed" without editing anything.
 */
const useIsPast = (date?: string | null): boolean => {
	const [past, setPast] = useState<boolean>(false);

	/** LIFECYCLES **/
	useEffect(() => {
		if (!date) return;
		const check = () => setPast(Date.now() >= new Date(date).getTime());
		// run after paint so it is not a synchronous update inside the effect
		const timer = setTimeout(check, 0);
		return () => clearTimeout(timer);
	}, [date]);

	return past;
};

export default useIsPast;
