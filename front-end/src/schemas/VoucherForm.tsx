import { z } from 'zod'

export const VoucherFormSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: 'Name must be at least 2 characters.',
        })
        .regex(/^[a-zA-Z0-9]+$/, {
            message: 'Name can only contain letters and numbers.',
        })
        .refine((name) => name === name.toUpperCase(), {
            message: 'Name must be in uppercase.',
        }),
    discount: z.coerce
        .number({
            invalid_type_error: 'Discount is required and must be a number.',
        })
        .min(1, {
            message: 'Discount must be at least 1.',
        }),
})
