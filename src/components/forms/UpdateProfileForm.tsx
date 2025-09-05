import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
// import { useAuth } from '../../hooks/auth/use-auth';
import { useUser } from '../../hooks/user/use-user'; //ayad
import { updateProfileSchema, type UpdateProfileFormData } from '../../utils/validation/auth-schemas';
import { launchImagePicker, openCamera, uploadImageAsync } from "../../screens/ads/imagePickerHelper";
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { useAuth } from '../../hooks/auth/use-auth';

interface UpdateProfileProps {
  onSuccess?: () => void;
}

/**
 * Enhanced signup form component with validation and username availability checking.
 * Uses React Hook Form for form state management and Yup for validation.
 * Integrates with the authentication hook for signup operations.
 */
export function UpdateProfileForm({ onSuccess }: UpdateProfileProps) {
  // const { signup, isLoading, error, clearAuthError, checkUsername, usernameCheckLoading, usernameAvailable } = useAuth();
  const { checkUsername, usernameCheckLoading, usernameAvailable } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user);
  const { updateProfile, updateError, updateLoading } = useUser(user?.uid || '');

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<UpdateProfileFormData>({
    resolver: yupResolver(updateProfileSchema),
    mode: 'onBlur',
    defaultValues: {
      profilePicture: '',
      email: '',
      username: '',
      displayName: '',
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

  const onSubmit = async (data: UpdateProfileFormData) => {
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
  };

  const usernameStatus = getUsernameStatus();

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

        {/* Global Error Message */}
        {updateError && (
          <View style={{ marginTop: 8 }}>
            <Text style={{ color: '#FF3B30', fontSize: 14, textAlign: 'center' }}>
              {updateError}
            </Text>
          </View>
        )}

        {/* Submit Button */}
        <Button
          title="Create Account"
          onPress={handleSubmit(onSubmit)}
          loading={updateLoading}
          disabled={!isValid || usernameAvailable === false}
          style={{ marginTop: 16 }}
        />
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