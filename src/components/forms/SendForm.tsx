import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
// import { useAuth } from '../../hooks/auth/use-auth';
// import { signupSchema, type SignupFormData } from '../../utils/validation/auth-schemas';

import { useAppSelector } from '../../store/hooks';
import { useUser } from '../../hooks/user/use-user';
import { useWallet } from '../../hooks/wallet/use-wallet';
import { sendSchema, type SendFormData } from '../../utils/validation/wallet-schemas';
import { useNavigation } from '@react-navigation/native';

interface SendFormProps {
  onSuccess?: () => void;
  onNavigateToWallet?: () => void;
  qrData?: any;
}

export function SendForm({ onSuccess, onNavigateToWallet, qrData }: SendFormProps) {
// export function SendForm() {
  const user = useAppSelector((state) => state.auth.user);
  const { sendAssets, checkAddress, addressCheckLoading, addressExist, error, isLoading } = useWallet();
  const [amountCheckLoading, setAmountCheckLoading] = useState<boolean>(false);
  const [amountSufficient, setAmountSufficient] = useState<boolean | null>(null);
  const { User, isLoadingUser, userError, refreshUser } = useUser(user?.uid || '');
  const navigation = useNavigation<any>();
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

  const navigateToScan = () => {
    navigation.navigate('Scan');
  };
  

  // const { signup, isLoading, error, clearAuthError, checkUsername, usernameCheckLoading, usernameAvailable } = useAuth();

  // const {
  //   control,
  //   handleSubmit,
  //   formState: { errors, isValid },
  //   reset,
  //   watch,
  // } = useForm<SignupFormData>({
  //   resolver: yupResolver(signupSchema),
  //   mode: 'onBlur',
  //   defaultValues: {
  //     email: '',
  //     username: '',
  //     password: '',
  //     confirmPassword: '',
  //   },
  // });

  // const watchedUsername = watch('username');

  // // Check username availability when it changes
  // useEffect(() => {
  //   if (watchedUsername && watchedUsername.length >= 3) {
  //     const timeoutId = setTimeout(() => {
  //       checkUsername(watchedUsername);
  //     }, 500); // Debounce for 500ms

  //     return () => clearTimeout(timeoutId);
  //   }
  // }, [watchedUsername, checkUsername]);

  // const onSubmit = async (data: SignupFormData) => {
  //   clearAuthError();
    
  //   const result = await signup(data);
    
  //   if (result.success) {
  //     reset();
  //     onSuccess?.();
  //   }
  // };

  // const getUsernameStatus = () => {
  //   if (!watchedUsername || watchedUsername.length < 3) return null;
  //   if (usernameCheckLoading) return { color: '#007AFF', text: 'Checking...' };
  //   if (usernameAvailable === true) return { color: '#34C759', text: 'Available' };
  //   if (usernameAvailable === false) return { color: '#FF3B30', text: 'Taken' };
  //   return null;
  // };

  // const usernameStatus = getUsernameStatus();

  return (
    <View style={{ width: '100%' }}>
      {/* Form Fields */}
      <View style={{ marginBottom: 24 }}>
        <Controller
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
                {/* <Button
                  title="Scan"
                  onPress={navigateToScan}
                  style={{
                    width: '10%',
                    height: 20
                  }}
                /> */}
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

              {/* {addressStatus && (
                <Text style={{ 
                  color: addressStatus.color, 
                  fontSize: 12, 
                  marginTop: 4,
                  marginLeft: 4 
                }}>
                  {addressStatus.text}
                </Text>
              )} */}
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

        {/* <Controller
          control={control}
          name="amount"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Amount"
              placeholder="Enter an amount"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="numeric"
              autoCapitalize="none"
              // autoComplete="number"
              error={errors.amount?.message}
            />
          )}
        /> */}

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
          title="Send Assets"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={!isValid || addressExist === false || amountSufficient === false}
          style={{ marginTop: 16 }}
        />

        {/* <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email"
              placeholder="Enter your email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={errors.email?.message}
            />
          )}
        /> */}

        {/* <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Input
                label="Username"
                placeholder="Choose a username"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                autoComplete="username"
                error={errors.username?.message}
              />
              {usernameStatus && (
                <Text style={{ 
                  color: usernameStatus.color, 
                  fontSize: 12, 
                  marginTop: 4,
                  marginLeft: 4 
                }}>
                  {usernameStatus.text}
                </Text>
              )}
            </View>
          )}
        /> */}

        {/* <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Password"
              placeholder="Create a password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              isPassword
              autoComplete="new-password"
              error={errors.password?.message}
            />
          )}
        /> */}

        {/* <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              isPassword
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
            />
          )}
        /> */}

        {/* Global Error Message */}
        {/* {error && (
          <View style={{ marginTop: 8 }}>
            <Text style={{ color: '#FF3B30', fontSize: 14, textAlign: 'center' }}>
              {error}
            </Text>
          </View>
        )} */}

        {/* Submit Button */}
        {/* <Button
          title="Create Account"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={!isValid || usernameAvailable === false}
          style={{ marginTop: 16 }}
        /> */}
      </View>

      {/* Footer Actions */}
      <View style={{ alignItems: 'center' }}>
        {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 14 }}>
            Already have an account?{' '}
          </Text>
          <Button
            title="Sign In"
            onPress={() => onNavigateToWallet?.()}
            variant="ghost"
            size="small"
          />
        </View> */}

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