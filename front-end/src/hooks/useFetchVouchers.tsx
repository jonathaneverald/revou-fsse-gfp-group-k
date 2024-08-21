import { Voucher } from '@/types/voucher'
import { getToken } from '@/utils/tokenUtils'
import useSWR from 'swr'

interface VouchersResponse {
    data: Voucher[]
    message: string
}

const fetcher = async (url: string): Promise<VouchersResponse> => {
    const token = getToken()
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        throw new Error('Failed to fetch vouchers')
    }

    const data = await response.json()
    return data
}

export const useFetchVouchers = () => {
    const { data, error, isLoading, mutate } = useSWR<VouchersResponse>(
        'http://127.0.0.1:5000/voucher',
        fetcher
    )

    return {
        vouchers: data?.data,
        message: data?.message,
        isLoading,
        isError: error,
        refetch: mutate,
    }
}
