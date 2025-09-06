import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useAppSelector } from '../../store/hooks';
import { useUser } from '../../hooks/user/use-user';
import { useWallet } from '../../hooks/wallet/use-wallet';
import { sendSchema, type SendFormData } from '../../utils/validation/wallet-schemas';
// import { useNavigation } from '@react-navigation/native';
// import AntDesign from '@expo/vector-icons/AntDesign';

interface SendFormProps {
  onSuccess?: () => void;
  onNavigateToWallet?: () => void;
  qrData?: any;
}

export function SendForm({ onSuccess, onNavigateToWallet, qrData }: SendFormProps) {
  // export function SendForm() {
  const user = useAppSelector((state) => state.auth.user);
  const { sendAssets, checkAddress, addressCheckLoading, addressExist, error, isLoading } = useWallet(user?.uid!);
  const [amountCheckLoading, setAmountCheckLoading] = useState<boolean>(false);
  const [amountSufficient, setAmountSufficient] = useState<boolean | null>(null);
  const { User, isLoadingUser, userError, refreshUser } = useUser(user?.uid || '');
  // const navigation = useNavigation<any>();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<SendFormData>({
    resolver: yupResolver(sendSchema),
    mode: 'onBlur',
    defaultValues: {
      address: '',
      amount: '',
    },
  });

  const watchedAddress = watch('address');

  // Check address availability when it changes
  useEffect(() => {
    if (watchedAddress && watchedAddress.length >= 3) {
      const timeoutId = setTimeout(() => {
        checkAddress(watchedAddress);
      }, 500); // Debounce for 500ms

      return () => clearTimeout(timeoutId);
    }
  }, [watchedAddress, checkAddress]);

  const watchedAmount = watch('amount')

  const checkAmount = (amount: number) => {
    if (!User) return null;
    refreshUser();
    setAmountCheckLoading(true);
    if (User?.balance! >= amount) {
      setAmountSufficient(true);
    } else {
      setAmountSufficient(false);
    }
    setAmountCheckLoading(false);
  }

  // Check amount sufficiently when it changes
  useEffect(() => {
    if (watchedAmount) {
      const timeoutId = setTimeout(() => {
        checkAmount((watchedAmount || 0) as number)
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }, [watchedAmount, checkAmount])



  const onSubmit = async (data: SendFormData) => {
    // clearAuthError();

    const result = await sendAssets(user?.uid || '', data.address, (data.amount || 0) as number);

    if (result.success) {
      reset();
      // onSuccess?.();
    }
  };

  const getAddressStatus = () => {
    if (!watchedAddress || watchedAddress.length < 3) return null;
    if (addressCheckLoading) return { color: '#007AFF', text: 'Checking...' };
    if (addressExist === true) return { color: '#34C759', text: 'Exist' };
    if (addressExist === false) return { color: '#FF3B30', text: 'Not exist' };
    return null;
  };

  const addressStatus = getAddressStatus();

  const getAmountStatus = () => {
    if (!watchedAmount) return null;
    if (amountCheckLoading) return { color: '#007AFF', text: 'Checking...' };
    if (amountSufficient === true) return { color: '#34C759', text: 'Your balance is enogh' };
    if (amountSufficient === false) return { color: '#FF3B30', text: 'Your balance is not enough to send assets' };
    return null;
  };

  const amountStatus = getAmountStatus();

  // const navigateToScan = () => {
  //   navigation.navigate('Scan');
  // };

  return (
    <View style={{ width: '100%' }}>
      {/* Form Fields */}
      <Controller
        control={control}
        name="address"
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <Input
              label="Address"
              placeholder="Place an address"
              value={value || qrData}
              onChangeText={onChange}
              onBlur={onBlur}
              isAddress
              autoCapitalize="none"
              error={errors.address?.message}
            />
            {addressStatus && (
              <Text style={{
                color: addressStatus.color,
                fontSize: 12,
                marginTop: 4,
                marginLeft: 4
              }}>
                {addressStatus.text}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="amount"
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <Input
              label="Amount"
              placeholder="Place an amount"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="numeric"
              autoCapitalize="none"
              // autoComplete="number" //ayad
              error={errors.amount?.message}
            />
            {amountStatus && (
              <Text style={{
                color: amountStatus.color,
                fontSize: 12,
                marginTop: 4,
                marginLeft: 4
              }}>
                {amountStatus.text}
              </Text>
            )}
          </View>
        )}
      />
      {/* Global Error Message */}
      {error && (
        <View style={{ marginTop: 8 }}>
          <Text style={{ color: '#FF3B30', fontSize: 14, textAlign: 'center' }}>
            {error}
          </Text>
        </View>
      )}

      {/* Submit Button */}
      {/* <View style={{
          padding: 16,
          marginTop: 16,
          backgroundColor: 'rgba(255, 255, 255, 1)',
          borderTopWidth: 1,
          borderTopColor: 'rgba(0, 0, 0, 0.05)',
        }}> */}
      <Button
        title="Send Assets"
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
        disabled={!isValid || addressExist === false || amountSufficient === false}
        style={{ marginTop: 16 }}
      />
      {/* </View> */}
    </View>
  );
} 
