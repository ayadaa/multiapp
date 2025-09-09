import './src/config/firebase'; // Ensure Firebase is initialized first
import React from 'react';
// import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
// import { store } from './src/store';
import { AppNavigator } from './src/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { connectSocket } from "./src/utils/socket";
// import * as Firebase from './src/config/firebase';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/redux/store';

/**
 * Main App component for Snap Factor.
 * 
 * Handles app initialization, navigation setup, and global state management.
 * Provides authentication flow and main app navigation structure.
 */
export default function App() {
  // React.useEffect(() => {
  //   const unsubscribe = Firebase.auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       // Connect socket when user is authenticated
  //       connectSocket(user.uid);
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);
  return (
    // <Provider store={store}>
    //   <StatusBar style="dark" backgroundColor="#FFFFFF" />
    //   <GestureHandlerRootView style={{ flex: 1 }}>
    //     <AppNavigator />
    //   </GestureHandlerRootView>
    // </Provider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar style="dark" backgroundColor="#FFFFFF" />
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppNavigator />
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
