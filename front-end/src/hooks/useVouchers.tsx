import { Voucher } from '@/types/voucher'
import { useState } from 'react'

export const useVouchers = () => {
    const [vouchers, setVouchers] = useState<Voucher | null>(null)

    return { vouchers }
}
