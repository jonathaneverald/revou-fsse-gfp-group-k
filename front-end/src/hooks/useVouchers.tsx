import { VoucherMap } from '@/types/voucher'
import { useState } from 'react'

export const useVouchers = () => {
    const [vouchers, setVouchers] = useState<VoucherMap>({
        'Tech Guru': { type: 'percentage', value: 10, code: 'COFFEE10' },
        'Bean Paradise': { type: 'fixed', value: 5000, code: 'BEAN5000' },
        'Caffeine Central': { type: 'percentage', value: 5, code: 'CAFF5' },
    })

    return { vouchers }
}
