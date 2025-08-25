import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useAppSelector } from '../../store/hooks';
import { useUser } from '../../hooks/user/use-user';
import { useP2PAds } from '../../hooks/p2pAd/use-p2pAds';
// import { sendSchema, type SendFormData } from '../../utils/validation/wallet-schemas';
import { createP2PPaymentSchema, type CreateP2PPaymentFormData } from '../../utils/validation/p2p-schemas';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

interface SendFormProps {
  onSuccess?: () => void;
  onNavigateToP2PAds?: () => void;
}

export const P2PPaymentMethods = {
  zainCash: 'zainCash',
  zainCashBusiness: 'zainCashBusiness',
  alRafidainQiServices: 'alRafidainQiServices',
  asiaHawala: 'asiaHawala',
  firstIraqiBank: 'firstIraqiBank',
  fastPay: 'fastPay',
}

export function P2PCreateAdForm({ onSuccess, onNavigateToP2PAds }: SendFormProps) {
  const user = useAppSelector((state) => state.auth.user);
  const { createP2PPayment, error, isLoading } = useP2PAds();
  const [amountCheckLoading, setAmountCheckLoading] = useState<boolean>(false);
  const [priceCheckLoading, setPriceCheckLoading] = useState<boolean>(false);
  const [amountSufficient, setAmountSufficient] = useState<boolean | null>(null);
  const [priceSufficient, setPriceSufficient] = useState<boolean | null>(null);
  const { User, isLoadingUser, userError, refreshUser } = useUser(user?.uid || '');
  const navigation = useNavigation<any>();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<CreateP2PPaymentFormData>({
    resolver: yupResolver(createP2PPaymentSchema),
    mode: 'onBlur',
    defaultValues: {
      method: '',
      amount: '',
      price: '',
    },
  });

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
  const getAmountStatus = () => {
    if (!watchedAmount) return null;
    if (amountCheckLoading) return { color: '#007AFF', text: 'Checking...' };
    if (amountSufficient === true) return { color: '#34C759', text: 'Your balance is enogh' };
    if (amountSufficient === false) return { color: '#FF3B30', text: 'Your balance is not enough to send create p2p ad' };
    return null;
  };
  const amountStatus = getAmountStatus();


  const watchedPrice = watch('price')
  const checkPrice = (price: number) => {
    if (!User) return null;
    refreshUser();
    setPriceCheckLoading(true);
    if (price > 0) {
      setPriceSufficient(true);
    } else {
      setPriceSufficient(false);
    }
    setPriceCheckLoading(false);
  }
  // Check price sufficiently when it changes
  useEffect(() => {
    if (watchedPrice) {
      const timeoutId = setTimeout(() => {
        checkPrice((watchedPrice || 0) as number)
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }, [watchedPrice, checkPrice])
  const getPriceStatus = () => {
    if (!watchedPrice) return null;
    if (priceCheckLoading) return { color: '#007AFF', text: 'Checking...' };
    if (priceSufficient === true) return { color: '#34C759', text: 'Your price is suitable' };
    if (priceSufficient === false) return { color: '#FF3B30', text: 'Your price is not suitable' };
    return null;
  };
  const priceStatus = getPriceStatus();


  const onSubmit = async (data: CreateP2PPaymentFormData) => {
    // clearAuthError();

    // const result = await createP2PPayment(user?.uid || '', User?.username || 'Username', (data.amount || 0) as number, data.method, (data.price || 0) as number)
    const result = await createP2PPayment(user?.uid || '', (data.amount || 0) as number, data.method, (data.price || 0) as number)
    if (result.success) {
      reset();
      // onSuccess?.();
    }
  };

  return (
    <View style={{ width: '100%' }}>
      {/* Form Fields */}
      {/* <View style={{ marginBottom: 24 }}> */}
      {/* amount */}
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
      {/* price */}
      <Controller
        control={control}
        name="price"
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <Input
              label="Price"
              placeholder="Place an price"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="numeric"
              autoCapitalize="none"
              error={errors.price?.message}
            />
            {priceStatus && (
              <Text style={{
                color: priceStatus.color,
                fontSize: 12,
                marginTop: 4,
                marginLeft: 4
              }}>
                {priceStatus.text}
              </Text>
            )}
          </View>
        )}
      />
      {/* method */}
      <Controller
        control={control}
        name="method"
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#000000',
                marginBottom: 8,
              }}
            >Method</Text>
            <Picker
              selectedValue={value}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 1)',
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                color: '#000000',
                borderWidth: 1,
                borderColor: 'rgba(0, 0, 0, 0.5)',
              }}
              // onValueChange={onChange}
              onValueChange={(itemValue) => onChange(itemValue)}
              onBlur={onBlur}
            >
              <Picker.Item label={P2PPaymentMethods.zainCash} value={P2PPaymentMethods.zainCash} />
              <Picker.Item label={P2PPaymentMethods.zainCashBusiness} value={P2PPaymentMethods.zainCash} />
              <Picker.Item label={P2PPaymentMethods.alRafidainQiServices} value={P2PPaymentMethods.alRafidainQiServices} />
              <Picker.Item label={P2PPaymentMethods.fastPay} value={P2PPaymentMethods.fastPay} />
              <Picker.Item label={P2PPaymentMethods.firstIraqiBank} value={P2PPaymentMethods.firstIraqiBank} />
              <Picker.Item label={P2PPaymentMethods.asiaHawala} value={P2PPaymentMethods.asiaHawala} />
            </Picker>
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
      <Button
        title="Create p2p payment ad"
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
        disabled={!isValid || amountSufficient === false}
        style={{ marginTop: 16 }}
      />
      {/* </View> */}
    </View>
  );
} 
