import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	email: null,
	uid: null,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser(state, action) {
			state.email = action.payload.email;
			state.uid = action.payload.uid;
		},
		clearUser(state) {
			state.email = null;
			state.uid = null;
		},
	},
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
