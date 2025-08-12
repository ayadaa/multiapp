import * as yup from 'yup';

/**
 * P2P schemas using Yup.
 */
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

export const createP2PRequestSchema = yup.object({
  amount: yup
    .string()
    .required('Amount is required'),
})

export type CreateP2PPaymentFormData = yup.InferType<typeof createP2PPaymentSchema>;
export type CreateP2PRequestFormData = yup.InferType<typeof createP2PRequestSchema>;