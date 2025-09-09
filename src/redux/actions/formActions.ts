// import { registrationUser } from '../../firebase/services/authService';
// import { saveUserData } from '../../firebase/services/userService';
// import { validate } from '../../utils/validation';
// import { updateField, resetForm, updateError } from '../slices/formSlice';
// import { store } from '../store';

// export const updateFormField = (name, value) => {
// 	store.dispatch(updateField({ fieldName: name, value }));

// 	const state = store.getState().form.formData;
// 	const formData = { ...state, [name]: value };

// 	if (name === 'password' && formData.confirmPassword != '')
// 		store.dispatch(updateField({ fieldName: 'confirmPassword', value: '' }));

// 	const error = name == 'confirmPassword' ? validate.matchPasswords(formData.password, value) : validate[name](value);

// 	store.dispatch(updateError({ fieldName: name, error }));
// };

// export const submitForm = async () => {
// 	// TODO: дописати якщо такий користувач вже існує
// 	const state = store.getState().form;

// 	if (Object.keys(state.formErrors).length != 0) return;

// 	const newUser = state.formData;

// 	const newUserUid = await registrationUser(newUser.email, newUser.password);
// 	const dataNewUser = await saveUserData(newUserUid, newUser);

// 	if (dataNewUser) {
// 		store.dispatch(resetForm());
// 	}
// };