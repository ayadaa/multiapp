import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './slices/auth.slice';
import ragReducer from './slices/rag.slice';
import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';


/**
 * Redux store configuration using Redux Toolkit.
 * Includes auth slice for Phase 0 and RAG slice for Phase 4.
 * Additional slices will be added in future phases.
 */

const persistConfig = {
	key: 'root',
	// storage,
  storage: AsyncStorage,
	version: 1,
};

const persistedUserReducer = persistReducer(persistConfig, authSlice.reducer);

export const store = configureStore({
  reducer: {
    auth: persistedUserReducer,
    rag: ragReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore Firebase Timestamp objects in actions/state
        ignoredActions: ['auth/setUser'],
        ignoredPaths: ['auth.user.createdAt', 'auth.user.lastLogin'],
      },
    }),
  devTools: __DEV__,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 
export const persistor = persistStore(store);
