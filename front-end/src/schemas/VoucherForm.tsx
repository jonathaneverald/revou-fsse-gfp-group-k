import { z } from 'zod'

export const VoucherFormSchema = z.object({
    name: z.string().min(2, {
        message: 'Name must be at least 2 characters.',
    }),
    discount: z.coerce
        .number({
            invalid_type_error: 'Discount is required and must be a number.',
        })
        .min(1, {
            message: 'Discount must be at least 1.',
        }),
})
