import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useAppSelector } from '../../store/hooks';
import { useUser } from '../../hooks/user/use-user';
import { useP2PAds } from '../../hooks/p2pAd/use-p2pAds';
import { createP2PRequestSchema, type CreateP2PRequestFormData } from '../../utils/validation/p2p-schemas';
import { useNavigation } from '@react-navigation/native';
import type { P2PAd } from '../../types/p2pads';
import { UserProfile } from '../../services/firebase/firestore.service'

interface CreateP2PRequestFormProps {
  onSuccess?: () => void;
  onNavigateToP2PAds?: () => void;
  ad: P2PAd & UserProfile;
}

export function P2PCreateRequestForm({ ad, onSuccess, onNavigateToP2PAds }: CreateP2PRequestFormProps) {
  const user = useAppSelector((state) => state.auth.user);
  const { createP2PRequest, error, isLoading } = useP2PAds();
  const [amountCheckLoading, setAmountCheckLoading] = useState<boolean>(false);
  const [priceCheckLoading, setPriceCheckLoading] = useState<boolean>(false);
  const [amountSufficient, setAmountSufficient] = useState<boolean | null>(null);
  const [balanceSufficient, setPalanceSufficient] = useState<boolean | null>(null);
  const [priceSufficient, setPriceSufficient] = useState<boolean | null>(null);
  const { User, isLoadingUser, userError, refreshUser } = useUser(user?.uid || '');
  const navigation = useNavigation<any>();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<CreateP2PRequestFormData>({
    resolver: yupResolver(createP2PRequestSchema),
    mode: 'onBlur',
    defaultValues: {
      // method: '',
      amount: '',
      // price: '',
    },
  });

  const watchedAmount = watch('amount')
  const checkAmount = (amount: number) => {
    if (!User) return null;
    refreshUser();
    setAmountCheckLoading(true);
    // if ((User?.balance! >= amount) && (amount <= ad.amount)) {
    //   setAmountSufficient(true);
    // }
    if (User?.balance! >= amount) {
      setPalanceSufficient(true);
    }
    if (amount <= ad.amount) {
      setAmountSufficient(true);
    } else {
      setAmountSufficient(false);
      setPalanceSufficient(false);
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
    if (amountSufficient === true) return { color: '#34C759', text: 'Appropriate amount' };
    if (amountSufficient === false) return { color: '#FF3B30', text: 'Inappropriate amount' };
    if (balanceSufficient === false) return { color: '#FF3B30', text: 'Your balance is not enough to send create p2p request' };
    return null;
  };
  const amountStatus = getAmountStatus();

  const onSubmit = async (data: CreateP2PRequestFormData) => {
    // clearAuthError();
    const result = await createP2PRequest(user?.uid || '', ad.id!, (data.amount || 0) as number)
    if (result.success) {
      reset();
      // onSuccess?.();
    }
  };

  return (
    <View style={{ width: '100%' }}>
      {/* Form Fields */}
      <View style={{ marginBottom: 24 }}>
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
          title="Create p2p request"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={!isValid || amountSufficient === false || balanceSufficient == false}
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
          By create p2p request, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </View>
  );
} 
