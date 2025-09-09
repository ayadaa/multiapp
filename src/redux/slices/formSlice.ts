import { createSlice } from '@reduxjs/toolkit';

type InitialState = {
	formData: any;
	formErrors: any;
}

const initialState: InitialState = {
	formData: {},
	formErrors: {},
};

const formSlice = createSlice({
	name: 'form',
	initialState,
	reducers: {
		updateField(state, action) {
			const { fieldName, value } = action.payload;
			state.formData[fieldName] = value;
		},

		resetForm(state) {
			state.formData = initialState.formData;
		},

		updateError(state, action) {
			const { fieldName, error } = action.payload;
			error ? (state.formErrors[fieldName] = error) : delete state.formErrors[fieldName];
		},
	},
});

export const { updateField, resetForm, updateError } = formSlice.actions;
export default formSlice.reducer;
