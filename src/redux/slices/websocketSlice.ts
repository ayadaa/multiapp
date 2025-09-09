import { createSlice } from '@reduxjs/toolkit';

const websocketSlice = createSlice({
	name: 'websocket',
	initialState: {
		isConnected: false,
		lastMessage: null,
	},
	reducers: {
		setConnected: (state, action) => {
			state.isConnected = action.payload;
		},
		setMessage: (state, action) => {
			state.lastMessage = action.payload;
		},
	},
});

export const { setConnected, setMessage } = websocketSlice.actions;
export default websocketSlice.reducer;
