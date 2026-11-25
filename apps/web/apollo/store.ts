import { makeVar } from '@apollo/client';
import { Admin } from '../libs/types/auth/auth';

/** Logged-in admin (empty when nobody is logged in). */
export const adminVar = makeVar<Admin>({
	_id: '',
	email: '',
	role: '',
});
