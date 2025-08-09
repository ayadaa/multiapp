import * as yup from 'yup';

/**
 * Wallet schemas using Yup.
 */

export const sendSchema = yup.object({
  address: yup
    .string()
    .min(3, 'Address must be at least 3 characters')
    .required('adress is required'),
  amount: yup
    .string()
    .required('Amount is required'),
});

export type SendFormData = yup.InferType<typeof sendSchema>;
