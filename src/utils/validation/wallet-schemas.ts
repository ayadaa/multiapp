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

export const createP2PPaymentSchema = yup.object({
  method: yup
    .string()
    .required('Method is required'),
  amount: yup
    .string()
    .required('Amount is required'),
  price: yup
    .string()
    .required('Price is required'),
})

export type SendFormData = yup.InferType<typeof sendSchema>;
export type CreateP2PPaymentFormData = yup.InferType<typeof createP2PPaymentSchema>;
