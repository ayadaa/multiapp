import * as yup from 'yup';
import i18n from '../../language/i18n';

/**
 * Authentication validation schemas using Yup.
 * Provides comprehensive form validation for login, signup, and password reset flows.
 * Ensures data integrity and user-friendly error messages.
 */

export const loginSchema = yup.object({
  email: yup
    .string()
    .email(i18n.t('pleaseEnterAValidEmailAddress'))
    .required(i18n.t('emailIsRequired')),
  password: yup
    .string()
    .min(6, i18n.t('passwordMustBeAtLeast6Characters'))
    .required(i18n.t('passwordIsRequired')),
});

export const signupSchema = yup.object({
  profilePicture: yup
    .string()
    .required(i18n.t('profilePictureIsRequired')),
  referral: yup
    .string()
    .required(i18n.t('referralIsRequired')),
  email: yup
    .string()
    .email(i18n.t('pleaseEnterAValidEmailAddress'))
    .required(i18n.t('emailIsRequired')),
  username: yup
    .string()
    .min(3, i18n.t('usernameMustBeAtLeast3Characters'))
    .max(20, i18n.t('usernameCannotExceed20Characters'))
    .matches(
      /^[a-zA-Z0-9_]+$/,
      i18n.t('usernameCanOnlyContainLettersnumbersAndUnderscores')
    )
    .required(i18n.t('usernameIsRequired')),
  displayName: yup
    .string()
    .required(i18n.t('displayNameIsRequired')),
  password: yup
    .string()
    .min(8, i18n.t('passwordMustBeAtLeast8Characters'))
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      i18n.t('passwordMustContainUppercaseLowercaseNumber')
    )
    .required(i18n.t('passwordIsRequired')),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], i18n.t('passwordsMustMatch'))
    .required(i18n.t('pleaseConfirmYourPassword')),
});

export const updateProfileSchema = yup.object({
  password: yup
    .string()
    .min(8, i18n.t('passwordMustBeAtLeast8Characters'))
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      i18n.t('passwordMustContainUppercaseLowercaseNumber')
    )
    .required(i18n.t('passwordIsRequired')),
  uid: yup
    .string()
    .required('uid is required'),
  profilePicture: yup
    .string()
    .required(i18n.t('profilePictureIsRequired')),
  email: yup
    .string()
    .email(i18n.t('pleaseEnterAValidEmailAddress'))
    .required(i18n.t('emailIsRequired')),
  username: yup
    .string()
    .min(3, i18n.t('usernameMustBeAtLeast3Characters'))
    .max(20, i18n.t('usernameCannotExceed20Characters'))
    .matches(
      /^[a-zA-Z0-9_]+$/,
      i18n.t('usernameCanOnlyContainLettersnumbersAndUnderscores')
    )
    .required(i18n.t('usernameIsRequired')),
  displayName: yup
    .string()
    .required(i18n.t('displayNameIsRequired')),
});

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email(i18n.t('pleaseEnterAValidEmailAddress'))
    .required(i18n.t('emailIsRequired')),
});

export const changePasswordSchema = yup.object({
  currentPassword: yup
    .string()
    .required(i18n.t('currentPasswordIsRequired')),
  newPassword: yup
    .string()
    .min(8, i18n.t('passwordMustBeAtLeast8Characters'))
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      i18n.t('passwordMustContainUppercaseLowercaseNumber')
    )
    .required(i18n.t('newPasswordIsRequired')),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], i18n.t('passwordsMustMatch'))
    .required(i18n.t('pleaseConfirmYourNewPassword')),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
export type SignupFormData = yup.InferType<typeof signupSchema>;
export type UpdateProfileFormData = yup.InferType<typeof updateProfileSchema>;
export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;
export type ChangePasswordFormData = yup.InferType<typeof changePasswordSchema>; 
