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
import { createP2PPaymentSchema, type CreateP2PPaymentFormData } from '../../utils/validation/wallet-schemas';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

interface SendFormProps {
  onSuccess?: () => void;
  onNavigateToWallet?: () => void;
}

export const P2PPaymentMethods = {
    zainCash: 'zainCash',
    zainCashBusiness: 'zainCashBusiness',
    alRafidainQiServices: 'alRafidainQiServices',
    asiaHawala: 'asiaHawala',
    firstIraqiBank: 'firstIraqiBank',
    fastPay: 'fastPay',
}

export function P2PCreateAdForm({ onSuccess, onNavigateToWallet }: SendFormProps) {
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

  // const watchedAddress = watch('address');

  // Check address availability when it changes
  // useEffect(() => {
  //   if (watchedAddress && watchedAddress.length >= 3) {
  //     const timeoutId = setTimeout(() => {
  //       checkAddress(watchedAddress);
  //     }, 500); // Debounce for 500ms

  //     return () => clearTimeout(timeoutId);
  //   }
  // }, [watchedAddress, checkAddress]);

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
    if (amountSufficient === false) return { color: '#FF3B30', text: 'Your balance is not enough to send assets' };
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
    
    // const result = await sendAssets(user?.uid || '', data.address, (data.amount || 0) as number);
    const result = await createP2PPayment(user?.uid || '', (data.amount || 0) as number, data.method, (data.price || 0) as number)
    if (result.success) {
      reset();
      // onSuccess?.();
    }
  };

  // const getAddressStatus = () => {
  //   if (!watchedAddress || watchedAddress.length < 3) return null;
  //   if (addressCheckLoading) return { color: '#007AFF', text: 'Checking...' };
  //   if (addressExist === true) return { color: '#34C759', text: 'Exist' };
  //   if (addressExist === false) return { color: '#FF3B30', text: 'Not exist' };
  //   return null;
  // };
  // const addressStatus = getAddressStatus();

  // const navigateToScan = () => {
  //   navigation.navigate('Scan');
  // };

  return (
    <View style={{ width: '100%' }}>
      {/* Form Fields */}
      <View style={{ marginBottom: 24 }}>
        {/* address */}
        {/* <Controller
          control={control}
          name="address"
          render={({ field: { onChange, onBlur, value } }) => (
            <View 
            style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}
            >
              <View 
                style={{
                  flex: 1,
                  // flexDirection: 'row', // This makes the items display in a row
                  // justifyContent: 'space-around', // Distributes space evenly between items
                  // justifyContent: 'space-between', // Distributes space evenly between items
                  // alignItems: 'center', // Aligns items vertically in the center
                  // padding: 10,
                  // backgroundColor: '#f0f0f0',
                  // width: '100%',
                  // flex: 1
                  flexDirection: 'column'
                }}
              >
                <Input
                  label="Address"
                  placeholder="Place an address"
                  value={value || qrData}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="none"
                  // autoComplete="address-line1" //ayad
                  error={errors.address?.message}
                  // style={{
                  //   width: '80%'
                  // }}
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
              <Button
                  title="Scan"
                  onPress={navigateToScan}
                  style={{
                    // width: '10%',
                    width: 80,
                    height: 40
                  }}
                />
            </View>
          )}
        /> */}
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
              {/* <Input
                label="Method"
                placeholder="Place an price"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="numeric"
                autoCapitalize="none"
                error={errors.price?.message}
              /> */}
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#FFFFFF',
                  marginBottom: 8,
                }}
              >Method</Text>
              <Picker
                selectedValue={value}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                  color: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.2)',
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

              {/* {methodStatus && (
                <Text style={{ 
                  color: methodStatus.color, 
                  fontSize: 12, 
                  marginTop: 4,
                  marginLeft: 4 
                }}>
                  {methodStatus.text}
                </Text>
              )} */}
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
      </View>

      {/* Footer Actions */}
      <View style={{ alignItems: 'center' }}>
        {/* Terms */}
        <Text style={{ 
          color: 'rgba(255, 255, 255, 0.4)', 
          fontSize: 12, 
          textAlign: 'center',
          marginTop: 16,
          paddingHorizontal: 16 
        }}>
          By sending assets, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
} 
