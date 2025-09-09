import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './slices/userSlice';
import formReducer from './slices/formSlice';
// import { websocketMiddleware } from '../websocket/websocketMiddleware';
import websocketReducer from './slices/websocketSlice';

const persistConfig = {
	key: 'root',
	storage,
	version: 1,
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
	reducer: {
		user: persistedUserReducer,
		form: formReducer,
		websocket: websocketReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [
					'persist/PERSIST',
					'persist/REHYDRATE',
					'persist/PAUSE',
					'persist/FLUSH',
					'persist/PURGE',
					'persist/REGISTER',
				],
			},
			// }).concat(websocketMiddleware),
		}),
});

export const persistor = persistStore(store);