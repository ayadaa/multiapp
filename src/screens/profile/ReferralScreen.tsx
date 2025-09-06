import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Screen } from '../../components/common/Screen';
import { useAppSelector } from '../../store/hooks';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export function ReferralScreen() {
  const user = useAppSelector((state) => state.auth.user);
  const navigation = useNavigation<any>();

  return (
    <Screen backgroundColor="#FFFFFF" statusBarStyle="dark-content" keyboardAvoidingView={true} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.title}>Referral</Text>
      </View>
      <View style={styles.content}>
        <Text style={{ fontSize: 14 }}>Send your referral code for your frineds and get income about 3% for each collection operation.</Text>
        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Your referral code:</Text>
        <Text selectable={true} style={styles.address}>{user?.uid}</Text>
        <QRCode
          value={user?.uid}
          size={200}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 500,
    color: 'Black',
    marginBottom: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: '#FFFFFF',
  },
  headerBackButton: {
    padding: 8,
    marginRight: 8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  address: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
