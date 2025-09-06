import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/auth/use-auth';
import { signupSchema, type SignupFormData } from '../../utils/validation/auth-schemas';
import { launchImagePicker, openCamera, uploadImageAsync } from "../../screens/ads/imagePickerHelper";
import { useWallet } from '../../hooks/wallet/use-wallet';

interface SignupFormProps {
  onSuccess?: () => void;
  onNavigateToLogin?: () => void;
  qrData?: any;
}

/**
 * Enhanced signup form component with validation and username availability checking.
 * Uses React Hook Form for form state management and Yup for validation.
 * Integrates with the authentication hook for signup operations.
 */
export function SignupForm({ onSuccess, onNavigateToLogin, qrData }: SignupFormProps) {
  const { signup, isLoading, error, clearAuthError, checkUsername, usernameCheckLoading, usernameAvailable } = useAuth();
  const { checkAddress, addressCheckLoading, addressExist } = useWallet('');
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),
    mode: 'onBlur',
    defaultValues: {
      profilePicture: '',
      referral: '',
      email: '',
      username: '',
      displayName: '',
      password: '',
      confirmPassword: '',
    },
  });

  const watchedUsername = watch('username');

  // Check username availability when it changes
  useEffect(() => {
    if (watchedUsername && watchedUsername.length >= 3) {
      const timeoutId = setTimeout(() => {
        checkUsername(watchedUsername);
      }, 500); // Debounce for 500ms

      return () => clearTimeout(timeoutId);
    }
  }, [watchedUsername, checkUsername]);

  const onSubmit = async (data: SignupFormData) => {
    clearAuthError();

    const result = await signup(data);

    if (result.success) {
      reset();
      onSuccess?.();
    }
  };

  const getUsernameStatus = () => {
    if (!watchedUsername || watchedUsername.length < 3) return null;
    if (usernameCheckLoading) return { color: '#007AFF', text: 'Checking...' };
    if (usernameAvailable === true) return { color: '#34C759', text: 'Available' };
    if (usernameAvailable === false) return { color: '#FF3B30', text: 'Taken' };
    return null;
  }
  const usernameStatus = getUsernameStatus();

  const watchedReferral = watch('referral');
  const getReferralStatus = () => {
    if (!watchedReferral || watchedReferral.length < 3) return null;
    if (addressCheckLoading) return { color: '#007AFF', text: 'Checking...' };
    if (addressExist === true) return { color: '#34C759', text: 'Exist' };
    if (addressExist === false) return { color: '#FF3B30', text: 'Not exist' };
    return null;
  }
  const referralStatus = getReferralStatus();
  // Check address availability when it changes
  useEffect(() => {
    if (watchedReferral && watchedReferral.length >= 3) {
      const timeoutId = setTimeout(() => {
        checkAddress(watchedReferral);
      }, 500); // Debounce for 500ms

      return () => clearTimeout(timeoutId);
    }
  }, [watchedReferral, checkAddress]);

  const pickImage = React.useCallback(async (onChange: any) => {
    try {
      const tempImageUri = await launchImagePicker();
      if (!tempImageUri) return;
      const uploadUrl = await uploadImageAsync(tempImageUri, true);
      onChange(uploadUrl);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <View style={{ width: '100%' }}>
      {/* Form Fields */}
      <View style={{ marginBottom: 24 }}>
        {/* profilePicture */}
        <Controller
          control={control}
          name="profilePicture"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.profilePictureContainer}>
              <Text style={styles.profilePictureText}>Make sure to upload your image</Text>
              <TouchableOpacity style={styles.avatarPlaceholder} onPress={() => pickImage(onChange)}>
                {value ? (
                  <Image source={{ uri: value }} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarPlaceholderText}>Pick Image</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        />

        <Controller
          control={control}
          name="referral"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Input
                label="Referral"
                placeholder="Place an referral code"
                value={value || qrData}
                onChangeText={onChange}
                onBlur={onBlur}
                isAddress
                autoCapitalize="none"
                error={errors.referral?.message}
              />
              {referralStatus && (
                <Text style={{
                  color: referralStatus.color,
                  fontSize: 12,
                  marginTop: 4,
                  marginLeft: 4
                }}>
                  {referralStatus.text}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
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
        />

        <Controller
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
        />

        <Controller
          control={control}
          name="displayName"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Input
                label="Display Name"
                placeholder="Choose a display name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                autoComplete="name"
                error={errors.displayName?.message}
              />
            </View>
          )}
        />

        <Controller
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
        />

        <Controller
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
          title="Create Account"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={!isValid || usernameAvailable === false}
          style={{ marginTop: 16 }}
        />
      </View>

      {/* Footer Actions */}
      <View style={{ alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: 'rgba(0, 0, 0, 0.75)', fontSize: 14 }}>
            Already have an account?{' '}
          </Text>
          <Button
            title="Sign In"
            onPress={() => onNavigateToLogin?.()}
            variant="ghost"
            size="small"
          />
        </View>

        {/* Terms */}
        <Text style={{
          color: 'rgba(0, 0, 0, 0.7)',
          fontSize: 12,
          textAlign: 'center',
          marginTop: 16,
          paddingHorizontal: 16
        }}>
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profilePictureContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profilePictureText: {
    fontSize: 12,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
  },
  avatarPlaceholderText: {
    color: "#999",
    fontSize: 12,
    textAlign: "center",
  },
})