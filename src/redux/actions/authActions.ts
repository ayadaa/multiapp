// import { signInUser, signOutUser } from '../../firebase/services/authService';
import { signInWithEmail as signInUser, signUpWithEmail, signOutUser, resetPassword } from '../../services/firebase/auth';
import { clearUser, setUser } from '../slices/userSlice';
import { store } from '../store';

export const loginUser = async (email: string, password: string) => {
	console.log(email, password);
	try {
		const userData = await signInUser({email, password});
		store.dispatch(setUser(userData));
		console.log('User data:', userData);
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
};

export const outUser = async () => {
	try {
		await signOutUser();
		store.dispatch(clearUser());
	} catch (error) {
		console.error(error);
	}
};
