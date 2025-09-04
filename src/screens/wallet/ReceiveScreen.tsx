/**
 * Receive Screen
 * Displays user wallet QR code
 */
import QRCode from 'react-native-qrcode-svg';
import { Screen } from '../../components/common/Screen';

import React from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { useAppSelector } from '../../store/hooks';
// import { Screen } from '../../components/common/Screen';

export function ReceiveScreen() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <Screen backgroundColor="#FFFFFF" statusBarStyle="dark-content" keyboardAvoidingView={true} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.address}>Your Wallet address: {user?.uid}</Text>
        <QRCode
          // value="tteeee"
          value={user?.uid}
          size={200}
        // logo={require('../assets/logo.png')}
        // logoSize={30}
        // logoBackgroundColor='transparent'
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#000000',
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  address: {
    fontSize: 14,
    // fontWeight: 'bold',
    marginBottom: 10,
  },
});