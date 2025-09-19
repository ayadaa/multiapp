import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Screen } from '../../components/common/Screen';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/auth/use-auth';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../../utils/validation/auth-schemas';
import i18n from '../../language/i18n';
import * as yup from 'yup';
import { useAppSelector } from '../../store/hooks';

/**
 * Forgot Password screen for password reset functionality.
 * Allows users to request a password reset email from Firebase Auth.
 * Includes proper form validation and user feedback.
 */
export function EmailVerifiedScreen() {
  const user = useAppSelector((state) => state.auth.user);
  const navigation = useNavigation<any>();
  const { forgotPassword, isLoading, clearAuthError } = useAuth();
  const [emailSent, setEmailSent] = useState(false);

  const forgotPasswordSchema = yup.object({
    email: yup
      .string()
      .email(i18n.t('pleaseEnterAValidEmailAddress'))
      .required(i18n.t('emailIsRequired')),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    clearAuthError();

    const result = await forgotPassword(data);

    if (result.success) {
      setEmailSent(true);
      Alert.alert(
        i18n.t('resetEmailSent'),
        `${i18n.t('weSentAPasswordResetLinkTo')} ${data.email}. ${i18n.t('pleaseCheckYourEmailAndFollowTheInstructionsToResetYourPassword')}`,
        [
          {
            text: i18n.t('ok'),
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } else {
      Alert.alert(i18n.t('error'), result.error || i18n.t('failedToSendResetEmail'));
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  // if (emailSent) {
  //   return (
  //     <Screen>
  //       <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
  //         <View style={{ alignItems: 'center', marginBottom: 48 }}>
  //           <Text
  //             style={{
  //               fontSize: 32,
  //               fontWeight: 'bold',
  //               color: '#000000',
  //               marginBottom: 8,
  //             }}
  //           >
  //             {i18n.t('checkYourEmail')}
  //           </Text>
  //           <Text
  //             style={{
  //               fontSize: 16,
  //               color: 'rgba(0, 0, 0, 0.75)',
  //               textAlign: 'center',
  //               lineHeight: 24,
  //             }}
  //           >
  //             {i18n.t('weSentAPasswordResetLinkTo')}{'\n'}
  //             {getValues('email')}
  //           </Text>
  //         </View>

  //         <Button
  //           title={i18n.t('backToSignIn')}
  //           onPress={navigateToLogin}
  //           style={{ marginTop: 24 }}
  //         />
  //       </View>
  //     </Screen>
  //   );
  // }

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
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={i18n.t('email')}
                  placeholder={i18n.t('enterYourEmail')}
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

            <Button
              title={i18n.t('sendResetLink')}
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              disabled={!isValid}
              style={{ marginTop: 16 }}
            />
          </View>

          {/* Footer Actions */}
          <View style={{ alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: 'rgba(0, 0, 0, 0.75)', fontSize: 14 }}>
                {i18n.t('rememberYourPassword')}{' '}
              </Text>
              <Button
                title={i18n.t('signIn')}
                onPress={navigateToLogin}
                variant="ghost"
                size="small"
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
} 