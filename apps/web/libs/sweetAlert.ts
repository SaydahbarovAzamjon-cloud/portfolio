import Swal from 'sweetalert2';
import { Messages } from './config';

export const sweetErrorHandling = async (err: Error) => {
	await Swal.fire({
		icon: 'error',
		text: err.message ?? Messages.error1,
		showConfirmButton: false,
	});
};

export const sweetTopSuccessAlert = async (msg: string, duration: number = 2000) => {
	await Swal.fire({
		position: 'center',
		icon: 'success',
		title: msg,
		showConfirmButton: false,
		timer: duration,
	});
};

export const sweetConfirmAlert = async (msg: string): Promise<boolean> => {
	const response = await Swal.fire({
		icon: 'question',
		text: msg,
		showCancelButton: true,
		showConfirmButton: true,
		confirmButtonColor: '#ff3d00',
		cancelButtonColor: '#bdbdbd',
	});
	return Boolean(response?.isConfirmed);
};

export const sweetErrorAlert = async (msg: string, duration: number = 3000) => {
	await Swal.fire({
		icon: 'error',
		title: msg,
		showConfirmButton: false,
		timer: duration,
	});
};

export const sweetMixinSuccessAlert = async (msg: string, duration: number = 2000) => {
	await Swal.fire({
		icon: 'success',
		title: msg,
		showConfirmButton: false,
		timer: duration,
	});
};

export const sweetTopSmallSuccessAlert = async (msg: string, duration: number = 2000) => {
	const Toast = Swal.mixin({
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		timer: duration,
		timerProgressBar: true,
	});
	await Toast.fire({ icon: 'success', title: msg });
};
