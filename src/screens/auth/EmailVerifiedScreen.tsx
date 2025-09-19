import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Screen } from '../../components/common/Screen';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import i18n from '../../language/i18n';
import * as yup from 'yup';
import { loginSchema, type LoginFormData } from '../../utils/validation/auth-schemas';
import { resendEmailVerifiecation } from '../../services/firebase/auth'
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearUser } from '../../store/slices/auth.slice';

export function EmailVerifiedScreen() {
  const user = useAppSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const loginSchema = yup.object({
    email: yup
      .string()
      .email(i18n.t('pleaseEnterAValidEmailAddress'))
      .required(i18n.t('emailIsRequired')),
    password: yup
      .string()
      .min(6, i18n.t('passwordMustBeAtLeast6Characters'))
      .required(i18n.t('passwordIsRequired')),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: user?.email,
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    // clearAuthError();
    const result = await resendEmailVerifiecation(data);
    if (result.success) {
      reset();
      // onSuccess?.();
    }
    setIsLoading(false);
  }

  const handleLogout = () => {
    dispatch(clearUser());
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 48 }}>
            <Text
              style={{
                fontSize: 32,
                fontWeight: 'bold',
                color: '#000000',
                marginBottom: 8,
              }}
            >
              {i18n.t('verifyEmail')}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: 'rgba(0, 0, 0, 0.75)',
                textAlign: 'center',
                lineHeight: 24,
              }}
            >
              {i18n.t('pleaseVerifyYourEmail')}{'\n'}
              {user?.email}
            </Text>
          </View>
          {/* Form */}
          <View style={{ marginBottom: 32 }}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={i18n.t('password')}
                  placeholder={i18n.t('enterYourPassword')}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  isPassword
                  autoComplete="password"
                  error={errors.password?.message}
                />
              )}
            />
            <Button
              title={i18n.t('resendVerificationLink')}
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              disabled={!isValid}
              style={{ marginTop: 16 }}
            />
          </View>
          {/* Logout Section */}
          <View style={styles.logoutSection}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
              <Text style={styles.logoutText}>{i18n.t('logout')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  logoutSection: {
    marginTop: 30,
    marginHorizontal: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
})