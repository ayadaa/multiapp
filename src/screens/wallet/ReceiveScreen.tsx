/**
 * Receive Screen
 * Displays user wallet QR code
 */
import QRCode from 'react-native-qrcode-svg';
import { Screen } from '../../components/common/Screen2';

import React from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { useAppSelector } from '../../store/hooks';
// import { Screen } from '../../components/common/Screen';
import i18n from '../../language/i18n';

export function ReceiveScreen() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <Screen>
      <View style={styles.content}>
        <Text style={{ fontSize: 14 }}>{i18n.t('yourWalletAddress')}</Text>
        <Text selectable={true} style={styles.address}>{user?.uid}</Text>
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
  content: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    // backgroundColor: '#fff',
  },
  address: {
    fontSize: 14,
    // fontWeight: 'bold',
    marginBottom: 10,
  },
});