/**
 * Receive Screen
 * Displays user wallet QR code
 */
import QRCode from 'react-native-qrcode-svg';

import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { useAppSelector } from '../../store/hooks';
// import { Screen } from '../../components/common/Screen';

export function ReceiveScreen() {  
  const user = useAppSelector((state) => state.auth.user);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <QRCode
        // value="tteeee"
          value= {user?.uid}
          size={200}
          // logo={require('../assets/logo.png')}
          // logoSize={30}
          // logoBackgroundColor='transparent'
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#000000',
    backgroundColor: 'white',
    // justifyContent: "center", 
    // alignItems: "center" 
  },
  // content: {
  //   flex: 1,
  // },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});